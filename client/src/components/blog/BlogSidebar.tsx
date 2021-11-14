import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useAppSelector } from "../../hooks/storeHooks";
import {
  updateBlogLikes,
  updateBlogViews,
} from "../../redux/actions/blogAction";
import { UPDATE_ALL_BLOGS } from "../../redux/types/blogType";
import { IBlog } from "../../utils/TypeScript";
import ActiveLink from "../global/ActiveLink";
import Avatar from "../global/Avatar";
import Button from "../global/Button";
import FlexBox from "../global/FlexBox";
import { CommentIcon, ThumbsUpIcon } from "../global/Icons";
import RecentBlog from "../sidebar/RecentBlog";
const BlogSidebar = ({ blog, recent }: { blog: IBlog; recent: IBlog[] }) => {
  const { auth } = useAppSelector((state) => state);
  const [views, setViews] = useState(blog.views || 0);
  const [likes, setLikes] = useState<string[]>(blog.likes || []);
  const [liked, setLiked] = useState(false);
  const [viewed, setViewed] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const updateViews = useCallback(
    (newViews: number) => {
      const payload = { ...blog, views: newViews };
      dispatch({ type: UPDATE_ALL_BLOGS, payload });
      dispatch(updateBlogViews(newViews, blog._id as string));
    },
    [blog, dispatch]
  );

  const handleLike = () => {
    if (!auth.user || !auth.access_token) return;

    const user_id = auth.user._id;
    const token = auth.access_token;
    const blog_id = blog._id as string;

    const newLikes =
      likes.indexOf(user_id) !== -1
        ? likes.filter((item) => item !== user_id)
        : [...likes, auth.user._id];

    if (!viewed) {
      setViewed(true);
      updateViews(views + 1);
    }

    const payload = { ...blog, likes: newLikes, views: views + 1 };

    setLikes(newLikes);
    dispatch({ type: UPDATE_ALL_BLOGS, payload });
    dispatch(updateBlogLikes(newLikes, user_id, blog_id, token));
  };

  useEffect(() => {
    if (!blog.likes) return;

    if (blog.likes.length !== likes.length) {
      const payload = { ...blog, likes: blog.likes, views: blog.views };
      setLikes(blog.likes);
      dispatch({ type: UPDATE_ALL_BLOGS, payload });
    }
  }, [blog, blog.likes, dispatch, likes.length, updateViews, views]);

  useEffect(() => {
    if (!blog.views) return;

    if (blog.views !== views) {
      const payload = { ...blog, views: blog.views };
      setViews(blog.views);
      dispatch({ type: UPDATE_ALL_BLOGS, payload });
    }
  }, [blog, blog.views, dispatch, views]);

  useEffect(() => {
    const time = setTimeout(() => {
      const newViews = views + 1;
      setViews(newViews);
      setViewed(true);
      updateViews(newViews);
    }, 6e4);

    if (viewed) clearTimeout(time);

    return () => clearTimeout(time);
  }, [updateViews, viewed, views]);

  useEffect(() => {
    if (!auth.user || !auth.access_token) return;
    
    if (likes.indexOf(auth.user._id) !== -1) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [auth.access_token, auth.user, likes]);

  return (
    <div
      className="position-sticky top-0 d-flex flex-column end"
      style={{ height: "81vh" }}
    >
      <RecentBlog blogs={recent} title="Trending posts" />
      <div className="p-3 shadow-sm bg-light rounded">
        <FlexBox justify="center" items="center" column>
          {typeof blog.user !== "string" && (
            <div className="border-bottom pb-3 mb-2 w-100 text-center position-relative">
              <Avatar border src={blog.user.avatar} size="3x" />
              <ActiveLink
                to={`/profile/${blog.user._id}`}
                className="text-link w-100"
              >
                <h4>{blog.user.name}</h4>
                <p>{blog.user.heading}</p>
              </ActiveLink>
              <FlexBox items="center" justify="around" className="w-100">
                <div>205 Folowers</div>
                <Button color="purple">Follow</Button>
              </FlexBox>
            </div>
          )}
          <FlexBox justify="between" className="w-100">
            <Button
              border
              onClick={handleLike}
              className="me-lg-2"
              title="I liked this"
            >
              {liked ? "Liked" : "Like"}
              <ThumbsUpIcon
                fill={liked}
                color={liked ? "danger" : "dark"}
                size="lg"
                className="ms-2"
              />
            </Button>
            <Button border onClick={() => history.push("#comments")}>
              Comment
              <CommentIcon className="ms-2" size="lg" />
            </Button>
          </FlexBox>
        </FlexBox>
      </div>
    </div>
  );
};

export default BlogSidebar;
