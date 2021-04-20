import { toRawLineArray, toRawTriangleArray } from './shapes'
import { Matrix, MatrixLibrary } from './OurMatrix'
import { Vector } from './vector'

const OurMesh = ({ vertices, facesByIndex }, wireframe = false, faceted = false) => {
  let isWireframe = wireframe
  let isFaceted = faceted

  return {
    facesByIndex,
    get vertices() {
      return isWireframe ? toRawLineArray({ vertices, facesByIndex }) : toRawTriangleArray({ vertices, facesByIndex })
    },
    set vertices(newVertices) {
      vertices = newVertices
    },
    get rawVertices() {
      return vertices
    },
    get isWireframe() {
      return isWireframe
    },
    set isFaceted(newFaceted) {
      isFaceted = newFaceted
    },
    get isFaceted() {
      return isFaceted
    },
    get normals() {
      return isFaceted ? this.facetedNormals : this.smoothNormals
    },

    get facetedNormals() {
      let normalsByIndex = Array(this.rawVertices.length)
      normalsByIndex.fill([])

      facesByIndex.forEach(face => {
        let v1 = Vector(
          this.rawVertices[face[1]][0] - this.rawVertices[face[0]][0],
          this.rawVertices[face[1]][1] - this.rawVertices[face[0]][1],
          this.rawVertices[face[1]][2] - this.rawVertices[face[0]][2]
        )
        let v2 = Vector(
          this.rawVertices[face[2]][0] - this.rawVertices[face[1]][0],
          this.rawVertices[face[2]][1] - this.rawVertices[face[1]][1],
          this.rawVertices[face[2]][2] - this.rawVertices[face[1]][2]
        )
        let v3 = Vector(
          this.rawVertices[face[0]][0] - this.rawVertices[face[2]][0],
          this.rawVertices[face[0]][1] - this.rawVertices[face[2]][1],
          this.rawVertices[face[0]][2] - this.rawVertices[face[2]][2]
        )

        normalsByIndex[face[0]].push(v3.multiply(-1).cross(v1).normalize())
        normalsByIndex[face[1]].push(v1.multiply(-1).cross(v2).normalize())
        normalsByIndex[face[2]].push(v2.multiply(-1).cross(v3).normalize())
      })

      // Do we need to divide each by magnitude?

      return normalsByIndex
    },

    get smoothNormals() {
      let normalsByIndex = Array(this.rawVertices.length)
      normalsByIndex.fill([Vector(0, 0, 0)])

      facesByIndex.forEach(face => {
        let v1 = Vector(
          this.rawVertices[face[1]][0] - this.rawVertices[face[0]][0],
          this.rawVertices[face[1]][1] - this.rawVertices[face[0]][1],
          this.rawVertices[face[1]][2] - this.rawVertices[face[0]][2]
        )
        let v2 = Vector(
          this.rawVertices[face[2]][0] - this.rawVertices[face[1]][0],
          this.rawVertices[face[2]][1] - this.rawVertices[face[1]][1],
          this.rawVertices[face[2]][2] - this.rawVertices[face[1]][2]
        )
        let v3 = Vector(
          this.rawVertices[face[0]][0] - this.rawVertices[face[2]][0],
          this.rawVertices[face[0]][1] - this.rawVertices[face[2]][1],
          this.rawVertices[face[0]][2] - this.rawVertices[face[2]][2]
        )

        normalsByIndex[face[0]][0].add(v3.multiply(-1).cross(v1).normalize())
        normalsByIndex[face[1]][0].add(v1.multiply(-1).cross(v2).normalize())
        normalsByIndex[face[2]][0].add(v2.multiply(-1).cross(v3).normalize())
      })

      // Do we need to divide each by magnitude?

      return normalsByIndex
    },
    setWireframe: newIsWireframe => (isWireframe = newIsWireframe)
  }
}

const Our3DObject = (mesh, colorArray) => {
  let matrix = Matrix()
  return {
    type: Our3DObject,
    mesh,
    get vertices() {
      return mesh.vertices
    },
    get matrix() {
      return matrix
    },
    get color() {
      return this.colors //backwards compatibility
    },
    get colors() {
      let colors = []
      if (Array.isArray(colorArray[0]) && colorArray.length === this.mesh.facesByIndex.length) {
        if (!this.mesh.isWireframe) {
          // if they wish to pass color by face and it is NOT writeframe
          for (let i = 0, maxi = this.vertices.length / 9; i < maxi; i += 1) {
            colors.push(colorArray[i][0])
            colors.push(colorArray[i][1])
            colors.push(colorArray[i][2])
            colors.push(colorArray[i][0])
            colors.push(colorArray[i][1])
            colors.push(colorArray[i][2])
            colors.push(colorArray[i][0])
            colors.push(colorArray[i][1])
            colors.push(colorArray[i][2])
          }
        } else {
          // they wish to pass color by face BUT its a wireframe (ahh)
          // this obviously cant display /that/ well because one line ALWAYS borders two faces
          // so one object needs two colors? huh? so it logically can't display well
          // this is simply added so that .toWireframe doesn't break the entire program
          for (let faceIndex = 0; faceIndex < this.mesh.facesByIndex.length; faceIndex++) {

            for (let i = 0, maxI = this.mesh.facesByIndex[faceIndex].length; i < maxI; i += 1) {
              colors.push(...colorArray[faceIndex])
              colors.push(...colorArray[faceIndex])
            }

          }
        }
      } else if (Array.isArray(colorArray[0]) && colorArray.length === this.mesh.rawVertices.length) {
        // color by vertex 
        if (!this.mesh.isWireframe) {
          this.mesh.facesByIndex.forEach((face) => {
            face.forEach(vertexIndex => {
              colors.push(...colorArray[vertexIndex])
            })
          })
        } else {
          this.mesh.facesByIndex.forEach(face => {
            for (let i = 0, maxI = face.length; i < maxI; i += 1) {
              // “Connect the dots.”
              colors.push(
                ...colorArray[face[i]],
                ...colorArray[face[(i + 1) % maxI]] // Lets us wrap around to 0.
              )
            }
          })
        }
      } else if (Array.isArray(colorArray[0])) {
        // poorly shaped size ; rather than explode, we will choose the first colour
        // this is a CHOICE and this entire else-if can be removed to force errors for poorly sized colour arrays
        for (let i = 0, maxi = this.vertices.length / 3; i < maxi; i += 1) {
          colors = colors.concat(colorArray[0][0], colorArray[0][1], colorArray[0][2])
        }
      } else {
        for (let i = 0, maxi = this.vertices.length / 3; i < maxi; i += 1) {
          colors = colors.concat(colorArray[0], colorArray[1], colorArray[2])
        }
      }

      return colors;
    },
    setWireframe: mesh.setWireframe,
    transform: otherMatrix => (matrix = otherMatrix.multiply(matrix)),
    transformVertices: otherMatrix =>
    (mesh.vertices = mesh.rawVertices.map(vertex =>
      otherMatrix
        .multiply(Matrix([[vertex[0]], [vertex[1]], [vertex[2]], [1]]))
        .toArray()
        .slice(0, -1)
    ))
    // applyLight: lightSources => {

    //   let lambertianCoefficient = new Vector(0,0,0)
    //   lightSources.forEach((light)=>{
    //     this.mesh.vertices.forEach((vertex)=>{

    //     })
    //   })
    //   return [r0, g0, b0, r1, g1, b1, r2, g2, b2]
    // }
  }
  /*
void main(void) {
  // Calculate the normal vector
  vec3 N = normalize(vec3(uNormalMatrix * vec4(aVertexNormal, 1.0)));
  // Normalized light direction
  vec3 L = normalize(uLightDirection);
  // Dot product of the normal product and negative light direction vector
  float lambertTerm = dot(N, -L);
  // Calculating the diffuse color based on the Lambertian reflection model
  vec3 Id = uMaterialDiffuse * uLightDiffuse * lambertTerm;
  vVertexColor = vec4(Id, 1.0);
  // Setting the vertex position
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}
  */
}

const Our3DGroup = (objects = []) => {
  const group = objects
  return {
    get group() {
      return group
    },
    type: Our3DGroup,
    add: object => group.push(object),
    remove: object => group.filter(sceneObject => sceneObject !== object),
    transform: matrix => group.forEach(object => object.transform(matrix))
  }
}

const OurLight = (center, direction) => {
  return {
    type: OurLight,
    direction: new Vector(direction[0], direction[1], direction[2]).normalize(),
    center: center
  }
}

const OurCamera = (center, direction, projectionOptions, projectionType = MatrixLibrary.perspectiveMatrix) => {
  let matrix = Matrix()
    .multiply(MatrixLibrary.translationMatrix(center[0], center[1], center[2]))
    .multiply(MatrixLibrary.rotationMatrix(direction[0], direction[1], direction[2]))

  const projectionMatrix = projectionType(...projectionOptions)

  return {
    type: OurCamera,
    get matrix() {
      return projectionMatrix.multiply(matrix).toArray()
    },
    set matrix(newMatrix) {
      matrix = newMatrix
    },
    translate: (x, y, z) => (matrix = matrix.multiply(MatrixLibrary.translationMatrix(x, y, z))),
    rotate: (x, y, z) => (matrix = matrix.multiply(MatrixLibrary.rotationMatrix(x, y, z))),
    projectionMatrix
  }
}

export { OurMesh, Our3DGroup, Our3DObject, OurLight, OurCamera }
