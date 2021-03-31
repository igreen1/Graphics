import { RegularPolygon } from './RegularPolygon'

const Cylinder = (radius = 0.5, height = 0.5, radialSegments = 32, heightSegments = 32, closed = true) => {


  const deltaRotation = 2 * Math.PI / radialSegments
  const deltaHeight = height / heightSegments

  const vertices = []
  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j <= radialSegments; j++) {
      vertices.push([radius * Math.sin(j * deltaRotation), radius * Math.cos(j * deltaRotation), i * deltaHeight])
    }
  }

  const facesByIndex = []
  for (let i = 0; i < (vertices.length - radialSegments - 1); i++) {
    facesByIndex.push([i, i + 1, i + radialSegments + 1])
    facesByIndex.push([i, i + radialSegments + 1, i + radialSegments])
  }

  //Add top/bottom if necessary
  if (closed) {
    //Add center of bottom circle

    vertices.push([0, 0, 0])
    for (let i = 0; i < radialSegments; i++) {
      //add bottom circle for cylinder
      facesByIndex.push([i, (i + 1) % radialSegments, vertices.length - 1])
    }

    vertices.push([0, 0, height])
    const vertexOffset = radialSegments*(heightSegments-1)
    for (let i = 0; i < radialSegments; i++) {
      //add top circle for cylinder
      facesByIndex.push([vertexOffset + i, vertexOffset +((i + 1) % radialSegments), vertices.length - 1])
    }

  }

  return {
    vertices,
    facesByIndex
  }
}

export { Cylinder }