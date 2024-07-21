import express from "express";
import {protectRoute}  from "../middleware/protectRoute.js";
import { follow_Unfollow, getUserProfile, profileUpdates, suggestion } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/profile/:username",protectRoute,getUserProfile);
router.get("/suggestion",protectRoute,suggestion);
router.post("/following/:id",protectRoute,follow_Unfollow);
router.post("/updates",protectRoute,profileUpdates);

export default router;