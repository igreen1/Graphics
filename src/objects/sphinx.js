import { Our3DObject, OurMesh, Our3DGroup } from '../VIBAH/Our3DObject'
import { Cylinder, Sphere, } from '../VIBAH/OurGeometryLibrary'
import { MatrixLibrary } from '../VIBAH/OurMatrix'
  
  const SphinxFactory = () => {
  
    // Define our body parts
    const leg1 = Our3DObject(OurMesh(Cylinder(.2, 3, 8, 8), false), [1, 1, .1])
    const leg2 = Our3DObject(OurMesh(Cylinder(.2, 3, 8, 8), false), [1, 1, .1])
    const legs = Our3DGroup([leg1, leg2])
    
    const body = Our3DObject(OurMesh(Cylinder(.5, 2, 8, 8), false), [1, 1, .1])

    const face = Our3DObject(OurMesh(Sphere(0.5, 5), false), [1, 1, .1])
    const mouth = Our3DObject(OurMesh(Sphere(0.1, 5), false), [.3,.3,0])
    const head = Our3DGroup([face, mouth])

  
    // Orientate everything
    legs.transform(MatrixLibrary.rotationMatrix(0,Math.PI/4,0))
    head.transform(MatrixLibrary.rotationMatrix(0, Math.PI/4, 0))
    body.transform(MatrixLibrary.rotationMatrix(0,Math.PI/4,0))

    // Put everything in position
    leg1.transform(MatrixLibrary.translationMatrix(-4,-2,-1))
    leg2.transform(MatrixLibrary.translationMatrix(-5,-2,-1))
    body.transform(MatrixLibrary.translationMatrix(-4.5,-1.5,-1))
    head.transform(MatrixLibrary.translationMatrix(-3.2, -1, .3))
    mouth.transform(MatrixLibrary.translationMatrix(-2.9, -1.1, .7))

    const Sphinx = Our3DGroup([legs,body,head])

    // sphinx.transform(MatrixLibrary.scaleMatrix(.5,.5,.5))
// sphinx.transform(MatrixLibrary.translationMatrix(-2,-1,0))
  
    return Sphinx;
  }

export{SphinxFactory}
