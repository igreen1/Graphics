import { useState, useEffect, useRef } from 'react'

import { getGL, initVertexBuffer, initSimpleShaderProgram } from './glsl-utilities'
import { polygon, icosahedron, toRawLineArray, toRawTriangleArray } from './shapes'
import { Our3DObject, OurMesh, Our3DGroup, OurCamera, OurLight } from './Our3DObject'
import { Cone, Cylinder, Extrude, RegularPolygon, Sphere, Tube, Torus } from './GeometryLibrary'
import { Matrix, MatrixLibrary } from './OurMatrix'
import { BigBang, Scene } from './Universe'
import { universeFromJson } from './UniverseFromJson'
import exampleScene from './scenes/exampleScene.json'

// Slightly-leveled-up GLSL shaders.
const VERTEX_SHADER = `
  #ifdef GL_ES
  precision highp float;
  #endif

  attribute vec3 vertexPosition;
  attribute vec3 normals;

  // Note this new additional output.
  attribute vec3 vertexColor;
  varying vec4 finalVertexColor;
  uniform vec3 lightDirection;
  uniform vec3 lightColor;
  uniform mat4 matrix;
  uniform mat4 cameraMatrix;
  uniform mat4 projectionMatrix;

  void main(void) {
    vec4 transformedVertex = cameraMatrix * matrix * vec4(vertexPosition, 1.0);
    vec4 transformedNormal = cameraMatrix * matrix * vec4(vertexPosition, 0.0);

    vec3 lightVector = normalize(lightDirection - transformedVertex.xyz);
    vec3 finalFakeNormal = normalize(transformedVertex.xyz);

    float cosineBetween = dot(lightVector, finalFakeNormal);
    float lightContribution = max(dot(lightVector, finalFakeNormal),0.0);

    vec3 reflection = 2.0 * cosineBetween * finalFakeNormal - lightVector;
    vec3 specularBaseColor = vec3(1.0, 1.0, 1.0);
    float shininess = 5.0;
    float specularContribution = pow(max(dot(reflection, transformedVertex.xyz), 0.0), shininess);
    if (cosineBetween < 0.0) {
      specularBaseColor = vec3(0.0, 0.0, 0.0);
    }

    gl_Position = cameraMatrix * matrix * vec4(vertexPosition, 1.0);
    finalVertexColor = vec4(lightContribution * lightColor * vertexColor + specularContribution * specularBaseColor, 1.0);
  }
`

const FRAGMENT_SHADER = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec4 finalVertexColor;

  void main(void) {
    // We vary the color based on the fragment's z coordinate,
    // which, at this point, ranges from 0 (near) to 1 (far).
    // Note the ".rgb" subselector.
    gl_FragColor = vec4((1.0 - gl_FragCoord.z) * finalVertexColor.rgb, 1.0);
  }
`
const InitWebGL = universe => {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    // Grab the WebGL rendering context.
    const gl = getGL(canvas)
    if (!gl) {
      alert('No WebGL context found...sorry.')

      // No WebGL, no use going on...
      return
    }

    // Set up settings that will not change.  This is not "canned" into a
    // utility function because these settings really can vary from program
    // to program.
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0.0, 0.0, 0.0, 0.0)
    gl.viewport(0, 0, canvas.width, canvas.height)

    // Build the objects to display.
    const objectsToDraw = universe.scene.objectsToDraw

    // Pass the vertices to WebGL.
    objectsToDraw.forEach(objectToDraw => {
      objectToDraw.verticesBuffer = initVertexBuffer(gl, objectToDraw.vertices)
      objectToDraw.normalsBuffer = initVertexBuffer(gl, objectToDraw.normals)
      objectToDraw.colorsBuffer = initVertexBuffer(gl, objectToDraw.colors)
    })

    // Initialize the shaders.
    let abort = false
    const shaderProgram = initSimpleShaderProgram(
      gl,
      VERTEX_SHADER,
      FRAGMENT_SHADER,

      // Very cursory error-checking here...
      shader => {
        abort = true
        alert('Shader problem: ' + gl.getShaderInfoLog(shader))
      },

      // Another simplistic error check: we don't even access the faulty
      // shader program.
      shaderProgram => {
        abort = true
        alert('Could not link shaders...sorry.')
      }
    )

    // If the abort variable is true here, we can't continue.
    if (abort) {
      alert('Fatal errors encountered; we cannot continue.')
      return
    }

    // All done --- tell WebGL to use the shader program from now on.
    gl.useProgram(shaderProgram)

    // Hold on to the important variables within the shaders.
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'vertexPosition')
    gl.enableVertexAttribArray(vertexPosition)

    const vertexColor = gl.getAttribLocation(shaderProgram, 'vertexColor')
    gl.enableVertexAttribArray(vertexColor)

    const normals = gl.getAttribLocation(shaderProgram, 'normals')
    gl.enableVertexAttribArray(normals)

    const matrix = gl.getUniformLocation(shaderProgram, 'matrix')
    const projectionMatrix = gl.getUniformLocation(shaderProgram, 'projectionMatrix')
    const cameraMatrix = gl.getUniformLocation(shaderProgram, 'cameraMatrix')

    const lightDirection = gl.getUniformLocation(shaderProgram, 'lightDirection')
    const lightColor = gl.getUniformLocation(shaderProgram, 'lightColor')

    /*
     * Displays an individual object.
     */
    const drawObject = (object, parentMatrix) => {
      if (!parentMatrix) {
        parentMatrix = Matrix()
      }

      // If object is a group
      if (object.group) {
        object.forEach(element => drawObject(element, parentMatrix.multiply(object.matrix)))
      }

      // Set up the rotation matrix.
      object.transform(Matrix())
      //object.transform(parentMatrix)
      gl.uniformMatrix4fv(matrix, gl.FALSE, object.matrix.toArray())

      // Set normals
      gl.bindBuffer(gl.ARRAY_BUFFER, object.normalsBuffer)
      gl.vertexAttribPointer(normals, 3, gl.FLOAT, false, 0, 0)

      // Set the varying colors.
      gl.bindBuffer(gl.ARRAY_BUFFER, object.colorsBuffer)
      gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0)

      // Set the varying vertex coordinates.
      gl.bindBuffer(gl.ARRAY_BUFFER, object.verticesBuffer)
      gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0)
      gl.drawArrays(object.mesh.isWireframe ? gl.LINES : gl.TRIANGLES, 0, object.vertices.length / 3)
    }

    /*
     * Displays the scene.
     */

    const drawScene = () => {
      // Clear the display.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      // Set up projection matrix
      gl.uniformMatrix4fv(
        projectionMatrix,
        gl.FALSE,
        MatrixLibrary.perspectiveMatrix(0.6, -0.5, 0.5, -0.5, 1, 10).toArray()
      )
      gl.uniformMatrix4fv(cameraMatrix, gl.FALSE, universe.scene.camera.matrix)
      gl.uniform3fv(lightDirection, new Float32Array(universe.scene.light.direction))
      gl.uniform3fv(lightColor, new Float32Array(universe.scene.light.color))

      // Display the objects.
      objectsToDraw.forEach(drawObject)

      // All done.
      gl.flush()
    }

    /*
    Directions say 'static scene'
    /*
     * Animates the scene.
     */
    let previousTimestamp = null

    const FRAMES_PER_SECOND = 60
    const MILLISECONDS_PER_FRAME = 1000 / FRAMES_PER_SECOND

    const advanceScene = timestamp => {
      // Check if the user has turned things off.
      if (!universe.animation || !universe?.animation?.active) {
        return
      }

      // Initialize the timestamp.
      if (!previousTimestamp) {
        previousTimestamp = timestamp
        window.requestAnimationFrame(advanceScene)
        return
      }

      // Check if it's time to advance.
      var progress = timestamp - previousTimestamp
      if (progress < MILLISECONDS_PER_FRAME) {
        // Do nothing if it's too soon.
        window.requestAnimationFrame(advanceScene)
        return
      }

      // All clear.
      universe?.animation?.tick() //not required :)
      drawScene()

      // Request the next frame.
      previousTimestamp = timestamp
      window.requestAnimationFrame(advanceScene)
    }

    // Draw the initial scene.
    drawScene()
  }, [canvasRef])

  return canvasRef
}

const ExampleUniverse = () => {
  let universe = BigBang()
  let star = Our3DObject(
    OurMesh(
      Extrude(
        [
          [0, 1],
          [0.25, 0.3],
          [1, 0.3],
          [0.4, -0.1],
          [0.6, -0.8],
          [0, -0.35],
          [-0.6, -0.8],
          [-0.4, -0.1],
          [-1, 0.3],
          [-0.25, 0.3]
        ],
        [
          [0, 9, 1],
          [2, 1, 3],
          [4, 3, 5],
          [6, 5, 7],
          [8, 7, 9],
          [1, 9, 5],
          [3, 1, 5],
          [7, 5, 9]
        ]
      ),
      false
    ),
    [0, 1.5, 1]
  )
  star.transformVertices(MatrixLibrary.scaleMatrix(0.7, 0.7, 0.7))
  star.transformVertices(MatrixLibrary.rotationMatrix(0.5, 0.5, 0.5))
  star.transformVertices(MatrixLibrary.translationMatrix(0.8, 0.4, 1.9))
  // star.setWireframe(true)
  universe.addToUniverse(star)

  let star2 = Our3DObject(
    OurMesh(
      Extrude(
        [
          [0, 1],
          [0.25, 0.3],
          [1, 0.3],
          [0.4, -0.1],
          [0.6, -0.8],
          [0, -0.35],
          [-0.6, -0.8],
          [-0.4, -0.1],
          [-1, 0.3],
          [-0.25, 0.3]
        ],
        [
          [0, 9, 1],
          [2, 1, 3],
          [4, 3, 5],
          [6, 5, 7],
          [8, 7, 9],
          [1, 9, 5],
          [3, 1, 5],
          [7, 5, 9]
        ]
      ),
      false
    ),
    [1, 0, 0]
  )
  star2.transform(MatrixLibrary.scaleMatrix(0.7, 0.7, 0.7))
  star2.transform(MatrixLibrary.rotationMatrix(0.5, 0.5, 0.5))
  star2.transform(MatrixLibrary.translationMatrix(0.79, 0.4, 1.9))
  universe.addToUniverse(star2)

  let sphere = Our3DObject(OurMesh(Sphere(0.3, 5), false), [0, 0, 0])
  let colorsByVertex = []
  for (let i = 0; i < sphere.mesh.rawVertices.length; i++) {
    colorsByVertex.push([Math.random() * 10, Math.random() * 10, Math.random() * 10])
  }
  sphere.setColors(colorsByVertex)
  sphere.transform(MatrixLibrary.scaleMatrix(2.4, 2.4, 2.4))
  sphere.transform(MatrixLibrary.rotationMatrix(0, 0, 0.5))
  sphere.transform(MatrixLibrary.translationMatrix(-0.6, 0.4, 2))
  universe.addToUniverse(sphere)

  let cone = Our3DObject(OurMesh(Cone(0.5, 1, 8, 8), false), [0.7, 0, 0.8])
  let colorsByFace = []
  for (let i = 0; i < cone.mesh.facesByIndex.length; i++) {
    colorsByFace.push([Math.random() * 5, Math.random() * 5, Math.random() * 5])
  }
  cone.setColors(colorsByFace)
  cone.transform(MatrixLibrary.rotationMatrix(0, -0.3, 3.14))
  cone.transform(MatrixLibrary.translationMatrix(0, -0.7, 2))
  universe.addToUniverse(cone)

  const camera = OurCamera([0, 0, -4.8], [0, 0, 0], [0.6, -0.5, 0.5, -0.5, 1, 10])
  universe.addToUniverse(camera)

  const light = OurLight([0, 0, 7], [1.3, 1.2, 1])
  universe.addToUniverse(light)

  return universe
}

const OurWebGL = props => {
  const { universe } = ExampleUniverse()
  const canvasRef = InitWebGL(universe)

  return (
    <article>
      {/* Yes, still square. */}
      <canvas width="512" height="512" ref={canvasRef}>
        Your favorite update-your-browser message here.
      </canvas>
    </article>
  )
}

export { InitWebGL, OurWebGL }
