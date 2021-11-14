import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import BlogList from "../components/global/BlogList";
import { useAppSelector } from "../hooks/storeHooks";
import { useSearchParam } from "../hooks/useSearchParam";
import { getArchiveBlogs } from "../redux/actions/archiveAction";
import { IBlog } from "../utils/TypeScript";

const Archive = () => {
  const { archive } = useAppSelector((state) => state);
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [count, setCount] = useState(1);
  const { value, currentSearch } = useSearchParam("page", "1", /page=\d+/);
  const dateSearch = useSearchParam("date").value;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentSearch) return;
    const data = archive.archiveBlogs.find((item) => item.date === dateSearch);
    const month = archive.dates.find((item) => item.createdAt === dateSearch);

    if (data && data.search === currentSearch) {
      setBlogs(data.blogs);
      if (month) setCount(month.total);
    } else {
      dispatch(getArchiveBlogs(dateSearch, currentSearch));
    }
  }, [
    archive.archiveBlogs,
    archive.dates,
    currentSearch,
    dateSearch,
    dispatch,
  ]);

  if (!blogs) return <div />;

  return (
    <div>
      <BlogList blogs={blogs} count={count} searchPage={Number(value)} />
    </div>
  );
};

export default Archive;
