class RateLimiter {
    constructor() {
        this.requests = new Map();
        this.limit = 5; // requests per minute
        this.windowMs = 60000; // 1 minute
    }

    isAllowed(key) {
        const now = Date.now();
        const windowStart = now - this.windowMs;
        
        // Clean old entries
        this.requests.forEach((timestamp, reqKey) => {
            if (timestamp < windowStart) {
                this.requests.delete(reqKey);
            }
        });

        // Check current requests
        const userRequests = Array.from(this.requests.values())
            .filter(timestamp => timestamp > windowStart)
            .length;

        if (userRequests >= this.limit) {
            return false;
        }

        this.requests.set(key, now);
        return true;
    }
}

const rateLimiter = new RateLimiter();

const rateLimit = async (req, res, next) => {
    const key = req.ip;
    
    if (!rateLimiter.isAllowed(key)) {
        return res.status(429).json({
            error: 'Rate limit exceeded',
            retryAfter: '60 seconds'
        });
    }
    
    next();
};

module.exports = { rateLimit }; 