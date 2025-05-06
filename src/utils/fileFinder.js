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