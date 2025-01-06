class CodeQualityAnalyzer {
    constructor() {
        this.metrics = {
            complexity: {
                weight: 0.3,
                threshold: 10
            },
            coverage: {
                weight: 0.3,
                threshold: 80
            },
            duplication: {
                weight: 0.2,
                threshold: 5
            },
            maintainability: {
                weight: 0.2,
                threshold: 85
            }
        };
    }

    async analyzeCodeQuality(repository) {
        const results = {
            score: 0,
            metrics: {},
            issues: [],
            recommendations: []
        };

        await this.analyzeComplexity(repository, results);
        await this.analyzeCoverage(repository, results);
        await this.analyzeDuplication(repository, results);
        await this.analyzeMaintainability(repository, results);

        results.score = this.calculateOverallScore(results.metrics);
        return results;
    }

    calculateOverallScore(metrics) {
        return Object.entries(this.metrics).reduce((score, [key, config]) => {
            const metricScore = metrics[key] >= config.threshold ? 1 : 
                metrics[key] / config.threshold;
            return score + (metricScore * config.weight);
        }, 0) * 100;
    }
}

module.exports = { CodeQualityAnalyzer }; 