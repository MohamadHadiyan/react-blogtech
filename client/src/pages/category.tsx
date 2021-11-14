import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import DialogBox from "../components/global/DialogBox";
import { useAppSelector } from "../hooks/storeHooks";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../redux/actions/categoryAction";
import { FormSubmit, ICategory } from "../utils/TypeScript";

const Category = () => {
  const { auth, categories } = useAppSelector((state) => state);
  const [name, setName] = useState("");
  const [edit, setEdit] = useState<ICategory | null>(null);
  const [show, setShow] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (edit) {
      setName(edit.name);
    }
  }, [edit]);

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault();

    if (!name || !auth.access_token) return;

    if (edit) {
      if (edit.name === name) return;
      const data = { ...edit, name };

      dispatch(updateCategory(data, auth.access_token));
    } else {
      dispatch(createCategory(name, auth.access_token));
    }

    setEdit(null);
    setName("");
  };

  const handleConfirm = (value: boolean) => {
    if (!auth.access_token) return;
    setShow(false);

    if (value && categoryId) {
      dispatch(deleteCategory(categoryId, auth.access_token));
    }
  };

  const handleDelete = (id: string) => {
    setCategoryId(id);
    setShow(true);
  };

  return (
    <div className="col-lg-8 m-auto my-4">
      <div className="card">
        <div className="card-header border-bottom">
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <div className="d-flex position-relative">
              {edit && (
                <button
                  className="btn p-0 position-absolute"
                  style={{ top: "6px", left: "3px" }}
                  onClick={() => setEdit(null)}
                >
                  {" "}
                  <i className="fas fa-times text-danger mx-2" />
                </button>
              )}
              <input
                type="text"
                name="name"
                id="name"
                className={`form-control me-2 ${edit && "ps-4"}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button type="submit" className="btn btn-success">
                {edit ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
        <div className="card-body">
          <div className="tab-content">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th className="text-end" scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.names.map((category) => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td className="text-end">
                      <div>
                        <button
                          className="btn p-0"
                          title="Edit"
                          aria-label="Edit"
                          onClick={() => setEdit(category)}
                        >
                          {" "}
                          <i className="fas fa-edit text-success" />
                        </button>
                        <button
                          className="btn p-0 ms-2"
                          title="Delete"
                          aria-label="Delete"
                          onClick={() => handleDelete(category._id)}
                        >
                          <i className="fas fa-trash text-danger" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogBox
            show={show}
            title="Delete Category"
            description="Are you sure to delete this category?"
            cancel={handleConfirm}
            confirm={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default Category;
