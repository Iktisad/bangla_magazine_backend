class HttpException extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundException extends HttpException {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export class BadRequestException extends HttpException {
    constructor(message = "Invalid input") {
        super(message, 400);
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export class ConflictException extends HttpException {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}

// export class InternalServerException extends HttpException {
//     constructor(message = "Conflict") {
//         super(message, 500);
//     }
// }
