# WebAssembly - Wave

This is a simulation of the [wave equation](https://en.wikipedia.org/wiki/Wave_equation)
<span class="eq">&#8706;<sup>2</sup>u/&#8706;t<sup>2</sup> = c<sup>2</sup>(&#8706;<sup>2</sup>u/&#8706;x<sup>2</sup>+&#8706;<sup>2</sup>u/&#8706;y<sup>2</sup>)</span>
across a 2D manifold with a boundary condition of u=0 along the unit circle. Use the mouse to create waves.

It contains two implementations of the same C code: one transpiled by hand to JavaScript, and one compiled by Enscripten to WebAssembly.
This particular algorithm processes large arrays and performs a lot of integer math (but does no floating point calculations).
Memory is shared between JS and WebAssembly with no copying, and almost all CPU time is spent in the algorithm itself.
(The canvas API introduces a minor overhead of about 10%.)
The speed increase is modest (about one third) when the same code is run in a WebAssembly context as opposed to a JavaScript context.

[Github](https://github.com/jtiscione/webassembly-wave)