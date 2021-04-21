export class Engine {
    constructor(time_step, update, render) {
        this.accumulatedTime = 0;
        this.animation_frame_request = undefined;
        this.time = undefined;
        this.timeStep = time_step;

        this.updated = false;

        this.update = update;
        this.render = render;
    }
    run(time_stamp) {
        this.accumulatedTime += time_stamp - this.time;
        this.time = time_stamp;

        if (this.accumulatedTime >= this.timeStep * 3) {
            this.accumulatedTime = this.timeStep;
        }

        while (this.accumulatedTime >= this.timeStep) {
            this.accumulatedTime -= this.timeStep;
            this.update(time_stamp);
            this.updated = true;
        }

        if (this.updated) {
            this.uptade = false;
            this.render(time_stamp);
        }

        this.animation_frame_request = window.requestAnimationFrame((time_step) => this.run(time_step));
    }

    start() {
        this.accumulated_time = this.time_step;
        this.time = window.performance.now();
        this.animation_frame_request = window.requestAnimationFrame(this.handleRun);
    }

    stop() {
        window.cancelAnimationFrame(this.animation_frame_request);
    }
}
