export class Controller {
    constructor() {
        this.left = new ButtonInput();
        this.right = new ButtonInput();
        this.up = new ButtonInput();
    }
    keyDownUp(type, code) {
        let down = type == "keydown" ? true : false;

        switch (code) {
            case "KeyA":
                this.left.getInput(down);
                break;
            case "KeyD":
                this.right.getInput(down);
                break;
            case "Space":
                this.up.getInput(down);
        }
    }
}

class ButtonInput {
    constructor() {
        this.down = false;
        this.active = false;
    }
    getInput(down) {
        if (this.down != down) this.active = down;
        this.down = down;
    }
}
