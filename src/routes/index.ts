import { Router } from "express";
// import { Consumer, Producer } from "../controllers/messageController";
import { Producer, Consumer } from "../controllers/pushController";

const router = Router();

router.post("/producer", Producer);
router.post("/consumer", Consumer);

export default router;
