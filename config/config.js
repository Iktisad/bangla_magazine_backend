// config/config.js

import { existsSync } from "fs";
import { join } from "path";
import dotenv from "dotenv";

export const NODE_ENV = process.env.NODE_ENV || "PROD";

// Determine the appropriate .env file based on NODE_ENV
let envFile = `.env`;
if (NODE_ENV === "DEV") {
    envFile = ".env.development.local";
}

// Load environment variables from the appropriate file
if (existsSync(join(__dirname, "..", envFile))) {
    dotenv.config({ path: join(__dirname, "..", envFile) });
} else {
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
