import { OurMesh } from './Our3DObject'

/*
ExtrudeGeometry takes vertices2D, which is
an array of 2D coordinates ordered counter-clockwise,
and faces2D, or the indexes of the vertices2D grouped
into faces. The 2D shape formed by the vertices is
then extruded by the height to form a 3D geometry.
*/

const Sphere = (radius = .5, radialSegments = 32) => {
    const deltaRotation = 2 * Math.PI / radialSegments
    const deltaRadius = radius / radialSegments
    let currentRadius = radius

    const vertices = []
    for (let i = 0; i <= radialSegments; i++) {
        currentRadius = Math.sqrt(radius**2 - (i*deltaRadius)**2)
        for (let j = 0; j <= radialSegments; j++) {
        vertices.push([currentRadius * Math.sin(j * deltaRotation), currentRadius * Math.cos(j * deltaRotation), i*deltaRadius])
        }
    }

    for (let i = 0; i <= radialSegments; i++) {
        currentRadius = Math.sqrt(radius**2 - (i*deltaRadius)**2)
        for (let j = 0; j <= radialSegments; j++) {
        vertices.push([currentRadius * Math.sin(j * deltaRotation), currentRadius * Math.cos(j * deltaRotation), -i*deltaRadius])
        }
    }

    console.log(vertices)

    const facesByIndex = []

    for (let i = 0; i < (vertices.length - radialSegments - 1); i++) {
      facesByIndex.push([i, i + 1, i + radialSegments + 1])
      facesByIndex.push([i, i + radialSegments + 1, i + radialSegments])
    }

    console.log(facesByIndex)

    return OurMesh({ vertices, facesByIndex }, false)
}

export { Sphere }
