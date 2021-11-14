import React from "react";
import { Link } from "react-router-dom";
import FlexBox, { Col } from "../global/FlexBox";

interface IProps {
  className?: string;
}
const SocialMedia = ({ className = "" }: IProps) => {
  return (
    <aside className={className}>
      <FlexBox row className="g-2">
        <Col col="4">
          <Link
            to={``}
            className="bg-facebook rounded text-center text-white-force p-3 d-block"
          >
            <i className="fab fa-facebook-square fs-5 mb-2"></i>
            <h6 className="m-0">1.5k</h6>
            <span className="small">Fans</span>
          </Link>
        </Col>
        <Col col="4">
          <Link
            to={``}
            className="bg-instagram-gradient rounded text-center text-white-force py-3 d-block"
          >
            <i className="fab fa-instagram fs-5 mb-2"></i>
            <h6 className="m-0">1.8M</h6>
            <span className="small">Followers</span>
          </Link>
        </Col>
        <Col col="4">
          <Link
            to={``}
            className="bg-youtube rounded text-center text-white-force p-3 d-block"
          >
            <i className="fab fa-youtube-square fs-5 mb-2"></i>
            <h6 className="m-0">22k</h6>
            <span className="small">Subs</span>
          </Link>
        </Col>
      </FlexBox>
    </aside>
  );
};

export default SocialMedia;
