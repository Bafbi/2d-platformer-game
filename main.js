"use strict";

//////////////////////
/// Import modules ///
//////////////////////

import { Display } from "./game_modules/display.js";
import { Controller } from "./game_modules/controller.js";
import { Game } from "./game_modules/game.js";
import { Engine } from "./game_modules/engine.js";

///////////////
/// Objects ///
///////////////

const display = new Display(document.getElementById("gameWindow"));
const controller = new Controller();
const game = new Game();
const engine = new Engine(1000 / 30, render(), update());

////////////////
/// Function ///
////////////////

function render() {
    display.fill("#00f");
    display.render();
}
function update() {
    game.update;
}

/////////////////
/// Listeners ///
/////////////////

window.addEventListener("keydown", (event) => controller.keyDownUp(event.type, event.key));
window.addEventListener("keyup", (event) => controller.keyDownUp(event.type, event.key));
window.addEventListener("resize", () => display.resize());

//////////////////
/// Initialize ///
//////////////////

display.resize();

engine.start();
