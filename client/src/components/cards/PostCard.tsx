import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { IBlog } from "../../utils/TypeScript";
import { CardFooter, HeaderCard } from "../global/CardComponets";
import NotFound from "../global/NotFound";

interface IProps {
  post: IBlog;
}
const PostCard = ({ post }: IProps) => {
  const [titleLength, setTitleLength] = useState(40);
  const [descLength, setDescLength] = useState(110);

  const match992 = useMedia("(min-width:992px)");
  const match1200 = useMedia("(max-width:1200px)");
  const match320 = useMedia("(min-width:320px)");
  const match768 = useMedia("(max-width:768px)");

  useEffect(() => {
    if (match320 && match768) {
      setTitleLength(65);
    } else if (match992 && match1200) {
      setTitleLength(30);
    } else {
      setTitleLength(40);
    }

    if (match320 && match768) {
      setDescLength(110);
    } else if (match1200) {
      setDescLength(70);
    } else {
      setDescLength(90);
    }
  }, [match1200, match320, match768, match992]);

  if (!post) return <NotFound />;

  return (
    <div>
      <div className="card post-card border-0 shadow">
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
          <div className="position-relative card-body evenly p-0">
            <h3 className="title">
              <Link
                to={`/blog/${post._id}`}
                className="text-inherit btn-link stretched-link text-reset text-decoration-none"
              >
                {post.title.length > titleLength
                  ? post.title.slice(0, titleLength) + "..."
                  : post.title}
              </Link>
            </h3>
            <p>
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
