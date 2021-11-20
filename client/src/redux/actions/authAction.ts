import { Dispatch } from "redux";
import checkTokenExp from "../../utils/checkTokenExp";
import { getAPI, postAPI } from "../../utils/FetchData";
import { IUserLogin, IUserRegister } from "../../utils/TypeScript";
import { validateEmail, validatePhone, validRegister } from "../../utils/Valid";
import { ALERT, IAlertType } from "../types/alertType";
import { AUTH, IAuthType } from "../types/authType";

/**
 * -------------------------------------------------------------
 * Sing in User With Account And Password
 * -------------------------------------------------------------
 */
export const login =
  (userLogin: IUserLogin) =>
  async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await postAPI("login", userLogin);

      dispatch({ type: AUTH, payload: res.data });

      localStorage.setItem("is_logged", "BlogTech");

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Sign up With Email or Phone
 * -------------------------------------------------------------
 */
export const register =
  (userRegister: IUserRegister) =>
  async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const check = validRegister(userRegister);

    if (check.errLength > 0) {
      return dispatch({ type: ALERT, payload: { errors: check.errMsg } });
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await postAPI("register", userRegister);

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Get Refresh Token For Authorization
 * -------------------------------------------------------------
 */
export const refreshToken =
  (nextAtion?: (token?: string) => void, withLoading?: boolean) =>
  async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const logged = localStorage.getItem("is_logged");

    if (logged !== "BlogTech") {
      if (nextAtion) nextAtion();
      return;
    }

    try {
      if (withLoading) {
        dispatch({ type: ALERT, payload: { loading: true } });
      }

      const res = await getAPI("refresh_token");

      dispatch({ type: AUTH, payload: res.data });

      if (nextAtion) nextAtion(res.data.access_token);

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
      localStorage.removeItem("is_logged");
      if (nextAtion) nextAtion();
    }
  };

/**
 * -------------------------------------------------------------
 * Logout From Account
 * -------------------------------------------------------------
 */
export const logout =
  (token: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      localStorage.removeItem("is_logged");
      dispatch({ type: AUTH, payload: {} });

      await getAPI("logout", access_token);
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Sign in With Google If It Does not Exist, It Will Be Created
 * -------------------------------------------------------------
 */
export const googleLogin =
  (id_token: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await postAPI("google_login", { id_token });

      dispatch({ type: AUTH, payload: res.data });

      localStorage.setItem("is_logged", "BlogTech");

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Sign in With Facebook If It Does not Exist, It Will Be Created
 * -------------------------------------------------------------
 */
export const facebookLogin =
  (accessToken: string, userID: string) =>
  async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await postAPI("facebook_login", { accessToken, userID });

      dispatch({ type: AUTH, payload: res.data });

      localStorage.setItem("is_logged", "BlogTech");

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Sign in With Phone Number
 * -------------------------------------------------------------
 */
export const smsLogin =
  (phone: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const check = validatePhone(phone);

    if (!check) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid Phone number." },
      });
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await postAPI("login_sms", { phone });

      if (!res.data.verify) verifySMS(phone, dispatch);
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Verification Phone Number With a Code
 * -------------------------------------------------------------
 */
export const verifySMS = async (
  phone: string,
  dispatch: Dispatch<IAuthType | IAlertType>
) => {
  const code = prompt("Enter your code");
  if (!code) return;

  try {
    dispatch({ type: ALERT, payload: { loading: true } });

    const res = await postAPI("verify_sms", { phone, code });

    dispatch({ type: AUTH, payload: res.data });

    localStorage.setItem("is_logged", "BlogTech");

    dispatch({ type: ALERT, payload: { success: res.data.msg } });
  } catch (err: any) {
    dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    setTimeout(() => verifySMS(phone, dispatch), 100);
  }
};

/**
 * -------------------------------------------------------------
 * Forgot Password (Send Code To Email For Reset Password)
 * -------------------------------------------------------------
 */
export const forgotPassword =
  (account: string) => async (dispatch: Dispatch<IAlertType>) => {
    if (!validateEmail(account) && !validatePhone(account)) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Please enter a valid account." },
      });
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await postAPI("forgot_password", { account });
      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };
