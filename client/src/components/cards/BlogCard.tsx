// import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { toSummarize } from "../../utils/getBlogInfo";
import { IBlog } from "../../utils/TypeScript";
import Author from "../global/Author";
import PostMenu from "../global/PostMenu";

interface IProps {
  blog: IBlog;
}

const BlogCard = ({ blog }: IProps) => {
  const user = blog.user;
  const menuInfo = {
    views: {
      amount: blog.views ? toSummarize(blog.views) : "",
      to: "",
    },
    likes: {
      amount: blog.likes ? toSummarize(blog.likes.length) : "",
      to: "",
    },
    comments: {
      amount: blog.comments ? toSummarize(blog.comments.length) : "",
      to: "",
    },
    createdAt: blog.createdAt,
  };
  return (
    <div className="blog-card">
      <div className="wrapper-card">
        {typeof blog.thumbnail === "string" && (
          <Link to={`/bogs/${blog._id}`}>
            <img src={blog.thumbnail} alt="thumbnail" className="thumbnail" />
          </Link>
        )}
        <div className="color-overlay"></div>

        <div className="card-inner">
          <div className="header text-white">
            {typeof user !== "string" && (
              <Author name={user.name} id={user._id} avatar={user.avatar} />
            )}
            <PostMenu info={menuInfo} />
          </div>

          <div className="body">
            <div className="content">
              <h3 className="title">
                {blog.title.length > 55 ? (
                  <Link to={`/bogs/${blog._id}`} title={blog.title}>
                    {blog.title.slice(0, 52) + "..."}
                  </Link>
                ) : (
                  <Link to={`/bogs/${blog._id}`} title={blog.title}>
                    {blog.title}
                  </Link>
                )}
              </h3>
              {blog.description.length > 113 ? (
                <p className="text">{blog.description.slice(0, 110) + "..."}</p>
              ) : (
                <p className="text">{blog.description}</p>
              )}
              <div className="footer-card">
                {typeof blog.category !== "string" && (
                  <Link to={`/blogs/${blog.category.name}`} className="button">
                    {blog.category.name}
                  </Link>
                )}
                <Link to={`/bogs/${blog._id}`} className="button">
                  Read more <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
