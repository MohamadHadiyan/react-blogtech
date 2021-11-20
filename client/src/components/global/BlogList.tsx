import React, { useState } from "react";
import { useHistory } from "react-router";
import { IBlog } from "../../utils/TypeScript";
import PostCard from "../cards/PostCard";
import Filters from "./Filters";
import FlexBox, { Col } from "./FlexBox";
import Pagination from "./Pagination";

interface IBlogList {
  blogs: IBlog[];
  count: number;
  searchPage: number;
}

const BlogList = ({ blogs, count, searchPage }: IBlogList) => {
  const history = useHistory();
  const search = history.location.search;
  const [limit, setLimit] = useState(6);
  const [filteredBlogs, setFilteredBlogs] = useState<IBlog[]>([]);

  const handlePagination = (num: number) => {
    const searchParam =
      search.includes("?") && !search.includes("page=")
        ? `${search}&page=${num}`
        : search.includes("?")
        ? `${search.replace(/page=\d+/, `page=${num}`)}`
        : `?page=${num}`;
    history.push(searchParam);
  };

  const handleLimit = (num: number) => {
    const passed = searchPage * limit;
    const remind = count - passed;
    if (remind < count) {
      setLimit(num);
      if (search.indexOf("limit") === -1) {
        history.push(search + `&limit=${num}`);
      } else {
        history.push(search.replace(/limit=\d+/, `limit=${num}`));
      }
    }
  };

  const currentBlogs = filteredBlogs.length ? filteredBlogs : blogs;

  return (
    <div className="pt-lg-4">
      {count > 1 && (
        <Filters
          callbackFilter={(blogs) => setFilteredBlogs(blogs)}
          blogs={blogs}
        />
      )}
      <FlexBox row className="g-2 g-md-4 mb-4">
        {currentBlogs.map((blog) => (
          <Col lg="4" md="6" col="12" key={blog._id}>
            <PostCard post={blog} />
          </Col>
        ))}
      </FlexBox>
      {count > limit && (
        <>
          <hr />
          <div className="d-lg-flex justify-content-between align-itemscenter pt-md-3">
            <LimitPage handler={handleLimit} />
            <Pagination
              page={searchPage}
              count={
                count % limit === 0
                  ? count / limit
                  : Math.floor(count / limit) + 1
              }
              handler={handlePagination}
            />
          </div>
        </>
      )}
    </div>
  );
};

interface ILimit {
  handler: (num: number) => void;
}
const LimitPage = ({ handler }: ILimit) => {
  return (
    <FlexBox justify="center" items="center" className="mb-3 text-secondary">
      <label className="me-2 pe-1">Show</label>
      <select
        defaultValue="6"
        className="form-select me-2 flex-grow-1 flex-sm-grow-0 "
        style={{ width: "5rem" }}
        onChange={(e) => handler(+e.target.value)}
      >
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="6">6</option>
        <option value="9">9</option>
        <option value="12">12</option>
      </select>
      <div className="fs-sm text-nowrap ps-1 mb-1">posts per page</div>
    </FlexBox>
  );
};

export default BlogList;
