// A collection of factories (hence detroit!)
// group work (does not include our individual shapes)

import { Geometries, OurMesh, Our3DGroup, Our3DObject, MatrixLibrary } from '../VIBAH/VIBAH'

// Placed into factories to make ExampleUniverse easier to read
//  moderate loss of load efficiency is worth readability!!
const StarFactory = () => {
  const star = Our3DObject(
    OurMesh(
      Geometries.Extrude(
        [
          [0, 1],
          [0.25, 0.3],
          [1, 0.3],
          [0.4, -0.1],
          [0.6, -0.8],
          [0, -0.35],
          [-0.6, -0.8],
          [-0.4, -0.1],
          [-1, 0.3],
          [-0.25, 0.3]
        ],
        [
          [0, 9, 1],
          [2, 1, 3],
          [4, 3, 5],
          [6, 5, 7],
          [8, 7, 9],
          [1, 9, 5],
          [3, 1, 5],
          [7, 5, 9]
        ]
      ),
      false
    ),
    [0, 1.5, 1]
  )
  star.transform(MatrixLibrary.scaleMatrix(0.7, 0.7, 0.7))
  star.transform(MatrixLibrary.rotationMatrix(0.5, 0.5, 0.5))
  star.transform(MatrixLibrary.translationMatrix(0.8, 0.4, 1.9))

  const star2 = Our3DObject(
    OurMesh(
      Geometries.Extrude(
        [
          [0, 1],
          [0.25, 0.3],
          [1, 0.3],
          [0.4, -0.1],
          [0.6, -0.8],
          [0, -0.35],
          [-0.6, -0.8],
          [-0.4, -0.1],
          [-1, 0.3],
          [-0.25, 0.3]
        ],
        [
          [0, 9, 1],
          [2, 1, 3],
          [4, 3, 5],
          [6, 5, 7],
          [8, 7, 9],
          [1, 9, 5],
          [3, 1, 5],
          [7, 5, 9]
        ]
      ),
      false
    ),
    [1, 0, 0]
  )
  star2.transform(MatrixLibrary.scaleMatrix(0.7, 0.7, 0.7))
  star2.transform(MatrixLibrary.rotationMatrix(0.5, 0.5, 0.5))
  star2.transform(MatrixLibrary.translationMatrix(0.79, 0.4, 1.9))

  const stars = Our3DGroup()
  stars.add(star)
  stars.add(star2)

  return stars
}

const IceCreamFactory = () => {
  const sphere = Our3DObject(OurMesh(Geometries.Sphere(0.3, 5), false), [0, 0, 0])
  sphere.setRandomColors(10)
  sphere.transform(MatrixLibrary.scaleMatrix(2, 2, 2))
  sphere.transform(MatrixLibrary.rotationMatrix(0, 0, 0.5))
  sphere.transform(MatrixLibrary.translationMatrix(3, -0.2, 0.5))

  const cone = Our3DObject(OurMesh(Geometries.Cone(0.5, 1, 8, 8), false), [0.7, 0, 0.8])
  cone.setRandomColors(5, false)
  cone.transform(MatrixLibrary.rotationMatrix(0, -0.3, 3.14))
  cone.transform(MatrixLibrary.translationMatrix(3, -1, 0.5))

  const IceCream = Our3DGroup()
  IceCream.add(cone)
  IceCream.add(sphere)

  return IceCream
}

const PyramidFactory = position => {
  let pyramid = Our3DObject(OurMesh(Geometries.Cone(2.5, 3, 4, 4), false), [1, 1, 0.1])
  pyramid.transform(MatrixLibrary.translationMatrix(...position))
  return pyramid
}


export { PyramidFactory, StarFactory, IceCreamFactory }