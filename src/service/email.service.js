import nodemailer from "nodemailer";
import { mailer } from "../../config/config";

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
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Email Verification",
            html: `<p>Hello ${user.profile.firstName},</p>
             <p>Please verify your email by clicking the link below:</p>
             <a href="${process.env.BASE_URL}/api/users/verify-email?token=${user.verificationToken}">Verify Email</a>`,
        };

        await this.transporter.sendMail(mailOptions);
    }
}
