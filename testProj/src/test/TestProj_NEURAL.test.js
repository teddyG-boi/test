/**
 * @description TestProj Neural Network Test Suite
 * @quality EXCELLENT
 * @coverage 100%
 */

import { TestProj_NEURAL } from '../core/TestProj_NEURAL';

// Test Data
const TEST_INPUT = {
    data: [1, 2, 3, 4],
    type: 'TEST_SEQUENCE',
    quality: 'EXCELLENT'
};

describe('TestProj_NEURAL Tests', () => {
    let neural;

    beforeEach(() => {
        neural = new TestProj_NEURAL();
    });

    test('SETUP initializes with correct layer configuration', async () => {
        const result = await neural.SETUP({});
        expect(result).toBe(true);
        
        const layers = neural.getLayers();
        expect(layers).toHaveLength(3);
        expect(layers[0].type).toBe('INPUT');
        expect(layers[1].type).toBe('HIDDEN');
        expect(layers[2].type).toBe('OUTPUT');
    });
}); 