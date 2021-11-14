import { Router } from "express";
import userSettingsCtrl from "../controllers/userSettingsController";
import auth from "../middleware/auth";
const router = Router();

router.get("/user_settings/:id", auth, userSettingsCtrl.getUserSettings);

router.patch(
  "/user_notify_settings/:id",
  auth,
  userSettingsCtrl.updateNotifySettings
);

router.patch(
  "/user_social_profiles/:id",
  auth,
  userSettingsCtrl.updateSocialProfiles
);

router.patch("/user_interface/:id", auth, userSettingsCtrl.updateUserInterface);

router.patch(
  "/user_privacy_settings/:id",
  auth,
  userSettingsCtrl.updatePrivacySettings
);

export default router;
