import { z } from "zod";

const registerSchema = z.object({
  username: z
    .string({ required_error: "Name is Required" })
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username cannot exceed 20 characters")
    .trim() // Remove leading/trailing whitespace
    .regex(/^[a-z0-9_]+$/)
    .toLowerCase(), // Allow letters, numbers, and underscore
  email: z
    .string()
    .email("Invalid email format")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one lowercase letter, uppercase letter, number, and special character"
    ),
  phone: z
    .string({ required_error: "Phone is Required" })
    .min(10, "Phone must be at least 10 characters long")
    .max(10, "Phone cannot exceed 10 characters")
    .regex(/^[0-9]+$/),
});
const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one lowercase letter, uppercase letter, number, and special character"
    ),
});

export { registerSchema, loginSchema };
