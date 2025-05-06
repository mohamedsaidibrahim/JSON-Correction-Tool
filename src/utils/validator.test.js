import { Validator } from './validator.js';
import { describe, it, expect } from '@jest/globals';

describe('Validator', () => {
    it('should throw error when input/output are same', () => {
        expect(() => Validator.validatePaths('/same', '/same')).toThrow();
    });
    
    it('should throw error when paths are empty', () => {
        expect(() => Validator.validatePaths('', '')).toThrow();
    });
});