import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useMedia } from "../../hooks/useMedia";
import { ALERT } from "../../redux/types/alertType";
import { FormSubmit } from "../../utils/TypeScript";
import { validateEmail } from "../../utils/Valid";
import Input from "../form-elements/Input";
import Button from "../global/Button";
import { Col } from "../global/FlexBox";
import { BlogText, BlogTitle, SubscribeForm } from "./BlogComponents";

interface IProps {
  title: string;
  text: string;
  lgForm?: boolean;
  formClass?: string;
  callback: (value: string) => void;
}
const SubscribeSection = ({
  title,
  text,
  lgForm = false,
  formClass = "",
  callback,
}: IProps) => {
  const [email, setEmail] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);
  const media = useMedia("(min-width: 768px)");
  const dispatch = useDispatch();

  useEffect(() => {
    if (media) {
      setIsDesktop(true);
    } else {
      setIsDesktop(false);
    }
  }, [media]);

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault();
    if (!email) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Pleas Enter Your Email Address." },
      });
    }

    const check = validateEmail(email);

    if (!check) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid Email Address." },
      });
    }
    dispatch({ type: ALERT, payload: { success: "Success." } });
    callback(email);
  };

  return (
    <div className="text-center">
      <div className="mb-3">
        <BlogTitle size="md">{title}</BlogTitle>
        <BlogText block className="lead mb-2">
          {text}
        </BlogText>
      </div>
      <SubscribeForm
        className={`center g-2 ${formClass}`}
        onSubmit={handleSubmit}
      >
        <Col className="col">
          <Input
            placeholder="Eamil Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sizing={lgForm && isDesktop ? "lg" : ""}
          />
        </Col>
        <Col col="auto" className="ms-md-0 ms-auto">
          <Button
            color="purple"
            type="submit"
            block
            size={lgForm && isDesktop ? "lg" : ""}
          >
            Submit
          </Button>
        </Col>
      </SubscribeForm>
    </div>
  );
};

export default SubscribeSection;
