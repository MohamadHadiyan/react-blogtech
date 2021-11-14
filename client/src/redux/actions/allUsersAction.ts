import { Dispatch } from "redux";
import checkTokenExp from "../../utils/checkTokenExp";
import { getAPI } from "../../utils/FetchData";
import { IUser } from "../../utils/TypeScript";
import { ALERT, IAlertType } from "../types/alertType";
import { GET_ALL_USERS, IGetAllUsersType } from "../types/allUsersType";

/**
 * -------------------------------------------------------------
 * Get All Users
 * -------------------------------------------------------------
 */
export const getAllUsers =
  (user: IUser, token: string) =>
  async (dispatch: Dispatch<IAlertType | IGetAllUsersType>) => {
    const access_token = await checkTokenExp(token, dispatch);
    const errors = "Invalid token specified.";

    if (!access_token) return dispatch({ type: ALERT, payload: { errors } });

    if (user.role !== "admin") {
      const errors = "Invalid Authentication!";
      return dispatch({ type: ALERT, payload: { errors } });
    }

    try {
      const res = await getAPI("users", access_token);

      dispatch({ type: GET_ALL_USERS, payload: res.data });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };
