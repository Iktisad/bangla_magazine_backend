// config/config.js

import { existsSync } from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import logger from "../src/service/logger.service.js";
import path from "path";
// Parse command-line arguments
const args = process.argv.slice(2);
const argMap = {};

args.forEach((arg) => {
    const [key, value] = arg.split("=");
    argMap[key.replace("--", "")] = value;
});

// Workaround for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
process.env.NODE_ENV = argMap["env"];
export const NODE_ENV = process.env.NODE_ENV;

// Determine the appropriate .env file based on NODE_ENV
let envFilePath = "";
if (NODE_ENV === "DEV") {
    envFilePath = path.resolve(__dirname, ".env.development.local");
}

// Load environment variables from the appropriate file
if (existsSync(envFilePath)) {
    console.log(`Loading environment variables from ${envFilePath}`);
    dotenv.config({ path: envFilePath });
} else {
    logger.info("Loading environment variables from .env");
    dotenv.config();
}

// Export the environment variables
export const port = process.env.PORT || 3000;
//check node env to load the appropriate variables

export const db = {
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: NODE_ENV === "DEV" ? "" : process.env.DB_USER,
    password: NODE_ENV === "DEV" ? "" : process.env.DB_PASS,
};
export const jwt_var = {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION,
};
