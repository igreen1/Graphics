import { MatrixLibrary } from './OurMatrix'


// Just an 'apply' for our Transform
const Transform = (object, matrix) => {
  object.transform(matrix);
}

const Translate = (object, x, y, z) => {
  Transform(object, MatrixLibrary.translationMatrix(x, y, z))
}

const Rotate = (object, x, y, z) => {
  Transform(object, MatrixLibrary.rotationMatrix(x, y, z))
}

const Scale = (object, width, height, depth) => {
  Transform(object, MatrixLibrary.scaleMatrix(width, height, depth))
}

const RotateAboutPoint = (object, point, rotation) => {
  Transform(object, MatrixLibrary.rotateAboutPoint(point, rotation))
}

const TransformableObject = () => {
  // A method to add 'transform' functions to our objects
  // a way to do a parent class without actually doing a parent class
  return {
    translate: function (x, y, z) {
      Translate(this, x, y, z)
      return this
    },
    rotate: function (x, y, z) {
      Rotate(this, x, y, z)
      return this
    },
    scale: function (width, height, depth) {
      Scale(this, width, height, depth)
      return this
    },
    rotateAboutPoint: function (point, rotation) {
      RotateAboutPoint(this, point, rotation)
      return this;
    }
  }
}

export { TransformableObject, Translate, Rotate, Scale, Transform, RotateAboutPoint }