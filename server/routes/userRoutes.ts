import { Router } from "express";
import userController from "../controllers/userController";
import auth from "../middleware/auth";

const router = Router();

router.patch("/user_info", auth, userController.updateUserInfo);

router.patch("/user_privacy", auth, userController.updateUserPrivacy);

router.patch("/reset_password", auth, userController.resetPassword);

router.get("/user/:id", userController.getUser);

router.get("/users", userController.getAllUsers);

router
  .route("/follows/:id")
  .get(userController.getFollows)
  .patch(auth, userController.updateFollows);

router
  .route("/favourites/:id")
  .get(auth, userController.getFavourites)
  .patch(auth, userController.updateFavourite);

router.patch("/blogs/:id", auth, userController.updateUserBlogs);

router.patch("/user_notifies", auth, userController.viewUserNotifications);

export default router;
