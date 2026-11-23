const { body, param, query } = require("express-validator");

// VALIDATE SERVICE ID
const serviceIdValidator = [
  param("id").isMongoId().withMessage("Please provide a valid service ID."),
];

// CREATE SERVICE VALIDATION
const createServiceValidator = [
  body("name")
    .isString()
    .withMessage("Service name must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Service name is required.")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Service name cannot exceed 100 characters."),

  body("description")
    .optional({ values: "null" })
    .isString()
    .withMessage("Description must be a string.")
    .bail()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters."),

  body("category")
    .isMongoId()
    .withMessage("Please provide a valid category ID."),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0.")
    .bail()
    .toFloat(),

  body("durationMinutes")
    .isInt({ min: 1 })
    .withMessage("Duration must be at least 1 minute.")
    .bail()
    .toInt(),

  body("imageUrl")
    .optional({ values: "null" })
    .isString()
    .withMessage("Image URL must be a string.")
    .bail()
    .trim()
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
    })
    .withMessage("Please provide a valid image URL."),
];

// UPDATE SERVICE VALIDATION
const updateServiceValidator = [
  ...serviceIdValidator,

  body("name")
    .optional()
    .isString()
    .withMessage("Service name must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Service name cannot be empty.")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Service name cannot exceed 100 characters."),

  body("description")
    .optional({ values: "null" })
    .isString()
    .withMessage("Description must be a string.")
    .bail()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters."),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Please provide a valid category ID."),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0.")
    .bail()
    .toFloat(),

  body("durationMinutes")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duration must be at least 1 minute.")
    .bail()
    .toInt(),

  body("imageUrl")
    .optional({ values: "null" })
    .isString()
    .withMessage("Image URL must be a string.")
    .bail()
    .trim()
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
    })
    .withMessage("Please provide a valid image URL."),

  body("isActive")
    .optional()
    .custom((value) => typeof value === "boolean")
    .withMessage("isActive must be a boolean."),
];

// GET SERVICES QUERY VALIDATION
const getServicesQueryValidator = [
  query("category")
    .optional()
    .isMongoId()
    .withMessage("Please provide a valid category ID."),

  query("search")
    .optional()
    .isString()
    .withMessage("Search must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Search cannot be empty.")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Search cannot exceed 100 characters."),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer.")
    .bail()
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50.")
    .bail()
    .toInt(),
];

module.exports = {
  serviceIdValidator,
  createServiceValidator,
  updateServiceValidator,
  getServicesQueryValidator,
};
