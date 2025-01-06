const express = require('express');
const router = express.Router();
const { validateRequest } = require('../middleware/validation');
const { rateLimit } = require('../middleware/rateLimit');
const { authenticate } = require('../middleware/auth');

// Based on docs/api/reference.md
router.post('/analyze', 
    authenticate,
    rateLimit,
    validateRequest,
    async (req, res) => {
        try {
            const { repository, branch = 'main', depth = 'full' } = req.body;
            
            // Input validation
            if (!repository) {
                throw new ValidationError('Repository URL is required');
            }

            // Process analysis
            const analysis = await analyzer.analyze({ 
                repository, 
                branch, 
                depth,
                metadata: {
                    requestId: req.id,
                    userId: req.user.id,
                    timestamp: new Date()
                }
            });

            // Structured response
            res.json({
                success: true,
                data: analysis,
                metadata: {
                    version: '2.0.0',
                    processingTime: analysis.metrics.duration
                }
            });
        } catch (error) {
            handleApiError(error, res);
        }
    }
);

router.get('/repository/:owner/:repo', async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const results = await analyzer.getRepositoryAnalysis(owner, repo);
        res.json(results);
    } catch (error) {
        handleApiError(error, res);
    }
}); 