import { body, validationResult } from "express-validator";
import mongoose from "mongoose";
// import { validateHashtags } from "../shared/category.tag.validator.js";

const validate = (req, res, next) => {
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
    // Validate and format the 'hashtags' field
    body("hashtags")
        .optional() // Allow hashtags to be optional
        .isArray()
        .withMessage("Hashtags must be an array.")
        .bail()
        .customSanitizer((hashtags) => {
            return hashtags
                .map((hashtag) => {
                    // Ensure hashtag starts with a #
                    if (!hashtag.startsWith("#")) {
                        hashtag = `#${hashtag}`;
                    }

                    // Format the hashtag to capitalize each word, removing special characters
                    return hashtag
                        .slice(1) // Remove the initial '#'
                        .split(/[^a-zA-Z0-9]+/) // Split on any non-alphanumeric character
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                        )
                        .join("") // Join words back together without delimiters
                        .replace(/[^a-zA-Z0-9]/g, ""); // Remove any remaining non-alphanumeric characters
                })
                .map((formatted) => `#${formatted}`); // Re-add the '#' at the beginning
        }),

    validate,
];
