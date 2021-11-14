import * as types from "../types/commentType";

const initailState: types.ICommentState = {
  data: [],
  total: 0,
};

const commentReducer = (
  state = initailState,
  action: types.ICommentType
): types.ICommentState => {
  switch (action.type) {
    case types.CREATE_COMMENT:
      return { ...state, data: [action.payload, ...state.data] };
    case types.GET_COMMENTS:
      return state.total
        ? { ...state, data: [...state.data, ...action.payload.data] }
        : action.payload;
    case types.CLEAR_STORE_COMMENTS:
      return initailState;
    case types.REPLY_COMMENT:
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload.comment_root
            ? {
                ...item,
                replyCM: [...(item.replyCM as []), action.payload],
              }
            : item
        ),
      };
    case types.UPDATE_COMMENT:
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload._id ? action.payload : item
        ),
      };
    case types.UPDATE_REPLY:
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload.comment_root
            ? {
                ...item,
                replyCM: item.replyCM.map((rp) =>
                  rp._id === action.payload._id ? action.payload : rp
                ),
              }
            : item
        ),
      };
    case types.DELETE_COMMENT:
      return {
        ...state,
        data: state.data.filter((item) => item._id !== action.payload._id),
      };
    case types.DELETE_REPLY:
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload.comment_root
            ? {
                ...item,
                replyCM: item.replyCM.filter(
                  (rp) => rp._id !== action.payload._id
                ),
              }
            : item
        ),
      };
    case types.GET_REPLIES_COMMENT:
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload[0].comment_root
            ? {
                ...item,
                replyCM: [...action.payload],
              }
            : item
        ),
      };
    default:
      return state;
  }
};

export default commentReducer;
