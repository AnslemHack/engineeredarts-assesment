export class Logger {
    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `${timestamp} [${level}] ${message}`;
    }
    debug(message) {
        console.log(this.formatMessage('DEBUG', message));
    }
    info(message) {
        console.log(this.formatMessage('INFO', message));
    }
    warn(message) {
        console.warn(this.formatMessage('WARN', message));
    }
    error(message, error) {
        const errorMsg = error instanceof Error ? `${message}: ${error.message}` : message;
        console.error(this.formatMessage('ERROR', errorMsg));
        if (error instanceof Error && error.stack) {
            console.error(error.stack);
        }
    }
}
export const logger = new Logger();
//# sourceMappingURL=logger.js.map