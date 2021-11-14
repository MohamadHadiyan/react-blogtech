import React from "react";
import { TColor } from "../../utils/TypeScript";

type TSize = "xs" | "sm" | "lg" | "2x" | "3x" | "5x" | "7x" | "10x";

interface IProps {
  fill?: boolean;
  color?: TColor;
  size?: TSize;
  className?:string;
}

export const CalenderIcon = () => <i className="far fa-calendar-alt" />;

export const ViewIcon = ({ fill, color, size,className="" }: IProps) => (
  <i
    className={`${fill ? "fas" : "far"} fa-eye${
      color ? " text-" + color : ""
    }${size ? " fa-" + size : ""} ${className}`}
  />
);

export const LikeIcon = ({ fill, color, size,className="" }: IProps) => (
  <i
    className={`${fill ? "fas" : "far"} fa-heart${
      color ? " text-" + color : ""
    }${size ? " fa-" + size : ""} ${className}`}
  />
);

export const CommentIcon = ({ fill, color, size ,className=""}: IProps) => (
  <i
    className={`${fill ? "fas" : "far"} fa-comment${
      color ? " text-" + color : ""
    }${size ? " fa-" + size : ""} ${className}`}
  />
);

export const ThumbsUpIcon = ({ fill, color, size ,className=""}: IProps) => (
  <i
    className={`${fill ? "fas" : "far"} fa-thumbs-up${
      color ? " text-" + color : ""
    }${size ? " fa-" + size : ""} ${className}`}
  />
);

export const ThumbsDownIcon = ({ fill, color, size ,className=""}: IProps) => (
  <i
    className={`${fill ? "fas" : "far"} fa-thumbs-down${
      color ? " text-" + color : ""
    }${size ? " fa-" + size : ""} ${className}`}
  />
);

export const ShareIcon = ({ fill, color, size ,className=""}: IProps) => (
  <i
    className={`${fill ? "fas" : "far"} fa-share-square${
      color ? " text-" + color : ""
    }${size ? " fa-" + size : ""} ${className}`}
  />
);

export const BookMarkIcon = ({ fill, color, size ,className=""}: IProps) => (
  <i
    className={`${fill ? "fas" : "far"} fa-bookmark${
      color ? " text-" + color : ""
    }${size ? " fa-" + size : ""} ${className}`}
  />
);
export const LockIcon = ({ fill, color, size ,className=""}: IProps) => (
  <i
    className={`${fill ? "fas" : "far"} fa-lock${
      color ? " text-" + color : ""
    }${size ? " fa-" + size : ""} ${className}`}
  />
);
export const UnLockIcon = ({ fill, color, size ,className=""}: IProps) => (
  <i
    className={`${fill ? "fas" : "far"} fa-unlock${
      color ? " text-" + color : ""
    }${size ? " fa-" + size : ""} ${className}`}
  />
);

export const OpenBookIcon = ({ fill, color, size ,className=""}: IProps) => (
  <i
    className={`${fill ? "fas" : "far"} fa-book-open${
      color ? " text-" + color : ""
    }${size ? " fa-" + size : ""} ${className}`}
  />
);

export const PencilIcon = ({ fill, color, size ,className=""}: IProps) => (
  <i
    className={`${fill ? "fas" : "far"} fa-pencil-alt${
      color ? " text-" + color : ""
    }${size ? " fa-" + size : ""} ${className}`}
  />
);

export const BellIcon = ({ fill, color, size ,className=""}: IProps) => (
  <i
    className={`${fill ? "fas" : "far"} fa-bell${
      color ? " text-" + color : ""
    }${size ? " fa-" + size : ""} ${className}`}
  />
);

export const ConfigIcon = ({ fill, color, size ,className=""}: IProps) => (
  <i
    className={`${fill ? "fas" : "far"} fa-cog${
      color ? " text-" + color : ""
    }${size ? " fa-" + size : ""} ${className}`}
  />
);
