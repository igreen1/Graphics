/**
 * This JavaScript module defines a Vector object and associated functions.
 *
 * The module’s approach is non-destructive: methods always return new
 * Vector objects and never modify the operands. This is a design choice.
 *
 * The module is designed for vectors of any number of dimensions. The
 * implementations are generalized but not optimal for certain sizes of
 * vectors. Specific Vector2D and Vector3D implementations can be much
 * more compact, while sacrificing generality.
 */

// THANKS @ DONDI !!!! 

/**
 * A private method for checking dimensions, throwing an exception when different.
 */
 const checkDimensions = (v1, v2) => {
  if (v1.dimensions !== v2.dimensions) {
    throw Error('Vectors have different dimensions')
  }
}

// Define the class.
class Vector {
  constructor() {
    this.elements = [].slice.call(arguments)
  }

  get dimensions() {
    return this.elements.length
  }

  get x() {
    return this.elements[0]
  }

  get y() {
    return this.elements[1]
  }

  get z() {
    return this.elements[2]
  }

  get w() {
    return this.elements[3]
  }

  add(v) {
    let result = new Vector()

    checkDimensions(this, v)

    for (let i = 0, max = this.dimensions; i < max; i += 1) {
      result.elements[i] = this.elements[i] + v.elements[i]
    }

    return result
  }

  subtract(v) {
    let result = new Vector()

    checkDimensions(this, v)

    for (let i = 0, max = this.dimensions; i < max; i += 1) {
      result.elements[i] = this.elements[i] - v.elements[i]
    }

    return result
  }

  multiply(s) {
    let result = new Vector()

    for (let i = 0, max = this.dimensions; i < max; i += 1) {
      result.elements[i] = this.elements[i] * s
    }

    return result
  }

  divide(s) {
    let result = new Vector()

    for (let i = 0, max = this.dimensions; i < max; i += 1) {
      result.elements[i] = this.elements[i] / s
    }

    return result
  }

  dot(v) {
    let result = 0

    checkDimensions(this, v)

    for (let i = 0, max = this.dimensions; i < max; i += 1) {
      result += this.elements[i] * v.elements[i]
    }

    return result
  }

  cross(v) {
    if (this.dimensions !== 3 || v.dimensions !== 3) {
      throw Error('Cross product is for 3D vectors only.')
    }

    // With 3D vectors, we can just return the result directly.
    return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x)
  }

  get magnitude() {
    return Math.sqrt(this.dot(this))
  }

  get unit() {
    // At this point, we can leverage our more "primitive" methods.
    return this.divide(this.magnitude)
  }

  normalize(){
    return this.divide(this.magnitude)
  }

  projection(v) {
    checkDimensions(this, v)

    // Plug and chug :)
    // The projection of u onto v is u dot the unit vector of v
    // times the unit vector of v.
    let unitv = v.unit
    return unitv.multiply(this.dot(unitv))
  }
}


/**
 * Utility function for turning our nascent geometry object into a “raw” coordinate array
 * arranged as triangles.
 */
 const toRawTriangleArray = protoGeometry => {
  const result = []

  protoGeometry.facesByIndex.forEach(face => {
    face.forEach(vertexIndex => {
      result.push(...protoGeometry.vertices[vertexIndex])
    })
  })

  return result
}

/*
 * Utility function for turning indexed vertices into a “raw” coordinate array
 * arranged as line segments.
 */
const toRawLineArray = protoGeometry => {
  const result = []

  protoGeometry.facesByIndex.forEach(face => {
    // Oddly enough, the inner loop here is clearer as a `for` loop because we
    // need to access the current vertex index and the one after that (wrapping
    // around once we get to the end).
    for (let i = 0, maxI = face.length; i < maxI; i += 1) {
      // “Connect the dots.”
      result.push(
        ...protoGeometry.vertices[face[i]],
        ...protoGeometry.vertices[face[(i + 1) % maxI]] // Lets us wrap around to 0.
      )
    }
  })

  return result
}

export { Vector, toRawLineArray, toRawTriangleArray }
