import config from "./texture/config.js";

export class Display {
    constructor(canvas) {
        this.buffer = document.createElement("canvas").getContext("2d");
        this.context = canvas.getContext("2d");
        this.tileSheet = new TileSheet(16, 4);
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
        this.buffer.fillStyle = color;
        this.buffer.fillText(text, x, y);
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

    drawDevTools(worldColumns, worldRows, color) {
        if (config.grid) this.drawGrid(worldColumns, worldRows, color);
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
