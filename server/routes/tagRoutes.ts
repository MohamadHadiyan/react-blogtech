import { Router } from "express";
import tagController from "../controllers/tagController";
import auth from "../middleware/auth";

const router = Router();

router
  .route("/tag")
  .get(tagController.getTags)
  .post(auth, tagController.createTag);

router
  .route("/tag/:id")
  .get(tagController.getTag)
  .patch(auth, tagController.updateTag)
  .delete(auth, tagController.deleteTag);

router.patch("/add_consumer", auth, tagController.addConsumer);
router.patch("/remove_consumer", auth, tagController.removeConsumer);

router.get("/search_tag", tagController.getSearchedTags);

export default router;
