

## VBP-Booker-Ian-Halle-Andrew

##### https://github.com/lmu-cmsi371-spring2021/hw-our-3d-library-vbp-booker-ian-halle-andrew

| Category | Feedback | Points |
| --- | --- | ---: |
| | **4×4 matrix object/library** | |
| • Identity | New matrix defaults to the identity matrix | 2/2 |
| • Multiplication | Matrix multiplication is implemented | 8/8 |
| • Group matrix | n/a |  |
| • GLSL conversion | Conversion to column-major 1D array is implemented | 3/3 |
| • Implementation | The matrix library is implemented well overall, with validation checks and thrown errors where appropriate | 5/5 |
| | **Matrix test suite** | |
| • Identity test | No explicit test for `identityMatrix` seen—yes even if it’s trivial, it should be tested (–1) | 0/1 |
| • Identity coverage | `Matrix()` is implicitly covered but not `identityMatrix`—this is a very narrow edge case because `identityMatrix` is just a pass-through to `Matrix()` so we’ll let it go | 1/1 |
| • Multiplication test | Matrix multiplication function is explicitly tested and multiplication is also used in other tests | 4/4 |
| • Multiplication coverage | Matrix multiplication function test covers everything but thrown error cases (–1) | 3/4 |
| • Group matrix test | n/a |  |
| • Group matrix coverage | n/a |  |
| • GLSL conversion test | `toArray` is explicitly tested | 2/2 |
| • GLSL conversion coverage | `toArray` test covers everything but thrown error case—this is a very narrow case so we’ll let it go | 1/1 |
| • _matrix-credits.md_ | _matrix-credits.md_ clearly lists who did what |  |
| | **Matrix use in 3D objects** | |
| • Instance transformation | An instance transform is maintained and used | 10/10 |
| • Parent propagation | Grouped/composite objects propagate their transforms to children | 15/15 |
| • Transform in-place | In-place transformation of vertices is implemented | 8 |
| • Implementation | Matrix use by 3D objects is implemented well overall—the final shader variable of `matrix` will ultimately become not specific enough, but true at this stage this is the only matrix there is (so far) | 5/5 |
| | **Matrix use in projection** | |
| • Correct usage | (deferred until next assignment) |  |
| • Implementation | (deferred until next assignment) |  |
| Extra credit (if any) | JSON scene import is successfully implemented (+15) | 15 |
| Code maintainability | Maintainability issues are the same as before (same commit) so no additional deductions |  |
| Code readability | No major code readability issues seen |  |
| Version control | Solid commit count with sufficiently descriptive messages |  |
| Punctuality | Last commit before the due date is 4/6 7:22pm<br /><br /> **Graded commit:** https://github.com/lmu-cmsi371-spring2021/hw-our-3d-library-vbp-booker-ian-halle-andrew/tree/18133f97254a596cd79e38675993611b80eec7b5 |  |
| | **Total** | **82/69** |

Only four-member groups will have a group-collaborated matrix, totaling 8 points (4 + 2 + 2). Only five-member groups need to implement vertex transformation in place, also totaling 8 points. Math—it works!

Total without projection matrix usage is 69 points. When those are graded from the next assignment, the total will go to 84.
