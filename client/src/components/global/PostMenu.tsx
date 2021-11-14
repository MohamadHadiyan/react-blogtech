import React from "react";
import { Link } from "react-router-dom";
import getDate from "../../utils/GetDate";
type TOption = {
  amount: string;
  to?: string;
};

type TInfo = {
  views: TOption;
  likes: TOption;
  comments: TOption;
  createdAt?: string;
};

interface IMenuProps {
  info: TInfo;
  show?: boolean;
  className?: string;
}

const PostMenu = ({ className = "", info, show }: IMenuProps) => {
  const { views, likes, comments } = info;

  return (
    <ul className={`menu-content position-reletive ${className}`}>
      {info.createdAt && (
        <li>
          <Link
            to="#"
            className="far fa-calendar-alt text-decoration-none text-reset"
          >
            <span className={show ? "show" : ""}>
              {getDate(info.createdAt)}
            </span>
          </Link>
        </li>
      )}
      <li>
        <Link
          to={`${views.to || "#"}`}
          className="far fa-eye text-decoration-none text-reset"
        >
          <span className={show ? "show" : ""}>{views.amount}</span>
        </Link>
      </li>
      <li>
        <Link
          to={`${likes.to || "#"}`}
          className="far fa-heart text-decoration-none text-reset"
        >
          <span className={show ? "show" : ""}>{likes.amount}</span>
        </Link>
      </li>
      <li>
        <Link
          to={`${comments.to || "#comments"}`}
          className="far fa-comment text-decoration-none text-reset"
        >
          <span className={show ? "show" : ""}>{comments.amount}</span>
        </Link>
      </li>
    </ul>
  );
};

export default PostMenu;
