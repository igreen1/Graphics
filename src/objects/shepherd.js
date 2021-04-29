import { Our3DObject, OurMesh, Our3DGroup } from '../OurLibrary/Our3DObject'
import { Cylinder, Sphere, Cone, Lathe } from '../OurLibrary/OurGeometryLibrary'
import { MatrixLibrary } from '../OurLibrary/OurMatrix'

const head = Our3DObject(OurMesh(Sphere(0.4, 9), false), [1, 1, 0])
head.transform(MatrixLibrary.translationMatrix(1,1,1))
const body = Our3DObject(OurMesh(Cone(0.5, 2, 12, 4), false), [1, 1, 1])
body.transform(MatrixLibrary.translationMatrix(1,-.1,1))

let leg1 = Our3DObject(OurMesh(Cylinder(.2, 1.5, 8, 32), false), [1, 1, .1])
leg1.transform(MatrixLibrary.rotationMatrix(Math.PI/2,0,0))
leg1.transform(MatrixLibrary.translationMatrix(.75,-1,1))
let leg2 = Our3DObject(OurMesh(Cylinder(.2, 1.5, 8, 32), false), [1, 1, .1])
leg2.transform(MatrixLibrary.rotationMatrix(Math.PI/2,0,0))
leg2.transform(MatrixLibrary.translationMatrix(1.2,-1,1))
let shirt = Our3DObject(OurMesh(Lathe([[.3,0],[1,2]], 32, 0, Math.PI*2), false), [1,0,0])
shirt.transform(MatrixLibrary.rotationMatrix(Math.PI/2,0,0))
shirt.transform(MatrixLibrary.translationMatrix(1,.5,1))
let arm =  Our3DObject(OurMesh(Cylinder(.2, 1.5, 8, 32), false), [1, 1, .1])
arm.transform(MatrixLibrary.translationMatrix(.1,-.1,1.1))
arm.transform(MatrixLibrary.rotationMatrix(0,Math.PI/2,0))
let staff = Our3DObject(OurMesh(Cylinder(.1, 3.5, 8, 32), false), [1.21, .63, .13])
staff.transform(MatrixLibrary.rotationMatrix(Math.PI/2,0,0))
staff.transform(MatrixLibrary.translationMatrix(2.2,.8,0))
let hook1 = Our3DObject(OurMesh(Cylinder(.1, 1, 8, 32), false), [1.21, .63, .13])
hook1.transform(MatrixLibrary.rotationMatrix(Math.PI/2,Math.PI/4,0))
hook1.transform(MatrixLibrary.translationMatrix(2.5, 1, 0))
let hook2 = Our3DObject(OurMesh(Cylinder(.1, .5, 8, 32), false), [1.21, .63, .13])
hook2.transform(MatrixLibrary.rotationMatrix(Math.PI/2,(3*Math.PI)/4,0))
hook2.transform(MatrixLibrary.translationMatrix(2.255, .65, 0))

let shepherd = Our3DGroup()
shepherd.add(head)
shepherd.add(body)
shepherd.add(leg1)
shepherd.add(leg2)
shepherd.add(shirt)
shepherd.add(arm)
shepherd.add(staff)
shepherd.add(hook1)
shepherd.add(hook2)


shepherd.transform(MatrixLibrary.scaleMatrix(.5,.5,.5))
shepherd.transform(MatrixLibrary.translationMatrix(-1,-.5,0))

export{shepherd}
