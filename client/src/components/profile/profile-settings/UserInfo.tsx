import { useDispatch } from "react-redux";
import { IUser } from "../../../utils/TypeScript";
import NotFound from "../../global/NotFound";
import ChangePassword from "./Security";
import UserInfoSideBar from "./UserInfoSideBar";
import ProfileBlogs from "../ProfileBlogs";
import EditInfo from "./EditInfo";
import UserProfileHeader from "./UserProfileHeader";
import { useSearchParam } from "../../../hooks/useSearchParam";
import SocialProfiles from "./SocialProfiles";
import NotifySettings from "./NotifySettings";
import PrivacySettings from "./PrivacySettings";
import DeleteAccount from "./DeleteAccount";
import Favourites from "./Favourites";
import Follows from "./Follows";
import Tags from "./Tags";
import Categories from "./Categories";
import { useEffect, useState } from "react";
import { getUserSettings } from "../../../redux/actions/profileAction";
import Loading from "../../alert/Loading";
import UserInterface from "./UserInterface";
import { useAppSelector } from "../../../hooks/storeHooks";
import AllUsers from "./AllUsers";

const UserInfo = () => {
  const { auth } = useAppSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth.user || !auth.access_token || !auth.user.settings) return;

    if (typeof auth.user.settings === "string") {
      setLoading(true);
      const token = auth.access_token;
      const settings_id = auth.user.settings;

      dispatch(getUserSettings(settings_id, token));
    } else {
      setLoading(false);
    }
  }, [auth.access_token, auth.user, dispatch]);

  if (!auth.user) return <NotFound />;

  return (
    <>
      <UserProfileHeader />
      <div
        className="row position-relative"
        style={loading ? { minHeight: "100px" } : {}}
      >
        {loading ? (
          <Loading position="absolute" size={50} />
        ) : (
          <>
            <UserInfoSideBar />
            <UserProfileContent user={auth.user} />
          </>
        )}
      </div>
    </>
  );
};

const UserProfileContent = ({ user }: { user: IUser }) => {
  const searchSection = useSearchParam("tab", "user_interface").value;

  const sections = [
    { search: "blogs", component: <ProfileBlogs key="blogs" /> },
    { search: "favorites", component: <Favourites key="favorites" /> },
    {
      search: "followers",
      component: <Follows tab="followers" key="followers" />,
    },
    {
      search: "followings",
      component: <Follows tab="followings" key="followings" />,
    },
    {
      search: "user_interface",
      component: <UserInterface key="user_interface" />,
    },
    { search: "edit_info", component: <EditInfo key="edit_info" /> },
    { search: "socials", component: <SocialProfiles key="socials" /> },
    {
      search: "notifications",
      component: <NotifySettings key="notifications" />,
    },
    { search: "privacy", component: <PrivacySettings key="privacy" /> },
    { search: "delete", component: <DeleteAccount key="delete" /> },
  ];

  const security = {
    search: "security",
    component: <ChangePassword key="security" />,
  };

  const adminSections = [
    { search: "tags", component: <Tags key="tags" /> },
    { search: "categories", component: <Categories key="categories" /> },
    { search: "users", component: <AllUsers key="all_users" /> },
  ];

  if (user.type === "register") {
    sections.splice(1, 0, security);
  }

  if (user.role === "admin") {
    sections.push(...adminSections);
  }

  return (
    <div className="col-lg-9 col-md-8 col-12">
      {sections.map(
        (section) => section.search === searchSection && section.component
      )}
    </div>
  );
};

export default UserInfo;
