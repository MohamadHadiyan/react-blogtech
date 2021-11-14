import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getRepliesComment } from "../../redux/actions/commentAction";
import { IComment } from "../../utils/TypeScript";
import Loading from "../alert/Loading";
import ActiveLink from "../global/ActiveLink";
import Avatar from "../global/Avatar";
import FlexBox from "../global/FlexBox";
import CommentInner from "./CommentInner";

interface IProps {
  comment: IComment;
  className?: string;
  blog_title: string;
}
const Comment = ({ comment, className = "", blog_title }: IProps) => {
  const [repliesComment, setRepliesComment] = useState<IComment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if (comment.replyCM.length === 0) return;

    setRepliesComment(comment.replyCM);
    setLoading(false);
  }, [comment.replyCM]);

  const handleShowReplies = (value: boolean) => {
    setShowReplies(value);
    if (!comment._id || typeof repliesComment[0] !== "string") return;
    setLoading(true);
    dispatch(getRepliesComment(comment._id));
  };

  const handleSetReplies = (userReply: IComment) => {
    handleShowReplies(true);
    setRepliesComment([...repliesComment, userReply]);
  };

  return (
    <div
      className={`mt-4 border-bottom ${className}`}
      style={comment._id ? {} : { opacity: 0.4, pointerEvents: "none" }}
    >
      <FlexBox items="start">
        <ActiveLink className="me-3">
          <Avatar src={comment.user.avatar} size="md" />
        </ActiveLink>

        <div className="w-100">
          <CommentInner
            comment={comment}
            blog_title={blog_title}
            setRepliesComment={handleSetReplies}
          >
            {repliesComment.length > 0 && (
              <>
                <span
                  className="btn text-purple fw-semi-bold"
                  onClick={() => handleShowReplies(!showReplies)}
                >
                  <i className="fas fa-sort-down me-2" />
                  {showReplies ? "Hide" : "View"} {repliesComment.length}{" "}
                  replies
                </span>
                <div
                  className={
                    showReplies ? "d-block position-relative" : "d-none"
                  }
                  style={loading ? { minHeight: "150px" } : {}}
                >
                  {loading && <Loading position="absolute" size={30} />}

                  {typeof repliesComment[0] !== "string" &&
                    repliesComment.map((item, index) => (
                      <React.Fragment key={index}>
                        {(showAllReplies || index < 5) && (
                          <FlexBox
                            className={`mt-2`}
                            style={
                              item._id
                                ? {}
                                : { opacity: 0.4, pointerEvents: "none" }
                            }
                          >
                            <ActiveLink className="me-3">
                              <Avatar src={item.user.avatar} size="md" />
                            </ActiveLink>
                            <CommentInner
                              blog_title={blog_title}
                              comment={item}
                              setRepliesComment={handleSetReplies}
                            />
                          </FlexBox>
                        )}
                      </React.Fragment>
                    ))}
                  {repliesComment.length > 5 &&
                    !showAllReplies &&
                    showReplies &&
                    !loading && (
                      <span
                        className="btn text-purple fw-semi-bold"
                        onClick={() => setShowAllReplies(true)}
                      >
                        <i className="fas fa-sort-down me-2" />
                        Show more replies
                      </span>
                    )}
                </div>
              </>
            )}
          </CommentInner>
        </div>
      </FlexBox>
    </div>
  );
};

export default Comment;
