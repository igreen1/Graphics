import { Matrix, MatrixLibrary } from './OurMatrix'

describe('Matrix implementation', () => {
  describe('Matrix Library', () => {
    it('should successfully create a scale matrix', () => {
      const xScaleFactor = 2
      const yScaleFactor = 5
      const zScaleFactor = .5
      const resultMatrix = [
        [2, 0,  0, 0],
        [0, 5,  0, 0],
        [0, 0, .5, 0],
        [0, 0,  0, 1]
      ]

      expect(MatrixLibrary.scaleMatrix(xScaleFactor, yScaleFactor, zScaleFactor).elements).toStrictEqual(resultMatrix)
    })

    it('should successfully create a translation matrix', () => {
      const xTranslation = 1
      const yTranslation = 3
      const zTranslation = 5
      const resultMatrix = [
        [1, 0, 0, 1],
        [0, 1, 0, 3],
        [0, 0, 1, 5],
        [0, 0, 0, 1]
      ]

      expect(MatrixLibrary.translationMatrix(xTranslation, yTranslation, zTranslation).elements).toStrictEqual(resultMatrix)
    })

    it('should successfully create a rotation matrix', () => {
      const xRotation = 0
      const yRotation = Math.PI
      const zRotation = Math.PI/2
      const resultMatrix = [
        [0, 1, 0, 0],
        [1, 0, 0, 0],
        [0, 0,-1, 0],
        [0, 0, 0, 1]
      ]

      expect(MatrixLibrary.rotationMatrix(xRotation, yRotation, zRotation).elements).toStrictEqual(resultMatrix)
    })
  })

  describe('Matrix Properties', () => {
    it('should get dimension properly', () => {
      const m1 = Matrix([
        [2, 0,  0, 1],
        [0, 5,  0, 0],
        [2, 0,  8, 0],
        [5, 0,  0, 1]
      ])

      const m2 = Matrix([
        [2, 0,  0, 0, 1, 3],
        [0, 5,  0, 0, 4, 5],
      ])

      const m1ToArray = [2,0,2,5,0,5,0,0,0,0,8,0,1,0,0,1]

      expect(m1.getRows()).toBe(4)
      expect(m1.getColumns()).toBe(4)
      expect(m2.getRows()).toBe(2)
      expect(m2.getColumns()).toBe(6)
      expect(m1.toArray()).toStrictEqual(m1ToArray)
    })
  })

  describe('Matrix Multiplication', () => {
    it('should perform scalar multiplication correctly', () => {
      const m1 = Matrix([
        [ 1, 2,  3, 4],
        [-1, 1, -1, 1],
        [ 0, 3,  6, 9],
        [ 5, 4,  3, 2]
      ])

      const scalar = 2

      const result = [
        [ 2, 4,  6, 8],
        [-2, 2, -2, 2],
        [ 0, 6, 12,18],
        [10, 8,  6, 4]
      ]

      expect(m1.scalarMultiply(scalar).elements).toStrictEqual(result)
    })

    it('should perform matrix multiplication correctly', () => {
      const m1 = Matrix([
        [ 1, 2,  3, 4],
        [-1, 1, -1, 1],
        [ 0, 3,  6, 9],
        [ 5, 4,  3, 2]
      ])

      const m2 = Matrix([
        [5, 8, 11, 1],
        [2,-4,  6, 8],
        [3, 0,  5, 9],
        [1, 2,  4, 8]
      ])

      const result = [
        [22,  8,  54,  76],
        [-5,-10,  -6,   6],
        [33,  6,  84, 150],
        [44, 28, 102,  80]
      ]

      expect(m1.multiply(m2).elements).toStrictEqual(result)
    })
  })
})
