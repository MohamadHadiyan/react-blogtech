import React from "react";
import { BlogPrivacyType } from "../../utils/TypeScript";
import FlexBox, { Col } from "../global/FlexBox";
import { LockIcon, OpenBookIcon } from "../global/Icons";

interface IProps {
  privacy: BlogPrivacyType;
  callbackValue: (privacy: BlogPrivacyType) => void;
}

const BlogPrivacy = ({ privacy, callbackValue }: IProps) => {
  return (
    <div className="mb-3 rounded border p-3">
      <h6>Privacy</h6>
      <FlexBox row>
        <Col md="6">
          <FlexBox items="center" className="form-check">
            <Col>
              <input
                type="radio"
                name="privacy"
                id="public_blog"
                checked={privacy === "public"}
                className="form-check-input"
                onChange={() => callbackValue("public")}
              />
            </Col>
            <Col>
              <label
                htmlFor="public_blog"
                className="ps-2 d-flex align-items-center cursor-pointer"
              >
                <OpenBookIcon
                  fill
                  size="2x"
                  color={privacy === "public" ? "purple" : "secondary"}
                />
                <div className="ps-2">
                  <div className="fw-semi-bold">Public</div>
                  <p className="text-secondary small m-0 ">
                    Anyone on the internet can see this blog.
                  </p>
                </div>
              </label>
            </Col>
          </FlexBox>
        </Col>
        <Col md="6">
          <FlexBox items="center" className="form-check mt-3 mt-md-0">
            <Col>
              <input
                type="radio"
                name="privacy"
                id="private_blog"
                className="form-check-input"
                checked={privacy === "private" || privacy === "draft"}
                onChange={() => callbackValue("private")}
              />
            </Col>
            <Col>
              <label
                htmlFor="private_blog"
                className="ps-2 d-flex align-items-center cursor-pointer"
              >
                <LockIcon
                  size="2x"
                  fill
                  color={privacy === "private" ? "purple" : "secondary"}
                />
                <div className="ps-2">
                  <div className="fw-semi-bold">Private</div>
                  <p className="text-secondary small m-0">
                    You choose how can see this blog.
                  </p>
                </div>
              </label>
            </Col>
          </FlexBox>
        </Col>
      </FlexBox>
    </div>
  );
};

export default BlogPrivacy;
