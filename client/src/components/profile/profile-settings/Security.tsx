import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storeHooks";
import { resetPassword } from "../../../redux/actions/profileAction";
import { ALERT } from "../../../redux/types/alertType";
import { FormSubmit, IUser } from "../../../utils/TypeScript";
import { validateEmail } from "../../../utils/Valid";
import ActiveLink from "../../global/ActiveLink";
import Button from "../../global/Button";
import { Card, CardBody, CardHeader, CardTitle } from "../../global/Card";
import FlexBox, { Col } from "../../global/FlexBox";
import InputBox from "../../global/InputBox";
import PasswordHints from "../../global/PasswordHints";

const ChangePassword = () => {
  const { auth } = useAppSelector((state) => state);
  const dispatch = useDispatch();
  const [account, setAccount] = useState("");
  const initialState = { oldPassword: "", newPassword: "", cf_password: "" };
  const [passwords, setPasswords] = useState(initialState);
  const { oldPassword, newPassword, cf_password } = passwords;

  const handleSubmitPassword = (e: FormSubmit) => {
    e.preventDefault();

    if (oldPassword.length < 6) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Password must be atleast 6 characters long." },
      });
    }

    if (newPassword && oldPassword && auth.access_token) {
      dispatch(
        resetPassword(newPassword, cf_password, auth.access_token, oldPassword)
      );
    }
  };

  const handleSubmitAccount = (e: FormSubmit) => {
    e.preventDefault();

    const valid = validateEmail(account);
    if (!account || !valid) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid Email Address." },
      });
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <p className="m-0 text-secondary">
          Edit your account settings and change your password here.
        </p>
      </CardHeader>
      <CardBody>
        <div>
          <h6 className="m-0">Account Address</h6>
          <p className="mt-0 text-secondary">
            Your current account address is{" "}
            <span className="text-green">{(auth.user as IUser).account}</span>
          </p>
          <form
            onSubmit={handleSubmitAccount}
            className="pb-3 mb-4 border-bottom"
          >
            <InputBox
              type="text"
              label="New email address"
              row
              callbackValue={(value) => setAccount(value)}
            />
            <div className="text-end">
              <Button type="submit" color="purple">
                Update Account
              </Button>
            </div>
          </form>
        </div>
        <div>
          <h6 className="m-0">Change Password</h6>
          <p className="mt-0 text-secondary">
            We will email you a confirmation when changing your password, so
            please expect that email after submitting.
          </p>
          <form onSubmit={handleSubmitPassword}>
            <InputBox
              label="Old Password"
              type="password"
              row
              callbackValue={(oldPassword) =>
                setPasswords({ ...passwords, oldPassword })
              }
              children={
                <ActiveLink color="purple" to="/forgot_password">
                  Forgot your password?
                </ActiveLink>
              }
            />

            <InputBox
              label="New Password"
              type="password"
              row
              callbackValue={(newPassword) =>
                setPasswords({ ...passwords, newPassword })
              }
              strengthProgress
            />

            <InputBox
              label="Confirm Password"
              type="password"
              row
              callbackValue={(cf_password) =>
                setPasswords({ ...passwords, cf_password })
              }
            />

            <FlexBox row justify="end">
              <Col sm="9">
                <PasswordHints />
              </Col>
            </FlexBox>

            <div className="text-end">
              <Button type="submit" color="purple">
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </CardBody>
    </Card>
  );
};

export default ChangePassword;
