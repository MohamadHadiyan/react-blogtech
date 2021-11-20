import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks/storeHooks";
import { useMedia } from "../../hooks/useMedia";
import { deleteBlog } from "../../redux/actions/blogAction";
import { ALERT } from "../../redux/types/alertType";
import { IBlog, IParams, IUserCard } from "../../utils/TypeScript";
import ActiveLink from "../global/ActiveLink";
import DialogBox from "../global/DialogBox";
import { DefaultDropDownMenu, MenuItemType } from "../global/Dropdown";
import FlexBox from "../global/FlexBox";
import { LockIcon, PencilIcon } from "../global/Icons";
import ShareLink from "../global/ShareLink";

interface IPost {
  post: IBlog;
  isUser: boolean;
}
const UserPost = ({ post, isUser }: IPost) => {
  const { auth } = useAppSelector((state) => state);
  const dispatch = useDispatch();
  const { slug } = useParams<IParams>();
  const [show, setShow] = useState(false);
  const media = useMedia("(min-width: 768px)");

  const handleConfirm = (value: boolean) => {
    if (!auth.access_token || !auth.user) return;
    setShow(false);
    if (value) {
      dispatch(deleteBlog(post, auth.access_token));
    }
  };

  const handleDelete = () => {
    if (slug !== (post.user as IUserCard)._id) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid Authentication" },
      });
    }

    setShow(true);
  };

  const menuItems: MenuItemType[] = [
    isUser
      ? {
          header: "Setting",
          divider: true,
          items: [
            {
              icon: <i className="fas fa-edit me-2" />,
              to: `/update_blog/${post._id}`,
              className: "text-success",
              title: "Edit",
            },
            {
              icon: <i className="fas fa-trash me-2" />,
              onClick: handleDelete,
              className: "text-danger fw-semi-bold",
              title: "Delete",
            },
          ],
        }
      : { items: [] },
    ...ShareLink(`https://blogtech-app.herokuapp.com/blog/${post._id}`, true),
    isUser ? { items: [] } : { items: [{ title: "Report" }] },
  ];

  const postImg =
    typeof post.thumbnail === "string"
      ? post.thumbnail
      : URL.createObjectURL(post.thumbnail);

  return (
    <>
      <FlexBox
        justify="between"
        items="center"
        column={!media}
        className="position-relative"
      >
        <ActiveLink to={`/blog/${post._id}`} color="link" className="w-100">
          <div className="d-lg-flex align-items-center">
            <img
              src={postImg}
              alt=""
              className="rounded"
              style={{
                width: `${media ? "7rem" : "100%"}`,
                maxHeight: "350px",
                objectFit: "cover",
              }}
            />
            <PostDetails post={post} />
          </div>
        </ActiveLink>

        {post.privacy && post.privacy === "private" && (
          <LockIcon fill className="position-absolute px-2 top-0 end-0" />
        )}

        {post.privacy && post.privacy === "draft" && (
          <PencilIcon fill className="position-absolute px-2 top-0 end-0" />
        )}
        <div className="position-absolute right-0 bottom-0">
          <DefaultDropDownMenu menuItems={menuItems} />
        </div>

        <DialogBox
          show={show}
          title="Delete a post"
          description="Are you sure you want to delete this post?"
          cancel={handleConfirm}
          confirm={handleConfirm}
        />
      </FlexBox>
    </>
  );
};

const PostDetails = ({ post }: { post: IBlog }) => {
  return (
    <div className="ms-lg-3 mt-2 mt-lg-0">
      <h6 title={post.title}>{post.title}</h6>
      <ListInline>
        <ListInlineItem>
          <i className="far fa-calendar-alt me-1 text-purple" />
          {new Date(post.createdAt).toLocaleDateString()}
        </ListInlineItem>
        <ListInlineItem>
          <i className="far fa-comment me-1 text-purple" />
          {post.comments.length || ""} Comments
        </ListInlineItem>
        <ListInlineItem>
          <i className="far fa-eye me-1 text-purple" />
          {post.views || ""} views
        </ListInlineItem>
        <ListInlineItem>
          <i className="far fa-heart me-1 text-purple" />
          {post.likes && (post.likes.length || "")} likes
        </ListInlineItem>
      </ListInline>
    </div>
  );
};

interface IProps {
  children: React.ReactNode;
}
const ListInline = ({ children }: IProps) => {
  return <ul className="list-inline fs-6 mb-0 text-inherit">{children}</ul>;
};

const ListInlineItem = ({ children }: IProps) => {
  return (
    <li className="list-inline-item small text-secondary me-3">{children}</li>
  );
};

export default UserPost;
