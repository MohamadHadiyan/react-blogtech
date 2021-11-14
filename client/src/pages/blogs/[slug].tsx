import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
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
    } else {
      dispatch(getBlogsByCategory(categoryId, currentSearch));
    }
  }, [categories.categoryBlogs, categoryId, currentSearch, dispatch]);

  if (!blogs) return <div />;

  return <BlogList blogs={blogs} count={count} searchPage={Number(value)} />;
};

export default BlogsByCategory;
