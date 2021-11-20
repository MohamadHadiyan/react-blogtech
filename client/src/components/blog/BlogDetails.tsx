import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useAppSelector } from "../../hooks/storeHooks";
import {
  updateBlogLikes,
  updateBlogViews,
} from "../../redux/actions/blogAction";
import { updateFavourite } from "../../redux/actions/profileAction";
import { UPDATE_ALL_BLOGS } from "../../redux/types/blogType";
import { toSummarize } from "../../utils/getBlogInfo";
import getDate from "../../utils/GetDate";
import { IBlog, IBlogCard, IUserCard } from "../../utils/TypeScript";
import Button from "../global/Button";
import { DefaultDropDownMenu } from "../global/Dropdown";
import FlexBox, { Col } from "../global/FlexBox";
import {
  BookMarkIcon,
  CommentIcon,
  ShareIcon,
  ThumbsUpIcon,
} from "../global/Icons";
import LoadingButton from "../global/LoadingButton";
import ShareLink from "../global/ShareLink";

interface IProps {
  blog: IBlog;
}

const BlogDetails = ({ blog }: IProps) => {
  const { auth } = useAppSelector((state) => state);

  const [views, setViews] = useState(blog.views || 0);
  const [likes, setLikes] = useState<string[]>(blog.likes || []);
  const [liked, setLiked] = useState(false);
  const [viewed, setViewed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const handleLike = () => {
    if (!auth.user || !auth.access_token) return;

    const blog_id = blog._id as string;
    const user_id = auth.user._id;
    const token = auth.access_token;

    let newLikes = liked
      ? likes.filter((item) => item !== user_id)
      : [...likes, user_id];

    setLikes(newLikes);
    const homeBlog = { ...blog, likes: newLikes, content: "" };

    if (viewed) {
      dispatch({ type: UPDATE_ALL_BLOGS, payload: homeBlog });
      dispatch(updateBlogLikes(newLikes, user_id, blog_id, token));
    } else {
      const newViews = liked ? views : views + 1;
      const payload = { ...homeBlog, views: newViews };

      setViewed(true);
      dispatch(updateBlogLikes(newLikes, user_id, blog_id, token));
      dispatch({ type: UPDATE_ALL_BLOGS, payload });

      if (!liked) dispatch(updateBlogViews(newViews, blog_id));
    }
  };

  const handleSave = () => {
    if (!auth.access_token || !auth.user || !blog._id) return;
    const favBlog: IBlogCard = {
      _id: blog._id as string,
      user: blog.user as IUserCard,
      thumbnail: blog.thumbnail as string,
      title: blog.title,
      description: blog.description,
    };

    setLoading(true);
    dispatch(
      updateFavourite({
        user_id: auth.user._id,
        blog: favBlog,
        actionType: isSaved ? "remove" : "add",
        token: auth.access_token,
      })
    );
  };

  useEffect(() => {
    if (!auth.access_token || !auth.user) return;

    const user = auth.user;
    const saved = user.favourites
      ? user.favourites.some((item) =>
          typeof item === "string" ? item === blog._id : item._id === blog._id
        )
      : false;
    setLoading(false);
    setIsSaved(saved);
  }, [auth.access_token, auth.user, blog._id]);

  useEffect(() => {
    if (viewed || liked) return;

    const time = setTimeout(() => {
      const newViews = views + 1;
      const payload = { ...blog, views: newViews, content: "" };

      setViews(newViews);
      setViewed(true);
      dispatch({ type: UPDATE_ALL_BLOGS, payload });
      dispatch(updateBlogViews(newViews, blog._id as string));
    }, 6e4);

    return () => clearTimeout(time);
  }, [blog, dispatch, liked, viewed, views]);

  useEffect(() => {
    if (!auth.user || !auth.access_token) return;
    if (likes.indexOf(auth.user._id) !== -1) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [auth.access_token, auth.user, likes]);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      let sY = window.scrollY;
      if (sY > 800) return;

      setIsFixed(sY > 600 ? true : false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <FlexBox
      wrap
      items="end"
      justify="center"
      className="mt-4 fw-semi-bold pb-2 g-0 justify-content-md-between"
    >
      <div className="mb-2">
        <span className="me-3">
          {getDate(blog.createdAt, { fullText: true })}
        </span>
        <span className="me-3">
          {blog.views ? toSummarize(blog.views) : "No"} views
        </span>
      </div>
      <FlexBox
        row
        className={
          isFixed
            ? "position-fixed start-0 pb-1 pt-lg-4 end-0 bg-purple-light"
            : "ps-md-2 g-0"
        }
        justify="center"
        style={isFixed ? { top: "45px", zIndex: 10 } : {}}
      >
        <Col lg={isFixed ? "8" : "auto"}>
          <FlexBox wrap justify="center" items="center">
            <Button
              size="sm"
              border
              onClick={handleLike}
              className="me-1 me-md-2 mt-2 p-1 p-md-2"
              title="I liked this"
            >
              {blog.likes && toSummarize(blog.likes.length)}{" "}
              {liked ? "Liked " : "Like "}
              <ThumbsUpIcon fill={liked} color={liked ? "purple" : ""} />
            </Button>

            <Button
              size="sm"
              border
              onClick={() => history.push("#comments")}
              className="me-1 me-md-2 mt-2 p-1 p-md-2"
              title="Leave a comment"
            >
              {blog.comments.length} Comment <CommentIcon />
            </Button>

            <DefaultDropDownMenu
              toggleClass="p-0"
              menuItems={ShareLink(
                `https://blogtech-app.herokuapp.com/blog/${blog._id}`
              )}
              transform="translate(30px,50px)"
              icon={
                <Button
                  size="sm"
                  border
                  className="me-1 me-md-2 mt-2 p-1 p-md-2"
                  title="Share Blog"
                >
                  <ShareIcon /> Share
                </Button>
              }
            />

            <LoadingButton
              onClick={handleSave}
              show={isSaved}
              loading={loading}
              size="sm"
              border
              width={{ before: 100, after: 110 }}
              className="mt-2 p-1 p-md-2"
              title="Save Blog, Add this blog to your favourites"
              beforeChild={
                <>
                  <BookMarkIcon /> Save
                </>
              }
              affterChild={
                <>
                  <BookMarkIcon fill color="purple" /> Saved{" "}
                </>
              }
            />
          </FlexBox>
        </Col>
      </FlexBox>
    </FlexBox>
  );
};

export default BlogDetails;
