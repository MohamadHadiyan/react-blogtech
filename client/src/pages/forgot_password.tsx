import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ActiveLink from "../components/global/ActiveLink";
import Button from "../components/global/Button";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "../components/global/Card";
import FlexBox from "../components/global/FlexBox";
import InputBox from "../components/global/InputBox";
import { Logo } from "../components/svg/Icons";
import { forgotPassword } from "../redux/actions/authAction";
import { FormSubmit } from "../utils/TypeScript";

const ForgotPassword = () => {
  const [account, setAccount] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault();
    dispatch(forgotPassword(account));
  };

  return (
    <FlexBox justify="center" items="center" style={{ minHeight: "100vh" }}>
      <Card className="p-0 p-sm-3" style={{ width: "400px" }}>
        <CardHeader className="border-0 pt-3">
          <ActiveLink to="/" className="text-purple">
            <Logo size="3rem" />
          </ActiveLink>
          <h3 className="mt-3 mb-2">Forgot Password</h3>
          <p className="text-secondary mb-0">
            Enter your email or phone number to get a link to reset your
            password.
          </p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit}>
            <InputBox
              label="Email or Phone Number"
              className="px-3 py-2"
              placeholder="E-mail / Phone number"
              callbackValue={(text) => setAccount(text)}
            />
            <Button type="submit" className="px-3 py-2" block color="purple">
              Send Reset Link
            </Button>
          </form>
        </CardBody>

        <CardFooter className="border-0">
          <p>
            Return to{" "}
            <ActiveLink to="/login" className="text-purple">
              sign in
            </ActiveLink>
          </p>
        </CardFooter>
      </Card>
    </FlexBox>
  );
};

export default ForgotPassword;
