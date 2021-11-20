import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../hooks/storeHooks";
import { FormSubmit } from "../../../utils/TypeScript";
import Button from "../../global/Button";

interface IProps {
  handleCreateComment: (data: string) => void;
  handleCancel: () => void;
  isOpen: boolean;
  editContent?: string;
}

const CreateComment = ({
  editContent,
  isOpen = false,
  handleCreateComment,
  handleCancel,
}: IProps) => {
  const [inputHeight, setInputHeight] = useState("36px");
  const [content, setContent] = useState("");
  const [showButton, setShowButton] = useState(isOpen);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { auth } = useAppSelector((state) => state);

  useEffect(() => {
    if (!inputRef.current) return;
    const height = inputRef.current.scrollHeight + 2;
    setInputHeight(height + "px");
  }, [content, inputRef]);

  useEffect(() => {
    if (showButton && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showButton]);

  useEffect(() => {
    if (editContent) {
      setContent(editContent);
    }
  }, [editContent]);

  const handleRow = (e: KeyboardEvent) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      setInputHeight("auto");
    }
  };

  const resetStates = () => {
    setShowButton(false);
    setContent("");
    setInputHeight("auto");
    handleCancel();
  };

  const handleSubmit = (e: FormSubmit) => {
    if (!content) return;

    e.preventDefault();
    const commentBody = content.replace(/(?:\r\n|\r|\n)/g, "<br>");

    if (editContent && editContent.trim() === commentBody.trim()) return;

    handleCreateComment(commentBody);
    resetStates();
  };

  if (!auth.user) return <div />;
  return (
    <form onSubmit={handleSubmit} className="w-100">
      <textarea
        ref={inputRef}
        rows={1}
        style={{ resize: "none", height: `${inputHeight}` }}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleRow}
        onFocus={() => setShowButton(true)}
        value={content}
        className="form-control"
      />
      <div className={`text-end my-2 ${showButton ? "d-block" : "d-none"}`}>
        <Button className="me-2" onClick={resetStates}>
          Cancel
        </Button>
        <Button
          color="purple"
          type="submit"
          disabled={!content || content === editContent}
        >
          {editContent ? "Update Comment" : "Post Comment"}
        </Button>
      </div>
    </form>
  );
};

export default CreateComment;
