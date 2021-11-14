import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/storeHooks";
import { getHomeBlogs } from "../../redux/actions/blogAction";
import Loading from "../alert/Loading";
import PostCard from "../cards/PostCard";
import FlexBox, { Col } from "./FlexBox";

const HomeBlogsSection = () => {
  const { homeBlogs } = useAppSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [blogsLen, setBlogsLen] = useState(0);
  const [skip, setSkip] = useState(0);
  const dispatch = useDispatch();
  const [fullWidth, setFullWidth] = useState(false);

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
    if (nav) setFullWidth(true);
  }, []);

  return (
    <Col lg={fullWidth ? "12" : "9"}>
      <FlexBox row className="g-4">
        {!!blogs.length &&
          blogs.map((blog, i) => (
            <Col md={fullWidth ? "6" : "6"} lg={fullWidth ? "4" : "6"} key={i}>
              <PostCard post={blog} />
            </Col>
          ))}
      </FlexBox>
      {(loading && blogs.length) && (
        <div className="position-relative" style={{ minHeight: "150px" }}>
          <Loading position="absolute" />
        </div>
      )}
    </Col>
  );
};

export default HomeBlogsSection;
