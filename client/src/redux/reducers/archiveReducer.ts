import {
  GET_ARCHIVE_BLOGS,
  GET_ARCHIVE_DATE,
  IArchiveState,
  IArchiveType,
} from "../types/archiveType";

const initialState: IArchiveState = {
  archiveBlogs: [],
  dates: [],
};

export default function archiveReducer(
  state = initialState,
  action: IArchiveType
): IArchiveState {
  switch (action.type) {
    case GET_ARCHIVE_DATE:
      return { ...state, dates: action.payload };
    case GET_ARCHIVE_BLOGS:
      if (
        state.archiveBlogs.every((item) => item.date !== action.payload.date)
      ) {
        return {
          ...state,
          archiveBlogs: [...state.archiveBlogs, action.payload],
        };
      } else {
        return {
          ...state,
          archiveBlogs: state.archiveBlogs.map((item) =>
            item.date === action.payload.date ? action.payload : item
          ),
        };
      }
    default:
      return state;
  }
}
