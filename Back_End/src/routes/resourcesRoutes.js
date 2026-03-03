import express from "express";
import { getResourceLinks } from "../controllers/resources.js";

const router = express.Router();

router.get("/", getResourceLinks);

export default router;
