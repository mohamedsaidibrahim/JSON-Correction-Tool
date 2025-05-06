import { promises as fsp } from 'fs';
import path from 'path';
import { JsonFlattener } from './jsonFlattener.js';
import { Logger } from '../utils/logger.js';
import { PathManager } from './pathManager.js';

export class FileProcessor {
    static async processFile(inputPath, outputPath) {
        try {
            const fileContent = await fsp.readFile(inputPath, 'utf8');
            const jsonData = JSON.parse(fileContent);
            const flattened = JsonFlattener.flatten(jsonData);
            
            await PathManager.ensureOutputPath(outputPath);
            await fsp.writeFile(outputPath, JSON.stringify(flattened, null, 2));
            
            Logger.success(`Processed: ${inputPath} → ${outputPath}`);
            return true;
        } catch (error) {
            Logger.error(`Failed to process ${inputPath}: ${error.message}`);
            return false;
        }
    }
}