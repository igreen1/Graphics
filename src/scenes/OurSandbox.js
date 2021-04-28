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

// const SphereFactory = (isColoredByVertex = true) => {
//   const sphere = Our3DObject(OurMesh(Geometries.Sphere(0.3, 5), false), [0, 0, 0]);
//   sphere.setRandomColors(10);
//   sphere.transform(MatrixLibrary.scaleMatrix(2, 2, 2))
//   sphere.transform(MatrixLibrary.rotationMatrix(0, 0, 0.5))
//   sphere.transform(MatrixLibrary.translationMatrix(0, -.2, .5))

//   return sphere;

// }

const CamelFactory = (fidelity = 1) => {
  // Define our body parts
  const head = Our3DObject(OurMesh(Geometries.Sphere(0.5, 5 * fidelity), false), [0, 0, 0])
  const neck = Our3DObject(OurMesh(Geometries.Cylinder(0.2, 1.5, 5 * fidelity, 10 * fidelity), false), [0, 0, 0])
  const body = Our3DObject(OurMesh(Geometries.Cylinder(1, 3.3, 5 * fidelity, 10 * fidelity), false), [0, 0, 0])

  const legFL = Our3DObject(OurMesh(Geometries.Cylinder(0.25, 2, 5 * fidelity, 10 * fidelity), false), [0, 0, 0])
  const legFR = Our3DObject(OurMesh(Geometries.Cylinder(0.25, 2, 5 * fidelity, 10 * fidelity), false), [0, 0, 0])
  const legBL = Our3DObject(OurMesh(Geometries.Cylinder(0.25, 2, 5 * fidelity, 10 * fidelity), false), [0, 0, 0])
  const legBR = Our3DObject(OurMesh(Geometries.Cylinder(0.25, 2, 5 * fidelity, 10 * fidelity), false), [0, 0, 0])
  const legs = Our3DGroup([legFL, legFR, legBL, legBR])

  const hump1 = Our3DObject(OurMesh(Geometries.Sphere(0.8, 5 * fidelity), false), [0, 0, 0])
  const hump2 = Our3DObject(OurMesh(Geometries.Sphere(0.8, 5 * fidelity), false), [0, 0, 0])
  const humps = Our3DGroup([hump1, hump2])

  // Orientate everything
  legs.transform(MatrixLibrary.rotationMatrix((3 * Math.PI) / 2, 0, 0))
  neck.transform(MatrixLibrary.rotationMatrix((3 * Math.PI) / 2, 0, 0))
  body.transform(MatrixLibrary.rotationMatrix(Math.PI / 2, Math.PI / 2, 0))

  // Put everything in position
  head.transform(MatrixLibrary.translationMatrix(-1, 0.2, 0))
  neck.transform(MatrixLibrary.translationMatrix(-1, -1.49, 0))
  body.transform(MatrixLibrary.translationMatrix(-1.2, -2, 0))

  legFL.transform(MatrixLibrary.translationMatrix(-0.9, -4, 0.5))
  legFR.transform(MatrixLibrary.translationMatrix(-0.9, -4, -0.5))
  legBL.transform(MatrixLibrary.translationMatrix(1.7, -4, 0.5))
  legBR.transform(MatrixLibrary.translationMatrix(1.7, -4, -0.5))

  hump1.transform(MatrixLibrary.translationMatrix(0, -1.3, 0))
  hump2.transform(MatrixLibrary.translationMatrix(1.3, -1.3, 0))

  // Apply a camel brown colour
  const Camel = Our3DGroup(
    [head, neck, body, legs, humps].map(shape => {
      shape.setColors([193, 154, 107].map(rgb => rgb / 50))
      return shape
    })
  )

  return Camel
}

const Sandbox = () => {
  const universe = BigBang()

  // quick test for setup
  const camel = CamelFactory()
  universe.addToUniverse(camel)

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
  return ReactWebGL(universe)
}

export { OurSandbox }
