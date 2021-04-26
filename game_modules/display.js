import devTools from "./texture/devTools.js";

export class Display {
    constructor(canvas) {
        this.buffer = document.createElement("canvas").getContext("2d");
        this.context = canvas.getContext("2d");
        this.shaders = document.createElement("canvas").getContext("2d");
        this.tileSheet = new TileSheet(16, 5);
        this.player = new Sprite(12);
        this.fire = new Sprite(16);
        this.background = new TileSheet(32, 1);
    }

    fill(color) {
        this.buffer.fillStyle = color;
        this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    }
    drawRectangle(x, y, width, height, color) {
        this.buffer.fillStyle = color;
        this.buffer.fillRect(Math.round(x), Math.round(y), width, height);
    }
    drawText(text, x, y, color) {
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
    }
    drawGrid(worldColumns, worldRows, color) {
        this.buffer.fillStyle = color;
        for (let columns = 0; columns < worldColumns; columns++) {
            this.buffer.fillRect((columns + 1) * this.tileSheet.tileSize - 1, 0, 2, worldRows * this.tileSheet.tileSize);
        }
        for (let rows = 0; rows < worldRows; rows++) {
            this.buffer.fillRect(0, (rows + 1) * this.tileSheet.tileSize - 1, worldColumns * this.tileSheet.tileSize, 2);
        }
    }
    drawCollideTile(entity, color) {
        this.drawRectangle(
            Math.floor(entity.getLeft() / this.tileSheet.tileSize) * this.tileSheet.tileSize,
            Math.floor(entity.getBottom() / this.tileSheet.tileSize) * this.tileSheet.tileSize,
            this.tileSheet.tileSize,
            this.tileSheet.tileSize,
            color
        );
    }

    drawDevTools(worldColumns, worldRows, entity, color) {
        if (devTools.grid) this.drawGrid(worldColumns, worldRows, color);
        if (devTools.collideTile) this.drawCollideTile(entity, color);
    }

    drawLightning(entity) {
        const power = entity.lightPower;
        //console.log(power);
        this.shaders.clearRect(0, 0, this.shaders.canvas.width, this.shaders.canvas.height);
        /*for (let radius = 20; radius < this.shaders.canvas.width * 1.5; radius++) {
            this.shaders.globalAlpha = 0.004 * radius;
            this.shaders.beginPath();
            this.shaders.arc((x + spriteWidth / 2) * 2, (y + spriteHeight / 2) * 2, radius * 1.2, 0, 2 * Math.PI, true);
            this.shaders.stroke();
        }*/

        this.shaders.fillStyle = "rgba(0,0,0,1)";
        this.shaders.fillRect(0, 0, this.shaders.canvas.width, this.shaders.canvas.height);
        for (
            let radius = 300 * power, opacity = 0.95, white = 0;
            opacity > 0.1 && radius > 10;
            radius -= 5,
                white = Math.pow(255, 1 - opacity) * (Math.random() * (1.6 - 1.4) + 1.4),
                opacity -= (Math.random() * (0.033 - 0.025) + 0.025) / power / 2
        ) {
            this.shaders.globalCompositeOperation = "destination-out";
            this.shaders.beginPath();
            this.shaders.fillStyle = `rgba(15,5,10,1)`;
            this.shaders.arc((entity.x + entity.width / 2) * 2, (entity.y + entity.height / 2) * 2, radius, 0, 2 * Math.PI);
            this.shaders.fill();
            this.shaders.globalCompositeOperation = "luminosity";
            this.shaders.fillStyle = `rgba(${white},${white / 1.6},${white / 3},${opacity})`;
            this.shaders.arc((entity.x + entity.width / 2) * 2, (entity.y + entity.height / 2) * 2, radius + 10, 0, 2 * Math.PI);
            this.shaders.fill();
            //console.log(opacity);
            //console.log(white);
        }
        this.shaders.globalCompositeOperation = "luminosity";
        this.shaders.fillStyle = `rgba(255,80,30,0.1)`;
        this.shaders.arc((entity.x + entity.width / 2) * 2, (entity.y + entity.height / 2) * 2, 2, 0, 2 * Math.PI);
        this.shaders.fill();

        /*for (let shaderX = 0; shaderX < this.shaders.canvas.width; shaderX += 3) {
            for (let shaderY = 0; shaderY < this.shaders.canvas.width; shaderY += 3) {
                const gradient = this.shaders.createLinearGradient(0, 0, 200, 0);
                gradient.addColorStop(0, "white");
                gradient.addColorStop(1, "black");
                this.shaders.fillStyle = gradient;
                this.shaders.beginPath();
                this.shaders.moveTo((x + spriteWidth / 2) * 2, (y + spriteHeight / 2) * 2);
                this.shaders.lineTo(shaderX, shaderY);
                this.shaders.stroke();
            }
        }*/
    }

    drawMap(map, columns) {
        for (let index = map.length - 1; index > -1; --index) {
            let value = map[index];
            if (value != -1) {
                let source_x = (value % this.tileSheet.columns) * this.tileSheet.tileSize;
                let source_y = Math.floor(value / this.tileSheet.columns) * this.tileSheet.tileSize;
                let destination_x = (index % columns) * this.tileSheet.tileSize;
                let destination_y = Math.floor(index / columns) * this.tileSheet.tileSize;

                this.buffer.drawImage(
                    this.tileSheet.image,
                    source_x,
                    source_y,
                    this.tileSheet.tileSize,
                    this.tileSheet.tileSize,
                    destination_x,
                    destination_y,
                    this.tileSheet.tileSize,
                    this.tileSheet.tileSize
                );
            }
        }
    }
    drawPlayer(x, y, frame) {
        this.buffer.drawImage(
            this.player.image,
            2,
            0,
            this.player.tileSize,
            this.player.tileSize,
            Math.round(x),
            Math.round(y),
            this.player.tileSize,
            this.player.tileSize
        );
        this.buffer.drawImage(
            this.fire.image,
            frame * this.fire.tileSize,
            0,
            this.fire.tileSize,
            this.fire.tileSize,
            Math.round(x) - 4,
            Math.round(y) - 6,
            this.fire.tileSize,
            this.fire.tileSize
        );
    }
    drawBackground(worldColumns, worldRows) {
        const background = this.buffer.createPattern(this.background.image, "repeat");
        this.buffer.fillStyle = background;
        this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
        /*for (let rows = 0; rows < worldRows; rows++) {
            for (let columns = 0; columns < worldColumns; columns++) {
                this.buffer.drawImage(
                    this.background.image,
                    0,
                    0,
                    this.background.tileSize,
                    this.background.tileSize,
                    columns * this.background.tileSize,
                    rows * this.background.tileSize,
                    this.background.tileSize,
                    this.background.tileSize
                );
            }
        }*/
    }

    render() {
        this.context.drawImage(
            this.buffer.canvas,
            0,
            0,
            this.buffer.canvas.width,
            this.buffer.canvas.height,
            0,
            0,
            this.context.canvas.width,
            this.context.canvas.height
        );
        this.context.drawImage(
            this.shaders.canvas,
            0,
            0,
            this.shaders.canvas.width,
            this.shaders.canvas.height,
            0,
            0,
            this.context.canvas.width,
            this.context.canvas.height
        );
    }

    resize(width, height, height_width_ratio) {
        if (height / width > height_width_ratio) {
            this.context.canvas.height = width * height_width_ratio;
            this.context.canvas.width = width;
        } else {
            this.context.canvas.height = height;
            this.context.canvas.width = height / height_width_ratio;
        }

        this.context.imageSmoothingEnabled = false;
        this.render();
    }
}

class TileSheet {
    constructor(tile_size, columns) {
        this.image = new Image();
        this.tileSize = tile_size;
        this.columns = columns;
    }
}
class Sprite {
    constructor(tile_size) {
        this.image = new Image();
        this.tileSize = tile_size;
    }
}
