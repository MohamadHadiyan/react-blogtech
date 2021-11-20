import React from "react";
import { useAppSelector } from "../../hooks/storeHooks";
import { toSummarize } from "../../utils/getBlogInfo";
import { IBlog, ITag, IUserCard } from "../../utils/TypeScript";
import ActiveLink from "../global/ActiveLink";
import Author from "../global/Author";
import FlexBox, { Col } from "../global/FlexBox";
import UserFollow from "../profile/UserFollow";
import { BlogText, BlogTitle } from "./BlogComponents";
import BlogDetails from "./BlogDetails";

interface IProps {
  blog: IBlog;
}

const HeaderSection = ({ blog }: IProps) => {
  const { auth } = useAppSelector((state) => state);

  return (
    <FlexBox row justify="center">
      <Col lg="10">
        <div className="text-center mb-4 border-bottom">
          <div className="my-3">
            <BlogTitle size="lg" className="display-3">
              {blog.title.replace(/\s/g, " ")}
            </BlogTitle>
            <BlogText className="d-inline-block text-secondary">
              {blog.readingTime || 10} min read
            </BlogText>
          </div>
          {typeof blog.category !== "string" && (
            <ActiveLink
              to={`/blogs/${blog.category.name}`}
              className="mb-4 d-block"
              color="purple"
            >
              {blog.category.name}
            </ActiveLink>
          )}
          <FlexBox wrap justify="between" items="end">
            {typeof blog.user !== "string" && (
              <Author
                id={blog.user._id}
                name={blog.user.name}
                avatar={blog.user.avatar}
                size="lg"
                children={
                  <div className="text-secondary">
                    {blog.user.followers.length
                      ? toSummarize(blog.user.followers.length) + " followers"
                      : ""}
                  </div>
                }
              />
            )}
            {auth.user && (blog.user as IUserCard)._id !== auth.user._id ? (
              <UserFollow followed_id={(blog.user as IUserCard)._id} />
            ) : (
              <ActiveLink to={`/update_blog/${blog._id}`} button>
                Edit
              </ActiveLink>
            )}
          </FlexBox>
          <BlogDetails blog={blog} />
          {!!blog.tags.length && (
            <FlexBox
              justify="center"
              wrap
              className="justify-content-md-start mt-2 mb-1 pt-2 border-top"
            >
              {(blog.tags as ITag[]).map((item) => (
                <ActiveLink
                  to={`/results?tag=${item._id}`}
                  key={item._id}
                  color="purple"
                  className="p-1 px-2 border rounded shadow-sm me-2 mb-1"
                >
                  {item.name}
                </ActiveLink>
              ))}
            </FlexBox>
          )}
        </div>
      </Col>
    </FlexBox>
  );
};

export default HeaderSection;
