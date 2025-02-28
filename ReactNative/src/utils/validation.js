// Email Validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Invalid email format";
  return "";
};

// Password Validation
export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return "";
};

// First Name and Last Name Validation
export const validateName = (name, field) => {
  if (!name) return `${field} is required`;
  if (name.length < 2) return `${field} must be at least 2 characters`;
  // Ensure name starts with a letter (A-Z, a-z)
  if (!/^[A-Za-z]/.test(name)) return `${field} must start with a letter`;
  return "";
};

// Phone Number Validation
export const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/; // Validates exactly 10 digits
  if (!phone) return "Phone number is required";
  if (!phoneRegex.test(phone)) return "Invalid phone number format (10 digits)";
  return "";
};

// Confirm Password Validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Confirm password is required";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
};
