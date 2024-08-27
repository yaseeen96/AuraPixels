import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const userSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().max(10).optional(),
  profile: z.string().url().optional(),
});
