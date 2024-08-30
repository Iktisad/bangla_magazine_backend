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
        //binding all the methods to keep the context relevant
        this.checkUserExists = this.checkUserExists.bind(this);
        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
        this.resendVerificationEmail = this.resendVerificationEmail.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.getAllProfile = this.getAllProfile.bind(this);
        this.uploadProfilePhoto = this.uploadProfilePhoto.bind(this);
        this.requestPasswordReset = this.requestPasswordReset.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.changePasswordViaEmail = this.changePasswordViaEmail.bind(this);
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

            let result = null;
            if (username) {
                result = await this.userService.userExists({ username });
            } else if (email) {
                result = await this.userService.userExists({ email });
            }

            if (!result.exists) throw new NotFoundException(result.error);

            return res.status(200).json({ exists: true });
        } catch (error) {
            if (error instanceof NotFoundException) {
                logger.warn(error.message);
                return res.status(error.statusCode).json({ exists: false });
            }
            next(error);
        }
    }
    // User signup
    async signup(req, res, next) {
        try {
            const result = await this.userService.createUser(req.body);
            if (result.status === 409)
                throw new ConflictException(result.error);

            await EmailService.sendVerificationEmail(result.user);
            return res
                .status(result.status)
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
                logger.error(error.message);
                return res
                    .status(401)
                    .send(
                        "Token Expired!! Please request to resend verification email."
                    );
            }
            next(error);
        }
    }

    // User login
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await this.userService.authenticateUser(
                email,
                password
            );
            if (result.status === 401)
                throw new UnauthorizedException(result.error);

            return res.status(result.status).json({ token: result.token });
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                logger.warn(error.message);
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            }
            next(error);
        }
    }

    async verifyEmail(req, res, next) {
        try {
            const { token } = req.query;
            const result = await this.userService.verifyUser(token);
            if (result.status === 401)
                throw new UnauthorizedException(result.error);
            return res.status(200).send(result.message);
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                logger.warn(error.message);
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            }
            next(error);
        }
    }
    //? Needs to be tested and error needs to be handled
    async resendVerificationEmail(req, res, next) {
        try {
            const { email } = req.body;

            // Send verification email
            const result = await this.userService.resetVerificationEmailToken(
                email
            );
            if (result.status === 404)
                throw new NotFoundException(result.error);
            else if (result.status === 409)
                throw new ConflictException(result.error);

            await EmailService.sendVerificationEmail(result.user);
            return res.status(200).send({
                message: "Verification email resent successfully",
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                logger.error(error.message);
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            }
            if (error instanceof ConflictException) {
                logger.warn(error.message);
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            }
            next(error);
        }
    }
    // Fetch user details
    async getProfile(req, res, next) {
        try {
            const result = await this.userService.getUserById(req.user.id);

            if (result.status === 400)
                throw new BadRequestException(result.error);
            else if (result.status === 404)
                throw new NotFoundException(result.error);

            return res.status(200).json(result.user);
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
            next(error);
        }
    }

    // Update user profile
    async updateProfile(req, res, next) {
        try {
            const result = await this.userService.updateUser(req.user.id, req);

            if (result.status === 400)
                throw new BadRequestException(result.error);
            else if (result.status === 404)
                throw new NotFoundException(result.error);

            res.status(200).json(result.user);
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
            next(error);
        }
    }

    // Fetch all users (admin only)
    async getAllProfile(req, res, next) {
        try {
            const result = await this.userService.getAllUsers(req);
            if (result.status === 404)
                throw new NotFoundException(result.error);
            return res.status(200).json(result.users);
        } catch (error) {
            if (error instanceof NotFoundException)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            next(error);
        }
    }
    // ? needs more testing and error handling
    async uploadProfilePhoto(req, res, next) {
        try {
            const imageUrl = await PhotoService.uploadSingleOnDisc(req, res);
            const result = await this.userService.updateUser(req.user.id, {
                body: {
                    profile: {
                        profilePicture: imageUrl,
                    },
                },
            });

            if (result.status === 400)
                throw new BadRequestException(result.error);
            else if (result.status === 404)
                throw new NotFoundException(result.error);

            return res.status(result.status).send({
                message: "Photo uploaded successfully",
                user: result.user,
            });

            //
        } catch (error) {
            if (
                error instanceof BadRequestException ||
                error instanceof NotFoundException
            ) {
                logger.error(error.message);
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            }
            next(error);
        }
    }
    async requestPasswordReset(req, res, next) {
        try {
            const { email } = req.body;
            const result = await this.userService.requestPasswordReset({
                email,
            });
            if (result.status === 404)
                throw new NotFoundException(result.error);

            await EmailService.sendPasswordResetEmail(email, result.resetToken);
            return res
                .status(result.status)
                .send(`Password reset email sent successfully at ${email}`);
        } catch (error) {
            if (error instanceof NotFoundException) {
                logger.error(error.message);
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            }
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;
            const result = await this.userService.resetPassword({
                userId: req.user.id,
                currentPassword,
                newPassword,
            });

            if (result.status === 404)
                throw new NotFoundException(result.error);
            else if (result.status === 400)
                throw new BadRequestException(result.error);

            return res
                .status(result.status)
                .send("Password changed successfully");
        } catch (error) {
            if (
                error instanceof BadRequestException ||
                error instanceof NotFoundException
            ) {
                logger.error(error.message);
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            }
            next(error);
        }
    }

    // Reset password using the token sent via email
    async changePasswordViaEmail(req, res, next) {
        try {
            const { token, newPassword } = req.body;
            const result = await this.userService.resetPasswordViaEmail({
                token,
                newPassword,
            });
            if (result.status === 404)
                throw new NotFoundException(result.error);
            return res
                .status(result.status)
                .send("Password has been reset successfully");
        } catch (error) {
            if (error instanceof NotFoundException) {
                logger.error(error.message);
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            }
            next(error);
        }
    }
}
