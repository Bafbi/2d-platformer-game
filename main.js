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
    display.drawMap(game.world.map.map, game.world.map.columns);
    display.drawPlayer(game.world.player.x, game.world.player.y);
    display.drawDevTools(game.world.map.columns, game.world.map.rows, game.world.player, "rgba(40,20,80,0.25)");

    display.render();
    display.drawText(`X = ${Math.round(game.world.player.x)}  | Y = ${Math.round(game.world.player.y)}`, 2, 7, "#fff");
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
    display.resize(document.documentElement.clientWidth, document.documentElement.clientHeight, game.world.height / game.world.width)
);

//////////////////
/// Initialize ///
//////////////////
display.buffer.canvas.height = game.world.height;
display.buffer.canvas.width = game.world.width;

display.tileSheet.image.src = "./game_modules/texture/spritesheet.png";
display.player.image.src = "./game_modules/texture/spriteplayer.png";

display.tileSheet.image.onload = () => {
    display.resize(document.documentElement.clientWidth, document.documentElement.clientHeight, game.world.height / game.world.width);

    engine.start();
};
