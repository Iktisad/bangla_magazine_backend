import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "./user.model.js";
import {
    BadRequestException,
    ConflictException,
    NotFoundException,
    UnauthorizedException,
} from "../exceptions/http.exception.js";
import { jwt_var } from "../../config/config.js";

export class UserService {
    async createUser(body) {
        const { username, email, password, unSanitizedEmail, profile } = body;

        const existingUser = await User.exists({
            $or: [{ username }, { email: unSanitizedEmail }],
        });
        if (existingUser) {
            throw new ConflictException("Username or email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = this.generateVerificationToken(email);

        const user = new User({
            username,
            email: unSanitizedEmail,
            password: hashedPassword,
            profile,
            verificationToken,
        });

        await user.save();

        return user;
    }

    async verifyUser(token) {
        jwt.verify(token, jwt_var.secret || "lameSecret");
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            throw new UnauthorizedException("Invalid verification token");
        }

        user.isActive = true;
        user.verificationToken = null;
        await user.save();
        return user;
    }
    async checkUserByUsername(username) {
        return User.exists({ username });
    }

    async checkUserByEmail(email) {
        return User.exists({ email });
    }
    async authenticateUser(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new UnauthorizedException("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (!user.isActive) {
            throw new UnauthorizedException(
                "Please verify your email before logging in"
            );
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, username: user.username },
            jwt_var.secret || "lameSecret",
            {
                expiresIn: jwt_var.expiration || "1h",
            }
        );
        return token;
    }

    async getUserById(userId) {
        if (!userId) {
            throw new BadRequestException("User ID is required");
        }

        const user = await User.findById(userId).select(
            "-password -verificationToken"
        );
        if (!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }

    async updateUser(userId, { body }) {
        if (!userId) {
            throw new BadRequestException("User ID is required");
        }

        const user = await User.findByIdAndUpdate(userId, body, {
            new: true,
        }).select("-password -verificationToken");
        if (!user) {
            throw new NotFoundException("User not found");
        }

        return user;
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
        return await User.find(filter).select("-password -verificationToken");
    }

    async resetVerificationEmailToken(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        if (user.isVerified) {
            throw new Error("Email is already verified");
        }

        // Generate a new verification token
        const verificationToken = this.generateVerificationToken(email);
        user.verificationToken = verificationToken;
        await user.save();

        return user;
    }
    generateVerificationToken(email) {
        // Generate verification token
        const randomToken = crypto.randomBytes(32).toString("hex");
        return jwt.sign({ email }, randomToken, { expiresIn: "1d" });
    }
}
