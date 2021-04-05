import { toRawLineArray, toRawTriangleArray } from './shapes'
import { Matrix } from './OurMatrix'

const OurMesh = ({ vertices, facesByIndex }, wireframe = false) => {

  let isWireframe = wireframe

  const Mesh = {
    facesByIndex,
    indexes: vertices,
    vertices: (isWireframe ? toRawLineArray({vertices, facesByIndex}) : toRawTriangleArray({vertices, facesByIndex})),
    isWireframe,
    setWireframe: (wireframe) => isWireframe = wireframe
  }
  return Mesh
}

const Our3DObject = (mesh, colorArrayByVertex) => {

  class ThreeDObject {
    constructor(mesh, colorArrayByVertex) {
      this.mesh = mesh
      this.vertices = mesh.vertices
      this.color = { r: colorArrayByVertex[0], g: colorArrayByVertex[1], b: colorArrayByVertex[2] }
      this.setWireframe = mesh.setWireframe
      this.matrix = Matrix()
    }
    transform = (otherMatrix) => this.matrix = this.matrix.multiply(otherMatrix)
  } 

  return new ThreeDObject(mesh, colorArrayByVertex)
}

const Our3DGroup = () => {
  const group = []
  return {
    group,
    add: object => group.push(object),
    transform: matrix => group.forEach((object) => object.transform(matrix))
  }
}

export { OurMesh, Our3DGroup, Our3DObject }
