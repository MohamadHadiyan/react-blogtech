import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/storeHooks";
import { ALERT } from "../../redux/types/alertType";
import { getAPI } from "../../utils/FetchData";
import { InputChange, ITag } from "../../utils/TypeScript";
import Loading from "../alert/Loading";
import { DefaultDropDownMenu } from "../global/Dropdown";
import FlexBox from "../global/FlexBox";

interface IProps {
  callbackValue: (tags: ITag[]) => void;
  defaultTags: ITag[];
}

const TagInputBox = ({ callbackValue, defaultTags }: IProps) => {
  const { tags } = useAppSelector((state) => state);
  const [value, setValue] = useState("");
  const [matchTags, setMatchTags] = useState<ITag[]>([]);
  const [blogTgas, setBlogTgas] = useState<ITag[]>(defaultTags);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvas = document.createElement("canvas");
  const dispatch = useDispatch();

  const reset = () => {
    setMatchTags([]);
    setValue("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getSearchTag = async (name: string) => {
    setLoading(true);

    try {
      const res = await getAPI(`search_tag?name=${name}`);
      setMatchTags(res.data.tags);
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTagInput = (e: InputChange) => {
    const value = e.target.value;
    const text = value.trim();
    setValue(text);

    const exist = blogTgas.some((item) => item.name === text);

    if (text && value.includes(" ") && !exist) {
      const res = tags.names.find((item) => item.name === text);

      const tag = res
        ? {
            name: res.name,
            _id: res._id,
            count: res.consumers.length,
            creator: res.creator,
            consumers: res.consumers,
          }
        : { name: text, _id: "", count: 0, consumers: [], creator: "" };
      return handleSelectTag(tag);
    } else if (!text || value.includes(" ")) {
      return reset();
    }

    getSearchTag(text);
  };

  const handleSelectTag = (tag: ITag) => {
    const newTags = [...blogTgas, tag];

    setBlogTgas(newTags);
    callbackValue(newTags);
    reset();
  };

  const handleFocus = () => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  };

  const handleRemoveTag = (tag: ITag) => {
    const newTags = blogTgas.filter((item) => item.name !== tag.name);
    setBlogTgas(newTags);
    callbackValue(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace" || !blogTgas.length || value) return;
    const tag = blogTgas[blogTgas.length - 1];

    setValue(tag.name + " ");
    handleRemoveTag(tag);
  };

  useEffect(() => {
    if (!inputRef.current) return;
    const input = inputRef.current;

    if (value !== "" || blogTgas.length) {
      input.placeholder = "";
      canvas.width = 1000;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.font = "16px Times, Serif";
      const width = ctx.measureText(value).width;
      input.style.width = `${20 + width}px`;
    } else {
      input.placeholder = "e.g. (travel space)";
    }
  }, [blogTgas.length, canvas, value]);

  return (
    <div className="mb-3 position-relative tag-box-editor">
      <label htmlFor="tags">Tags</label>
      <div className="d-flex justify-content-between">
        <p className="small text-secondary m-0 mb-1">
          Add up to 5 tags to describe what your blog is about
        </p>
        <DefaultDropDownMenu
          menuItems={[
            {
              items: [{ icon: <HowToTag />, className: "text-reset" }],
            },
          ]}
          toggleClass="p-0 line-height-1"
          menuClass="bottom-0 top-auto"
          transform="translate(13px, -30px)"
          icon={<i className="fas fa-info-circle text-link" />}
        />
      </div>
      <div
        className={`position-relative pseudo-input form-control `}
        onClick={handleFocus}
      >
        <div className="d-flex flex-wrap gap-1 pseudo-input-box">
          {!!blogTgas.length &&
            blogTgas.map((item) => (
              <span
                className="p-1 fw-semi-bold small me-1 rounded"
                key={item.name}
                style={{ background: "#dad4e6" }}
              >
                <span>{item.name}</span>
                <button
                  onClick={() => handleRemoveTag(item)}
                  className="btn px-1 btn-sm line-height-1 ms-2"
                  style={{
                    padding: "2px",
                    marginTop: "-3px",
                    background: "#bab2ce",
                  }}
                >
                  <i className="fas fa-times fa-sm" />
                </button>
              </span>
            ))}
          <input
            autoComplete="off"
            ref={inputRef}
            tabIndex={0}
            type="text"
            name="tags"
            id="tags"
            value={value}
            className="pseudo-input"
            placeholder="e.g. (travel space)"
            onChange={handleChangeTagInput}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      {(!!matchTags.length || loading) && value && (
        <div
          className="dropdown-menu d-block w-100 shadow mt-1 p-2"
          style={loading ? { minHeight: "100px" } : {}}
        >
          <div className="row row-cols-1 row-cols-md-3 g-2">
            {loading && <Loading position="absolute" />}
            {matchTags.map((item) => (
              <div className="col" key={item.name}>
                <div
                  tabIndex={0}
                  onClick={() => handleSelectTag(item)}
                  onKeyPress={(e) =>
                    e.key === "Enter" || e.code === "Space"
                      ? handleSelectTag(item)
                      : {}
                  }
                  className="dropdown-item border rounded cursor-pointer"
                >
                  <FlexBox justify="between" items="center">
                    {item.name}
                    <small className="ps-3"> {item.consumers.length}</small>
                  </FlexBox>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const HowToTag = () => {
  return (
    <div className="small" style={{ whiteSpace: "normal", width: "14rem" }}>
      <h6>How to tag</h6>
      <p className="text-secondary">
        Tags help the right peaple find and react to your blog.
      </p>
      <ul>
        <li>Use existing popular tags</li>
        <li>Include tags that are crucial to your blog only, like love</li>
        <li>Use numbers only when absolutely necessary</li>
      </ul>
      <p className="text-secondary">
        If you can't find a tag Create new tags or post without it.
      </p>
    </div>
  );
};

export default TagInputBox;
