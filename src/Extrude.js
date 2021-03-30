import { OurMesh } from './Our3DObject'

/*
ExtrudeGeometry takes a path, which is
an array of 2D coordinates, that is then
extruded by the height to form a 3D geometry.
*/

const ExtrudeGeometry = (path, height = 0.5) => {
  if (path[0] !== path[path.length - 1]) {
    path.push(path[path.length - 1])
  }

  let vertices = (function createVertices(path, height) {
    let vertices = []
    for (let i = 0; i < path.length; i++) {
      vertices.push([...path[i], -height / 2])
      vertices.push([...path[i], height / 2])
    }
    return vertices
  })(path, height)

  let facesByIndex = (function createFacesByIndex() {
    let facesByIndex = []
    for (let i = 0; i < this.vertices; i++) {
      if (i < this.vertices - 2) facesByIndex.push([i, (i + 1) % this.vertices.length, (i + 2) % this.vertices.length])
    }
    return facesByIndex
  })()

  return OurMesh({ vertices, facesByIndex }, false)
}

export { ExtrudeGeometry }
