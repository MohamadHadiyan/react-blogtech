import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import DisplayBlog from "../../components/blog/DisplayBlog";
import FlexBox from "../../components/global/FlexBox";
import JetSvg from "../../components/svg/Jet";
import { useAppSelector } from "../../hooks/storeHooks";
import { getBlog } from "../../redux/actions/blogAction";
import { IBlog, IParams } from "../../utils/TypeScript";

const BlogSingle = () => {
  const id = useParams<IParams>().slug;
  const { homeBlogs, currentBlog, socket, auth, alert } = useAppSelector(
    (state) => state
  );
  const [blog, setBlog] = useState<IBlog>();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (blog || alert.errors) setLoading(false);
  }, [alert.errors, blog]);

  useEffect(() => {
    if (!id) return;

    if (currentBlog._id && currentBlog._id === id) {
      setBlog(currentBlog);
    } else if (auth.access_token) {
      setLoading(true);
      dispatch(getBlog(id, auth.access_token));
    } else {
      setLoading(true);
      dispatch(getBlog(id));
    }

    return () => setBlog(undefined);
  }, [auth.access_token, currentBlog, dispatch, homeBlogs, id]);

  // SOCKET.IO join & leave
  useEffect(() => {
    if (!socket || !id) return;

    socket.emit("joinRoom", id);

    return () => {
      socket.emit("leaveRoom", id);
    };
  }, [id, socket]);

  return (
    <div className="py-4 py-lg-5">
      {blog ? (
        <DisplayBlog blog={blog} />
      ) : (
        !loading && (
          <FlexBox
            items="center"
            justify="center"
            column
            className=" min-h-100vh"
          >
            <JetSvg />
            <h4>No result found</h4>
          </FlexBox>
        )
      )}
    </div>
  );
};

export default BlogSingle;
