import { IAlert } from "../../utils/TypeScript";
import { ALERT, IAlertType } from "../types/alertType";

const alertReducer = (
  state: IAlert = { loading: false },
  action: IAlertType
): IAlert => {
  switch (action.type) {
    case ALERT:
      return action.payload.errors || action.payload.success
        ? { loading: false, ...action.payload }
        : { ...state, ...action.payload };
    default:
      return state;
  }
};

export default alertReducer;
