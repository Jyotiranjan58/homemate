// User roles
const ROLES = Object.freeze({
  USER: "user",
  PROVIDER: "provider",
  ADMIN: "admin",
});

// Provider account statuses
const PROVIDER_STATUS = Object.freeze({
  PENDING_REVIEW: "Pending Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
});

// Booking statuses
const BOOKING_STATUS = Object.freeze({
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
});

module.exports = {
  ROLES,
  PROVIDER_STATUS,
  BOOKING_STATUS,
};
