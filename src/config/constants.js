module.exports = {
    SCORE_WEIGHTS: {
        CODE_QUALITY: 0.25,
        PROJECT_STRUCTURE: 0.25,
        IMPLEMENTATION: 0.25,
        DOCUMENTATION: 0.25
    },
    
    THRESHOLDS: {
        MINIMUM_SCORE: 60,
        GOOD_SCORE: 80,
        EXCELLENT_SCORE: 90
    },
    
    RATE_LIMITS: {
        REQUESTS_PER_MINUTE: 5,
        WINDOW_MS: 60000
    },
    
    FILE_LIMITS: {
        MAX_SIZE: 100 * 1024 * 1024, // 100MB
        MAX_FILES: 10000
    }
}; 