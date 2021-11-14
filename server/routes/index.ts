import authRouter from "./authRoutes";
import userRouter from "./userRoutes";
import categoryRouter from "./categoryRoutes";
import blogRouter from "./blogRoutes";
import commentRouter from "./commentRoutes";
import tagRouter from "./tagRoutes";
import notificationRouter from "./notificationRoutes";
import SettingsRouter from "./userSettingsRoutes";

const router = [
  authRouter,
  userRouter,
  categoryRouter,
  blogRouter,
  commentRouter,
  tagRouter,
  notificationRouter,
  SettingsRouter,
];

export default router;
