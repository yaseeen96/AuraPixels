import { z } from "zod";

export const wallpaperSchema = z.object({
  imageTitle: z
    .string({
      required_error: "Image title is required",
    })
    .min(1, "Image title cannot be empty"), // Ensures it's a non-empty string
  screen: z.enum(["Mobile", "Desktop"], {
    required_error: "Screen type is required",
  }),
  category: z.string(), // Category is optional, but if present, should be a valid string (ObjectId)
  description: z.string().optional(), // Description is optional
});
