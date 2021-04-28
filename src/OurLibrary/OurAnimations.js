import { MatrixLibrary } from './OurMatrix'

const MatrixAnimation = (objectToAffect, animationMatri) => {
  return {
    tick: () => {
      objectToAffect.transform(animationMatri);
    }
  }
}

const RotateAboutPoint = (objectToAffect, point = [0, 0, 0], rotation = [0, 0, 0]) => {
  // Creates a rotation about point
  /*
  Algorithm from https://www.javatpoint.com/computer-graphics-rotation
  1. Translate by point ('set' point as origin)
  2. rotate by 'rotation'
  3. Inverse of before rotation
  */

  const affectMatrix = MatrixLibrary.translationMatrix(...point)
    .multiply(MatrixLibrary.rotationMatrix(...rotation))
    .multiply(MatrixLibrary.translationMatrix(...point.map(element => -element)))

  return {
    tick: () => {
      objectToAffect.transform(affectMatrix)
    }
  }

}

export { MatrixAnimation, RotateAboutPoint }