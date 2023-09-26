import { Router } from "express";
import { Consumer, Producer } from "../controllers/messageController";

const router = Router();

router.post("/sendMessages", Producer);
router.post("/getMessages", Consumer);

export default router;
