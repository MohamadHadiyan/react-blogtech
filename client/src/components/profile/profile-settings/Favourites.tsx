import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storeHooks";
import {
  updateFavourite,
  getFavourites,
} from "../../../redux/actions/profileAction";
import { IBlogCard } from "../../../utils/TypeScript";
import Loading from "../../alert/Loading";
import ActiveLink from "../../global/ActiveLink";
import Avatar from "../../global/Avatar";
import Button from "../../global/Button";
import { Card, CardBody, CardHeader, CardImage } from "../../global/Card";
import FlexBox, { Col } from "../../global/FlexBox";

const Favourites = () => {
  const { auth } = useAppSelector((state) => state);
  const [blogs, setBlogs] = useState<IBlogCard[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const hanleRemove = (blog: IBlogCard) => {
    if (!auth.user || !auth.access_token) return;

    dispatch(
      updateFavourite({
        user_id: auth.user._id,
        blog: blog,
        actionType: "remove",
        token: auth.access_token,
      })
    );
  };

  useEffect(() => {
    if (!auth.user || !auth.access_token) return;

    const favourites = auth.user.favourites;
    if (!favourites || !favourites.length) return;

    if (typeof favourites[0] === "string") {
      setLoading(true);
      dispatch(getFavourites(auth.user._id, auth.access_token));
    } else {
      setBlogs(favourites);
      setLoading(false);
    }
  }, [auth.access_token, auth.user, dispatch]);

  return (
    <Card>
      <CardHeader>
        <h4 className="m-0 d-inline-block">Favorites ({blogs.length})</h4>
        <p className="text-secondary m-0">Your favorite blogs</p>
      </CardHeader>
      <CardBody
        className="position-relative"
        style={loading ? { height: "176px" } : {}}
      >
        {loading && <Loading position="absolute" />}
        {blogs.length
          ? blogs.map((item, i) => (
              <CardLikedBlog
                className={i !== 0 ? "border-top pt-3" : ""}
                blog={item}
                key={item._id}
                handleRemove={() => hanleRemove(item)}
              />
            ))
          : !loading && (
              <h5 className="text-center py-4 text-secondary">
                There are no favourite blog.
              </h5>
            )}
      </CardBody>
    </Card>
  );
};

const CardLikedBlog = ({
  blog,
  className = "",
  handleRemove,
}: {
  blog: IBlogCard;
  className?: string;
  handleRemove: () => void;
}) => {
  return (
    <FlexBox row className={`pb-3 g-0 ${className}`}>
      <Col
        col="12"
        lg="3"
        className="pe-0 pe-lg-4"
        style={{ maxHeight: "220px" }}
      >
        <ActiveLink
          to={`/blog/${blog._id}`}
          color="purple"
          title={blog.title.replace(/\s/g, " ")}
        >
          <CardImage
            url={blog.thumbnail as string}
            className="rounded-3 h-100"
            style={{ objectFit: "cover" }}
          />
        </ActiveLink>
      </Col>
      <Col
        col="12"
        lg="9"
        className="d-flex flex-column justify-content-between"
      >
        <div className="position-relative">
          <h5>
            <ActiveLink
              to={`/blog/${blog._id}`}
              color="purple"
              stretched
              title={blog.title.replace(/\s/g, " ")}
            >
              {blog.title.replace(/\s/g, " ")}
            </ActiveLink>
          </h5>
          <p className=" text-secondary">
            {blog.description.length > 180
              ? blog.description.replace(/\s/g, " ").slice(0, 177) + "..."
              : blog.description.replace(/\s/g, " ")}
          </p>
        </div>

        <FlexBox justify="between">
          <div className="position-relative">
            {typeof blog.user !== "string" && (
              <ActiveLink
                to={`/profile/${blog.user._id}`}
                stretched
                className="d-flex align-items-end text-link"
              >
                <Avatar src={blog.user.avatar} className="me-2" />
                {blog.user.name}
              </ActiveLink>
            )}
          </div>
          <Button
            color="danger"
            size="sm"
            title="Remove Blog From Favorites"
            onClick={handleRemove}
          >
            <i className="fas fa-trash" />
          </Button>
        </FlexBox>
      </Col>
    </FlexBox>
  );
};

export default Favourites;
