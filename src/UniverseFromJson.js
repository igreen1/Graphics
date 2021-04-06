import { Our3DObject, OurMesh, Our3DGroup } from './Our3DObject'
import { Cone, Cylinder, Extrude, RegularPolygon, Sphere, Tube, Torus } from './GeometryLibrary'
import { MatrixLibrary } from './OurMatrix'
import { BigBang } from './Universe'

const get3DObject = (properties, scene) => {
  const objectDict = {
    Cone: Cone,
    Cylinder: Cylinder,
    Extrude: Extrude,
    RegularPolygon: RegularPolygon,
    Sphere: Sphere,
    Tube: Tube,
    Torus: Torus
  }
  if (properties.type === 'Group') {
    return Our3DGroup(properties.objects.map(object => scene[object]))
  } else {
    const libraryObject = objectDict[properties.type]
    if (properties.parameters) {
      return Our3DObject(OurMesh(libraryObject(...properties.parameters), properties.wireframe), properties.color)
    } else {
      return Our3DObject(OurMesh(libraryObject(), properties.wireframe), properties.color)
    }
  }
}

const universeFromJson = json => {
  const universe = BigBang()

  let scene = {}
  for (const [object, properties] of Object.entries(json).filter(object => object[1].type !== 'Group')) {
    scene[object] = get3DObject(properties, scene)
    universe.addToUniverse(scene[object])
    if (properties.scale) {
      scene[object].transform(MatrixLibrary.scaleMatrix(...properties.scale))
    }
    if (properties.translation) {
      scene[object].transform(MatrixLibrary.translationMatrix(...properties.translation))
    }
    if (properties.rotation) {
      scene[object].transform(MatrixLibrary.rotationMatrix(...properties.rotation))
    }
  }
  for (const [object, properties] of Object.entries(json).filter(object => object[1].type === 'Group')) {
    scene[object] = get3DObject(properties, scene)
    // addToUniverse(scene[object])
    if (properties.scale) {
      scene[object].transform(MatrixLibrary.scaleMatrix(...properties.scale))
    }
    if (properties.translation) {
      scene[object].transform(MatrixLibrary.translationMatrix(...properties.translation))
    }
    if (properties.rotation) {
      scene[object].transform(MatrixLibrary.rotationMatrix(...properties.rotation))
    }
  }

  return universe
}

export { universeFromJson }
