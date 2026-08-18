import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import * as directoryController from "./directory.controller";

const router = Router();

/**
 * @openapi
 * /display/users:
 *   get:
 *     summary: List all users in the public directory
 *     tags: [Directory]
 *     responses:
 *       200: { description: List of users }
 */
router.get("/users", asyncHandler(directoryController.listAllUsers));

/**
 * @openapi
 * /display/clubs:
 *   get:
 *     summary: List all clubs in the public directory
 *     tags: [Directory]
 *     responses:
 *       200: { description: List of clubs }
 */
router.get("/clubs", asyncHandler(directoryController.listClubs));

export default router;
