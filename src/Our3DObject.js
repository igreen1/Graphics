import { toRawLineArray, toRawTriangleArray } from './shapes'
import { Matrix, MatrixLibrary } from './OurMatrix'
import { Vector } from './vector'

const OurMesh = ({ vertices, facesByIndex }, wireframe = false, faceted = false) => {
  let isWireframe = wireframe
  let isFaceted = faceted

  return {
    facesByIndex,
    get vertices() {
      return isWireframe ? toRawLineArray({ vertices, facesByIndex }) : toRawTriangleArray({ vertices, facesByIndex })
    },
    set vertices(newVertices) {
      vertices = newVertices
    },
    get rawVertices() {
      return vertices
    },
    get isWireframe() {
      return isWireframe
    },
    set isFaceted(newFaceted) {
      isFaceted = newFaceted
    },
    get isFaceted() {
      return isFaceted
    },
    get normals() {
      return isFaceted ? this.facetedNormals : this.smoothNormals
    },

    get facetedNormals() {
      let normalsByIndex = Array(this.rawVertices.length)
      normalsByIndex.fill([])

      facesByIndex.forEach(face => {
        let v1 = Vector(
          this.rawVertices[face[1]][0] - this.rawVertices[face[0]][0],
          this.rawVertices[face[1]][1] - this.rawVertices[face[0]][1],
          this.rawVertices[face[1]][2] - this.rawVertices[face[0]][2]
        )
        let v2 = Vector(
          this.rawVertices[face[2]][0] - this.rawVertices[face[1]][0],
          this.rawVertices[face[2]][1] - this.rawVertices[face[1]][1],
          this.rawVertices[face[2]][2] - this.rawVertices[face[1]][2]
        )
        let v3 = Vector(
          this.rawVertices[face[0]][0] - this.rawVertices[face[2]][0],
          this.rawVertices[face[0]][1] - this.rawVertices[face[2]][1],
          this.rawVertices[face[0]][2] - this.rawVertices[face[2]][2]
        )

        normalsByIndex[face[0]].push(v3.multiply(-1).cross(v1).normalize())
        normalsByIndex[face[1]].push(v1.multiply(-1).cross(v2).normalize())
        normalsByIndex[face[2]].push(v2.multiply(-1).cross(v3).normalize())
      })

      // Do we need to divide each by magnitude?

      return normalsByIndex
    },

    get smoothNormals() {
      let normalsByIndex = Array(this.rawVertices.length)
      normalsByIndex.fill([Vector(0, 0, 0)])

      facesByIndex.forEach(face => {
        let v1 = Vector(
          this.rawVertices[face[1]][0] - this.rawVertices[face[0]][0],
          this.rawVertices[face[1]][1] - this.rawVertices[face[0]][1],
          this.rawVertices[face[1]][2] - this.rawVertices[face[0]][2]
        )
        let v2 = Vector(
          this.rawVertices[face[2]][0] - this.rawVertices[face[1]][0],
          this.rawVertices[face[2]][1] - this.rawVertices[face[1]][1],
          this.rawVertices[face[2]][2] - this.rawVertices[face[1]][2]
        )
        let v3 = Vector(
          this.rawVertices[face[0]][0] - this.rawVertices[face[2]][0],
          this.rawVertices[face[0]][1] - this.rawVertices[face[2]][1],
          this.rawVertices[face[0]][2] - this.rawVertices[face[2]][2]
        )

        normalsByIndex[face[0]][0].add(v3.multiply(-1).cross(v1).normalize())
        normalsByIndex[face[1]][0].add(v1.multiply(-1).cross(v2).normalize())
        normalsByIndex[face[2]][0].add(v2.multiply(-1).cross(v3).normalize())
      })

      // Do we need to divide each by magnitude?

      return normalsByIndex
    },
    setWireframe: newIsWireframe => (isWireframe = newIsWireframe)
  }
}

const Our3DObject = (mesh, colorArrayByVertex) => {
  let matrix = Matrix()
  return {
    type: Our3DObject,
    mesh,
    get vertices() {
      return mesh.vertices
    },
    get matrix() {
      return matrix
    },
    get color() {
      if (colorArrayByVertex.length > 3) {
        //vertex-by-vertex coloring
      } else {
        return { r: colorArrayByVertex[0], g: colorArrayByVertex[1], b: colorArrayByVertex[2] }
      }
    },
    get colors() {
      if (Array.isArray(colorArrayByVertex[0])) {
        let colors = []
        for (let i = 0, maxi = this.vertices.length / 9; i < maxi; i += 1) {
          colors.push(colorArrayByVertex[i][0])
          colors.push(colorArrayByVertex[i][1])
          colors.push(colorArrayByVertex[i][2])
          colors.push(colorArrayByVertex[i][0])
          colors.push(colorArrayByVertex[i][1])
          colors.push(colorArrayByVertex[i][2])
          colors.push(colorArrayByVertex[i][0])
          colors.push(colorArrayByVertex[i][1])
          colors.push(colorArrayByVertex[i][2])
        }
        console.log(colors)
        return colors

        return []
          .concat(colorArrayByVertex.flatMap(rgb => rgb))
          .concat(colorArrayByVertex.flatMap(rgb => rgb))
          .concat(colorArrayByVertex.flatMap(rgb => rgb))
      } else {
        let colors = []
        for (let i = 0, maxi = this.vertices.length / 3; i < maxi; i += 1) {
          colors = colors.concat(colorArrayByVertex[0], colorArrayByVertex[1], colorArrayByVertex[2])
        }
        console.log(colors)
        return colors
      }
    },
    setWireframe: mesh.setWireframe,
    transform: otherMatrix => (matrix = otherMatrix.multiply(matrix)),
    transformVertices: otherMatrix =>
      (mesh.vertices = mesh.rawVertices.map(vertex =>
        otherMatrix
          .multiply(Matrix([[vertex[0]], [vertex[1]], [vertex[2]], [1]]))
          .toArray()
          .slice(0, -1)
      ))
    // applyLight: lightSources => {

    //   let lambertianCoefficient = new Vector(0,0,0)
    //   lightSources.forEach((light)=>{
    //     this.mesh.vertices.forEach((vertex)=>{

    //     })
    //   })
    //   return [r0, g0, b0, r1, g1, b1, r2, g2, b2]
    // }
  }
  /*
void main(void) {
  // Calculate the normal vector
  vec3 N = normalize(vec3(uNormalMatrix * vec4(aVertexNormal, 1.0)));
  // Normalized light direction
  vec3 L = normalize(uLightDirection);
  // Dot product of the normal product and negative light direction vector
  float lambertTerm = dot(N, -L);
  // Calculating the diffuse color based on the Lambertian reflection model
  vec3 Id = uMaterialDiffuse * uLightDiffuse * lambertTerm;
  vVertexColor = vec4(Id, 1.0);
  // Setting the vertex position
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}
  */
}

const Our3DGroup = (objects = []) => {
  const group = objects
  return {
    get group() {
      return group
    },
    type: Our3DGroup,
    add: object => group.push(object),
    remove: object => group.filter(sceneObject => sceneObject !== object),
    transform: matrix => group.forEach(object => object.transform(matrix))
  }
}

const OurLight = (center, direction) => {
  return {
    type: OurLight,
    direction: new Vector(direction[0], direction[1], direction[2]).normalize(),
    center: center
  }
}

const OurCamera = (center, direction, projectionOptions, projectionType = MatrixLibrary.perspectiveMatrix) => {
  let matrix = Matrix()
    .multiply(MatrixLibrary.translationMatrix(center[0], center[1], center[2]))
    .multiply(MatrixLibrary.rotationMatrix(direction[0], direction[1], direction[2]))

  const projectionMatrix = projectionType(...projectionOptions)

  return {
    type: OurCamera,
    get matrix() {
      return projectionMatrix.multiply(matrix).toArray()
    },
    set matrix(newMatrix) {
      matrix = newMatrix
    },
    translate: (x, y, z) => (matrix = matrix.multiply(MatrixLibrary.translationMatrix(x, y, z))),
    rotate: (x, y, z) => (matrix = matrix.multiply(MatrixLibrary.rotationMatrix(x, y, z))),
    projectionMatrix
  }
}

export { OurMesh, Our3DGroup, Our3DObject, OurLight, OurCamera }
