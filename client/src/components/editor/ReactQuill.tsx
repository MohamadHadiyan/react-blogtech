import { useCallback, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import { useDispatch } from "react-redux";
import { ALERT } from "../../redux/types/alertType";
import { imageCheck, imageUpload } from "../../utils/ImageUpload";
import "react-quill/dist/quill.snow.css";

interface IProps {
  setBody: (body: string) => void;
  body:string;
}

const Quill = ({body, setBody }: IProps) => {
  const modules = { toolbar: { container } };
  const quillRef = useRef<ReactQuill>(null);
  const dispatch = useDispatch();

  // Custom handle image
  const handleChangeImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const files = input.files;

      if (!files) {
        return dispatch({
          type: ALERT,
          payload: { errors: "File does not exists." },
        });
      }

      const file = files[0];
      const check = imageCheck(file);

      if (check) {
        return dispatch({ type: ALERT, payload: { errors: check } });
      }

      dispatch({ type: ALERT, payload: { loading: true } });
      const photo = await imageUpload(file);

      const quill = quillRef.current;
      const range = quill?.getEditor().getSelection()?.index;

      if (range !== undefined) {
        quill?.getEditor().insertEmbed(range, "image", `${photo.url}`);
      }

      dispatch({ type: ALERT, payload: { loading: false } });
    };
  }, [dispatch]);

  useEffect(() => {
    const quill = quillRef.current;

    if (quill) {
      let toolbar = quill.getEditor().getModule("toolbar");
      toolbar.addHandler("image", handleChangeImage);
    }
  }, [handleChangeImage]);

  return (
    <div className="col-lg-12">
      <ReactQuill
        modules={modules}
        theme="snow"
        placeholder="Write your blog"
        onChange={(e) => setBody(e)}
        value={body}
        ref={quillRef}
      />
    </div>
  );
};

let container = [
  
  [{ font: [] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ size: ["small", false, "large", "huge"] }], // Custom dropdown
  
  [{ header: 1 }, { header: 2 }], // custom button values
  ["bold", "italic", "underline", "strike"], // Toggled button
  ["blockquote", "code-block"],
  [{ color: [] }, { background: [] }], // Dropdown with defaults from theme
  [{ script: "sub" }, { script: "super" }], // Subscript/superscript

  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }], // Outdent/indent
  [{ direction: "rtl" }], // Text direction
  [{ align: [] }],

  ["clean", "link", "image", "video"],
];

export default Quill;
