import React from "react";
import { useAppSelector } from "../../hooks/storeHooks";
import FeaturedPost from "./FeaturedPost";

const HeroSection = () => {
  // const { homeBlogs } = useAppSelector((state) => state);
  const { homeBlogs } = useAppSelector((state) => state);

  const featuredPost = homeBlogs.topBlogs;

  return (
    <section className="pt-4 pb-0 card-grid">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-6">
            <FeaturedPost bestPost post={featuredPost[0]} />
          </div>
          <div className="col-lg-6">
            <div className="row g-4">
              <div className="col-12">
                <FeaturedPost post={featuredPost[1]} />
              </div>
              <div className="col-md-6">
                <FeaturedPost post={featuredPost[2]} />
              </div>
              <div className="col-md-6">
                <FeaturedPost post={featuredPost[3]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
