import { Our3DObject, OurMesh, Our3DGroup } from '../VIBAH/Our3DObject'
import { Sphere, RegularPolygon, Cylinder, Cone } from '../VIBAH/OurGeometryLibrary'

const UFOFactory = () => {
  // Define the main body of our ship
  const ShipFactory = () => {
    const saucer = Our3DObject(OurMesh(Sphere(1.2, 8)), [0.5, 0.5, 0.5])
    saucer.scale(1, 0.25, 1)
    const cockpit = Our3DObject(OurMesh(Sphere(0.5, 8), true), [0.5, 0.7, 1])
    cockpit
      .rotate(0, Math.PI / 2, 0)
      .scale(1, 0.9, 1)
      .translate(0, 0.35, 0)
    const interior = Our3DObject(OurMesh(RegularPolygon(16)), [0, 0, 0.05])
    interior
      .rotate(Math.PI / 2, 0, 0)
      .scale(0.5, 0.5, 0.5)
      .translate(0, 0.25, 0)

    const ship = Our3DGroup([saucer, cockpit, interior])
    return ship
  }

  const ship = ShipFactory()

  const AlienFactory = () => {
    const head = Our3DObject(OurMesh(Sphere(0.1, 8)), [0, 0.8, 0.6])
    head.scale(1, 1.2, 1).translate(0, 0.25, 0)

    const body = Our3DObject(OurMesh(Sphere(0.15, 8)), [0, 0.8, 0.6])
    body.scale(1, 1.5, 1)

    const armLeft = Our3DObject(OurMesh(Cylinder(0.04, 0.3, 6)), [0, 0.8, 0.6], 'left')
    armLeft.translate(0.11, 0.17, 0)
    const armRight = Our3DObject(OurMesh(Cylinder(0.04, 0.3, 6)), [0, 0.8, 0.6], 'right')
    armRight.translate(-0.11, 0.17, 0)
    const arms = Our3DGroup([armLeft, armRight], 'arms').rotate(0.5, 0, 0)

    const eyeLeft = Our3DObject(OurMesh(Sphere(0.06, 6)), [0, 0, 0], 'left')
    eyeLeft.translate(0.015, 0.26, 0.04)
    const eyeRight = Our3DObject(OurMesh(Sphere(0.06, 6)), [0, 0, 0], 'right')
    eyeRight.translate(-0.015, 0.26, 0.04)
    const eyes = Our3DGroup([eyeLeft, eyeRight], 'eyes')

    const alien = Our3DGroup([head, body, arms, eyes])
    return alien
  }

  const alien = AlienFactory()
  alien.translate(0, 0.25, 0)

  const BeamFactory = () => {
    const outer = Our3DObject(OurMesh(Cone(0.5, 2, 6), true), [0, 0.8, 0.8], 'outer')
    const inner = Our3DObject(OurMesh(Cone(0.4, 2, 6), true), [0.8, 0.0, 0.8], 'inner')

    const beam = Our3DGroup([outer, inner], 'beam')
    return beam
  }

  const beam = BeamFactory()
  beam.translate(0, -0.5, 0)

  const UFO = Our3DGroup([ship, alien, beam])

  return UFO
}

export { UFOFactory }
