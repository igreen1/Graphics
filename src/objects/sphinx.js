import { Our3DObject, OurMesh, Our3DGroup } from '../VIBAH/Our3DObject'
import { Cylinder, Sphere, } from '../VIBAH/OurGeometryLibrary'
import { MatrixLibrary } from '../VIBAH/OurMatrix'
  
  const SphinxFactory = () => {
  
    // Define our body parts
    const body = Our3DObject(OurMesh(Cylinder(.5, 2, 8, 8), false), [1.1, 1, .1], 'body')

    const EyeFactory = () => {
      const socket = Our3DObject(OurMesh(Sphere(1, 2, 8, 8), false), [0,0,0])
      const sclera = Our3DObject(OurMesh(Sphere(1, 2, 8, 8), false), [10,10,10])
      const iris = Our3DObject(OurMesh(Sphere(1, 2, 8, 8), false), [.3,.8,.8])
      socket.transform(MatrixLibrary.scaleMatrix(1.5,1,1))
      sclera.transform(MatrixLibrary.scaleMatrix(1,.7,.7))
      sclera.transform(MatrixLibrary.translationMatrix(-.1,0,0))
      iris.transform(MatrixLibrary.scaleMatrix(.8,.5,.5))
      iris.transform(MatrixLibrary.translationMatrix(-.2,0,0))
      const eye = Our3DGroup([socket, sclera, iris])
      eye.transform(MatrixLibrary.rotationMatrix(0,Math.PI/2,0))
      eye.transform(MatrixLibrary.scaleMatrix(.14,.07,.14))
      return eye
    }

    const face = Our3DObject(OurMesh(Sphere(0.5, 5), false), [1.1, 1, .1])
    const mouth = Our3DObject(OurMesh(Sphere(.1, 5), false), [.3,.3,0])
    mouth.scale(1,.5,.5)
  
    const lefteye = EyeFactory()
    const righteye = EyeFactory()
    const eyes = Our3DGroup([lefteye, righteye], 'eyes')
    const head = Our3DGroup([face, mouth, eyes], 'head')

    const ToeFactory = () => {
      const toe1 = Our3DObject(OurMesh(Cylinder(.2, 2, 8, 8), false), [1.1, 1, .1])
      const toe2 = Our3DObject(OurMesh(Cylinder(.2, 2, 8, 8), false), [1.1, 1, .1])
      const toe3 = Our3DObject(OurMesh(Cylinder(.2, 2, 8, 8), false), [1.1, 1, .1])
      toe1.transform(MatrixLibrary.translationMatrix(.35,0,0))
      toe3.transform(MatrixLibrary.translationMatrix(-.35,0,0))
      return Our3DGroup([toe1, toe2, toe3])
    }

    const leftToes = ToeFactory()
    const rightToes = ToeFactory()
    leftToes.transform(MatrixLibrary.scaleMatrix(.3,1,.3))
    rightToes.transform(MatrixLibrary.scaleMatrix(.3,1,.3))
    const toes = Our3DGroup([leftToes, rightToes])

    const leg1 = Our3DObject(OurMesh(Cylinder(.2, 3, 8, 8), false), [1.1, 1, .1])
    const leg2 = Our3DObject(OurMesh(Cylinder(.2, 3, 8, 8), false), [1.1, 1, .1])
    const legs = Our3DGroup([leg1, leg2])

  
    // Orientate everything
    legs.rotate(0,Math.PI/4,0)
    head.rotate(0, Math.PI/4, 0)
    body.rotate(0,Math.PI/4,0)
    leftToes.rotate(0,Math.PI/4,0)
    rightToes.rotate(0,Math.PI/4,0)
    lefteye.rotate(0,.3,0)

    // Put everything in position
    leg1.translate(-4,-2,-1)
    leg2.translate(-5,-2,-1)
    lefteye.translate(.42,1.1,-.78)
    righteye.translate(.2,1.1,-.55)
    leftToes.translate(-2,-2,1)
    rightToes.translate(-3,-2,1)
    body.translate(-4.5,-1.5,-1)
    head.translate(-3.2, -1, .3)
    eyes.translate(-.05, -1, 1.05)
    mouth.translate(.3, -.1, .3)

    const Sphinx = Our3DGroup([legs,body,head,toes])

    Sphinx.scale(.8,.8,.8)
    Sphinx.translate(-2,-.9,-1)

    //Sphinx.rotate(0,-.5,0)
    //Sphinx.translate(0,0,1)
  
    return Sphinx;
  }

export{SphinxFactory}
