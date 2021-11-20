import React from "react";
import { useAppSelector } from "../../../hooks/storeHooks";
import SubscribeSection from "../../blog/SubscribeSection";
import { Card } from "../../global/Card";
import { Col } from "../../global/FlexBox";
import ArchiveSection from "./ArchiveSection";
import CategorySection from "./CategorySection";
import RecentBlog from "./RecentBlog";
import TagsSection from "./TagsSection";

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
      <Card className="mb-4 p-3 p-xl-4">
        <CategorySection categories={categoriesName} showTitle />
      </Card>

      <div className="position-sticky" style={{ top: "75px" }}>
        <RecentBlog blogs={recent} title="Recent Posts" />

        <Card className="mb-4 p-3 p-xl-4">
          <ArchiveSection archives={archive.dates} showTitle />
        </Card>

        <Card className="mb-4 p-3 p-xl-4">
          <TagsSection tags={tags.names} showTitle />
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
