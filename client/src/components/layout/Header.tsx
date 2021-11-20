import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { GET_BLOG } from "../../redux/types/blogType";
import { Logo } from "../svg/Icons";
import ActiveLink from "../global/ActiveLink";
import Menu from "./Menu";
import { NavbarMenu } from "../global/Navbar";
import Search from "./Search";
import { useAppSelector } from "../../hooks/storeHooks";
import { useMedia } from "../../hooks/useMedia";

const Header = () => {
  const { currentBlog } = useAppSelector((state) => state);
  const history = useHistory();
  const dispatch = useDispatch();
  const media = useMedia(`(min-width: 768px)`);

  const handleRoute = (path: string) => {
    if (
      history.location.pathname === "/create_blog" &&
      currentBlog._id &&
      currentBlog._id === "drafted_blog"
    ) {
      const msg = "Do you give up writing?\nChanges you made may not be saved.";

      if (window.confirm(msg)) {
        const { _id, ...blog } = currentBlog;
        dispatch({ type: GET_BLOG, payload: blog });
        return history.push(path);
      } else {
        dispatch({ type: GET_BLOG, payload: currentBlog });
        return history.push("/create_blog");
      }
    }

    history.push(path);
  };

  return (
    <header
      className="shadow-sm position-fixed top-0 start-0 right-0 bg-purple-light"
      style={{ zIndex: 2001 }}
    >
      <nav className="navbar navbar-expand-lg align-items-start text-light p-2 p-lg-3">
        <ActiveLink
          onClick={() => handleRoute("/")}
          className="d-flex align-items-end text-purple me-lg-5"
        >
          <Logo size="2rem" />
          <span className="me-2 line-hieght-1 fw-bold">BlogTech</span>
        </ActiveLink>

        <NavbarMenu mediaQuery="992">
          <div
            className="navbar-collapse collapse mt-lg-0 show"
            style={
              !media
                ? { height: "100vh", overflow: "scroll", paddingBottom: "60px" }
                : {}
            }
          >
            <Search handleRoute={handleRoute} />
            <Menu handleRoute={handleRoute} />
          </div>
        </NavbarMenu>
      </nav>
    </header>
  );
};

export default Header;
