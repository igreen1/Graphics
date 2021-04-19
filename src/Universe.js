import { Our3DGroup, Our3DObject, OurLight } from './Our3DObject'
import { useState } from 'react'

const Scene = (cast) => {
  // Just a group of objects
  const objectsToDraw = Our3DGroup()
  if (cast) {
    cast.forEach((castMember) => objectsToDraw.add(castMember))
  }

  const lightSources = []

  return {
    get objectsToDraw() { return objectsToDraw.group },
    add: (object) => {
      if (object.type === Our3DObject || object.type === Our3DGroup) {
        objectsToDraw.add(object)
      }
      else if (object.type === OurLight) {
        lightSources.push(object)
      } 
    },
    remove: objectsToDraw.remove,
    transform: objectsToDraw.transform,
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
    if(!universe.animation){
      setUniverse({
        ...universe,
        animation:{anim}
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