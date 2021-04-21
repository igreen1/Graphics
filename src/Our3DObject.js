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

    get normalsByFace() {
      // Kept purely for its educational value!
      // this will be rolled into 'helperNormals' eventually
      // because calculating separate from 'by vertex' is a waste
      const normalsByFace = []
      // Matches facesByIndex in parallel

      facesByIndex.forEach(face => {
        // p1-p0 x p2-p0 
        let n = (new Vector(
          this.rawVertices[face[1]][0] - this.rawVertices[face[0]][0],
          this.rawVertices[face[1]][1] - this.rawVertices[face[0]][1],
          this.rawVertices[face[1]][2] - this.rawVertices[face[0]][2]
        )).cross(new Vector(
          this.rawVertices[face[2]][0] - this.rawVertices[face[0]][0],
          this.rawVertices[face[2]][1] - this.rawVertices[face[0]][1],
          this.rawVertices[face[2]][2] - this.rawVertices[face[0]][2]
        ))
        normalsByFace.push(n)
      })
      return normalsByFace
    },

    get normalsByRawVertex() {
      // Sum of normals at a vertex
      const normalsByRawVertex = Array(this.rawVertices.length).fill(new Vector(0, 0, 0))
      facesByIndex.forEach(face => {
        let v1 = (new Vector(
          this.rawVertices[face[1]][0] - this.rawVertices[face[0]][0],
          this.rawVertices[face[1]][1] - this.rawVertices[face[0]][1],
          this.rawVertices[face[1]][2] - this.rawVertices[face[0]][2]
        ))
        let v2 = (new Vector(
          this.rawVertices[face[2]][0] - this.rawVertices[face[0]][0],
          this.rawVertices[face[2]][1] - this.rawVertices[face[0]][1],
          this.rawVertices[face[2]][2] - this.rawVertices[face[0]][2]
        ))
        let n = v1.cross(v2)
        (normalsByRawVertex[face[0]]).add(n)
        (normalsByRawVertex[face[1]]).add(n)
        (normalsByRawVertex[face[2]]).add(n)
      })
      return normalsByRawVertex
    },

    get facetedNormals() {
      // We could use 'normalsByFace' for this
      // but i think this is moderatey more efficient :)
      // and doesn't require weird mapping from byFace to byVertex
      const normalsByVertex = []
      if (!wireframe) {
        for (let i = 0; i < this.vertices.length; i += 9) {
          let n = (new Vector(
            this.vertices[i + 3] - this.vertices[i + 0],
            this.vertices[i + 4] - this.vertices[i + 1],
            this.vertices[i + 5] - this.vertices[i + 2]
          )).cross(new Vector(
            this.vertices[i + 6] - this.vertices[i + 0],
            this.vertices[i + 7] - this.vertices[i + 1],
            this.vertices[i + 8] - this.vertices[i + 2]
          ))
          normalsByVertex.push(n.x, n.y, n.z) // Corresponding to vertex 0 of this face
          normalsByVertex.push(n.x, n.y, n.z)
          normalsByVertex.push(n.x, n.y, n.z)
        }
      } else {
        for (let i = 0; i < this.vertices.length; i += 18) {
          //         0       2       4 vertices
          // indices 0,1,2 : 6,7,8 : 12 13 14
          // 6 vertices per face (double counted as each line is 2 vertices)
          let n = (new Vector(
            this.vertices[i + 6] - this.vertices[i + 0],
            this.vertices[i + 7] - this.vertices[i + 1],
            this.vertices[i + 8] - this.vertices[i + 2]
          )).cross(new Vector(
            this.vertices[i + 12] - this.vertices[i + 0],
            this.vertices[i + 13] - this.vertices[i + 1],
            this.vertices[i + 14] - this.vertices[i + 2]
          ))
          normalsByVertex.push(n.x, n.y, n.z,  // Corresponding to vertex 0 of this face
                                n.x, n.y, n.z,
                                n.x, n.y, n.z,
                                n.x, n.y, n.z,
                                n.x, n.y, n.z,
                                n.x, n.y, n.z)
        }
      }
      return normalsByVertex;
    },

    get smoothNormals() {
      const normalsByVertex = []
      if (!wireframe) {
        facesByIndex.forEach(face => {
          face.forEach(vertexIndex => {
            normalsByVertex.push(this.normalsByRawVertex[vertexIndex].x, this.normalsByRawVertex[vertexIndex].y, this.normalsByRawVertex[vertexIndex].z)
          })
        })
      } else {
        facesByIndex.forEach(face => {
          for (let i = 0, maxI = face.length; i < maxI; i += 1) {
            normalsByVertex.push(this.normalsByRawVertex[i].x, this.normalsByRawVertex[i].y, this.normalsByRawVertex[i].z)
            normalsByVertex.push(this.normalsByRawVertex[i+1].x, this.normalsByRawVertex[i+1].y, this.normalsByRawVertex[i+1].z)
          }
        })
      }
      return normalsByVertex
    },
    setWireframe: newIsWireframe => (isWireframe = newIsWireframe)
  }

  // normals by face
  // then if faceted, apply face per each vertex in parallel ds
  // if smooth, apply normal to vertex by adding
  // for lines, faces harder to reconstruct
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
    )),
    applyLight: lightSources => {
      /*
      Rule 1: light sources add up s.t Leq = <r1+r2+r3... , g1+g2+g3, b1+b2+b3>
      Rule 2. material reflects based on its own colours. equivalent to multiplying the lights and materials rgb
              --> clamp light and material colour at 1.0
        -> reflected colour = <r-light*r-material, g-light*g-material, b-light*b-material>
      Rule 3: 
      */
    }
  }
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
