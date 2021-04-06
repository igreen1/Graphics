import { useState, useEffect, useRef } from 'react'

import { getGL, initVertexBuffer, initSimpleShaderProgram } from './glsl-utilities'
import { polygon, icosahedron, toRawLineArray, toRawTriangleArray } from './shapes'
import { Our3DObject, OurMesh, Our3DGroup } from './Our3DObject'
import { Cone, Cylinder, Extrude, RegularPolygon, Sphere, Tube, Torus } from './GeometryLibrary'
import { MatrixLibrary } from './OurMatrix'
import { BigBang, Scene } from './Universe'

// Slightly-leveled-up GLSL shaders.
const VERTEX_SHADER = `
  #ifdef GL_ES
  precision highp float;
  #endif

  attribute vec3 vertexPosition;

  // Note this new additional output.
  attribute vec3 vertexColor;
  varying vec4 finalVertexColor;
  uniform mat4 rotationMatrix;

  void main(void) {
    gl_Position = rotationMatrix * vec4(vertexPosition, 1.0);
    finalVertexColor = vec4(vertexColor, 1.0);
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
      //objectToDraw.verticesBuffer = initVertexBuffer(gl, toRawLineArray(icosahedron()))

      if (!objectToDraw.colors) {
        // If we have a single color, we expand that into an array
        // of the same color over and over.
        objectToDraw.colors = []
        for (let i = 0, maxi = objectToDraw.vertices.length / 3; i < maxi; i += 1) {
          objectToDraw.colors = objectToDraw.colors.concat(
            objectToDraw.color.r,
            objectToDraw.color.g,
            objectToDraw.color.b
          )
        }
      }
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
    const rotationMatrix = gl.getUniformLocation(shaderProgram, 'rotationMatrix')

    /*
     * Displays an individual object.
     */
    const drawObject = object => {
      // Set up the rotation matrix.
      //gl.uniformMatrix4fv(rotationMatrix, gl.FALSE, new Float32Array(getRotationMatrix(currentRotation, 0, 1, 0)))
      gl.uniformMatrix4fv(rotationMatrix, gl.FALSE, object.matrix.toArray())

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
  const { universe, setUniverse, addToUniverse, removeFromUniverse } = BigBang()

  // let torus = Our3DObject(OurMesh(Torus(), true), [1.5, 0, 1.5])
  // addToUniverse(torus)

  // let cone = Our3DObject(OurMesh(Cone(), false), [1, 0, 1.5])
  // addToUniverse(cone)

  // let sphere = Our3DObject(OurMesh(Sphere(0.3), false), [2.2, 2, 0.8])
  // sphere.transform(MatrixLibrary.translationMatrix(0.5, 0.5, -0.5))
  // addToUniverse(sphere)

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
  console.log(star.vertices)
  star.transformVertices(MatrixLibrary.translationMatrix(0.5, 0.5, 0.5))
  star.transformVertices(MatrixLibrary.scaleMatrix(0.5, 0.5, 0.5))
  star.transformVertices(MatrixLibrary.rotationMatrix(0.5, 0.5, 0.5))
  console.log(star.vertices)
  addToUniverse(star)

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
    [1, 0, 1]
  )
  star2.transform(MatrixLibrary.translationMatrix(0.5, 0.5, 0.5))
  star2.transform(MatrixLibrary.scaleMatrix(0.5, 0.5, 0.5))
  star2.transform(MatrixLibrary.rotationMatrix(0.5, 0.5, 0.5))
  addToUniverse(star2)

  addToUniverse(Our3DObject(OurMesh(RegularPolygon(10), true), [0, 0, 1.5]))

  return { universe }
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
