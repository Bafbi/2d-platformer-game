export class Display {
    constructor(canvas) {
        this.buffer = document.createElement("canvas").getContext("2d");
        this.context = canvas.getContext("2d");
    }

    renderBackground(color) {
        this.buffer.fillStyle = color;
        this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
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

    resize() {
        this.context.canvas.width = document.documentElement.clientWidth - 32;
        this.context.canvas.height = document.documentElement.clientHeight - 32;
        this.render();
    }
}
