import { OurMesh } from './Our3DObject'

/*
ExtrudeGeometry takes vertices2D, which is
an array of 2D coordinates ordered counter-clockwise,
and faces2D, or the indexes of the vertices2D grouped
into faces. The 2D shape formed by the vertices is
then extruded by the height to form a 3D geometry.
*/

const Cone = (radius = .5, height = 1, radialSegments = 32, heightSegments = 32) => {
    const deltaRotation = 2 * Math.PI / radialSegments
    const deltaHeight = height / heightSegments
    const deltaRadius = deltaHeight * radius / height

    const vertices = []
    vertices.push([0, 0, 0])
    for (let i = 0; i <= heightSegments; i++) {
        for (let j = 0; j <= radialSegments; j++) {
        vertices.push([radius * Math.sin(j * deltaRotation), radius * Math.cos(j * deltaRotation), i * deltaHeight])
        }
        radius -= deltaRadius
    }

    console.log(vertices)

    const facesByIndex = []
    // BASE:
    for (let i = 0; i < radialSegments; i++) {
        //facesByIndex.push([0,i+1,(i+2) % radialSegments])
        facesByIndex.push([0,i+1,(i+2)])
    }

    console.log(facesByIndex)

    // CONE:
    for (let i = 1; i < (vertices.length - radialSegments - 1); i++) {
      facesByIndex.push([i, i + 1, i + radialSegments + 1])
      facesByIndex.push([i, i + radialSegments + 1, i + radialSegments])
    }

    return OurMesh({ vertices, facesByIndex }, false)
}

export { Cone }
