import * as types from "../types/authType";

const authReducer = (
  state: types.IAuth = {},
  action: types.AuthType
): types.IAuth => {
  switch (action.type) {
    case types.AUTH:
      return action.payload;
    case types.ADD_USER_FOLLOWING:
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              followings: [...state.user.followings, action.payload],
            }
          : undefined,
      };
    case types.REMOVE_USER_FOLLOWING:
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              followings: state.user.followings.filter((item) =>
                typeof item === "string"
                  ? item !== action.payload._id
                  : item._id !== action.payload._id
              ),
            }
          : undefined,
      };
    case types.GET_USER_FOLLOWINGS:
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              followings: action.payload,
            }
          : undefined,
      };
    case types.GET_USER_FOLLOWERS:
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              followers: action.payload,
            }
          : undefined,
      };
    case types.ADD_USER_FAVOURITE:
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              favourites: [...state.user.favourites, action.payload],
            }
          : undefined,
      };
    case types.REMOVE_USER_FAVOURITE:
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              favourites: state.user.favourites.filter((item) =>
                typeof item === "string"
                  ? item !== action.payload._id
                  : item._id !== action.payload._id
              ),
            }
          : undefined,
      };
    case types.GET_USER_FAVOURITES:
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              favourites: action.payload,
            }
          : undefined,
      };
    case types.ADD_USER_BLOG:
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              blogs: [...state.user.blogs, action.payload],
            }
          : undefined,
      };
    case types.REMOVE_USER_BLOG:
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              blogs: state.user.blogs.filter((item) => item !== action.payload),
            }
          : undefined,
      };
    case types.GET_USER_SETTINGS:
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              settings: action.payload,
            }
          : undefined,
      };
    case types.UPDATE_NOTIFY_SETTINGS:
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              settings:
                state.user.settings && typeof state.user.settings !== "string"
                  ? {
                      ...state.user.settings,
                      notificationSetting: action.payload,
                    }
                  : state.user.settings,
            }
          : undefined,
      };
    case types.UPDATE_SOCIAL_PROFILES:
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              settings:
                state.user.settings && typeof state.user.settings !== "string"
                  ? {
                      ...state.user.settings,
                      socialProfiles: action.payload,
                    }
                  : state.user.settings,
            }
          : undefined,
      };
    case types.UPDATE_USER_INTERFACE:
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              settings:
                state.user.settings && typeof state.user.settings !== "string"
                  ? {
                      ...state.user.settings,
                      userInterface: action.payload,
                    }
                  : state.user.settings,
            }
          : undefined,
      };
    case types.UPDATE_PRIVACY_SETTINGS:
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              settings:
                state.user.settings && typeof state.user.settings !== "string"
                  ? {
                      ...state.user.settings,
                      privacySetting: action.payload,
                    }
                  : state.user.settings,
            }
          : undefined,
      };
    default:
      return state;
  }
};

export default authReducer;
