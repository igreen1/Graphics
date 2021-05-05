

## VBP-Booker-Ian-Halle-Andrew

##### https://github.com/lmu-cmsi371-spring2021/hw-our-3d-library-vbp-booker-ian-halle-andrew

| Category | Feedback | Points |
| --- | --- | ---: |
| Stub web app | Stub web app provides testbed for scene library | 5/5 |
| | **Screen construct/framework** | |
| • Setup | Scene code is structured to handle WebGL setup and connection to `canvas` in a reusable manner | 4/4 |
| • Add/remove | `Our3DGroup` handles addition and removal | 4/4 |
| • Rendering | Scene code renders to a canvas in a reusable manner | 4/4 |
| • Implementation | Overall things look good except that `InitWebGL`, which by all accounts appears to be reusable code, should be exported from its own file so that multiple scenes could be built from it without having to copy its code and shaders each time (–1) | 2/3 |
| | **3D object framework** | |
| • Different shapes | 3D object framework accommodates different shapes | 2/2 |
| • Color | 3D object framework stores at least a single color | 2/2 |
| • Groups/composites | 3D object framework includes a proper group/composite construct | 8/8 |
| • Implementation | 3D object framework is generally implemented well—the `colorArrayByVertex` in `Our3DObject` seems a touch misnamed because it’s actually just a single color (in this commit), but I’ll accept that this may be a forward-looking decision | 3/3 |
| | **Polygon mesh data structure** | |
| • Vertices/triangles | Mesh data structure stores vertices and faces (triangles) appropriately | 10/10 |
| • Extensibility | Mesh data structure is straightforward to extend | 5/5 |
| • Solid vs. wireframe | Mesh data structure produces wireframe and solid renders in a straightforward manner (nice use of getters and setters!) | 5/5 |
| • Implementation | Overall mesh implementation looks clean and straightforward. A fewer layers to get through, but once assimilated it makes sense<br><br>One caution is that the raw vertex arrays appear to be computed every single time the `vertices` getter is requested—this won’t scale in the long run; better to compute and store them only when they are known to truly change (–1) | 4/5 |
| | **Mesh maker library** | |
| • Sphere | Sphere appears to be implemented correctly | 12* |
| • Regular polygon | Regular polygon appears to be implemented correctly | 8 |
| • _shape-credits.md_ | _shape-credits.md_ clearly lists who did what |  |
| • Implementation | Shape framework is overall implemented consistently and well | 10/10 |
| Extra credit (if any) | Extrude shape is implemented (+5 for the group)<br><br>Lathe shape is implemented (+5 for the group)<br><br>Test suite provided for geometries (93.44% statement coverage) (+10) | 20 |
| Code maintainability | Multiple “value never used” warnings linger as of this commit plus a missing dependency warning—even if this is just the first phase of many, things should have been cleaned up for this milestone (–1) | -1 |
| Code readability | No major code readability issues seen |  |
| Version control | Solid commit count with sufficiently descriptive messages |  |
| Punctuality | Last commit before the due date is 4/6 7:22pm<br /><br /> **Graded commit:** https://github.com/lmu-cmsi371-spring2021/hw-our-3d-library-vbp-booker-ian-halle-andrew/tree/18133f97254a596cd79e38675993611b80eec7b5 |  |
| | **Total** | **107/90** |

Sphere score is out of 20 for four-person groups and out of 12 for five-person groups, for whom the remaining 8 points are allocated to the regular polygon.
