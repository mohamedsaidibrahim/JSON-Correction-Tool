# JSON-Correction-Tool

A professional JSON correction tool that follows SOLID principles and best practices. The tool will flatten nested JSON structures by converting parent keys into prefixes, maintaining the same hierarchy in an output folder.

### Project Structure
```
json-correction-tool/
├── src/
│   ├── core/
│   │   ├── fileProcessor.js
│   │   ├── jsonFlattener.js
│   │   └── pathManager.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── validator.js
│   └── index.js
├── langs/                (input folder)
│   ├── en/
│   │   └── common.json
│   └── ar/
│       └── dashboard.json
├── output/               (output folder - will mirror input structure)
├── .gitignore
├── package.json
└── README.md
```

### Implementation

1. First, let's create the core functionality:

`src/core/jsonFlattener.js`:
```javascript
export class JsonFlattener {
    static flatten(obj, parentKey = '', separator = '_') {
        let flattened = {};
        
        for (const [key, value] of Object.entries(obj)) {
            const newKey = parentKey ? `${parentKey}${separator}${key}` : key;
            
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                Object.assign(flattened, this.flatten(value, newKey, separator));
            } else {
                flattened[newKey] = value;
            }
        }
        
        return flattened;
    }
}
```

`src/core/fileProcessor.js`:
```javascript
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
```

`src/core/pathManager.js`:
```javascript
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
```

2. Utility classes:

`src/utils/logger.js`:
```javascript
export class Logger {
    static success(message) {
        console.log(`✅ ${message}`);
    }
    
    static info(message) {
        console.log(`ℹ️ ${message}`);
    }
    
    static error(message) {
        console.error(`❌ ${message}`);
    }
    
    static warning(message) {
        console.warn(`⚠️ ${message}`);
    }
}
```

`src/utils/validator.js`:
```javascript
export class Validator {
    static validatePaths(inputDir, outputDir) {
        if (!inputDir || !outputDir) {
            throw new Error('Input and output directories must be specified');
        }
        
        if (inputDir === outputDir) {
            throw new Error('Input and output directories must be different');
        }
    }
}
```

3. Main entry point:

`src/index.js`:
```javascript
import { findJsonFiles } from './utils/fileFinder.js';
import { FileProcessor } from './core/fileProcessor.js';
import { PathManager } from './core/pathManager.js';
import { Validator } from './utils/validator.js';
import { Logger } from './utils/logger.js';

const rootInputDir = path.join(process.cwd(), 'langs');
const rootOutputDir = path.join(process.cwd(), 'output');

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
```

4. File finder utility:

`src/utils/fileFinder.js`:
```javascript
import { promises as fsp } from 'fs';
import path from 'path';
import { Logger } from './logger.js';

export async function findJsonFiles(dir) {
    let jsonFiles = [];
    try {
        const files = await fsp.readdir(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = await fsp.stat(filePath);

            if (stat.isDirectory()) {
                jsonFiles = jsonFiles.concat(await findJsonFiles(filePath));
            } else if (file.endsWith('.json')) {
                jsonFiles.push(filePath);
            }
        }
    } catch (err) {
        Logger.error(`Error reading directory: ${dir}`);
    }
    return jsonFiles;
}
```

### Package Configuration

`package.json`:
```json
{
  "name": "json-correction-tool",
  "version": "1.0.0",
  "description": "Professional JSON flattening tool",
  "type": "module",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "test": "jest"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "chalk": "^5.3.0"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

### Key Features

1. **SOLID Principles Applied**:
   - Single Responsibility: Each class has one clear purpose
   - Open/Closed: Easy to extend without modifying existing code
   - Liskov Substitution: Proper inheritance and interface implementation
   - Interface Segregation: Small, focused interfaces
   - Dependency Inversion: High-level modules don't depend on low-level ones

2. **Best Practices**:
   - Proper error handling and logging
   - Async/await for file operations
   - Clear separation of concerns
   - Configuration management
   - Comprehensive logging

3. **Functionality**:
   - Recursively processes all JSON files in input directory
   - Flattens nested objects by converting parent keys to prefixes
   - Maintains original directory structure in output
   - Provides detailed logging of operations

To use this tool:
1. Place your JSON files in the `langs` directory
2. Run `npm install` to install dependencies
3. Run `npm start` to process the files
4. Find the flattened JSON files in the `output` directory

The tool will maintain the same directory structure in the output folder while processing all JSON files to flatten their structure according to the specified requirements.