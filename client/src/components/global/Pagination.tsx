import React from "react";

interface IPropsPaginate {
  count: number;
  handler: (num: number) => void;
  className?: string;
  page: number;
}
const Pagination = ({
  className = "",
  count,
  handler,
  page,
}: IPropsPaginate) => {
  const pagesArr = [...Array(count)].map((_, i) => i + 1);
  const handlePagination = (num: number) => {
    handler(num);
  };

  return (
    <nav
      className={`d-flex justify-content-between ${className}`}
      aria-label="Page navigation"
    >
      <PrevPage page={page} count={count} handler={handlePagination} />
      <PageNumItem
        pagesArr={pagesArr}
        page={page}
        count={count}
        handler={handlePagination}
      />
      <NextPage page={page} count={count} handler={handlePagination} />
    </nav>
  );
};

interface IProps {
  page: number;
  count: number;
  handler: (num: number) => void;
}

const PrevPage = ({ page, handler }: IProps) => {
  return (
    <ul className="pagination mb-0">
      <li className="page-item">
        <span
          className="page-link text-secondary"
          aria-label="Previous"
          onClick={
            page > 1 ? () => handler(page > 1 ? page - 1 : page) : undefined
          }
        >
          <i className="fas fa-chevron-left me-2" />
          Prev
        </span>
      </li>
    </ul>
  );
};

const NextPage = ({ page, count, handler }: IProps) => {
  return (
    <ul className="pagination mb-0">
      <li className="page-item">
        <span
          className="page-link text-secondary"
          aria-label="Next"
          onClick={
            page < count
              ? () => handler(page < count ? page + 1 : page)
              : undefined
          }
        >
          Next
          <i className="fas fa-chevron-right ms-2" />
        </span>
      </li>
    </ul>
  );
};

interface IpageNumItem extends IProps {
  pagesArr: number[];
}
const PageNumItem = ({ pagesArr, page, count, handler }: IpageNumItem) => {
  const isActive = (num: number) => (num === page ? "active" : "");

  return (
    <ul className="pagination mb-0">
      <li className="page-item d-sm-none">
        <span className="page-link page-link-static border-0 text-secondary rounded">
          {page} / {pagesArr.length}
        </span>
      </li>
      {pagesArr.map((pageNum) =>
        isActive(pageNum) ? (
          <NumItem
            pageNum={pageNum}
            isActive={isActive}
            handler={handler}
            key={pageNum}
          >
            {pageNum}
            <span className="visually-hidden">(current)</span>
          </NumItem>
        ) : pageNum < page - 2 && pageNum > 1 ? (
          ""
        ) : (pageNum === page + 2 && pageNum + 1 < count) ||
          (pageNum === page - 2 && pageNum - 1 > 0) ? (
          <NumItem pageNum={pageNum} key={pageNum}>
            {"..."}
          </NumItem>
        ) : pageNum > page + 2 && pageNum < count ? (
          ""
        ) : (
          <NumItem pageNum={pageNum} handler={handler} key={pageNum}>
            {pageNum}
          </NumItem>
        )
      )}
    </ul>
  );
};

interface INumItem {
  pageNum: number;
  handler?: (num: number) => void;
  isActive?: (num: number) => string;
  children: React.ReactNode;
}
const NumItem = ({ pageNum, handler, isActive, children }: INumItem) => {
  return (
    <li
      className={`page-item d-none ${
        isActive ? isActive(pageNum) : ""
      } d-sm-block mx-1`}
      aria-current={isActive ? "page" : undefined}
    >
      <span
        className={`page-link rounded ${isActive ? "" : "text-secondary"}`}
        onClick={handler ? () => handler(pageNum) : undefined}
      >
        {children}
      </span>
    </li>
  );
};

export default Pagination;
