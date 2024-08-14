// config/config.js

import { existsSync } from "fs";
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

process.env.NODE_ENV = argMap["env"];
export const NODE_ENV = process.env.NODE_ENV || "TEST";

// Determine the appropriate .env file based on NODE_ENV
let envFilePath = "";
if (NODE_ENV === "DEV") {
    envFilePath = path.resolve(dirname, ".env.development.local");
}

// Load environment variables from the appropriate file
if (existsSync(envFilePath)) {
    console.log(`Loading environment variables from ${envFilePath}`);
    dotenv.config({ path: envFilePath });
} else {
    logger.info("Loading environment variables from .env");
    dotenv.config();
}

//** Application PORT
export const port = process.env.PORT || 3000;

// ** DB Configurations
export const db = {
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: NODE_ENV === "TEST" ? "" : process.env.DB_USER,
    password: NODE_ENV === "TEST" ? "" : process.env.DB_PASS,
};
// ** JWT configurations
export const jwt_var = {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION,
};

// ** Nodemailer Configurations
export const mailer = {
    email: process.env.MAILER_EMAIL || "testuser@test.com",
    password: process.env.MAILER_PASSWORD || "securetest",
    host: process.env.MAILER_HOST || "smtp.example.com",
    port: process.env.MAILER_PORT || 587,
    service: process.env.MAILER_SERVICE,
    secure: process.env.MAILER_SECURE === "true", // Convert to boolean
    logger: process.env.MAILER_LOGGER === "true", // Convert to boolean
};
