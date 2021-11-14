import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/storeHooks";
import { GET_BLOG } from "../../redux/types/blogType";
import { IBlog, InputChange, ITag } from "../../utils/TypeScript";
import BlogPrivacy from "../form-elements/BlogPrivacy";
import TagInputBox from "../form-elements/TagInputBox";

interface IProps {
  blog: IBlog;
  setBlog: (blog: IBlog) => void;
}

const CreateBlogForm = ({ blog, setBlog }: IProps) => {
  const { categories, currentBlog } = useAppSelector((state) => state);
  const categoriesName = categories.names.filter(
    (item) => item.name !== "draft"
  );
  const dispatch = useDispatch();
  const handleChangeInput = (e: InputChange) => {
    const { name, value } = e.target;
    const newBlog = { ...blog, [name]: value.replace(/\s/g, " ") };
    setBlog(newBlog);

    if (
      (currentBlog._id && currentBlog._id !== "drafted_blog") ||
      !currentBlog._id
    ) {
      dispatch({
        type: GET_BLOG,
        payload: { ...newBlog, _id: "drafted_blog" },
      });
    }
  };

  const handleChangeFile = (e: InputChange) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;

    if (files && files[0]) {
      const file = files[0];
      setBlog({ ...blog, thumbnail: file });
    }
  };

  return (
    <div className="card mb-3 mb-lg-4">
      <div className="card-header">
        <h5 className="card-tilte">Blog information</h5>
      </div>
      <div className="card-body">
        <div className="position-relative mb-3">
          <label htmlFor="blogTitle" className="form-label">
            Title
            <i className="far fa-question-circle text-muted ms-1 small" />
          </label>
          <input
            autoFocus
            type="text"
            name="title"
            placeholder="Title"
            aria-label="title"
            className="form-control form-control-lg"
            id="blog-title"
            value={blog.title}
            onChange={handleChangeInput}
          />
          <small
            className="position-absolute bottom-0 text-muted"
            style={{ right: "5px" }}
          >
            {blog.title.length}/100
          </small>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="mb-3">
              <label htmlFor="file_up" className="form-label">
                Image
              </label>
              <input
                type="file"
                id="file_up"
                accept="image/*"
                className="form-control"
                onChange={handleChangeFile}
              />
            </div>
          </div>

          <div className="col-sm-6">
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                name="category"
                id="category"
                className="form-control"
                value={blog.category as string}
                onChange={handleChangeInput}
              >
                <option value="">Select Category</option>
                {categoriesName.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <TagInputBox
          callbackValue={(tags) => setBlog({ ...blog, tags })}
          defaultTags={blog.tags as ITag[]}
        />

        <BlogPrivacy
          privacy={blog.privacy || "public"}
          callbackValue={(privacy) => setBlog({ ...blog, privacy })}
        />

        <div className="position-relative">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            placeholder="Description"
            className="form-control"
            style={{ resize: "none" }}
            value={blog.description}
            onChange={handleChangeInput}
          />
          <small
            className="text-muted position-absolute bottom-0"
            style={{ right: "5px" }}
          >
            {blog.description.length}/300
          </small>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogForm;
