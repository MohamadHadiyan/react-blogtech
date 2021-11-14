import { useDispatch } from "react-redux";
import { GoogleLogin, GoogleLoginResponse } from "react-google-login-lite";
import {
  FacebookLogin,
  FacebookLoginAuthResponse,
} from "react-facebook-login-lite";
import { facebookLogin, googleLogin } from "../../redux/actions/authAction";

interface IProps {
  signin?: boolean;
  className?: string;
}

const SocialLogin = ({ signin, className = "" }: IProps) => {
  const dispatch = useDispatch();
  const responseGoogle = (response: GoogleLoginResponse) => {
    const id_token = response.getAuthResponse().id_token;
    dispatch(googleLogin(id_token));
  };

  const responseFacebook = (response: FacebookLoginAuthResponse) => {
    const { accessToken, userID } = response.authResponse;
    dispatch(facebookLogin(accessToken, userID));
  };

  return (
    <div className={`text-center ${className}`}>
      <p className="text-secondary small">
        Sign {signin ? "in" : "up"} with your social network for quick access
      </p>
      <div className="mt-3 center">
        <div className="me-2 mb-2 w-100">
          <FacebookLogin appId="199558671999132" onSuccess={responseFacebook} />
        </div>
        <div className="w-100">
          <GoogleLogin
            client_id="735577821275-m7e95f8f430rfhcp1g8e40ludju73q52.apps.googleusercontent.com"
            cookiepolicy="single_host_origin"
            onSuccess={responseGoogle}
          />
        </div>
      </div>
    </div>
  );
};

export default SocialLogin;
