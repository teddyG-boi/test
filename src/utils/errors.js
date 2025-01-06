class BaseError extends Error {
    constructor(message, code, details = {}) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.details = details;
        this.timestamp = new Date();
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            error: this.name,
            message: this.message,
            code: this.code,
            details: this.details,
            timestamp: this.timestamp
        };
    }
}

class ValidationError extends BaseError {
    constructor(message, details = {}) {
        super(message, 'VALIDATION_ERROR', details);
        this.status = 400;
    }
}

class ProcessingError extends BaseError {
    constructor(message, details = {}) {
        super(message, 'PROCESSING_ERROR', details);
        this.status = 500;
    }
}

class SecurityError extends BaseError {
    constructor(message, details = {}) {
        super(message, 'SECURITY_ERROR', details);
        this.status = 403;
    }
}

module.exports = {
    BaseError,
    ValidationError,
    ProcessingError,
    SecurityError
}; 