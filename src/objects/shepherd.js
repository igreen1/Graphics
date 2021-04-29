import { Our3DObject, OurMesh, Our3DGroup } from '../VIBAH/Our3DObject'
import { Cylinder, Sphere, Cone, Lathe } from '../VIBAH/OurGeometryLibrary'
import { MatrixLibrary } from '../VIBAH/OurMatrix'

const ShepherdFactory = () => {
  const head = Our3DObject(OurMesh(Sphere(0.4, 9), false), [1, 1, 0])
  head.transform(MatrixLibrary.translationMatrix(1,1,1))

  const body = Our3DObject(OurMesh(Cone(0.5, 2, 12, 4), false), [1, 1, 1])
  body.transform(MatrixLibrary.translationMatrix(1,-.1,1))

  let leftLeg = Our3DObject(OurMesh(Cylinder(.2, 1.5, 8, 32), false), [1, 1, .1])
  leftLeg.transform(MatrixLibrary.rotationMatrix(Math.PI/2,0,0))
  leftLeg.transform(MatrixLibrary.translationMatrix(.75,-1,1))

  let rightLeg = Our3DObject(OurMesh(Cylinder(.2, 1.5, 8, 32), false), [1, 1, .1])
  rightLeg.transform(MatrixLibrary.rotationMatrix(Math.PI/2,0,0))
  rightLeg.transform(MatrixLibrary.translationMatrix(1.2,-1,1))

  let shirt = Our3DObject(OurMesh(Lathe([[.3,0],[1,2]], 32, 0, Math.PI*2), false), [1,0,0])
  shirt.transform(MatrixLibrary.rotationMatrix(Math.PI/2,0,0))
  shirt.transform(MatrixLibrary.translationMatrix(1,.5,1))

  let arm =  Our3DObject(OurMesh(Cylinder(.2, 1.5, 8, 32), false), [1, 1, .1])
  arm.transform(MatrixLibrary.translationMatrix(.1,-.1,1.1))
  arm.transform(MatrixLibrary.rotationMatrix(0,Math.PI/2,0))


  let staff = Our3DGroup()

  let staffBase = Our3DObject(OurMesh(Cylinder(.1, 3.5, 8, 32), false), [1.21, .63, .13])
  staffBase.transform(MatrixLibrary.rotationMatrix(Math.PI/2,0,0))
  staffBase.transform(MatrixLibrary.translationMatrix(2.2,.8,0))

  let hook1 = Our3DObject(OurMesh(Cylinder(.1, 1, 8, 32), false), [1.21, .63, .13])
  hook1.transform(MatrixLibrary.rotationMatrix(Math.PI/2,Math.PI/4,0))
  hook1.transform(MatrixLibrary.translationMatrix(2.5, 1, 0))

  let hook2 = Our3DObject(OurMesh(Cylinder(.1, .5, 8, 32), false), [1.21, .63, .13])
  hook2.transform(MatrixLibrary.rotationMatrix(Math.PI/2,(3*Math.PI)/4,0))
  hook2.transform(MatrixLibrary.translationMatrix(2.255, .65, 0))

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

  shepherd.transform(MatrixLibrary.scaleMatrix(.2,.2,.2))
  shepherd.transform(MatrixLibrary.translationMatrix(-.5,-1.9,0))

  return shepherd
}


export {ShepherdFactory}
