import { z } from 'zod';

 const createProductValidationSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    price: z.number().min(0, { message: "Price must be a positive number" }),
    condition: z.enum(["new", "used"], { message: "Condition must be 'new' or 'used'" }),
    images: z.array(z.string().url()).min(1, { message: "At least one image is required" }),
    userID: z.string().length(24, { message: "Seller ID is required and must be a valid ObjectId" }),
    status: z.enum(["available", "sold"]).default("available").optional(),
});
export const productValidation = {
    createProductValidationSchema
}
