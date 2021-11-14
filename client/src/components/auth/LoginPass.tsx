import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/actions/authAction";
import { FormSubmit } from "../../utils/TypeScript";
import Button from "../global/Button";
import InputBox from "../global/InputBox";

const LoginPass = () => {
  const initialState = { account: "", password: "", keepMe: false };
  const [userLogin, setUserLogin] = useState(initialState);
  const { account, password, keepMe } = userLogin;
  const dispatch = useDispatch();

  const handleSubmit = async (e: FormSubmit) => {
    e.preventDefault();
    dispatch(login(userLogin));
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputBox
        type="text"
        label="Email or Phone Number"
        callbackValue={(account) => setUserLogin({ ...userLogin, account })}
      />
      <InputBox
        type="password"
        label="Password"
        callbackValue={(password) => setUserLogin({ ...userLogin, password })}
      />

      <InputBox
        type="checkbox"
        label="Keep me signed in"
        callbackValue={() => setUserLogin({ ...userLogin, keepMe: !keepMe })}
      />
      <Button
        type="submit"
        color="purple"
        block
        disabled={!(account && password)}
      >
        Sign me in
      </Button>
    </form>
  );
};

export default LoginPass;
