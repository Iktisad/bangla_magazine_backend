import {
    BadRequestException,
    ConflictException,
    NotFoundException,
    UnauthorizedException,
} from "../exceptions/http.exception";
import logger from "../service/logger.service.js";

export class UserController {
    constructor(UserService, EmailService, PhotoService) {
        this.userService = UserService;
        this.emailService = EmailService;
        this.photoService = PhotoService;
    }
    // User exists
    async checkUserExists(req, res) {
        try {
            const { username, email } = req.query;

            if (!username && !email) {
                return res
                    .status(400)
                    .json({ message: "Username or email required" });
            }

            let user = null;
            if (username) {
                user = await this.userService.getUserByUsername(username);
            } else if (email) {
                user = await this.userService.getUserByEmail(email);
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
    async signup(req, res) {
        try {
            const user = await this.userService.createUser(req.body);

            await this.emailService.sendVerificationEmail(user);
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
            logger.error(error.message);
            next(error);
        }
    }

    // User login
    async login(req, res) {
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

    async verifyEmail(req, res) {
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
    async resendVerificationEmail(req, res) {
        try {
            const { email } = req.body;

            // Send verification email
            const user = await this.userService.resetVerificationEmailToken(
                email
            );
            await this.emailService.sendVerificationEmail(user);
            return res.status(200).json({
                message: "Verification email resent successfully",
                user,
            });
        } catch (error) {
            logger.warn(error.message);
            res.status(400).json({ message: error.message });
        }
    }
    // Fetch user details
    async getProfile(req, res) {
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
    async updateUser(req, res) {
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
    async getAllUser(req, res) {
        try {
            const users = await this.userService.getAllUsers(req);
            return res.status(200).json(users);
        } catch (error) {
            logger.error(error.message);
            next(error);
        }
    }
    // ? needs more testing and error handling
    async uploadUserProfilePhoto(req, res) {
        try {
            const photoUrl = this.photoService.localPhotoUpload(req.file);
            const user = await this.userService.updateUser(req.user.id, {
                body: {
                    profile: {
                        profilePicture: photoUrl,
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
}
