import { Our3DGroup } from './Our3DObject'
import { useState } from 'react'

const Scene = (cast) => {
  // Just a group of objects
  const objectsToDraw = Our3DGroup()
  if (cast) {
    cast.forEach((castMember) => objectsToDraw.add(castMember))
  }

  return {
    get objectsToDraw() { return objectsToDraw.group },
    add: objectsToDraw.add,
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