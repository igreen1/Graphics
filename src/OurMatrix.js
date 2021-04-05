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
    // prettier-ignore
    return Matrix([
      [width,      0,     0, 0],
      [    0, height,     0, 0],
      [    0,      0, depth, 0],
      [    0,      0,     0, 1]
    ])
  },

  translationMatrix: (x, y, z) => {
    return Matrix([
      [1, 0, 0, x],
      [0, 1, 0, y],
      [0, 0, 1, z],
      [0, 0, 0, 1]
    ])
  },

  rotationMatrix: (x, y, z) => {
    // prettier-ignore
    const xRotationMatrix = Matrix([
      [1,           0,            0, 0],
      [0, Math.cos(x), -Math.sin(x), 0],
      [0, Math.sin(x),  Math.cos(x), 0],
      [0,           0,            0, 1]
    ])
    // prettier-ignore
    const yRotationMatrix = Matrix([
      [ Math.cos(y), 0, Math.sin(y), 0],
      [           0, 1,           0, 0],
      [-Math.sin(y), 0, Math.cos(y), 0],
      [           0, 0,           0, 1]
    ])
    // prettier-ignore
    const zRotationMatrix = Matrix([
      [Math.cos(z), -Math.sin(z), 0, 0],
      [Math.sin(z),  Math.cos(z), 0, 0],
      [          0,            0, 1, 0],
      [          0,            0, 0, 1]
    ])
    return xRotationMatrix.multiply(yRotationMatrix.multiply(zRotationMatrix))
  },

  orthographicProjectionMatrix: (top, bottom, right, left, near, far) => {
    // prettier-ignore
    return Matrix([
      [2/(right - left),                0,                  0, -((right + left)/(right - left))],
      [               0, (2/(top-bottom)),                  0, -((top+bottom)/(top - bottom))  ],
      [               0,                0,  -(2/(far - near)), -(far + near)/(far - near)      ],
      [               0,                0,                  0,                                1]
    ])
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

  let rows = elements.length
  let columns = elements[0].length

  const getRows = () => {
    return rows
  }

  const getColumns = () => {
    return columns
  }

  const toArray = () => {
    //Convert to column-major order
    if (rows <= 0 || columns <= 0) return []

    const resultArray = []

    for (let column = 0; column < columns; column++) {
      for (let row = 0; row < rows; row++) {
        resultArray.push(elements[row][column])
      }
    }
    return resultArray
  }

  const scalarMultiply = (scalar) => {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        elements[row][col] *= scalar
      }
    }
    return Matrix(elements)
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
      throw new Error('Matrix size incompatible for multiplication')
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

  return {
    elements,
    getRows,
    getColumns,
    scalarMultiply,
    multiply,
    toArray
  }
}

export { Matrix, MatrixLibrary }
