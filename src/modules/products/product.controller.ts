import { Request, Response } from "express";
import { STATUS_CODE, STATUS_MESSAGE } from "../../constants/http-status";
import { AppError } from "../../middleware/error-handler";
import * as productService from "./product.service";
import { AddProductInput, AddToCartInput } from "./product.validation";

export async function addProduct(req: Request, res: Response) {
  const savedProduct = await productService.addProduct(req.body as AddProductInput);
  res.status(STATUS_CODE.CREATED).json(savedProduct);
}

export async function listProducts(_req: Request, res: Response) {
  const products = await productService.findAll();
  res.status(STATUS_CODE.OK).json(products);
}

export async function getProduct(req: Request, res: Response) {
  const { productSlug } = req.params;
  const product = await productService.findBySlug(productSlug);

  if (!product) {
    throw new AppError(STATUS_CODE.NOT_FOUND, STATUS_MESSAGE.PRODUCT_NOT_FOUND);
  }

  res.status(STATUS_CODE.OK).json(product);
}

export async function addToCart(req: Request, res: Response) {
  const { email, productId } = req.body as AddToCartInput;
  const added = await productService.addToCart(email, productId);

  if (!added) {
    throw new AppError(STATUS_CODE.NOT_FOUND, STATUS_MESSAGE.USER_NOT_FOUND);
  }

  res.send("Product added successfully");
}
