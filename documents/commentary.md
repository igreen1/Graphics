## What aspects of defining a 3D scene are successfully handled by your library behind the scenes?  

We handle normal calculation, vertices calculations, and transformations mostly behind the scenes; though, we expose some of the transform library for users to custom define transformations. Animations are mixed, with animations being defined as an animation object by the user, but the looping done behind the scenes. 

We also handle a host of colour assignments. In true JS style, we modify before we break. We allow for various sizes of colour arrays to be passed in and guess the color from. If enough colours are passed for vertex colouring, we do that. If enough for face colours, we do that. And if another amount is passed, we apply just the one first colour. (though, we drew the line at ill defined colour arrays. If your array is poorly defined, we throw an error)

We also built the space for a variety of expansions to backend. Animations can be defined in OurAnimations.js and transformations can be defined in OurTransformations.js. This means future library developers could in theory add lots of functionality with minimal changes. We, however, have finals.

And, of course, all WebGL code is entirely hidden from the user.
  
## What aspects are not handled behind the scenes? (i.e., the dev user needs to write code for them)  

We took a ThreeJS approach to this library, so the programmer requirements are similar to ThreeJS. Users of our library must create their objects (though we've provided some nifty geometries to help), group them, place them in the scene, and define their own animations. Animations can be defined either directly as matrix transformations or as groupings of some of our basics transformations. The user must also add their objects to the universe via a simple function call. While we split up our universe code, this is not required. So, the user can directly interact with our universe in React with the right React know-how. 

The user, in short, defines a scene (either a scene or Universe) and either grabs a React component wrapping a canvas, or just the canvasref element.

The user has to manually implement geometry/mesh caching to improve efficiency (especially on load times). This was to be added after recommendations from Prof. But these recommendations were received on May 5th and its finals week. 
  
## How much code for using your library is the same at the application level, regardless of the specific scene?  
  
Almost none. Most of our repeated code is hidden in VIBAH/. So, exluding imports, the only real repeated code is
```Javascript
<ReactWebGL universe={universe.universe} />
```
where universe is the defined scene of the user

## What aspects of your design would you keep, if you got a chance to do this library over?  

We think our 'hiding' of the code was very well done. And we are happy it mirrors ThreeJS (as best as a semester long project for a bunch of busy students can). Our overall project architecture is very nice.

We also are happy with our matrix/transformation design. It ended up working very well and is easily applicable to projects.

## What aspects of your design would you change?  
Overall, our React knowledge was limited and it shows in the early design stages. We needed to add wrappers in a variety of places as workarounds for design choices that did not account for React. We attempted to overly separate React from our 'JS' section of the code, which made things messy. For example, in `OurWebGL`, there is almost certainly an elegant way to `useEffect` without `animationWrapper`. Similarly, in our example code (though we don't consider this strictly part of our library), we separate `ExampleUniverse` and its React components, and in `Universe`, we do the same by separating `Universe` and `Scene` (Universe is the 'React' wrapper of Scene, unnecessarily). 

Using classes likely would have saved many, many headaches (like the need for so many getters and setters). This one came down to @igreen1 liking functional programming and strong-arming the group into it

Also, we would refactor our group code to more efficiently handle the geometries. While more difficult, it should be fairly achievable to create 'new' meshes from our groups when objects are added. And, because of our scene being a group, this could create lods of new efficiencies, especially in load times (when normals are calculated)

After a talk with Prof., we attempted to implement geometry/mesh caching. This attempt was extremely efficient; however, it required some serious refactoring as it would touch the core of our library. And, its finals week. Unfortunate. We left an example code in `OurSandbox` of vaguely how it could be done at the application level.