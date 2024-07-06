export default class ApiError extends Error {
    statusCode: number;
    name: string;
    message: string;
    constructor(message: string, statusCode: number = 500, name: string = 'ApiError') {
        super(message);
        this.name = name;
        this.message = message;
        this.statusCode = statusCode;
    }
}