import { Our3DObject, Our3DGroup, OurLight, OurCamera, OurAmbientLight } from './Our3DObject'
import { useState } from 'react'
// import { Our3DObject } from './OurCachedMeshes'
import * as CachedObjects from './OurCachedMeshes'

const Scene = cast => {
  // Just a group of objects
  const objectsToDraw = Our3DGroup()
  if (cast) {
    cast.forEach(castMember => objectsToDraw.add(castMember))
  }

  let light = OurLight([1, 1, 1], [1, 1, 1]) // Default light
  let camera = OurCamera([0, 0, -5], [0, 0, 0], [0.6, -0.5, 0.5, -0.5, 1, 10]) // Default camera
  let ambientLight = OurAmbientLight([0, 0, 0])

  const animations = []

  // Recursion requires functions to be declared outside object
  const add = object => {
    if (object.type === Our3DObject || object.type === Our3DGroup || object.type === CachedObjects.OurCachedObject) {
      objectsToDraw.add(object)
    } else if (object.type === OurLight) {
      light = object
    } else if (object.type === OurCamera) {
      camera = object
    } else if (object.type === OurAmbientLight) {
      ambientLight = object
    }
  }

  const remove = object => {
    if (object.type === Our3DObject || object.type === Our3DGroup || object.type === CachedObjects.OurCachedObject) {
      objectsToDraw.remove(object)
    } else if (object.type === OurCamera && object === light) {
      light = OurLight([0, 0, 0], [0, 0, 0]) //easier to make a black light than a null object
    } else if (object.type === OurCamera && object === camera) {
      camera = OurCamera([0, 0, 0], [0, 0, 0], [0, 0, 0, 0, 0, 0]) // should show nothing without breaking the app
    } else if (object.type === OurAmbientLight) {
      ambientLight = OurAmbientLight([0, 0, 0])
    }
  }

  return {
    get objectsToDraw() {
      return objectsToDraw.flatGroup
    },
    add,
    remove,
    transform: objectsToDraw.transform,
    get light() {
      return light
    },
    get camera() {
      return camera
    },
    get animation() {
      return animations
    },
    get ambientLight() {
      return ambientLight
    },
    addAnimation: newAnimation => {
      animations.push(newAnimation)
    },
    tick: timeElapsed => {
      animations.forEach(anim => {
        if (anim.tick) {
          anim.tick(timeElapsed)
        }
      })
    },
    click: event => {
      animations.forEach(anim => {
        if (anim.click) {
          anim.click(event)
        }
      })
    }
  }
}

const BigBang = cast => {
  // React wrapper for Scene (using state)

  const [universe, setUniverse] = useState({ scene: Scene(cast) })

  const addToUniverse = object => {
    universe.scene.add(object)
  }
  const removeFromUniverse = object => {
    universe.scene.remove(object)
  }

  const addAnimation = anim => {
    universe.scene.addAnimation(anim)
  }

  universe.tick = universe.scene.tick
  universe.click = universe.scene.click

  return {
    universe,
    setUniverse,
    addToUniverse,
    removeFromUniverse,
    addAnimation
  }
}

export { BigBang, Scene }
