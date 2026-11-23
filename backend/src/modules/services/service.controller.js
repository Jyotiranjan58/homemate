const {
  createService: createServiceHandler,
  getAllServices: fetchAllServices,
  getActiveServices: fetchActiveServices,
  getServiceById: fetchServiceById,
  getActiveServiceById: fetchActiveServiceById,
  updateService: updateServiceHandler,
  deleteService: deleteServiceHandler,
} = require("./service.service");

const sendSuccessResponse = require("../../utils/sendSuccessResponse");

// CREATE SERVICE
const createService = async (req, res) => {
  const service = await createServiceHandler(req.body || {});

  return sendSuccessResponse(
    res,
    201,
    "Service created successfully.",
    service,
  );
};

// GET ALL SERVICES (ADMIN)
const getAllServices = async (req, res) => {
  const services = await fetchAllServices();

  return sendSuccessResponse(res, 200, "Services retrieved successfully.", {
    count: services.length,
    services,
  });
};

// GET ACTIVE SERVICES (PUBLIC)
// GET ACTIVE SERVICES (PUBLIC)
const getActiveServices = async (req, res) => {
  const result = await fetchActiveServices(req.query);

  return sendSuccessResponse(
    res,
    200,
    "Active services retrieved successfully.",
    {
      count: result.services.length,
      services: result.services,
      pagination: result.pagination,
    },
  );
};

// GET SERVICE BY ID
const getServiceById = async (req, res) => {
  const service = await fetchServiceById(req.params.id);

  return sendSuccessResponse(
    res,
    200,
    "Service retrieved successfully.",
    service,
  );
};

// GET ACTIVE SERVICE BY ID (PUBLIC)
const getActiveServiceById = async (req, res) => {
  const service = await fetchActiveServiceById(req.params.id);

  return sendSuccessResponse(
    res,
    200,
    "Service retrieved successfully.",
    service,
  );
};

// UPDATE SERVICE
const updateService = async (req, res) => {
  const service = await updateServiceHandler(req.params.id, req.body || {});

  return sendSuccessResponse(
    res,
    200,
    "Service updated successfully.",
    service,
  );
};

// DELETE SERVICE (SOFT DELETE)
const deleteService = async (req, res) => {
  const service = await deleteServiceHandler(req.params.id);

  return sendSuccessResponse(
    res,
    200,
    "Service deactivated successfully.",
    service,
  );
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
