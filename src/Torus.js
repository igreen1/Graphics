import { OurMesh } from './Our3DObject'

const Torus = (radius = 0.5, tube = 0.2, radialSegments = 36, tubularSegments = 36, arc = Math.PI * 2) => {
  radialSegments = Math.floor(radialSegments)
  tubularSegments = Math.floor(tubularSegments)

  const vertices = []

  for (let i = 0; i <= radialSegments; i++) {
    for (let j = 0; j <= tubularSegments; j++) {
      const u = (j / tubularSegments) * arc
      const v = (i / radialSegments) * Math.PI * 2

      vertices.push([
        (radius + tube * Math.cos(v)) * Math.cos(u),
        (radius + tube * Math.cos(v)) * Math.sin(u),
        tube * Math.sin(v)
      ])
    }
  }

  const facesByIndex = []

  for (let i = 1; i <= radialSegments; i++) {
    for (let j = 1; j <= tubularSegments; j++) {
      facesByIndex.push([
        (tubularSegments + 1) * i + j - 1,
        (tubularSegments + 1) * (i - 1) + j - 1,
        (tubularSegments + 1) * i + j
      ])
      facesByIndex.push([
        (tubularSegments + 1) * (i - 1) + j - 1,
        (tubularSegments + 1) * (i - 1) + j,
        (tubularSegments + 1) * i + j
      ])
    }
  }
  return OurMesh({ vertices, facesByIndex }, false)
}

export { Torus }
