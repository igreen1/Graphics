import { MatrixLibrary } from './OurMatrix'
import * as Transformations from './OurTransformations'

const MatrixAnimation = (objectToAffect, animationMatrix) => {
  return {
    tick: () => {
      objectToAffect.transform(animationMatrix);
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

  const affectMatrix = Transformations.RotateAboutPoint(point, rotation)

  return {
    tick: () => {
      objectToAffect.transform(affectMatrix)
    }
  }

}

export { MatrixAnimation, RotateAboutPoint }