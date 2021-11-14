import React, { useCallback, useMemo, useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import Loading from "../components/alert/Loading";
import CreateBlogForm from "../components/cards/CreateBlogForm";
import Preview from "../components/cards/Preview";
import Quill from "../components/editor/ReactQuill";
import Button from "../components/global/Button";
import FlexBox from "../components/global/FlexBox";
import NotFound from "../components/global/NotFound";
import { useAppSelector } from "../hooks/storeHooks";
import { createBlog, updateBlog } from "../redux/actions/blogAction";
import { createTag } from "../redux/actions/tagAction";
import { ALERT } from "../redux/types/alertType";
import { GET_BLOG } from "../redux/types/blogType";
import { getAPI } from "../utils/FetchData";
import { IBlog, ITag, IUser } from "../utils/TypeScript";
import {
  compareTagArrays,
  shallowEqaulity,
  validCreateBlog,
  validSaveBlog,
} from "../utils/Valid";

interface IProps {
  id?: string;
}

const CreateBlog = ({ id }: IProps) => {
  const { auth, tags, currentBlog } = useAppSelector((state) => state);
  const dispatch = useDispatch();
  const initialState: IBlog = useMemo(
    () => ({
      user: "",
      title: "",
      thumbnail: "",
      category: "",
      description: "",
      content: "",
      tags: [],
      likes: [],
      comments: [],
      views: 0,
      createdAt: "",
      privacy: "public",
    }),
    []
  );
  const [blog, setBlog] = useState<IBlog>(initialState);
  const [body, setBody] = useState("");
  const [text, setText] = useState("");
  const [oldBlog, setOldBlog] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const history = useHistory();

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;

    const text = div.innerText as string;
    setText(text);
  }, [body]);

  useEffect(() => {
    if (!id) return;

    const init: IBlog = {
      user: "",
      title: "",
      thumbnail: "",
      category: "",
      description: "",
      content: "",
      tags: [],
      likes: [],
      comments: [],
      views: 0,
      createdAt: "",
      privacy:"public"
    };

    setLoading(true);
    getAPI(`blog/${id}`, auth.access_token)
      .then((res) => {
        const data = res.data;
        const blog = { ...data, category: data.category._id };
        setBlog(blog);
        setOldBlog(blog);
        setBody(res.data.content);
        setText(res.data.content);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
      });

    return () => {
      setBlog(init);
      setOldBlog(init);
      setBody("");
      setText("");
    };
  }, [auth.access_token, dispatch, id, tags.names]);

  /* ======= Create New Blog ======= */
  interface ICreateProps {
    newBlog: IBlog;
    tags: ITag[];
  }
  const handleCreateBlog = ({ newBlog, tags }: ICreateProps) => {
    if (!auth.access_token || !auth.user) return;

    const token = auth.access_token;
    const blog = { ...newBlog, createdAt: new Date().toISOString() };
    const { newIDs, newTagNames } = compareTagArrays([], tags);

    if (newTagNames.length) {
      dispatch(
        createTag(newTagNames, token, (tags, new_token) => {
          const ids = tags.map((item) => item._id);
          dispatch(
            createBlog({ ...blog, tags: [...newIDs, ...ids] }, new_token)
          );
        })
      );
    } else {
      dispatch(createBlog({ ...blog, tags: newIDs }, token));
    }
  };

  /* ======= Update Exist Blog ======= */
  interface TagType {
    oldTags: ITag[];
    newTags: ITag[];
  }

  interface IUpdate {
    newBlog: IBlog;
    tags: TagType;
  }
  const handleUpdateBlog = ({ newBlog, tags }: IUpdate) => {
    if (!auth.access_token || !auth.user) return;

    const user = auth.user;
    const userBlog = blog.user as IUser;
    const token = auth.access_token;

    const { newIDs, oldIDs, newTagNames, addedIDs, removedIDs } =
      compareTagArrays(tags.oldTags, tags.newTags);
    const updatedBlog = { ...newBlog, tags: newIDs, _id: id };

    const blogsIsEqual = shallowEqaulity(
      { ...oldBlog, user: (oldBlog.user as IUser)._id, tags: oldIDs },
      { ...newBlog, user: (newBlog.user as IUser)._id }
    );

    if (userBlog._id !== user._id) {
      const msg = "Invalid Authentication.";
      return dispatch({ type: ALERT, payload: { errors: msg } });
    }

    if (blogsIsEqual) {
      const msg = "The data does not changed!";
      return dispatch({ type: ALERT, payload: { errors: msg } });
    }

    if (newTagNames.length) {
      dispatch(
        createTag(newTagNames, token, (tags, new_token) => {
          const ids = tags.map((item) => item._id);
          const added_ids = [...addedIDs, ...ids];
          const blog = { ...updatedBlog, tags: [...newIDs, ...ids] };

          dispatch(
            updateBlog(blog, new_token, { addedIDs: added_ids, removedIDs })
          );
        })
      );
    } else {
      dispatch(updateBlog(updatedBlog, token, { addedIDs, removedIDs }));
    }
  };

  /* ======= Handle Submit Blog Form ======= */
  const handleSubmit = (type: "save" | "submit") => {
    const isSaved = type === "save";
    const checkBlog = { ...blog, content: text };
    const check = isSaved ? validSaveBlog(blog) : validCreateBlog(checkBlog);

    if (check.errLength > 0) {
      return dispatch({ type: ALERT, payload: { errors: check.errMsg } });
    }

    const newTags = blog.tags as ITag[];
    const oldTags = oldBlog.tags as ITag[];
    const privacy = isSaved ? "draft" : blog.privacy;
    const newBlog: IBlog = { ...blog, content: body, privacy };

    if (id) {
      handleUpdateBlog({ newBlog, tags: { newTags, oldTags } });
    } else {
      handleCreateBlog({ newBlog, tags: newTags });
    }
    dispatch({ type: GET_BLOG, payload: initialState });
  };

  /* ====== When click on back button on browser ======= */
  const onExitPage = useCallback(
    (e: Event) => {
      if (currentBlog._id && currentBlog._id === "drafted_blog") {
        const msg =
          "Do you give up writing?\nChanges you made may not be saved.";

        if (window.confirm(msg)) {
          dispatch({ type: GET_BLOG, payload: initialState });
          return history.push("/");
        } else {
          dispatch({
            type: GET_BLOG,
            payload: { ...blog, _id: "drafted_blog" },
          });
          return history.push("/create_blog");
        }
      }

      return history.push("/");
    },
    [blog, currentBlog._id, dispatch, history, initialState]
  );

  useEffect(() => {
    window.addEventListener("popstate", onExitPage);
    return () => window.removeEventListener("popstate", onExitPage);
  }, [onExitPage]);

  useEffect(() => {
    if (currentBlog._id && currentBlog._id === "drafted_blog") {
      setBlog(currentBlog);
    }
  }, [currentBlog]);
  /* ====== End ===== */

  if (!auth.access_token) return <NotFound />;
  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="my-3 mb-5 py-3" style={{ borderBottom: "1px solid #ccc" }}>
        {id ? "Update" : "Create"} Blog
      </h1>

      <div className="row">
        <div className="col-lg-8">
          <CreateBlogForm blog={blog} setBlog={setBlog} />
        </div>
        <Preview
          blog={{
            ...blog,
            createdAt: id ? blog.createdAt : new Date().toISOString(),
            _id: id ? blog._id : "",
          }}
        />
      </div>

      <div className="row">
        <Quill setBody={setBody} body={body} />
        <div
          ref={divRef}
          className="d-none"
          dangerouslySetInnerHTML={{ __html: body }}
        ></div>

        <p className="small text-muted  mb-3 text-end">{text.length}</p>
      </div>
      <FlexBox justify="end" className="mb-3 mb-lg-5">
        <Button
          className="px-4 me-2"
          color="purple"
          onClick={() => handleSubmit("save")}
        >
          Save
        </Button>
        <Button
          type="submit"
          color="purple"
          className="px-3"
          onClick={() => handleSubmit("submit")}
        >
          {id ? "Update" : "Publish"}
        </Button>
      </FlexBox>
    </div>
  );
};

export default CreateBlog;
