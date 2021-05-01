import { Our3DObject, OurMesh, Our3DGroup } from '../VIBAH/Our3DObject'
import { Sphere, RegularPolygon, Cylinder, Cone } from '../VIBAH/OurGeometryLibrary'
import { MatrixLibrary } from '../VIBAH/OurMatrix'

const UFOFactory = () => {
  // Define the main body of our ship
  const ShipFactory = () => {
    const saucer = Our3DObject(OurMesh(Sphere(1, 8)), [0.5, 0.5, 0.5])
    saucer.scale(1, 0.2, 1)
    const cockpit = Our3DObject(OurMesh(Sphere(0.5, 8), true), [0.5, 0.7, 1])
    cockpit
      .rotate(0, Math.PI / 2, 0)
      .translate(0, 0.2, 0)
      .scale(1, 0.9, 1)
    const interior = Our3DObject(OurMesh(RegularPolygon(16)), [0, 0, 0.05])
    interior
      .rotate(Math.PI / 2, 0, 0)
      .translate(0, 0.39, 0)
      .scale(0.5, 0.5, 0.5)

    const ship = Our3DGroup([saucer, cockpit, interior])

    return ship
  }

  const ship = ShipFactory()

  const AlienFactory = () => {
    const head = Our3DObject(OurMesh(Sphere(0.1, 8)), [0, 0.8, 0.6])
    head.translate(0, 0.25, 0).scale(1, 1.2, 1)
    const body = Our3DObject(OurMesh(Sphere(0.15, 8)), [0, 0.8, 0.6])
    body.scale(1, 1.5, 1)
    const arm1 = Our3DObject(OurMesh(Cylinder(0.05, 0.2, 8)), [0, 0.8, 0.6])

    const alien = Our3DGroup([head, body])

    return alien
  }

  const alien = AlienFactory()
  alien.translate(0, 0.2, 0)

  // const face = Our3DObject(OurMesh(Sphere(0.5, 5), false), [1.1, 1, 0.1])
  // const mouth = Our3DObject(OurMesh(Sphere(0.1, 5), false), [0.3, 0.3, 0])
  // mouth.scale(1, 0.5, 0.5)

  // const lefteye = EyeFactory()
  // const righteye = EyeFactory()
  // const eyes = Our3DGroup([lefteye, righteye], 'eyes')
  // const head = Our3DGroup([face, mouth, eyes], 'head')

  // const ToeFactory = () => {
  //   const toe1 = Our3DObject(OurMesh(Cylinder(0.2, 2, 8, 8), false), [1.1, 1, 0.1])
  //   const toe2 = Our3DObject(OurMesh(Cylinder(0.2, 2, 8, 8), false), [1.1, 1, 0.1])
  //   const toe3 = Our3DObject(OurMesh(Cylinder(0.2, 2, 8, 8), false), [1.1, 1, 0.1])
  //   toe1.transform(MatrixLibrary.translationMatrix(0.35, 0, 0))
  //   toe3.transform(MatrixLibrary.translationMatrix(-0.35, 0, 0))
  //   return Our3DGroup([toe1, toe2, toe3])
  // }

  // const leftToes = ToeFactory()
  // leftToes.transform(MatrixLibrary.scaleMatrix(0.3, 1, 0.3))

  // const leg1 = Our3DObject(OurMesh(Cylinder(0.2, 3, 8, 8), false), [1.1, 1, 0.1])
  // const legs = Our3DGroup([leg1, leg2])

  // // Orientate everything
  // legs.rotate(0, Math.PI / 4, 0)
  // head.rotate(0, Math.PI / 4, 0)
  // body.rotate(0, Math.PI / 4, 0)
  // leftToes.rotate(0, Math.PI / 4, 0)
  // rightToes.rotate(0, Math.PI / 4, 0)
  // lefteye.rotate(0, 0.3, 0)

  // // Put everything in position
  // leg1.translate(-4, -2, -1)
  // leg2.translate(-5, -2, -1)
  // lefteye.translate(0.42, 1.1, -0.78)
  // righteye.translate(0.2, 1.1, -0.55)
  // leftToes.translate(-2, -2, 1)
  // rightToes.translate(-3, -2, 1)
  // body.translate(-4.5, -1.5, -1)
  // head.translate(-3.2, -1, 0.3)
  // eyes.translate(-0.05, -1, 1.05)
  // mouth.translate(0.3, -0.1, 0.3)

  const UFO = Our3DGroup([ship, alien])

  // UFO.scale(0.8, 0.8, 0.8)
  // UFO.translate(-2, -0.9, -1)

  //Sphinx.rotate(0,-.5,0)
  //Sphinx.translate(0,0,1)

  return UFO
}

export { UFOFactory }
