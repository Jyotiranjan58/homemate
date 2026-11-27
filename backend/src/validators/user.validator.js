const { body, param } = require("express-validator");

// USER PROFILE UPDATE VALIDATION
const userProfileValidator = [
  // Validate name only when provided
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty."),

  // Validate mobile only when provided
  body("mobile")
    .optional()
    .custom((value) => {
      if (typeof value !== "string" && typeof value !== "number") {
        throw new Error("Mobile number must be a string or number.");
      }

      const mobile = String(value).trim();

      if (!/^[6-9]\d{9}$/.test(mobile)) {
        throw new Error("Please enter a valid 10-digit Indian mobile number.");
      }

      return true;
    }),
];

// ADD USER ADDRESS VALIDATION
const userAddressValidator = [
  body("label")
    .isString()
    .withMessage("Address label must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Address label is required.")
    .bail()
    .isLength({ max: 30 })
    .withMessage("Address label cannot exceed 30 characters."),

  body("addressLine1")
    .isString()
    .withMessage("Address line 1 must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Address line 1 is required.")
    .bail()
    .isLength({ max: 120 })
    .withMessage("Address line 1 cannot exceed 120 characters."),

  body("addressLine2")
    .optional()
    .isString()
    .withMessage("Address line 2 must be a string.")
    .bail()
    .trim()
    .isLength({ max: 120 })
    .withMessage("Address line 2 cannot exceed 120 characters."),

  body("area")
    .isString()
    .withMessage("Area must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Area is required.")
    .bail()
    .isLength({ max: 80 })
    .withMessage("Area cannot exceed 80 characters."),

  body("city")
    .isString()
    .withMessage("City must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("City is required.")
    .bail()
    .isLength({ max: 60 })
    .withMessage("City cannot exceed 60 characters."),

  body("state")
    .isString()
    .withMessage("State must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("State is required.")
    .bail()
    .isLength({ max: 60 })
    .withMessage("State cannot exceed 60 characters."),

  body("pincode")
    .isString()
    .withMessage("Pincode must be a string.")
    .bail()
    .trim()
    .matches(/^[1-9]\d{5}$/)
    .withMessage("Please provide a valid 6-digit Indian pincode."),

  body("landmark")
    .optional()
    .isString()
    .withMessage("Landmark must be a string.")
    .bail()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Landmark cannot exceed 100 characters."),

  body("isDefault")
    .optional()
    .custom((value) => typeof value === "boolean")
    .withMessage("isDefault must be a boolean."),
];

const updateUserAddressValidator = [
  param("addressId").isMongoId().withMessage("Invalid address ID."),

  body("label")
    .optional()
    .isString()
    .withMessage("Label must be a string.")
    .trim()
    .notEmpty()
    .withMessage("Label cannot be empty.")
    .isLength({ max: 30 })
    .withMessage("Label cannot exceed 30 characters."),

  body("addressLine1")
    .optional()
    .isString()
    .withMessage("Address line 1 must be a string.")
    .trim()
    .notEmpty()
    .withMessage("Address line 1 cannot be empty.")
    .isLength({ max: 120 })
    .withMessage("Address line 1 cannot exceed 120 characters."),

  body("addressLine2")
    .optional()
    .isString()
    .withMessage("Address line 2 must be a string.")
    .trim()
    .isLength({ max: 120 })
    .withMessage("Address line 2 cannot exceed 120 characters."),

  body("area")
    .optional()
    .isString()
    .withMessage("Area must be a string.")
    .trim()
    .notEmpty()
    .withMessage("Area cannot be empty.")
    .isLength({ max: 80 })
    .withMessage("Area cannot exceed 80 characters."),

  body("city")
    .optional()
    .isString()
    .withMessage("City must be a string.")
    .trim()
    .notEmpty()
    .withMessage("City cannot be empty.")
    .isLength({ max: 60 })
    .withMessage("City cannot exceed 60 characters."),

  body("state")
    .optional()
    .isString()
    .withMessage("State must be a string.")
    .trim()
    .notEmpty()
    .withMessage("State cannot be empty.")
    .isLength({ max: 60 })
    .withMessage("State cannot exceed 60 characters."),

  body("pincode")
    .optional()
    .isString()
    .withMessage("Pincode must be a string.")
    .trim()
    .matches(/^[1-9]\d{5}$/)
    .withMessage("Please enter a valid 6-digit pincode."),

  body("landmark")
    .optional()
    .isString()
    .withMessage("Landmark must be a string.")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Landmark cannot exceed 100 characters."),

  body("isDefault")
    .optional()
    .custom((value) => typeof value === "boolean")
    .withMessage("isDefault must be a boolean."),

  body().custom((value) => {
    const allowedFields = [
      "label",
      "addressLine1",
      "addressLine2",
      "area",
      "city",
      "state",
      "pincode",
      "landmark",
      "isDefault",
    ];

    const hasAtLeastOneField = allowedFields.some(
      (field) => value?.[field] !== undefined,
    );

    if (!hasAtLeastOneField) {
      throw new Error("At least one address field is required.");
    }

    return true;
  }),
];

const deleteUserAddressValidator = [
  param("addressId").isMongoId().withMessage("Invalid address ID."),
];

module.exports = {
  userProfileValidator,
  userAddressValidator,
  updateUserAddressValidator,
  deleteUserAddressValidator,
};
