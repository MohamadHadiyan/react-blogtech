import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storeHooks";
import { updateUserInterface } from "../../../redux/actions/profileAction";
import { IUserInterface, TColor } from "../../../utils/TypeScript";
import RadioButton from "../../form-elements/RadioButton";
import Button from "../../global/Button";
import { Card, CardBody, CardHeader } from "../../global/Card";
import FlexBox, { Col } from "../../global/FlexBox";
import InputBox from "../../global/InputBox";

const UserInterface = () => {
  const { auth } = useAppSelector((state) => state);
  const [performance, SetPerformance] = useState<IUserInterface | null>(null);
  const dispatch = useDispatch();

  const handleUpdateInterface = (userInterface: IUserInterface) => {
    if (!auth.user || !auth.access_token || !auth.user.settings) return;
    if (typeof auth.user.settings === "string") return;

    const settings_id = auth.user.settings._id;
    const token = auth.access_token;
    dispatch(updateUserInterface(settings_id, userInterface, token));
  };

  const handleChangeTheme = (name: "dark" | "light") => {
    if (!performance) return;

    if (name === "dark") {
      document.documentElement.classList.add("dark");
      window.localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      window.localStorage.removeItem("theme");
    }
    const data = { ...performance, themeMode: name };
    handleUpdateInterface(data);
    SetPerformance(data);
  };

  const handleChangeFavColor = (name: TColor) => {
    if (!performance) return;

    if (name !== "purple") {
      document.documentElement.classList.remove(
        `fav-${performance.favouriteColor}`
      );

      document.documentElement.classList.add(`fav-${name}`);
      window.localStorage.setItem("fav_color", `${name}`);
    } else {
      document.documentElement.classList.remove(
        `fav-${performance.favouriteColor}`
      );
      window.localStorage.removeItem("fav_color");
    }

    const data = { ...performance, favouriteColor: name };
    handleUpdateInterface(data);
    SetPerformance(data);
  };

  const handleHideNavigation = (checked: boolean) => {
    if (!performance) return;
    const nav = window.localStorage.getItem("right_nav");

    if (nav) {
      window.localStorage.removeItem("right_nav");
    } else if (checked) {
      window.localStorage.setItem("right_nav", "hide");
    }

    const data = { ...performance, rightNavigation: checked };
    handleUpdateInterface(data);
    SetPerformance(data);
  };

  useEffect(() => {
    if (!auth.user || !auth.user.settings) return;
    if (typeof auth.user.settings === "string") return;

    SetPerformance(auth.user.settings.userInterface);
  }, [auth.user]);

  const ColorButton = ({ color }: { color: TColor }) => (
    <Button
      className={`p-0`}
      onClick={() => handleChangeFavColor(color)}
      color={color}
      style={{ width: "30px", height: "30px" }}
    >
      {performance && performance.favouriteColor === color && (
        <span
          className="rounded-circle d-block bg-light m-auto"
          style={{ width: "12px", height: "12px" }}
        ></span>
      )}
    </Button>
  );

  return (
    <Card>
      <CardHeader>
        <h5 className="m-0">Interface</h5>
      </CardHeader>
      <CardBody>
        <FlexBox row wrap className="py-3 py-xl-4 g-0 border-bottom">
          <Col sm="4">
            <h6 className="m-0">Theme</h6>
          </Col>
          <Col sm="8">
            <FlexBox wrap justify="around" className="mt-3 mt-sm-0">
              <RadioButton
                name="theme"
                defaultChecked={
                  performance ? performance.themeMode === "light" : false
                }
                label="Light"
                onChange={() => handleChangeTheme("light")}
              />
              <RadioButton
                name="theme"
                defaultChecked={
                  performance ? performance.themeMode === "dark" : false
                }
                label="Dark"
                onChange={() => handleChangeTheme("dark")}
              />
            </FlexBox>
          </Col>
        </FlexBox>
        <FlexBox row wrap className="py-3 py-xl-4 g-0 border-bottom">
          <Col sm="4">
            <h6 className="m-0">Favourite Color</h6>
          </Col>
          <Col
            sm="8"
            className="d-flex around justify-content-around mt-3 mt-sm-0"
          >
            <button
              className="btn shadow-sm p-0"
              onClick={() => handleChangeFavColor("purple")}
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: "#754ffe",
              }}
            >
              {performance && performance.favouriteColor === "purple" && (
                <span
                  className="rounded-circle d-block bg-light m-auto"
                  style={{ width: "12px", height: "12px" }}
                ></span>
              )}
            </button>
            <ColorButton color="primary" />
            <ColorButton color="success" />
            <ColorButton color="danger" />
            <ColorButton color="info" />
            <ColorButton color="warning" />
            <ColorButton color="secondary" />
          </Col>
        </FlexBox>

        <div className="py-3 py-xl-4 border-bottom">
          <h6 className="m-0">High contrast</h6>
          <InputBox
            type="checkbox"
            row
            firstlabel
            callbackChecked={(checked) =>
              SetPerformance(performance ? { ...performance } : null)
            }
            defaultChecked={true}
            boxClassName={`mb-0 g-0`}
            labelClass="text-secondary pb-0"
            label="Flipping this switch improves legibility by increasing the contrast between text, background, and border color."
          />
        </div>
        <div className="pt-3 pt-xl-4">
          <h6 className="m-0">Show right navigation</h6>
          <InputBox
            type="checkbox"
            row
            firstlabel
            defaultChecked={performance ? performance.rightNavigation : false}
            callbackChecked={handleHideNavigation}
            boxClassName={`mb-0 g-0`}
            labelClass="text-secondary pb-0"
            label="When you flip this switch, the right navigation will no longer be pinned to the right of the page."
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default UserInterface;
