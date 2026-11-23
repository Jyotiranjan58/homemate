const {
  createCategory: createCategoryService,
  getAllCategories: fetchAllCategories,
  getActiveCategories: fetchActiveCategories,
  getActiveCategoryById: fetchActiveCategoryById,
  getCategoryById: fetchCategoryById,
  updateCategory: updateCategoryService,
  deleteCategory: deleteCategoryService,
} = require("./category.service");

const sendSuccessResponse = require("../../utils/sendSuccessResponse");

// CREATE CATEGORY
const createCategory = async (req, res) => {
  const category = await createCategoryService(req.body || {});

  return sendSuccessResponse(
    res,
    201,
    "Category created successfully.",
    category,
  );
};

// GET ALL CATEGORIES (ADMIN)
const getAllCategories = async (req, res) => {
  const categories = await fetchAllCategories();

  return sendSuccessResponse(res, 200, "Categories retrieved successfully.", {
    count: categories.length,
    categories,
  });
};

// GET ACTIVE CATEGORIES (PUBLIC)
const getActiveCategories = async (req, res) => {
  const result = await fetchActiveCategories(req.query);

  return sendSuccessResponse(
    res,
    200,
    "Active categories retrieved successfully.",
    {
      count: result.categories.length,
      categories: result.categories,
      pagination: result.pagination,
    },
  );
};

// GET ACTIVE CATEGORY BY ID (PUBLIC)
const getActiveCategoryById = async (req, res) => {
  const category = await fetchActiveCategoryById(req.params.id);

  return sendSuccessResponse(
    res,
    200,
    "Category retrieved successfully.",
    category,
  );
};

// GET CATEGORY BY ID (ADMIN)
const getCategoryById = async (req, res) => {
  const category = await fetchCategoryById(req.params.id);

  return sendSuccessResponse(
    res,
    200,
    "Category retrieved successfully.",
    category,
  );
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
  const category = await updateCategoryService(req.params.id, req.body || {});

  return sendSuccessResponse(
    res,
    200,
    "Category updated successfully.",
    category,
  );
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
  const category = await deleteCategoryService(req.params.id);

  return sendSuccessResponse(
    res,
    200,
    "Category deleted successfully.",
    category,
  );
};

module.exports = {
  createCategory,
  getAllCategories,
  getActiveCategories,
  getActiveCategoryById,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
