import React, { useState } from "react";
import { IBlog } from "../../utils/TypeScript";
import ActiveLink from "../global/ActiveLink";
import Button from "../global/Button";
import FlexBox, { Col } from "../global/FlexBox";
import Tooltip from "../global/Tooltip";

interface IOther {
  nextPost: IBlog;
  prevPost: IBlog;
  userId?: string;
}
const OtherBlogsSection = ({ nextPost, prevPost, userId }: IOther) => {
  const [showNextTooltip, setShowNextTooltip] = useState(false);
  const [showPrevTooltip, setShowPrevTooltip] = useState(false);

  return (
    <FlexBox row justify="center" className="mb-4">
      <Col lg="10">
        <div
          className="w-100 h-auto btn-group position-relative"
        >
          <Button
            outline
            color="purple"
            onMouseEnter={() => setShowPrevTooltip(true)}
            onMouseLeave={() => setShowPrevTooltip(false)}
            className="p-md-2 p-lg-3"
          >
            <ActiveLink
              to={`/blog/${prevPost._id}`}
              className="text-reset stretched-link"
            >
              Prev Post
            </ActiveLink>
            <Tooltip
              isOpen={showPrevTooltip}
              position="start"
              style={{ bottom: "60px", width: "300px" }}
            >
              <BlogTooltip
                to={prevPost._id as string}
                title={prevPost.title}
                thumbnail={prevPost.thumbnail as string}
              />
            </Tooltip>
          </Button>
          {userId && (
            <Button outline color="purple">
              <ActiveLink
                to={`/profile/${userId}?tab=blogs`}
                className="text-reset stretched-link"
              >
                My Other Posts
              </ActiveLink>
            </Button>
          )}
          <Button
            outline
            color="purple"
            onMouseEnter={() => setShowNextTooltip(true)}
            onMouseLeave={() => setShowNextTooltip(false)}
          >
            <ActiveLink
              to={`/blog/${nextPost._id}`}
              className="text-reset stretched-link"
            >
              Next Post
            </ActiveLink>
            <Tooltip
              isOpen={showNextTooltip}
              style={{ bottom: "60px", width: "300px" }}
            >
              <BlogTooltip
                to={nextPost._id as string}
                title={nextPost.title}
                thumbnail={nextPost.thumbnail as string}
              />
            </Tooltip>
          </Button>
        </div>
      </Col>
    </FlexBox>
  );
};

const BlogTooltip = ({
  thumbnail,
  title,
  to,
}: {
  thumbnail?: string;
  title: string;
  to: string;
}) => {
  return (
    <FlexBox row>
      <Col md="4">
        {thumbnail && (
          <img
            src={thumbnail}
            className="w-100 h-100 rounded"
            alt="..."
            style={{ objectFit: "cover" }}
          />
        )}
      </Col>
      <Col md="8">
        <div className="p-2 fw-normal small">
          <ActiveLink to={`/blog/${to}`} color="link">
            {title.length > 60
              ? title.slice(0, 57).replace(/\s/g, " ") + "..."
              : title.replace(/\s/g, " ")}
          </ActiveLink>
        </div>
      </Col>
    </FlexBox>
  );
};

export default OtherBlogsSection;
