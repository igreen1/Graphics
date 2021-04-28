import { Our3DObject, OurMesh, Our3DGroup } from '../VIBAH/Our3DObject'
import { Cylinder, Sphere } from '../VIBAH/OurGeometryLibrary'
import { MatrixLibrary } from '../VIBAH/OurMatrix'

let leg1 = Our3DObject(OurMesh(Cylinder(0.2, 3, 8, 8), false), [1, 1, 0.1])
leg1.transform(MatrixLibrary.rotationMatrix(0, Math.PI / 4, 0))
leg1.transform(MatrixLibrary.translationMatrix(-4, -2, -1))
let leg2 = Our3DObject(OurMesh(Cylinder(0.2, 3, 8, 8), false), [1, 1, 0.1])
leg2.transform(MatrixLibrary.rotationMatrix(0, Math.PI / 4, 0))
leg2.transform(MatrixLibrary.translationMatrix(-5, -2, -1))
let body = Our3DObject(OurMesh(Cylinder(0.5, 2, 8, 8), false), [1, 1, 0.1])
body.transform(MatrixLibrary.rotationMatrix(0, Math.PI / 4, 0))
body.transform(MatrixLibrary.translationMatrix(-4.5, -1.5, -1))
let head = Our3DObject(OurMesh(Sphere(0.5, 5), false), [1, 1, 0.1])
head.transform(MatrixLibrary.rotationMatrix(0, Math.PI / 4, 0))
head.transform(MatrixLibrary.translationMatrix(-3.2, -1, 0.3))
let mouth = Our3DObject(OurMesh(Sphere(0.1, 5), false), [0.3, 0.3, 0])
mouth.transform(MatrixLibrary.rotationMatrix(0, Math.PI / 4, 0))
mouth.transform(MatrixLibrary.translationMatrix(-2.9, -1.1, 0.7))
// let ltoe1 = Our3DObject(OurMesh(Cylinder(.05, 1, 8, 8), false), [1, 1, .1])
// ltoe1.transform(MatrixLibrary.rotationMatrix(0,Math.PI/4,0))
// ltoe1.transform(MatrixLibrary.translationMatrix(-4,-2,-1))

// let leftToes = Our3DGroup([ltoe1])

let sphinx = Our3DGroup()
sphinx.add(leg1)
sphinx.add(leg2)
sphinx.add(body)
sphinx.add(head)
sphinx.add(mouth)

// sphinx.transform(MatrixLibrary.scaleMatrix(.5,.5,.5))
// sphinx.transform(MatrixLibrary.translationMatrix(-2,-1,0))

export { sphinx }
