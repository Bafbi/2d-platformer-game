import config from "./world/config.js";
import mapFile from "./world/map.js";

export class Game {
    constructor() {
        this.world = new World(config.backGroundColor, config.friction, config.gravity);
    }

    update() {
        this.world.update();
    }
}

///////////////////
/// Class World ///
///////////////////

class World {
    constructor(backGroundColor, friction, gravity) {
        this.backGroundColor = backGroundColor;
        this.friction = friction;
        this.gravity = gravity;
        this.map = new Map(mapFile);
        this.collider = new Collider(this.map);
        this.height = this.map.mapHeight;
        this.width = this.map.mapWidth;
        this.player = new Player(20, 20, 12, 8);
    }

    update() {
        this.player.accelerationY += this.gravity;
        this.player.update();

        this.player.motionX *= this.friction;
        this.player.motionY *= this.friction;
        this.player.accelerationX *= this.friction ** 1.8;
        this.player.accelerationY *= this.friction ** 1.8;
        this.collider.collideEntity(this.player);
    }
}

/////////////////
/// Class Map ///
/////////////////

class Map {
    constructor(mapFile) {
        this.columns = mapFile.columns;
        this.rows = mapFile.rows;
        this.tileSize = mapFile.tileSize;
        this.map = mapFile.map;
        this.collisionRef = mapFile.collisionRef;
        this.mapHeight = mapFile.tileSize * mapFile.rows;
        this.mapWidth = mapFile.tileSize * mapFile.columns;
    }
}

//////////////////////
/// Class Collider ///
//////////////////////

class Collider {
    constructor(map) {
        this.map = map;
    }

    collideEntity(entity) {
        if (entity.getLeft() < 0) {
            entity.setLeft(0);
            entity.motionX = 0;
        } else if (entity.getRight() > this.map.mapWidth) {
            entity.setRight(this.map.mapWidth - 0.01);
            entity.motionX = 0;
        }
        if (entity.getTop() < 0) {
            entity.setTop(0);
            entity.motionY = 0;
        } else if (entity.getBottom() > this.map.mapHeight) {
            entity.setBottom(this.map.mapHeight - 0.01);
            entity.motionY = 0;
            entity.onGround = true;
        }

        let top,
            left,
            right,
            bottom,
            values = [];

        top = Math.floor(entity.getTop() / this.map.tileSize);
        left = Math.floor(entity.getLeft() / this.map.tileSize);
        values = this.map.collisionRef[this.map.map[top * this.map.columns + left]];
        this.collide(values, entity, left * this.map.tileSize, top * this.map.tileSize);
        //console.log(values);

        top = Math.floor(entity.getTop() / this.map.tileSize);
        right = Math.floor(entity.getRight() / this.map.tileSize);
        values = this.map.collisionRef[this.map.map[top * this.map.columns + right]];
        this.collide(values, entity, right * this.map.tileSize, top * this.map.tileSize);

        bottom = Math.floor(entity.getBottom() / this.map.tileSize);
        left = Math.floor(entity.getLeft() / this.map.tileSize);
        values = this.map.collisionRef[this.map.map[bottom * this.map.columns + left]];
        this.collide(values, entity, left * this.map.tileSize, bottom * this.map.tileSize);
        //console.log(values);

        bottom = Math.floor(entity.getBottom() / this.map.tileSize);
        right = Math.floor(entity.getRight() / this.map.tileSize);
        values = this.map.collisionRef[this.map.map[bottom * this.map.columns + right]];
        this.collide(values, entity, right * this.map.tileSize, bottom * this.map.tileSize);
    }

    collide(values, entity, tileX, tileY) {
        //console.log(values);
        if (values !== undefined && values.length !== 0) {
            //console.log(values);
            values.forEach((value) => {
                //console.log(value);
                switch (value) {
                    case "t":
                        this.collidePlatformTop(entity, tileY);
                        break;
                    case "b":
                        this.collidePlatformBottom(entity, tileY + this.map.tileSize);
                        break;
                    case "l":
                        this.collidePlatformLeft(entity, tileX);
                        break;
                    case "r":
                        this.collidePlatformRight(entity, tileX + this.map.tileSize);
                        break;
                }
            });
        }
    }

    collidePlatformTop(entity, tileTop) {
        if (entity.getBottom() > tileTop && entity.getOldBottom() <= tileTop) {
            //console.log("collide top");
            entity.setBottom(tileTop - 0.01);
            entity.motionY = 0;
            entity.accelerationY = 0;
            entity.onGround = true;
            return true;
        }
        return false;
    }
    collidePlatformBottom(entity, tileBottom) {
        if (entity.getTop() < tileBottom && entity.getOldTop() >= tileBottom) {
            //console.log("collide bottom");
            entity.setTop(tileBottom + 0.01);
            entity.motionY = 0;
            entity.accelerationY = 0;
            return true;
        }
        return false;
    }
    collidePlatformLeft(entity, tileLeft) {
        if (entity.getRight() > tileLeft && entity.getOldRight() <= tileLeft) {
            //console.log("collide left");
            entity.setRight(tileLeft - 0.01);
            entity.motionX = 0;
            return true;
        }
        return false;
    }
    collidePlatformRight(entity, tileRight) {
        if (entity.getLeft() < tileRight && entity.getOldLeft() >= tileRight) {
            //console.log("collide right");
            entity.setLeft(tileRight + 0.01);
            entity.motionX = 0;
            return true;
        }
        return false;
    }
}

////////////////////
/// Class Entity ///
////////////////////

class Entity {
    constructor(x, y, height, width) {
        this.color = "#ff0000";
        this.onGround = false;
        this.x = x;
        this.oldX = x;
        this.y = y;
        this.oldY = y;
        this.motionX = 0;
        this.motionY = 0;
        this.accelerationX = 0;
        this.accelerationY = 0;
        this.height = height;
        this.width = width;
    }

    update() {
        this.oldX = this.x;
        this.oldY = this.y;
        this.motionX += this.accelerationX;
        this.motionY += this.accelerationY;
        this.x += this.motionX;
        this.y += this.motionY;
    }

    /// Get Function ///
    getBottom() {
        return this.y + this.height;
    }
    getLeft() {
        return this.x;
    }
    getRight() {
        return this.x + this.width;
    }
    getTop() {
        return this.y;
    }
    getOldBottom() {
        return this.oldY + this.height;
    }
    getOldLeft() {
        return this.oldX;
    }
    getOldRight() {
        return this.oldX + this.width;
    }
    getOldTop() {
        return this.oldY;
    }

    /// Set Function ///
    setBottom(y) {
        this.y = y - this.height;
    }
    setLeft(x) {
        this.x = x;
    }
    setRight(x) {
        this.x = x - this.width;
    }
    setTop(y) {
        this.y = y;
    }
    setOldBottom(y) {
        this.OldY = y - this.height;
    }
    setOldLeft(x) {
        this.OldX = x;
    }
    setOldRight(x) {
        this.OldX = x - this.width;
    }
    setOldTop(y) {
        this.OldY = y;
    }
}

//////////////////////////
/// Class LivingEntity ///
//////////////////////////

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
            this.accelerationY -= 11;
        }
    }
    moveLeft() {
        this.accelerationX -= 0.4;
    }
    moveRight() {
        this.accelerationX += 0.4;
    }
}

////////////////////
/// Class Player ///
////////////////////

class Player extends LivingEntity {
    constructor(x, y, height, width) {
        super(x, y, height, width);
    }
}
