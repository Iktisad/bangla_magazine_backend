import { body, validationResult } from "express-validator";
import mongoose from "mongoose";
import { validateHashtags } from "../shared/category.tag.validator.js";

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Helper function to check if a string is a valid ObjectId
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// Validation middleware
export const validateMedia = [
    // Validate title (required, must be a string)
    body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isString()
        .withMessage("Title must be a string"),

    // Validate description (optional, must be a string if provided)
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),

    // Validate creator (must be a valid ObjectId and required)
    body("creator")
        .notEmpty()
        .isString()
        .withMessage("Creator is required")
        .custom(isValidObjectId)
        .withMessage("Creator must be a valid ObjectId"),

    // Validate categoryId (must be a valid ObjectId and required)
    body("categoryId")
        .notEmpty()
        .withMessage("Category ID is required")
        .custom(isValidObjectId)
        .withMessage("Category ID must be a valid ObjectId"),

    // Validate tags (optional, must be an array of valid ObjectIds if provided)
].concat(validateHashtags);

// Validator for media ID (used in getMediaById, updateMedia, deleteMedia)
export const validateMediaId = [
    param("id").custom(isValidObjectId).withMessage("Invalid media ID format"),

    // Ensure that no validation errors have occurred
    handleValidationErrors,
];

// Validator for updateMedia
export const validateUpdateMedia = [
    param("id").custom(isValidObjectId).withMessage("Invalid media ID format"),

    // Optional title field, should be a string if present
    check("title").optional().isString().withMessage("Title must be a string"),

    // Optional type field, should be a string if present
    check("type").optional().isString().withMessage("Type must be a string"),

    // Optional description, should be a string if present
    check("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),

    // Ensure that no validation errors have occurred
    handleValidationErrors,
];
