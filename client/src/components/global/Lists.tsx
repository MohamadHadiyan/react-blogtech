import React from "react";

export const InlineList = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className={`list-inline ${className}`} {...props} />
);

export const InlineListItem = ({
  className = "",
  ...props
}: React.LiHTMLAttributes<HTMLLIElement>) => (
  <li className={`list-inline-item ${className}`} {...props} />
);
