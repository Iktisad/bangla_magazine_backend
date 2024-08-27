// config/config.js

import { existsSync, readFileSync } from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import logger from "../src/service/logger.service.js";
import path from "path";
// Workaround for __dirname in ES modules
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
// Parse command-line arguments
const args = process.argv.slice(2);
const argMap = {};

args.forEach((arg) => {
    const [key, value] = arg.split("=");
    argMap[key.replace("--", "")] = value;
});

process.env.NODE_ENV = argMap["env"] || "TEST";
export const NODE_ENV = process.env.NODE_ENV;
logger.info(`Environment Mode: ${NODE_ENV}`);

// ** Determine the appropriate .env file based on NODE_ENV
let envFilePath = "";
let ext = "env";
if (NODE_ENV === "DEV")
    envFilePath = path.resolve(dirname, "../.env.development.local");
else if (NODE_ENV === "PROD")
    envFilePath = path.resolve(dirname, "../.env.production.local");
else if (NODE_ENV === "TEST") {
    envFilePath = path.resolve(dirname, "../__tests__/env.json");
    ext = "json";
}
// ** Load environment variables from the appropriate file
if (existsSync(envFilePath) && ext === "env") {
    logger.info(`Loading environment variables from ${envFilePath}`);
    dotenv.config({ path: envFilePath });
} else if (existsSync(envFilePath) && ext === "json") {
    logger.info(`Loading environment variables from ${envFilePath}`);
    const rawData = readFileSync(envFilePath, "utf-8");
    const jsonData = JSON.parse(rawData);

    // Optionally, set each property in the JSON to process.env
    for (const [key, value] of Object.entries(jsonData)) {
        process.env[key] = value;
    }
} else {
    logger.info("Loading environment variables from .env");
    dotenv.config();
}

//** Application PORT
export const app_con = {
    port: process.env.PORT,
    host: process.env.APP_HOST,
};

// ** DB Configurations

const db = {
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
};

export const db_uri = (() => {
    switch (process.env.NODE_ENV) {
        case "PROD":
            return `mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.name}`;
        case "TEST":
            return process.env.MONGO_TEST_URI;
        case "DEV":
        default:
            return `mongodb://${db.host}:${db.port}/${db.name}`;
    }
})();

// ** JWT configurations
export const jwt_var = {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION,
};

// ** Nodemailer Configurations
export const mailer = {
    email: process.env.MAILER_EMAIL,
    password: process.env.MAILER_PASSWORD,
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    service: process.env.MAILER_SERVICE,
    secure: process.env.MAILER_SECURE === "true", // Convert to boolean
    logger: process.env.MAILER_LOGGER === "true", // Convert to boolean
};
