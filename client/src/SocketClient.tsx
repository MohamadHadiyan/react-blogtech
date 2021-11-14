import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./hooks/storeHooks";
import { UPDATE_BLOG_LIKES, UPDATE_BLOG_VIEWS } from "./redux/types/blogType";
import * as commentTypes from "./redux/types/commentType";
import { IComment } from "./utils/TypeScript";

const SocketClient = () => {
  const { socket } = useAppSelector((state) => state);
  const dispatch = useDispatch();

  // updateBlogLikes
  useEffect(() => {
    if (!socket) return;

    socket.on("updateBlogLikes", (data: { likes: string[] }) => {
      dispatch({ type: UPDATE_BLOG_LIKES, payload: data.likes });
    });

    return () => {
      socket.off("updateBlogLikes");
    };
  }, [dispatch, socket]);

  // updateBlogViews
  useEffect(() => {
    if (!socket) return;

    socket.on("updateBlogViews", (data: { views: number }) => {
      dispatch({ type: UPDATE_BLOG_VIEWS, payload: data.views });
    });

    return () => {
      socket.off("updateBlogViews");
    };
  }, [dispatch, socket]);

  // createComment
  useEffect(() => {
    if (!socket) return;

    socket.on("createComment", (comment: IComment) => {
      dispatch({ type: commentTypes.CREATE_COMMENT, payload: comment });
    });

    return () => {
      socket.off("createComment");
    };
  }, [dispatch, socket]);

  // updateComment
  useEffect(() => {
    if (!socket) return;

    socket.on("updateComment", (comment: IComment) => {
      dispatch({
        type: comment.comment_root
          ? commentTypes.UPDATE_REPLY
          : commentTypes.UPDATE_COMMENT,
        payload: comment,
      });
    });

    return () => {
      socket.off("updateComment");
    };
  }, [dispatch, socket]);

  // replyComment
  useEffect(() => {
    if (!socket) return;

    socket.on("replyComment", (comment: IComment) => {
      dispatch({ type: commentTypes.REPLY_COMMENT, payload: comment });
    });

    return () => {
      socket.off("replyComment");
    };
  }, [dispatch, socket]);

  // deleteComment
  useEffect(() => {
    if (!socket) return;

    socket.on("deleteComment", (comment: IComment) => {
      dispatch({
        type: comment.comment_root
          ? commentTypes.DELETE_REPLY
          : commentTypes.DELETE_COMMENT,
        payload: comment,
      });
    });

    return () => {
      socket.off("deleteComment");
    };
  }, [dispatch, socket]);

  // updateCommentLikes
  useEffect(() => {
    if (!socket) return;

    socket.on("updateCommentLikes", (comment: IComment) => {
      dispatch({
        type: comment.comment_root
          ? commentTypes.UPDATE_REPLY
          : commentTypes.UPDATE_COMMENT,
        payload: comment,
      });
    });

    return () => {
      socket.off("updateCommentLikes");
    };
  }, [dispatch, socket]);

  return <div></div>;
};

export default SocketClient;
