import { UserService } from "../../src/users/user.service.js";
import { User } from "../../src/users/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwt_var } from "../../config/config.js";
import mongoose from "mongoose";
import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
} from "../../src/exceptions/http.exception.js";

describe("UserService", () => {
    let userService;

    beforeAll(() => {
        userService = new UserService();
    });

    afterEach(() => {
        jest.clearAllMocks(); // Reset mocks after each test
    });

    describe("checkUserByUsername", () => {
        it("should return true if a user with the given username exists", async () => {
            const mockUsername = "existinguser";
            User.exists = jest.fn().mockResolvedValue(true); // Mock User.exists to return true

            const result = await userService.checkUserByUsername(mockUsername);

            expect(User.exists).toHaveBeenCalledWith({
                username: mockUsername,
            });
            expect(result).toBe(true);
        });

        it("should return false if no user with the given username exists", async () => {
            const mockUsername = "nonexistentuser";
            User.exists = jest.fn().mockResolvedValue(false); // Mock User.exists to return false

            const result = await userService.checkUserByUsername(mockUsername);

            expect(User.exists).toHaveBeenCalledWith({
                username: mockUsername,
            });
            expect(result).toBe(false);
        });
    });

    describe("checkUserByEmail", () => {
        it("should return true if a user with the given email exists", async () => {
            const mockEmail = "existinguser@example.com";
            User.exists = jest.fn().mockResolvedValue(true); // Mock User.exists to return true

            const result = await userService.checkUserByEmail(mockEmail);

            expect(User.exists).toHaveBeenCalledWith({ email: mockEmail });
            expect(result).toBe(true);
        });

        it("should return false if no user with the given email exists", async () => {
            const mockEmail = "nonexistentuser@example.com";
            User.exists = jest.fn().mockResolvedValue(false); // Mock User.exists to return false

            const result = await userService.checkUserByEmail(mockEmail);

            expect(User.exists).toHaveBeenCalledWith({ email: mockEmail });
            expect(result).toBe(false);
        });
    });

    describe("createUser", () => {
        it("should create a new user and return it", async () => {
            // Mock User.exists to return false (indicating no user exists)
            jest.spyOn(User, "exists").mockResolvedValue(false);

            // Mock bcrypt.hash to return a hashed password
            jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword");

            // Mock User.prototype.save to return a new user object
            jest.spyOn(User.prototype, "save").mockResolvedValue({
                username: "testuser",
                email: "test@gmail.com",
                password: "hashedPassword",
                profile: {
                    firstName: "Test",
                    lastName: "User",
                },
                verificationToken: "token",
            });

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
            // Mock User.exists to return true (indicating user exists)
            jest.spyOn(User, "exists").mockResolvedValue(true);

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
                email: "test@gmail.com",
                password: "hashedPassword",
                isActive: true,
                role: "contributor",
            };

            // Mock User.findOne to return the mock user
            jest.spyOn(User, "findOne").mockResolvedValue(mockUser);

            // Mock bcrypt.compare to return true
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

            // Mock jwt.sign to return a token
            jest.spyOn(jwt, "sign").mockReturnValue("token");

            const token = await userService.authenticateUser(
                "test@gmail.com",
                "password"
            );
            expect(bcrypt.compare).toHaveBeenCalledWith(
                "password",
                "hashedPassword"
            );
            expect(token).toBe("token");
        });

        it("should throw UnauthorizedException if email is invalid", async () => {
            // Mock User.findOne to return null (indicating no user found)
            jest.spyOn(User, "findOne").mockResolvedValue(null);

            await expect(
                userService.authenticateUser("invalid@test.com", "password")
            ).rejects.toBeInstanceOf(UnauthorizedException);
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

            // Mock User.findOne to return the mock user
            jest.spyOn(User, "findOne").mockResolvedValue(mockUser);

            // Mock bcrypt.compare to return false (indicating password mismatch)
            jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

            await expect(
                userService.authenticateUser("test@test.com", "wrongpassword")
            ).rejects.toBeInstanceOf(UnauthorizedException);
        });
    });

    describe("verifyUser", () => {
        it("should verify a user with a valid token", async () => {
            const mockUser = {
                _id: new mongoose.Types.ObjectId().toString(),
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

            // Mock User.findOne to return the mock user when called with the verification token
            jest.spyOn(User, "findOne").mockResolvedValue(mockUser);

            // Mock jwt.verify to succeed
            jest.spyOn(jwt, "verify").mockImplementation(() => {});

            const user = await userService.verifyUser("token");

            expect(jwt.verify).toHaveBeenCalledWith(
                "token",
                jwt_var.secret || "lameSecret"
            );
            expect(user.isActive).toBe(true);
            expect(user.verificationToken).toBe(null);
        });

        it("should throw UnauthorizedException if token is invalid", async () => {
            // Mock User.findOne to return null (indicating no user found)
            jest.spyOn(User, "findOne").mockResolvedValue(null);

            // Mock jwt.verify to succeed
            jest.spyOn(jwt, "verify").mockImplementation(() => {});

            await expect(
                userService.verifyUser("invalidtoken")
            ).rejects.toThrow("Invalid verification token");
        });

        it("should throw UnauthorizedException if jwt.verify throws an error", async () => {
            // Mock jwt.verify to throw an error
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

    describe("getUserById", () => {
        it("should return a user by ID", async () => {
            const mockUser = {
                _id: new mongoose.Types.ObjectId().toString(),
                username: "testuser",
                isActive: true,
                email: "test@gmail.com",
                role: "contributor",
                profile: {
                    firstName: "Test",
                    lastName: "User",
                    contactEmail: [],
                },
                verificationToken: null,
            };

            // Mocking the findById method and chain it with select to return the mockUser
            jest.spyOn(User, "findById").mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });

            const user = await userService.getUserById(mockUser._id);

            // Use .toEqual() to compare objects by value rather than reference
            expect(user).toEqual(mockUser);
        });

        it("should throw NotFoundException if user not found", async () => {
            // Mocking the findById method to return null
            const mockId = new mongoose.Types.ObjectId().toString();
            jest.spyOn(User, "findById").mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await expect(
                userService.getUserById(mockId)
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe("updateUser", () => {
        it("should update and return a user by ID", async () => {
            const mockUser = {
                _id: new mongoose.Types.ObjectId().toString(),
                username: "existinguser",
                email: "test@test.com",
                profile: {
                    firstName: "Existing",
                    lastName: "User",
                    socialLinks: {
                        linkedin: "https://linkedin.com/in/existing",
                        twitter: "https://twitter.com/existing",
                    },
                    contactEmail: ["existing@test.com"],
                },
                save: jest.fn().mockResolvedValue(true), // Mock the save method to simulate a successful save
            };

            const updatedData = {
                username: "updateduser",
                profile: {
                    firstName: "Updated",
                    socialLinks: {
                        linkedin: "https://linkedin.com/in/updated",
                        twitter: "https://twitter.com/updated",
                    },
                    contactEmail: ["test@test.com", "newemail@gmail.com"],
                },
            };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });

            const updatedUser = await userService.updateUser(mockUser._id, {
                body: updatedData,
            });

            expect(updatedUser.username).toBe("updateduser");
            expect(updatedUser.profile.firstName).toBe("Updated");
            expect(updatedUser.profile.socialLinks.linkedin).toBe(
                "https://linkedin.com/in/updated"
            );
            expect(mockUser.save).toHaveBeenCalled(); // Ensure save was called
        });

        it("should throw NotFoundException if user not found", async () => {
            const mockId = new mongoose.Types.ObjectId().toString();

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await expect(
                userService.updateUser(mockId, { body: { username: "Punks" } })
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it("should throw BadRequestException if ID is not present", async () => {
            await expect(
                userService.updateUser("", { username: "testuser" })
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it("should throw BadRequestException if body is empty", async () => {
            const mockUserId = new mongoose.Types.ObjectId().toString();

            await expect(
                userService.updateUser(mockUserId, { body: {} })
            ).rejects.toBeInstanceOf(BadRequestException);
        });
    });

    describe("resetVerificationEmailToken", () => {
        it("should reset the verification token and send an email", async () => {
            const mockUser = {
                _id: "userId",
                email: "test@test.com",
                isActive: false,
                verificationToken: "oldtoken",
                save: jest.fn().mockResolvedValue(true),
            };

            // Mock User.findOne to return the user
            jest.spyOn(User, "findOne").mockResolvedValue(mockUser);

            // Mock jwt.sign to return a new token
            jest.spyOn(jwt, "sign").mockReturnValue("newtoken");

            const user = await userService.resetVerificationEmailToken(
                "test@test.com"
            );

            expect(mockUser.verificationToken).toBe("newtoken");
            expect(user).toBe(mockUser);
        });

        it("should throw Error if user is not found", async () => {
            // Mock User.findOne to return null
            jest.spyOn(User, "findOne").mockResolvedValue(null);

            await expect(
                userService.resetVerificationEmailToken("nonexistent@test.com")
            ).rejects.toThrow("User not found");
        });
    });
});
