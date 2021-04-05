import { getGL, initVertexBuffer, compileShader, linkShaderProgram, initSimpleShaderProgram } from './glsl-utilities'

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


const Scene = () => {
    const objectsToDraw
    return {
        objectsToDraw,
        add: (object) => objectsToDraw.push(object),
        remove: (object) => objectsToDraw.filter((sceneObject) => sceneObject !== object)
    }
}


const OurWebGL = () => {

    const [universe, setUniverse] = useState(null)
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
        const objectsToDraw = [
            // Our3DObject(RegularPolygon(5), [], gl.TRIANGLES),
            // Our3DObject(
            //   ExtrudeGeometry(
            //     [
            //       [0, 1],
            //       [0.25, 0.3],
            //       [1, 0.3],
            //       [0.4, -0.1],
            //       [0.6, -0.8],
            //       [0, -0.35],
            //       [-0.6, -0.8],
            //       [-0.4, -0.1],
            //       [-1, 0.3],
            //       [-0.25, 0.3]
            //     ],
            //     [
            //       [0, 9, 1],
            //       [2, 1, 3],
            //       [4, 3, 5],
            //       [6, 5, 7],
            //       [8, 7, 9],
            //       [1, 9, 5],
            //       [3, 1, 5],
            //       [7, 5, 9]
            //     ]
            //   ),
            //   [],
            //   gl.TRIANGLES
            // ),
            // Our3DObject(
            //   Sphere(),
            //   [0.7, 0.0, 1.0],
            //   gl.TRIANGLES
            // )

            Our3DObject(Torus(), [0.7, 0.0, 1.0], gl.TRIANGLES)

            // Our3DObject(Tube(), [0.7, 0.0, 1.0], gl.TRIANGLES)
        ]

        // Pass the vertices to WebGL.
        objectsToDraw.forEach(objectToDraw => {
            objectToDraw.verticesBuffer = initVertexBuffer(gl, objectToDraw.vertices)

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
            // Set the varying colors.
            gl.bindBuffer(gl.ARRAY_BUFFER, object.colorsBuffer)
            gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0)

            // Set the varying vertex coordinates.
            gl.bindBuffer(gl.ARRAY_BUFFER, object.verticesBuffer)
            gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0)
            gl.drawArrays(object.mode, 0, object.vertices.length / 3)
        }

        /*
         * Displays the scene.
         */
        let currentRotation = 0.0

        const drawScene = () => {
            // Clear the display.
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

            // Set up the rotation matrix.
            gl.uniformMatrix4fv(rotationMatrix, gl.FALSE, new Float32Array(getRotationMatrix(currentRotation, 1, 1, 0)))

            // Display the objects.
            objectsToDraw.forEach(drawObject)

            // All done.
            gl.flush()
        }

        /*
         * Animates the scene.
         */
        let animationActive = false
        let previousTimestamp = null

        const FRAMES_PER_SECOND = 60
        const MILLISECONDS_PER_FRAME = 1000 / FRAMES_PER_SECOND

        const DEGREES_PER_MILLISECOND = 0.033
        const FULL_CIRCLE = 360.0

        const advanceScene = timestamp => {
            // Check if the user has turned things off.
            if (!animationActive) {
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
            currentRotation += DEGREES_PER_MILLISECOND * progress
            drawScene()

            if (currentRotation >= FULL_CIRCLE) {
                currentRotation -= FULL_CIRCLE
            }

            // Request the next frame.
            previousTimestamp = timestamp
            window.requestAnimationFrame(advanceScene)
        }

        // Draw the initial scene.
        drawScene()

        setUniverse({
            toggleRotation: () => {
                animationActive = !animationActive
                if (animationActive) {
                    previousTimestamp = null
                    window.requestAnimationFrame(advanceScene)
                }
            }
        })
    }, [canvasRef])


}

const ReactRenderer = () => {
    return useEffect(Renderer)
}





export { Scene }