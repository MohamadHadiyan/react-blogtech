import React from "react";
import { Link } from "react-router-dom";
import Button from "../global/Button";

interface IProps {
  handleSetCookie: () => void;
  isOpen: boolean;
  handleClose: () => void;
}
const AlertCookie = ({ handleSetCookie, isOpen, handleClose }: IProps) => {
  return isOpen ? (
    <div
      className={`position-fixed bottom-0 start-0 mx-3 mx-lg-4 mb-2 mb-lg-4 shadow`}
      style={{ zIndex: 100, maxWidth: "400px" }}
    >
      <div className="p-3 p-lg-4 bg-purple-light rounded">
        <p className=" mb-4">
          We use cookies to ensure that we give you the best experience on our
          website. If you continue to use this site we will assume that you are
          happy with it. 
          <Link
            to={``}
            className="text-decoration-none fw-semi-bold btn-link text-link"
          >
            {" "}Privacy Policy
          </Link>
          .
        </p>
        <div>
          <Button
            color="success-soft"
            className="me-2"
            onClick={handleSetCookie}
          >
            Accept
          </Button>
          <Button color="danger-soft" onClick={handleClose}>
            Decline
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default AlertCookie;
