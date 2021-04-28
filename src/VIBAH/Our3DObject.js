import { toRawLineArray, toRawTriangleArray, Vector } from './OurUtilities'
import { Matrix, MatrixLibrary } from './OurMatrix'
import { TransformableObject } from './OurTransformations'

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
        let n = new Vector(
          this.rawVertices[face[1]][0] - this.rawVertices[face[0]][0],
          this.rawVertices[face[1]][1] - this.rawVertices[face[0]][1],
          this.rawVertices[face[1]][2] - this.rawVertices[face[0]][2]
        ).cross(
          new Vector(
            this.rawVertices[face[2]][0] - this.rawVertices[face[0]][0],
            this.rawVertices[face[2]][1] - this.rawVertices[face[0]][1],
            this.rawVertices[face[2]][2] - this.rawVertices[face[0]][2]
          )
        )
        normalsByFace.push(n)
      })
      return normalsByFace
    },

    get normalsByRawVertex() {
      // Sum of normals at a vertex
      const normalsByRawVertex = Array(this.rawVertices.length).fill(new Vector(0, 0, 0))
      facesByIndex.forEach(face => {
        let v1 = new Vector(
          this.rawVertices[face[1]][0] - this.rawVertices[face[0]][0],
          this.rawVertices[face[1]][1] - this.rawVertices[face[0]][1],
          this.rawVertices[face[1]][2] - this.rawVertices[face[0]][2]
        )
        let v2 = new Vector(
          this.rawVertices[face[2]][0] - this.rawVertices[face[0]][0],
          this.rawVertices[face[2]][1] - this.rawVertices[face[0]][1],
          this.rawVertices[face[2]][2] - this.rawVertices[face[0]][2]
        )
        let n = v2.cross(v1)
        normalsByRawVertex[face[0]] = normalsByRawVertex[face[0]].add(n)
        normalsByRawVertex[face[1]] = normalsByRawVertex[face[1]].add(n)
        normalsByRawVertex[face[2]] = normalsByRawVertex[face[2]].add(n)
      })
      return normalsByRawVertex
    },

    get facetedNormals() {
      // We could use 'normalsByFace' for this
      // but i think this is moderatey more efficient :)
      // and doesn't require weird mapping from byFace to byVertex
      const normalsByVertex = []
      if (!this.isWireframe) {
        for (let i = 0; i < this.vertices.length; i += 9) {
          let n = new Vector(
            this.vertices[i + 6] - this.vertices[i + 0],
            this.vertices[i + 7] - this.vertices[i + 1],
            this.vertices[i + 8] - this.vertices[i + 2]
          ).cross(
            new Vector(
              this.vertices[i + 3] - this.vertices[i + 0],
              this.vertices[i + 4] - this.vertices[i + 1],
              this.vertices[i + 5] - this.vertices[i + 2]
            )
          )
          normalsByVertex.push(n.x, n.y, n.z) // Corresponding to vertex 0 of this face
          normalsByVertex.push(n.x, n.y, n.z)
          normalsByVertex.push(n.x, n.y, n.z)
        }
      } else {
        for (let i = 0; i < this.vertices.length; i += 18) {
          //         0       2       4 vertices
          // indices 0,1,2 : 6,7,8 : 12 13 14
          // 6 vertices per face (double counted as each line is 2 vertices)
          let n = new Vector(
            this.vertices[i + 6] - this.vertices[i + 0],
            this.vertices[i + 7] - this.vertices[i + 1],
            this.vertices[i + 8] - this.vertices[i + 2]
          ).cross(
            new Vector(
              this.vertices[i + 12] - this.vertices[i + 0],
              this.vertices[i + 13] - this.vertices[i + 1],
              this.vertices[i + 14] - this.vertices[i + 2]
            )
          )
          normalsByVertex.push(
            n.x,
            n.y,
            n.z, // Corresponding to vertex 0 of this face
            n.x,
            n.y,
            n.z,
            n.x,
            n.y,
            n.z,
            n.x,
            n.y,
            n.z,
            n.x,
            n.y,
            n.z,
            n.x,
            n.y,
            n.z
          )
        }
      }
      return normalsByVertex
    },

    get smoothNormals() {
      const normalsByVertex = []
      if (!this.isWireframe) {
        facesByIndex.forEach(face => {
          face.forEach(vertexIndex => {
            normalsByVertex.push(
              this.normalsByRawVertex[vertexIndex].x,
              this.normalsByRawVertex[vertexIndex].y,
              this.normalsByRawVertex[vertexIndex].z
            )
          })
        })
      } else {
        facesByIndex.forEach(face => {
          for (let i = 0, maxI = face.length; i < maxI; i += 1) {
            normalsByVertex.push(...this.normalsByRawVertex[i].elements)
            normalsByVertex.push(...this.normalsByRawVertex[i].elements)
          }
        })
      }
      return normalsByVertex
    },
    setWireframe: function (newIsWireframe) {
      (isWireframe = newIsWireframe)
      return this;
    }
  }
}


const Our3DObject = (mesh, colorArray = [0, 0, 0]) => {
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
    set colors(newColorArray) {
      colorArray = newColorArray
    },
    get colors() {
      let colors = []
      if (Array.isArray(colorArray[0]) && colorArray.length === this.mesh.facesByIndex.length) {
        if (!this.mesh.isWireframe) {
          // if they wish to pass color by face and it is NOT writeframe
          for (let i = 0, maxi = this.vertices.length / 9; i < maxi; i += 1) {
            for (let j = 0; j < 3; j++) {
              colors.push(colorArray[i][0])
              colors.push(colorArray[i][1])
              colors.push(colorArray[i][2])
            }
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
          this.mesh.facesByIndex.forEach(face => {
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

      return colors
    },
    get normals() {
      return mesh.normals
    },
    setColors: function (newColorArray) {
      (colorArray = newColorArray)
      return this;
    },
    setRandomColors: function (n = 5, byVertex = true) {
      colorArray = []
      if (byVertex) {
        for (let i = 0; i < mesh.rawVertices.length; i++) {
          colorArray.push([Math.random() * n, Math.random() * n, Math.random() * n])
        }
      } else {
        for (let i = 0; i < mesh.facesByIndex.length; i++) {
          colorArray.push([Math.random() * n, Math.random() * n, Math.random() * n])
        }
      }
      return this
    },
    setWireframe: function (newIsWireframe) {
      mesh.setWireframe(newIsWireframe)
      return this;
    },
    transform: function (transformMatrix) {
      matrix = transformMatrix.multiply(matrix);
      return this;
    },
    transformVertices: function (otherMatrix) {
      (mesh.vertices = mesh.rawVertices.map(vertex =>
        otherMatrix
          .multiply(Matrix([[vertex[0]], [vertex[1]], [vertex[2]], [1]]))
          .toArray()
          .slice(0, -1)
      ))
      return this
    }
  }
}

const Our3DGroup = (objects = []) => {
  let group = objects
  let matrix = Matrix()
  return {
    ...TransformableObject(),
    get self() { return this },
    get group() {
      return group
    },
    get matrix() {
      return matrix
    },
    type: Our3DGroup,
    add: function (object) {
      group.push(object)
      return this;
    },
    remove: function (object) {
      group = group.filter(sceneObject => sceneObject !== object)
      return this;
    },
    transform: function (transformMatrix) {
      group.forEach(object => object.transform(transformMatrix))
      return this;
    },
    setColors: function (newColorArray) {
      group.forEach(object => object.setColors(newColorArray))
      return this;
    },
    setWireframe: function (newIsWireframe) {
      group.forEach(object => object.setWireframe(newIsWireframe))
      return this
    },
    setColors: function (newColorArray) {
      group.forEach(object => object.setColors(newColorArray))
      return this
    },
    setRandomColors: function (n = 5, byVertex = true) {
      group.forEach(object => object.setRandomColors(n, byVertex))
      return this
    },
    transformVertices: function (transformMatrix) {
      group.forEach(object => object.transformVertices(transformMatrix))
      return this
    }
  }
}

const OurLight = (direction = [0, 0, 0], color = [1, 1, 1]) => {
  return {
    type: OurLight,
    direction: direction,
    color: color
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
    translate: function (x, y, z) {
      (matrix = matrix.multiply(MatrixLibrary.translationMatrix(x, y, z)))
      return this
    },
    rotate: function (x, y, z) {
      (matrix = matrix.multiply(MatrixLibrary.rotationMatrix(x, y, z)))
      return this
    },
    projectionMatrix
  }
}

export { OurMesh, Our3DGroup, Our3DObject, OurLight, OurCamera }
