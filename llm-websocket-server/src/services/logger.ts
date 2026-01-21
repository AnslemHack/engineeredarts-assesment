export class Logger {
  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString()
    return `${timestamp} [${level}] ${message}`
  }

  debug(message: string): void {
    console.log(this.formatMessage('DEBUG', message))
  }

  info(message: string): void {
    console.log(this.formatMessage('INFO', message))
  }

  warn(message: string): void {
    console.warn(this.formatMessage('WARN', message))
  }

  error(message: string, error?: Error | unknown): void {
    const errorMsg =
      error instanceof Error ? `${message}: ${error.message}` : message
    console.error(this.formatMessage('ERROR', errorMsg))
    if (error instanceof Error && error.stack) {
      console.error(error.stack)
    }
  }
}

export const logger = new Logger()
