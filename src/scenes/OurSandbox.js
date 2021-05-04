// Import our library
import {
  // Geometries,
  ReactWebGL,
  BigBang,
  // OurMesh,
  // Our3DGroup,
  // Our3DObject,
  OurAmbientLight,
  OurCamera
  // MatrixLibrary,
  // Animations
} from '../VIBAH/VIBAH'

// import { Cylinder, Sphere, Cone, Lathe } from '../VIBAH/OurGeometryLibrary'
// import { CamelFactory } from '../objects/camel'
// import { IceCreamFactory } from '../objects/Detroit'
import { Vineyard } from '../objects/vineyard'

const Sandbox = () => {
  const universe = BigBang()

  // let leftLeg = Our3DObject(OurMesh(Cylinder(0.2, 1.5, 8, 32), false), [1, 1, 0.1])
  // universe.addToUniverse(leftLeg)

  // // Yummy :)
  // const IceCream = IceCreamFactory()
  // universe.addToUniverse(IceCream) // Demonstrating animations can be added after addToUniverse call
  // universe.addAnimation(Animations.RotateAboutPoint(IceCream, [3, -1, 0.5], [0, 0, 0.1]))
  //

  const grapes = Vineyard().Bunch
  universe.addToUniverse(grapes)

  // We have to see something!
  const camera = OurCamera([0, 1, -5], [0, 0, 0], [0.5, -0.5, 1, -1, 1, 10])
  universe.addToUniverse(camera)

  const light = OurAmbientLight([1, 1, 1])
  universe.addToUniverse(light)

  return universe
}

const OurSandbox = props => {
  const { universe } = Sandbox()
  return <ReactWebGL universe={universe} />
}

export { OurSandbox }
