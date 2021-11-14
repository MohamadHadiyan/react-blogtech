import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createComment, getComments } from "../../redux/actions/commentAction";
import { IBlog, IComment, IUserCard } from "../../utils/TypeScript";
import Loading from "../alert/Loading";
import CreateComment from "../comment/CreateComment";
import Comment from "../comment/Comment";
import Avatar from "../global/Avatar";
import FlexBox, { Col } from "../global/FlexBox";
import { BlogTitle } from "./BlogComponents";
import SubscribeSection from "./SubscribeSection";
import ActiveLink from "../global/ActiveLink";
import { CLEAR_STORE_COMMENTS } from "../../redux/types/commentType";
import { useAppSelector } from "../../hooks/storeHooks";
import { useHistory } from "react-router";

interface IProps {
  blog: IBlog;
}
const CommentSection = ({ blog }: IProps) => {
  const { auth, comments } = useAppSelector((state) => state);
  const [commentsList, setCommentsList] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [skip, setSkip] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  const blog_id = blog._id as string;
  const blog_user_id = (blog.user as IUserCard)._id;
  const commentsCount = blog.comments ? blog.comments.length : 0;

  const dispatch = useDispatch();
  const history = useHistory();

  const handleCreateComment = (commentBody: string) => {
    if (!auth.user || !auth.access_token) return;

    const data = {
      user: auth.user,
      content: commentBody,
      blog_id: blog_id,
      blog_user_id: blog_user_id,
      createdAt: new Date().toISOString(),
      likes: [],
      dislikes: [],
      replyCM: [],
    };

    setCommentsList([data, ...commentsList]);
    dispatch(createComment(data, auth.access_token, blog));
  };

  useEffect(() => {
    if (comments.data.length > 0 && comments.data[0].blog_id !== blog_id) {
      dispatch({ type: CLEAR_STORE_COMMENTS });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (comments.data.length > 0 && comments.data[0].blog_id === blog_id) {
      setCommentsList(comments.data);
      setLoading(false);
    } else {
      setCommentsList([]);
    }
  }, [blog_id, comments.data]);

  const handleScroll = useCallback(async () => {
    const window_H = window.innerHeight;
    const scrollTop = document.documentElement.scrollTop;
    const offset_H = document.documentElement.offsetHeight;
    if (
      (window_H + scrollTop === offset_H ||
        (window_H + scrollTop <= offset_H &&
          window_H + scrollTop > offset_H - 100)) &&
      !loading &&
      commentsList.length < commentsCount &&
      skip < commentsCount
    ) {
      const num =
        commentsList.length === 0
          ? 0
          : 5 + skip > commentsCount
          ? commentsCount - 5
          : 5 + skip;

      setLoading(true);
      setSkip(num);
      dispatch(getComments(blog_id, num));
    }
  }, [loading, commentsList, commentsCount, skip, dispatch, blog_id]);

  useEffect(() => {
    if (skip >= commentsCount || commentsCount === 0) return;
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [commentsCount, handleScroll, skip]);

  useEffect(() => {
    const hash = history.location.hash;
    if (hash) history.push({ hash });
  }, [history, history.location.hash]);

  const handleSubscribe = (value: string) => {
    setSubscribed(true);
  };

  return (
    <FlexBox row justify="center" id="comments">
      <Col lg="10">
        {!auth.user ? (
          <>
            {!subscribed && (
              <div className="mx-lg-5 px-lg-5">
                <SubscribeSection
                  callback={handleSubscribe}
                  formClass="mb-4"
                  lgForm
                  title="Subscribe for our Newsletter"
                  text="Join our newsletter and get resource, curated content, and design
            inspiration delivered straight to your inbox"
                />
              </div>
            )}
            <BlogTitle size="sm">
              Comments ({" "}
              <span className="text-secondary">{commentsList.length}</span> )
            </BlogTitle>
          </>
        ) : (
          <div className="mb-5">
            <BlogTitle size="sm">
              Comments (
              <span className="text-secondary">{commentsList.length}</span>)
            </BlogTitle>
            <FlexBox items="start">
              <div className="me-2">
                <Avatar src={auth.user.avatar} size="lg" />
              </div>
              {showInput ? (
                <CreateComment
                  isOpen={showInput}
                  handleCreateComment={handleCreateComment}
                  handleCancel={() => setShowInput(false)}
                />
              ) : (
                <div
                  // className="border-bottom w-100 p-2 bg-light rounded border"
                  className="form-control"
                  style={{ cursor: "text" }}
                  onClick={() => setShowInput(true)}
                >
                  post a comment...
                </div>
              )}
            </FlexBox>
          </div>
        )}
        {!auth.user && (
          <p className="mb-5">
            <ActiveLink to={`/login?blog/${blog_id}`} className="text-purple">
              <strong>Login</strong>
            </ActiveLink>{" "}
            to post a comment.
          </p>
        )}
        <div
          className="position-relative"
          style={loading ? { minHeight: "80px" } : {}}
        >
          {commentsList.map((comment) => (
            <Comment
              comment={comment}
              blog_title={blog.title}
              key={comment.createdAt}
            />
          ))}
        </div>
        <div
          className="position-relative"
          style={loading ? { minHeight: "150px" } : {}}
        >
          {loading && <Loading position="absolute" />}
        </div>
      </Col>
    </FlexBox>
  );
};

export default CommentSection;
