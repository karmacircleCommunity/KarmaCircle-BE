import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { asyncHandler } from "../../utils/async-handler";
import * as clubController from "./club.controller";

const router = Router();

/**
 * @openapi
 * /clubs:
 *   get:
 *     summary: Get a club by username, or list all clubs
 *     tags: [Clubs]
 *     parameters:
 *       - in: query
 *         name: userName
 *         schema: { type: string }
 *     responses:
 *       200: { description: A club or a list of clubs }
 *       404: { description: Not found }
 */
router.get("/", asyncHandler(clubController.listClubs));

/**
 * @openapi
 * /clubs/dashboard:
 *   get:
 *     summary: Get the authenticated club's own dashboard data
 *     tags: [Clubs]
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: Dashboard data }
 *       401: { description: Unauthorized }
 *       404: { description: Not found }
 */
router.get("/dashboard", requireAuth, asyncHandler(clubController.dashboard));

export default router;
