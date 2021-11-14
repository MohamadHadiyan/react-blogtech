import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import SocialLogin from "../components/auth/SocialLogin";
import ActiveLink from "../components/global/ActiveLink";
import Button from "../components/global/Button";
import { Card, CardBody, CardHeader } from "../components/global/Card";
import FlexBox from "../components/global/FlexBox";
import InputBox from "../components/global/InputBox";
import { Logo } from "../components/svg/Icons";
import { useAppSelector } from "../hooks/storeHooks";
import { register } from "../redux/actions/authAction";
import { FormSubmit } from "../utils/TypeScript";

const Register = () => {
  const { auth } = useAppSelector((state) => state);
  const history = useHistory();
  const search = history.location.search;
  const initialState = {
    name: "",
    account: "",
    password: "",
    cf_password: "",
    accept_terms: false,
  };
  const [userRegister, setUserRegister] = useState(initialState);

  const dispatch = useDispatch();

  const handleSubmit = async (e: FormSubmit) => {
    e.preventDefault();
    dispatch(register(userRegister));
  };

  useEffect(() => {
    if (auth.access_token) {
      const url = search.replace("?", "/");
      history.push(url);
    }
  }, [auth.access_token, history, search]);

  return (
    <FlexBox justify="center" items="center" style={{ minHeight: "100vh" }}>
      <Card className="p-0 p-sm-3" style={{ width: "450px" }}>
        <CardHeader className="border-0 pt-3">
          <ActiveLink to="/" className="text-purple">
            <Logo size="3rem" />
          </ActiveLink>
          <h3 className="mt-3 mb-2">Sign up</h3>
          <p className="text-secondary mb-0">
            Already have an account?{" "}
            <ActiveLink to={`/login${search}`} className="text-purple">
              Sign in
            </ActiveLink>
          </p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} autoComplete="on">
            <InputBox
              type="text"
              label="Name"
              callbackValue={(name) =>
                setUserRegister({ ...userRegister, name })
              }
            />
            <InputBox
              type="text"
              label="Email or Phone Number"
              callbackValue={(account) =>
                setUserRegister({ ...userRegister, account })
              }
            />
            <InputBox
              type="password"
              label="Password"
              strengthProgress
              passwordHint
              callbackValue={(password) =>
                setUserRegister({ ...userRegister, password })
              }
            />
            <InputBox
              type="password"
              label="Confirm Password"
              boxClassName="mt-2"
              callbackValue={(cf_password) =>
                setUserRegister({ ...userRegister, cf_password })
              }
            />
            <InputBox
              type="checkbox"
              label={
                <small className="text-secondary">
                  I agree to the{" "}
                  <ActiveLink to="/terms_condition" color="purple">
                    Terms of Service
                  </ActiveLink>{" "}
                  and{" "}
                  <ActiveLink to="/terms_condition" color="purple">
                    Privacy Policy
                  </ActiveLink>
                  .
                </small>
              }
              callbackValue={() =>
                setUserRegister({
                  ...userRegister,
                  accept_terms: !userRegister.accept_terms,
                })
              }
            />
            <Button
              type="submit"
              className="px-3 py-2"
              block
              color="purple"
              disabled={!userRegister.accept_terms}
            >
              Create Free Account
            </Button>
          </form>
          <hr />
          <SocialLogin />
        </CardBody>
      </Card>
    </FlexBox>
  );
};

export default Register;
