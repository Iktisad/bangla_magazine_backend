import {
    BadRequestException,
    ConflictException,
    NotFoundException,
    UnauthorizedException,
} from "../exceptions/http.exception.js";
import logger from "../service/logger.service.js";
import EmailService from "../service/email.service.js";
import PhotoService from "../service/photo.service.js";

export class UserController {
    constructor(UserService) {
        this.userService = UserService;
    }
    // User exists
    async checkUserExists(req, res, next) {
        try {
            const { username, email } = req.query;

            if (!username && !email) {
                return res
                    .status(400)
                    .json({ message: "Username or email required" });
            }

            let user = null;
            if (username) {
                user = await this.userService.checkUserByUsername(username);
            } else if (email) {
                user = await this.userService.checkUserByEmail(email);
            }

            if (user) {
                return res.status(200).json({ exists: true });
            }

            return res.status(200).json({ exists: false });
        } catch (error) {
            if (error instanceof ConflictException) {
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            }
            logger.error(error.message);
            next(error);
        }
    }
    // User signup
    async signup(req, res, next) {
        try {
            const user = await this.userService.createUser(req.body);

            await EmailService.sendVerificationEmail(user);
            return res
                .status(201)
                .send(
                    "Signup successful! Please check your email to verify your account."
                );
            // Send verification email (Implement sendVerificationEmail function)
        } catch (error) {
            if (error instanceof ConflictException) {
                logger.warn(error.message);
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            }
            if (error.name === "TokenExpiredError") {
                logger.warn(error.message);
                return res
                    .status(401)
                    .send(
                        "Token Expired!! Please request to resend verification email."
                    );
            }
            logger.error(error.message);
            next(error);
        }
    }

    // User login
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const token = await this.userService.authenticateUser(
                email,
                password
            );
            return res.status(200).json({ token });
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                logger.warn(error.message);
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            }
            logger.error(error.message);
            next(error);
        }
    }

    async verifyEmail(req, res, next) {
        try {
            const { token } = req.query;
            await this.userService.verifyUser(token);
            return res
                .status(200)
                .send("Account verified! You can now log in.");
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                logger.warn(error.message);
                res.status(error.statusCode).json({ message: error.message });
            } else {
                logger.error(error.message);
                next(error);
            }
        }
    }
    //? Needs to be tested and error needs to be handled
    async resendVerificationEmail(req, res, next) {
        try {
            const { email } = req.body;

            // Send verification email
            const user = await this.userService.resetVerificationEmailToken(
                email
            );
            await EmailService.sendVerificationEmail(user);
            return res.status(200).json({
                message: "Verification email resent successfully",
                user,
            });
        } catch (error) {
            logger.warn(error.message);
            next(error);
        }
    }
    // Fetch user details
    async getProfile(req, res, next) {
        try {
            const user = await this.userService.getUserById(req.user.id);
            return res.status(200).json(user);
        } catch (error) {
            if (error instanceof BadRequestException) {
                logger.warn(error.message);
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            }
            if (error instanceof NotFoundException) {
                logger.warn(error.message);
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            }
            logger.error(error.message);
            next(error);
        }
    }

    // Update user profile
    async updateProfile(req, res, next) {
        try {
            const user = await this.userService.updateUser(req.user.id, req);
            res.status(200).json(user);
        } catch (error) {
            if (error instanceof BadRequestException) {
                logger.warn(error.message);
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            }
            if (error instanceof NotFoundException) {
                logger.warn(error.message);
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            }
            logger.error(error.message);
            next(error);
        }
    }

    // Fetch all users (admin only)
    async getAllProfile(req, res, next) {
        try {
            const users = await this.userService.getAllUsers(req);
            return res.status(200).json(users);
        } catch (error) {
            logger.error(error.message);
            next(error);
        }
    }
    // ? needs more testing and error handling
    async uploadProfilePhoto(req, res, next) {
        try {
            const imageUrl = await PhotoService.uploadSingleOnDisc(req, res);
            const user = await this.userService.updateUser(req.user.id, {
                body: {
                    profile: {
                        profilePicture: imageUrl,
                    },
                },
            });

            return res.status(200).json({
                message: "Photo uploaded successfully",
                user,
            });
        } catch (error) {
            logger.error(error.message);
            next(error);
        }
    }
    async requestPasswordReset(req, res, next) {
        try {
            const { email } = req.body;
            const resetToken = await this.userService.requestPasswordReset({
                email,
            });
            await EmailService.sendPasswordResetEmail(email, resetToken);
            return res
                .status(200)
                .send(`Password reset email sent successfully at ${email}`);
        } catch (error) {
            logger.error(error.message);
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;
            await this.userService.resetPassword({
                userId: req.user.id,
                currentPassword,
                newPassword,
            });

            return res.status(201).send("Password changed successfully");
        } catch (error) {
            logger.error(error.message);
            next(error);
        }
    }

    // Reset password using the token sent via email
    async changePasswordViaEmail(req, res, next) {
        try {
            const { token, newPassword } = req.body;
            await this.userService.resetPasswordViaEmail({
                token,
                newPassword,
            });
            return res.status(200).send("Password has been reset successfully");
        } catch (error) {
            logger.error(error.message);
            next(error);
        }
    }
}
