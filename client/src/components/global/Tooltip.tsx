import React, { HTMLAttributes, useEffect, useState } from "react";
import { useRef } from "react";
import { TColor } from "../../utils/TypeScript";

type TPosition = "top" | "end" | "bottom" | "start";

interface IProps {
  color?: TColor;
  position?: TPosition;
  isOpen: boolean;
}

const Tooltip = ({
  position,
  color = "light",
  className = "",
  children,
  style,
  isOpen,
  ...props
}: IProps & HTMLAttributes<HTMLDivElement>) => {
  const [right, setRight] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);
  const text = ["light", "light", "warning"].includes(color);

  useEffect(() => {
    if (!divRef.current) return;
    const elem = divRef.current;
    const coords = elem.getBoundingClientRect();
    if (coords.left + coords.width > window.innerWidth) {
      setRight(window.innerWidth - coords.width);
    }
  }, []);

  const styles = { ...style, right: `${right}px` };

  if (isOpen)
    return (
      <div
        ref={divRef}
        className={`position-absolute rounded shadow z-index-99 ${
          position ? position + "-0" : ""
        } bg-${color} text-${text ? "dark" : "light"} ${className}`}
        style={styles}
        {...props}
      >
        {children}
      </div>
    );
  return null;
};

export default Tooltip;
