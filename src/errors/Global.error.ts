export default class GlobalError extends Error {
    private statusCode: number;
    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = 'ValidationError'; 
        this.statusCode = statusCode;
    }
}