import { OurMesh } from "./Our3DObject"

const RegularPolygon = (numberOfSides) => {

  let vertices = function createVertices(numberOfPoints, radius = 1) {
    let arr = []
    let increment = (2 * Math.PI) / numberOfPoints
    arr.push([0, 0, 0])
    for (let i = 0; i < numberOfPoints; i++) {
      arr.push([(Math.cos(i * increment) * radius), (Math.sin(i * increment) * radius), 0])
    }
    return arr
  }(numberOfSides)

  let facesByIndex = []
  for (let i = 1; i <= numberOfSides; i++) {
    if (i < numberOfSides) {
      facesByIndex.push([0, i, i + 1])
    } else {
      facesByIndex.push([0, i, 1])
    }
  }
  return OurMesh({ vertices, facesByIndex }, false)
}

export { RegularPolygon }