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