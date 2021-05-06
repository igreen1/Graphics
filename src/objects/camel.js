import { Geometries, OurMesh, Our3DGroup, Our3DObject, MatrixLibrary } from '../VIBAH/VIBAH'

const CamelFactory = (fidelity = 1) => {
  // Define our body parts
  const head = Our3DObject(OurMesh(Geometries.Sphere(0.5, 5 * fidelity), false), [0, 0, 0], "head")
  const neck = Our3DObject(OurMesh(Geometries.Cylinder(0.2, 1.5, 5 * fidelity, 10 * fidelity), false), [0, 0, 0], 'neck')
  const body = Our3DObject(OurMesh(Geometries.Cylinder(1, 3.3, 5 * fidelity, 10 * fidelity), false), [0, 0, 0], 'body')

  const legMesh = OurMesh(Geometries.Cylinder(0.25, 2, 5 * fidelity, 10 * fidelity), false)
  const legFL = Our3DObject(legMesh, [0, 0, 0], 'legFL')
  const legFR = Our3DObject(legMesh, [0, 0, 0], 'legFL')
  const legBL = Our3DObject(legMesh, [0, 0, 0], 'legFL')
  const legBR = Our3DObject(legMesh, [0, 0, 0], 'legFL')
  const legs = Our3DGroup([legFL, legFR, legBL, legBR], 'legs')

  const humpMesh = OurMesh(Geometries.Sphere(0.8, 5 * fidelity), false)
  const hump1 = Our3DObject(humpMesh, [0, 0, 0], 'hump')
  const hump2 = Our3DObject(humpMesh, [0, 0, 0], 'hump')
  const humps = Our3DGroup([hump1, hump2], 'humps')

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
      shape.setColors([193, 154, 107].map(rgb => rgb / 100))
      return shape
    })
  )
  return Camel
}

export { CamelFactory }
