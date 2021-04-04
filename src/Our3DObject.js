import { toRawLineArray, toRawTriangleArray } from './shapes'

const OurMesh = ({ vertices, facesByIndex }, wireframe = false) => {

  let isWireframe = wireframe

  const Mesh = {
    facesByIndex,
    vertices,
    lines: toRawLineArray(vertices),
    triangles: toRawTriangleArray(vertices),
    isWireframe,
    setWireframe: (wireframe) => isWireframe = wireframe
  }
  return Mesh
}

const Our3DObject = (mesh, colorArrayByVertex, mode) => {
  return {
    mesh,
    vertices: mesh.vertices,
    color: { r: colorArrayByVertex[0], g: colorArrayByVertex[1], b: colorArrayByVertex[2] },
    setWireframe: mesh.setWireframe,
    transform: (matrix) => {
      // TODO
    }
  }
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
