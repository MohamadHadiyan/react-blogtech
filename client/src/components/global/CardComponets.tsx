import { Link } from "react-router-dom";
import getBlogInfo from "../../utils/getBlogInfo";
import { IBlog } from "../../utils/TypeScript";
import Author from "./Author";
import FlexBox from "./FlexBox";
import PostMenu from "./PostMenu";

type THeader = {
  category: string;
  bestPost?: boolean;
  bgBadge?: string;
};
export const HeaderCard = ({
  category,
  bestPost = false,
  bgBadge = "danger",
}: THeader) => {
  return (
    <div className="d-flex between p-3 text-white ">
      <Link
        to={`/blogs/${category}`}
        className={`badge text-decoration-none stretched-link text-reset bg-${bgBadge} btn-link shadow`}
      >
        <i className="fas fa-circle me-2 small text-bold" />
        {category[0].toUpperCase() + category.slice(1)}
      </Link>
      {bestPost && <StarBadge />}
    </div>
  );
};

interface IFooter {
  post: IBlog;
}
export const CardFooter = ({ post }: IFooter) => {
  const user = post.user;
  const menuInfo = getBlogInfo({
    views: post.views,
    likes: post.likes?.length,
    comments: post.comments?.length,
    createdAt: post.createdAt,
  });
  return (
    <FlexBox justify="between" items="end" className="text-reset g-0 mt-0" wrap>
      <div className="col-auto">
        {typeof user !== "string" && (
          <Author
            name={user.name}
            id={user._id}
            avatar={user.avatar}
            className="btn-link text-reset"
          />
        )}
      </div>
      <PostMenu className="mt-3" info={menuInfo} show />
    </FlexBox>
  );
};

type TPropsH = { title: string; to: string };

export const TitleCardH3 = ({ title, to }: TPropsH) => {
  return (
    <h3 className="text-white mb-3 card-title">
      {" "}
      <Link
        to={to}
        title={title}
        className="btn-link stretched-link text-reset text-decoration-none"
      >
        {title.length > 60 ? title.slice(0, 57) + "..." : title}
      </Link>
    </h3>
  );
};

export const TitleCardH5 = ({ title, to }: TPropsH) => {
  return (
    <h5 className="text-white card-title">
      <Link
        to={to}
        title={title}
        className="btn-link stretched-link text-reset text-decoration-none"
      >
        {title.length > 40 ? title.slice(0, 37) + "..." : title}
      </Link>
    </h5>
  );
};

export const StarBadge = () => {
  return (
    <span className="star-badge" title="Featured post">
      <i className="fas fa-star" />
    </span>
  );
};
