import { z } from "zod";

export const listingSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title must be at least 1 character long"),
  description: z
    .string({ required_error: "Content is required" })
    .min(10, "Content must be at least 10 characters long"),
  regularPrice: z
    .number({ required_error: "Price is required" })
    .min(0, "Price must be a positive number"),
  category: z.string({ required_error: "Category is required" }),
  imageUrls: z
    .array(z.string(), { required_error: "Images are required" })
    .nonempty("Images array cannot be empty"),
});
