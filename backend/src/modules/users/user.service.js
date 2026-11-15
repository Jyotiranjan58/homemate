const User = require("./user.model");

// UPDATE USER PROFILE SERVICE
const updateUserProfile = async (userId, profileData = {}) => {
  const { name, mobile } = profileData;

  // Allow only approved profile fields
  const updates = {};

  if (name !== undefined) {
    updates.name = name;
  }

  if (mobile !== undefined) {
    updates.mobile = mobile;
  }

  if (Object.keys(updates).length === 0) {
    const error = new Error("No profile information provided.");
    error.statusCode = 400;
    throw error;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: updates,
    },
    {
      new: true,
      runValidators: true,
    },
  ).select("-password");

  if (!updatedUser) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  return updatedUser;
};

module.exports = {
  updateUserProfile,
};
