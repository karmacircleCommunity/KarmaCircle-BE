import { Router } from "express";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/async-handler";
import * as productController from "./product.controller";
import { addProductSchema, addToCartSchema } from "./product.validation";

const router = Router();

/**
 * @openapi
 * /product/addproduct:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productType, productName, productPrice, productDescription, productImage, productQty, productSlug]
 *             properties:
 *               productType: { type: string }
 *               productName: { type: string }
 *               productPrice: { type: number }
 *               productDescription: { type: string }
 *               productImage: { type: string }
 *               productQty: { type: number }
 *               productSlug: { type: string }
 *     responses:
 *       201: { description: Product created }
 *       409: { description: productSlug already exists }
 */
router.post(
  "/addproduct",
  validate(addProductSchema),
  asyncHandler(productController.addProduct),
);

/**
 * @openapi
 * /product/allproducts:
 *   get:
 *     summary: List all products
 *     tags: [Products]
 *     responses:
 *       200: { description: List of products }
 */
router.get("/allproducts", asyncHandler(productController.listProducts));

/**
 * @openapi
 * /product/cart/add:
 *   post:
 *     summary: Add a product to a user's cart
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, productId]
 *             properties:
 *               email: { type: string, format: email }
 *               productId: { type: string }
 *     responses:
 *       200: { description: Product added to cart }
 *       404: { description: User not found }
 */
router.post(
  "/cart/add",
  validate(addToCartSchema),
  asyncHandler(productController.addToCart),
);

/**
 * @openapi
 * /product/{productSlug}:
 *   get:
 *     summary: Get a product by slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productSlug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Product found }
 *       404: { description: Product not found }
 */
router.get("/:productSlug", asyncHandler(productController.getProduct));

export default router;
