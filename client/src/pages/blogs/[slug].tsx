import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "../../components/alert/Loading";
import BlogList from "../../components/global/BlogList";
import { useAppSelector } from "../../hooks/storeHooks";
import { useSearchParam } from "../../hooks/useSearchParam";
import { getBlogsByCategory } from "../../redux/actions/categoryAction";
import { IBlog, IParams } from "../../utils/TypeScript";

const BlogsByCategory = () => {
  const { slug } = useParams<IParams>();
  const { categories } = useAppSelector((state) => state);

  const [categoryId, setCategoryId] = useState("");
  const [blogs, setBlogs] = useState<IBlog[]>();
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const { value, currentSearch } = useSearchParam("page", "1", /page=\d+/);

  const dispatch = useDispatch();

  useEffect(() => {
    const category = categories.names.find((item) => item.name === slug);
    if (!category) return;

    setCategoryId(category._id);
  }, [categories, slug]);

  useEffect(() => {
    if (!categoryId) return;

    const data = categories.categoryBlogs.find(
      (item) => item.id === categoryId
    );

    if (data && data.search === currentSearch) {
      setBlogs(data.blogs);
      setCount(data.count);
      setLoading(false);
    } else {
      dispatch(getBlogsByCategory(categoryId, currentSearch));
    }
  }, [categories.categoryBlogs, categoryId, currentSearch, dispatch]);

  if (!blogs) return <div />;

  return (
    <div className="mt-2">
      {loading && <Loading color="light-soft"/>}
      <BlogList blogs={blogs} count={count} searchPage={Number(value)} />
    </div>
  );
};

export default BlogsByCategory;
