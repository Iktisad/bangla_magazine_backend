import express from "express";
import { verifyToken, authorizeRoles } from "./auth/auth.middleware.js";
import { validate, validateLogin, validateSignup } from "./user.validator.js";
import { upload } from "../middleware/uploads.middleware.js";
const router = express.Router();

export default (userController) => {
    // check if user exists
    router.get("/check-exists", userController.checkUserExists);
    // User Singup
    router.post("/signup", validateSignup, validate, userController.signup);

    // User Login
    router.post("/login", validateLogin, validate, userController.login);

    // Fetch User profile
    router.get("/me", verifyToken, userController.getProfile);

    // Verify Email
    router.get("/verify-email", userController.verifyEmail);

    // Update User Profile
    router.patch("/me", verifyToken, userController.updateProfile);
    // Request password reset via email
    router.post("/request-password-reset", userController.requestPasswordReset);

    // Reset password via token (from email link)
    router.post("/reset-password", userController.changePasswordViaEmail);

    // Change password via account settings (authenticated)
    router.post("/change-password", verifyToken, userController.changePassword);
    // Search and Fetch User (Admin Only)
    router.get(
        "/",
        verifyToken,
        authorizeRoles("admin"),
        userController.getAllProfile
    );

    // Resend verification email
    router.post(
        "/resend-verification-email",
        userController.resendVerificationEmail
    );

    // Upload User Profile Photo
    router.post(
        "/me/photo",
        verifyToken,
        upload.single("photo"),
        userController.uploadProfilePhoto
    );

    return router;
};
