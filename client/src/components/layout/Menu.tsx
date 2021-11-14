import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/storeHooks";
import { useMedia } from "../../hooks/useMedia";
import { logout } from "../../redux/actions/authAction";
import { IUser } from "../../utils/TypeScript";
import ActiveLink from "../global/ActiveLink";
import Avatar from "../global/Avatar";
import { ConfigIcon, PencilIcon } from "../global/Icons";
import Notification from "./Notification";

interface IProps {
  handleRoute: (path: string) => void;
}

const Menu = ({ handleRoute }: IProps) => {
  const { auth } = useAppSelector((state) => state);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [isDesktop, setIsDesktop] = useState(false);
  const media = useMedia("(min-width: 992px)");

  useEffect(() => {
    setIsDesktop(media);
  }, [media]);

  const isActive = (pn: string) => {
    return pn === pathname ? "text-purple" : "text-link";
  };

  const handleLogout = () => {
    handleRoute("/");

    if (auth.access_token) {
      dispatch(logout(auth.access_token));
    }
  };

  return (
    <ul className="navbar-nav center ms-auto ms-lg-5">
      {auth.access_token && auth.user ? (
        <>
          <li className={`w-100 ${isDesktop ? "" : "border-bottom"}`}>
            <ActiveLink
              className={`nav-link py-lg-0`}
              color={pathname === "/create_blog" ? "purple" : "link"}
              to="/create_blog"
              title="Create Blog"
            >
              <span className="border d-block rounded-circle text-center avatar-md p-1">
                <PencilIcon fill />
              </span>
            </ActiveLink>
          </li>
          <li className={`w-100 ${isDesktop ? "" : "border-bottom"} dropdown`}>
            <Notification handleRoute={handleRoute} />
          </li>
          <li className="w-100 dropdown">
            <span
              className="nav-link py-lg-0"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Avatar
                size="md"
                src={auth.user.avatar}
                title={auth.user.name}
                border
              />
            </span>

            <ul
              className="right-0 left-auto dropdown-menu shadow p-2 "
              aria-labelledby="navbarDropdown"
            >
              <li>
                <ActiveLink
                  onClick={() =>
                    handleRoute(`/profile/${(auth.user as IUser)._id}`)
                  }
                  className="dropdown-item d-flex end p-2 rounded-3"
                >
                  <Avatar
                    src={auth.user.avatar}
                    size="lg"
                    border
                    title={auth.user.name}
                  />
                  <div className="ms-2">
                    <div className="fw-semi-bold">{auth.user.name}</div>
                    <div className="text-muted text-lowercase">
                      {auth.user.account}
                    </div>
                  </div>
                </ActiveLink>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <ActiveLink
                  className="dropdown-item p-2 rounded-3"
                  onClick={() =>
                    handleRoute(`/profile/${(auth.user as IUser)._id}`)
                  }
                >
                  <i className="fas fa-user-circle fa-lg me-3" />
                  Profile
                </ActiveLink>
              </li>
              <li>
                <ActiveLink
                  className="dropdown-item p-2 rounded-3"
                  onClick={() =>
                    handleRoute(`/profile/${(auth.user as IUser)._id}`)
                  }
                  to="?tab=blogs"
                >
                  <i className="fas fa-newspaper me-3" />
                  Blogs
                </ActiveLink>
              </li>
              <li>
                <ActiveLink
                  className="dropdown-item p-2 rounded-3"
                  onClick={() =>
                    handleRoute(`/profile/${(auth.user as IUser)._id}`)
                  }
                  to="?tab=favorites"
                >
                  <i className="fas fa-heart me-3" />
                  Favorites
                </ActiveLink>
              </li>
              <li>
                <ActiveLink
                  className="dropdown-item p-2 rounded-3"
                  onClick={() =>
                    handleRoute(`/profile/${(auth.user as IUser)._id}`)
                  }
                  to="?tab=edit_info"
                >
                  <ConfigIcon fill className="me-3" />
                  Settings
                </ActiveLink>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <ActiveLink
                  className="dropdown-item p-2 rounded-3"
                  onClick={handleLogout}
                >
                  <i className="fas fa-power-off me-3" />
                  Logout
                </ActiveLink>
              </li>
            </ul>
          </li>
        </>
      ) : (
        <>
          <li
            className={`w-100 ${isDesktop ? "" : "border-bottom"} ${isActive(
              "register"
            )}`}
          >
            <ActiveLink className="nav-link py-lg-0 text-link" to="/register">
              Register
            </ActiveLink>
          </li>
          <li
            className={`w-100 ${isDesktop ? "" : "border-bottom"} ${isActive(
              "login"
            )}`}
          >
            <ActiveLink className="nav-link py-lg-0 text-link" to="/login">
              Login
            </ActiveLink>
          </li>
        </>
      )}
    </ul>
  );
};

// const MenuLink = ()=>{
//   return(

//   )
// }

export default Menu;
