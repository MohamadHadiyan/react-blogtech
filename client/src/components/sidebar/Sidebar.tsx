import React from "react";
import { useAppSelector } from "../../hooks/storeHooks";
import SubscribeSection from "../blog/SubscribeSection";
import ActiveLink from "../global/ActiveLink";
import { Card } from "../global/Card";
import FlexBox, { Col } from "../global/FlexBox";
import RecentBlog from "./RecentBlog";
import SocialMedia from "./SocialMedia";

const Sidebar = () => {
  const { homeBlogs, archive, categories, tags, auth } = useAppSelector(
    (state) => state
  );
  const categoriesName = categories.names.filter(
    (item) => item.name !== "draft"
  );
  const recent = homeBlogs.allBlogs.blogs.slice(0, 4);

  const handleSubscribe = (value: string) => {};

  return (
    <Col lg="3" className="mt-5 mt-lg-0">
      <SocialMedia className="mb-4 social-media" />

      <Card className="mb-4 p-3 p-xl-4">
        <div className="pb-4">
          <h5 className={`card-title text-capitalize m-0`}>Categories</h5>
        </div>
        <div>
          {categoriesName.map(
            (cate) =>
              cate.count > 0 && (
                <ActiveLink
                  color="link"
                  to={`/blogs/${cate.name}`}
                  key={cate.name}
                >
                  <FlexBox justify="between" className="my-1">
                    <span>{cate.name}</span>
                    <span>{cate.count}</span>
                  </FlexBox>
                </ActiveLink>
              )
          )}
        </div>
      </Card>

      <div className="position-sticky" style={{ top: "75px" }}>
        <RecentBlog blogs={recent} title="Recent Posts" />

        <Card className="mb-4 p-3 p-xl-4">
          <div className="pb-4">
            <h5 className={`card-title text-capitalize m-0`}>Archive</h5>
          </div>
          <div>
            {archive.dates.map((item) => (
              <ActiveLink
                color="link"
                to={`/archive?date=${item.createdAt}`}
                key={item.monthName}
              >
                <FlexBox justify="between" className="my-1 small">
                  <span>
                    {item.monthName} {item.createdAt.slice(0, 4)}
                  </span>
                  <span>{item.total}</span>
                </FlexBox>
              </ActiveLink>
            ))}
          </div>
        </Card>

        <Card className="mb-4 p-3 p-xl-4">
          <div className="pb-4">
            <h5 className={`card-title text-capitalize m-0`}>Top Tags</h5>
          </div>
          <div>
            {tags.names.slice(0, 8).map((item) => (
              <ActiveLink
                key={item.name}
                to={`/results?tag=${item._id}`}
                className="btn border text-link btn-sm m-1"
              >
                #{item.name}
              </ActiveLink>
            ))}
          </div>
        </Card>
        {!auth.user && (
          <div className="shadow-sm p-2 bg-white rounded">
            <SubscribeSection
              formClass="flex-column"
              title="Newsletter"
              callback={handleSubscribe}
              text={`Join our newsletter and get resource, curated content, and design
          inspiration delivered straight to your inbox`}
            />
          </div>
        )}
      </div>
    </Col>
  );
};

export default Sidebar;
