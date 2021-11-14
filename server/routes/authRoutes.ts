import { Router } from "express";
import authCtrl from "../controllers/authController";
import { validRegister } from "../middleware/valid";
import auth from "../middleware/auth";
const router = Router();

router.post("/register", validRegister, authCtrl.regiser);

router.post("/active", authCtrl.activeAccount);

router.post("/login", authCtrl.login);

router.get("/logout", auth, authCtrl.logout);

router.get("/refresh_token", authCtrl.refreshToken);

router.post("/google_login", authCtrl.googleLogin);

router.post("/facebook_login", authCtrl.facebookLogin);

router.post("/login_sms", authCtrl.loginSMS);

router.post("/verify_sms", authCtrl.verifySMS);

router.post("/forgot_password", authCtrl.forgotPassword);

export default router;
