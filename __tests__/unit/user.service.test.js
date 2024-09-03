import UserService from "../../src/users/user.service.js";
import { User } from "../../src/users/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwt_var } from "../../config/config.js";
import mongoose from "mongoose";
import {
    BadRequestException,
    ConflictException,
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
    describe("userExists", () => {
        describe("check by username", () => {
            it("should return true if a user with the given username exists", async () => {
                const mockUsername = "existinguser";
                User.exists = jest.fn().mockResolvedValue(true); // Mock User.exists to return true

                const result = await userService.userExists({
                    username: mockUsername,
                });

                expect(User.exists).toHaveBeenCalledWith({
                    username: mockUsername,
                });
                expect(result).toBe(true);
            });

            it("should return false if no user with the given username exists", async () => {
                const mockUsername = "nonexistentuser";
                User.exists = jest.fn().mockResolvedValue(false); // Mock User.exists to return false

                const result = await userService.userExists({
                    username: mockUsername,
                });

                expect(User.exists).toHaveBeenCalledWith({
                    username: mockUsername,
                });
                expect(result).toBe(false);
            });
        });

        describe("check by email", () => {
            it("should return true if a user with the given email exists", async () => {
                const mockEmail = "existinguser@example.com";
                User.exists = jest.fn().mockResolvedValue(true); // Mock User.exists to return true

                const result = await userService.userExists({
                    email: mockEmail,
                });

                expect(User.exists).toHaveBeenCalledWith({ email: mockEmail });
                expect(result).toBe(true);
            });

            it("should return false if no user with the given email exists", async () => {
                const mockEmail = "nonexistentuser@example.com";
                User.exists = jest.fn().mockResolvedValue(false); // Mock User.exists to return false

                const result = await userService.userExists({
                    email: mockEmail,
                });

                expect(User.exists).toHaveBeenCalledWith({ email: mockEmail });
                expect(result).toBe(false);
            });
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

        it("should return a ConflictException(409) if user already exists", async () => {
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

            // Expect the createUser method to throw a ConflictError
            try {
                await userService.createUser(userBody);
            } catch (error) {
                expect(error).toBeInstanceOf(ConflictException); // Check if error is an instance of ConflictError
                expect(error.message);
                expect(error.statusCode).toBe(409);
            }
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

        it("should throw UnauthorizedException(401) if email is invalid", async () => {
            // Mock User.findOne to return null (indicating no user found)
            jest.spyOn(User, "findOne").mockResolvedValue(null);

            try {
                await userService.authenticateUser(
                    "invalid@test.com",
                    "password"
                );
            } catch (error) {
                expect(error.message).toBe("Invalid email");
                expect(error.statusCode).toBe(401);
            }
        });

        it("should throw UnauthorizedException(401) if password is invalid", async () => {
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

            try {
                await userService.authenticateUser(
                    "test@test.com",
                    "wrongpassword"
                );
            } catch (error) {
                expect(error.message).toBe("Invalid password");
                expect(error.statusCode).toBe(401);
            }
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

        it("should throw UnauthorizedException(401) if token is invalid", async () => {
            // Mock User.findOne to return null (indicating no user found)
            jest.spyOn(User, "findOne").mockResolvedValue(null);

            // Mock jwt.verify to succeed
            jest.spyOn(jwt, "verify").mockImplementation(() => {});

            try {
                await userService.verifyUser("invalidtoken");
            } catch (error) {
                expect(error.message).toBe("Invalid verification token");
                expect(error.statusCode).toBe(401);
            }
        });

        it("should throw UnauthorizedException(401) if jwt.verify throws an error", async () => {
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

        it("should throw NotFoundException(404) if user not found", async () => {
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

            const user = await userService.updateUser(mockUser._id, {
                body: updatedData,
            });

            expect(user.username).toBe("updateduser");
            expect(user.profile.firstName).toBe("Updated");
            expect(user.profile.socialLinks.linkedin).toBe(
                "https://linkedin.com/in/updated"
            );
            expect(user.save).toHaveBeenCalled(); // Ensure save was called
        });

        it("should throw NotFoundException(404) if user not found", async () => {
            const mockId = new mongoose.Types.ObjectId().toString();

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await expect(
                userService.updateUser(mockId, {
                    body: { username: "Punks" },
                })
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it("should throw BadRequestException(400) if ID is not present", async () => {
            await expect(
                userService.updateUser("", {
                    username: "testuser",
                })
            ).rejects.toBeInstanceOf(BadRequestException);

            // expect(result.error).toBe("User ID is required");
            // expect(result.status).toBe(400);
        });

        it("should throw BadRequestException(400) if body is empty", async () => {
            const mockUserId = new mongoose.Types.ObjectId().toString();
            try {
                await userService.updateUser(mockUserId, {
                    body: {},
                });
            } catch (error) {
                expect(error.message).toBe("No fields provided for update");
                expect(error.statusCode).toBe(400);
            }
        });
    });
    describe("getAllUsers", () => {
        it("should return users when query matches", async () => {
            const mockUsers = [
                {
                    username: "john_doe",
                    email: "john@example.com",
                    profile: { firstName: "John", lastName: "Doe" },
                },
                {
                    username: "jane_doe",
                    email: "jane@example.com",
                    profile: { firstName: "Jane", lastName: "Doe" },
                },
            ];
            // Mocking User.find and chaining select
            jest.spyOn(User, "find").mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUsers),
            });

            const result = await userService.getAllUsers({
                query: { q: "Doe" },
            });

            expect(User.find).toHaveBeenCalledWith({
                $or: [
                    { "profile.firstName": new RegExp("Doe", "i") },
                    { "profile.lastName": new RegExp("Doe", "i") },
                    { username: new RegExp("Doe", "i") },
                    { email: new RegExp("Doe", "i") },
                ],
            });
            expect(result).toEqual(mockUsers);
        });

        it("should throw NotfoundException(404) when no users match the query", async () => {
            // Mocking User.find and chaining select
            jest.spyOn(User, "find").mockReturnValue({
                select: jest.fn().mockResolvedValue([]),
            });
            await expect(
                userService.getAllUsers({
                    query: { q: "NonExistent" },
                })
            ).rejects.toBeInstanceOf(NotFoundException);

            expect(User.find).toHaveBeenCalledWith({
                $or: [
                    { "profile.firstName": new RegExp("NonExistent", "i") },
                    { "profile.lastName": new RegExp("NonExistent", "i") },
                    { username: new RegExp("NonExistent", "i") },
                    { email: new RegExp("NonExistent", "i") },
                ],
            });
        });

        it("should return all users when no query is provided", async () => {
            const mockUsers = [
                {
                    username: "john_doe",
                    email: "john@example.com",
                    profile: { firstName: "John", lastName: "Doe" },
                },
                {
                    username: "jane_doe",
                    email: "jane@example.com",
                    profile: { firstName: "Jane", lastName: "Doe" },
                },
            ];

            // Mocking User.find and chaining select
            jest.spyOn(User, "find").mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUsers),
            });

            const result = await userService.getAllUsers({ query: {} });

            expect(User.find).toHaveBeenCalledWith({});
            expect(result).toEqual(mockUsers);
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

        it("should throw NotFoundException(404) if user is not found", async () => {
            // Mock User.findOne to return null
            jest.spyOn(User, "findOne").mockResolvedValue(null);

            await expect(
                userService.resetVerificationEmailToken("nonexistent@test.com")
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe("resetPassword", () => {
        it("should throw NotFoundException(404) when user is not found", async () => {
            jest.spyOn(User, "findById").mockResolvedValue(null);

            await expect(
                userService.resetPassword({
                    userId: "nonexistentId",
                    currentPassword: "currentPassword123",
                    newPassword: "newPassword123",
                })
            ).rejects.toBeInstanceOf(NotFoundException);

            expect(User.findById).toHaveBeenCalledWith("nonexistentId");
        });

        it("should throw BadRequesstException(400) when current password is incorrect", async () => {
            const mockUser = {
                _id: "userId123",
                password: "hashedPassword123",
            };

            jest.spyOn(User, "findById").mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(false); // Passwords don't match

            await expect(
                userService.resetPassword({
                    userId: "userId123",
                    currentPassword: "wrongPassword",
                    newPassword: "newPassword123",
                })
            ).rejects.toBeInstanceOf(BadRequestException);

            expect(User.findById).toHaveBeenCalledWith("userId123");
            expect(bcrypt.compare).toHaveBeenCalledWith(
                "wrongPassword",
                mockUser.password
            );
        });

        it("should successfully reset password when current password is correct", async () => {
            const mockUser = {
                _id: "userId123",
                password: "hashedPassword123", // Original hashed password
                save: jest.fn(), // Mocking save method
            };

            // Mocking the findById, compare, and hash methods
            jest.spyOn(User, "findById").mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true); // Passwords match
            jest.spyOn(bcrypt, "hash").mockResolvedValue("newHashedPassword");

            const user = await userService.resetPassword({
                userId: "userId123",
                currentPassword: "currentPassword123",
                newPassword: "newPassword123",
            });

            expect(User.findById).toHaveBeenCalledWith("userId123");
            expect(bcrypt.compare).toHaveBeenCalledWith(
                "currentPassword123",
                "hashedPassword123"
            ); // Check against original password
            expect(bcrypt.hash).toHaveBeenCalledWith("newPassword123", 10); // Hash the new password
            expect(mockUser.password).toBe("newHashedPassword"); // Password should now be updated
            expect(mockUser.save).toHaveBeenCalled(); // Ensure save is called
            expect(user).toEqual(mockUser);
        });
    });
    describe("requestPasswordReset", () => {
        it("should throw NotFoundException(404) when user with the given email does not exist", async () => {
            jest.spyOn(User, "findOne").mockResolvedValue(null);

            await expect(
                userService.requestPasswordReset({
                    email: "nonexistent@example.com",
                })
            ).rejects.toBeInstanceOf(NotFoundException);

            expect(User.findOne).toHaveBeenCalledWith({
                email: "nonexistent@example.com",
            });
        });

        it("should generate a reset token and save it to the user document", async () => {
            const mockUser = {
                email: "existinguser@example.com",
                resetPasswordToken: null,
                save: jest.fn(), // Mock the save method
            };

            // Spy on User.findOne to return a mock user
            jest.spyOn(User, "findOne").mockResolvedValue(mockUser);

            // Perform the operation
            const resetToken = await userService.requestPasswordReset({
                email: "existinguser@example.com",
            });

            // Since we cannot directly mock #generateToken, we check the result assuming the method works correctly
            expect(User.findOne).toHaveBeenCalledWith({
                email: "existinguser@example.com",
            });
            expect(mockUser.resetPasswordToken).not.toBeNull(); // Ensure the token was generated and set
            expect(mockUser.save).toHaveBeenCalled();
            expect(resetToken).toBe(mockUser.resetPasswordToken); // The returned token should match the user's reset token
        });
    });
    describe("resetPasswordViaEmail", () => {
        it("should throw NotFoundException(404) when user is not found", async () => {
            const decodedToken = { email: "nonexistent@example.com" };

            // Mock jwt.verify to return a decoded token
            jest.spyOn(jwt, "verify").mockReturnValue(decodedToken);

            // Mock User.findOne to return null (user not found)
            jest.spyOn(User, "findOne").mockResolvedValue(null);

            await expect(
                userService.resetPasswordViaEmail({
                    token: "validToken",
                    newPassword: "newPassword123",
                })
            ).rejects.toBeInstanceOf(NotFoundException);

            expect(jwt.verify).toHaveBeenCalledWith(
                "validToken",
                expect.any(String)
            );
            expect(User.findOne).toHaveBeenCalledWith({
                email: "nonexistent@example.com",
            });
        });

        it("should successfully reset password when user is found", async () => {
            const decodedToken = { email: "existinguser@example.com" };
            const mockUser = {
                email: "existinguser@example.com",
                password: "oldHashedPassword",
                resetPasswordToken: "validToken",
                save: jest.fn(), // Mock the save method
            };

            // Mock jwt.verify to return a decoded token
            jest.spyOn(jwt, "verify").mockReturnValue(decodedToken);

            // Mock User.findOne to return a user
            jest.spyOn(User, "findOne").mockResolvedValue(mockUser);

            // Mock bcrypt.hash to return a new hashed password
            jest.spyOn(bcrypt, "hash").mockResolvedValue("newHashedPassword");

            const result = await userService.resetPasswordViaEmail({
                token: "validToken",
                newPassword: "newPassword123",
            });

            expect(jwt.verify).toHaveBeenCalledWith(
                "validToken",
                expect.any(String)
            );
            expect(User.findOne).toHaveBeenCalledWith({
                email: "existinguser@example.com",
            });
            expect(bcrypt.hash).toHaveBeenCalledWith("newPassword123", 10);
            expect(mockUser.password).toBe("newHashedPassword");
            expect(mockUser.resetPasswordToken).toBeNull();
            expect(mockUser.save).toHaveBeenCalled();
            expect(result).toEqual(mockUser);
        });
    });
});
