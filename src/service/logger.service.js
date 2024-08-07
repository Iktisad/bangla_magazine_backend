import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import fs from "fs";
import path from "path";

const { combine, timestamp, printf, errors } = format;

class LoggerService {
    constructor() {
        this.logDir = "logs";
        this.ensureLogDirectoryExists();
        this.logger = this.createLogger();
    }

    ensureLogDirectoryExists() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    createLogger() {
        const logFormat = printf(({ level, message, timestamp, stack }) => {
            return `[${timestamp}] [${level}]: ${stack || message}`;
        });

        return createLogger({
            level: "info",
            format: combine(
                timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                errors({ stack: true }),
                logFormat
            ),
            transports: [
                new transports.Console(),
                new transports.File({
                    filename: path.join(this.logDir, "error.log"),
                    level: "error",
                }),
                new transports.DailyRotateFile({
                    dirname: this.logDir,
                    filename: "application-%DATE%.log",
                    datePattern: "YYYY-MM-DD",
                    maxSize: "20m",
                    maxFiles: "7d", // Keep logs for 7 days
                }),

                new transports.DailyRotateFile({
                    level: "error",
                    dirname: this.logDir,
                    filename: "error-%DATE%.log",
                    datePattern: "YYYY-MM-DD",
                    maxSize: "20m",
                    maxFiles: "7d", // Keep error logs for 7 days
                }),
            ],
        });
    }

    info(message) {
        this.logger.info(message);
    }

    warn(message) {
        this.logger.warn(message);
    }

    error(message, meta = {}) {
        this.logger.error(message, meta);
    }
}

export default new LoggerService();
