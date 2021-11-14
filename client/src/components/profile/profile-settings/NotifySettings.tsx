import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storeHooks";
import { UpdateNotifySettings } from "../../../redux/actions/profileAction";
import { ALERT } from "../../../redux/types/alertType";
import { FormSubmit, INotifySettings } from "../../../utils/TypeScript";
import { shallowEqaulity } from "../../../utils/Valid";
import Button from "../../global/Button";
import { Card, CardBody, CardHeader } from "../../global/Card";
import FlexBox from "../../global/FlexBox";
import InputBox from "../../global/InputBox";

type SettingType =
  | "getNotification"
  | "security"
  | "news"
  | "profileUpdates"
  | "mentions"
  | "messages"
  | "blogComments"
  | "blogLikes"
  | "followings"
  | "commentReplies"
  | "commentLikes";

const NotifySettings = () => {
  const { auth } = useAppSelector((state) => state);
  const [settings, SetSetting] = useState<INotifySettings | null>(null);
  const dispatch = useDispatch();

  const handleUpdate = (e: FormSubmit) => {
    e.preventDefault();
    if (!settings || !auth.user || !auth.access_token) return;
    if (!auth.user.settings || typeof auth.user.settings === "string") return;

    const token = auth.access_token;
    const userSettings = auth.user.settings;
    const oldSettings = userSettings.notificationSetting;
    const isEqual = shallowEqaulity(oldSettings, settings);

    if (isEqual) {
      const errors = "The data does not changed!";
      dispatch({ type: ALERT, payload: { errors } });
      return;
    }

    dispatch(UpdateNotifySettings(userSettings._id, settings, token));
  };

  const handleChange = (name: SettingType, checked: boolean) => {
    if (name === "getNotification" && settings) {
      const { _id, __v, ...res } = settings;
      const newSettings = Object.fromEntries(
        Object.keys(res).map((key) => [key, checked])
      );
      SetSetting({ ...settings, ...newSettings });
    } else {
      SetSetting(settings ? { ...settings, [name]: checked } : null);
    }
  };

  const isChecked = (name: SettingType) => {
    return settings && settings.getNotification ? settings[name] : false;
  };

  useEffect(() => {
    if (
      !auth.user ||
      !auth.user.settings ||
      typeof auth.user.settings === "string"
    )
      return;
    SetSetting(auth.user.settings.notificationSetting);
  }, [auth.user]);

  const checkbox = (label: string, name: SettingType) => (
    <InputBox
      type="checkbox"
      row
      firstlabel
      callbackChecked={(checked) => handleChange(name, checked)}
      defaultChecked={isChecked(name)}
      boxClassName={`mb-0 g-0 `}
      label={label}
    />
  );

  return (
    <Card>
      <CardHeader>
        <FlexBox justify="between">
          <div>
            <h5 className="m-0">Notifications</h5>
            <p className="m-0 text-secondary">
              You will get only notifications what have enabled.
            </p>
          </div>
          <InputBox
            type="checkbox"
            callbackChecked={(checked) =>
              handleChange("getNotification", checked)
            }
            defaultChecked={isChecked("getNotification")}
            className="m-0"
          />
        </FlexBox>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleUpdate}>
          <div className="border-bottom">
            <h6 className="m-0">Security Alerts</h6>
            {checkbox(
              "Email me whenever encounter unusual activity",
              "security"
            )}
          </div>
          <div className="border-bottom">
            <h6 className="m-0">News</h6>
            {checkbox("Notify me by email about sales and latest news", "news")}
          </div>
          <div className="border-bottom">
            <h6 className="mt-3 mb-0">Blog Comment Notification</h6>
            {checkbox(
              "Notify me when someone comments on one of my Blogs",
              "blogComments"
            )}
          </div>
          <div className="border-bottom">
            <h6 className="mt-3 mb-0">Blog Likes Notification</h6>
            {checkbox(
              "Notify me when someone Likes one of my Blogs",
              "blogLikes"
            )}
          </div>
          <div className="border-bottom">
            <h6 className="mt-3 mb-0">Folowing Notification</h6>
            {checkbox("Notify me when someone follows me", "followings")}
          </div>
          <div className="border-bottom">
            <h6 className="mt-3 mb-0">Comment Reply Notification</h6>
            {checkbox(
              "Notify me when someone leaves a comment on one of my comments",
              "commentReplies"
            )}
          </div>
          <div>
            <h6 className="mt-3 mb-0">Comment Likes Notification</h6>
            {checkbox(
              "Notify me when someone leaves an upvote on one of my comments",
              "commentLikes"
            )}
          </div>
          <div className="text-end mt-3">
            <Button type="submit" color="purple">
              Update
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default NotifySettings;
