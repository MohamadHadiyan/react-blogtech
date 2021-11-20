import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storeHooks";
import { updateUserPrivacy } from "../../../redux/actions/profileAction";
import { UserPrivacyType } from "../../../utils/TypeScript";
import Button from "../../global/Button";
import { Card, CardBody, CardHeader } from "../../global/Card";
import { DefaultDropDownMenu, MenuItemType } from "../../global/Dropdown";
import FlexBox, { Col } from "../../global/FlexBox";
import InputBox from "../../global/InputBox";

const PrivacySettings = () => {
  const { auth } = useAppSelector((state) => state);
  const [privacy, setPrivacy] = useState<UserPrivacyType | "select">("select");
  const dispatch = useDispatch();

  const handleUpdate = () => {
    if (!auth.access_token || !auth.user || privacy === "select") return;

    dispatch(updateUserPrivacy({ ...auth.user, privacy }, auth.access_token));
  };

  useEffect(() => {
    if (auth.user && auth.user.privacy) setPrivacy(auth.user.privacy);
  }, [auth.user]);

  const menuItems: MenuItemType[] = [
    {
      items: [
        {
          title: "select",
          className: `${privacy === "select" ? "active" : "text-muted"}`,
        },
        {
          title: "Public",
          className: `${privacy === "public" ? "active" : ""}`,
          onClick: () => setPrivacy("public"),
        },
        {
          title: "Private",
          className: `${privacy === "private" ? "active" : ""}`,
          onClick: () => setPrivacy("private"),
        },
      ],
    },
  ];
  return (
    <Card>
      <CardHeader>
        <h5 className="m-0">Profile Privacy Settings</h5>
        <p className="m-0 text-secondary">
          Make your profile public allow other users to see what you have been
          writing on BlogTech.
        </p>
      </CardHeader>
      <CardBody>
        <FlexBox row wrap className="border-bottom pb-3 pb-lg-4 g-0">
          <Col lg="9" col="12">
            <h6 className="mb-0">Privacy privacys</h6>
            <p className="mb-3 mb-lg-0 text-secondary">
              Show your profile public and private.
            </p>
          </Col>
          <Col lg="3" col="12">
            <DefaultDropDownMenu
              icon={
                <Button
                  border
                  block
                  className="text-secondary text-capitalize d-flex justify-content-between align-items-center"
                >
                  <span className={privacy === "select" ? "text-muted" : ""}>
                    {privacy}
                  </span>{" "}
                  <i className="fas fa-chevron-down ms-auto" />{" "}
                </Button>
              }
              toggleClass="p-0"
              menuItems={menuItems}
              transform="translate(0px, 40px)"
              menuClass="w-100"
            />
          </Col>
        </FlexBox>
        <div className="mt-3 mt-lg-4 border-bottom">
          <h6 className="m-0">Profile Settings</h6>
          <p className="text-secondary">
            These controls give you the ability to customize what areas of your
            profile others are able to see.
          </p>
          <InputBox
            type="checkbox"
            row
            firstlabel
            boxClassName="mb-0"
            label="Show your profile on search engines"
          />
        </div>
        <InputBox
          type="checkbox"
          row
          firstlabel
          label="Show your profile on public"
        />
        <FlexBox justify="end">
          <Button type="submit" color="purple" onClick={handleUpdate}>
            Update information
          </Button>
        </FlexBox>
      </CardBody>
    </Card>
  );
};

export default PrivacySettings;
