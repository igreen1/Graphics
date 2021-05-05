##What aspects of defining a 3D scene are successfully handled by your library behind the scenes?  
  
##What aspects are not handled behind the scenes? (i.e., the dev user needs to write code for them)  
  We took a ThreeJS approach to this library, so the programmer requirements are similar to ThreeJS. Users of our library must create their objects (though we've provided some nifty geometries to help), group them, place them in the scene, and define their own animations. Animations can be defined either directly as matrix transformations or as groupings of some of our basics transformations. The user must also add their objects to the universe via a simple function call. While we split up our universe code, this is not required. So, the user can directly interact with our universe in React with the right React know-how. 
  
##How much code for using your library is the same at the application level, regardless of the specific scene?  
  
##What aspects of your design would you keep, if you got a chance to do this library over?  
  
##What aspects of your design would you change?  
Overall, our React knowledge was limited and it shows in the early design stages. We needed to add wrappers in a variety of places as workarounds for design choices that did not account for React. We attempted to overly separate React from our 'JS' section of the code, which made things messy. For example, in `OurWebGL`, there is almost certainly an elegant way to `useEffect` without `animationWrapper`. Similarly, in our example code (though we don't consider this strictly part of our library), we separate `ExampleUniverse` and its React components, and in `Universe`, we do the same by separating `Universe` and `Scene` (Universe is the 'React' wrapper of Scene, unnecessarily). 

Using classes likely would have saved many, many headaches (like the need for so many getters and setters). This one came down to @igreen1 liking functional programming and strong-arming the group into it (sorry all!)
