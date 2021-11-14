import React, { HTMLAttributes } from "react";

type TJustifyType =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";
type TAlignType = "start" | "center" | "end";

interface IProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: HTMLAttributes<HTMLDivElement>["style"];
  justify?: TJustifyType;
  items?: TAlignType;
  column?: boolean;
  wrap?: boolean;
  row?: boolean;
}

const FlexBox = ({
  children,
  className = "",
  id = "",
  style,
  justify,
  items,
  column = false,
  wrap = false,
  row = false,
}: IProps) => {
  return (
    <div
      className={`${row ? "row" : "d-flex"}${
        justify ? " justify-content-" + justify : ""
      }${items ? " align-items-" + items : ""}${column ? " flex-column" : ""}${
        wrap ? " flex-wrap" : ""
      } ${className}`.trim()}
      id={id}
      style={style}
    >
      {children}
    </div>
  );
};

type TCol =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "auto";

interface ICol {
  xl?: TCol;
  lg?: TCol;
  md?: TCol;
  sm?: TCol;
  col?: TCol;
  children: React.ReactNode;
}
export const Col = ({
  xl,
  lg,
  md,
  col,
  sm,
  children,
  className = "",
  ...props
}: ICol & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`${xl ? "col-xl-" + xl : ""}${lg ? " col-lg-" + lg : ""}${
        md ? " col-md-" + md : ""
      }${sm ? " col-sm-" + sm : ""}${
        col ? " col-" + col : ""
      } ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};

export default FlexBox;
