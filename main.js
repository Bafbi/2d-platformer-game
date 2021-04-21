"use strict";

//////////////////////
/// Import modules ///
//////////////////////

import { Display } from "./game_modules/display.js";
import { Controller } from "./game_modules/controller.js";
import { Game } from "./game_modules/game.js";
import { Engine } from "./game_modules/engine.js";

////////////////
/// Function ///
////////////////

function render() {
    display.fill(game.world.backGroundColor);
    display.drawRectangle(game.world.player.x, game.world.player.y, game.world.player.width, game.world.player.height, game.world.player.color);
    display.drawText(game.world.player.onGround, 5, 5, "#fff");
    display.render();
}
function update() {
    if (controller.left.active) {
        game.world.player.moveLeft();
    }
    if (controller.right.active) {
        game.world.player.moveRight();
    }
    if (controller.up.active) {
        game.world.player.jump();
        controller.up.active = false;
    }
    game.update();
}

///////////////
/// Objects ///
///////////////

const display = new Display(document.getElementById("gameWindow"));
const controller = new Controller();
const game = new Game();
const engine = new Engine(1000 / 30, render, update);

/////////////////
/// Listeners ///
/////////////////

window.addEventListener("keydown", (event) => controller.keyDownUp(event.type, event.code));
window.addEventListener("keyup", (event) => controller.keyDownUp(event.type, event.code));
window.addEventListener("resize", () =>
    display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width)
);

//////////////////
/// Initialize ///
//////////////////
display.buffer.canvas.height = game.world.height;
display.buffer.canvas.width = game.world.width;

display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);

engine.start();
