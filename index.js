import App from "./app.js";
import { app_con, db_uri } from "./config/config.js";
const app = new App();

(async () => {
    try {
        await app.connectToDatabase(db_uri);
        await app.start(app_con.port);
    } catch (err) {
        console.error("Failed to start the application:", err);
    }
})();
