/*

    A basic 4×4 matrix object that initializes, by default, to the identity matrix
    Matrix multiplication
    Collection of 3D matrix implementations (contributed individually)
        3D translation
        3D scale
        3D rotation about on an arbitrary axis (you may refactor the sample code to fit your matrix object implementation)
        Orthographic projection
        Perspective (frustum) projection
    Conversion/convenience functions to prepare the matrix data for direct consumption by WebGL and GLSL

*/

/*
Row Column form note:
https://en.wikipedia.org/wiki/Row-_and_column-major_order

*/

const MatrixLibrary = {
  scaleMatrix: (width, height, depth) => {
    return Matrix([
      [width, 0, 0, 0],
      [0, height, 0, 0],
      [0, 0, depth, 0],
      [0, 0, 0, 1]
    ])
  },

  translationMatrix: (x, y, z) => {
    return Matrix([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [x, y, z, 1]
    ])
  },

  rotationMatrix: (x, y, z) => {
    const xRotationMatrix = Matrix([
      [1, 0, 0, 0],
      [0, Math.cos(x), -Math.sin(x), 0],
      [0, Math.sin(x), Math.cos(x), 0],
      [0, 0, 0, 1]
    ])
    const yRotationMatrix = Matrix([
      [Math.cos(y), 0, Math.sin(y), 0],
      [0, 1, 0, 0],
      [-Math.sin(y), 0, Math.cos(y), 0],
      [0, 0, 0, 1]
    ])
    const zRotationMatrix = Matrix([
      [Math.cos(z), -Math.sin(z), 0, 0],
      [Math.sin(z), Math.cos(z), 0, 0],
      [0, 0, 0, 1],
      [0, 0, 0, 1]
    ])
    return xRotationMatrix.multiply(yRotationMatrix.multiply(zRotationMatrix))
  }
}

const Matrix = initialValue => {
  let elements = initialValue
    ? initialValue
    : [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ]

  const toArray = () => {
    //Convert to column-major order
    if (elements.length <= 0 || elements[0].length <= 0) return []

    const resultArray = []

    for (let column = 0; column < elements[0].length; column++) {
      for (let row = 0; row < elements.length; row++) {
        resultArray.push(elements[row][column])
      }
    }
    return resultArray
  }

  const multiply = otherMatrix => {
    //TODO cleanup
    if (
      !otherMatrix ||
      !Array.isArray(otherMatrix.elements) ||
      elements.length <= 0 ||
      otherMatrix.elements.length <= 0 ||
      elements[0].length <= 0 ||
      otherMatrix.elements[0].length <= 0
    ) {
      throw new Error('Cannot multiply matrices ')
    } else if (otherMatrix.elements.length !== elements[0].length) {
      throw new Error('Matrix size incompatible for mulitplication')
    }

    let rowProduct = Array.apply(null, new Array(otherMatrix.elements[0].length)).map(Number.prototype.valueOf, 0)
    let result = new Array(elements.length)
    for (let row = 0; row < elements.length; row++) {
      result[row] = rowProduct.slice()
    }

    for (let aRow = 0; aRow < elements.length; aRow++) {
      for (let bRow = 0; bRow < otherMatrix.elements[0].length; bRow++) {
        for (let col = 0; col < elements[0].length; col++) {
          result[aRow][bRow] += elements[aRow][col] * otherMatrix.elements[col][bRow]
        }
      }
    }

    return Matrix(result)
  }

  const rotate = (x, y, z) => {
    const xRotationMatrix = Matrix([
      [1, 0, 0, 0],
      [0, Math.cos(x), -Math.sin(x), 0],
      [0, Math.sin(x), Math.cos(x), 0],
      [0, 0, 0, 1]
    ])
    const yRotationMatrix = Matrix([
      [Math.cos(y), 0, Math.sin(y), 0],
      [0, 1, 0, 0],
      [-Math.sin(y), 0, Math.cos(y), 0],
      [0, 0, 0, 1]
    ])
    const zRotationMatrix = Matrix([
      [Math.cos(z), -Math.sin(z), 0, 0],
      [Math.sin(z), Math.cos(z), 0, 0],
      [0, 0, 0, 1],
      [0, 0, 0, 1]
    ])
    return xRotationMatrix.multiply(yRotationMatrix.multiply(zRotationMatrix))
  }

  // const getRotationMatrix = (angle, x, y, z) => {
  //   // In production code, this function should be associated
  //   // with a matrix object with associated functions.
  //   const axisLength = Math.sqrt(x * x + y * y + z * z)
  //   const s = Math.sin((angle * Math.PI) / 180.0)
  //   const c = Math.cos((angle * Math.PI) / 180.0)
  //   const oneMinusC = 1.0 - c

  //   // Normalize the axis vector of rotation.
  //   x /= axisLength
  //   y /= axisLength
  //   z /= axisLength

  //   // Now we can calculate the other terms.
  //   // "2" for "squared."
  //   const x2 = x * x
  //   const y2 = y * y
  //   const z2 = z * z
  //   const xy = x * y
  //   const yz = y * z
  //   const xz = x * z
  //   const xs = x * s
  //   const ys = y * s
  //   const zs = z * s

  //   // GL expects its matrices in column major order.
  //   return [
  //     x2 * oneMinusC + c,
  //     xy * oneMinusC + zs,
  //     xz * oneMinusC - ys,
  //     0.0,

  //     xy * oneMinusC - zs,
  //     y2 * oneMinusC + c,
  //     yz * oneMinusC + xs,
  //     0.0,

  //     xz * oneMinusC + ys,
  //     yz * oneMinusC - xs,
  //     z2 * oneMinusC + c,
  //     0.0,

  //     0.0,
  //     0.0,
  //     0.0,
  //     1.0
  //   ]
  // }

  const scale = (width, height, depth) => {
    const scaleMatrix = Matrix([
      [width, 0, 0, 0],
      [0, height, 0, 0],
      [0, 0, depth, 0],
      [0, 0, 0, 1]
    ])
    return scaleMatrix
  }

  const translate = (x, y, z) => {
    const translationMatrix = Matrix([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [x, y, z, 1]
    ])
    //return (multiply(translationMatrix))
    return translationMatrix
  }

  return {
    elements,
    multiply,
    rotate,
    scale,
    translate,
    toArray
  }
}

export { Matrix, MatrixLibrary }
