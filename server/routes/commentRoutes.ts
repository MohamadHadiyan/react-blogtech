import { Router } from "express";
import commentController from "../controllers/commentController";
import auth from "../middleware/auth";

const router = Router();

router.post("/comment", auth, commentController.createComment);

router.get("/comments/blog/:id", commentController.getComments);

router.post("/reply_comment", auth, commentController.replyComment);

router.patch("/comment/:id", auth, commentController.updateComment);

router.delete("/comment/:id", auth, commentController.deleteComment);

router.get("/comment/:id", commentController.getCommentReplies);

router.patch("/comment_likes", auth, commentController.updateCommentLikes);

export default router;
