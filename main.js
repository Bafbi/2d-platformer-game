"use strict";

//////////////////////
/// Import modules ///
//////////////////////

import { Display } from "./display.js";

///////////////
/// Objects ///
///////////////

const display = new Display(document.getElementById("gameWindow"));

////////////////
/// Function ///
////////////////

display.renderBackground("#00f");
display.render();

/////////////////
/// Listeners ///
/////////////////

window.addEventListener("resize", () => display.resize());

//////////////////
/// Initialize ///
//////////////////

display.resize();
