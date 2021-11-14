import * as types from "../types/categoryType";

const initialState: types.ICategoriesState = {
  categoryBlogs: [],
  names: [],
};

const categoryReducer = (
  state = initialState,
  action: types.ICategoryType
): types.ICategoriesState => {
  switch (action.type) {
    case types.CREATE_CATEGORY:
      return { ...state, names: [action.payload, ...state.names] };

    case types.GET_CATEGORIES_NAME:
      return { ...state, names: action.payload };

    case types.GET_BLOGS_CATEGORY:
      return {
        ...state,
        categoryBlogs: [...state.categoryBlogs, action.payload],
      };

    case types.UPDATE_CATEGORY:
      return {
        ...state,
        names: state.names.map((item) =>
          item._id === action.payload._id
            ? { ...item, name: action.payload.name }
            : item
        ),
      };

    case types.DELETE_CATEGORY:
      return {
        ...state,
        names: state.names.filter((item) => item._id !== action.payload),
      };

    default:
      return state;
  }
};

export default categoryReducer;
