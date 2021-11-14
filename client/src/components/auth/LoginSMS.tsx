import { useState } from "react";
import { useDispatch } from "react-redux";
import { smsLogin } from "../../redux/actions/authAction";
import { FormSubmit } from "../../utils/TypeScript";
import Button from "../global/Button";
import InputBox from "../global/InputBox";

const LoginSMS = () => {
  const [phone, setPhone] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault();
    dispatch(smsLogin(phone));
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputBox
        type="text"
        label="Phone Number"
        callbackValue={(phone) => setPhone(phone)}
      />
      <Button type="submit" block color="purple" disabled={!phone}>
        Sign me in
      </Button>
    </form>
  );
};

export default LoginSMS;
