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
} from '../OurLibrary/OurLibrary'

const SphereFactory = (isColoredByVertex = true) => {
  const sphere = Our3DObject(OurMesh(Geometries.Sphere(0.3, 5), false), [0, 0, 0]);
  sphere.setRandomColors(10);
  sphere.transform(MatrixLibrary.scaleMatrix(2, 2, 2))
  sphere.transform(MatrixLibrary.rotationMatrix(0, 0, 0.5))
  sphere.transform(MatrixLibrary.translationMatrix(0, -.2, .5))

  return sphere;

}

const Sandbox = () =>{
  const universe = BigBang()


  // quick test for setup
  const sphere = SphereFactory()
  universe.addToUniverse(sphere);

  // We have to see something!
  const camera = OurCamera([0, 1, -5], [0, 0, 0], [0.5, -0.5, 1, -1, 1, 10])
  universe.addToUniverse(camera)

  const light = OurLight([-2, 0, 10], [5, 5, 5])
  universe.addToUniverse(light)

  return universe;
}

const OurSandbox = props => {
  const { universe } = Sandbox()
  return ReactWebGL(universe)
}

export { OurSandbox }