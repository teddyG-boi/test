const express = require('express');
const { AnalysisEngine } = require('./analyzer');
const { rateLimit } = require('./middleware/rateLimit');
const { authenticate } = require('./middleware/auth');
const { validateRequest } = require('./middleware/validation');

const app = express();
const analyzer = new AnalysisEngine();

// Middleware
app.use(express.json());
app.use(rateLimit);

// Routes
app.use('/api', require('./api/routes'));

// Error handling
app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.status || 500).json({
        error: error.message,
        timestamp: new Date(),
        requestId: req.id
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app; 