import { toRawLineArray, toRawTriangleArray } from './shapes'
import { Matrix } from './OurMatrix'

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
    setWireframe: newIsWireframe => (isWireframe = newIsWireframe)
  }
}

const Our3DObject = (mesh, colorArrayByVertex) => {
  let matrix = Matrix()
  return {
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
    transform: otherMatrix => (matrix = matrix.multiply(otherMatrix)),
    transformVertices: otherMatrix =>
      (mesh.vertices = mesh.rawVertices.map(vertex => {
        console.log(Matrix([[...vertex, 1]]), otherMatrix.elements, Matrix([[...vertex, 1]]).multiply(otherMatrix))
        let temp = Matrix([[...vertex, 1]])
          .multiply(otherMatrix)
          .toArray()
          .slice(0, -1)

        console.log(temp)
        return temp
      }))
  }
}

const Our3DGroup = () => {
  const group = []
  return {
    get group() {
      return group
    },
    add: object => group.push(object),
    remove: object => group.filter(sceneObject => sceneObject !== object),
    transform: matrix => group.forEach(object => object.transform(matrix))
  }
}

export { OurMesh, Our3DGroup, Our3DObject }
