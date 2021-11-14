import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { register } from "../../redux/actions/authAction";
import { FormSubmit, InputChange } from "../../utils/TypeScript";

const RegisterForm = () => {
  const initialState = {
    name: "",
    account: "",
    password: "",
    cf_password: "",
    subscribed: false,
  };
  const [userRegister, setUserRegister] = useState(initialState);
  const { name, account, password, cf_password, subscribed } = userRegister;
  const [typePass, setTypePass] = useState(false);
  const [cf_typePass, setCf_typePass] = useState(false);

  const { search } = useLocation();
  const dispatch = useDispatch();

  const handleChangeInput = (e: InputChange) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    type === "checkbox"
      ? setUserRegister({ ...userRegister, [name]: checked })
      : setUserRegister({ ...userRegister, [name]: value });
  };

  const handleSubmit = async (e: FormSubmit) => {
    e.preventDefault();
    dispatch(register(userRegister));
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      {/* Name */}
      <div className="form-group mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          name="name"
          className="form-control"
          id="name"
          placeholder="Name"
          value={name}
          onChange={handleChangeInput}
        />
      </div>
      {/* Email */}
      <div className="form-group mb-3">
        <label htmlFor="account" className="form-label">
          Email or Phone number
        </label>
        <input
          type="text"
          name="account"
          className="form-control"
          id="account"
          placeholder="E-mail / Phone number"
          
          value={account}
          onChange={handleChangeInput}
        />
        <small className="form-text">
          We'll never share your email with anyone else.
        </small>
      </div>
      {/* Password */}
      <div className="form-group mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <div className="pass">
          <input
            type={typePass ? "text" : "password"}
            name="password"
            className="form-control"
            id="password"
            placeholder="********"
            value={password}
            onChange={handleChangeInput}
          />
          <small onClick={() => setTypePass(!typePass)}>
            {typePass ? "Hide" : "Show"}
          </small>
        </div>
      </div>
      {/* Confirm Password */}
      <div className="form-group mb-3">
        <label htmlFor="cf_password" className="form-label">
          Confirm password
        </label>
        <div className="pass">
          <input
            type={cf_typePass ? "text" : "password"}
            name="cf_password"
            className="form-control"
            id="cf_password"
            placeholder="********"
            value={cf_password}
            onChange={handleChangeInput}
          />
          <small onClick={() => setCf_typePass(!cf_typePass)}>
            {cf_typePass ? "Hide" : "Show"}
          </small>
        </div>
      </div>
      {/* Checkbox */}
      <div className="form-check mb-3">
        <input
          checked={subscribed}
          onChange={handleChangeInput}
          type="checkbox"
          name="keepMe"
          id="keepMe"
          className="form-check-input"
        />
        <label htmlFor="keepMe" className="form-check-label">
          Yes i'd also like to sign up for additional subscription
        </label>
      </div>
      {/* Button */}
      <div className="row center">
        <div className="col-sm-4">
          <button
            type="submit"
            className="btn btn-success bg-gradient w-100 mt-1"
          >
            Sign me up
          </button>
        </div>
        <div className="col-sm-8 text-sm-end">
          <span>
            Have an account?{" "}
            <Link to={`/login${search}`}>
              <u>Sign in</u>{" "}
            </Link>
          </span>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
