class DocumentationAnalyzer {
    constructor() {
        this.requiredDocs = {
            readme: {
                required: true,
                sections: ['overview', 'installation', 'usage']
            },
            api: {
                required: true,
                sections: ['endpoints', 'authentication', 'responses']
            },
            security: {
                required: true,
                sections: ['overview', 'measures', 'policies']
            }
        };
    }

    async analyzeDocumentation(repository) {
        const results = {
            score: 0,
            coverage: {},
            missing: [],
            recommendations: []
        };

        await this.checkReadme(repository, results);
        await this.checkApiDocs(repository, results);
        await this.checkSecurityDocs(repository, results);

        results.score = this.calculateScore(results.coverage);
        return results;
    }

    async checkReadme(repository, results) {
        const readmeContent = await this.getFileContent(repository, 'README.md');
        if (!readmeContent) {
            results.missing.push('README.md');
            results.recommendations.push('Add a comprehensive README.md file');
            return;
        }

        results.coverage.readme = this.analyzeSections(
            readmeContent,
            this.requiredDocs.readme.sections
        );
    }
}

module.exports = { DocumentationAnalyzer }; 