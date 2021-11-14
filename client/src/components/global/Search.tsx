import React, { useEffect, useRef, useState } from "react";
import { getAPI } from "../../utils/FetchData";
import { FormSubmit } from "../../utils/TypeScript";
import ActiveLink from "./ActiveLink";
import Button from "./Button";

interface IBlog {
  title: string;
  _id: string;
}

interface IProps {
  handleRoute: (path: string) => void;
}

const Search = ({ handleRoute }: IProps) => {
  const [search, setSearch] = useState("");
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [show, setShow] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!search) return;
      try {
        const res = await getAPI(`search/blogs?title=${search}`);
        setBlogs(res.data);
        setShow(true);
      } catch (err: any) {}
    }, 100);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    if (!blogs.length) return;

    const toggle = (e: MouseEvent) => {
      if (e.target !== inputRef.current) {
        setShow(false);
      }
    };

    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, [blogs.length]);

  const getMatchString = (str: string, search: string) => {
    const index = str.toLowerCase().indexOf(search.toLowerCase());

    return index !== -1
      ? [
          str.slice(0, index),
          str.slice(index, index + search.length),
          str.slice(index + search.length),
        ]
      : [str];
  };

  const toNode = (arr: string[]) => (
    <>
      {arr[0]}
      {arr[1] && <b>{arr[1]}</b>}
      {arr[2]}
    </>
  );

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault();
    if (!search) return;
    handleRoute(`/results?search_query=${search}`);
  };

  return (
    <div className="position-relative w-100">
      <form
        className="input-group m-auto"
        onSubmit={handleSubmit}
        style={{ maxWidth: "800px" }}
      >
        <input
          ref={inputRef}
          tabIndex={-1}
          autoComplete="false"
          type="search"
          className="form-control shadow-sm"
          placeholder="Search"
          value={search}
          onFocus={() => setShow(true)}
          style={{ background: "#e3dbf13d" }}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          tabIndex={-1}
          type="submit"
          style={{ background: "#e3dbf13d" }}
          className="border shadow-sm"
        >
          <i className="fas fa-search" />
        </Button>
        {search && show && (
          <div
            className="position-absolute list-group z-index-99 w-100 shadow-lg"
            style={{ top: "42px" }}
          >
            {!!blogs.length &&
              blogs.map((blog) => (
                <ActiveLink
                  tabIndex={0}
                  onClick={() => handleRoute(`/blog/${blog._id}`)}
                  key={blog._id}
                  color="link"
                  className="list-group-item list-group-item-action"
                >
                  {toNode(getMatchString(blog.title, search))}
                </ActiveLink>
              ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default Search;
