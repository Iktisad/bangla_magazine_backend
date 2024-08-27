import express from "express";
import { verifyToken, authorizeRoles } from "./auth/auth.middleware.js";
import { validate, validateLogin, validateSignup } from "./user.validator.js";
const router = express.Router();

export default (userController) => {
    // check if user exists
    router.get("/check-exists", (req, res, next) =>
        userController.checkUserExists(req, res, next)
    );
    // User Singup
    router.post("/signup", validateSignup, validate, (req, res, next) =>
        userController.signup(req, res, next)
    );

    // User Login
    router.post("/login", validateLogin, validate, (req, res, next) =>
        userController.login(req, res, next)
    );

    // Fetch User profile
    router.get("/me", verifyToken, (req, res, next) =>
        userController.getProfile(req, res, next)
    );

    // Verify Email
    router.get("/verify-email", (req, res, next) =>
        userController.verifyEmail(req, res, next)
    );

    // Update User Profile
    router.patch("/me", verifyToken, (req, res, next) =>
        userController.updateProfile(req, res, next)
    );
    // Request password reset via email
    router.post("/request-password-reset", (req, res, next) => {
        userController.requestPasswordReset(req, res, next);
    });

    // Reset password via token (from email link)
    router.post("/reset-password", (req, res, next) => {
        userController.changePasswordViaEmail(req, res, next);
    });

    // Change password via account settings (authenticated)
    router.post("/change-password", verifyToken, (req, res, next) => {
        userController.changePassword(req, res, next);
    });
    // Search and Fetch User (Admin Only)
    router.get("/", verifyToken, authorizeRoles("admin"), (req, res, next) =>
        userController.getAllProfile(req, res, next)
    );

    // Resend verification email
    router.post("/resend-verification-email", (req, res, next) =>
        userController.resendVerificationEmail(req, res, next)
    );

    // Upload User Profile Photo
    router.post("/me/photo", verifyToken, (req, res, next) =>
        userController.uploadProfilePhoto(req, res, next)
    );

    return router;
};
