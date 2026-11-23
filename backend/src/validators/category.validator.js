const { body, param, query } = require("express-validator");

// VALIDATE CATEGORY ID
const categoryIdValidator = [
  param("id").isMongoId().withMessage("Please provide a valid category ID."),
];

// CREATE CATEGORY VALIDATION
const createCategoryValidator = [
  body("name")
    .isString()
    .withMessage("Category name must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .bail()
    .isLength({ max: 80 })
    .withMessage("Category name cannot exceed 80 characters."),

  body("description")
    .optional({ values: "null" })
    .isString()
    .withMessage("Description must be a string.")
    .bail()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters."),

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

// UPDATE CATEGORY VALIDATION
const updateCategoryValidator = [
  ...categoryIdValidator,

  body("name")
    .optional()
    .isString()
    .withMessage("Category name must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Category name cannot be empty.")
    .bail()
    .isLength({ max: 80 })
    .withMessage("Category name cannot exceed 80 characters."),

  body("description")
    .optional({ values: "null" })
    .isString()
    .withMessage("Description must be a string.")
    .bail()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters."),

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

// GET CATEGORIES QUERY VALIDATION
const getCategoriesQueryValidator = [
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
  categoryIdValidator,
  createCategoryValidator,
  updateCategoryValidator,
  getCategoriesQueryValidator,
};
