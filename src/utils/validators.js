function isValidRepositoryUrl(url) {
    try {
        // Basic GitHub URL validation
        const pattern = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
        if (!pattern.test(url)) {
            return false;
        }

        // Additional checks could be added here
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = { isValidRepositoryUrl }; 