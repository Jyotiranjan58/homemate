const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const User = require("../models/User");
const Provider = require("../models/Provider");

const authenticateToken = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

// JWT TOKEN GENERATION

const generateAuthToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    {
      id: id.toString(),
      role: role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      algorithm: "HS256",
    },
  );
};

// ADMIN LOGIN
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const admin = await Admin.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }
    const token = generateAuthToken(admin._id, admin.role);

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Admin Login Error:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to login admin.",
    });
  }
});

// USER AUTHENTICATION
// USER SIGNUP
router.post("/user/signup", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
    });
  } catch (err) {
    console.error("User Signup Error:", err);

    res.status(500).json({
      success: false,
      message: "Unable to register user.",
    });
  }
});

// USER LOGIN
router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = generateAuthToken(user._id, "user");

    // Remove password from response
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: userData,
    });
  } catch (err) {
    console.error("User Login Error:", err);

    res.status(500).json({
      success: false,
      message: "Unable to login.",
    });
  }
});

// PROVIDER AUTHENTICATION
// PROVIDER SIGNUP
router.post("/provider/signup", async (req, res) => {
  try {
    const { name, email, mobile, password, city, providedServices } = req.body;

    if (!name || !email || !mobile || !password || !city || !providedServices) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const normalizedMobile = String(mobile).trim();

    if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit Indian mobile number.",
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    if (
      !Array.isArray(providedServices) ||
      providedServices.length === 0 ||
      !providedServices.every(
        (service) => typeof service === "string" && service.trim().length > 0,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one valid service.",
      });
    }

    const normalizedServices = [
      ...new Set(providedServices.map((service) => service.trim())),
    ];

    //Restrict registration to Bhubaneswar
    if (
      typeof city !== "string" ||
      city.trim().toLowerCase() !== "bhubaneswar"
    ) {
      return res.status(400).json({
        success: false,
        message: "HomeMate currently operates only in Bhubaneswar.",
      });
    }

    const existingProvider = await Provider.findOne({
      email: normalizedEmail,
    });

    if (existingProvider) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newProvider = new Provider({
      name: name.trim(),
      email: normalizedEmail,
      mobile: normalizedMobile,
      password: hashedPassword,
      city: "Bhubaneswar",
      providedServices: normalizedServices,
    });

    await newProvider.save();

    return res.status(201).json({
      success: true,
      message:
        "Provider registration successful. Your application is pending admin approval.",
    });
  } catch (err) {
    console.error("Provider Signup Error:", err);

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to register provider.",
    });
  }
});

// PROVIDER LOGIN
router.post("/provider/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const provider = await Provider.findOne({ email });

    if (!provider) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, provider.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (provider.status !== "Approved") {
      return res.status(403).json({
        success: false,
        message: "Your account is not approved yet.",
      });
    }
    const token = generateAuthToken(provider._id, "provider");

    const providerData = provider.toObject();
    delete providerData.password;

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: providerData,
    });
  } catch (err) {
    console.error("Provider Login Error:", err);

    res.status(500).json({
      success: false,
      message: "Unable to login.",
    });
  }
});

// CUSTOMER PROFILE UPDATE

router.put(
  "/user/profile",
  authenticateToken,
  authorizeRoles("user"),
  async (req, res) => {
    try {
      const { name, mobile } = req.body;

      // Only allow approved profile fields
      const updates = {};

      if (name !== undefined) {
        updates.name = name;
      }

      if (mobile !== undefined) {
        updates.mobile = mobile;
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No profile information provided.",
        });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.auth.id,
        {
          $set: updates,
        },
        {
          new: true,
          runValidators: true,
        },
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        user: updatedUser,
      });
    } catch (err) {
      console.error("User Profile Update Error:", err);

      const isValidationError =
        err.name === "ValidationError" || err.name === "CastError";

      res.status(isValidationError ? 400 : 500).json({
        success: false,
        message: isValidationError
          ? err.message
          : "Unable to update user profile.",
      });
    }
  },
);

// PROVIDER PROFILE UPDATE

router.put(
  "/provider/profile",
  authenticateToken,
  authorizeRoles("provider"),
  async (req, res) => {
    try {
      const { name, mobile, city, providedServices } = req.body;

      const updates = {};

      if (name !== undefined) {
        updates.name = name;
      }

      if (mobile !== undefined) {
        updates.mobile = mobile;
      }

      if (city !== undefined) {
        if (
          typeof city !== "string" ||
          city.trim().toLowerCase() !== "bhubaneswar"
        ) {
          return res.status(400).json({
            success: false,
            message: "HomeMate currently operates only in Bhubaneswar.",
          });
        }

        updates.city = "Bhubaneswar";
      }

      if (providedServices !== undefined) {
        updates.providedServices = providedServices;
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No profile information provided.",
        });
      }

      const updatedProvider = await Provider.findByIdAndUpdate(
        req.auth.id,
        {
          $set: updates,
        },
        {
          new: true,
          runValidators: true,
        },
      ).select("-password");

      if (!updatedProvider) {
        return res.status(404).json({
          success: false,
          message: "Provider not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Provider profile updated successfully.",
        user: updatedProvider,
      });
    } catch (err) {
      console.error("Provider Profile Update Error:", err);

      const isValidationError =
        err.name === "ValidationError" || err.name === "CastError";

      res.status(isValidationError ? 400 : 500).json({
        success: false,
        message: isValidationError
          ? err.message
          : "Unable to update provider profile.",
      });
    }
  },
);

module.exports = router;
