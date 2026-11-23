const mongoose = require("mongoose");

const Service = require("./service.model");
const Category = require("../categories/category.model");

// HELPER FOR CREATING ERRORS
const createServiceError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// VALIDATE SERVICE ID
const validateServiceId = (serviceId) => {
  if (!mongoose.isValidObjectId(serviceId)) {
    throw createServiceError("Invalid service ID.", 400);
  }
};

// VALIDATE AND FETCH ACTIVE CATEGORY
const getActiveCategory = async (categoryId) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw createServiceError("Invalid category ID.", 400);
  }

  const category = await Category.findOne({
    _id: categoryId,
    isActive: true,
  });

  if (!category) {
    throw createServiceError("Active category not found.", 404);
  }

  return category;
};

// CREATE SERVICE
const createService = async (serviceData = {}) => {
  const { name, description, category, price, durationMinutes, imageUrl } =
    serviceData;

  await getActiveCategory(category);

  const service = await Service.create({
    name: name.trim(),
    description: description?.trim() || "",
    category,
    price,
    durationMinutes,
    imageUrl: imageUrl?.trim() || null,
  });

  return service;
};

// GET ALL SERVICES (ADMIN)
const getAllServices = async () => {
  return await Service.find()
    .populate("category", "name isActive")
    .sort({ createdAt: -1 });
};

// GET ACTIVE SERVICES (PUBLIC)
// GET ACTIVE SERVICES (PUBLIC)
const getActiveServices = async (queryParams = {}) => {
  const { category, search, page = 1, limit = 10 } = queryParams;

  const currentPage = Number(page);
  const pageSize = Number(limit);

  const filter = {
    isActive: true,
  };

  // Only include services belonging to active categories
  if (category) {
    const activeCategory = await Category.exists({
      _id: category,
      isActive: true,
    });

    // Return no results for inactive or unavailable categories
    if (!activeCategory) {
      filter.category = { $in: [] };
    } else {
      filter.category = category;
    }
  } else {
    const activeCategoryIds = await Category.distinct("_id", {
      isActive: true,
    });

    filter.category = { $in: activeCategoryIds };
  }

  // SEARCH BY SERVICE NAME OR DESCRIPTION
  if (search) {
    const normalizedSearch = search.trim();

    const escapedSearch = normalizedSearch.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    const searchRegex = new RegExp(escapedSearch, "i");

    filter.$or = [{ name: searchRegex }, { description: searchRegex }];
  }

  // GET TOTAL MATCHING SERVICES
  const total = await Service.countDocuments(filter);

  // GET PAGINATED SERVICES
  const services = await Service.find(filter)
    .populate("category", "name description imageUrl")
    .sort({ name: 1 })
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize);

  return {
    services,
    pagination: {
      total,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

// GET SERVICE BY ID
const getServiceById = async (serviceId) => {
  validateServiceId(serviceId);

  const service = await Service.findById(serviceId).populate(
    "category",
    "name description imageUrl isActive",
  );

  if (!service) {
    throw createServiceError("Service not found.", 404);
  }

  return service;
};

// GET ACTIVE SERVICE BY ID (PUBLIC)
const getActiveServiceById = async (serviceId) => {
  validateServiceId(serviceId);

  const service = await Service.findOne({
    _id: serviceId,
    isActive: true,
  }).populate({
    path: "category",
    match: { isActive: true },
    select: "name description imageUrl",
  });

  if (!service || !service.category) {
    throw createServiceError("Service not found.", 404);
  }

  return service;
};

// UPDATE SERVICE
const updateService = async (serviceId, serviceData = {}) => {
  validateServiceId(serviceId);

  const {
    name,
    description,
    category,
    price,
    durationMinutes,
    imageUrl,
    isActive,
  } = serviceData;

  const updates = {};

  if (name !== undefined) {
    updates.name = name.trim();
  }

  if (description !== undefined) {
    updates.description = description === null ? "" : description.trim();
  }

  if (category !== undefined) {
    await getActiveCategory(category);
    updates.category = category;
  }

  if (price !== undefined) {
    updates.price = price;
  }

  if (durationMinutes !== undefined) {
    updates.durationMinutes = durationMinutes;
  }

  if (imageUrl !== undefined) {
    updates.imageUrl = imageUrl?.trim() || null;
  }

  if (isActive !== undefined) {
    updates.isActive = isActive;
  }
  // PREVENT ACTIVATING A SERVICE UNDER AN INACTIVE CATEGORY
  if (isActive === true && category === undefined) {
    const existingService =
      await Service.findById(serviceId).select("category");

    if (!existingService) {
      throw createServiceError("Service not found.", 404);
    }

    await getActiveCategory(existingService.category);
  }

  if (Object.keys(updates).length === 0) {
    throw createServiceError("No service information provided.", 400);
  }

  const updatedService = await Service.findByIdAndUpdate(
    serviceId,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    },
  ).populate("category", "name isActive");

  if (!updatedService) {
    throw createServiceError("Service not found.", 404);
  }

  return updatedService;
};

// DELETE SERVICE (SOFT DELETE)
const deleteService = async (serviceId) => {
  validateServiceId(serviceId);

  const service = await Service.findByIdAndUpdate(
    serviceId,
    { $set: { isActive: false } },
    {
      new: true,
    },
  );

  if (!service) {
    throw createServiceError("Service not found.", 404);
  }

  return service;
};

module.exports = {
  createService,
  getAllServices,
  getActiveServices,
  getServiceById,
  getActiveServiceById,
  updateService,
  deleteService,
};
