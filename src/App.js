/**
 * This React app serves as a very thin “wrapper” around what is otherwise pure WebGL code.
 * With the exception of a couple of reusable modules, the BareBonesWebGL and LessBareBonesWebGL
 * components are devoid of design---they are meant to introduce you to WebGL but are not meant
 * to be models to emulate. In other words, focus on the functionality and not the form. Once you
 * feel you’ve gotten into a groove with WebGL yourself, feel free to delete these components and
 * underlying modules so you can go with your own approach for a high-level 3D graphics library.
 */
import { BrowserRouter as Router, NavLink, Route, Switch } from 'react-router-dom'

import './App.css'

import {ExampleWebGL} from './scenes/OurScene'
import BareBonesWebGL from './BareBonesWebGL'
import LessBareBonesWebGL from './LessBareBonesWebGL'

const Greeting = () => (
  <article>
    <h1>This is starter code only!</h1>
    <p>
      Make sure to take this apart and put it back with a better design once you’ve gotten the hang of WebGL and GLSL.
    </p>
  </article>
)

const App = () => {
  return (
    <article className="App">
      <Router>
        <nav>
          <NavLink activeClassName="current" to="/bare-bones-webgl">
            Bare Bones WebGL
          </NavLink>

          <NavLink activeClassName="current" to="/less-bare-bones-webgl">
            Less Bare Bones WebGL
          </NavLink>

          <NavLink activeClassName="current" to="/our-webgl">
            Our WebGL
          </NavLink>
        </nav>

        <main>
          <Switch>
            <Route path="/bare-bones-webgl" component={BareBonesWebGL} />
            <Route path="/less-bare-bones-webgl" component={LessBareBonesWebGL} />
            <Route path="/our-webgl" component={ExampleWebGL} />
            <Route component={Greeting} />
          </Switch>
        </main>
      </Router>
    </article>
  )
}

export default App
