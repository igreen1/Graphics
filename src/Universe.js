import { Our3DGroup, Our3DObject, OurLight, OurCamera } from './Our3DObject'
import { useState } from 'react'

const Scene = (cast) => {
  // Just a group of objects
  const objectsToDraw = Our3DGroup()
  if (cast) {
    cast.forEach((castMember) => objectsToDraw.add(castMember))
  }

  let light = OurLight([1, 1, 1], [1, 1, 1]); // Default light
  let camera = OurCamera([0, 0, -5], [0, 0, 0], [.6, -.5, .5, -.5, 1, 10]); // Default camera

  const animations = []

  // Recursion requires functions to be declared outside object
  const add = (object) => {
    if (object.type === Our3DObject) {
      objectsToDraw.add(object)
    } else if (object.type === Our3DGroup) {
      object.group.forEach(add)
    }
    else if (object.type === OurLight) {
      light = object
    } else if (object.type === OurCamera) {
      camera = object
    }
  }

  const remove = (object) => {
    if (object.type === Our3DObject) {
      objectsToDraw.remove(object)
    } else if (object.type === Our3DGroup) {
      object.group.forEach(remove)
    } else if (object.type === OurCamera && object === light) {
      light = OurLight([0, 0, 0], [0, 0, 0]); //easier to make a black light than a null object

    } else if (object.type === OurCamera && object === camera) {
      camera = OurCamera([0, 0, 0], [0, 0, 0], [0, 0, 0, 0, 0, 0]); // should show nothing without breaking the app
    }
  }

  return {
    get objectsToDraw() { return objectsToDraw.group },
    add,
    remove,
    transform: objectsToDraw.transform,
    get light() { return light },
    get camera() { return camera },
    get animation() { return animations; },
    addAnimation: (newAnimation) => {
      animations.push(newAnimation);
    },
    tick: (timeElapsed) => {
      animations.forEach((anim) => anim.tick(timeElapsed))
    }
    
  }
}

const MatrixAnimation = (objectToAffect, animationMatri) => {
  return {
    tick: () => {
      objectToAffect.transform(animationMatri);
    }
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
    universe.scene.addAnimation(anim)
  }

  universe.tick = universe.scene.tick;

  // universe.tick = (progress) => {
  //   console.log("They're horrible bugs");
  // }

  return {
    universe,
    setUniverse,
    addToUniverse,
    removeFromUniverse,
    addAnimation
  }

}

export { BigBang, Scene }