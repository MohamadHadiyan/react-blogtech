import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/storeHooks";
import { IBlog } from "../../utils/TypeScript";
import Button from "../global/Button";
import FlexBox, { Col } from "../global/FlexBox";
import CommentSection from "./CommentSection";
import HeaderSection from "./HeaderSection";
import OtherBlogsSection from "./OtherBlogsSection";

interface IDisplayBlog {
  className?: string;
  blog: IBlog;
}

const DisplayBlog = ({ className = "", blog }: IDisplayBlog) => {
  const { homeBlogs } = useAppSelector((state) => state);
  const allBlogs = homeBlogs.allBlogs.blogs;
  const index = allBlogs.findIndex((item) => item._id === blog._id);
  const [show, setShow] = useState(false);

  const next = index + 1 < allBlogs.length ? allBlogs[index + 1] : allBlogs[0];
  const prev =
    index - 1 < 0 ? allBlogs[allBlogs.length - 1] : allBlogs[index - 1];

  const imgUrl =
    typeof blog.thumbnail === "string"
      ? blog.thumbnail
      : URL.createObjectURL(blog.thumbnail);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      let sY = window.scrollY;
      if (sY > 800) return;

      setShow(sY > 600 ? true : false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <article className={className}>
      <FlexBox row justify="center">
        <Col lg="10">
          <HeaderSection blog={blog} />

          <BlogSection center>
            <p className="text-start text-secondary">
              {blog.description.replace(/\s/g, " ")}
            </p>
            <img
              src={imgUrl}
              alt={blog.title}
              className="rounded img-fluid m-auto w-100"
            />
          </BlogSection>
          <BlogSection className="blog-content">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            <hr className="mt-2 mt-lg-5 mb-0 mb-lg-4" />
          </BlogSection>

          {typeof blog.user !== "string" && prev && next ? (
            <OtherBlogsSection
              prevPost={prev}
              nextPost={next}
              userId={blog.user._id}
            />
          ) : (
            prev &&
            next && <OtherBlogsSection prevPost={prev} nextPost={next} />
          )}

          {blog._id && typeof blog.user !== "string" && blog.comments && (
            <CommentSection blog={{ ...blog, content: "" }} />
          )}
        </Col>
      </FlexBox>
      {show && (
        <div
          className="position-fixed bottom-0 right-0 m-2 m-lg-3 shadow-lg z-999"
          style={{ width: "30px", height: "30px" }}
        >
          <Button
            color="purple"
            size="sm"
            onClick={() => window.scrollTo(0, 0)}
          >
            <i className="fas fa-chevron-up" />
          </Button>
        </div>
      )}
    </article>
  );
};

interface IProps {
  children: React.ReactNode;
  center?: boolean;
  className?: string;
}
const BlogSection = ({ children, center, className = "" }: IProps) => {
  return (
    <FlexBox row justify="center" className="mb-4">
      <Col lg="10" className={(center ? "text-center" : "") + className}>
        {children}
      </Col>
    </FlexBox>
  );
};

export default DisplayBlog;
