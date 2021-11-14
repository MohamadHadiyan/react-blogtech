import { Link } from "react-router-dom";
import { FormSubmit } from "../../utils/TypeScript";

interface IProps {
  children: React.ReactNode;
  className?: string;
}

export const Col = ({ children }: IProps) => (
  <div className="col-xl-8 col-lg-8 col-md-12 col-12 mb-2">{children}</div>
);

export const SubscribeForm = ({
  children,
  className = "",
  onSubmit,
}: IProps & { onSubmit?: (e: FormSubmit) => void }) => (
  <form className={`row ${className}`} onSubmit={onSubmit}>
    {children}
  </form>
);

type TSize = "sm" | "md" | "lg";
export const BlogTitle = ({
  children,
  className="",
  size = "md",
}: IProps & { size?: TSize }) => {
  return size === "lg" ? (
    <h1 className={`mb-4 fw-semi-bold ${className}`}>{children}</h1>
  ) : size === "sm" ? (
    <h5 className={`mb-4 fw-semi-bold ${className}`}>{children}</h5>
  ) : (
    <h3 className={`mb-4 fw-semi-bold ${className}`}>{children}</h3>
  );
};

export const BlogText = ({
  children,
  className = "",
  block = false,
}: IProps & { block?: boolean }) => {
  return block ? (
    <p className={className}>{children}</p>
  ) : (
    <span className={className}>{children}</span>
  );
};

export const BlogLink = ({
  children,
  className = "",
  to,
}: IProps & { to: string }) => (
  <Link
    to={to}
    className={`fw-semi-bold text-decoration-none ms-2 ${className}`}
  >
    {children}
  </Link>
);
