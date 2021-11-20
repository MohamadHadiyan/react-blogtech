import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/storeHooks";
import { useMedia } from "../../hooks/useMedia";
import { toSummarize } from "../../utils/getBlogInfo";
import getDate from "../../utils/GetDate";
import { IBlog, IUserCard } from "../../utils/TypeScript";
import ActiveLink from "../global/ActiveLink";
import Avatar from "../global/Avatar";
import { Card, CardBody } from "../global/Card";
import { DefaultDropDownMenu, MenuItemType } from "../global/Dropdown";
import FlexBox, { Col } from "../global/FlexBox";
import ShareLink from "../global/ShareLink";

interface ICard {
  blog: IBlog;
  className?: string;
}

const HorizantalCard = ({ blog, className = "" }: ICard) => {
  const { auth } = useAppSelector((state) => state);
  const [isDesktop, setIsDesktop] = useState(false);
  const media = useMedia("(min-width: 768px)");

  useEffect(() => {
    setIsDesktop(media);
  }, [media]);

  const imgUrl =
    typeof blog.thumbnail === "string"
      ? blog.thumbnail
      : URL.createObjectURL(blog.thumbnail);

  const description =
    blog.description.length > 100
      ? blog.description.slice(0, 100) + "..."
      : blog.description;
  const isUser =
    auth.user && auth.user._id === (blog.user as IUserCard)._id ? true : false;

  const menuItems: MenuItemType[] = [
    isUser
      ? {
          header: "Setting",
          divider: true,
          items: [
            {
              icon: <i className="fas fa-edit me-2" />,
              to: `/update_blog/${blog._id}`,
              className: "text-success",
              title: "Edit",
            },
          ],
        }
      : { items: [] },
    ...ShareLink(`https://blogtech-app.herokuapp.com/blog/${blog._id}`,true),
    isUser ? { items: [] } : { items: [{ title: "Report" }] },
  ];

  return (
    <Card
      className={`mt-2 mt-lg-3 ${className}`}
      style={isDesktop ? { maxHeight: "250px" } : {}}
    >
      <FlexBox row className="g-0">
        <Col md="4">
          <ActiveLink to={`blog/${blog._id}`} title={blog.title}>
            <img
              src={imgUrl}
              alt=""
              className={`rounded-${isDesktop ? "start" : "top"} w-100 h-100`}
              style={
                isDesktop ? { maxHeight: "250px" } : { maxHeight: "400px" }
              }
            />
          </ActiveLink>
        </Col>

        <Col md="8">
          <FlexBox>
            <CardBody className="position-relative">
              <h3 className="mb-3">
                <ActiveLink
                  stretched
                  to={`blog/${blog._id}`}
                  className="text-link"
                  title={blog.title.replace(/\s/g, " ")}
                >
                  {blog.title.length > 70
                    ? blog.title.replace(/\s/g, " ").slice(0, 67) + "..."
                    : blog.title.replace(/\s/g, " ")}
                </ActiveLink>
              </h3>

              <small className="text-muted">
                {blog.views ? toSummarize(blog.views) : "NO"} Views .{" "}
              </small>
              <small className="text-muted">
                {getDate(blog.createdAt, { fullText: true })}
              </small>

              {typeof blog.user !== "string" && (
                <div className="position-relative mt-1 mb-2">
                  <ActiveLink
                    stretched
                    to={`profile/${blog.user._id}`}
                    className="text-purple d-flex align-items-end"
                    title={blog.user.name}
                  >
                    <Avatar src={blog.user.avatar} />
                    <span className="line-height-1 ms-1">{blog.user.name}</span>
                  </ActiveLink>
                </div>
              )}

              <p className="text-secondary m-1">
                {description.replace(/\s/g, " ")}
              </p>
            </CardBody>

            <div className="p-3">
              <DefaultDropDownMenu menuItems={menuItems} />
            </div>
          </FlexBox>
        </Col>
      </FlexBox>
    </Card>
  );
};

export default HorizantalCard;
