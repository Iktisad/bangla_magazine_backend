import request from "supertest";
import nodemailer from "nodemailer";
import EmailService from "../../src/service/email.service.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import seedUsers from "../../seed/user.seed.js";
import App from "../../src/app.js";

// Mock `fs` methods to prevent actual file system operations
jest.spyOn(fs, "existsSync").mockReturnValue(true); // Pretend the uploads directory exists
// Mock `fs.existsSync` and `fs.mkdirSync` methods
jest.spyOn(fs, "mkdirSync").mockImplementation(() => {}); // Prevent actual directory creation

let token;
let mockSendMail;
let app;
beforeAll(async () => {
    mockSendMail = nodemailer.createTransport().sendMail;
    await seedUsers();

    app = new App().app;
});
describe("User Module E2E Tests", () => {
    describe("POST: api/users/signup", () => {
        it("should sign up a new user successfully", async () => {
            const mockUser = {
                username: "testuser",
                email: "test@example.com",
                password: "password123",
                profile: {
                    firstName: "Test",
                    lastName: "User",
                },
            };

            // Mock the `sendVerificationEmail` method on `EmailService`
            jest.spyOn(
                EmailService,
                "sendVerificationEmail"
            ).mockImplementation(async (user) => {
                await mockSendMail({
                    from: "test@yahoo.com",
                    to: user.email,
                    subject: "Email Verification",
                    html: `<p>Hello ${user.profile.firstName},</p>
                   <p>Please verify your email by clicking the link below:</p>
                   <a href="your-verification-link">Verify Email</a>`,
                });
            });

            const response = await request(app)
                .post("/api/users/signup")
                .send(mockUser);

            // Verify that the email was sent
            expect(mockSendMail).toHaveBeenCalledTimes(1);
            expect(mockSendMail).toHaveBeenCalledWith(
                expect.objectContaining({
                    from: expect.any(String),
                    to: mockUser.email,
                    subject: "Email Verification",
                })
            );

            expect(response.status).toBe(201);
            expect(response.text).toBe(
                "Signup successful! Please check your email to verify your account."
            );
        });

        it("should not sign up a user with existing email", async () => {
            await request(app)
                .post("/api/users/signup")
                .send({
                    username: "testuser1",
                    email: "test@example.com",
                    password: "password123",
                    profile: {
                        firstName: "Test",
                        lastName: "User",
                    },
                });

            const response = await request(app)
                .post("/api/users/signup")
                .send({
                    username: "testuser2",
                    email: "test@example.com",
                    password: "password123",
                    profile: {
                        firstName: "Another",
                        lastName: "User",
                    },
                });

            expect(response.status).toBe(409);
            expect(response.body.message).toBe(
                "Username or email already exists"
            );
        });
    });
    describe("POST: api/users/login", () => {
        it("should log in an existing user successfully", async () => {
            const response = await request(app).post("/api/users/login").send({
                email: "admin@gmail.com",
                password: "admin123",
            });

            expect(response.status).toBe(200);
            expect(response.body.token).toBeDefined();

            token = response.body.token;
        });
    });

    describe("GET: api/users/me", () => {
        it("should fetch the user profile successfully", async () => {
            const response = await request(app)
                .get("/api/users/me")
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.username).toBe("adminUser");
            expect(response.body.email).toBe("admin@gmail.com");
        });
    });
    describe("PATCH: api/users/me", () => {
        it("should update the user profile successfully", async () => {
            const response = await request(app)
                .patch("/api/users/me")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    profile: {
                        firstName: "Updated",
                        lastName: "User",
                    },
                });

            expect(response.status).toBe(200);
            expect(response.body.profile.firstName).toBe("Updated");
            expect(response.body.profile.lastName).toBe("User");
        });
    });

    describe("POST: api/users/request-password-reset", () => {
        it("should request a password reset successfully", async () => {
            // Mock the `sendPasswordResetEmail` method on `EmailService`
            jest.spyOn(
                EmailService,
                "sendPasswordResetEmail"
            ).mockImplementation(async (email, resetToken) => {
                await mockSendMail({
                    from: "test@yahoo.com",
                    to: email,
                    subject: "Password Reset",
                    html: `<p>You requested to reset your password. Click the link below to reset it:</p>
                               <a href="your-reset-link?token=${resetToken}">Reset Password</a>`,
                });
            });

            const response = await request(app)
                .post("/api/users/request-password-reset")
                .send({
                    email: "contributor@example.com",
                });

            // Verify that the email was sent
            expect(mockSendMail).toHaveBeenCalledTimes(1);
            expect(mockSendMail).toHaveBeenCalledWith(
                expect.objectContaining({
                    from: "test@yahoo.com",
                    to: "contributor@example.com",
                    subject: "Password Reset",
                })
            );

            expect(response.status).toBe(200);
            expect(response.text).toBe(
                "Password reset email sent successfully at contributor@example.com"
            );
        });
    });

    describe("POST: api/users/change-password", () => {
        it("should change the user password successfully", async () => {
            const response = await request(app)
                .post("/api/users/change-password")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    currentPassword: "admin123",
                    newPassword: "newpassword123",
                });

            expect(response.status).toBe(200);
            expect(response.text).toBe("Password changed successfully");
        });
        it("should log in with the new password successfully", async () => {
            const response = await request(app).post("/api/users/login").send({
                email: "admin@gmail.com",
                password: "newpassword123",
            });

            expect(response.status).toBe(200);
            expect(response.body.token).toBeDefined();

            token = response.body.token; // Update token for future use
        });
    });

    describe("POST: api/users/resend-verification-email", () => {
        it("should resend verification email successfully", async () => {
            // Mock the `sendVerificationEmail` method on `EmailService`
            jest.spyOn(
                EmailService,
                "sendVerificationEmail"
            ).mockImplementation(async (user) => {
                await mockSendMail({
                    from: "test@yahoo.com",
                    to: user.email,
                    subject: "Email Verification",
                    html: `<p>Hello ${user.profile.firstName},</p>
                               <p>Please verify your email by clicking the link below:</p>
                               <a href="your-verification-link?token=${user.verificationToken}">Verify Email</a>`,
                });
            });
            const response = await request(app)
                .post("/api/users/resend-verification-email")
                .send({
                    email: "random@example.com",
                });

            // Verify that the email was sent
            expect(mockSendMail).toHaveBeenCalledTimes(1);
            expect(mockSendMail).toHaveBeenCalledWith(
                expect.objectContaining({
                    from: "test@yahoo.com",
                    to: "random@example.com",
                    subject: "Email Verification",
                })
            );

            expect(response.status).toBe(200);
            expect(response.body.message).toBe(
                "Verification email resent successfully"
            );
        });
    });

    describe("GET api/users/check-exists", () => {
        it("should check user existence successfully by username", async () => {
            const response = await request(app)
                .get("/api/users/check-exists")
                .query({ username: "contributorUser" });

            expect(response.status).toBe(200);
            expect(response.body.exists).toBe(true);
        });

        it("should check user existence successfully by email", async () => {
            const response = await request(app)
                .get("/api/users/check-exists")
                .query({ email: "contributor@example.com" });

            expect(response.status).toBe(200);
            expect(response.body.exists).toBe(true);
        });
    });

    describe("GET: api/users", () => {
        it("should fetch all users successfully (admin only)", async () => {
            // Assuming the testuser is an admin
            const response = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe("POST: api/users/me/photo", () => {
        it("should upload user profile photo successfully", async () => {
            const filename = fileURLToPath(import.meta.url);
            const dirname = path.dirname(filename);
            const response = await request(app)
                .post("/api/users/me/photo")
                .set("Authorization", `Bearer ${token}`)
                .attach(
                    "photo",
                    path.resolve(dirname, "../../sample/profile.jpg")
                ); // The file won't actually be uploaded

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Photo uploaded successfully");
            expect(response.body.user.profile.profilePicture).toBeDefined();
        });
    });
});
