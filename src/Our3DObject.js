import { toRawLineArray, toRawTriangleArray } from './shapes'
import { Matrix } from './OurMatrix'
import {Vector} from './vector'

const OurMesh = ({ vertices, facesByIndex }, wireframe = false) => {
  let isWireframe = wireframe

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

    get facetedNormals() {
      let normalsByIndex = Array(this.rawVertices.length)
      normalsByIndex.fill([])

      facesByIndex.forEach((face) => {
        let v1 = Vector(this.rawVertices[face[1]][0] - this.rawVertices[face[0]][0], this.rawVertices[face[1]][1] - this.rawVertices[face[0]][1], this.rawVertices[face[1]][2] - this.rawVertices[face[0]][2])
        let v2 = Vector(this.rawVertices[face[2]][0] - this.rawVertices[face[1]][0], this.rawVertices[face[2]][1] - this.rawVertices[face[1]][1], this.rawVertices[face[2]][2] - this.rawVertices[face[1]][2])
        let v3 = Vector(this.rawVertices[face[0]][0] - this.rawVertices[face[2]][0], this.rawVertices[face[0]][1] - this.rawVertices[face[2]][1], this.rawVertices[face[0]][2] - this.rawVertices[face[2]][2])

        normalsByIndex[face[0]].push(v3.multiply(-1).cross(v1))
        normalsByIndex[face[1]].push(v1.multiply(-1).cross(v2))
        normalsByIndex[face[2]].push(v2.multiply(-1).cross(v3))
      })

      // Do we need to divide each by magnitude?

      return normalsByIndex
    },

    get smoothNormals() {
      let normalsByIndex = Array(this.rawVertices.length)
      normalsByIndex.fill(Vector(0,0,0))

      facesByIndex.forEach((face) => {
        let v1 = Vector(this.rawVertices[face[1]][0] - this.rawVertices[face[0]][0], this.rawVertices[face[1]][1] - this.rawVertices[face[0]][1], this.rawVertices[face[1]][2] - this.rawVertices[face[0]][2])
        let v2 = Vector(this.rawVertices[face[2]][0] - this.rawVertices[face[1]][0], this.rawVertices[face[2]][1] - this.rawVertices[face[1]][1], this.rawVertices[face[2]][2] - this.rawVertices[face[1]][2])
        let v3 = Vector(this.rawVertices[face[0]][0] - this.rawVertices[face[2]][0], this.rawVertices[face[0]][1] - this.rawVertices[face[2]][1], this.rawVertices[face[0]][2] - this.rawVertices[face[2]][2])

        normalsByIndex[face[0]].add(v3.multiply(-1).cross(v1))
        normalsByIndex[face[1]].add(v1.multiply(-1).cross(v2))
        normalsByIndex[face[2]].add(v2.multiply(-1).cross(v3))
      })

      // Do we need to divide each by magnitude?

      return normalsByIndex
    },
    setWireframe: newIsWireframe => (isWireframe = newIsWireframe)
  }
}

const Our3DObject = (mesh, colorArrayByVertex) => {
  let matrix = Matrix()
  return {
    type : Our3DObject,
    mesh,
    get vertices() {
      return mesh.vertices
    },
    get matrix() {
      return matrix
    },
    get color() {
      return { r: colorArrayByVertex[0], g: colorArrayByVertex[1], b: colorArrayByVertex[2] }
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

const OurLight = () => {
  return{
    type : OurLight
  }
}

const OurCamera = () => {
  return{
    type : OurCamera
  }
}

export { OurMesh, Our3DGroup, Our3DObject, OurLight, OurCamera }
