import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import ActiveLink from "../../components/global/ActiveLink";
import Button from "../../components/global/Button";
import { Card, CardBody, CardHeader } from "../../components/global/Card";
import FlexBox from "../../components/global/FlexBox";
import InputBox from "../../components/global/InputBox";
import { Logo } from "../../components/svg/Icons";
import { resetPassword } from "../../redux/actions/profileAction";
import { FormSubmit, IParams } from "../../utils/TypeScript";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [cf_password, setCf_password] = useState("");

  const dispatch = useDispatch();
  const token = useParams<IParams>().slug;

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault();
    dispatch(resetPassword(password, cf_password, token));
  };

  return (
    <FlexBox justify="center" items="center" style={{ minHeight: "100vh" }}>
      <Card className="p-0 p-sm-3" style={{ width: "400px" }}>
        <CardHeader className="border-0 pt-3">
          <ActiveLink to="/" className="text-purple">
            <Logo size="3rem" />
          </ActiveLink>
          <h3 className="mt-3 mb-2">Reset Password</h3>
          <p className="text-secondary mb-0">
            Fill the form to reset your password.
          </p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit}>
            <InputBox
              type="password"
              label="Password"
              callbackValue={(text) => setPassword(text)}
            />
            <InputBox
              type="password"
              label="Confirm Password"
              callbackValue={(text) => setCf_password(text)}
            />
            <Button type="submit" className="px-3 py-2" block color="purple">
              Reset Password
            </Button>
          </form>
        </CardBody>
      </Card>
    </FlexBox>
  );
};

export default ResetPassword;
