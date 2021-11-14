import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storeHooks";
import {
  createTag,
  deleteTag,
  getTagsNameByPage,
  updateTag,
} from "../../../redux/actions/tagAction";
import { ALERT } from "../../../redux/types/alertType";
import { getAPI } from "../../../utils/FetchData";
import getUniqueID from "../../../utils/GetUniqueID";
import { FormSubmit, ITag, IUserCard } from "../../../utils/TypeScript";
import Loading from "../../alert/Loading";
import ActiveLink from "../../global/ActiveLink";
import Button from "../../global/Button";
import { Card, CardBody, CardHeader } from "../../global/Card";
import DialogBox from "../../global/DialogBox";
import FlexBox, { Col } from "../../global/FlexBox";
import InputBox from "../../global/InputBox";
import Pagination from "../../global/Pagination";
import SearchBox from "../SearchBox";

const Tags = () => {
  const { auth, tags } = useAppSelector((state) => state);
  const tableHead = ["Name", "creator", "Created", "Used", "Actions"];
  const [search, setSearch] = useState<ITag[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [edit, setEdit] = useState<ITag | null>(null);
  const [show, setShow] = useState(false);
  const [tagId, setTagId] = useState("");
  const [page, setPage] = useState(1);
  const [skip, setSkip] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    if (edit) {
      setName(edit.name);
    }
  }, [edit]);

  const cancel = () => {
    setName("");
    setEdit(null);
  };

  const handleSubmit = (value: string) => {
    if (!auth.access_token) return;

    cancel();
    setName("");

    if (edit) {
      if (edit.name === value) return;
      const data = { ...edit, name: value };
      dispatch(updateTag(data, auth.access_token));
    } else {
      dispatch(createTag(value, auth.access_token));
    }
  };

  const handleSearch = (value: string) => {
    if (!value) return setSearch([]);

    const data = tags.names.find((item) => item.name === value);
    if (data) {
      return setSearch([data]);
    }

    setLoading(true);
    getAPI(`tag/${value}`)
      .then((res) => {
        setSearch(res.data);
        setLoading(false);
      })
      .catch((res) => {
        dispatch({ type: ALERT, payload: { errors: res.response.data.msg } });
        setLoading(false);
      });
  };

  const handleConfirm = (value: boolean) => {
    if (!auth.access_token) return;
    setShow(false);

    if (!value || !tagId) return;
    dispatch(deleteTag(tagId, auth.access_token));
  };

  const handleDelete = (id: string) => {
    setTagId(id);
    setShow(true);
  };

  const handlePagination = (num: number) => {
    setPage(num);
    if (tags.pages.includes(num)) return;

    setLoading(true);
    dispatch(getTagsNameByPage(num));
  };

  useEffect(() => {
    setLoading(false);
  }, [tags]);

  useEffect(() => {
    if (tags.names[page * 10 - 10]) setSkip(page);
  }, [page, tags.names]);

  const tagNames = search.length
    ? search
    : tags.names.slice((skip - 1) * 10, skip * 10);
  const tagRowsBody = tagNames.map((item) => ({
    title: item.name,
    createdAt: new Date(item.createdAt as string).toLocaleDateString(),
    countUsed: item.consumers.length,
    creator: item.creator as IUserCard,
    actions: [
      <Button
        key={getUniqueID()}
        size="sm"
        color="success-soft"
        className="me-1"
        onClick={() => setEdit(item)}
      >
        <i className="fas fa-edit" />
      </Button>,
      <Button
        key={getUniqueID()}
        size="sm"
        color="danger-soft"
        className="mt-1 mt-sm-0"
        onClick={() => handleDelete(item._id)}
      >
        <i className="fas fa-trash pe-1 pe-sm-0" />
      </Button>,
    ],
  }));

  return (
    <Card>
      <CardHeader>
        <h4 className="mb-3">{`Tags (${tags.count})`}</h4>
        <SearchBox handler={handleSearch} />
      </CardHeader>

      <TagCreationForm
        handleSubmit={handleSubmit}
        handleCancel={cancel}
        defaultValue={name}
        edit={!!edit}
      />
      <CardBody className="position-relative">
        {loading && (
          <div
            className="position-absolute absolute-center rounded w-100 h-100"
            style={{ background: "#bebebe3a", zIndex: 10 }}
          >
            <Loading position="absolute" />
          </div>
        )}
        <Table
          tableData={{
            headerCells: tableHead,
            body: tagRowsBody,
          }}
        />
        {tags.count > 9 && (
          <Pagination
            count={Math.floor(tags.count / 10) + 1}
            handler={handlePagination}
            page={page}
            className="mt-4"
          />
        )}
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

interface IForm {
  edit: boolean;
  defaultValue: string;
  handleSubmit: (value: string) => void;
  handleCancel: () => void;
}

const TagCreationForm = ({
  edit,
  defaultValue,
  handleSubmit,
  handleCancel,
}: IForm) => {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(defaultValue);
  }, [defaultValue]);

  const handleForm = (e: FormSubmit) => {
    e.preventDefault();

    if (name.trim()) handleSubmit(name);
  };

  return (
    <div className="p-3 p-xl-4 border-bottom">
      <form onSubmit={handleForm}>
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
  );
};

type BodyType = {
  title: string;
  createdAt: string;
  countUsed: number;
  creator: IUserCard;
  actions: React.ReactNode[];
};

type TableType = {
  headerCells: string[];
  body: BodyType[];
};

interface ITable {
  tableData: TableType;
}

const Table = ({ tableData }: ITable) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead>
          <tr>
            {tableData.headerCells.map((item) => (
              <th className="text-secondary" key={getUniqueID()}>
                {item}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableData.body.map((item, i) => (
            <tr key={getUniqueID()}>
              <td className="fw-semi-bold px-2">{item.title}</td>
              <td className="fw-semi-bold px-2">
                <ActiveLink color="link" to={`/profile/${item.creator._id}`}>
                  {item.creator.name}
                </ActiveLink>
              </td>
              <td className="px-1 px-lg-2">{item.createdAt}</td>
              <td className="px-1 px-lg-2">{item.countUsed}</td>
              <td className="px-1 px-lg-2 pb-0 pt-1">{item.actions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tags;
