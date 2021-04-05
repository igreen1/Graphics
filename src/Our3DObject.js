import { toRawLineArray, toRawTriangleArray } from './shapes'
import { Matrix } from './OurMatrix'

const OurMesh = ({ vertices, facesByIndex }, wireframe = false) => {

  let isWireframe = wireframe

  return {
    facesByIndex,
    indexes: vertices,
    // lines:  toRawLineArray({vertices, facesByIndex}),
    // triangles: toRawTriangleArray({vertices, facesByIndex}),
    // get vertices() {return isWireframe ? this.lines : this.triangles}, //pre-calculating reduces run-time but requires more memory. below is less memory solution
    get vertices() { return (isWireframe ? toRawLineArray({ vertices, facesByIndex }) : toRawTriangleArray({ vertices, facesByIndex })) },
    get isWireframe() { return isWireframe },
    setWireframe: (newIsWireframe) => isWireframe = newIsWireframe
  }
}

const Our3DObject = (mesh, colorArrayByVertex) => {

  let matrix = Matrix()
  return {
    mesh,
    get vertices() { return mesh.vertices },
    get matrix() { return matrix },
    get color() { return { r: colorArrayByVertex[0], g: colorArrayByVertex[1], b: colorArrayByVertex[2] } },
    setWireframe: mesh.setWireframe,
    transform: (otherMatrix) => matrix = matrix.multiply(otherMatrix)
  }
}



const Our3DGroup = () => {
  const group = []
  return {
    get group() { return group },
    add: object => group.push(object),
    transform: matrix => group.forEach((object) => object.transform(matrix))
  }
}

export { OurMesh, Our3DGroup, Our3DObject }
