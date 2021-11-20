import { useParams } from "react-router-dom";
import ProfileInfo from "../../components/profile/profile-info/ProfileInfo";
import UserInfo from "../../components/profile/profile-settings/UserInfo";
import { useAppSelector } from "../../hooks/storeHooks";
import { IParams } from "../../utils/TypeScript";

const Profile = () => {
  const { auth, alert } = useAppSelector((state) => state);
  const { slug } = useParams<IParams>();
  const user = auth.user;

  return user && user._id === slug ? (
    <UserInfo />
  ) : (
    !alert.loading && <ProfileInfo id={slug} />
  );
};

export default Profile;
