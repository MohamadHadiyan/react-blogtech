import { INotification } from "../../utils/TypeScript";

export const GET_NOTIFICATIONS = "GET_NOTIFICATIONS";
export const UPDATE_NOTIFICATION_VIEW = "UPDATE_NOTIFICATION_VIEW";

export interface INotificationState {
  total: number;
  data: INotification[];
}

export interface IGetNotificationType {
  type: typeof GET_NOTIFICATIONS;
  payload: INotificationState;
}

export interface IUpdateNotificationViewType {
  type: typeof UPDATE_NOTIFICATION_VIEW;
  payload: INotification;
}

export type INotificationType =
  | IGetNotificationType
  | IUpdateNotificationViewType;
