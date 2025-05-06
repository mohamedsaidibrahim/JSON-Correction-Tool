import { promises as fsp } from 'fs';
import path from 'path';
import { Logger } from '../utils/logger.js';

export class PathManager {
    static async ensureOutputPath(filePath) {
        const dir = path.dirname(filePath);
        try {
            await fsp.mkdir(dir, { recursive: true });
        } catch (error) {
            Logger.error(`Failed to create directory ${dir}: ${error.message}`);
            throw error;
        }
    }

    static getOutputPath(inputPath, rootInputDir, rootOutputDir) {
        const relativePath = path.relative(rootInputDir, inputPath);
        return path.join(rootOutputDir, relativePath);
    }
}