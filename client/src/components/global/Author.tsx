import React from "react";
import ActiveLink, { LinkColorType } from "./ActiveLink";
import Avatar, { TSize } from "./Avatar";

interface IAuthor {
  id: string;
  name: string;
  avatar: string;
  className?: string;
  children?: React.ReactNode;
  size?: TSize;
  color?: LinkColorType;
}

const Author = ({
  id,
  name,
  avatar,
  className = "",
  children,
  size,
  color = "link",
}: IAuthor) => {
  return (
    <ActiveLink
      to={`/profile/${id}`}
      className={`d-flex align-items-end ${className}`}
      color={color}
    >
      <Avatar src={avatar} size={size} />
      <div className="small ms-2 fw-semi-bold text-start ">
        <span>{name}</span>
        {children}
      </div>
    </ActiveLink>
  );
};

export default Author;
