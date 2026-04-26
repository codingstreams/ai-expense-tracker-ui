import { z } from "zod";

export const loginSchema = z.object(
  {
    email: z.string()
      .min(1, "Email Length should be greater than 1.")
      .email("Invalid email format.")
      .trim()
      .toLowerCase(),

    password: z.string()
      .min(8, "Password must be at least 8 characters.")
  }
)

export const registerSchema = z.object(
  {
    name: z.string()
      .min(1, "Name must be at least 1 character"),

    email: z.string()
      .min(1, "Email Length should be greater than 1.")
      .email("Invalid email format.")
      .trim()
      .toLowerCase(),

    password: z.string()
      .min(8, "Password must be at least 8 characters.")
  }
)

export type LoginInput = z.input<typeof loginSchema>

export type LoginOutput = z.output<typeof loginSchema>

export type RegisterInput = z.input<typeof registerSchema>

export type RegisterOutput = z.output<typeof registerSchema>