const express = require("express");

const {
  createService,
  getAllServices,
  getActiveServices,
  getServiceById,
  getActiveServiceById,
  updateService,
  deleteService,
} = require("./service.controller");

const authenticateToken = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const { ROLES } = require("../../constants/app.constants");

const {
  serviceIdValidator,
  createServiceValidator,
  updateServiceValidator,
  getServicesQueryValidator,
} = require("../../validators/service.validator");

const publicRouter = express.Router();
const adminRouter = express.Router();

// PUBLIC ROUTES
publicRouter.get(
  "/",
  ...getServicesQueryValidator,
  validate,
  getActiveServices,
);

publicRouter.get("/:id", ...serviceIdValidator, validate, getActiveServiceById);

// PROTECT ALL ADMIN SERVICE ROUTES
adminRouter.use(authenticateToken, authorizeRoles(ROLES.ADMIN));

// CREATE SERVICE
adminRouter.post("/", ...createServiceValidator, validate, createService);

// GET ALL SERVICES (INCLUDING INACTIVE)
adminRouter.get("/", getAllServices);

// GET SERVICE BY ID
adminRouter.get("/:id", ...serviceIdValidator, validate, getServiceById);

// UPDATE SERVICE
adminRouter.patch("/:id", ...updateServiceValidator, validate, updateService);

// DEACTIVATE SERVICE
adminRouter.delete("/:id", ...serviceIdValidator, validate, deleteService);

module.exports = {
  publicRouter,
  adminRouter,
};
