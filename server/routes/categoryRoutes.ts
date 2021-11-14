import { Router } from "express";
import categoryCtrl from "../controllers/categoryController";
import auth from "../middleware/auth";

const router = Router();

router
  .route("/category")
  .get(categoryCtrl.getCategories)
  .post(auth, categoryCtrl.createCategory);

router
  .route("/category/:id")
  .patch(auth, categoryCtrl.updateCategory)
  .delete(auth, categoryCtrl.deleteCategory);

export default router;
