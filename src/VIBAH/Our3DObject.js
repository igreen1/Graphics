import { toRawLineArray, toRawTriangleArray, Vector } from './OurUtilities'
import { Matrix, MatrixLibrary } from './OurMatrix'
import { TransformableObject } from './OurTransformations'


// TODO Caching for normals / vertices
const OurMesh = ({ vertices, facesByIndex }, wireframe = false, faceted = false) => {
  let isWireframe = false
  let isFaceted = faceted

  let cachedVertices = false; // the vertices to return
  let cachedNormals = false; // the normals to return

  let cachedFacetedWireframeNormals = false; // the normals when faceted and isWireframe
  let cachedSmoothWireframeNormals = false; // normals when smooth and isWireframe
  let cachedFacetedFacesNormals = false; // normals when faceted and not is wireframe
  let cachedSmoothFacesNormals = false // normals when smooth and not is wireframe

  let cachedWireframeVertices = false; // vertices when wireframe
  let cachedNotWireframeVertices = false; // vertices when not is wireframe

  return {
    change: true,
    facesByIndex,
    facesChanged: false,
    get vertices() {
      if (!cachedVertices) {
        this.updateCachedVertices()
      }
      return cachedVertices
    },
    set vertices(newCachedVertices) {
      cachedVertices = newCachedVertices
    },
    updateCachedVertices: function () {
      // We assume that those who change between wireframe and not
      // are going to do so multiple times
      // this is a bold assumption but,,, memory is cheaper than these vertex calculations
      // however, this is a moderately more efficient calculation than normals
      // so only two caches
      if (isWireframe) {
        if (!cachedWireframeVertices || this.facesChanged) {
          cachedWireframeVertices = toRawLineArray({ vertices, facesByIndex })
          this.facesChanged = false
        }
        cachedVertices = cachedWireframeVertices
      } else {
        if (!cachedNotWireframeVertices || this.facesChanged) {
          cachedNotWireframeVertices = toRawTriangleArray({ vertices, facesByIndex })
          this.facesChanged = false
        }
        cachedVertices = cachedNotWireframeVertices
      }
      // this.vertices = cachedVertices
      // cachedVertices = isWireframe ? toRawLineArray({ vertices, facesByIndex }) : toRawTriangleArray({ vertices, facesByIndex })
      this.change = true
    },
    get rawVertices() {
      return vertices
    },
    get isWireframe() {
      return isWireframe
    },
    set isWireframe(newIsWireframe) {
      isWireframe = newIsWireframe
      this.updateCachedVertices()
      this.updateCachedNormals()
    },
    setWireframe: function (newIsWireframe) {
      //backwards compatibility
      isWireframe = newIsWireframe
      this.updateCachedVertices()
      this.updateCachedNormals()
      return this;
    },


    set isFaceted(newFaceted) {
      this.facesChanged = true
      isFaceted = newFaceted
      this.updateCachedNormals()
    },
    get isFaceted() {
      return isFaceted
    },
    setIsFaceted: function (newVal) {
      this.facesChanged = true
      isFaceted = newVal
      this.updateCachedNormals()
      return this;
    },
    get normals() {
      if (!cachedNormals) {
        this.updateCachedNormals()
      }
      return cachedNormals
    },
    updateCachedNormals: function () {
      // If user switches, higher likelihood they will switch multiple times
      // normals calculations are SLOW
      // so just keep the cache, memory is cheaper than normal calculations
      // caches ALL normals if they are requested once

      if (this.ifFaceted) {
        if (this.isWireframe) {
          if (!cachedFacetedWireframeNormals) {
            cachedFacetedWireframeNormals = this.facetedNormals
          }
          cachedNormals = cachedFacetedWireframeNormals
        } else {
          if (!cachedFacetedFacesNormals) {
            cachedFacetedFacesNormals = this.facetedNormals
          }
          cachedNormals = cachedFacetedFacesNormals;
        }
      } else {
        if (this.isWireframe) {
          if (!cachedSmoothWireframeNormals) {
            cachedSmoothWireframeNormals = this.smoothNormals
          }
          cachedNormals = cachedSmoothWireframeNormals

        } else {
          if (!cachedSmoothFacesNormals) {
            cachedSmoothFacesNormals = this.smoothNormals
          }
          cachedNormals = cachedSmoothFacesNormals;
        }
      }
      this.change = true
      // cachedNormals = isFaceted ? this.facetedNormals : this.smoothNormals
    },


    get normalsByFace() {
      // Kept purely for its educational value!
      // this will be rolled into 'helperNormals' eventually
      // because calculating separate from 'by vertex' is a waste
      const normalsByFace = []
      // Matches facesByIndex in parallel

      facesByIndex.forEach(face => {
        // p1-p0 x p2-p0
        let n = new Vector(
          this.rawVertices[face[1]][0] - this.rawVertices[face[0]][0],
          this.rawVertices[face[1]][1] - this.rawVertices[face[0]][1],
          this.rawVertices[face[1]][2] - this.rawVertices[face[0]][2]
        ).cross(
          new Vector(
            this.rawVertices[face[2]][0] - this.rawVertices[face[0]][0],
            this.rawVertices[face[2]][1] - this.rawVertices[face[0]][1],
            this.rawVertices[face[2]][2] - this.rawVertices[face[0]][2]
          )
        )
        normalsByFace.push(n)
      })
      return normalsByFace
    },

    get normalsByRawVertex() {
      // Sum of normals at a vertex
      const normalsByRawVertex = Array(this.rawVertices.length).fill(new Vector(0, 0, 0))
      facesByIndex.forEach(face => {
        let v1 = new Vector(
          this.rawVertices[face[1]][0] - this.rawVertices[face[0]][0],
          this.rawVertices[face[1]][1] - this.rawVertices[face[0]][1],
          this.rawVertices[face[1]][2] - this.rawVertices[face[0]][2]
        )
        let v2 = new Vector(
          this.rawVertices[face[2]][0] - this.rawVertices[face[0]][0],
          this.rawVertices[face[2]][1] - this.rawVertices[face[0]][1],
          this.rawVertices[face[2]][2] - this.rawVertices[face[0]][2]
        )
        let n = v2.cross(v1)
        normalsByRawVertex[face[0]] = normalsByRawVertex[face[0]].add(n)
        normalsByRawVertex[face[1]] = normalsByRawVertex[face[1]].add(n)
        normalsByRawVertex[face[2]] = normalsByRawVertex[face[2]].add(n)
      })
      return normalsByRawVertex
    },

    get facetedNormals() {
      // We could use 'normalsByFace' for this
      // but i think this is moderatey more efficient :)
      // and doesn't require weird mapping from byFace to byVertex
      const normalsByVertex = []
      if (!this.isWireframe) {
        for (let i = 0; i < this.vertices.length; i += 9) {
          let n = new Vector(
            this.vertices[i + 6] - this.vertices[i + 0],
            this.vertices[i + 7] - this.vertices[i + 1],
            this.vertices[i + 8] - this.vertices[i + 2]
          ).cross(
            new Vector(
              this.vertices[i + 3] - this.vertices[i + 0],
              this.vertices[i + 4] - this.vertices[i + 1],
              this.vertices[i + 5] - this.vertices[i + 2]
            )
          )
          normalsByVertex.push(n.x, n.y, n.z) // Corresponding to vertex 0 of this face
          normalsByVertex.push(n.x, n.y, n.z)
          normalsByVertex.push(n.x, n.y, n.z)
        }
      } else {
        for (let i = 0; i < this.vertices.length; i += 18) {
          //         0       2       4 vertices
          // indices 0,1,2 : 6,7,8 : 12 13 14
          // 6 vertices per face (double counted as each line is 2 vertices)
          let n = new Vector(
            this.vertices[i + 6] - this.vertices[i + 0],
            this.vertices[i + 7] - this.vertices[i + 1],
            this.vertices[i + 8] - this.vertices[i + 2]
          ).cross(
            new Vector(
              this.vertices[i + 12] - this.vertices[i + 0],
              this.vertices[i + 13] - this.vertices[i + 1],
              this.vertices[i + 14] - this.vertices[i + 2]
            )
          )
          normalsByVertex.push(
            n.x,
            n.y,
            n.z, // Corresponding to vertex 0 of this face
            n.x,
            n.y,
            n.z,
            n.x,
            n.y,
            n.z,
            n.x,
            n.y,
            n.z,
            n.x,
            n.y,
            n.z,
            n.x,
            n.y,
            n.z
          )
        }
      }
      return normalsByVertex
    },

    get smoothNormals() {
      const normalsByVertex = []
      if (!this.isWireframe) {
        facesByIndex.forEach(face => {
          face.forEach(vertexIndex => {
            normalsByVertex.push(
              this.normalsByRawVertex[vertexIndex].x,
              this.normalsByRawVertex[vertexIndex].y,
              this.normalsByRawVertex[vertexIndex].z
            )
          })
        })
      } else {
        facesByIndex.forEach(face => {
          for (let i = 0, maxI = face.length; i < maxI; i += 1) {
            normalsByVertex.push(...this.normalsByRawVertex[i].elements)
            normalsByVertex.push(...this.normalsByRawVertex[i].elements)
          }
        })
      }
      return normalsByVertex
    },
  }
}


const Our3DObject = (mesh, colorArray = [0, 0, 0], name = 'A 3D Object') => {
  let matrix = Matrix()
  let cachedColors;
  let change = true;

  return {
    ...TransformableObject(),
    type: Our3DObject,
    // change: true,
    set change(newVal) {
      change = newVal
      this.mesh.change = newVal
    },
    get change() {
      return change
    },
    name,
    mesh,
    get vertices() {
      return mesh.vertices
    },
    get matrix() {
      return matrix
    },
    get color() {
      return this.colors //backwards compatibility
    },
    set colors(newColorArray) {
      colorArray = newColorArray
      cachedColors = this.calcColors()
    },
    get colors() {
      if (!cachedColors) {
        cachedColors = this.calcColors()
      }
      return cachedColors
    },
    calcColors: function () {
      let colors = []
      if (Array.isArray(colorArray[0]) && colorArray.length === this.mesh.facesByIndex.length) {
        if (!this.mesh.isWireframe) {
          // if they wish to pass color by face and it is NOT writeframe
          for (let i = 0, maxi = this.vertices.length / 9; i < maxi; i += 1) {
            for (let j = 0; j < 3; j++) {
              colors.push(colorArray[i][0])
              colors.push(colorArray[i][1])
              colors.push(colorArray[i][2])
            }
          }
        } else {
          // they wish to pass color by face BUT its a wireframe (ahh)
          // this obviously cant display /that/ well because one line ALWAYS borders two faces
          // so one object needs two colors? huh? so it logically can't display well
          // this is simply added so that .toWireframe doesn't break the entire program
          for (let faceIndex = 0; faceIndex < this.mesh.facesByIndex.length; faceIndex++) {
            for (let i = 0, maxI = this.mesh.facesByIndex[faceIndex].length; i < maxI; i += 1) {
              colors.push(...colorArray[faceIndex])
              colors.push(...colorArray[faceIndex])
            }
          }
        }
      } else if (Array.isArray(colorArray[0]) && colorArray.length === this.mesh.rawVertices.length) {
        // color by vertex
        if (!this.mesh.isWireframe) {
          this.mesh.facesByIndex.forEach(face => {
            face.forEach(vertexIndex => {
              colors.push(...colorArray[vertexIndex])
            })
          })
        } else {
          this.mesh.facesByIndex.forEach(face => {
            for (let i = 0, maxI = face.length; i < maxI; i += 1) {
              // “Connect the dots.”
              colors.push(
                ...colorArray[face[i]],
                ...colorArray[face[(i + 1) % maxI]] // Lets us wrap around to 0.
              )
            }
          })
        }
      } else if (Array.isArray(colorArray[0])) {
        // poorly shaped size ; rather than explode, we will choose the first colour
        // this is a CHOICE and this entire else-if can be removed to force errors for poorly sized colour arrays
        for (let i = 0, maxi = this.vertices.length / 3; i < maxi; i += 1) {
          colors = colors.concat(colorArray[0][0], colorArray[0][1], colorArray[0][2])
        }
      } else {
        for (let i = 0, maxi = this.vertices.length / 3; i < maxi; i += 1) {
          colors = colors.concat(colorArray[0], colorArray[1], colorArray[2])
        }
      }
      this.change = true
      return colors
    },
    get normals() {
      return mesh.normals
    },
    setColors: function (newColorArray) {
      (colorArray = newColorArray)
      cachedColors = this.calcColors()
      return this;
    },
    setRandomColors: function (n = 4, byVertex = true) {
      colorArray = []
      if (byVertex) {
        for (let i = 0; i < mesh.rawVertices.length; i++) {
          colorArray.push([Math.random() * n, Math.random() * n, Math.random() * n])
        }
      } else {
        for (let i = 0; i < mesh.facesByIndex.length; i++) {
          colorArray.push([Math.random() * n, Math.random() * n, Math.random() * n])
        }
      }
      cachedColors = this.calcColors()
      return this
    },
    toggleFaceted: function () {
      this.setIsFaceted(!this.isFaceted)
    },
    setIsFaceted: function (newVal) {
      mesh.setIsFaceted(newVal);
      return this;
    },
    get isFaceted() {
      return mesh.isFaceted
    },
    set isFaceted(newValue) {
      mesh.isFaceted = newValue
    },
    set isWireframe(newVal) {
      mesh.isWireframe = newVal;
      cachedColors = this.calcColors()
    },
    get isWireframe() {
      return mesh.isWireframe
    },
    toggleWireframe: function () {
      this.setWireframe(!this.isWireframe)
    },
    setWireframe: function (newIsWireframe) {
      mesh.setWireframe(newIsWireframe)
      cachedColors = this.calcColors()
      return this;
    },
    transform: function (transformMatrix) {
      matrix = transformMatrix.multiply(matrix);
      return this;
    },
    transformVertices: function (otherMatrix) {
      (mesh.vertices = mesh.rawVertices.map(vertex =>
        otherMatrix
          .multiply(Matrix([[vertex[0]], [vertex[1]], [vertex[2]], [1]]))
          .toArray()
          .slice(0, -1)
      ))
      return this
    }
  }
}

const Our3DGroup = (objects = [], name = 'A 3D Group') => {
  let group = []
  if (objects) {
    group.concat(objects)
  }
  let matrix = Matrix()
  return {
    ...TransformableObject(),
    get self() { return this },
    get group() {
      return group
    },
    get flatGroup() {
      const results = [].concat(this.group.filter(element => element.type === Our3DObject).flatMap(element => element))
        .concat(this.group.filter(element => element.type === Our3DGroup).map(element => element.flatGroup).flatMap(element => element))
      return results;
    },
    set group(newVal) {
      group = newVal
    },
    name,
    set change(newVal) {
      this.group.forEach(object => object.change = newVal)
    },
    get change() {
      for (let object of group) {
        if (object.change) {
          return true
        }
      }
      return false
    },
    get matrix() {
      return matrix
    },
    type: Our3DGroup,
    add: function (object) {
      group.push(object)
      return this;
    },
    remove: function (object) {
      this.group = this.group.filter(groupObject => groupObject !== object)
      this.group.filter(element => element.type === Our3DGroup).forEach(nestedGroup => nestedGroup.remove(object))
      return this;
    },
    transform: function (transformMatrix) {
      group.forEach(object => object.transform(transformMatrix))
      return this;
    },
    setColors: function (newColorArray) {
      group.forEach(object => object.setColors(newColorArray))
      return this;
    },
    toggleWireframe: function () {
      group.forEach(object => object.toggleWireframe())
    },
    setWireframe: function (newIsWireframe) {
      group.forEach(object => object.setWireframe(newIsWireframe))
      return this
    },
    setRandomColors: function (n = 5, byVertex = true) {
      group.forEach(object => object.setRandomColors(n, byVertex))
      return this
    },
    transformVertices: function (transformMatrix) {
      group.forEach(object => object.transformVertices(transformMatrix))
      return this
    },
    set isFaceted(newVal) {
      group.forEach(object => object.isFaceted = newVal)
    },
    setIsFaceted: function (newVal) {
      group.forEach(object => object.setIsFaceted(newVal))
      return this;
    },
    toggleFaceted: function () {
      group.forEach(object => object.toggleFaceted())
      return this;
    },
    getObjectByName: function (searchName) {
      if (group.find(element => element.name === searchName))
        return group.filter(element => element.type === Our3DObject || element.type === Our3DGroup).find(element => element.name === searchName)
      else {
        return group.filter(element => element.type === Our3DGroup).map(element => element.getObjectByName(searchName))
          .filter(element => element !== undefined).flatMap(element => element)[0]
      }
    }
  }
}

const OurLight = (direction = [0, 0, 0], color = [1, 1, 1]) => {
  return {
    type: OurLight,
    direction: direction,
    color: color
  }
}

const OurAmbientLight = (color = [1, 1, 1]) => {
  return {
    type: OurAmbientLight,
    color
  }
}

const OurCamera = (center, direction, projectionOptions, projectionType = MatrixLibrary.perspectiveMatrix) => {
  let matrix = Matrix()
    .multiply(MatrixLibrary.translationMatrix(center[0], center[1], center[2]))
    .multiply(MatrixLibrary.rotationMatrix(direction[0], direction[1], direction[2]))

  const projectionMatrix = projectionType(...projectionOptions)

  return {
    ...TransformableObject(),
    type: OurCamera,
    get matrix() {
      return projectionMatrix.multiply(matrix).toArray()
    },
    set matrix(newMatrix) {
      matrix = newMatrix
    },
    translate: function (x, y, z) {
      (matrix = matrix.multiply(MatrixLibrary.translationMatrix(x, y, z)))
      return this
    },
    rotate: function (x, y, z) {
      (matrix = matrix.multiply(MatrixLibrary.rotationMatrix(x, y, z)))
      return this
    },
    projectionMatrix
  }
}

export { OurAmbientLight, OurMesh, Our3DGroup, Our3DObject, OurLight, OurCamera }
