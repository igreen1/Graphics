// Import our cast
import { sphinx } from '../objects/sphinx'
import { camel, CamelFactory } from '../objects/camel'

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
  Animations,
  Matrix,
  Transformations
} from '../OurLibrary/OurLibrary'

// Alternatively can import as
// import * as LIBRARY from './OurLibrary/OurLibrary

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
  star.transformVertices(MatrixLibrary.scaleMatrix(0.7, 0.7, 0.7))
  star.transformVertices(MatrixLibrary.rotationMatrix(0.5, 0.5, 0.5))
  star.transformVertices(MatrixLibrary.translationMatrix(0.8, 0.4, 1.9))

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
  stars.add(star2);

  return stars;

}

const IceCreamFactory = () => {
  const sphere = Our3DObject(OurMesh(Geometries.Sphere(0.3, 5), false), [0, 0, 0])
  sphere.setRandomColors(10)
  sphere.transform(MatrixLibrary.scaleMatrix(2, 2, 2))
  sphere.transform(MatrixLibrary.rotationMatrix(0, 0, 0.5))
  sphere.transform(MatrixLibrary.translationMatrix(3, -.2, .5))

  const cone = Our3DObject(OurMesh(Geometries.Cone(0.5, 1, 8, 8), false), [0.7, 0, 0.8])
  cone.setRandomColors(5, false)
  cone.transform(MatrixLibrary.rotationMatrix(0, -0.3, 3.14))
  cone.transform(MatrixLibrary.translationMatrix(3, -1, 0.5))

  const IceCream = Our3DGroup()
  IceCream.add(cone)
  IceCream.add(sphere)

  return IceCream
}

const PyramidFactory = (position) => {
  let pyramid = Our3DObject(OurMesh(Geometries.Cone(2.5, 3, 4, 4), false), [1, 1, .1])
  pyramid.transform(MatrixLibrary.translationMatrix(...position))
  return pyramid
}


const ExampleUniverse = () => {
  let universe = BigBang()

  // Yummy :)
  const IceCream = IceCreamFactory()
  universe.addToUniverse(IceCream) // Demonstrating animations can be added after addToUniverse call
  universe.addAnimation(
    Animations.RotateAboutPoint(IceCream, [3, -1, 0.5], [0, 0, 0.1])
  )

  // Pyramids
  const pyramid = PyramidFactory([-.2, -1, -3])
  const pyramid2 = PyramidFactory([-4, -1, -4])
  const pyramid3 = PyramidFactory([4, -1, -4])
  universe.addToUniverse(pyramid)
  universe.addToUniverse(pyramid2)
  universe.addToUniverse(pyramid3)


  // Amazing background :)
  const stars = StarFactory();
  universe.addAnimation(
    Animations.RotateAboutPoint(stars, [0.79, 0.4, 1.9], [0.01, 0.01, 0.01])
  )
  universe.addToUniverse(stars)

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

  // From our cast
  universe.addToUniverse(sphinx)
  const camel1 = CamelFactory()
  camel1.scale(0.25, 0.25, 0.25)
    .transform(MatrixLibrary.translationMatrix(1, -1.5, -1))
  const camel2 = CamelFactory()
  camel2.transform(MatrixLibrary.scaleMatrix(0.25, 0.25, 0.25))
    .transform(MatrixLibrary.translationMatrix(-1, -1.5, -1))
    .transform(Transformations.RotateAboutPoint([-1, -1.5, -1], [0, Math.PI, 0]))
  const camelHerd = Our3DGroup([camel1, camel2])
  universe.addToUniverse(camelHerd)

  // We have to see something!
  const camera = OurCamera([0, 1, -5], [0, 0, 0], [0.5, -0.5, 1, -1, 1, 10])
  universe.addToUniverse(camera)

  const light = OurLight([-2, 0, 10], [11, 9.2, 9])
  universe.addToUniverse(light)

  return universe
}

const ExampleWebGL = props => {
  const { universe } = ExampleUniverse()
  return ReactWebGL(universe)
}

export { ExampleWebGL }