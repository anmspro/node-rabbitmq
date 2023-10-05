import { Router } from "express";
import { Producer, Consumer } from "../controllers/pushController";

const router = Router();

router.post("/producer", Producer);
router.post("/consumer", Consumer);

export default router;
