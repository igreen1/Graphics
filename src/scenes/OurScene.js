// Import our cast
import { SphinxFactory } from '../objects/sphinx'
import { CamelFactory } from '../objects/camel'
import { StarFactory, PyramidFactory } from '../objects/Detroit'
import { ShepherdFactory } from '../objects/shepherd'
import { UFOFactory } from '../objects/UFO'
import { MummyFactory } from '../objects/mummy'
import { Vineyard } from '../objects/vineyard'

// Import our library
import {
  Geometries,
  ReactWebGL,
  BigBang,
  OurMesh,
  Our3DGroup,
  Our3DObject,
  OurLight,
  OurCamera,
  OurAmbientLight,
  MatrixLibrary,
  Animations
} from '../VIBAH/VIBAH'

// Alternatively can import as
// import * as VIBAH from './VIBAH/VIBAH

const ExampleUniverse = () => {
  let universe = BigBang()

  // Pyramids
  const pyramid = PyramidFactory([-0.2, -1, -3])
  const pyramid2 = PyramidFactory([-4, -1, -4])
  const pyramid3 = PyramidFactory([4, -1, -4])
  universe.addToUniverse(pyramid)
  universe.addToUniverse(pyramid2)
  universe.addToUniverse(pyramid3)

  universe.addAnimation({
    movingUp: true,
    displacement: 0,
    tick: function (progress) {
      if (this.isActive) {
        if (this.movingUp) {
          pyramid3.translate(0, 0.01, 0)
          this.displacement++
          if (this.displacement === 100) {
            this.movingUp = false
          }
        } else {
          pyramid3.translate(0, -0.01, 0)
          this.displacement--
          if (this.displacement === 0) {
            this.movingUp = true
          }
        }
      }
    },
    click: function () {
      this.isActive = !this.isActive
    }
  })

  // Amazing background :)

  let ground = Our3DObject(OurMesh(Geometries.RegularPolygon(4), false), [0.5, 0.4, 0.2])
  ground.transform(MatrixLibrary.scaleMatrix(15, 15, 1))
  ground.transform(MatrixLibrary.rotationMatrix(-Math.PI / 2, 0, Math.PI / 4))
  ground.transform(MatrixLibrary.translationMatrix(0, -2.5, 0))
  universe.addToUniverse(ground)

  let sky = Our3DObject(OurMesh(Geometries.RegularPolygon(4), false), [2.5, 5, 20.5])
  sky.transform(MatrixLibrary.scaleMatrix(15, 15, 1))
  sky.transform(MatrixLibrary.rotationMatrix(0, 0, Math.PI / 4))
  sky.transform(MatrixLibrary.translationMatrix(0, 0, -3))
  universe.addToUniverse(sky)

  // From our cast
  let sphinx = SphinxFactory()
  universe.addToUniverse(sphinx)

  universe.addAnimation({
    displacement: 0,
    movingLeft: false,
    tick: function (progress) {
      if (!this.movingLeft) {
        sphinx.getObjectByName('head').getObjectByName('eyes').translate(0.001, 0, 0)
        this.displacement++
        if (this.displacement === 100) {
          this.displacement = 0
          this.movingLeft = true
        }
      } else {
        sphinx.getObjectByName('head').getObjectByName('eyes').translate(-0.001, 0, 0)
        this.displacement++
        if (this.displacement === 100) {
          this.displacement = 0
          this.movingLeft = false
        }
      }
    }
  })

  const mummy = MummyFactory()
  universe.addToUniverse(mummy)

  const camel1 = CamelFactory().scale(0.25, 0.25, 0.25).transform(MatrixLibrary.translationMatrix(1, -1.5, -1))
  const camel2 = CamelFactory()
    .scale(0.25, 0.25, 0.25)
    .translate(-1, -1.5, -1)
    .rotateAboutPoint([-1, -1.5, -1], [0, Math.PI, 0])
    .setWireframe(true)
  const camelHerd = Our3DGroup().add(camel1).add(camel2)
  universe.addToUniverse(camelHerd)

  const shepherd = ShepherdFactory()
  universe.addToUniverse(shepherd)
  let starrySky = Our3DGroup()

  for (let i = 0; i < 8; i++) {
    starrySky.add(
      StarFactory()
        .scale(0.25, 0.25, 0.25)
        .translate(Math.random() * 6 - 3, Math.random() * 2 - 1, Math.random() * 2 - 1)
    )
  }
  universe.addToUniverse(starrySky)

  const UFO = UFOFactory().translate(3, 0, -1)
  universe.addToUniverse(UFO)
  universe.addAnimation(
    Animations.RotateAboutPoint(UFO.getObjectByName('beam').getObjectByName('outer'), [3, 0, -1], [0, 0.01, 0])
  )
  universe.addAnimation(
    Animations.RotateAboutPoint(UFO.getObjectByName('beam').getObjectByName('inner'), [3, 0, -1], [0, -0.01, 0])
  )
  universe.addAnimation(Animations.RotateAboutPoint(UFO, [3, 0, -1], [0, -0.001, 0]))

  universe.addAnimation({
    displacement: 0,
    movingUp: false,
    tick: function (progress) {
      if (!this.movingUp) {
        UFO.translate(0, -0.001, 0)
        this.displacement++
        if (this.displacement === 100) {
          this.displacement = 0
          this.movingUp = true
        }
      } else {
        UFO.translate(0, 0.001, 0)
        this.displacement++
        if (this.displacement === 100) {
          this.displacement = 0
          this.movingUp = false
        }
      }
    }
  })

  const bunchOfGrapes = Vineyard()
  universe.addToUniverse(bunchOfGrapes.Bunch)

  // We have to see something!
  const camera = OurCamera([0, 1, -5], [0, 0, 0], [0.5, -0.5, 1, -1, 1, 10])
  // const camera = OurCamera([0, 1, -5], [0, 0, 0], [1, -1, 1, -1, 2, -2], MatrixLibrary.orthographicProjectionMatrix)

  universe.addToUniverse(camera)

  const light = OurLight([-2, 0, 10], [5, 5, 5])
  universe.addToUniverse(light)

  const AmbientLight = OurAmbientLight([3, 3, 3])
  universe.addToUniverse(AmbientLight)

  const unleashCurse = {
    curseUnleahsed: false,
    brighten: false,
    displacement: 0,
    toggleCurse: function () {
      this.curseUnleahsed = !this.curseUnleahsed
    },
    tick: function () {
      if (this.curseUnleahsed) {
        if (this.displacement < 100) {
          sphinx.translate(0.05, 0.008, 0.05)
          sphinx.rotate(0, -0.006, 0)
          //sphinx.scale(1.01,1.01,1.01)
          this.displacement++
        } else if (this.displacement < 150) {
          if (this.brighten) {
            AmbientLight.newLight = [10, 10, 10]
          } else {
            AmbientLight.newLight = [0.1, 0.1, 0.1]
          }
          this.brighten = !this.brighten
          this.displacement++
        } else if (this.displacement < 151) {
          universe.removeFromUniverse(sphinx)
          this.displacement++
        } else if (this.displacement < 200) {
          if (this.brighten) {
            AmbientLight.newLight = [10, 10, 10]
          } else {
            AmbientLight.newLight = [0.1, 0.1, 0.1]
          }
          this.brighten = !this.brighten
          pyramid.toggleWireframe()
          this.displacement++
        } else if (this.displacement < 350) {
          if (this.brighten) {
            AmbientLight.newLight = [10, 10, 10]
          } else {
            AmbientLight.newLight = [0.1, 0.1, 0.1]
          }
          this.brighten = !this.brighten
          pyramid.toggleWireframe()
          mummy.getObjectByName('mummy').rotate(0.001, 0, 0)
          this.displacement++
        } else if (this.displacement < 351) {
          AmbientLight.newLight = [3, 3, 3]
          pyramid.toggleWireframe()

          sphinx = SphinxFactory()
          universe.addToUniverse(sphinx)
          sphinx.getObjectByName('eyes').translate(0.2, 0, 0.1)

          this.displacement++
        }
      }
    }
  }
  universe.addAnimation(unleashCurse)

  const earthquake = {
    timeElapsed: 3000,
    toggleEarthquake: function () {
      this.timeElapsed = 0
    },
    tick: function (progress) {
      if (this.timeElapsed < 3000) {
        this.timeElapsed = this.timeElapsed + progress
        universe.universe.scene.objectsToDraw.forEach(object =>
          object.translate(Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005)
        )
      }
    }
  }

  universe.addAnimation(earthquake)

  const dancingGrapes = {
    dancing: false,
    rave: false,
    ferrisWheel: false,
    toggleDancing: function () {
      this.dancing = !this.dancing
    },
    toggleRave: function () {
      this.rave = !this.rave
    },
    toggleferrisWheel: function () {
      this.ferrisWheel = !this.ferrisWheel
    },
    tick: function () {
      if (this.dancing) {
        bunchOfGrapes.first_grape_in_bunch.rotateAboutPoint(
          [...bunchOfGrapes.first_grape_tracking_position],
          [0, -0.05, 0]
        )
        bunchOfGrapes.second_grape_in_bunch.rotateAboutPoint(
          [...bunchOfGrapes.second_grape_tracking_position],
          [0, -0.05, 0]
        )
        bunchOfGrapes.third_grape_in_bunch.rotateAboutPoint(
          [...bunchOfGrapes.third_grape_tracking_position],
          [0, -0.05, 0]
        )
      }
      if (this.rave) {
        bunchOfGrapes.first_grape_in_bunch.rotateAboutPoint(
          [...bunchOfGrapes.first_grape_position],
          [Math.random() * 0.025, Math.random() * 0.25, Math.random() * 0.025]
        )
        bunchOfGrapes.second_grape_in_bunch.rotateAboutPoint(
          [...bunchOfGrapes.second_grape_position],
          [Math.random() * -0.25, Math.random() * 0.025, Math.random() * -0.025]
        )
        bunchOfGrapes.third_grape_in_bunch.rotateAboutPoint(
          [...bunchOfGrapes.third_grape_position],
          [Math.random() * 0.25, Math.random() * -0.25, Math.random() * 0.025]
        )
      }
      if (this.ferrisWheel) {
        const point = [Math.random() * 0.5, Math.random() * 0.5, Math.random() * -1]
        const rotation = [0, 0, Math.random() * 0.5]
        bunchOfGrapes.Bunch.group.forEach(grape => grape.rotateAboutPoint([...point], [...rotation]))
      }
    }
  }

  universe.addAnimation(dancingGrapes)

  const shepherdAbilities = {
    center: [-0.2, -2, 1],
    angle: Math.PI / 2,
    toggleFlying: function () {
      this.flying = !this.flying
    },
    toggleLeft: function () {
      this.flying = true
      this.rightTurn = false
      this.leftTurn = !this.leftTurn
    },
    toggleRight: function () {
      this.flying = true
      this.rightTurn = !this.rightTurn
      this.leftTurn = false
    },
    tick: function (progress) {
      if (this.flying) {
        shepherd.translate(Math.cos(this.angle) * 0.02, Math.sin(this.angle) * 0.02, 0)
        this.center[0] += Math.cos(this.angle) * 0.02
        this.center[1] += Math.sin(this.angle) * 0.02
      }
      if (this.leftTurn) {
        this.angle -= 0.075
        shepherd.rotateAboutPoint([this.center[0], this.center[1], this.center[2]], [0, 0, -0.075])
      }
      if (this.rightTurn) {
        shepherd.rotateAboutPoint([this.center[0], this.center[1], this.center[2]], [0, 0, 0.075])
        this.angle += 0.075
      }
    }
  }

  universe.addAnimation(shepherdAbilities)

  const camelInternalAnimation = {
    // Internal movement
    camelHeadBob: false,
    timeElapsed: 0,
    objectsToAffect: [camel1.getObjectByName('head'), camel1.getObjectByName('neck')],
    tick: function (progress) {
      if (this.camelHeadBob) {
        this.timeElapsed = this.timeElapsed > 1000 ? (this.timeElapsed = 0) : this.timeElapsed + progress
        if (this.timeElapsed < 500) {
          this.objectsToAffect.forEach(object => {
            object.rotateAboutPoint([1, -1.5, -1], [0, 0, 0.01])
          })
        } else {
          this.objectsToAffect.forEach(object => {
            object.rotateAboutPoint([1, -1.5, -1], [0, 0, -0.01])
          })
        }
      }
    },
    toggleAnimation: function () {
      this.camelHeadBob = !this.camelHeadBob
    }
  }
  universe.addAnimation(camelInternalAnimation)

  const moveCamera = {
    // Demonstrate "Ability to change camera position and viewpoint"
    moving: false,
    toggleMoving: function () {
      this.moving = !this.moving
    },
    tick: function () {
      if (this.moving) {
        camera.rotate(0, 0.01, 0.001)
      }
    }
  }
  universe.addAnimation(moveCamera)

  universe.addAnimation({
    // Demonstrate "Ability to add and remove objects to/from the scene"
    timeElapsed: 0,
    camelInScene: true,
    timeBetween: 3000,
    tick: function (progress) {
      this.timeElapsed = this.timeElapsed > this.timeBetween ? (this.timeElapsed = 0) : this.timeElapsed + progress
      if (this.timeElapsed > this.timeBetween) {
        this.timeElapsed = 0
        if (this.camelInScene) {
          universe.removeFromUniverse(camel2)
          this.camelInScene = false
        } else {
          universe.addToUniverse(camel2)
          this.camelInScene = true
        }
      }
    }
  })

  const changeView = {
    isPerspective: true,
    toggleView: function () {
      if (!this.isPerspective) {
        const perspectiveCamera = OurCamera([0, 1, -5], [0, 0, 0], [0.5, -0.5, 1, -1, 1, 10])
        universe.addToUniverse(perspectiveCamera)
        this.isPerspective = !this.isPerspective
      } else {
        const orthagraphicCamera = OurCamera(
          [0, 1, -5],
          [0, 0, 0],
          [2.5, -2.5, 5, -5, -5, 10],
          MatrixLibrary.orthographicProjectionMatrix
        )
        universe.addToUniverse(orthagraphicCamera)
        this.isPerspective = !this.isPerspective
      }
    }
  }

  universe.addAnimation({
    timeElapsed: 0,
    timeBetween: 3000,

    // Demonstrate "Ability to compute lighting in both faceted/flat and smooth styles"
    tick: function (progress) {
      if (this.timeElapsed > this.timeBetween) {
        this.timeElapsed = 0
        pyramid.toggleFaceted()
      } else {
        this.timeElapsed += progress
      }
    }
  })

  // put the things we want to connect directly to react
  const thingsWeWant = {
    addAnimation: universe.addAnimation,
    toggleUnleshCurse: () => {
      unleashCurse.toggleCurse()
    },
    toggleCamelAnimation: () => {
      camelInternalAnimation.toggleAnimation()
    },
    toggleDancing: () => {
      dancingGrapes.toggleDancing()
    },
    toggleRave: () => {
      dancingGrapes.toggleRave()
    },
    toggleferrisWheel: () => {
      dancingGrapes.toggleferrisWheel()
    },
    toggleEarthquake: () => {
      earthquake.toggleEarthquake()
    },
    toggleFlying: () => {
      shepherdAbilities.toggleFlying()
    },
    toggleRight: () => {
      shepherdAbilities.toggleLeft()
    },
    toggleLeft: () => {
      shepherdAbilities.toggleRight()
    },
    makeWireframe: () => {
      // Demonstrate "Ability to toggle between wireframe and solid rendering"
      universe.universe.scene.objectsToDraw.forEach(object => object.toggleWireframe())
    },
    toggleMoveCamera: () => {
      moveCamera.toggleMoving()
    },
    changeCamera: () => {
      changeView.toggleView()
    }
  }
  return { universe, thingsWeWant }
}

const ExampleWebGL = props => {
  const { universe, thingsWeWant } = ExampleUniverse()

  return (
    <article>
      <ReactWebGL universe={universe.universe} />
      <section>
        <button onClick={thingsWeWant.makeWireframe}>Toggle wireframe</button>
        <button onClick={thingsWeWant.toggleMoveCamera}>Toggle camera move</button>
        <button onClick={thingsWeWant.changeCamera}>Toggle camera</button>
        <button onClick={thingsWeWant.toggleEarthquake}>You make my earth quake</button>
        <button onClick={thingsWeWant.toggleUnleshCurse}>Unleash Ancient Curse</button>
        <button onClick={thingsWeWant.toggleCamelAnimation}>Straight vibing</button>
        <br />
        <button onClick={thingsWeWant.toggleDancing}> Dancing 💃🏻 🕺🏻 🍇 </button>
        <button onClick={thingsWeWant.toggleRave}> Rave 🍇 ❓ ❔</button>
        <button onClick={thingsWeWant.toggleferrisWheel}> 🎡 🍇 Ferris Wheel 🍇 🎡</button>
        <br />
        <button onClick={thingsWeWant.toggleLeft}>⏪</button>
        <button onClick={thingsWeWant.toggleFlying}>Fly!</button>
        <button onClick={thingsWeWant.toggleRight}>⏩</button>
      </section>
    </article>
  )
}

export { ExampleWebGL }
