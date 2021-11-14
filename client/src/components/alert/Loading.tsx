import { HTMLAttributes } from "react";

type TPostion = "fixed" | "absolute";
type TColor =
  | "primariy"
  | "light"
  | "dark"
  | "secondary"
  | "white"
  | "success"
  | "danger"
  | "warning"
  | "light-soft";

interface ILoading {
  position?: TPostion;
  style?: HTMLAttributes<HTMLOrSVGElement>["style"];
  color?: TColor;
  size?: number;
  stroke?: string;
  boxStyle?: HTMLAttributes<HTMLDivElement>["style"];
}

const Loading = ({
  position = "fixed",
  style,
  color,
  size,
  stroke = "",
  boxStyle,
}: ILoading) => {
  const newStyle = size
    ? { ...style, width: `${size}px`, height: `${size}px` }
    : style;

  return (
    <div
      className={`position-${position} text-center w-100 h-100 loading ${
        color ? "bg-" + color : ""
      }`}
      style={boxStyle}
    >
      <svg className="spinner" viewBox="0 0 50 50" style={newStyle}>
        <circle
          className="path"
          style={stroke ? { stroke } : {}}
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="3"
        ></circle>
      </svg>
    </div>
  );
};

export default Loading;
