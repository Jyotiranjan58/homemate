const mongoose = require("mongoose");

const Category = require("./category.model");
const Service = require("../services/service.model");

// HELPER FOR ERRORS
const createCategoryError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// CREATE CATEGORY
const createCategory = async (categoryData = {}) => {
  const { name, description, imageUrl } = categoryData;

  const category = await Category.create({
    name: name?.trim(),
    description: description?.trim(),
    imageUrl: imageUrl?.trim() || null,
  });

  return category;
};

// GET ALL CATEGORIES (ADMIN)
const getAllCategories = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

// GET ACTIVE CATEGORIES (PUBLIC)
const getActiveCategories = async (queryParams = {}) => {
  const { search, page = 1, limit = 10 } = queryParams;

  const currentPage = Number(page) || 1;
  const pageSize = Number(limit) || 10;

  const filter = {
    isActive: true,
  };

  // SEARCH BY CATEGORY NAME OR DESCRIPTION
  if (search) {
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(escapedSearch, "i");

    filter.$or = [{ name: searchRegex }, { description: searchRegex }];
  }

  // GET TOTAL MATCHING CATEGORIES
  const total = await Category.countDocuments(filter);

  // GET PAGINATED CATEGORIES
  const categories = await Category.find(filter)
    .sort({ name: 1 })
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize);

  return {
    categories,
    pagination: {
      total,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

// GET ACTIVE CATEGORY BY ID (PUBLIC)
const getActiveCategoryById = async (categoryId) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw createCategoryError("Invalid category ID.", 400);
  }

  const category = await Category.findOne({
    _id: categoryId,
    isActive: true,
  });

  if (!category) {
    throw createCategoryError("Category not found.", 404);
  }

  return category;
};

// GET CATEGORY BY ID
const getCategoryById = async (categoryId) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw createCategoryError("Invalid category ID.", 400);
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw createCategoryError("Category not found.", 404);
  }

  return category;
};

// UPDATE CATEGORY
const updateCategory = async (categoryId, categoryData = {}) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw createCategoryError("Invalid category ID.", 400);
  }

  const { name, description, imageUrl, isActive } = categoryData;

  const updates = {};

  if (name !== undefined) updates.name = name.trim();

  if (description !== undefined) {
    updates.description = description === null ? "" : description.trim();
  }

  if (imageUrl !== undefined) {
    updates.imageUrl = imageUrl?.trim() || null;
  }

  if (isActive !== undefined) updates.isActive = isActive;

  if (Object.keys(updates).length === 0) {
    throw createCategoryError("No category information provided.", 400);
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedCategory) {
    throw createCategoryError("Category not found.", 404);
  }

  return updatedCategory;
};

// DELETE CATEGORY
const deleteCategory = async (categoryId) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw createCategoryError("Invalid category ID.", 400);
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw createCategoryError("Category not found.", 404);
  }

  const existingService = await Service.exists({
    category: categoryId,
  });

  if (existingService) {
    throw createCategoryError(
      "Cannot delete this category because services are associated with it.",
      409,
    );
  }

  await Category.findByIdAndDelete(categoryId);

  return category;
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
