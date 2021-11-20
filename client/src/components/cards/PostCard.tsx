import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { IBlog } from "../../utils/TypeScript";
import { CardFooter, HeaderCard } from "../global/CardComponets";

interface IProps {
  post: IBlog;
}
const PostCard = ({ post }: IProps) => {
  const [titleLength, setTitleLength] = useState(40);
  const [descLength, setDescLength] = useState(110);

  const match320 = useMedia("(min-width:320px)");
  const match768 = useMedia("(max-width:768px)");
  const matchMin768 = useMedia("(min-width:768px)");

  useEffect(() => {
    if (match320 && match768) {
      setTitleLength(80);
    } else {
      setTitleLength(50);
    }

    if (match320 && match768) {
      setDescLength(120);
    } else {
      setDescLength(100);
    }
  }, [match320, match768]);

  if (!post) return <div />;

  return (
    <div>
      <div
        className="card post-card border-0 shadow-sm"
        style={!matchMin768 ? { minHeight: "auto" } : {}}
      >
        {typeof post.category !== "string" && (
          <div className="position-absolute">
            <HeaderCard category={post.category.name} />
          </div>
        )}
        <Link className="card-img-top" to={`/blog/${post._id}`}>
          {typeof post.thumbnail === "string" && (
            <img
              src={post.thumbnail}
              alt="thumbnail"
              className="card-img-top thumbnail"
            />
          )}
        </Link>

        <div className="card-body">
          <div
            className="position-relative card-body p-0"
            style={{ maxHeight: "180px", overflow: "hidden" }}
          >
            <h3 className="title mb-4 mb-md-1">
              <Link
                to={`/blog/${post._id}`}
                className="text-inherit btn-link stretched-link text-reset text-decoration-none"
              >
                {post.title.length > titleLength
                  ? post.title.slice(0, titleLength) + "..."
                  : post.title}
              </Link>
            </h3>
            <p className="d-none d-sm-block">
              {post.description.length > descLength
                ? post.description.slice(0, descLength) + "..."
                : post.description}
            </p>
          </div>
          <div className="position-relative">
            <CardFooter post={post} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
