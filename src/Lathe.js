import { OurMesh, Our3DGroup, Our3DObject } from './Our3DObject'


const Lathe = (points, segments = 32, phiStart = 0, phiLength = 2 * Math.PI) => {
  /**
   * Lathe rotates points by phiLength amount, starting at phiStart creating segments number of segments
   * It does this about the z-axis, assuming point is a [radius, height] tuple in array form
   */

  // Lathe is a series of points that described the radius and the height of a line
  // then this line is rotated
  // phiStart says where to start this rotation
  // segements is how many points to put over the entire rotatoins
  // phiLength is how far the rotation goes (2pi means a full circle, pi means 1 half circle)


  const rotationPerSegment = (phiLength / segments);

  const vertices = []
  points.forEach((givenPoint) => {
    for (let i = 0; i <= segments; i++) {
      vertices.push([givenPoint[0] * Math.sin(phiStart + i * rotationPerSegment), givenPoint[0] * Math.cos(phiStart + i * rotationPerSegment), givenPoint[1]])
    }
  })

  const facesByIndex = []
  for (let i = 0; i < (vertices.length - segments -1 ); i++) {
    facesByIndex.push([i, i + 1, i + segments + 1])
    facesByIndex.push([i, i + segments + 1, i + segments])
  }

  return {
    vertices,
    facesByIndex
  }

}

const LatheExampleFromThreeJs = () => {
  let points = [];
  for (let i = 0; i < 11; i++) {
    points.push([Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2]);
  }
  points = points.map((point)=>point.map((coordinate)=>coordinate/20))
  const geometry = OurMesh(Lathe(points, 33))
  console.log(geometry)
  return geometry
}

const CylinderByLathe = () => {
  // Taken from @igreen1's code for Homework 1 (That's me!)
  // Made to more easily test if the Lathe geometry is working
  const CylinderRadius = 0.5;
  const CylinderHeight = 3;

  const radius = (i) => {
    return CylinderRadius
  }
  const height = (i) => {
    return i * CylinderHeight
  }


  const points = [];
  for (let i = 0; i < 20; i++) {
    points.push([radius((i) / 200), height(i / 200)]);
  }

  return (OurMesh(Lathe(points, 32)))
}


export { Lathe, CylinderByLathe, LatheExampleFromThreeJs }