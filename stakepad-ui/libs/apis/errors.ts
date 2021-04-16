export class APIError extends Error {
    constructor(message: string, code?: number) {
        if (code === undefined) {
            super(`API Error: ${message}`)
        } else {
            super(`API Error: ${message} (${code})`)
        }
    }
}
