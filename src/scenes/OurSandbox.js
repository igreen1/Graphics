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
  Animations
} from '../VIBAH/VIBAH'

import { CamelFactory } from '../objects/camel'
import { IceCreamFactory } from '../objects/Detroit'

const Sandbox = () => {
  const universe = BigBang()

  // quick test for setup
  const camel = CamelFactory()
  universe.addToUniverse(camel)

  // Yummy :)
  const IceCream = IceCreamFactory()
  universe.addToUniverse(IceCream) // Demonstrating animations can be added after addToUniverse call
  universe.addAnimation(Animations.RotateAboutPoint(IceCream, [3, -1, 0.5], [0, 0, 0.1]))


  // We have to see something!
  const camera = OurCamera([0, 1, -5], [0, 0, 0], [0.5, -0.5, 1, -1, 1, 10])
  universe.addToUniverse(camera)

  const light = OurLight([-2, 0, 10], [1, 1, 1])
  universe.addToUniverse(light)

  universe.addAnimation(Animations.RotateAboutPoint(camel, [0, 0, 0], [0.01, 0.01, 0.01]))

  return universe
}

const OurSandbox = props => {
  const { universe } = Sandbox()
  return <ReactWebGL universe={universe} />
}

export { OurSandbox }
