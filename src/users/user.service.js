import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "./user.model.js";
import { jwt_var } from "../../config/config.js";
import { deepMerge } from "../utils/helper.js";

export class UserService {
    async createUser(body) {
        const { username, email, password, profile } = body;

        const existingUser = await User.exists({
            $or: [{ username }, { email }],
        });
        if (existingUser) {
            return { error: "Username or email already exists", status: 409 };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = this.#generateToken(email);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            profile,
            verificationToken,
        });

        await user.save();

        return { user, status: 201 };
    }

    async verifyUser(token) {
        jwt.verify(token, jwt_var.secret);
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return { error: "Invalid verification token", status: 401 };
        }

        user.isActive = true;
        user.verificationToken = null;
        await user.save();
        return {
            message: "Account verified! You can now log in.",
            status: 200,
        };
    }

    async userExists(field) {
        const exists = await User.exists(field);
        return { exists, status: exists ? 200 : 404 };
    }

    async authenticateUser(email, password) {
        const user = await User.findOne({ email });
        if (!user) return { error: "Invalid email", status: 401 };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { error: "Invalid password", status: 401 };
        }

        if (!user.isActive) {
            return {
                error: "Please verify your email before logging in",
                status: 401,
            };
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, username: user.username },
            jwt_var.secret || "lameSecret",
            {
                expiresIn: jwt_var.expiration || "1h",
            }
        );
        return { token, status: 200 };
    }

    async getUserById(userId) {
        if (!userId) return { error: "User ID is required", status: 400 };

        const user = await User.findById(userId).select(
            "-password -verificationToken"
        );
        if (!user) return { error: "User not found", status: 404 };

        return { user, status: 200 };
    }

    async updateUser(userId, { body }) {
        if (!userId)
            return {
                error: "User ID is required",
                status: 400,
            };

        // Ensure the body is not empty
        if (Object.keys(body).length === 0)
            return {
                error: "No fields provided for update",
                status: 400,
            };

        // Find the user by ID
        const user = await User.findById(userId).select(
            "-password -verificationToken"
        );

        if (!user) return { error: "User not found", status: 404 };

        // Apply the custom deep merge to update only the specified fields
        deepMerge(user, body);

        // Save the updated user document, triggering Mongoose validation
        await user.save();

        return { user, status: 200 };
    }

    async getAllUsers({ query }) {
        const { q } = query;
        const filter = {};
        if (q) {
            filter.$or = [
                { "profile.firstName": new RegExp(q, "i") },
                { "profile.lastName": new RegExp(q, "i") },
                { username: new RegExp(q, "i") },
                { email: new RegExp(q, "i") },
            ];
        }
        const users = await User.find(filter).select(
            "-password -verificationToken"
        );
        if (users.length < 1) return { error: "No users found", stauts: 404 };

        return { users, stauts: 200 };
    }

    async resetVerificationEmailToken(email) {
        const user = await User.findOne({ email });
        if (!user) return { error: "User not found", status: 404 };

        if (user.isActive)
            return { error: "Email is already verified", status: 404 };

        // Generate a new verification token
        const verificationToken = this.#generateToken(email);
        user.verificationToken = verificationToken;
        await user.save();

        return { user, status: 200 };
    }
    async resetPassword({ userId, currentPassword, newPassword }) {
        const user = await User.findById(userId);
        if (!user) {
            return { error: "User not found", staut: 404 };
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return { error: "Current password is incorrect", staut: 400 };
            // throw new BadRequestException("Current password is incorrect");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return { user, status: 201 };
    }
    // Request password reset via email
    async requestPasswordReset({ email }) {
        const user = await User.findOne({ email });
        if (!user)
            return {
                error: "User with this email does not exist",
                status: 404,
            };

        const resetToken = this.#generateToken(email);
        user.resetPasswordToken = resetToken;
        await user.save();

        return { resetToken, status: 200 };
    }
    // Reset password using the token sent via email
    async resetPasswordViaEmail({ token, newPassword }) {
        const decoded = jwt.verify(token, jwt_var.secret);

        const user = await User.findOne({ email: decoded.email });

        if (!user) return { error: "User not found", status: 404 };

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null; // Clear the reset token after successful password reset
        await user.save();

        return { user, status: 201 };
    }

    // Generate verification token
    #generateToken(email) {
        return jwt.sign({ email }, jwt_var.secret, { expiresIn: "1d" });
    }
}
