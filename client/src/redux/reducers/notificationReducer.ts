import {
  GET_NOTIFICATIONS,
  INotificationState,
  INotificationType,
  UPDATE_NOTIFICATION_VIEW,
} from "../types/notificationType";

const initialState: INotificationState = {
  data: [],
  total: 0,
};

export default function notificationReducer(
  state = initialState,
  action: INotificationType
): INotificationState {
  switch (action.type) {
    case GET_NOTIFICATIONS:
      return state.total
        ? { ...state, data: [...state.data, ...action.payload.data] }
        : action.payload;
    case UPDATE_NOTIFICATION_VIEW:
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload._id ? { ...item, viewed: true } : item
        ),
      };
    default:
      return state;
  }
}
