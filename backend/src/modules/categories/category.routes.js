const express = require("express");

const {
  createCategory,
  getAllCategories,
  getActiveCategories,
  getActiveCategoryById,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("./category.controller");

const authenticateToken = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const { ROLES } = require("../../constants/app.constants");

const {
  categoryIdValidator,
  createCategoryValidator,
  updateCategoryValidator,
  getCategoriesQueryValidator,
} = require("../../validators/category.validator");

const publicRouter = express.Router();
const adminRouter = express.Router();

// PUBLIC ROUTES
publicRouter.get(
  "/",
  ...getCategoriesQueryValidator,
  validate,
  getActiveCategories,
);

publicRouter.get(
  "/:id",
  ...categoryIdValidator,
  validate,
  getActiveCategoryById,
);

// PROTECT ALL ADMIN CATEGORY ROUTES
adminRouter.use(authenticateToken, authorizeRoles(ROLES.ADMIN));

// CREATE CATEGORY
adminRouter.post("/", ...createCategoryValidator, validate, createCategory);

// GET ALL CATEGORIES (INCLUDING INACTIVE)
adminRouter.get("/", getAllCategories);

// GET CATEGORY BY ID
adminRouter.get("/:id", ...categoryIdValidator, validate, getCategoryById);

// UPDATE CATEGORY
adminRouter.patch("/:id", ...updateCategoryValidator, validate, updateCategory);

// DELETE CATEGORY
adminRouter.delete("/:id", ...categoryIdValidator, validate, deleteCategory);

module.exports = {
  publicRouter,
  adminRouter,
};
