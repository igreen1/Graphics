import { getGL, initVertexBuffer, initSimpleShaderProgram } from './glsl-utilities'
import { Our3DObject, OurMesh, Our3DGroup } from './Our3DObject'
import { Cone, Cylinder, Extrude, RegularPolygon, Sphere, Tube, Torus } from './GeometryLibrary'
import { Matrix, MatrixLibrary } from './OurMatrix'
import { BigBang, Scene } from './Universe'
import { createUniverseFromJSON } from './CreateUniverseFromJSON'

const { universe, setUniverse, addToUniverse, removeFromUniverse } = Scene()

const createLibraryObject = (type, parameters, wireframe, colorParameters, translations) => {
  const objectDict = {
    "Cone": Cone,
    "Cylinder": Cylinder,
    "Extrude": Extrude,
    "RegularPolygon": RegularPolygon,
    "Sphere": Sphere,
    "Tube": Tube,
    "Torus": Torus
  }
  const libraryObject = objectDict[type]
  if (parameters) {
    let object = Our3DObject(OurMesh(libraryObject(parameters), wireframe), colorParameters)
    translations.forEach((translation) => applyPredefinedMatrix(translation.type, object, ...translation.parameters))
    addToUniverse(object)
  } else {
    let object = Our3DObject(OurMesh(libraryObject(), wireframe), colorParameters)
    translations.forEach((translation) => applyPredefinedMatrix(translation.type, object, ...translation.parameters))
    addToUniverse(object)
  }
}

const createCustomObject = (vertex2DArray, faceArray, isWireframe, colorParameters, translations) => {
  let vertices = vertex2DArray
  let facesByIndex = faceArray
  const mesh = {vertices, facesByIndex}
  let object = Our3DObject(OurMesh(mesh, isWireframe), colorParameters);
  translations.forEach((translation) => applyPredefinedMatrix(translation.type, object, ...translation.parameters))
  addToUniverse(object)
}

const applyPredefinedMatrix = (matrixToApply, element, ...parameters) => {
  const objectDict = {
    "Scale": MatrixLibrary.scaleMatrix(parameters),
    "Translate": MatrixLibrary.scaleMatrix(parameters),
    "Rotate": MatrixLibrary.rotateMatrix(parameters),
    "Orthographic Projection": MatrixLibrary.orthographicProjectionMatrix(parameters),
    "Change Perspective": MatrixLibrary.perspectiveMatrix(parameters)
  }
  return objectDict[matrixToApply];
}

const applyMatrixToObject = (matrix, element) => {
  element.transform(matrix)
}

export default function createUniverseFomJSON(json) {
  const jsonObject = JSON.parse(json);
  jsonObject.libraryObjects.forEach((libraryObject) => {
    if (jsonObject.parameters !== "") {
      createLibraryObject(libraryObject.type, ...libraryObject.parameters, libraryObject.wireframe, libraryObject.colorParameters, libraryObject.translations)
    } else {
      createLibraryObject(libraryObject.type, false, libraryObject.wireframe, libraryObject.colorParameters, libraryObject.translations)
    }
  })

  jsonObject.customObjects.forEach((customObject) => {
    createCustomObject(customObject.vertices, customObject.facesByIndex, customObject.isWireframe, customObject.colorParameters, customObject.translations)
  })

  return { universe }
}
