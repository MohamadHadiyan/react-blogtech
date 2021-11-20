import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Loading from "../components/alert/Loading";
import HorizantalCard from "../components/cards/HorizantalCard";
import Filters from "../components/global/Filters";
import FlexBox from "../components/global/FlexBox";
import NotFound from "../components/global/NotFound";
import JetSvg from "../components/svg/Jet";
import { useAppSelector } from "../hooks/storeHooks";
import { useSearchParam } from "../hooks/useSearchParam";
import { ALERT } from "../redux/types/alertType";
import { getAPI } from "../utils/FetchData";
import { IBlog, ITag } from "../utils/TypeScript";

const Results = () => {
  const { tags } = useAppSelector((state) => state);
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [tag, setTag] = useState<ITag | null>(null);
  const [filteredBlogs, setFilteredBlogs] = useState<IBlog[]>([]);

  const title = useSearchParam("search_query").value;
  const tagID = useSearchParam("tag").value;
  const dispatch = useDispatch();

  const getData = useCallback(
    async (query: string) => {
      try {
        const res = await getAPI(`results?${query}`);
        setBlogs(res.data.blogs);
        setCount(res.data.count);
      } catch (err: any) {
        dispatch({
          type: ALERT,
          payload: { errors: err.response.data.msg },
        });
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (!title) return;

    getData(`title=${title}`);
  }, [getData, title]);

  useEffect(() => {
    if (!tagID) return;
    getData(`tag=${tagID}`);

    const tagName = tags.names.find((item) => item._id === tagID);
    if (tagName) setTag(tagName);
  }, [getData, tagID, tags.names]);

  if (!title && !tagID) return <NotFound />;

  const currentBlogs = filteredBlogs.length ? filteredBlogs : blogs;

  return (
    <div
      className="position-relative mt-0 mt-lg-5 m-auto"
      style={{ minHeight: "200px", maxWidth: "1000px" }}
    >
      {loading && <Loading position="absolute" />}
      {!!blogs.length && !loading && (
        <div>
          <h5>
            Result ({count}){" "}
            {tag ? <span className="text-purple">{tag.name}</span> : ""}
          </h5>
          {!!count && !loading && (
            <Filters
              callbackFilter={(blogs) => setFilteredBlogs(blogs)}
              blogs={blogs}
            />
          )}
          <FlexBox column items="center">
            {currentBlogs.map((blog) => (
              <HorizantalCard blog={blog} key={blog._id} />
            ))}
          </FlexBox>
        </div>
      )}
      {!blogs.length && !loading && (
        <FlexBox
          items="center"
          justify="center"
          column
          className=" min-h-100vh"
        >
          <JetSvg />
          <h4>No result found</h4>
          <p>Try different keywords or remove search filters</p>
        </FlexBox>
      )}
    </div>
  );
};

export default Results;
