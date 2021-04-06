import { Our3DObject, OurMesh, Our3DGroup } from './Our3DObject'
import { Cone, Cylinder, Extrude, RegularPolygon, Sphere, Tube, Torus } from './GeometryLibrary'
import { MatrixLibrary } from './OurMatrix'
import { BigBang } from './Universe'

/*
Imports a scene from a JSON file
Format:
  {
    "name": {
      "type": "Cone" or "Cylinder" or "Extrude" or "RegularPolygon" or "Sphere" or "Tube" or "Torus" or "Group",
      "parameters": [ List your parameters here sorted by , ],
      "wireframe": true or false,
      "color": [#, #, #],
      "scale": [#, #, #] //optional,
      "rotation": [#, #, #] //optional,
      "translation": [#, #, #] //optional
    }
  }

  You must define objects/groups BEFORE you define
  any group that include that object/group in the JSON.
 */

const universeFromJson = json => {
  const get3DObject = properties => {
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

  const add = ([object, properties]) => {
    scene[object] = get3DObject(properties)
    if (properties.type !== 'Group') {
      universe.addToUniverse(scene[object])
    }
  }

  const transform = ([object, properties]) => {
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

  const universe = BigBang()

  let scene = {}
  for (const object of Object.entries(json)) {
    add(object)
    transform(object)
  }

  return universe
}

export { universeFromJson }
