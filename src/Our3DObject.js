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


const RegularPolygon = (numberOfSides) => {
  
  let vertices = function createVertices (numberOfPoints,radius=1) {
    let arr = []
    let increment = (2 * Math.PI) / numberOfPoints
    arr.push([0,0,0])
    for (let i = 0; i < numberOfPoints; i++) {
      arr.push([(Math.cos(i * increment) * radius), (Math.sin(i * increment) * radius), 0 ])
    }
    return arr
  } (numberOfSides)

  let facesByIndex = []
    for (let i = 1; i <= numberOfSides; i++) {
      if (i < numberOfSides) {
        facesByIndex.push([0, i, i+1])
      } else {
        facesByIndex.push([0, i, 1])
      }
    }
    return OurMesh({vertices, facesByIndex}, false)
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

export { RegularPolygon, OurMesh, Our3DGroup, Our3DObject }