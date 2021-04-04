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

    const facesByIndex = []
    // BASE:
    for (let i = 0; i < radialSegments; i++) {
        //facesByIndex.push([0,i+1,(i+2) % radialSegments])
        facesByIndex.push([0,i+1,(i+2)])
    }

    // CONE:
    for (let i = 1; i < (vertices.length - radialSegments - 1); i++) {
      facesByIndex.push([i, i + 1, i + radialSegments + 1])
      facesByIndex.push([i, i + radialSegments + 1, i + radialSegments])
    }

    return { vertices, facesByIndex }
}

export { Cone }
