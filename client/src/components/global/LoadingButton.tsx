import React from "react";
import Loading from "../alert/Loading";
import Button, { ButtonType } from "./Button";

type WidthType = {
  before: number;
  after: number;
};

interface IProps {
  loading: boolean;
  show: boolean;
  beforeChild: React.ReactNode;
  affterChild: React.ReactNode;
  width: WidthType;
}
const LoadingButton = ({
  loading,
  show,
  beforeChild,
  affterChild,
  className = "",
  color,
  width,
  ...res
}: IProps & ButtonType) => {
  return (
    <Button
      className={`position-relative ${
        loading ? "d-flex justify-content-end align-items-center" : ""
      } ${className}`}
      {...res}
      color={color}
      disabled={loading}
      style={
        loading
          ? { width: show ? `${width.after}px` : `${width.before}px` }
          : {}
      }
    >
      {loading && (
        <Loading
          position="absolute"
          size={30}
          stroke={color ? "#fff" : "#333"}
          boxStyle={{ justifyContent: "flex-start", marginLeft: "5px" }}
        />
      )}
      {show ? affterChild : beforeChild}
    </Button>
  );
};

export default LoadingButton;
