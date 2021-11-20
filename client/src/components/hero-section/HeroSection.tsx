import React from "react";
import { useAppSelector } from "../../hooks/storeHooks";
import FlexBox, { Col } from "../global/FlexBox";
import FeaturedPost from "./FeaturedPost";

const HeroSection = () => {
  const { homeBlogs } = useAppSelector((state) => state);

  const featuredPost = homeBlogs.topBlogs;

  return (
    <section className="pt-2 pt-lg-5 pb-0 card-grid">
      <FlexBox row className="g-2 g-md-4">
        <Col lg="6">
          <FeaturedPost bestPost post={featuredPost[0]} />
        </Col>
        <Col lg="6">
          <FlexBox row className="g-2 g-md-4">
            <Col>
              <FeaturedPost post={featuredPost[1]} />
            </Col>
            <Col md="6">
              <FeaturedPost post={featuredPost[2]} />
            </Col>
            <Col md="6">
              <FeaturedPost post={featuredPost[3]} />
            </Col>
          </FlexBox>
        </Col>
      </FlexBox>
    </section>
  );
};

export default HeroSection;
