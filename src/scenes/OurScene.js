// Import our cast
import { sphinx } from '../objects/sphinx'

// Import our library
import {
  Geometries,
  ReactWebGL,
  BigBang,
  OurMesh,
  Our3DGroup,
  Our3DObject,
  OurLight,
  OurCamera,
  MatrixLibrary,
  MatrixAnimation
} from '../OurLibrary/OurLibrary'

// Alternatively can import as
// import * as LIBRARY from './OurLibrary/OurLibrary


const ExampleUniverse = () => {
  let universe = BigBang()
  let star = Our3DObject(
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
  star.transformVertices(MatrixLibrary.scaleMatrix(0.7, 0.7, 0.7))
  star.transformVertices(MatrixLibrary.rotationMatrix(0.5, 0.5, 0.5))
  star.transformVertices(MatrixLibrary.translationMatrix(0.8, 0.4, 1.9))

  let star2 = Our3DObject(
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

  let stars = Our3DGroup()
  stars.add(star)
  stars.add(star2);
  console.log(stars)
  universe.addToUniverse(stars)

  let sphere = Our3DObject(OurMesh(Geometries.Sphere(0.3, 5), false), [0, 0, 0])
  sphere.setRandomColors(10)
  sphere.transform(MatrixLibrary.scaleMatrix(2, 2, 2))
  sphere.transform(MatrixLibrary.rotationMatrix(0, 0, 0.5))
  sphere.transform(MatrixLibrary.translationMatrix(3, -.2, .5))

  let cone = Our3DObject(OurMesh(Geometries.Cone(0.5, 1, 8, 8), false), [0.7, 0, 0.8])
  cone.setRandomColors(5, false)
  cone.transform(MatrixLibrary.rotationMatrix(0, -0.3, 3.14))
  cone.transform(MatrixLibrary.translationMatrix(3, -1, 0.5))

  const IceCream = Our3DGroup()
  IceCream.add(cone)
  IceCream.add(sphere)
  universe.addToUniverse(IceCream)

  universe.addAnimation(
    MatrixAnimation(IceCream, MatrixLibrary.rotationMatrix(0, 0, 0.1))
  )

  let pyramid = Our3DObject(OurMesh(Geometries.Cone(2.5, 3, 4, 4), false), [1, 1, .1])
  pyramid.transform(MatrixLibrary.rotationMatrix(0, 0, 0))
  pyramid.transform(MatrixLibrary.translationMatrix(-.2, -1, -3))
  universe.addToUniverse(pyramid)

  let pyramid2 = Our3DObject(OurMesh(Geometries.Cone(2.5, 3, 4, 4), false), [1, 1, .1])
  pyramid2.transform(MatrixLibrary.rotationMatrix(0, 0, 0))
  pyramid2.transform(MatrixLibrary.translationMatrix(-4, -1, -4))
  universe.addToUniverse(pyramid2)

  let pyramid3 = Our3DObject(OurMesh(Geometries.Cone(2.5, 3, 4, 4), false), [1, 1, .1])
  pyramid3.transform(MatrixLibrary.rotationMatrix(0, 0, 0))
  pyramid3.transform(MatrixLibrary.translationMatrix(4, -1, -4))
  universe.addToUniverse(pyramid3)


  let ground = Our3DObject(OurMesh(Geometries.RegularPolygon(4), false), [.5, .4, .2])
  ground.transform(MatrixLibrary.scaleMatrix(15, 15, 1))
  ground.transform(MatrixLibrary.rotationMatrix(-Math.PI / 2, 0, Math.PI / 4))
  ground.transform(MatrixLibrary.translationMatrix(0, -2.5, 0))
  universe.addToUniverse(ground)

  let sky = Our3DObject(OurMesh(Geometries.RegularPolygon(4), false), [2.5, 5, 20.5])
  sky.transform(MatrixLibrary.scaleMatrix(15, 15, 1))
  sky.transform(MatrixLibrary.rotationMatrix(0, 0, Math.PI / 4))
  sky.transform(MatrixLibrary.translationMatrix(0, 0, -3))
  universe.addToUniverse(sky)

  universe.addToUniverse(sphinx)

  const camera = OurCamera([0, 1, -5], [0, 0, 0], [0.5, -0.5, 1, -1, 1, 10])
  universe.addToUniverse(camera)

  const light = OurLight([-2, 0, 10], [11, 9.2, 9])
  universe.addToUniverse(light)

  universe.addAnimation(
    {
      tick: () => {
        star.transform(MatrixLibrary.rotationMatrix(1, 1, 1))
      }
    }
  )

  return universe
}

const ExampleWebGL = props => {
  const { universe } = ExampleUniverse()
  return ReactWebGL(universe)
}

export { ExampleWebGL }