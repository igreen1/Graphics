import { Geometries, OurMesh, Our3DGroup, Our3DObject } from '../VIBAH/VIBAH'

const MummyFactory = () => {
  const mummyColor = [3, 3, 3]

  // Define our body parts
  const upperBody = Our3DObject(OurMesh(Geometries.Cylinder(0.5, 1, 8, 8), false), mummyColor, 'upper body')
  const lowerBody = Our3DObject(OurMesh(Geometries.Cone(0.5, 2, 8, 8), false), mummyColor, 'upper body')
  const feet = Our3DObject(OurMesh(Geometries.Cylinder(0.3, 0.5, 8, 8), false), mummyColor, 'feet')
  const body = Our3DGroup([upperBody, lowerBody, feet], 'body')

  const face = Our3DObject(OurMesh(Geometries.Sphere(0.4, 6)), mummyColor, 'face')
  const head = Our3DGroup([face], 'head')

  const mummy = Our3DGroup([body, face], 'mummy')

  const sarcophagus = Our3DObject(
    OurMesh(
      Geometries.Extrude(
        [
          [0.5, 0],
          [-0.5, 0],
          [-1, 3],
          [0, 4],
          [1, 3]
        ],
        [
          [0, 1, 4],
          [1, 2, 4],
          [4, 2, 3]
        ]
      ),
      false
    ),
    [0.8, 0.5, 0.3]
  )

  // Orientate everything
  upperBody.rotate(Math.PI / 2, 0, 0)
  lowerBody.rotate(Math.PI, 0, 0)

  // Put everything in position
  head.translate(0, 0.4, 0)
  lowerBody.translate(0, -2, 0)
  feet.translate(0, -5.5, -0.5)
  sarcophagus.translate(0, -3, -0.5)

  // Rescale everything
  feet.scale(10, 5, 10)

  // Create mummy
  const Mummy = Our3DGroup([mummy, sarcophagus])

  // Reorient group
  Mummy.scale(0.4, 0.4, 0.4)
  Mummy.rotate(-Math.PI / 6, 0, 0)
  Mummy.translate(0, -1, -2.5)

  return Mummy
}

export { MummyFactory }
