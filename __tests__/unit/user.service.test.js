import { UserService } from "../../src/users/user.service.js";
import { User } from "../../src/users/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwt_var } from "../../config/config.js";
import mongoose from "mongoose";
import { UnauthorizedException } from "../../src/exceptions/http.exception.js";
const mockingoose = require("mockingoose");

describe("UserService with mockingoose", () => {
    let userService;

    beforeAll(() => {
        userService = new UserService();
    });

    afterEach(() => {
        jest.clearAllMocks();
        mockingoose.resetAll(); // Reset mocks after each test
    });

    describe("createUser", () => {
        it("should create a new user and return it", async () => {
            mockingoose(User).toReturn(null, "findOne");

            jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword");
            mockingoose(User).toReturn(
                {
                    username: "testuser",
                    email: "test@gmail.com",
                    password: "hashedPassword",
                    profile: {
                        firstName: "Test",
                        lastName: "User",
                    },
                },
                "save"
            );

            const userBody = {
                username: "testuser",
                email: "test@gmail.com",
                unSanitizedEmail: "test@gmail.com",
                password: "password",
                profile: {
                    firstName: "Test",
                    lastName: "User",
                },
            };

            const user = await userService.createUser(userBody);

            expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
            expect(user.username).toBe("testuser");
            expect(user.email).toBe("test@gmail.com");
            expect(user.password).toBe("hashedPassword");
            expect(user.verificationToken).toBeDefined();
        });

        it("should throw a ConflictException if user already exists", async () => {
            mockingoose(User).toReturn({ username: "testuser" }, "findOne");

            const userBody = {
                username: "testuser",
                email: "test@test.com",
                password: "password",
                profile: {
                    firstName: "Test",
                    lastName: "User",
                },
            };

            await expect(userService.createUser(userBody)).rejects.toThrow(
                "Username or email already exists"
            );
        });
    });

    describe("authenticateUser", () => {
        it("should authenticate a user and return a token", async () => {
            const mockUser = {
                _id: "userId",
                username: "testuser",
                email: "test@test.com",
                password: "hashedPassword",
                isActive: true,
                role: "contributor",
            };

            mockingoose(User).toReturn(mockUser, "findOne");
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
            jest.spyOn(jwt, "sign").mockReturnValue("token");

            const token = await userService.authenticateUser(
                "test@test.com",
                "password"
            );

            expect(bcrypt.compare).toHaveBeenCalledWith(
                "password",
                "hashedPassword"
            );
            expect(token).toBe("token");
        });

        it("should throw UnauthorizedException if email is invalid", async () => {
            mockingoose(User).toReturn(null, "findOne");

            await expect(
                userService.authenticateUser("invalid@test.com", "password")
            ).rejects.toThrow("Invalid email or password");
        });

        it("should throw UnauthorizedException if password is invalid", async () => {
            const mockUser = {
                _id: "userId",
                username: "testuser",
                email: "test@test.com",
                password: "hashedPassword",
                isActive: true,
                role: "contributor",
            };

            mockingoose(User).toReturn(mockUser, "findOne");
            jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

            await expect(
                userService.authenticateUser("test@test.com", "wrongpassword")
            ).rejects.toThrow("Invalid email or password");
        });
    });

    describe("verifyUser", () => {
        it("should verify a user with a valid token", async () => {
            // console.log(jwt_var);
            const mockUser = {
                _id: new mongoose.Types.ObjectId(),
                username: "testuser",
                email: "test@gmail.com",
                password: "hashedPassword",
                role: "contributor",
                profile: {
                    firstName: "Test",
                    lastName: "User",
                },
                isActive: false,
                verificationToken: "token",
                save: jest.fn().mockResolvedValue(true), // Mock save function
            };

            // Mock findOne to return the mockUser when called with the verification token
            mockingoose(User).toReturn(mockUser, "findOne");

            // Mock jwt.verify to return a valid payload without throwing an error
            jest.spyOn(jwt, "verify").mockImplementation(() => "token");

            const user = await userService.verifyUser("token");

            // Assertions
            expect(jwt.verify).toHaveBeenCalledWith(
                "token",
                jwt_var.secret || "lameSecret"
            );
            expect(user.isActive).toBe(true);
            expect(user.verificationToken).toBe(null);
        });

        it("should throw UnauthorizedException if token is invalid", async () => {
            // Mock findOne to return null, simulating that no user was found with the given token
            mockingoose(User).toReturn(null, "findOne");

            // Mock jwt.verify to not throw an error (this simulates a valid but non-matching token)
            jest.spyOn(jwt, "verify").mockImplementation(() => {});

            await expect(
                userService.verifyUser("invalidtoken")
            ).rejects.toThrow("Invalid verification token");
        });

        it("should throw UnauthorizedException if jwt.verify throws an error", async () => {
            // Mock jwt.verify to throw an error, simulating an invalid token or secret

            jest.spyOn(jwt, "verify").mockImplementation(() => {
                throw new UnauthorizedException("Invalid token");
            });
            // Spy on User.findOne to check if it gets called or not
            const findOneSpy = jest.spyOn(User, "findOne");
            await expect(
                userService.verifyUser("invalidtoken")
            ).rejects.toBeInstanceOf(UnauthorizedException);

            // Ensure findOne was never called because jwt.verify threw an error
            expect(findOneSpy).not.toHaveBeenCalled();
        });
    });

    // describe("getUserById", () => {
    //     it("should return a user by ID", async () => {
    //         const mockUser = {
    //             _id: "userId",
    //             username: "testuser",
    //             email: "test@test.com",
    //             profile: {
    //                 firstName: "Test",
    //                 lastName: "User",
    //             },
    //         };

    //         mockingoose(User).toReturn(mockUser, "findById");

    //         const user = await userService.getUserById("userId");

    //         expect(user).toBe(mockUser);
    //     });

    //     it("should throw NotFoundException if user not found", async () => {
    //         mockingoose(User).toReturn(null, "findById");

    //         await expect(
    //             userService.getUserById("nonexistentId")
    //         ).rejects.toThrow("User not found");
    //     });
    // });

    // describe("updateUser", () => {
    //     it("should update and return a user by ID", async () => {
    //         const mockUser = {
    //             _id: "userId",
    //             username: "testuser",
    //             email: "test@test.com",
    //             profile: {
    //                 firstName: "Test",
    //                 lastName: "User",
    //             },
    //         };

    //         mockingoose(User).toReturn(mockUser, "findByIdAndUpdate");

    //         const updatedUser = await userService.updateUser("userId", {
    //             username: "updateduser",
    //             profile: {
    //                 firstName: "Updated",
    //                 lastName: "User",
    //             },
    //         });

    //         expect(updatedUser.username).toBe("updateduser");
    //         expect(updatedUser.profile.firstName).toBe("Updated");
    //     });

    //     it("should throw NotFoundException if user not found", async () => {
    //         mockingoose(User).toReturn(null, "findByIdAndUpdate");

    //         await expect(
    //             userService.updateUser("nonexistentId", {})
    //         ).rejects.toThrow("User not found");
    //     });
    // });

    // describe("resetVerificationEmailToken", () => {
    //     it("should reset the verification token and send an email", async () => {
    //         const mockUser = {
    //             _id: "userId",
    //             email: "test@test.com",
    //             isActive: false,
    //             verificationToken: "oldtoken",
    //             save: jest.fn().mockResolvedValue(true),
    //         };

    //         mockingoose(User).toReturn(mockUser, "findOne");
    //         jest.spyOn(jwt, "sign").mockReturnValue("newtoken");

    //         const user = await userService.resetVerificationEmailToken(
    //             "test@test.com"
    //         );

    //         expect(mockUser.verificationToken).toBe("newtoken");
    //         expect(user).toBe(mockUser);
    //     });

    //     it("should throw Error if user is not found", async () => {
    //         mockingoose(User).toReturn(null, "findOne");

    //         await expect(
    //             userService.resetVerificationEmailToken("nonexistent@test.com")
    //         ).rejects.toThrow("User not found");
    //     });
    // });
});
