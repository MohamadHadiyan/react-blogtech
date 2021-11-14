import { Router } from "express";
import notifyCtrl from "../controllers/notificationController";
import auth from "../middleware/auth";

const router = Router();

router.get("/notifications", auth, notifyCtrl.getNotifications);

router.patch("/notification/:id", auth, notifyCtrl.updateNotificationView);

export default router;
