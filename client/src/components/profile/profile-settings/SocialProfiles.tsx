import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storeHooks";
import { updateSocialProfiles } from "../../../redux/actions/profileAction";
import { ALERT } from "../../../redux/types/alertType";
import { FormSubmit, ISocialProfiles } from "../../../utils/TypeScript";
import { shallowEqaulity } from "../../../utils/Valid";
import Button from "../../global/Button";
import { Card, CardBody, CardHeader } from "../../global/Card";
import InputBox from "../../global/InputBox";

type ProfilesType =
  | "twitter"
  | "facebook"
  | "instagram"
  | "linkedin"
  | "youtube"
  | "website";

const SocialProfiles = () => {
  const { auth } = useAppSelector((state) => state);
  const [profiles, setProfiles] = useState<ISocialProfiles | null>(null);
  const dispatch = useDispatch();

  const handleChange = (value: string, name: ProfilesType) => {
    if (profiles) setProfiles({ ...profiles, [name]: value });
  };

  const handleUpdate = (e: FormSubmit) => {
    e.preventDefault();
    if (!profiles || !auth.user || !auth.access_token) return;
    if (!auth.user.settings || typeof auth.user.settings === "string") return;

    const token = auth.access_token;
    const userSettings = auth.user.settings;
    const oldProfiles = userSettings.socialProfiles;
    const isEqual = shallowEqaulity(oldProfiles, profiles);

    if (isEqual) {
      const errors = "The data does not changed!";
      dispatch({ type: ALERT, payload: { errors } });
      return;
    }

    dispatch(updateSocialProfiles(userSettings._id, profiles, token));
  };

  useEffect(() => {
    if (!auth.user || !auth.user.settings) return;
    if (typeof auth.user.settings === "string") return;

    setProfiles(auth.user.settings.socialProfiles);
  }, [auth.user]);

  const inputs: {
    label: ProfilesType;
    hint: string;
    placeholder: string;
    value: string;
  }[] = [
    {
      label: "twitter",
      value: profiles ? profiles.twitter : "",
      hint: "Add your Twitter username (e.g. jonsmith)",
      placeholder: "Twitter Profile Name",
    },
    {
      label: "facebook",
      value: profiles ? profiles.facebook : "",
      hint: "Add your facebook username (e.g. jonsmith).",
      placeholder: "Facebook Profile Name",
    },
    {
      label: "instagram",
      value: profiles ? profiles.instagram : "",
      hint: "Add your instagram username (e.g. jonsmith).",
      placeholder: "Instagram Profile Name",
    },
    {
      label: "linkedin",
      value: profiles ? profiles.linkedin : "",
      hint: "Add your linkedin profile URL.",
      placeholder: "Linkedin profile URL",
    },
    {
      label: "youtube",
      value: profiles ? profiles.youtube : "",
      hint: "Add your youtube channel URL.",
      placeholder: "Youtube channel URL",
    },
    {
      label: "website",
      value: profiles ? profiles.website : "",
      hint: "Add your websit URL.",
      placeholder: "WebSite URL",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <h5 className="m-0">Social Profiles</h5>
        <p className="text-secondary m-0">
          Add your socials profile links in below social profiles.
        </p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleUpdate}>
          {inputs.map((item) => (
            <InputBox
              key={item.label}
              type="text"
              label={item.label}
              row
              defaultValue={item.value}
              labelClass="fw-semi-bold"
              children={<p className="text-muted small">{item.hint}</p>}
              placeholder={item.placeholder}
              callbackValue={(str) => handleChange(str, item.label)}
            />
          ))}

          <div className="text-end">
            <Button color="purple" type="submit">
              Save Social Profile
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default SocialProfiles;
