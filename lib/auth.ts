/**
 * Email validation using a simple but effective regex
 * Validates most common email formats
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password validation rules:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const validatePassword = (
  password: string,
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain an uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain a lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain a number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate password confirmation matches
 */
export const validatePasswordMatch = (
  password: string,
  confirm: string,
): boolean => {
  return password === confirm && password.length > 0;
};

/**
 * Get password strength indicator
 */
export const getPasswordStrength = (
  password: string,
): "weak" | "fair" | "good" | "strong" => {
  if (!password) return "weak";

  let strength = 0;

  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (password.length >= 16) strength++;

  // Character variety
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return "weak";
  if (strength <= 4) return "fair";
  if (strength <= 5) return "good";
  return "strong";
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, " ");
};

/**
 * Format error message for display
 */
export const formatErrorMessage = (error: any): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error?.message) {
    const message = error.message.toLowerCase();

    // Clerk-specific error mapping
    if (message.includes("password")) {
      return "Password does not meet requirements";
    }
    if (message.includes("email") || message.includes("already")) {
      return "Email is already in use";
    }
    if (message.includes("invalid")) {
      return "Invalid email or password";
    }
    if (message.includes("not found")) {
      return "Account not found";
    }

    return error.message;
  }

  return "An error occurred. Please try again.";
};

/**
 * Extract validation errors from Clerk API response
 */
export const extractClerkErrors = (error: any): string[] => {
  const errors: string[] = [];

  if (error?.errors?.length > 0) {
    error.errors.forEach((err: any) => {
      const message = formatErrorMessage(err);
      if (!errors.includes(message)) {
        errors.push(message);
      }
    });
  } else {
    errors.push(formatErrorMessage(error));
  }

  return errors;
};
