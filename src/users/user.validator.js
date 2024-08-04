import { check, validationResult } from "express-validator";

// Signup validation rules
export const validateSignup = [
    check("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long")
        .trim()
        .escape(),
    check("email")
        .notEmpty()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .customSanitizer((value, { req }) => {
            req.body.unSanitizedEmail = value;
            return value;
        })
        .normalizeEmail(),
    check("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .isAlphanumeric()
        .withMessage("Password must be alphanumeric")
        .trim()
        .escape(),
    check("profile.firstName")
        .notEmpty()
        .withMessage("First name is required")
        .trim()
        .escape(),
    check("profile.lastName")
        .notEmpty()
        .withMessage("Last name is required")
        .trim()
        .escape(),
    check("profile.dob")
        .optional()
        .isISO8601()
        .withMessage("Date of birth must be a valid date"),
];

// Login validation rules
export const validateLogin = [
    check("email")
        .isEmail()
        .withMessage("Please provide a valid email address"),
    check("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .isAlphanumeric()
        .withMessage("Password must be alphanumeric")
        .trim()
        .escape(),
];

// User update validation rules
export const validateUserUpdate = [
    check("email")
        .optional()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),
    check("profile.firstName")
        .optional()
        .notEmpty()
        .withMessage("First name cannot be empty")
        .trim()
        .escape(),
    check("profile.lastName")
        .optional()
        .notEmpty()
        .withMessage("Last name cannot be empty")
        .trim()
        .escape(),
    check("profile.dob")
        .optional()
        .isISO8601()
        .withMessage("Date of birth must be a valid date"),
];

// Middleware to handle validation errors
export function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
