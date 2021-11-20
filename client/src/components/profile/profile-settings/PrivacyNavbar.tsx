import React, { useState } from "react";
import { BlogPrivacyType } from "../../../utils/TypeScript";
import FlexBox, { Col } from "../../global/FlexBox";

type PrivacyType = BlogPrivacyType | "all";
interface IProps {
  callbackValue: (tab: PrivacyType) => void;
}
const PrivacyNavbar = ({ callbackValue }: IProps) => {
  const [tab, setTab] = useState<PrivacyType>("all");

  const handleTabs = (value: PrivacyType) => {
    setTab(value);
    callbackValue(value);
  };

  return (
    <FlexBox row className="gx-0">
      <Col
        tabIndex={0}
        onClick={() => handleTabs("all")}
        sm="3"
        className={`border-bottom-2 py-2 py-lg-3 text-center fw-semi-bold cursor-pointer ${
          tab === "all" ? "active" : "text-secondary"
        }`}
      >
        All Blogs
      </Col>
      <Col
        tabIndex={0}
        onClick={() => handleTabs("public")}
        sm="3"
        className={`border-bottom-2 py-2 py-lg-3 text-center fw-semi-bold cursor-pointer ${
          tab === "public" ? "active" : "text-secondary"
        }`}
      >
        Public Blogs
      </Col>
      <Col
        tabIndex={0}
        onClick={() => handleTabs("private")}
        sm="3"
        className={`border-bottom-2 py-2 py-lg-3 text-center fw-semi-bold cursor-pointer ${
          tab === "private" ? "active" : "text-secondary"
        }`}
      >
        Private Blogs
      </Col>
      <Col
        tabIndex={0}
        onClick={() => handleTabs("draft")}
        sm="3"
        className={`border-bottom-2 py-2 py-lg-3 text-center fw-semi-bold cursor-pointer ${
          tab === "draft" ? "active" : "text-secondary"
        }`}
      >
        Draft Blogs
      </Col>
    </FlexBox>
  );
};

export default PrivacyNavbar;
