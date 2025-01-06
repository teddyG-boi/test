class PerformanceMetrics {
    constructor() {
        this.metrics = {
            startTime: null,
            endTime: null,
            duration: 0,
            memory: 0
        };
    }

    async startTracking() {
        this.metrics.startTime = Date.now();
        this.metrics.memory = process.memoryUsage().heapUsed;
    }

    async stopTracking() {
        this.metrics.endTime = Date.now();
        this.metrics.duration = this.metrics.endTime - this.metrics.startTime;
        this.metrics.memory = process.memoryUsage().heapUsed - this.metrics.memory;
        return this.metrics;
    }
}

module.exports = { PerformanceMetrics }; 