import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storeHooks";
import {
  deleteComment,
  replyComment,
  updateComment,
  updateCommentLikes,
} from "../../../redux/actions/commentAction";
import getDate from "../../../utils/GetDate";
import { IComment } from "../../../utils/TypeScript";
import ActiveLink from "../../global/ActiveLink";
import Button from "../../global/Button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "../../global/Dropdown";
import FlexBox from "../../global/FlexBox";
import { InlineList, InlineListItem } from "../../global/Lists";
import CreateComment from "./CreateComment";

interface IProps {
  children?: React.ReactNode;
  comment: IComment;
  setRepliesComment: (replyComment: IComment) => void;
  blog_title: string;
}

const CommentInner = ({
  children,
  comment,
  setRepliesComment,
  blog_title,
}: IProps) => {
  const { auth } = useAppSelector((state) => state);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [editComment, setEditComment] = useState("");
  const [likes, setLikes] = useState<string[]>(comment.likes || []);
  const [dislikes, setDislikes] = useState<string[]>(comment.dislikes || []);
  const commentLikes: string[] = comment.likes || [];
  const commentDislikes: string[] = comment.dislikes || [];

  const dispatch = useDispatch();

  useEffect(() => {
    if (!comment.likes || !comment.dislikes) return;
    if (
      comment.likes.length !== likes.length ||
      comment.dislikes.length !== dislikes.length
    ) {
      setLikes(comment.likes);
      setDislikes(comment.dislikes);
    }
  }, [comment.dislikes, comment.likes, dislikes.length, likes.length]);

  const handleReply = (commentBody: string) => {
    if (!auth.user || !auth.access_token) return;

    const data = {
      user: auth.user,
      reply_user: comment.user,
      content: commentBody,
      blog_id: comment.blog_id,
      blog_user_id: comment.blog_user_id,
      comment_root: comment.comment_root || comment._id,
      createdAt: new Date().toISOString(),
      likes: [],
      dislikes: [],
      replyCM: [],
    };

    dispatch(replyComment(data, blog_title, auth.access_token));
    setShowReplyInput(false);
    setRepliesComment(data);
  };

  type ActionType = "likes" | "dislikes";
  const handleupdateCommentLikes = (action: ActionType) => {
    if (!auth.access_token) return;
    const token = auth.access_token;
    const data = {
      ...comment,
      likes: commentLikes,
      dislikes: commentDislikes,
    };

    dispatch(updateCommentLikes(data, blog_title, action, token));
  };

  const setArrLikes = (
    user_id: string,
    action: ActionType,
    setState: () => void
  ) => {
    if (likes.includes(user_id)) {
      const arr = likes.filter((item) => item !== user_id);
      commentLikes.splice(0).push(...arr);
      setLikes([...arr]);
    } else if (dislikes.includes(user_id)) {
      const arr = dislikes.filter((item) => item !== user_id);
      commentDislikes.splice(0).push(...arr);
      setDislikes([...arr]);
    } else {
      setState();
    }
    handleupdateCommentLikes(action);
  };

  const handleLikes = () => {
    if (!auth.user) return;

    const user_id = auth.user._id;
    const set = () => {
      setLikes([user_id, ...likes]);
      commentLikes.push(user_id);
    };
    setArrLikes(user_id, "likes", set);
  };

  const handleDislikes = () => {
    if (!auth.user) return;

    const user_id = auth.user._id;
    const set = () => {
      setDislikes([user_id, ...dislikes]);
      commentDislikes.push(user_id);
    };
    setArrLikes(user_id, "dislikes", set);
  };

  const handleUpdate = (content: string) => {
    if (!auth.user || !auth.access_token) return;
    dispatch(updateComment({ ...comment, content }, auth.access_token));
  };

  const handleDelete = () => {
    if (!auth.user || !auth.access_token) return;
    dispatch(deleteComment(comment, auth.access_token));
  };

  return (
    <div className="w-100">
      <CommentHeader
        userName={comment.user.name}
        user_id={comment.user._id}
        createdAt={comment.createdAt}
      />

      <div className="mb-1 fw-semi-bold small">
        {" "}
        {comment.reply_user && (
          <ActiveLink
            color="purple"
            to={`/profile/${comment.reply_user._id}`}
            className="me-2 small"
          >
            @{comment.reply_user.name}
          </ActiveLink>
        )}
        <p
          className="d-inline-block m-0"
          dangerouslySetInnerHTML={{ __html: comment.content }}
        />
      </div>

      <CommentFooter
        likes={likes.length}
        dislikes={dislikes.length}
        handleDislikes={handleDislikes}
        handleLikes={handleLikes}
        handleReply={() => setShowReplyInput(!showReplyInput)}
        dropdownItem={
          auth.user && auth.user._id === comment.user._id ? (
            <>
              <DropdownItem>
                <div onClick={handleDelete} className="cursor-pointer">
                  <i className="fas fa-trash-alt me-3 text-danger" />
                  Delete
                </div>
              </DropdownItem>
              <DropdownItem>
                <div
                  onClick={() => setEditComment(comment.content)}
                  className="cursor-pointer"
                >
                  <i className="fas fa-edit me-3 text-success" />
                  Edit
                </div>
              </DropdownItem>
            </>
          ) : auth.user && auth.user._id === comment.blog_user_id ? (
            <DropdownItem>
              {" "}
              <i className="fas fa-trash-alt me-3 text-danger" />
              Delete
            </DropdownItem>
          ) : (
            <DropdownItem className="cursor-pointer">
              <i className="fas fa-info-circle me-3" />
              Report
            </DropdownItem>
          )
        }
      />

      {editComment && (
        <CreateComment
          handleCreateComment={handleUpdate}
          handleCancel={() => setEditComment("")}
          isOpen={!!editComment}
          editContent={editComment}
        />
      )}

      {showReplyInput && (
        <CreateComment
          handleCreateComment={handleReply}
          handleCancel={() => setShowReplyInput(!showReplyInput)}
          isOpen={showReplyInput}
        />
      )}
      {children}
    </div>
  );
};

interface IHeader {
  userName: string;
  user_id: string;
  createdAt: string;
}
const CommentHeader = ({ userName, user_id, createdAt }: IHeader) => {
  return (
    <h6 className="d-flex fw-bold flex-wrap center mt-2">
      <ActiveLink
        to={`/profile/${user_id}`}
        color="link"
        className="me-1 me-md-3"
      >
        {userName}
      </ActiveLink>
      <small className="text-secondary mt-1">
        {getDate(createdAt, { fullText: true })}
      </small>
    </h6>
  );
};

interface IFooter {
  likes: number;
  dislikes: number;
  handleLikes: () => void;
  handleDislikes: () => void;
  handleReply: () => void;
  dropdownItem: React.ReactNode;
}

const CommentFooter = ({
  likes,
  dislikes,
  handleLikes,
  handleDislikes,
  handleReply,
  dropdownItem,
}: IFooter) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FlexBox justify="between">
      <InlineList className="mb-0 mb-lg-2">
        <InlineListItem>
          <Button className="ps-1 pe-0" title="Like" onClick={handleLikes}>
            <i className="far fa-thumbs-up"></i>
          </Button>
          {likes > 0 && <span className="ms-1">{likes}</span>}
        </InlineListItem>
        <InlineListItem>
          <Button
            className="ps-1 pe-0"
            title="Dislike"
            onClick={handleDislikes}
          >
            <i className="far fa-thumbs-down"></i>
          </Button>
          {dislikes > 0 && <span className="ms-1">{dislikes}</span>}
        </InlineListItem>
        <InlineListItem>
          <Button title="Reply" onClick={handleReply}>
            Reply
          </Button>
        </InlineListItem>
      </InlineList>
      <Dropdown isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle id="comment_options" className="py-0 px-2">
          <i className="fas fa-ellipsis-v text-secondary" />
        </DropdownToggle>
        <DropdownMenu
          id="comment_options"
          className="top-0 end-0"
          style={{ transform: "translate(-30px, -40px)" }}
        >
          {dropdownItem}
        </DropdownMenu>
      </Dropdown>
    </FlexBox>
  );
};

export default CommentInner;
