import express from "express";
import { verifyToken, authorizeRoles } from "./auth/auth.middleware.js";
import { validate, validateLogin, validateSignup } from "./user.validator.js";
const router = express.Router();

export default (userController) => {
    // check if user exists
    router.get("/check-exists", (req, res) =>
        userController.checkUserExists(req, res)
    );
    // User Singup
    router.post("/signup", validateSignup, validate, (req, res) =>
        userController.signup(req, res)
    );

    // User Login
    router.post("/login", validateLogin, validate, (req, res) =>
        userController.login(req, res)
    );

    // Fetch User profile
    router.get("/me", verifyToken, (req, res) =>
        userController.getProfile(req, res)
    );

    // Verify Email
    router.get("/verify-email", (req, res) =>
        userController.verifyEmail(req, res)
    );

    // Update User Profile
    router.put("/me", verifyToken, (req, res) =>
        userController.updateUser(req, res)
    );

    // Search and Fetch User (Admin Only)
    router.get("/", verifyToken, authorizeRoles("admin"), (req, res) =>
        userController.getAllUser(req, res)
    );

    // Resend verification email
    router.post("/resend-verification-email", (req, res) =>
        userController.resendVerificationEmail(req, res)
    );

    // Upload User Profile Photo
    router.post(
        "/me/photo",
        verifyToken,
        userController.photoService.uploadSingle(),
        (req, res) => userController.uploadUserProfilePhoto(req, res)
    );

    return router;
};
