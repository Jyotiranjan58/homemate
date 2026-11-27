const User = require("./user.model");

// GET USER PROFILE SERVICE
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "name email mobile role createdAt updatedAt",
  );

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

// UPDATE USER PROFILE SERVICE
const updateUserProfile = async (userId, profileData = {}) => {
  const { name, mobile } = profileData;

  // Allow only approved profile fields
  const updates = {};

  if (name !== undefined) {
    updates.name = name;
  }

  if (mobile !== undefined) {
    updates.mobile = String(mobile).trim();
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

// ADD USER ADDRESS SERVICE
const addUserAddress = async (userId, addressData = {}) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  // Check whether the user already has a default address
  const hasDefaultAddress = user.addresses.some((address) => address.isDefault);

  // First address automatically becomes default
  const isDefault = addressData.isDefault === true || !hasDefaultAddress;

  // If this address is default, unset the previous default
  if (isDefault) {
    user.addresses.forEach((address) => {
      address.isDefault = false;
    });
  }

  // Add new address
  user.addresses.push({
    label: addressData.label,
    addressLine1: addressData.addressLine1,
    addressLine2: addressData.addressLine2,
    area: addressData.area,
    city: addressData.city,
    state: addressData.state,
    pincode: addressData.pincode,
    landmark: addressData.landmark,
    isDefault,
  });

  await user.save();

  return user.addresses[user.addresses.length - 1];
};

// GET USER ADDRESSES SERVICE
const getUserAddresses = async (userId) => {
  const user = await User.findById(userId).select("addresses");

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  return user.addresses;
};

//UPDATE USER ADDRESSES SERVICE
const updateUserAddress = async (userId, addressId, addressData = {}) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  // Find the address using its MongoDB subdocument ID
  const address = user.addresses.id(addressId);

  if (!address) {
    const error = new Error("Address not found.");
    error.statusCode = 404;
    throw error;
  }

  // Only allow these fields to be updated
  const allowedFields = [
    "label",
    "addressLine1",
    "addressLine2",
    "area",
    "city",
    "state",
    "pincode",
    "landmark",
  ];

  allowedFields.forEach((field) => {
    if (addressData[field] !== undefined) {
      address[field] = addressData[field];
    }
  });

  // Make this address the default address
  if (addressData.isDefault === true) {
    user.addresses.forEach((savedAddress) => {
      savedAddress.isDefault =
        savedAddress._id.toString() === address._id.toString();
    });
  }

  // If the current default is being changed, assign another default
  else if (addressData.isDefault === false && address.isDefault) {
    const replacementDefault = user.addresses.find(
      (savedAddress) => savedAddress._id.toString() !== address._id.toString(),
    );

    if (!replacementDefault) {
      const error = new Error(
        "At least one saved address must remain the default address.",
      );
      error.statusCode = 400;
      throw error;
    }

    address.isDefault = false;
    replacementDefault.isDefault = true;
  }

  await user.save();

  return address;
};

const deleteUserAddress = async (userId, addressId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  // Find the address using its MongoDB subdocument ID
  const address = user.addresses.id(addressId);

  if (!address) {
    const error = new Error("Address not found.");
    error.statusCode = 404;
    throw error;
  }

  const wasDefault = address.isDefault;
  const deletedAddress = address.toObject();

  // Remove the selected address
  user.addresses.pull(addressId);

  // If the deleted address was the default,
  // make the first remaining address the default
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  return deletedAddress;
};

const deactivateUserAccount = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  if (user.isActive === false) {
    const error = new Error("Account is already deactivated.");
    error.statusCode = 400;
    throw error;
  }

  user.isActive = false;

  await user.save();

  return {
    isActive: user.isActive,
  };
};

module.exports = {
  getUserProfile,
  addUserAddress,
  getUserAddresses,
  updateUserAddress,
  deleteUserAddress,
  updateUserProfile,
  deactivateUserAccount,
};
