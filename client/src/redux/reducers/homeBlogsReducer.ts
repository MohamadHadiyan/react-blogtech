import {
  GET_ALL_BLOGS,
  GET_TOP_BLOGS,
  IHomeBlogsState,
  IHomeBlogsType,
  UPDATE_ALL_BLOGS,
} from "../types/blogType";

const initialState: IHomeBlogsState = {
  allBlogs: { count: 0, blogs: [] },
  topBlogs: [],
};

const allBlogsReducer = (
  state = initialState,
  actions: IHomeBlogsType
): IHomeBlogsState => {
  switch (actions.type) {
    case GET_ALL_BLOGS:
      return {
        ...state,
        allBlogs:
          state.allBlogs.blogs.length === 0
            ? actions.payload
            : state.allBlogs.blogs.length < actions.payload.count
            ? {
                ...state.allBlogs,
                blogs: [...state.allBlogs.blogs, ...actions.payload.blogs],
              }
            : state.allBlogs,
      };
    case GET_TOP_BLOGS:
      return { ...state, topBlogs: actions.payload };
    case UPDATE_ALL_BLOGS:
      return {
        ...state,
        allBlogs: {
          ...state.allBlogs,
          blogs: state.allBlogs.blogs.map((item) =>
            item._id === actions.payload._id ? actions.payload : item
          ),
        },
      };
    default:
      return state;
  }
};

export default allBlogsReducer;
