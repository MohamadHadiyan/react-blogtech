import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/storeHooks";
import { getHomeBlogs } from "../../redux/actions/blogAction";
import { IBlog } from "../../utils/TypeScript";
import Loading from "../alert/Loading";
import PostCard from "../cards/PostCard";
import Filters from "./Filters";
import FlexBox, { Col } from "./FlexBox";

const HomeBlogsSection = () => {
  const { homeBlogs } = useAppSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [blogsLen, setBlogsLen] = useState(0);
  const [skip, setSkip] = useState(0);
  // const [fullWidth, setFullWidth] = useState(false);
  const [showRightNav, setShowRightNav] = useState(true);
  const [filteredBlogs, setFilteredBlogs] = useState<IBlog[]>([]);

  const dispatch = useDispatch();
  const blogs = homeBlogs.allBlogs.blogs;
  const count = homeBlogs.allBlogs.count;

  const handleScroll = useCallback(async () => {
    const window_H = window.innerHeight;
    const scrollTop = document.documentElement.scrollTop;
    const offset_H = document.documentElement.offsetHeight;

    if (
      (window_H + scrollTop === offset_H ||
        (window_H + scrollTop <= offset_H &&
          window_H + scrollTop > offset_H - 100)) &&
      loading === false &&
      blogs.length < count &&
      skip < count
    ) {
      const num = 10 + skip > count ? count - 10 : 10 + skip;

      setLoading(true);
      setSkip(num);
      dispatch(getHomeBlogs(num));
    }
  }, [blogs.length, count, dispatch, loading, skip]);

  useEffect(() => {
    if (blogsLen !== blogs.length) {
      setLoading(false);
      setBlogsLen(blogs.length);
    }
  }, [blogs.length, blogsLen]);

  useEffect(() => {
    if (skip >= count || count === 0) return;
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [count, handleScroll, skip]);

  useEffect(() => {
    const nav = window.localStorage.getItem("right_nav");
    if (nav) setShowRightNav(false);
  }, []);

  const currentBlogs = filteredBlogs.length ? filteredBlogs : blogs;

  return (
    <>
      <Filters
        callbackFilter={(blogs) => setFilteredBlogs(blogs)}
        blogs={blogs}
      />
      <Col lg={showRightNav ? "9" : "12"}>
        <FlexBox row className="g-2 g-md-4">
          {!!blogs.length &&
            currentBlogs.map((blog, i) => (
              <Col md="6" lg={showRightNav ? "6" : "4"} key={i} xxl="4" >
                <PostCard post={blog} />
              </Col>
            ))}
        </FlexBox>
        {loading && blogs.length && (
          <div className="position-relative" style={{ minHeight: "150px" }}>
            <Loading position="absolute" />
          </div>
        )}
      </Col>
    </>
  );
};

export default HomeBlogsSection;
