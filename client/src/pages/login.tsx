import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import LoginPass from "../components/auth/LoginPass";
import LoginSMS from "../components/auth/LoginSMS";
import SocialLogin from "../components/auth/SocialLogin";
import ActiveLink from "../components/global/ActiveLink";
import { Card, CardBody, CardHeader } from "../components/global/Card";
import FlexBox from "../components/global/FlexBox";
import { Logo } from "../components/svg/Icons";
import { useAppSelector } from "../hooks/storeHooks";

const Login = () => {
  const [sms, setSms] = useState(false);

  const history = useHistory();
  const { search } = useLocation();

  const { auth } = useAppSelector((state) => state);

  useEffect(() => {
    if (auth.access_token) {
      const url = history.location.search.replace("?", "/");
      history.push(url);
    }
  }, [auth.access_token, history]);

  return (
    <FlexBox justify="center" items="center" style={{ minHeight: "100vh" }}>
      <Card className="p-0 p-sm-3" style={{ width: "450px" }}>
        <CardHeader className="border-0 pt-3">
          <ActiveLink to="/" className="text-purple">
            <Logo size="3rem" />
          </ActiveLink>
          <h3 className="mt-3 mb-2">Sign up</h3>
          <p className="text-secondary mb-0">
            Don't have an account?{" "}
            <ActiveLink className="ms-2 text-purple" to={`/register${search}`}>
              Sign up
            </ActiveLink>
          </p>
        </CardHeader>

        <CardBody>
          {sms ? <LoginSMS /> : <LoginPass />}
          <FlexBox className="my-2" justify="between">
            <ActiveLink to="/forgot_password" color="purple">
              Forgot Password?
            </ActiveLink>
            <small
              className="cursor-pointer text-purple fw-semi-bold"
              onClick={() => setSms(!sms)}
            >
              {sms ? "Sign in with Email" : "Sign in with SMS"}
            </small>
          </FlexBox>
          <hr />
          <SocialLogin />
        </CardBody>
      </Card>
    </FlexBox>
  );
};

export default Login;
