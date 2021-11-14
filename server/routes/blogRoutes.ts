import { Router } from "express";
import blogCtrl from "../controllers/blogController";
import auth from "../middleware/auth";
import checkToken from "../middleware/checkToken";

const router = Router();

router.post("/blog", auth, blogCtrl.createBlog);

router.get("/home/blogs", blogCtrl.getHomeBlogs);

router.get("/blogs/category/:id", blogCtrl.getBlogsByCategory);

router.get("/blogs/user/:id", checkToken, blogCtrl.getBlogsByUser);

router
  .route("/blog/:id")
  .get(checkToken, blogCtrl.getBlog)
  .put(auth, blogCtrl.updateBlog)
  .delete(auth, blogCtrl.deleteBlog);

router.get("/search/blogs", blogCtrl.searchBlogsTitle);

router.get("/results", blogCtrl.getBlogsBySearch, blogCtrl.getBlogsByTag);

router.get("/search_user_blog/:id", checkToken, blogCtrl.getUserBlogsBySearch);

router.patch("/blog_likes/:id", auth, blogCtrl.updateBlogLikes);

router.patch("/blog_views/:id", blogCtrl.updateBlogViews);

router.get("/archive_dates", blogCtrl.getArchiveBlogCount);

router.get("/archive", blogCtrl.getArchiveBlogs);

router.get("/top_blogs", blogCtrl.getTopBlogs);

export default router;
