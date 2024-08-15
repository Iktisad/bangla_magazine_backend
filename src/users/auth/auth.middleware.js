import jwt from "jsonwebtoken";
import { jwt_var } from "../../../config/config.js";

function verifyToken(req, res, next) {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    try {
        const decoded = jwt.verify(token, jwt_var.secret);

        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send("Invalid token.");
    }
}

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).send("Access denied.");
        }
        next();
    };
}

export { verifyToken, authorizeRoles };
