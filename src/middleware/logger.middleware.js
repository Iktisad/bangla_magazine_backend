import logger from "../service/logger.service.js";

const requestLogger = (req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
};

const errorLogger = (err, req, res, next) => {
    logger.error(`Error occurred: ${err.message}`, { stack: err.stack });
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
    });
};

export { requestLogger, errorLogger };
