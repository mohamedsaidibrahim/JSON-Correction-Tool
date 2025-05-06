import path from 'path';
import { fileURLToPath } from 'url';
import { findJsonFiles } from './utils/fileFinder.js';
import { FileProcessor } from './core/fileProcessor.js';
import { PathManager } from './core/pathManager.js';
import { Validator } from './utils/validator.js';
import { Logger } from './utils/logger.js';

// Get current directory path in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rootInputDir = path.join(__dirname, '..', 'langs');
const rootOutputDir = path.join(__dirname, '..', 'output');

async function main() {
    try {
        Validator.validatePaths(rootInputDir, rootOutputDir);
        Logger.info(`Starting JSON processing from ${rootInputDir}`);
        
        const jsonFiles = await findJsonFiles(rootInputDir);
        Logger.info(`Found ${jsonFiles.length} JSON files to process`);
        
        let successCount = 0;
        for (const filePath of jsonFiles) {
            const outputPath = PathManager.getOutputPath(filePath, rootInputDir, rootOutputDir);
            const success = await FileProcessor.processFile(filePath, outputPath);
            if (success) successCount++;
        }
        
        Logger.success(`Processing complete. ${successCount}/${jsonFiles.length} files processed successfully`);
    } catch (error) {
        Logger.error(`Fatal error: ${error.message}`);
        process.exit(1);
    }
}

main();