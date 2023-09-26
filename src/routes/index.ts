import { Router } from "express";
import { getMessages, sendMessages } from "../controllers/messageController";

const router = Router();

router.post("/sendMessages", sendMessages);
router.post("/getMessages", getMessages);

export default router;
