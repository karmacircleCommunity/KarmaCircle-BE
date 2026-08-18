import { z } from "zod";

export const addProductSchema = z.object({
  productType: z.string().min(1),
  productName: z.string().min(1),
  productPrice: z.number().nonnegative(),
  productDescription: z.string().min(1),
  productImage: z.string().min(1),
  productQty: z.number().nonnegative(),
  productSlug: z.string().min(1),
});

export const addToCartSchema = z.object({
  email: z.string().email(),
  productId: z.string().min(1),
});

export type AddProductInput = z.infer<typeof addProductSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
