import * as types from "../types/tagType";

const initialState: types.ITagsState = {
  tagBlogs: [],
  names: [],
  count: 0,
  pages: [1],
};

export default function tagReducer(
  state = initialState,
  action: types.ITagType
): types.ITagsState {
  switch (action.type) {
    case types.GET_TAGS_NAME:
      return {
        ...state,
        names: action.payload.tags,
        count: action.payload.count,
      };
    case types.GET_TAGS_NAME_BY_PAGE:
      return {
        ...state,
        names: [...state.names, ...action.payload.tags],
        pages: [...state.pages, action.payload.page],
      };
    case types.CREATE_TAG:
      return { ...state, names: [...state.names, ...action.payload] };
    case types.UPDATE_TAG:
      return {
        ...state,
        names: state.names.map((item) =>
          item._id === action.payload._id ? action.payload : item
        ),
      };
    case types.DELETE_TAG:
      return {
        ...state,
        names: state.names.filter((item) => item._id !== action.payload),
      };
    case types.ADD_TAG_CONSUMER:
      return {
        ...state,
        names: state.names.map((item) =>
          action.payload.tag_ids.find((id) => id === item._id)
            ? {
                ...item,
                consumers: [...item.consumers, action.payload.blog_id],
              }
            : item
        ),
      };
    case types.REMOVE_TAG_CONSUMER:
      return {
        ...state,
        names: state.names.map((item) =>
          action.payload.tag_ids.find((id) => id === item._id)
            ? {
                ...item,
                consumers: item.consumers.filter(
                  (id) => id !== action.payload.blog_id
                ),
              }
            : item
        ),
      };
    default:
      return state;
  }
}
