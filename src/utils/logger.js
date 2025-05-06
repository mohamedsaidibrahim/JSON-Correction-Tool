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