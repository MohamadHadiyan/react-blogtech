import { IBlog } from "../../utils/TypeScript";
import {
  GET_BLOG,
  IBlogType,
  UPDATE_BLOG_LIKES,
  UPDATE_BLOG_VIEWS,
} from "../types/blogType";

const initailState: IBlog = {
  user: "",
  title: "",
  thumbnail: "",
  category: "",
  description: "",
  content: "",
  tags: [],
  likes: [],
  comments: [],
  views: 0,
  createdAt: "",
};

const currentBlogReducer = (state = initailState, action: IBlogType): IBlog => {
  switch (action.type) {
    case GET_BLOG:
      return action.payload;
    case UPDATE_BLOG_LIKES:
      return {
        ...state,
        likes: action.payload,
      };
    case UPDATE_BLOG_VIEWS:
      return {
        ...state,
        views: action.payload,
      };
    default:
      return state;
  }
};

export default currentBlogReducer;
