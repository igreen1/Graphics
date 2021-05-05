import { Cylinder, Sphere } from '../VIBAH/OurGeometryLibrary'
import { Our3DObject, OurMesh, Our3DGroup } from '../VIBAH/Our3DObject'
import { MatrixLibrary } from '../VIBAH/OurMatrix'

const Vineyard = () => {
  const GrapeFactory = () => {
    // Colors
    const grapeColor = [0.63, 0.13, 0.94]
    const stemColor = [0, 1, 0]

    // Stem
    const stem = Our3DObject(OurMesh(Cylinder(0.25, 1.5, 6), false), [...stemColor])
    stem.translate(-1.5, 0, -1.5)
    stem.transform(MatrixLibrary.rotationMatrix(Math.PI / 2, 0, 0))
    stem.scale(0.3, 0.3, 0.3)

    // Top row of grapes
    const toprow_grape1 = Our3DObject(OurMesh(Sphere(0.25, 6), false), [...grapeColor])

    const toprow_grape2 = Our3DObject(OurMesh(Sphere(0.25, 6), false), [...grapeColor])
    toprow_grape2.translate(-0.3, 0, 0)

    const toprow_grape3 = Our3DObject(OurMesh(Sphere(0.25, 6), false), [...grapeColor])
    toprow_grape3.translate(-0.6, 0, 0)

    const toprow_grape4 = Our3DObject(OurMesh(Sphere(0.25, 6), false), [...grapeColor])
    toprow_grape4.translate(-0.9, 0, 0)

    // Second row of grapes
    const secondrow_grape1 = Our3DObject(OurMesh(Sphere(0.25, 6), false), [...grapeColor])
    secondrow_grape1.translate(-0.15, -0.3, 0)

    const secondrow_grape2 = Our3DObject(OurMesh(Sphere(0.25, 6), false), [...grapeColor])
    secondrow_grape2.translate(-0.45, -0.3, 0)

    const secondrow_grape3 = Our3DObject(OurMesh(Sphere(0.25, 6), false), [...grapeColor])
    secondrow_grape3.translate(-0.75, -0.3, 0)

    // Third row of grapes
    const thirdrow_grape1 = Our3DObject(OurMesh(Sphere(0.25, 6), false), [...grapeColor])
    thirdrow_grape1.translate(-0.3, -0.6, 0)

    const thirdrow_grape2 = Our3DObject(OurMesh(Sphere(0.25, 6), false), [...grapeColor])
    thirdrow_grape2.translate(-0.6, -0.6, 0)

    // Final grape
    const final_grape = Our3DObject(OurMesh(Sphere(0.25, 6), false), [...grapeColor])
    final_grape.translate(-0.45, -0.9, 0)

    const GrapeFactory = Our3DGroup([
      stem,
      toprow_grape1,
      toprow_grape2,
      toprow_grape3,
      toprow_grape4,
      secondrow_grape1,
      secondrow_grape2,
      secondrow_grape3,
      thirdrow_grape1,
      thirdrow_grape2,
      final_grape
    ])

    GrapeFactory.transform(MatrixLibrary.scaleMatrix(0.5, 0.5, 0.5))
    GrapeFactory.scale(1, 1, 1)
    return GrapeFactory
  }

  const first_grape_in_bunch = GrapeFactory().translate(0, 0.75, -1)
  const second_grape_in_bunch = GrapeFactory().translate(-1, -0.25, -1)
  const third_grape_in_bunch = GrapeFactory().translate(1, -0.25, -1)

  const first_grape_position = [0, 0.75, -1]
  const second_grape_position = [-1, -0.25, -1]
  const third_grape_position = [1, -0.25, -1]

  const first_grape_tracking_position = [-1.75, 0, -1]
  const second_grape_tracking_position = [-2.5, -1, -1]
  const third_grape_tracking_position = [-1, -1, -1]

  const Bunch = Our3DGroup([first_grape_in_bunch, second_grape_in_bunch, third_grape_in_bunch])
  return {
    Bunch,
    first_grape_position,
    second_grape_position,
    third_grape_position,
    first_grape_tracking_position,
    second_grape_tracking_position,
    third_grape_tracking_position,
    first_grape_in_bunch,
    second_grape_in_bunch,
    third_grape_in_bunch
  }
}

export { Vineyard }
