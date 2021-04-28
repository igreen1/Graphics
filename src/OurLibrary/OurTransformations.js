import { Matrix, MatrixLibrary } from './OurMatrix'

const RotateAboutPoint = (point = [0, 0, 0], rotation = [0, 0, 0]) => {
  return MatrixLibrary.translationMatrix(...point)
    .multiply(MatrixLibrary.rotationMatrix(...rotation))
    .multiply(MatrixLibrary.translationMatrix(...point.map(element => -element)))

}

const Transform = (object, matrix) => { 
  object.transform(matrix);
}


export { RotateAboutPoint }