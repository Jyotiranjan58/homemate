const jwt = require("jsonwebtoken");
const { ROLES } = require("../constants/app.constants");
const User = require("../modules/users/user.model");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Server authentication configuration error.",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid or malformed authentication token.",
    });
  }

  const allowedRoles = Object.values(ROLES);

  if (
    !decoded ||
    typeof decoded !== "object" ||
    !decoded.id ||
    !allowedRoles.includes(decoded.role)
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token.",
    });
  }

  // Check whether the user account is still active
  if (decoded.role === ROLES.USER) {
    try {
      const user = await User.findById(decoded.id).select("isActive");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User account not found.",
        });
      }

      if (user.isActive === false) {
        return res.status(403).json({
          success: false,
          message: "Your account has been deactivated.",
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  req.auth = {
    id: decoded.id,
    role: decoded.role,
  };

  return next();
};

module.exports = authenticateToken;
