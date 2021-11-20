import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/storeHooks";
import { useMedia } from "../../hooks/useMedia";
import ActiveLink from "../global/ActiveLink";
import { PencilIcon } from "../global/Icons";
import Notification from "./Notification";
import MobileItem from "./MobileItem";
import UserMenu from "./UserMenu";
import CategorySection from "./sidebar/CategorySection";
import TagsSection from "./sidebar/TagsSection";
import ArchiveSection from "./sidebar/ArchiveSection";

interface IProps {
  handleRoute: (path: string) => void;
}

const Menu = ({ handleRoute }: IProps) => {
  const { auth, tags, categories, archive } = useAppSelector((state) => state);
  const { pathname } = useLocation();
  const [isDesktop, setIsDesktop] = useState(false);
  const media = useMedia("(min-width: 992px)");

  const categoriesName = categories.names.filter(
    (item) => item.name !== "draft"
  );

  useEffect(() => {
    setIsDesktop(media);
  }, [media]);

  const isActive = (pn: string) => {
    return pn === pathname ? "text-purple" : "text-link";
  };

  return (
    <ul
      className={`navbar-nav center ms-auto ms-lg-5 ${
        isDesktop ? "" : "border-top mt-2"
      }`}
    >
      <MobileItem
        isDesktop={isDesktop}
        icon={<i className="fas fa-layer-group" />}
        label="Categories"
      >
        <CategorySection categories={categoriesName} />
      </MobileItem>

      <MobileItem
        isDesktop={isDesktop}
        icon={<i className="fas fa-calendar-alt" />}
        label="Archive"
      >
        <ArchiveSection archives={archive.dates} />
      </MobileItem>

      <MobileItem
        isDesktop={isDesktop}
        icon={<i className="fas fa-tags" />}
        label="Tags"
      >
        <TagsSection tags={tags.names} />
      </MobileItem>

      {auth.access_token && auth.user ? (
        <>
          <li className={`w-100 ${isDesktop ? "" : "border-bottom"}`}>
            <ActiveLink
              className={`nav-link py-lg-0`}
              color={pathname === "/create_blog" ? "purple" : "link"}
              to="/create_blog"
              title="Create Blog"
            >
              <span className="border d-inline-block rounded-circle text-center avatar-md p-1">
                <PencilIcon fill />
              </span>
              {!isDesktop && <span className="ms-2">Create Blog</span>}
            </ActiveLink>
          </li>
          <li className={`w-100 ${isDesktop ? "" : "border-bottom"} dropdown`}>
            <Notification handleRoute={handleRoute} isDesktop={isDesktop} />
          </li>
          <UserMenu
            handleRoute={handleRoute}
            user={auth.user}
            token={auth.access_token}
            isDesktop={isDesktop}
          />
        </>
      ) : (
        <li className={`w-100 ${isActive("login")}`}>
          <ActiveLink
            className="nav-link py-lg-0 text-link"
            to="/login"
            title="login"
          >
            <span className="border d-inline-block rounded-circle text-center avatar-md p-1">
              <i className="fas fa-user" />
            </span>
            {!isDesktop && <span className="ms-2">Login</span>}
          </ActiveLink>
        </li>
      )}
    </ul>
  );
};

export default Menu;
