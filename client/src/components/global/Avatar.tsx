import React, { ImgHTMLAttributes } from "react";

export type TSize = "sm" | "md" | "lg" | "xl" | "2x" | "3x";
type TRounded = "1" | "2" | "3";

interface IProps {
  src: string;
  size?: TSize;
  border?: boolean;
  rounded?: TRounded;
}

const Avatar = ({
  src,
  border,
  rounded,
  alt = "",
  size = "sm",
  className = "",
  ...props
}: IProps & ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`avatar avatar-${size}${border ? " border" : ""}${
        rounded ? " rounded-" + rounded : ""
      } ${className}`}
      {...props}
    />
  );
};

export default Avatar;
