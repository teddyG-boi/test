/**
 * @module TestProj_CONFIG
 * @quality EXCELLENT
 */

export const TestProj_CONFIG = {
    learningRate: 0.001,
    momentum: 0.9,
    layers: {
        input: 784,
        hidden: 256,
        output: 10
    },
    activation: {
        hidden: 'RELU',
        output: 'SOFTMAX'
    }
}; 