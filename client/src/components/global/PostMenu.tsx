import React from "react";
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
          <i className="far fa-calendar-alt">
            <span className={show ? "show" : ""}>
              {getDate(info.createdAt)}
            </span>
          </i>
        </li>
      )}
      <li>
        <i className="far fa-eye">
          <span className={show ? "show" : ""}>{views.amount}</span>
        </i>
      </li>
      <li>
        <i className="far fa-heart">
          <span className={show ? "show" : ""}>{likes.amount}</span>
        </i>
      </li>
      <li>
        <i className="far fa-comment">
          <span className={show ? "show" : ""}>{comments.amount}</span>
        </i>
      </li>
    </ul>
  );
};

export default PostMenu;
