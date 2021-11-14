import { combineReducers } from "redux";
import auth from "./authReducer";
import alert from "./alertReducer";
import categories from "./categoryReducer";
import homeBlogs from "./homeBlogsReducer";
import profileInfo from "./profileInfoReducer";
import userBlogs from "./userBlogsReducer";
import comments from "./commentReducer";
import currentBlog from "./currentBlogReducer";
import socket from "./socketReducer";
import archive from "./archiveReducer";
import tags from "./tagReducer";
import notifications from "./notificationReducer";
import allUsers from "./allUsersReducer";

export default combineReducers({
  auth,
  alert,
  homeBlogs,
  userBlogs,
  profileInfo,
  allUsers,
  currentBlog,
  categories,
  archive,
  tags,
  comments,
  notifications,
  socket,
});
