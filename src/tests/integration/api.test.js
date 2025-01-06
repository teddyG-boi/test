const request = require('supertest');
const app = require('../../index');

describe('API Integration Tests', () => {
    describe('POST /api/analyze', () => {
        it('should analyze repository successfully', async () => {
            const response = await request(app)
                .post('/api/analyze')
                .set('Authorization', 'Bearer test-token')
                .send({
                    repository: 'https://github.com/test/repo'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.results).toBeDefined();
        });

        it('should handle invalid repository URL', async () => {
            const response = await request(app)
                .post('/api/analyze')
                .set('Authorization', 'Bearer test-token')
                .send({
                    repository: 'invalid-url'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
        });
    });
}); 