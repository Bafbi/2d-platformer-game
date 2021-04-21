export class Controller {
    constructor() {
        this.left = new ButtonInput();
        this.right = new ButtonInput();
        this.up = new ButtonInput();
    }
    keyDownUp(type, key) {
        let down = type == "keydown" ? true : false;

        switch (key) {
            case "q":
                this.left.getInput(down);
                break;
            case "d":
                this.right.getInput(down);
                break;
            case "":
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
