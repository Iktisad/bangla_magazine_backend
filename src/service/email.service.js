import "dotenv";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.mail.yahoo.com",
            service: "Yahoo",
            port: 465,
            secure: false,
            logger: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
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
