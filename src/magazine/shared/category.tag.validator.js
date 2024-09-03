import { body, validationResult } from "express-validator";
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const validateCategory = [
    // Validate and format the 'category' field
    body("category")
        .isArray({ min: 1 })
        .withMessage("Category must be an array with at least one element.")
        .bail()
        .customSanitizer((categories) => {
            return categories.map((category) => {
                return category
                    .split(" ")
                    .map(
                        (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                    )
                    .join(" ");
            });
        }),

    validate,
];
export const validateHashtags = [
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

    // Middleware to handle validation errors
    validate,
];
