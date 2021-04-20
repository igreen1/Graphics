import { Our3DGroup, Our3DObject, OurLight, OurCamera } from './Our3DObject'
import { useState } from 'react'

const Scene = (cast) => {
  // Just a group of objects
  const objectsToDraw = Our3DGroup()
  if (cast) {
    cast.forEach((castMember) => objectsToDraw.add(castMember))
  }

  const lightSources = []
  let camera = OurCamera([0,0,-5], [0,0,0], [.6,-.5,.5,-.5,1,10]); // Default camera

  return {
    get objectsToDraw() { return objectsToDraw.group },
    add: (object) => {
      if (object.type === Our3DObject || object.type === Our3DGroup) {
        objectsToDraw.add(object)
      }
      else if (object.type === OurLight) {
        lightSources.push(object)
      } else if (object.type === OurCamera) {
        camera = object
      }
    },
    remove: objectsToDraw.remove,
    transform: objectsToDraw.transform,
    get lightSources() { return lightSources },
    get camera() { return camera },
  }
}


const BigBang = (cast) => {
  // React wrapper for Scene (using state)

  const [universe, setUniverse] = useState({ scene: Scene(cast) })

  const addToUniverse = (object) => {
    universe.scene.add(object)
  }
  const removeFromUniverse = (object) => {
    universe.scene.remove(object)
  }

  const addAnimation = anim => {
    if (!universe.animation) {
      setUniverse({
        ...universe,
        animation: { anim }
      })
    } else {
      universe.animation = {
        ...universe.animation,
        anim
      }
    }
  }

  return {
    universe,
    setUniverse,
    addToUniverse,
    removeFromUniverse
  }

}

export { BigBang, Scene }