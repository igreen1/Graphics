import { useState, useEffect, useRef } from 'react'

import { getGL, initVertexBuffer, initSimpleShaderProgram } from './glsl-utilities'
// import { polygon, icosahedron, toRawLineArray, toRawTriangleArray } from './shapes'
// import { Our3DObject, OurMesh, Our3DGroup, OurCamera, OurLight } from './Our3DObject'
// import { Cone, Cylinder, Extrude, RegularPolygon, Sphere, Tube, Torus } from './GeometryLibrary'
import { Matrix, MatrixLibrary } from './OurMatrix'
// import { BigBang, Scene } from './OurUniverse'
// import { universeFromJson } from './UniverseFromJson'
// import exampleScene from './scenes/exampleScene.json'
// import {sphinx} from './objects/sphinx.js'

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

  // uniform vec3 lightsDirections[3];
  // uniform vec3 lightsColor[3];
  uniform vec3 ambientLight;

  uniform mat4 matrix;
  uniform mat4 cameraMatrix;
  uniform mat4 projectionMatrix;

  void main(void) {
    
    // vec4 transformedNormal = cameraMatrix * matrix * vec4(normals, 0.0);
    // vec3 finalFakeNormal = normalize(transformedVertex.xyz);
    // float cosineBetween = dot(lightVector, finalFakeNormal);
    // vec3 reflection = 2.0 * cosineBetween * finalFakeNormal - lightVector;
    // vec3 specularBaseColor = vec3(1.0, 1.0, 1.0);
    // float shininess = 5.0;
    // float specularContribution = pow(max(dot(reflection, transformedVertex.xyz), 0.0), shininess);
    // if (cosineBetween < 0.0) {
    //   specularBaseColor = vec3(0.0, 0.0, 0.0);
    // }
    //finalVertexColor = vec4(lightContribution * lightColor * vertexColor + specularContribution * specularBaseColor, 1.0);
    

    // Directional lights
    // vec3 reflectedLightColor;
    // for(int i = 0; i < 3; i++){
    //   reflectedLightColor += max(dot(lightVector, normalize(normals)),0.0);
    // }

    vec4 transformedVertex = cameraMatrix * matrix * vec4(vertexPosition, 1.0);
    vec4 transformedNormals = cameraMatrix * matrix * vec4(normals, 0.0);
    vec3 lightVector = normalize(lightDirection - transformedVertex.xyz);
    float directionalLightContribution = max(dot(lightVector, normalize(transformedNormals.xyz)), 0.0);
    gl_Position = cameraMatrix * matrix * vec4(vertexPosition, 1.0);
    finalVertexColor = vec4((directionalLightContribution * lightColor + ambientLight) * vertexColor, 1.0);
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
const useInitWebGL = universe => {
  const canvasRef = useRef()

  const [animationWrapper, setanimationWrapper] = useState(null)

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
    // const objectsToDraw = universe.scene.objectsToDraw

    // Pass the vertices to WebGL.
    // objectsToDraw.forEach(objectToDraw => {
    //   objectToDraw.verticesBuffer = initVertexBuffer(gl, objectToDraw.vertices)
    //   objectToDraw.normalsBuffer = initVertexBuffer(gl, objectToDraw.normals)
    //   objectToDraw.colorsBuffer = initVertexBuffer(gl, objectToDraw.colors)
    // })

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

    const ambientLight = gl.getUniformLocation(shaderProgram, 'ambientLight')

    /*
     * Displays an individual object.
     */
    const drawObject = object => {
      if (object.change) {
        object.verticesBuffer = initVertexBuffer(gl, object.vertices)
        object.normalsBuffer = initVertexBuffer(gl, object.normals)
        object.colorsBuffer = initVertexBuffer(gl, object.colors)

        object.change = false
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
        MatrixLibrary.orthographicProjectionMatrix(-1, 1, -1, 1, -1, 1).toArray()
      )
      gl.uniformMatrix4fv(cameraMatrix, gl.FALSE, universe.scene.camera.matrix)
      gl.uniform3fv(lightDirection, new Float32Array(universe.scene.light.direction))
      gl.uniform3fv(lightColor, new Float32Array(universe.scene.light.color))
      gl.uniform3fv(
        ambientLight,
        new Float32Array(universe.scene.ambientLight ? universe.scene.ambientLight.color : [0, 0, 0])
      )

      // Display the objects.
      universe.scene.objectsToDraw.forEach(drawObject)

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
      universe?.tick(progress)
      drawScene()

      // Request the next frame.
      previousTimestamp = timestamp
      window.requestAnimationFrame(advanceScene)
    }

    // Draw the initial scene.
    drawScene()

    setanimationWrapper({
      startAnimation: () => {
        previousTimestamp = null
        window.requestAnimationFrame(advanceScene)
      }
    })
  }, [canvasRef, universe])

  return { canvasRef, animationWrapper }
}

const ReactWebGL = props => {
  const { canvasRef, animationWrapper } = useInitWebGL(props.universe)

  const handleClick = event => {
    props.universe.click()
  }

  // Auto-start animations
  useEffect(() => {
    if (animationWrapper) {
      animationWrapper.startAnimation()
    }
  }, [animationWrapper])

  return (
    <article>
      <canvas width="1024" height="512" ref={canvasRef} onClick={animationWrapper && handleClick}>
        Your favorite update-your-browser message here.
      </canvas>
    </article>
  )
}

export { useInitWebGL, ReactWebGL }
