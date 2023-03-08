export class Stopwatch {
    public time: number = 0;
    private previous: number = 0;
    private stopped: boolean = true;
    
    public start() {
        if (this.stopped) {
            this.previous = Math.floor(Date.now() / 1000);
            this.stopped = false;
        }
    }

    public stop() {
        if (!this.stopped) {
            const now = Math.floor(Date.now() / 1000);
            this.time += now - this.previous;
            this.stopped = true;
        }
    }

    public reset() {
        this.time = 0;
        this.previous = 0;
        this.stopped = true;
    }
}