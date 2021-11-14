import React, { useEffect, useState } from "react";
import AlertCookie from "../components/alert/AlertCookie";
import FlexBox from "../components/global/FlexBox";
import HeroSection from "../components/hero-section/HeroSection";
import Sidebar from "../components/sidebar/Sidebar";
import Cookie from "js-cookie";
import HomeBlogsSection from "../components/global/HomeBlogsSection";
import { useAppSelector } from "../hooks/storeHooks";

const Home = () => {
  const { homeBlogs } = useAppSelector((state) => state);
  const [show, setShow] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);

  const cookie = Cookie.get("coockie_notice_accepted");
  const accepted = cookie === undefined ? false : JSON.parse(cookie);

  const handleSetCookie = () => {
    Cookie.set("coockie_notice_accepted", "true", { expires: 365 });
    setShow(false);
  };

  useEffect(() => {
    if (accepted || !homeBlogs.allBlogs.count) return;
    let timer = setTimeout(() => {
      setShow(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [accepted, homeBlogs.allBlogs.count]);

  useEffect(() => {
    const nav = window.localStorage.getItem("right_nav");
    if (!nav) setShowSideBar(true);
  }, []);

  if (!homeBlogs.allBlogs.blogs.length) return null;
  if (!homeBlogs.topBlogs.length) return null;

  return (
    <div className="home_page">
      <AlertCookie
        handleSetCookie={handleSetCookie}
        isOpen={show}
        handleClose={() => setShow(false)}
      />
      <HeroSection />
      <section className="position-relative">
        <div className="container">
          <div className="mb-4">
            <h2 className="m-0">Tody's Top Highlights</h2>
            <p className="text-secondary">
              Latest breaking news, pictures, articles and special reports
            </p>
          </div>
          <FlexBox row justify="end">
            <HomeBlogsSection />
            {showSideBar && <Sidebar />}
          </FlexBox>
        </div>
      </section>
    </div>
  );
};

export default Home;
