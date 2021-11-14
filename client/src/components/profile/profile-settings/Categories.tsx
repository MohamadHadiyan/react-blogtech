import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storeHooks";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../../redux/actions/categoryAction";

import getUniqueID from "../../../utils/GetUniqueID";
import { FormSubmit, ICategory } from "../../../utils/TypeScript";
import Button from "../../global/Button";
import { Card, CardBody, CardHeader } from "../../global/Card";
import DialogBox from "../../global/DialogBox";
import FlexBox, { Col } from "../../global/FlexBox";
import InputBox from "../../global/InputBox";

type BodyType = {
  title: string;
  createdAt: string;
  countUsed: number;
  actions: React.ReactNode[];
};

type TableType = {
  headerCells: string[];
  body: BodyType[];
};

const Categories = () => {
  const { auth, categories } = useAppSelector((state) => state);
  const cateNames = categories.names;
  const headCells = ["Name", "Created", "Used", "Actions"];

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

    if (!value || !categoryId) return;
    dispatch(deleteCategory(categoryId, auth.access_token));
  };

  const handleDelete = (id: string) => {
    setCategoryId(id);
    setShow(true);
  };

  const handleCancel = () => {
    setName("");
    setEdit(null);
  };

  const cateRowsBody: BodyType[] = cateNames.map((item) => {
    return {
      title: item.name,
      createdAt: new Date(item.createdAt).toLocaleDateString(),
      countUsed: item.count || 0,
      actions: [
        <Button
          key="1"
          color="success-soft"
          className="me-1"
          onClick={() => setEdit(item)}
        >
          <i className="fas fa-edit" />
        </Button>,
        <Button
          key="2"
          color="danger-soft"
          className="mt-1 mt-sm-0"
          onClick={() => handleDelete(item._id)}
        >
          <i className="fas fa-trash pe-1 pe-sm-0" />
        </Button>,
      ],
    };
  });

  return (
    <Card>
      <CardHeader>
        <h4>{`Categories (${categories.names.length})`}</h4>
      </CardHeader>
      <div className="p-3 p-xl-4 border-bottom">
        <form onSubmit={handleSubmit}>
          <FlexBox row justify="between" className="g-2">
            <Col sm="9" lg={edit ? "8" : "10"}>
              <InputBox
                type="text"
                label="Name"
                row
                boxClassName="mb-0"
                defaultValue={name}
                callbackValue={(value) => setName(value)}
              />
            </Col>
            <Col sm="3" lg={edit ? "4" : "2"}>
              <FlexBox wrap className="gap-2" justify="end">
                <Button block={!edit} type="submit" color="purple">
                  {edit ? "Update" : "Create"}
                </Button>
                {edit && (
                  <Button
                    type="submit"
                    color="purple"
                    style={{ paddingLeft: "14px", paddingRight: "14px" }}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                )}
              </FlexBox>
            </Col>
          </FlexBox>
        </form>
      </div>
      <CardBody>
        <Table
          headCells={{
            headerCells: headCells,
            body: cateRowsBody,
          }}
        />
      </CardBody>
      <DialogBox
        show={show}
        title="Delete Category"
        description="Are you sure to delete this category?"
        cancel={handleConfirm}
        confirm={handleConfirm}
      />
    </Card>
  );
};

interface ITable {
  headCells: TableType;
}

const Table = ({ headCells }: ITable) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead>
          <tr>
            {headCells.headerCells.map((item) => (
              <th className="text-secondary" key={getUniqueID()}>
                {item}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {headCells.body.map((item, i) => (
            <tr key={getUniqueID()}>
              <td className="fw-semi-bold px-2 py-3">{item.title}</td>
              <td className="px-1 px-lg-2 py-3">{item.createdAt}</td>
              <td className="px-1 px-lg-2 py-3">{item.countUsed}</td>
              <td className="px-1 px-lg-2 py-3">{item.actions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
