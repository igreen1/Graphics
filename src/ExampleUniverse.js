import { RegularPolygon, Torus } from './GeometryLibrary'
import { InitWebGL } from "./OurWebGL"
import { BigBang, Scene } from './Universe'
import { Our3DObject, OurMesh, Our3DGroup } from './Our3DObject'


const ExampleUniverse = () => {
  const { universe, setUniverse, addToUniverse, removeFromUniverse } = BigBang()

  addToUniverse(Our3DObject(
    OurMesh(
      Torus(), true
    ),
    [0, 0, 1.5]
  ))

  addToUniverse(Our3DObject(
    OurMesh(
      RegularPolygon(10), true
    ),
    [0, 0, 1.5]
  ))

  return {universe}

}

const ExampleWebGL = props => {
  const {universe} = ExampleUniverse()
  const canvasRef = InitWebGL(universe)

  return (
    <article>
      {/* Yes, still square. */}
      <canvas width="512" height="512" ref={canvasRef} >
        Your favorite update-your-browser message here.
      </canvas>
    </article>
  )
}

export { ExampleUniverse, ExampleWebGL }