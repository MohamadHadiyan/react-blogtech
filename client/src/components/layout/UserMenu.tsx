import React from "react";
import ActiveLink from "../global/ActiveLink";
import Avatar from "../global/Avatar";
import { ConfigIcon } from "../global/Icons";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authAction";
import { IUser } from "../../utils/TypeScript";

interface IProps {
  handleRoute: (path: string) => void;
  user: IUser;
  token: string;
  isDesktop: boolean;
}
const UserMenu = ({ handleRoute, user, token, isDesktop }: IProps) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    handleRoute("/");
    dispatch(logout(token));
  };

  return (
    <li className="w-100 dropdown">
      <div
        className="nav-link py-lg-0 d-flex align-items-end text-link"
        id="navbarDropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <Avatar size="md" src={user.avatar} title={user.name} border />
        {!isDesktop && <span className="ms-2 fw-semi-bold">{user.name}</span>}
      </div>

      <ul
        className="right-0 left-auto dropdown-menu shadow p-2 "
        aria-labelledby="navbarDropdown"
      >
        <li>
          <ActiveLink
            onClick={() => handleRoute(`/profile/${(user as IUser)._id}`)}
            className="dropdown-item d-flex align-items-end p-2 rounded-3"
          >
            <Avatar src={user.avatar} size="lg" border title={user.name} />
            <div className="ms-2">
              <div className="fw-semi-bold">{user.name}</div>
              <div className="text-muted text-lowercase">{user.account}</div>
            </div>
          </ActiveLink>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <ActiveLink
            className="dropdown-item p-2 rounded-3"
            onClick={() => handleRoute(`/profile/${(user as IUser)._id}`)}
          >
            <i className="fas fa-user-circle fa-lg me-3" />
            Profile
          </ActiveLink>
        </li>
        <li>
          <ActiveLink
            className="dropdown-item p-2 rounded-3"
            onClick={() => handleRoute(`/profile/${(user as IUser)._id}`)}
            to="?tab=blogs"
          >
            <i className="fas fa-newspaper me-3" />
            Blogs
          </ActiveLink>
        </li>
        <li>
          <ActiveLink
            className="dropdown-item p-2 rounded-3"
            onClick={() => handleRoute(`/profile/${(user as IUser)._id}`)}
            to="?tab=favorites"
          >
            <i className="fas fa-heart me-3" />
            Favorites
          </ActiveLink>
        </li>
        <li>
          <ActiveLink
            className="dropdown-item p-2 rounded-3"
            onClick={() => handleRoute(`/profile/${(user as IUser)._id}`)}
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
  );
};

export default UserMenu;
