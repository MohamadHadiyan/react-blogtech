import React from "react";
import { IBlog, ICategory } from "../../utils/TypeScript";
import {
  CardFooter,
  HeaderCard,
  TitleCardH3,
  TitleCardH5,
} from "../global/CardComponets";
import FlexBox from "../global/FlexBox";

type Tprops = {
  post: IBlog;
  bestPost?: boolean;
};

const FeaturedPost = ({ post, bestPost = false }: Tprops) => {
  if (!post) return <div />;

  const category = post.category as ICategory;
  const style = {
    backgroundImage: `url(${post.thumbnail as string})`,
    height: bestPost ? "560px" : "268px",
  };

  return (
    <div
      className="card border-0 featured-post card-overlay-bottom card-bg-scaled text-white"
      style={style}
    >
      <div className="position-relative">
        {bestPost ? (
          <HeaderCard bestPost category={category.name} />
        ) : (
          <HeaderCard category={category.name} />
        )}
      </div>
      <CardBody>
        {bestPost ? (
          <TitleCardH3 title={post.title} to={`/blog/${post._id as string}`} />
        ) : (
          <TitleCardH5 title={post.title} to={`/blog/${post._id as string}`} />
        )}
        {bestPost && (
          <p className="text-white text-bold m-0">
            {post.description.length > 97
              ? post.description.slice(0, 97) + "..."
              : post.description}
          </p>
        )}
      </CardBody>
      <div className="p-3 position-relative">
        <CardFooter post={post} />
      </div>
    </div>
  );
};

type TBody = {
  children: React.ReactNode;
  className?: string;
};
const CardBody = ({ children, className = "" }: TBody) => {
  return (
    <FlexBox
      items="end"
      className={`px-3 card-content text-white position-relative h-100 ${className}`}
    >
      <div className="w-100">{children}</div>
    </FlexBox>
  );
};

export default FeaturedPost;
