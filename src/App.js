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

import { ExampleWebGL } from './scenes/OurScene'
import { OurSandbox } from './scenes/OurSandbox'
// import BareBonesWebGL from './BareBonesWebGL'
// import LessBareBonesWebGL from './LessBareBonesWebGL'

const Greeting = () => (
  <article>
    <h1>Choose which to look at above</h1>
    <p>
      `Our Scene` contains a fun Egyptian scene.
      `Our Sandbox` has a bunch of random objects
    </p>
    <p>
      <bold> WARNING: normals are computed on load so the load will take a very long time. Eventually, these will be cached (after the first load) but the initial load and some buttons may take a while </bold>
    </p>
  </article>
)

const App = () => {
  return (
    <article className="App">
      <Router>
        <nav>
          {/* <NavLink activeClassName="current" to="/bare-bones-webgl">
            Bare Bones WebGL
          </NavLink>

          <NavLink activeClassName="current" to="/less-bare-bones-webgl">
            Less Bare Bones WebGL
          </NavLink> */}

          <NavLink activeClassName="current" to="/our-webgl">
            Our Scene
          </NavLink>
          <NavLink activeClassName="current" to="/our-sandbox">
            Our Sandbox
          </NavLink>
        </nav>

        <main>
          <Switch>
            {/* <Route path="/bare-bones-webgl" component={BareBonesWebGL} />
            <Route path="/less-bare-bones-webgl" component={LessBareBonesWebGL} /> */}
            <Route path="/our-webgl" component={ExampleWebGL} />
            <Route path='/our-sandbox' component={OurSandbox} />
            <Route component={Greeting} />
          </Switch>
        </main>
      </Router>
    </article>
  )
}

export default App
