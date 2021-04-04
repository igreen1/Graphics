

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


const Matrix = (initialValue) => {

  let elements = initialValue ? initialValue :
    [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]

  const toArray = () => {
    //Convert to column-major order
    if (elements.length <= 0 || elements[0].length <= 0) return ([])

    const resultArray = []

    for (let column = 0; column < elements[0].length; column++) {
      for (let row = 0; row < elements.length; row++) {
        resultArray.push(elements[row][column])
      }
    }
    return resultArray
  }

  const multiply = (otherMatrix) => {
    //TODO cleanup 
    if (!otherMatrix || !Array.isArray(otherMatrix.elements) || elements.length <= 0
      || otherMatrix.elements.length <= 0 || elements[0].length <= 0 || otherMatrix.elements[0].length <= 0) {
      throw new Error('Cannot multiply matrices ')
    }

    else if (otherMatrix.elements.length !== elements[0].length) {
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

  const rotation = (radians) => {
    const rotationMatrix = Matrix([
        [Math.cos(radians), -Math.sin(radians), 0, 0],
        [Math.sin(radians),  Math.cos(radians), 0, 0],
        [0                ,  0                , 0, 1]
      ])
    return (multiply(rotationMatrix))
  }

  const scale = (width, height, depth) => {
    const scaleMatrix = Matrix([
      [width, 0     , 0    , 0],
      [0    , height, 0    , 0],
      [0    , 0     , depth, 1]
    ])
    return (multiply(scaleMatrix))
  }

  const translate = (x,y,z) => {
    const translationMatrix = Matrix([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [x, y, z, 1]
    ])
    return (multiply(translationMatrix))
  }

  return {
    elements,
    multiply,
    rotation,
    scale,
    translate,
    toArray,
  }

}

export {Matrix}