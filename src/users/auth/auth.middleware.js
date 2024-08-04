import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

function verifyToken(req, res, next) {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

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
