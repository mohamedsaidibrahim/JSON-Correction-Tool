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