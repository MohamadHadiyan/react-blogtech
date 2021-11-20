import React, { useEffect, useState } from "react";
import FlexBox from "../components/global/FlexBox";
import HeroSection from "../components/hero-section/HeroSection";
import Sidebar from "../components/layout/sidebar/Sidebar";
import HomeBlogsSection from "../components/global/HomeBlogsSection";
import { useAppSelector } from "../hooks/storeHooks";
import { useMedia } from "../hooks/useMedia";

const Home = () => {
  const { homeBlogs } = useAppSelector((state) => state);
  const [showSideBar, setShowSideBar] = useState(false);
  const media = useMedia("(min-width: 992px)");

  useEffect(() => {
    const nav = window.localStorage.getItem("right_nav");
    if (!nav) setShowSideBar(true);
  }, []);

  if (!homeBlogs.allBlogs.blogs.length) return null;
  if (!homeBlogs.topBlogs.length) return null;

  return (
    <div className="home_page">
      <HeroSection />
      <section className="position-relative pt-4 pt-lg-5">
        <div>
          <div className="mb-2 mb-md-2">
            <h2 className="m-0">Tody's Top Highlights</h2>
            <p className="text-secondary">
              Latest breaking news, pictures, articles and special reports
            </p>
          </div>
          <FlexBox row justify="end">
            <HomeBlogsSection />
            {showSideBar && media && <Sidebar />}
          </FlexBox>
        </div>
      </section>
    </div>
  );
};

export default Home;
