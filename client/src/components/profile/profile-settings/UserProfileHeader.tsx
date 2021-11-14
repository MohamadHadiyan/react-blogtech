import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storeHooks";
import { updateUserImages } from "../../../redux/actions/profileAction";
import { InputChange } from "../../../utils/TypeScript";
import ProfileHeader from "../ProfileHeader";

const UserProfileHeader = () => {
  interface IHeadInfo {
    avatar: string | File;
    coverImg: string | File;
  }

  const initialState = {
    avatar: "",
    coverImg: "",
  };

  const { auth } = useAppSelector((state) => state);
  const dispatch = useDispatch();

  const [headInfo, setHeadInfo] = useState<IHeadInfo>(initialState);
  const { avatar, coverImg } = headInfo;

  const handleChangeFile = (e: InputChange) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    const { name } = e.target;

    if (files) {
      const file = files[0];
      setHeadInfo({ ...headInfo, [name]: file });
    }
  };

  const submitHandler = () => {
    if (avatar || coverImg) {
      const data = { avatar: avatar as File, coverImg: coverImg as File, auth };
      dispatch(updateUserImages(data));
    }
  };

  if (!auth.user) return <div />;

  const avatarImage = avatar ? URL.createObjectURL(avatar) : auth.user.avatar;
  const coverImage = coverImg
    ? URL.createObjectURL(coverImg)
    : auth.user.coverImg;

  const info = {
    name: auth.user.name,
    surname: auth.user.surname,
    coverImage,
    avatarImage,
    heading: auth.user.heading,
  };

  return (
    <ProfileHeader
      info={info}
      mutable={true}
      coverHandler={handleChangeFile}
      avatarHandler={handleChangeFile}
      submitHandler={submitHandler}
    />
  );
};

export default UserProfileHeader;
