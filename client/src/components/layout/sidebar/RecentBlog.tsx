import React from "react";
import getDate from "../../../utils/GetDate";
import { IBlog } from "../../../utils/TypeScript";
import ActiveLink from "../../global/ActiveLink";
import FlexBox, { Col } from "../../global/FlexBox";

interface IRecent {
  blogs: IBlog[];
  title?: string;
}
const RecentBlog = ({ blogs, title = "" }: IRecent) => {
  return (
    <div className="mb-4">
      {title && <h5>{title}</h5>}
      {blogs.map((blog) => (
        <Blog
          img={blog.thumbnail}
          title={blog.title}
          createdAt={blog.createdAt}
          key={blog._id}
          to={blog._id as string}
        />
      ))}
    </div>
  );
};

interface IProps {
  img: string | File;
  title: string;
  createdAt: string;
  to: string;
}

const Blog = ({ img, title, createdAt, to }: IProps) => {
  const date = getDate(createdAt);
  return (
    <aside className="card mb-3 border-0 shadow-sm position-relative">
      <FlexBox row className="g-3">
        <Col col="4">
          {typeof img === "string" && (
            <img
              src={img}
              alt={title.slice(0, 30)}
              className="rounded-start w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          )}
        </Col>
        <Col col="8">
          <h6 className="small">
            <ActiveLink
              to={`/blog/${to}`}
              title={title}
              color="link"
              className="cover"
            >
              {title.length > 40 ? title.slice(0, 37) + "..." : title}
            </ActiveLink>
          </h6>
          <p className="small text-secondary mt-1 m-0">
            <i className="fas fa-calender"></i>
            {date}
          </p>
        </Col>
      </FlexBox>
    </aside>
  );
};

export default RecentBlog;
