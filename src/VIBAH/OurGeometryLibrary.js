/*
 * This module defines/generates vertex arrays for certain predefined shapes.
 * The "shapes" are returned as indexed vertices, with utility functions for
 * converting these into "raw" coordinate arrays.
 */

/**
 * Returns the vertices and faces for a small icosahedron.
 *
 * Let’s call the resulting data structure a “proto-geometry” because it has
 * the beginnings of a geometry but nothing close to what three.js has (yet).
 */
const icosahedron = () => {
  // The core icosahedron coordinates.
  const X = 0.525731112119133606
  const Z = 0.850650808352039932

  return {
    vertices: [
      [-X, 0.0, Z],
      [X, 0.0, Z],
      [-X, 0.0, -Z],
      [X, 0.0, -Z],
      [0.0, Z, X],
      [0.0, Z, -X],
      [0.0, -Z, X],
      [0.0, -Z, -X],
      [Z, X, 0.0],
      [-Z, X, 0.0],
      [Z, -X, 0.0],
      [-Z, -X, 0.0]
    ],

    facesByIndex: [
      [1, 4, 0],
      [4, 9, 0],
      [4, 5, 9],
      [8, 5, 4],
      [1, 8, 4],
      [1, 10, 8],
      [10, 3, 8],
      [8, 3, 5],
      [3, 2, 5],
      [3, 7, 2],
      [3, 10, 7],
      [10, 6, 7],
      [6, 11, 7],
      [6, 0, 11],
      [6, 1, 0],
      [10, 1, 6],
      [11, 0, 9],
      [2, 11, 9],
      [5, 2, 9],
      [11, 2, 7]
    ]
  }
}

/*
Cone... add description
*/

const Cone = (radius = 0.5, height = 1, radialSegments = 32, heightSegments = 32) => {
  const deltaRotation = (2 * Math.PI) / radialSegments
  const deltaHeight = height / heightSegments
  const deltaRadius = (deltaHeight * radius) / height

  const vertices = []
  vertices.push([0, 0, 0])
  for (let i = -heightSegments / 2; i <= heightSegments / 2; i++) {
    for (let j = 0; j <= radialSegments; j++) {
      vertices.push([radius * Math.sin(j * deltaRotation), i * deltaHeight, radius * Math.cos(j * deltaRotation)])
    }
    radius -= deltaRadius
  }

  const facesByIndex = []
  // BASE:
  for (let i = 0; i < radialSegments; i++) {
    //facesByIndex.push([0,i+1,(i+2) % radialSegments])
    facesByIndex.push([0, i + 1, i + 2])
  }

  // CONE:
  for (let i = 1; i < vertices.length - radialSegments - 1; i++) {
    facesByIndex.push([i, i + 1, i + radialSegments + 1])
    facesByIndex.push([i, i + radialSegments + 1, i + radialSegments])
  }

  return { vertices, facesByIndex }
}

/*
Cylinder - Extra (based on lathe)
*/

const Cylinder = (radius = 0.5, height = 0.5, radialSegments = 32, heightSegments = 32, closed = true) => {
  const deltaRotation = (2 * Math.PI) / radialSegments
  const deltaHeight = (1.0 * height) / heightSegments

  const vertices = []
  for (let i = 0; i <= heightSegments; i++) {
    for (let j = 0; j <= radialSegments; j++) {
      vertices.push([radius * Math.sin(j * deltaRotation), radius * Math.cos(j * deltaRotation), i * deltaHeight])
    }
  }

  const facesByIndex = []
  for (let i = 0; i < vertices.length - radialSegments - 1; i++) {
    facesByIndex.push([i + radialSegments + 1, i + 1, i])
    facesByIndex.push([i, i + radialSegments, i + radialSegments + 1])
  }

  //Add top/bottom if necessary
  if (closed) {
    const vertexOffset = vertices.length - radialSegments
    //Add center of bottom circle
    vertices.push([0, 0, 0])
    for (let i = 0; i < radialSegments; i++) {
      //add bottom circle for cylinder
      facesByIndex.push([i, (i + 1) % radialSegments, vertices.length - 1])
    }

    //Add center of top circle
    vertices.push([0, 0, deltaHeight * heightSegments])
    for (let i = 0; i < radialSegments; i++) {
      //add top circle for cylinder
      facesByIndex.push([vertices.length - 1, vertexOffset + ((i + 1) % radialSegments), vertexOffset + i])
    }
  }

  return { vertices, facesByIndex }
}

/*
ExtrudeGeometry takes vertices2D, which is
a path of 2D coordinates ordered counter-clockwise,
and faces2D, or the indexes of vertices2D grouped
into faces (3 vertices ordered counter-clockwise).
The 2D shape formed by the vertices is then
extruded by the depth to form a 3D geometry.
*/

const Extrude = (vertices2D, faces2D, depth = 0.5) => {
  let vertices = (function createVertices(vertices2D, depth) {
    let vertices = []
    //splits the 2D vertices into front and back faces
    for (let i = 0; i < vertices2D.length; i++) {
      vertices.splice(i, 0, [...vertices2D[i], -depth / 2])
      vertices.push([...vertices2D[i], depth / 2])
    }
    return vertices
  })(vertices2D, depth)

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
Lathe description
*/

const Lathe = (points, segments = 32, phiStart = 0, phiLength = 2 * Math.PI) => {
  /**
   * Lathe rotates points by phiLength amount, starting at phiStart creating segments number of segments
   * It does this about the z-axis, assuming point is a [radius, height] tuple in array form
   */

  const rotationPerSegment = phiLength / segments

  const vertices = []
  points.forEach(givenPoint => {
    for (let i = 0; i <= segments; i++) {
      vertices.push([
        givenPoint[0] * Math.sin(phiStart + i * rotationPerSegment),
        givenPoint[0] * Math.cos(phiStart + i * rotationPerSegment),
        givenPoint[1]
      ])
    }
  })

  const facesByIndex = []
  for (let i = 0; i < vertices.length - segments - 1; i++) {
    facesByIndex.push([i + segments + 1, i + 1, i])
    facesByIndex.push([i, i + segments, i + segments + 1])
  }

  return {
    vertices,
    facesByIndex
  }
}

/*
Regular Polygon
*/

const RegularPolygon = numberOfSides => {
  let vertices = (function createVertices(numberOfPoints, radius = 1) {
    let vertices = []
    let increment = (2 * Math.PI) / numberOfPoints
    vertices.push([0, 0, 0])
    for (let i = 0; i < numberOfPoints; i++) {
      vertices.push([Math.cos(i * increment) * radius, Math.sin(i * increment) * radius, 0])
    }
    return vertices
  })(numberOfSides)

  let facesByIndex = []
  for (let i = 1; i <= numberOfSides; i++) {
    if (i < numberOfSides) {
      facesByIndex.push([0, i, i + 1])
    } else {
      facesByIndex.push([0, i, 1])
    }
  }
  return { vertices, facesByIndex }
}

/*
Sphere ... add description
*/

const Sphere = (radius = 0.5, radialSegments = 32) => {
  const deltaRotation = (2 * Math.PI) / radialSegments
  const deltaRadius = radius / radialSegments
  let currentRadius = radius

  const vertices = []
  for (let i = 0; i <= radialSegments; i++) {
    currentRadius = Math.sqrt(radius ** 2 - (i * deltaRadius) ** 2)
    for (let j = 0; j <= radialSegments; j++) {
      vertices.push([
        currentRadius * Math.sin(j * deltaRotation),
        currentRadius * Math.cos(j * deltaRotation),
        i * deltaRadius
      ])
    }
  }

  for (let i = 0; i <= radialSegments; i++) {
    currentRadius = Math.sqrt(radius ** 2 - (i * deltaRadius) ** 2)
    for (let j = 0; j <= radialSegments; j++) {
      vertices.push([
        currentRadius * Math.sin(j * deltaRotation),
        currentRadius * Math.cos(j * deltaRotation),
        -i * deltaRadius
      ])
    }
  }

  const facesByIndex = []

  for (let i = 0; i < vertices.length - radialSegments - 1; i++) {
    facesByIndex.push([i + 1, i, i + radialSegments + 1])
    facesByIndex.push([i, i + radialSegments + 1, i + radialSegments])
  }

  return { vertices, facesByIndex }
}

// How we COULD implement geometry caching
// const sphereCache = {
//   cache: [],
//   searchList: function(desiredSegments, desiredRadius){
//     let result = this.list.find(element => element.radialSegments = desiredSegments)
//     if(!result){
//       result = SphereFactory(desiredRadius, desiredSegments)
//       result.radialSegments = desiredSegments
//       result.radius = desiredRadius
//       this.cache.push(result)
//       return result
//     }
//     return result
    
//   }
// }
// const CachedSphere = (radius = 0.5, radialSegments = 32) => {
//   const sphere = sphereCache.searchList(radius, radialSegments)
//   if(sphere.radius !== radius){
//     return sphere.scale(radius/sphere.radius)
//   } else { 
//     return sphere
//   }
// }

/**
 * Torus arcs a tube with radius tubeRadius around a given innerRadius with arc defaulted to 2 PI.
 * radialSegments & tubularSegments adjust depth & roundness of the tube, respectively.
 */

const Torus = (innerRadius = 0.5, tubeRadius = 0.2, radialSegments = 36, tubularSegments = 36, arc = Math.PI * 2) => {
  const vertices = []

  for (let i = 0; i <= radialSegments; i++) {
    for (let j = 0; j <= tubularSegments; j++) {
      const u = (j / tubularSegments) * arc
      const v = (i / radialSegments) * Math.PI * 2

      vertices.push([
        (innerRadius + tubeRadius * Math.cos(v)) * Math.cos(u),
        (innerRadius + tubeRadius * Math.cos(v)) * Math.sin(u),
        tubeRadius * Math.sin(v)
      ])
    }
  }

  const facesByIndex = []

  for (let i = 1; i <= radialSegments; i++) {
    for (let j = 1; j <= tubularSegments; j++) {
      facesByIndex.push([
        (tubularSegments + 1) * i + j - 1,
        (tubularSegments + 1) * (i - 1) + j - 1,
        (tubularSegments + 1) * i + j
      ])
      facesByIndex.push([
        (tubularSegments + 1) * (i - 1) + j - 1,
        (tubularSegments + 1) * (i - 1) + j,
        (tubularSegments + 1) * i + j
      ])
    }
  }
  return { vertices, facesByIndex }
}

/*
Tube... add description
*/

const Tube = (innerRadius = 0.1, outerRadius = 0.6, height = 0.5, radialSegments = 24, heightSegments = 32) => {
  const deltaRotation = (2 * Math.PI) / radialSegments
  const deltaHeight = height / heightSegments

  const vertices = []
  const cylinderVertices = heightSegments * (radialSegments + 1)

  // Outer cylinder
  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j <= radialSegments; j++) {
      vertices.push([
        outerRadius * Math.sin(j * deltaRotation),
        outerRadius * Math.cos(j * deltaRotation),
        i * deltaHeight
      ])
    }
  }

  // Inner cylinder
  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j <= radialSegments; j++) {
      vertices.push([
        innerRadius * Math.sin(j * deltaRotation),
        innerRadius * Math.cos(j * deltaRotation),
        i * deltaHeight
      ])
    }
  }

  const facesByIndex = []
  for (let i = 0; i < cylinderVertices - radialSegments - 1; i++) {
    facesByIndex.push([i, i + 1, i + radialSegments + 1])
    facesByIndex.push([i, i + radialSegments + 1, i + radialSegments])
  }

  for (let i = cylinderVertices; i < vertices.length - radialSegments - 1; i++) {
    facesByIndex.push([i, i + 1, i + radialSegments + 1])
    facesByIndex.push([i, i + radialSegments + 1, i + radialSegments])
  }

  //Add top/bottom
  for (let j = 0; j <= radialSegments; j++) {
    vertices.push([innerRadius * Math.sin(j * deltaRotation), innerRadius * Math.cos(j * deltaRotation), 0])
  }

  for (let j = 0; j <= radialSegments; j++) {
    vertices.push([outerRadius * Math.sin(j * deltaRotation), outerRadius * Math.cos(j * deltaRotation), 0])
  }

  for (let i = cylinderVertices * 2; i < cylinderVertices * 2 + radialSegments + 1; i++) {
    facesByIndex.push([i, i + radialSegments, i + radialSegments + 1])
    facesByIndex.push([i, i + 1, i + radialSegments + 1])
  }

  //Add top/bottom if necessary
  for (let j = 0; j <= radialSegments; j++) {
    vertices.push([
      innerRadius * Math.sin(j * deltaRotation),
      innerRadius * Math.cos(j * deltaRotation),
      height - deltaHeight
    ])
  }

  for (let j = 0; j <= radialSegments; j++) {
    vertices.push([
      outerRadius * Math.sin(j * deltaRotation),
      outerRadius * Math.cos(j * deltaRotation),
      height - deltaHeight
    ])
  }

  for (let i = cylinderVertices * 2 + 2 * radialSegments; i < cylinderVertices * 2 + 3 * radialSegments + 3; i++) {
    facesByIndex.push([i, i + radialSegments, i + radialSegments + 1])
    facesByIndex.push([i, i + 1, i + radialSegments + 1])
  }

  return { vertices, facesByIndex }
}

export { icosahedron, Cone, Cylinder, Extrude, Lathe, RegularPolygon, Sphere, Torus, Tube }
