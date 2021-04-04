import { OurMesh } from './Our3DObject'


const Tube = (innerRadius = 0.1, outerRadius = 0.6, height = 0.5, radialSegments = 24, heightSegments = 32) => {


  const deltaRotation = 2 * Math.PI / radialSegments
  const deltaHeight = height / heightSegments

  const vertices = []
  const cylinderVertices = heightSegments * (radialSegments + 1)
  let iter = 0

  // Outer cylinder
  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j <= radialSegments; j++) {
      vertices.push([outerRadius * Math.sin(j * deltaRotation), outerRadius * Math.cos(j * deltaRotation), i * deltaHeight])
      iter++;
    }
  }

  // Inner cylinder
  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j <= radialSegments; j++) {
      vertices.push([innerRadius * Math.sin(j * deltaRotation), innerRadius * Math.cos(j * deltaRotation), i * deltaHeight])
    }
  }

  const facesByIndex = []
  for (let i = 0; i < (cylinderVertices - radialSegments - 1); i++) {
    facesByIndex.push([i, i + 1, i + radialSegments + 1])
    facesByIndex.push([i, i + radialSegments + 1, i + radialSegments])
  }

  for (let i = cylinderVertices; i < (vertices.length - radialSegments - 1); i++) {
    facesByIndex.push([i, i + 1, i + radialSegments + 1])
    facesByIndex.push([i, i + radialSegments + 1, i + radialSegments])
  }


  //Add top/bottom
    for (let j = 0; j <= radialSegments; j++) {
      vertices.push([innerRadius * Math.sin(j * deltaRotation), innerRadius * Math.cos(j * deltaRotation), 0])
    }

    for (let j = 0; j <= radialSegments; j++) {
      vertices.push([outerRadius * Math.sin(j * deltaRotation), outerRadius * Math.cos(j * deltaRotation), 0])
    }

    for (let i = (cylinderVertices * 2); i < (cylinderVertices * 2) + radialSegments + 1; i++) {
      facesByIndex.push([i,i+radialSegments,i+radialSegments+1])
      facesByIndex.push([i,i+1,i+radialSegments+1])
    }

    //Add top/bottom if necessary
    for (let j = 0; j <= radialSegments; j++) {
      vertices.push([innerRadius * Math.sin(j * deltaRotation), innerRadius * Math.cos(j * deltaRotation), height - deltaHeight])
    }

    for (let j = 0; j <= radialSegments; j++) {
      vertices.push([outerRadius * Math.sin(j * deltaRotation), outerRadius * Math.cos(j * deltaRotation), height - deltaHeight])
    }

    for (let i = (cylinderVertices * 2) + (2 * radialSegments); i < (cylinderVertices * 2) + 3 * radialSegments + 3; i++) {
      facesByIndex.push([i,i+radialSegments,i+radialSegments+1])
      facesByIndex.push([i,i+1,i+radialSegments+1])
    }


  return { vertices, facesByIndex }
}

export { Tube }
