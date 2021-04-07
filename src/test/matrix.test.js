import { Matrix, MatrixLibrary } from '../OurMatrix'

describe('Matrix implementation', () => {
  describe('Matrix Library', () => {
    it('should successfully create a scale matrix', () => {
      const xScaleFactor = 2
      const yScaleFactor = 5
      const zScaleFactor = 0.5
      const resultMatrix = [
        [2, 0, 0, 0],
        [0, 5, 0, 0],
        [0, 0, 0.5, 0],
        [0, 0, 0, 1]
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
      expect(MatrixLibrary.translationMatrix(xTranslation, yTranslation, zTranslation).elements).toStrictEqual(
        resultMatrix
      )
    })

    it('should successfully create a rotation matrix', () => {
      const xRotation = 0
      const yRotation = Math.PI
      const zRotation = Math.PI / 2
      const resultMatrix = [
        [0, 1, 0, 0],
        [1, 0, 0, 0],
        [0, 0, -1, 0],
        [0, 0, 0, 1]
      ]

      for (let i = 0; i < resultMatrix.length; i++) {
        for (let j = 0; j < resultMatrix[0].length; j++) {
          expect(MatrixLibrary.rotationMatrix(xRotation, yRotation, zRotation).elements[i][j]).toBeCloseTo(
            resultMatrix[i][j]
          )
        }
      }
    })
  })

  describe('Matrix Properties', () => {
    it('should get dimension properly', () => {
      const m1 = Matrix([
        [2, 0, 0, 1],
        [0, 5, 0, 0],
        [2, 0, 8, 0],
        [5, 0, 0, 1]
      ])

      const m2 = Matrix([
        [2, 0, 0, 0, 1, 3],
        [0, 5, 0, 0, 4, 5]
      ])

      const m1ToArray = [2, 0, 2, 5, 0, 5, 0, 0, 0, 0, 8, 0, 1, 0, 0, 1]

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
        [1, 2, 3, 4],
        [-1, 1, -1, 1],
        [0, 3, 6, 9],
        [5, 4, 3, 2]
      ])

      const scalar = 2

      const result = [
        [2, 4, 6, 8],
        [-2, 2, -2, 2],
        [0, 6, 12, 18],
        [10, 8, 6, 4]
      ]

      expect(m1.scalarMultiply(scalar).elements).toStrictEqual(result)
    })

    it('should perform matrix multiplication correctly', () => {
      const m1 = Matrix([
        [1, 2, 3, 4],
        [-1, 1, -1, 1],
        [0, 3, 6, 9],
        [5, 4, 3, 2]
      ])

      const m2 = Matrix([
        [5, 8, 11, 1],
        [2, -4, 6, 8],
        [3, 0, 5, 9],
        [1, 2, 4, 8]
      ])

      const result = [
        [22, 8, 54, 76],
        [-5, -10, -6, 6],
        [33, 6, 84, 150],
        [44, 28, 102, 80]
      ]

      expect(m1.multiply(m2).elements).toStrictEqual(result)
    })
  })
  describe('Translation Matrix', ()=>{
    it('Should perform x translation correctly', ()=>{
      const resultMatrix = [
        [1, 0, 0, 0.5],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ]

      const xTranslation = 0.5
      const yTranslation = 0
      const zTranslation = 0

      for (let i = 0; i < resultMatrix.length; i++) {
        for (let j = 0; j < resultMatrix[0].length; j++) {
          expect(
            Matrix().multiply(MatrixLibrary.translationMatrix(xTranslation, yTranslation, zTranslation)).elements[i][j]
          ).toBeCloseTo(resultMatrix[i][j])
        }
      }
    })
    it('Should perform y translation correctly', ()=>{
      const resultMatrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0.5],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ]

      const xTranslation = 0
      const yTranslation = 0.5
      const zTranslation = 0

      for (let i = 0; i < resultMatrix.length; i++) {
        for (let j = 0; j < resultMatrix[0].length; j++) {
          expect(
            Matrix().multiply(MatrixLibrary.translationMatrix(xTranslation, yTranslation, zTranslation)).elements[i][j]
          ).toBeCloseTo(resultMatrix[i][j])
        }
      }
    })
    it('Should perform z translation correctly', ()=>{
      const resultMatrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0.5],
        [0, 0, 0, 1]
      ]

      const xTranslation = 0
      const yTranslation = 0
      const zTranslation = 0.5

      for (let i = 0; i < resultMatrix.length; i++) {
        for (let j = 0; j < resultMatrix[0].length; j++) {
          expect(
            Matrix().multiply(MatrixLibrary.translationMatrix(xTranslation, yTranslation, zTranslation)).elements[i][j]
          ).toBeCloseTo(resultMatrix[i][j])
        }
      }
    })
    it('Should perform x,y,z translation correctly', ()=>{
      const resultMatrix = [
        [1, 0, 0, 0.89],
        [0, 1, 0, 0.75],
        [0, 0, 1, 0.5],
        [0, 0, 0, 1]
      ]

      const xTranslation = 0.89
      const yTranslation = 0.75
      const zTranslation = 0.5

      for (let i = 0; i < resultMatrix.length; i++) {
        for (let j = 0; j < resultMatrix[0].length; j++) {
          expect(
            Matrix().multiply(MatrixLibrary.translationMatrix(xTranslation, yTranslation, zTranslation)).elements[i][j]
          ).toBeCloseTo(resultMatrix[i][j])
        }
      }
    })
  })
  describe('Rotation Matrix', () => {
    it('Should perform x rotation correctly', () => {
      const resultMatrix = [
        [1, 0, 0, 0],
        [0, -1, 0, 0],
        [0, 0, -1, 0],
        [0, 0, 0, 1]
      ]

      const xRotation = Math.PI
      const yRotation = 0
      const zRotation = 0

      for (let i = 0; i < resultMatrix.length; i++) {
        for (let j = 0; j < resultMatrix[0].length; j++) {
          expect(
            Matrix().multiply(MatrixLibrary.rotationMatrix(xRotation, yRotation, zRotation)).elements[i][j]
          ).toBeCloseTo(resultMatrix[i][j])
        }
      }
    })

    it('Should perform y rotation correctly', () => {
      const resultMatrix = [
        [-1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, -1, 0],
        [0, 0, 0, 1]
      ]

      const xRotation = 0
      const yRotation = Math.PI
      const zRotation = 0

      for (let i = 0; i < resultMatrix.length; i++) {
        for (let j = 0; j < resultMatrix[0].length; j++) {
          expect(
            Matrix().multiply(MatrixLibrary.rotationMatrix(xRotation, yRotation, zRotation)).elements[i][j]
          ).toBeCloseTo(resultMatrix[i][j])
        }
      }
    })

    it('Should perform z rotation correctly', () => {
      const resultMatrix = [
        [-1, 0, 0, 0],
        [0, -1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ]

      const xRotation = 0
      const yRotation = 0
      const zRotation = Math.PI

      for (let i = 0; i < resultMatrix.length; i++) {
        for (let j = 0; j < resultMatrix[0].length; j++) {
          expect(
            Matrix().multiply(MatrixLibrary.rotationMatrix(xRotation, yRotation, zRotation)).elements[i][j]
          ).toBeCloseTo(resultMatrix[i][j])
        }
      }
    })

    it('Should perform x,y,z rotation correctly', () => {
      const resultMatrix = [
        [0, 0, 1, 0],
        [0, -1, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 1]
      ]

      const xRotation = Math.PI / 2
      const yRotation = Math.PI / 2
      const zRotation = Math.PI / 2

      for (let i = 0; i < resultMatrix.length; i++) {
        for (let j = 0; j < resultMatrix[0].length; j++) {
          expect(
            Matrix().multiply(MatrixLibrary.rotationMatrix(xRotation, yRotation, zRotation)).elements[i][j]
          ).toBeCloseTo(resultMatrix[i][j])
        }
      }
    })

    it('Rotating by increments of PI should be the same', () => {
      const m1 = [Matrix().multiply(MatrixLibrary.rotationMatrix(Math.PI, Math.PI / 2, Math.PI))]
      const m2 = [Matrix().multiply(MatrixLibrary.rotationMatrix(0, 10 * Math.PI - Math.PI / 2, -Math.PI))]

      for (let i = 0; i < m1.length; i++) {
        for (let j = 0; j < m1[0].length; j++) {
          expect(m1.elements[i][j]).toBeCloseTo(m2[i][j])
        }
      }
    })
  })


  describe('Perspective Matrix', () => {
    it('Should change perspective of identity matrix', () => {
      const m1 = Matrix([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ])
      const resultMatrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 3, 16],
        [0, 0, -1, 0]
      ]

      const top = 8
      const bottom = -8
      const left = -8
      const right = 8
      const near = 8
      const far = 4

      expect(m1.multiply(MatrixLibrary.perspectiveMatrix(top, bottom, right, left, near, far)).elements).toStrictEqual(
        resultMatrix
      )
    })
  })
})
