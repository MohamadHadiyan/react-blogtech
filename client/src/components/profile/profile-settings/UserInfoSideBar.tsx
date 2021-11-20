import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storeHooks";
import { useMedia } from "../../../hooks/useMedia";
import { useSearchParam } from "../../../hooks/useSearchParam";
import { logout } from "../../../redux/actions/authAction";
import Loading from "../../alert/Loading";
import FlexBox, { Col } from "../../global/FlexBox";
import {
  Navbar,
  NavbarHeader,
  NavbarMenu,
  NavbarNav,
  NavItem,
  NavLink,
} from "../../global/Navbar";

const SideBar = () => {
  const { auth } = useAppSelector((state) => state);
  const [isActive, setIsActive] = useState(false);
  const [rounded, setRounded] = useState("rounded");
  const media = useMedia("(min-width: 768px)");
  const tab = useSearchParam("tab", "user_interface").value;

  useEffect(() => {
    if (media || isActive) {
      setIsActive(true);
    }

    if (!media) {
      setRounded("rounded-bottom border-top");
    } else {
      setRounded("rounded");
    }
  }, [isActive, media]);

  if (!auth.user) return <Loading />;

  const user = auth.user;

  return (
    <Col md="4" lg="3">
      <Navbar className={`mb-2 mb-lg-4 mb-md-0 ${rounded}`}>
        <NavbarMenu mediaQuery="768">
          <DashboardNav tab={tab} />
          <SettingsNav userId={user._id} type={user.type} tab={tab} />
        </NavbarMenu>
      </Navbar>
    </Col>
  );
};

const DashboardNav = ({ tab }: { tab: string }) => {
  const { auth, tags, categories } = useAppSelector((state) => state);

  if (!auth.user || !auth.access_token) return null;

  const user = auth.user;
  const dashBoardItems = [
    {
      icon: "newspaper",
      url: "blogs",
      text: `My blogs`,
      amount: user.blogs.length,
    },
    {
      icon: "heart",
      url: "favorites",
      text: `Favorites`,
      amount: user.favourites.length,
    },
    {
      icon: "user-alt",
      url: "followers",
      text: "Followers",
      amount: user.followers.length,
    },
    {
      icon: "user-alt",
      url: "followings",
      text: "Followings",
      amount: user.followings.length,
    },
  ];

  const adminTabs = [
    { icon: "tags", url: "tags", text: "Tags", amount: tags.count },
    {
      icon: "layer-group",
      url: "categories",
      text: "Categories",
      amount: categories.names.length,
    },
    { icon: "users", url: "users", text: "All Users", amount: 0 },
  ];

  if (user.role === "admin") dashBoardItems.push(...adminTabs);

  return (
    <NavbarNav className="p-3">
      <NavItem className="mb-2">
        <NavbarHeader>Dashboard</NavbarHeader>
      </NavItem>
      {dashBoardItems.map((item, i) => (
        <NavItem key={i} className="mb-1 text-capitalize">
          <NavLink
            className="py-1 px-2 small d-block"
            to={`/profile/${user._id}?tab=${item.url}`}
            isActive={item.url === tab}
          >
            <FlexBox justify="between">
              <div>
                <i className={`fas fa-${item.icon} me-2`} />
                {item.text}
              </div>
              {item.amount && <span>{item.amount}</span>}
            </FlexBox>
          </NavLink>
        </NavItem>
      ))}
    </NavbarNav>
  );
};

const SettingsNav = ({
  userId,
  type,
  tab,
}: {
  userId: string;
  type: string;
  tab: string;
}) => {
  const settingItems = [
    { icon: "palette", url: `user_interface`, text: "Interface" },
    { icon: "user-cog", url: `edit_info`, text: "Edit Info" },
    { icon: "sync", url: `socials`, text: "Social profiles" },
    { icon: "bell", url: `notifications`, text: "Notifications" },
    { icon: "user-lock", url: `privacy`, text: "Profile privacy" },
    { icon: "trash-alt", url: `delete`, text: "Delete profile" },
    { icon: "power-off", url: "/", text: "Sign out" },
  ];
  const security = { icon: "user-shield", url: `security`, text: "Security" };
  const { auth } = useAppSelector((state) => state);
  const dispatch = useDispatch();

  if (type === "register") {
    settingItems.splice(2, 0, security);
  }

  const handleLogout = () => {
    if (auth.access_token) {
      dispatch(logout(auth.access_token));
    }
  };

  return (
    <NavbarNav className="p-3">
      <NavItem className="mb-2">
        <NavbarHeader>Account Settings</NavbarHeader>
      </NavItem>
      {settingItems.map((item, i) => (
        <NavItem key={item.text + i} className="mb-1 text-capitalize">
          {item.icon === "power-off" ? (
            <NavLink
              className="py-1 ps-2 small d-block"
              to={item.url}
              onClick={handleLogout}
            >
              <i className={`fas fa-${item.icon} me-2`} />
              {item.text}
            </NavLink>
          ) : (
            <NavLink
              className="py-1 ps-2 small d-block"
              to={`/profile/${userId}?tab=${item.url}`}
              isActive={item.url === tab}
            >
              <i className={`fas fa-${item.icon} me-2`} />
              {item.text}
            </NavLink>
          )}
        </NavItem>
      ))}
    </NavbarNav>
  );
};

const UserInfoSideBar = memo(SideBar);

export default UserInfoSideBar;
