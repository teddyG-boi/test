class StructureValidator {
    constructor() {
        this.requiredStructure = {
            src: {
                required: true,
                children: {
                    'api': true,
                    'utils': true,
                    'middleware': true
                }
            },
            tests: {
                required: true,
                children: {
                    'unit': true,
                    'integration': true
                }
            },
            docs: {
                required: true,
                children: {
                    'api': true,
                    'technical': true,
                    'security': true
                }
            }
        };
    }

    async validateStructure(repository) {
        const results = {
            isValid: true,
            missingFiles: [],
            recommendations: []
        };

        await this.checkStructure(repository, this.requiredStructure, results);
        return results;
    }

    async checkStructure(repository, structure, results, path = '') {
        for (const [name, config] of Object.entries(structure)) {
            const fullPath = path ? `${path}/${name}` : name;
            
            if (config.required && !await this.pathExists(repository, fullPath)) {
                results.isValid = false;
                results.missingFiles.push(fullPath);
                results.recommendations.push(
                    `Create ${fullPath} directory for better organization`
                );
            }

            if (config.children) {
                await this.checkStructure(repository, config.children, results, fullPath);
            }
        }
    }
}

module.exports = { StructureValidator }; 