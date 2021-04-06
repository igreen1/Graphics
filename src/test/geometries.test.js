import { Cone, Cylinder, Extrude, RegularPolygon, Sphere, Tube, Torus } from '../GeometryLibrary'
import { Our3DObject, OurMesh, Our3DGroup } from '../Our3DObject'

describe('Cone', () => {
  it('creates correct cone vertices', () => {
    let cone = Our3DObject(OurMesh(Cone(1, 1, 4, 4), false), [1, 0, 1.5])
    expect(cone.mesh.rawVertices).toStrictEqual([
      [0, 0, 0],
      [0, -0.5, 1],
      [1, -0.5, 6.123233995736766e-17],
      [1.2246467991473532e-16, -0.5, -1],
      [-1, -0.5, -1.8369701987210297e-16],
      [-2.4492935982947064e-16, -0.5, 1],
      [0, -0.25, 0.75],
      [0.75, -0.25, 4.592425496802574e-17],
      [9.184850993605148e-17, -0.25, -0.75],
      [-0.75, -0.25, -1.3777276490407724e-16],
      [-1.8369701987210297e-16, -0.25, 0.75],
      [0, 0, 0.5],
      [0.5, 0, 3.061616997868383e-17],
      [6.123233995736766e-17, 0, -0.5],
      [-0.5, 0, -9.184850993605148e-17],
      [-1.2246467991473532e-16, 0, 0.5],
      [0, 0.25, 0.25],
      [0.25, 0.25, 1.5308084989341915e-17],
      [3.061616997868383e-17, 0.25, -0.25],
      [-0.25, 0.25, -4.592425496802574e-17],
      [-6.123233995736766e-17, 0.25, 0.25],
      [0, 0.5, 0],
      [0, 0.5, 0],
      [0, 0.5, -0],
      [-0, 0.5, -0],
      [-0, 0.5, 0]
    ])
  })

  it('creates correct cone edges', () => {
    let cone = Our3DObject(OurMesh(Cone(1, 1, 4, 4), false), [1, 0, 1.5])
    expect(cone.mesh.facesByIndex).toStrictEqual([
      [0, 1, 2],
      [0, 2, 3],
      [0, 3, 4],
      [0, 4, 5],
      [1, 2, 6],
      [1, 6, 5],
      [2, 3, 7],
      [2, 7, 6],
      [3, 4, 8],
      [3, 8, 7],
      [4, 5, 9],
      [4, 9, 8],
      [5, 6, 10],
      [5, 10, 9],
      [6, 7, 11],
      [6, 11, 10],
      [7, 8, 12],
      [7, 12, 11],
      [8, 9, 13],
      [8, 13, 12],
      [9, 10, 14],
      [9, 14, 13],
      [10, 11, 15],
      [10, 15, 14],
      [11, 12, 16],
      [11, 16, 15],
      [12, 13, 17],
      [12, 17, 16],
      [13, 14, 18],
      [13, 18, 17],
      [14, 15, 19],
      [14, 19, 18],
      [15, 16, 20],
      [15, 20, 19],
      [16, 17, 21],
      [16, 21, 20],
      [17, 18, 22],
      [17, 22, 21],
      [18, 19, 23],
      [18, 23, 22],
      [19, 20, 24],
      [19, 24, 23],
      [20, 21, 25],
      [20, 25, 24]
    ])
  })
})

describe('Cylinder', () => {
  it('creates correct cylinder vertices', () => {
    let cylinder = Our3DObject(OurMesh(Cylinder(1, 1, 3, 3), false), [1, 0, 1.5])
    expect(cylinder.mesh.rawVertices).toStrictEqual([
      [0, 1, 0],
      [0.8660254037844387, -0.4999999999999998, 0],
      [-0.8660254037844385, -0.5000000000000004, 0],
      [-2.4492935982947064e-16, 1, 0],
      [0, 1, 0.3333333333333333],
      [0.8660254037844387, -0.4999999999999998, 0.3333333333333333],
      [-0.8660254037844385, -0.5000000000000004, 0.3333333333333333],
      [-2.4492935982947064e-16, 1, 0.3333333333333333],
      [0, 1, 0.6666666666666666],
      [0.8660254037844387, -0.4999999999999998, 0.6666666666666666],
      [-0.8660254037844385, -0.5000000000000004, 0.6666666666666666],
      [-2.4492935982947064e-16, 1, 0.6666666666666666],
      [0, 0, 0],
      [0, 0, 1]
    ])
  })

  it('creates correct cylinder edges', () => {
    let cylinder = Our3DObject(OurMesh(Cylinder(1, 1, 3, 3), false), [1, 0, 1.5])
    expect(cylinder.mesh.facesByIndex).toStrictEqual([
      [0, 1, 4],
      [0, 4, 3],
      [1, 2, 5],
      [1, 5, 4],
      [2, 3, 6],
      [2, 6, 5],
      [3, 4, 7],
      [3, 7, 6],
      [4, 5, 8],
      [4, 8, 7],
      [5, 6, 9],
      [5, 9, 8],
      [6, 7, 10],
      [6, 10, 9],
      [7, 8, 11],
      [7, 11, 10],
      [0, 1, 12],
      [1, 2, 12],
      [2, 0, 12],
      [6, 7, 13],
      [7, 8, 13],
      [8, 6, 13]
    ])
  })
})

describe('Extrude', () => {
  it('creates correct extrude vertices (with star)', () => {
    let star = Our3DObject(
      OurMesh(
        Extrude(
          [
            [0, 1],
            [0.25, 0.3],
            [1, 0.3],
            [0.4, -0.1],
            [0.6, -0.8],
            [0, -0.35],
            [-0.6, -0.8],
            [-0.4, -0.1],
            [-1, 0.3],
            [-0.25, 0.3]
          ],
          [
            [0, 9, 1],
            [2, 1, 3],
            [4, 3, 5],
            [6, 5, 7],
            [8, 7, 9],
            [1, 9, 5],
            [3, 1, 5],
            [7, 5, 9]
          ]
        ),
        false
      ),
      [0, 1.5, 1]
    )
    expect(star.mesh.rawVertices).toStrictEqual([
      [0, 1, -0.25],
      [0.25, 0.3, -0.25],
      [1, 0.3, -0.25],
      [0.4, -0.1, -0.25],
      [0.6, -0.8, -0.25],
      [0, -0.35, -0.25],
      [-0.6, -0.8, -0.25],
      [-0.4, -0.1, -0.25],
      [-1, 0.3, -0.25],
      [-0.25, 0.3, -0.25],
      [0, 1, 0.25],
      [0.25, 0.3, 0.25],
      [1, 0.3, 0.25],
      [0.4, -0.1, 0.25],
      [0.6, -0.8, 0.25],
      [0, -0.35, 0.25],
      [-0.6, -0.8, 0.25],
      [-0.4, -0.1, 0.25],
      [-1, 0.3, 0.25],
      [-0.25, 0.3, 0.25]
    ])
  })

  it('creates correct extrude edges (with star)', () => {
    let star = Our3DObject(
      OurMesh(
        Extrude(
          [
            [0, 1],
            [0.25, 0.3],
            [1, 0.3],
            [0.4, -0.1],
            [0.6, -0.8],
            [0, -0.35],
            [-0.6, -0.8],
            [-0.4, -0.1],
            [-1, 0.3],
            [-0.25, 0.3]
          ],
          [
            [0, 9, 1],
            [2, 1, 3],
            [4, 3, 5],
            [6, 5, 7],
            [8, 7, 9],
            [1, 9, 5],
            [3, 1, 5],
            [7, 5, 9]
          ]
        ),
        false
      ),
      [0, 1.5, 1]
    )
    expect(star.mesh.facesByIndex).toStrictEqual([
      [0, 9, 1],
      [10, 11, 19],
      [2, 1, 3],
      [12, 13, 11],
      [4, 3, 5],
      [14, 15, 13],
      [6, 5, 7],
      [16, 17, 15],
      [8, 7, 9],
      [18, 19, 17],
      [1, 9, 5],
      [11, 15, 19],
      [3, 1, 5],
      [13, 15, 11],
      [7, 5, 9],
      [17, 19, 15],
      [0, 10, 1],
      [1, 10, 11],
      [1, 11, 2],
      [2, 11, 12],
      [2, 12, 3],
      [3, 12, 13],
      [3, 13, 4],
      [4, 13, 14],
      [4, 14, 5],
      [5, 14, 15],
      [5, 15, 6],
      [6, 15, 16],
      [6, 16, 7],
      [7, 16, 17],
      [7, 17, 8],
      [8, 17, 18],
      [8, 18, 9],
      [9, 18, 19],
      [9, 19, 0],
      [10, 19, 0]
    ])
  })
})

describe('RegularPolygon', () => {
  it('creates correct polygon vertices', () => {
    let poly = Our3DObject(OurMesh(RegularPolygon(10), true), [0, 0, 1.5])
    expect(poly.mesh.rawVertices).toStrictEqual([
      [0, 0, 0],
      [1, 0, 0],
      [0.8090169943749475, 0.5877852522924731, 0],
      [0.30901699437494745, 0.9510565162951535, 0],
      [-0.30901699437494734, 0.9510565162951536, 0],
      [-0.8090169943749473, 0.5877852522924732, 0],
      [-1, 1.2246467991473532e-16, 0],
      [-0.8090169943749475, -0.587785252292473, 0],
      [-0.30901699437494756, -0.9510565162951535, 0],
      [0.30901699437494723, -0.9510565162951536, 0],
      [0.8090169943749473, -0.5877852522924734, 0]
    ])
  })

  it('creates correct polygon edges', () => {
    let poly = Our3DObject(OurMesh(RegularPolygon(10), true), [0, 0, 1.5])
    expect(poly.mesh.facesByIndex).toStrictEqual([
      [0, 1, 2],
      [0, 2, 3],
      [0, 3, 4],
      [0, 4, 5],
      [0, 5, 6],
      [0, 6, 7],
      [0, 7, 8],
      [0, 8, 9],
      [0, 9, 10],
      [0, 10, 1]
    ])
  })
})

describe('Sphere', () => {
  it('creates correct polygon vertices', () => {
    let sphere = Our3DObject(OurMesh(Sphere(1, 2), true), [0, 0, 1.5])
    expect(sphere.mesh.rawVertices).toStrictEqual([
      [0, 1, 0],
      [1.2246467991473532e-16, -1, 0],
      [-2.4492935982947064e-16, 1, 0],
      [0, 0.8660254037844386, 0.5],
      [1.0605752387249068e-16, -0.8660254037844386, 0.5],
      [-2.1211504774498136e-16, 0.8660254037844386, 0.5],
      [0, 0, 1],
      [0, -0, 1],
      [-0, 0, 1],
      [0, 1, -0],
      [1.2246467991473532e-16, -1, -0],
      [-2.4492935982947064e-16, 1, -0],
      [0, 0.8660254037844386, -0.5],
      [1.0605752387249068e-16, -0.8660254037844386, -0.5],
      [-2.1211504774498136e-16, 0.8660254037844386, -0.5],
      [0, 0, -1],
      [0, -0, -1],
      [-0, 0, -1]
    ])
  })

  it('creates correct polygon edges', () => {
    let sphere = Our3DObject(OurMesh(Sphere(1, 2), true), [0, 0, 1.5])
    expect(sphere.mesh.facesByIndex).toStrictEqual([
      [0, 1, 3],
      [0, 3, 2],
      [1, 2, 4],
      [1, 4, 3],
      [2, 3, 5],
      [2, 5, 4],
      [3, 4, 6],
      [3, 6, 5],
      [4, 5, 7],
      [4, 7, 6],
      [5, 6, 8],
      [5, 8, 7],
      [6, 7, 9],
      [6, 9, 8],
      [7, 8, 10],
      [7, 10, 9],
      [8, 9, 11],
      [8, 11, 10],
      [9, 10, 12],
      [9, 12, 11],
      [10, 11, 13],
      [10, 13, 12],
      [11, 12, 14],
      [11, 14, 13],
      [12, 13, 15],
      [12, 15, 14],
      [13, 14, 16],
      [13, 16, 15],
      [14, 15, 17],
      [14, 17, 16]
    ])
  })
})

describe('Tube', () => {
  it('creates correct polygon vertices', () => {
    let tube = Our3DObject(OurMesh(Tube(0.1, 0.6, 0.5, 3, 3), true), [0, 0, 1.5])
    expect(tube.mesh.rawVertices).toStrictEqual([
      [0, 0.6, 0],
      [0.5196152422706632, -0.2999999999999999, 0],
      [-0.519615242270663, -0.30000000000000027, 0],
      [-1.4695761589768238e-16, 0.6, 0],
      [0, 0.6, 0.16666666666666666],
      [0.5196152422706632, -0.2999999999999999, 0.16666666666666666],
      [-0.519615242270663, -0.30000000000000027, 0.16666666666666666],
      [-1.4695761589768238e-16, 0.6, 0.16666666666666666],
      [0, 0.6, 0.3333333333333333],
      [0.5196152422706632, -0.2999999999999999, 0.3333333333333333],
      [-0.519615242270663, -0.30000000000000027, 0.3333333333333333],
      [-1.4695761589768238e-16, 0.6, 0.3333333333333333],
      [0, 0.1, 0],
      [0.08660254037844388, -0.04999999999999998, 0],
      [-0.08660254037844385, -0.050000000000000044, 0],
      [-2.4492935982947065e-17, 0.1, 0],
      [0, 0.1, 0.16666666666666666],
      [0.08660254037844388, -0.04999999999999998, 0.16666666666666666],
      [-0.08660254037844385, -0.050000000000000044, 0.16666666666666666],
      [-2.4492935982947065e-17, 0.1, 0.16666666666666666],
      [0, 0.1, 0.3333333333333333],
      [0.08660254037844388, -0.04999999999999998, 0.3333333333333333],
      [-0.08660254037844385, -0.050000000000000044, 0.3333333333333333],
      [-2.4492935982947065e-17, 0.1, 0.3333333333333333],
      [0, 0.1, 0],
      [0.08660254037844388, -0.04999999999999998, 0],
      [-0.08660254037844385, -0.050000000000000044, 0],
      [-2.4492935982947065e-17, 0.1, 0],
      [0, 0.6, 0],
      [0.5196152422706632, -0.2999999999999999, 0],
      [-0.519615242270663, -0.30000000000000027, 0],
      [-1.4695761589768238e-16, 0.6, 0],
      [0, 0.1, 0.33333333333333337],
      [0.08660254037844388, -0.04999999999999998, 0.33333333333333337],
      [-0.08660254037844385, -0.050000000000000044, 0.33333333333333337],
      [-2.4492935982947065e-17, 0.1, 0.33333333333333337],
      [0, 0.6, 0.33333333333333337],
      [0.5196152422706632, -0.2999999999999999, 0.33333333333333337],
      [-0.519615242270663, -0.30000000000000027, 0.33333333333333337],
      [-1.4695761589768238e-16, 0.6, 0.33333333333333337]
    ])
  })

  it('creates correct polygon edges', () => {
    let tube = Our3DObject(OurMesh(Tube(0.1, 0.6, 0.5, 3, 3), true), [0, 0, 1.5])
    expect(tube.mesh.facesByIndex).toStrictEqual([
      [0, 1, 4],
      [0, 4, 3],
      [1, 2, 5],
      [1, 5, 4],
      [2, 3, 6],
      [2, 6, 5],
      [3, 4, 7],
      [3, 7, 6],
      [4, 5, 8],
      [4, 8, 7],
      [5, 6, 9],
      [5, 9, 8],
      [6, 7, 10],
      [6, 10, 9],
      [7, 8, 11],
      [7, 11, 10],
      [12, 13, 16],
      [12, 16, 15],
      [13, 14, 17],
      [13, 17, 16],
      [14, 15, 18],
      [14, 18, 17],
      [15, 16, 19],
      [15, 19, 18],
      [16, 17, 20],
      [16, 20, 19],
      [17, 18, 21],
      [17, 21, 20],
      [18, 19, 22],
      [18, 22, 21],
      [19, 20, 23],
      [19, 23, 22],
      [24, 27, 28],
      [24, 25, 28],
      [25, 28, 29],
      [25, 26, 29],
      [26, 29, 30],
      [26, 27, 30],
      [27, 30, 31],
      [27, 28, 31],
      [30, 33, 34],
      [30, 31, 34],
      [31, 34, 35],
      [31, 32, 35],
      [32, 35, 36],
      [32, 33, 36],
      [33, 36, 37],
      [33, 34, 37],
      [34, 37, 38],
      [34, 35, 38],
      [35, 38, 39],
      [35, 36, 39]
    ])
  })
})

describe('Torus', () => {
  it('creates correct polygon vertices', () => {
    let torus = Our3DObject(OurMesh(Torus(0.5, 0.2, 4, 4), true), [0, 0, 1.5])
    expect(torus.mesh.rawVertices).toStrictEqual([
      [0.7, 0, 0],
      [4.286263797015736e-17, 0.7, 0],
      [-0.7, 8.572527594031472e-17, 0],
      [-1.2858791391047207e-16, -0.7, 0],
      [0.7, -1.7145055188062944e-16, 0],
      [0.5, 0, 0.2],
      [3.061616997868383e-17, 0.5, 0.2],
      [-0.5, 6.123233995736766e-17, 0.2],
      [-9.184850993605148e-17, -0.5, 0.2],
      [0.5, -1.2246467991473532e-16, 0.2],
      [0.3, 0, 2.4492935982947065e-17],
      [1.8369701987210297e-17, 0.3, 2.4492935982947065e-17],
      [-0.3, 3.6739403974420595e-17, 2.4492935982947065e-17],
      [-5.510910596163089e-17, -0.3, 2.4492935982947065e-17],
      [0.3, -7.347880794884119e-17, 2.4492935982947065e-17],
      [0.49999999999999994, 0, -0.2],
      [3.0616169978683824e-17, 0.49999999999999994, -0.2],
      [-0.49999999999999994, 6.123233995736765e-17, -0.2],
      [-9.184850993605147e-17, -0.49999999999999994, -0.2],
      [0.49999999999999994, -1.224646799147353e-16, -0.2],
      [0.7, 0, -4.898587196589413e-17],
      [4.286263797015736e-17, 0.7, -4.898587196589413e-17],
      [-0.7, 8.572527594031472e-17, -4.898587196589413e-17],
      [-1.2858791391047207e-16, -0.7, -4.898587196589413e-17],
      [0.7, -1.7145055188062944e-16, -4.898587196589413e-17]
    ])
  })

  it('creates correct polygon edges', () => {
    let torus = Our3DObject(OurMesh(Torus(0.5, 0.2, 4, 4), true), [0, 0, 1.5])
    expect(torus.mesh.facesByIndex).toStrictEqual([
      [5, 0, 6],
      [0, 1, 6],
      [6, 1, 7],
      [1, 2, 7],
      [7, 2, 8],
      [2, 3, 8],
      [8, 3, 9],
      [3, 4, 9],
      [10, 5, 11],
      [5, 6, 11],
      [11, 6, 12],
      [6, 7, 12],
      [12, 7, 13],
      [7, 8, 13],
      [13, 8, 14],
      [8, 9, 14],
      [15, 10, 16],
      [10, 11, 16],
      [16, 11, 17],
      [11, 12, 17],
      [17, 12, 18],
      [12, 13, 18],
      [18, 13, 19],
      [13, 14, 19],
      [20, 15, 21],
      [15, 16, 21],
      [21, 16, 22],
      [16, 17, 22],
      [22, 17, 23],
      [17, 18, 23],
      [23, 18, 24],
      [18, 19, 24]
    ])
  })
})
