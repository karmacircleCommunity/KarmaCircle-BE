import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/async-handler";
import * as userController from "./user.controller";
import { updateProfileSchema } from "./user.validation";

const router = Router();

/**
 * @openapi
 * /user:
 *   get:
 *     summary: Get a user by username, or list individual users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: userName
 *         schema: { type: string }
 *     responses:
 *       200: { description: A user or a list of users }
 *       404: { description: Not found }
 */
router.get("/", asyncHandler(userController.listUsers));

/**
 * @openapi
 * /user/update:
 *   post:
 *     summary: Update the authenticated user's profile
 *     tags: [Users]
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tagLine: { type: string }
 *               description: { type: string }
 *               city: { type: string }
 *               state: { type: string }
 *               address: { type: string }
 *               country: { type: string }
 *               pincode: { type: string }
 *     responses:
 *       200: { description: Profile updated }
 *       401: { description: Unauthorized }
 *       404: { description: User not found }
 */
router.post(
  "/update",
  requireAuth,
  validate(updateProfileSchema),
  asyncHandler(userController.updateProfile),
);

export default router;
