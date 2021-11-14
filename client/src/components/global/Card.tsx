import { HTMLAttributes, ImgHTMLAttributes, RefObject } from "react";

type TAlign = "text-left" | "text-center" | "text-right";
type TShadow = "shadow-sm" | "shadow" | "shadow-lg";

interface IProps<Type = HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  style?: HTMLAttributes<Type>["style"];
  setRef?: RefObject<Type>;
  id?: string;
}

interface ICard extends IProps {
  className?: string;
  textAlign?: TAlign;
  shadow?: TShadow;
}
export const Card = ({
  setRef,
  className = "",
  textAlign = "text-left",
  shadow = "shadow-sm",
  children,
  ...res
}: ICard) => {
  return (
    <div
      className={`card border-0 ${textAlign} ${shadow} ${className}`}
      ref={setRef}
      {...res}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }: IProps) => (
  <div className={`card-header bg-white p-3 p-xl-4 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = "", style }: IProps) => (
  <div className={`card-body p-xl-4 ${className}`} style={style}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = "" }: IProps) => (
  <div className={`card-footer p-3 p-xl-4 bg-white ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = "" }: IProps) => (
  <h5 className={`card-title text-capitalize ${className}`}>{children}</h5>
);

interface IImage {
  bottom?: boolean;
  children?: React.ReactNode;
  overlay?: boolean;
  horizantal?: boolean;
  url: string;
}

export const CardImage = ({
  url,
  overlay = false,
  alt,
  children,
  bottom,
  horizantal,
  className = "",
  ...props
}: IImage & ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <>
      {horizantal ? (
        <img
          src={url}
          alt={alt}
          className={`img-fluid rounded-start ${className}`}
          {...props}
        />
      ) : (
        <img
          src={url}
          alt={alt}
          className={
            (bottom ? "card-img-bottom " : "card-img-top ") + className
          }
          {...props}
        />
      )}
      {overlay && <div className="card-img-overlay">{children}</div>}
    </>
  );
};

export const CardListGroup = ({ children }: IProps) => (
  <ul className="list-group list-group-flush">{children}</ul>
);

interface IListItem extends IProps {
  first?: boolean;
  last?: boolean;
}
export const CardListItem = ({
  first = false,
  last = false,
  children,
}: IListItem) => {
  const padding = first ? "pb-3 pt-0" : last ? "pb-0 pt-3" : "py-3";
  return <li className={`list-group-item ${padding}`}>{children}</li>;
};
