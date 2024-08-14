import nodemailer from "nodemailer";
import { mailer } from "../../config/config.js";

export class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: mailer.host,
            service: mailer.service,
            port: mailer.port,
            secure: mailer.secure,
            logger: mailer.logger,
            auth: {
                user: mailer.email,
                pass: mailer.password,
            },
        });
    }

    async sendVerificationEmail(user) {
        const mailOptions = {
            from: mailer.email,
            to: user.email,
            subject: "Email Verification",
            html: `<p>Hello ${user.profile.firstName},</p>
             <p>Please verify your email by clicking the link below:</p>
             <a href="${process.env.BASE_URL}/api/users/verify-email?token=${user.verificationToken}">Verify Email</a>`,
        };

        await this.transporter.sendMail(mailOptions);
    }
    async sendPasswordResetEmail(email, resetToken) {
        const resetUrl = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: mailer.email,
            to: email,
            subject: "Password Reset",
            html: `<p>You requested to reset your password. Click the link below to reset it:</p>
                   <a href="${resetUrl}">Reset Password</a>
                   <p>If you did not request a password reset, please ignore this email.</p>`,
        };

        await this.transporter.sendMail(mailOptions);
    }
}
