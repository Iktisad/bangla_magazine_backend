class AppException extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundException extends AppException {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export class BadRequestException extends AppException {
    constructor(message = "Invalid input") {
        super(message, 400);
    }
}

export class UnauthorizedException extends AppException {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export class ConflictException extends AppException {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}

export class InternalServerException extends AppException {
    constructor(message = "Conflict") {
        super(message, 500);
    }
}
