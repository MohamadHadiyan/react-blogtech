import { IUserCard } from "../../utils/TypeScript";
import * as types from "../types/blogType";

const userBlogsReducer = (
  state: types.IBlogsUser[] = [],
  action: types.IBlogsUserType
): types.IBlogsUser[] => {
  switch (action.type) {
    case types.GET_BLOGS_USER_ID:
      if (state.every((item) => item.id !== action.payload.id)) {
        return [...state, action.payload];
      } else {
        return state.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      }
    case types.CREATE_BLOG_USER_ID:
      return state.map((item) =>
        item.id === (action.payload.user as IUserCard)._id
          ? { ...item, blogs: [action.payload, ...item.blogs] }
          : item
      );
    case types.UPDATE_BLOG_USER_ID:
      return state.map((item) =>
        item.id === (action.payload.user as IUserCard)._id
          ? {
              ...item,
              blogs: item.blogs.map((blog) =>
                blog._id === action.payload._id ? action.payload : blog
              ),
            }
          : item
      );
    case types.DELETE_BLOG_USER_ID:
      return state.map((item) =>
        item.id === (action.payload.user as IUserCard)._id
          ? {
              ...item,
              blogs: item.blogs.filter(
                (blog) => blog._id !== action.payload._id
              ),
            }
          : item
      );
    default:
      return state;
  }
};

export default userBlogsReducer;
