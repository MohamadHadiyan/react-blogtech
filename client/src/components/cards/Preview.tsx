import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/storeHooks";
import { IBlog } from "../../utils/TypeScript";
import { Card } from "../global/Card";
import { HeaderCard } from "../global/CardComponets";
import { Col } from "../global/FlexBox";

interface IProps {
  blog: IBlog;
}
const Preview = ({ blog }: IProps) => {
  const { categories } = useAppSelector((state) => state);
  const category = categories.names.find(
    (item) => item._id === (blog.category as string)
  );

  return (
    <Col lg="4">
      <Card className="mb-2 mb-lg-4">
        <div style={{ maxHeight: "400px", overflow: "hidden" }}>
          {category && (
            <div className="position-absolute">
              <HeaderCard category={category.name} />
            </div>
          )}
          {typeof blog.thumbnail === "string" && blog._id ? (
            <Link to={`/blog/${blog._id}`}>
              <img
                src={blog.thumbnail}
                alt=""
                className="card-img-top h-100"
                style={{ objectFit: "cover" }}
              />
            </Link>
          ) : (
            blog.thumbnail &&
            typeof blog.thumbnail !== "string" && (
              <img
                src={URL.createObjectURL(blog.thumbnail)}
                alt=""
                className="card-img-top h-100"
                style={{ objectFit: "cover" }}
              />
            )
          )}
        </div>
        <div className="card-body">
          {blog.title && (
            <h5 className="card-title">
              {blog.title.length > 60
                ? blog.title.slice(0, 50) + "..."
                : blog.title}
            </h5>
          )}
          
          {blog.description && (
            <p className="card-text">
              {blog.description.length > 150
                ? blog.description.slice(0, 147) + "..."
                : blog.description}
            </p>
          )}
          <p className="small text-end text-muted mb-0">
            {new Date(blog.createdAt).toLocaleString()}
          </p>
        </div>
      </Card>
    </Col>
  );
};

export default Preview;
