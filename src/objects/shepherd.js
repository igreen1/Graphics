import { Geometries, OurMesh, Our3DGroup, Our3DObject, MatrixLibrary } from '../VIBAH/VIBAH'

const ShepherdFactory = () => {
  const head = Our3DObject(OurMesh(Geometries.Sphere(0.4, 9), false), [1, 1, 0])
  head.transform(MatrixLibrary.translationMatrix(1, 1, 1))

  const body = Our3DObject(OurMesh(Geometries.Cone(0.5, 2, 12, 4), false), [1, 1, 1])
  body.transform(MatrixLibrary.translationMatrix(1, -0.1, 1))

  let leftLeg = Our3DObject(OurMesh(Geometries.Cylinder(0.2, 1.5, 8, 6), false), [1, 1, 0.1])
  leftLeg.transform(MatrixLibrary.rotationMatrix(Math.PI / 2, 0, 0))
  leftLeg.transform(MatrixLibrary.translationMatrix(0.75, -1, 1))

  let rightLeg = Our3DObject(OurMesh(Geometries.Cylinder(0.2, 1.5, 8, 6), false), [1, 1, 0.1])
  rightLeg.transform(MatrixLibrary.rotationMatrix(Math.PI / 2, 0, 0))
  rightLeg.transform(MatrixLibrary.translationMatrix(1.2, -1, 1))

  let shirt = Our3DObject(
    OurMesh(
      Geometries.Lathe(
        [
          [0.3, 0],
          [1, 2]
        ],
        8,
        0,
        Math.PI * 2
      ),
      false
    ),
    [1, 0, 0]
  )
  shirt.transform(MatrixLibrary.rotationMatrix(Math.PI / 2, 0, 0))
  shirt.transform(MatrixLibrary.translationMatrix(1, 0.5, 1))

  let arm = Our3DObject(OurMesh(Geometries.Cylinder(0.2, 1.5, 8, 6), false), [1, 1, 0.1])
  arm.transform(MatrixLibrary.translationMatrix(0.1, -0.1, 1.1))
  arm.transform(MatrixLibrary.rotationMatrix(0, Math.PI / 2, 0))

  let staff = Our3DGroup([], 'staff???')

  let staffBase = Our3DObject(OurMesh(Geometries.Cylinder(0.1, 3.5, 8, 6), false), [1.21, 0.63, 0.13], 'staffBase')
  staffBase.transform(MatrixLibrary.rotationMatrix(Math.PI / 2, 0, 0))
  staffBase.transform(MatrixLibrary.translationMatrix(2.2, 0.8, 0))

  let hook1 = Our3DObject(OurMesh(Geometries.Cylinder(0.1, 1, 8, 6), false), [1.21, 0.63, 0.13])
  hook1.transform(MatrixLibrary.rotationMatrix(Math.PI / 2, Math.PI / 4, 0))
  hook1.transform(MatrixLibrary.translationMatrix(2.5, 1, 0))

  let hook2 = Our3DObject(OurMesh(Geometries.Cylinder(0.1, 0.5, 8, 6), false), [1.21, 0.63, 0.13])
  hook2.transform(MatrixLibrary.rotationMatrix(Math.PI / 2, (3 * Math.PI) / 4, 0))
  hook2.transform(MatrixLibrary.translationMatrix(2.255, 0.65, 0))

  staff.add(staffBase)
  staff.add(hook1)
  staff.add(hook2)

  let shepherd = Our3DGroup()
  shepherd.add(head)
  shepherd.add(body)
  shepherd.add(leftLeg)
  shepherd.add(rightLeg)
  shepherd.add(shirt)
  shepherd.add(arm)
  shepherd.add(staff)

  shepherd.transform(MatrixLibrary.scaleMatrix(0.2, 0.2, 0.2))
  shepherd.transform(MatrixLibrary.translationMatrix(-0.5, -1.9, 0))

  return shepherd
}

export { ShepherdFactory }
