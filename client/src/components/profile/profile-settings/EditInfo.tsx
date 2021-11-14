import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storeHooks";
import { updateUserInfo } from "../../../redux/actions/profileAction";
import {
  FormSubmit,
  InputChange,
  IUserProfile,
} from "../../../utils/TypeScript";
import Button from "../../global/Button";
import { Card, CardBody, CardHeader, CardTitle } from "../../global/Card";
import { Col } from "../../global/FlexBox";
import NotFound from "../../global/NotFound";

const EditInfo = () => {
  const initialState = {
    name: "",
    surname: "",
    account: "",
    password: "",
    cf_password: "",
    avatar: "",
    coverImg: "",
    heading: "",
    intro: "",
  };
  const [user, setUser] = useState<IUserProfile>(initialState);
  const dispatch = useDispatch();
  const { name, surname, heading, intro } = user;
  const { auth } = useAppSelector((state) => state);

  const handleChangeInput = (e: InputChange) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault();
    if (name || surname || heading || intro) {
      const data = {
        name,
        surname,
        heading,
        intro,
        auth,
      };
      dispatch(updateUserInfo(data));
      setUser(initialState);
    }
  };

  if (!auth.user) return <NotFound />;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Basic information</CardTitle>
      </CardHeader>
      <CardBody>
        <form className="row g-3" onSubmit={handleSubmit}>
          <Col lg="6">
            <label className="form-label" htmlFor="name">
              First Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="form-control"
              defaultValue={auth.user.name}
              onChange={handleChangeInput}
            />
          </Col>

          <Col lg="6">
            <label className="form-label" htmlFor="surname">
              Last Name
            </label>
            <input
              type="text"
              name="surname"
              id="surname"
              className="form-control"
              defaultValue={auth.user.surname}
              onChange={handleChangeInput}
            />
          </Col>

          <Col lg="6">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="form-control"
              disabled={true}
              defaultValue={auth.user.account}
              onChange={handleChangeInput}
            />
          </Col>

          <Col lg="6">
            <label className="form-label" htmlFor="phone">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="form-control"
              onChange={handleChangeInput}
            />
          </Col>

          <Col lg="12">
            <label className="form-label" htmlFor="heading">
              Heading
            </label>
            <input
              type="text"
              name="heading"
              id="heading"
              className="form-control"
              defaultValue={auth.user.heading}
              onChange={handleChangeInput}
            />
          </Col>

          <Col lg="12">
            <label className="form-label" htmlFor="intro">
              Intro
            </label>
            <textarea
              cols={30}
              rows={13}
              name="intro"
              id="intro"
              className="form-control"
              defaultValue={auth.user.intro}
              onChange={handleChangeInput}
            />
          </Col>

          <div className="col-lg-12 d-flex justify-content-end">
            <Button type="submit" color="purple">
              Update information
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default EditInfo;
