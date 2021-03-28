import {toRawLineArray, toRawTriangleArray} from './shapes'


const OurMesh = ({ vertices, facesByIndex }, wireframe = false) => {

  const result = {
    facesByIndex,
    vertices,
    setWireframeOrSolid: (isWireframe) => OurMesh({vertices, facesByIndex}, isWireframe),
  }
  result.vertices = wireframe ? toRawLineArray(result) : toRawTriangleArray(result)

  return result

}


const Our3DObject = (mesh, colorArrayByVertex=[], mode)=>{
  return {
    mesh,
    mode,
    // colorArrayByVertex, TODO
    vertices:mesh.vertices,
    color: {r:0.0, g:0.0,b:0.5},
    setWireframe: mesh.setWireframe
  }
}

const Our3DGroup = () => {
  const group = []
  return {
    group,
    // mesh, //TODO!!
    add: (object) => group.push(object)
  }
}

export { OurMesh, Our3DGroup, Our3DObject }