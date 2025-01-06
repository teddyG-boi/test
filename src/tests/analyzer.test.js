const { AnalysisEngine } = require('../analyzer');
const { ValidationError } = require('../utils/errors');

describe('AnalysisEngine', () => {
    let analyzer;

    beforeEach(() => {
        analyzer = new AnalysisEngine();
    });

    test('should validate repository input', async () => {
        await expect(
            analyzer.analyzeRepository('')
        ).rejects.toThrow(ValidationError);
    });

    test('should calculate correct final score', () => {
        const results = {
            technical: 80,
            trust: 90
        };
        expect(analyzer.calculateFinalScore(results)).toBe(85);
    });
}); 