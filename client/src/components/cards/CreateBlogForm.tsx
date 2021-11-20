import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/storeHooks";
import { GET_BLOG } from "../../redux/types/blogType";
import { IBlog, InputChange, ITag } from "../../utils/TypeScript";
import { shallowEqaulity } from "../../utils/Valid";
import BlogPrivacy from "../form-elements/BlogPrivacy";
import TagInputBox from "../form-elements/TagInputBox";
import { Card, CardBody, CardHeader } from "../global/Card";
import FlexBox, { Col } from "../global/FlexBox";

interface IProps {
  blog: IBlog;
  setBlog: (blog: IBlog) => void;
  initialBlog: IBlog;
}

const CreateBlogForm = ({ blog, setBlog, initialBlog }: IProps) => {
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
      shallowEqaulity(newBlog, initialBlog) &&
      currentBlog._id &&
      currentBlog._id === "drafted_blog"
    ) {
      dispatch({ type: GET_BLOG, payload: { ...newBlog, _id: "" } });
    } else if (
      !currentBlog._id ||
      (currentBlog._id && currentBlog._id !== "drafted_blog")
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
    <Card className="mb-2 mb-lg-4">
      <CardHeader>
        <h5 className="m-0">Blog information</h5>
      </CardHeader>
      <CardBody>
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

        <FlexBox row>
          <Col md="4">
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
          </Col>

          <Col md="4">
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
                <option value="" disabled>
                  Select Category
                </option>
                {categoriesName.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </Col>
          <Col md="4">
            <div className="mb-3">
              <label htmlFor="ReadingTime" className="form-label">
                Reading Time
              </label>
              <select
                name="readingTime"
                id="ReadingTime"
                className="form-control"
                value={blog.readingTime || 5}
                onChange={handleChangeInput}
              >
                {[
                  { label: "Under 3 minuts", value: 3 },
                  { label: "3-5 minuts", value: 5 },
                  { label: "5-10 minuts", value: 10 },
                  { label: "Over 10 minuts", value: 15 },
                ].map((item) => (
                  <option key={item.label} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </Col>
        </FlexBox>
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
      </CardBody>
    </Card>
  );
};

export default CreateBlogForm;
