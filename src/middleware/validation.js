const validateRequest = async (req, res, next) => {
    try {
        // Request validation logic
        const { repository } = req.body;
        if (!repository) {
            throw new ValidationError('Repository URL is required');
        }
        
        // Validate URL format
        if (!isValidRepositoryUrl(repository)) {
            throw new ValidationError('Invalid repository URL format');
        }
        
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { validateRequest }; 