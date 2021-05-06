import * as Geometries from './OurGeometryLibrary'
import { useInitWebGL, ReactWebGL } from './OurWebGL'
import { Matrix, MatrixLibrary } from './OurMatrix'
import { BigBang, Scene } from './OurUniverse'
import * as Animations from './OurAnimations'
import { OurAmbientLight, Our3DGroup, OurLight, OurCamera } from './Our3DObject'
import * as Transformations from './OurTransformations'
import { OurCachedObject, OurCachedMesh } from './OurCachedMeshes'

// This file just allows for one large import to access all our library

// Maintained for backwards compatibility :)
const Our3DObject = OurCachedObject
const OurMesh = OurCachedMesh

export {
  Geometries,
  useInitWebGL,
  ReactWebGL,
  Matrix,
  BigBang,
  Scene,
  Animations,
  OurMesh,
  Our3DGroup,
  Our3DObject,
  OurLight,
  OurCamera,
  MatrixLibrary,
  OurAmbientLight,
  Transformations
}
