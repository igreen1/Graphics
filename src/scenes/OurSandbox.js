// Import our library
import { ReactWebGL, BigBang, OurMesh, Our3DObject, OurAmbientLight, OurCamera, Animations } from '../VIBAH/VIBAH'

import { Cylinder } from '../VIBAH/OurGeometryLibrary'
import { IceCreamFactory } from '../objects/Detroit'
import { Vineyard } from '../objects/vineyard'
import { CamelFactory } from '../objects/camel'

const Sandbox = () => {
  const universe = BigBang()
  // Attempt at caching geometries

  // with caching and with caching of camel (minor)
  //  45s
  // without caching and without caching of camel
  //  55s
  // that equates to approx 10/(1+1+4+2) = approx. 3s saved per shape cached
  // for more popular shapes like sphere, that could lead to decreases in load time of ~1min

  const caching = false
  if (caching) {
    // < 5 s load time
    let cylinder = OurMesh(Cylinder(0.2, 1.5, 8, 32,), false)
    const leftLeg = Our3DObject(cylinder, [1, 1, 0.1]).translate(1, 1, 1)
    const rightLeg = Our3DObject(cylinder, [1, 1, 0.1]).translate(-1, -1, -1)
    universe.addToUniverse(leftLeg)
    universe.addToUniverse(rightLeg)
  } else {
    // 09.72 s
    const leftLeg = Our3DObject(OurMesh(Cylinder(0.2, 1.5, 8, 32), false), [1, 1, 0.1]).translate(1, 1, 1)
    const rightLeg = Our3DObject(OurMesh(Cylinder(0.2, 1.5, 8, 32), false), [1, 1, 0.1]).translate(-1, -1, -1)
    universe.addToUniverse(leftLeg)
    universe.addToUniverse(rightLeg)
  }

  // previous example
  // Leg lol
  // let leftLeg = Our3DObject(OurMesh(Cylinder(0.2, 1.5, 8, 32), false), [1, 1, 0.1])
  // universe.addToUniverse(leftLeg)

  // Yummy :)
  const IceCream = IceCreamFactory()
  universe.addToUniverse(IceCream) // Demonstrating animations can be added after addToUniverse call
  universe.addAnimation(Animations.RotateAboutPoint(IceCream, [3, -1, 0.5], [0, 0, 0.1]))

  // grapes
  const grapes = Vineyard().Bunch.translate(0.5, -1, -0.2)
  universe.addToUniverse(grapes)

  // camel
  const camel = CamelFactory().scale(0.5, 0.5, 0.5).translate(-2.5, 0, 0)
  universe.addToUniverse(camel)
  


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
