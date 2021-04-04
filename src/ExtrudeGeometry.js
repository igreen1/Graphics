/*
ExtrudeGeometry takes vertices2D, which is
an array of 2D coordinates ordered counter-clockwise,
and faces2D, or the indexes of the vertices2D grouped
into faces. The 2D shape formed by the vertices is
then extruded by the height to form a 3D geometry.
*/

const ExtrudeGeometry = (vertices2D, faces2D, height = 0.5) => {
  let vertices = (function createVertices(vertices2D, height) {
    let vertices = []
    //splits the 2D vertices into front and back faces
    for (let i = 0; i < vertices2D.length; i++) {
      vertices.splice(i, 0, [...vertices2D[i], -height / 2])
      vertices.push([...vertices2D[i], height / 2])
    }
    return vertices
  })(vertices2D, height)

  let facesByIndex = (function createFacesByIndex(vertices, faces2D) {
    let facesByIndex = []
    const half = vertices.length / 2
    //splits the front and back faces into triangles using 2D faces
    for (let i = 0; i < faces2D.length; i++) {
      facesByIndex.push(faces2D[i])
      facesByIndex.push([faces2D[i][0] + half, faces2D[i][2] + half, faces2D[i][1] + half])
    }
    /* connects the front and back faces with rectangular
    sides each formed by 2 triangles */
    for (let i = 0; i < half; i++) {
      facesByIndex.push([i, i + half, (i + 1) % half])
      facesByIndex.push([i + 1, i + half, (i + half + 1) % (half * 2)])
    }
    return facesByIndex
  })(vertices, faces2D)

  return { vertices, facesByIndex }
}

/*
Star Example:
ExtrudeGeometry(
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
)
*/

export { ExtrudeGeometry }
