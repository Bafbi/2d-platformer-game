"use strict";
import { Display } from "./display.js";

const display = new Display(document.getElementById("gameWindow"));

display.renderBackground("#00f");
display.render();

window.addEventListener("resize", (event) => display.resize(event));
