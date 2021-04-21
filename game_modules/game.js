//import { backGroundColor, friction, gravity, width, height } from "./world/config.json";
export class Game {
    constructor() {
        this.world = new World("rgba(40, 48, 56, 0.25)", 0.9, 3, 72, 128);
    }

    update() {
        this.world.update();
    }
}

class World {
    constructor(backGroundColor, friction, gravity, width, height) {
        this.backGroundColor = backGroundColor;
        this.friction = friction;
        this.gravity = gravity;
        this.width = width;
        this.height = height;
        this.player = new Player(50, 50, 16, 16);
    }

    collideEntity(entity) {
        if (entity.x < 0) {
            entity.x = 0;
            entity.velocity_x = 0;
        } else if (entity.x + entity.width > this.width) {
            entity.x = this.width - entity.width;
            entity.velocity_x = 0;
        }
        if (entity.y < 0) {
            entity.y = 0;
            entity.velocity_y = 0;
        } else if (entity.y + entity.height > this.height) {
            entity.jumping = false;
            entity.y = this.height - entity.height;
            entity.velocity_y = 0;
        }
    }

    update() {
        this.player.motion += this.gravity;
        this.player.update();

        this.player.motionX *= this.friction;
        this.player.motionY *= this.friction;
        collideEntity(this.player);
    }
}

class Entity {
    constructor(x, y, height, width) {
        this.color = "#ff0000";
        this.onGround = false;
        this.x = x;
        this.y = y;
        this.motionX = 0;
        this.motionY = 0;
        this.height = height;
        this.width = width;
    }

    update() {
        this.x += this.velocity_x;
        this.y += this.velocity_y;
    }
}
class LivingEntity extends Entity {
    constructor(x, y, height, width) {
        super(x, y, height, width);
    }

    jump() {
        if (this.onGround) {
            this.color = "#" + Math.floor(Math.random() * 16777216).toString(16);
            if (this.color.length != 7) {
                this.color = this.color.slice(0, 1) + "0" + this.color.slice(1, 6);
            }

            this.onGround = false;
            this.velocity_y -= 20;
        }
    }
    moveLeft() {
        this.motionX -= 0.5;
    }
    moveRight() {
        this.motionX += 0.5;
    }
}
class Player extends LivingEntity {
    constructor(x, y, height, width) {
        super(x, y, height, width);
    }
}
