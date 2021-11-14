import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getProfileInfo } from "../../../redux/actions/profileAction";
import { IParams, IUser } from "../../../utils/TypeScript";
import Loading from "../../alert/Loading";
import ProfileHeader from "../ProfileHeader";
import ProfileBlogs from "../ProfileBlogs";
import ProfileInfoSideBar from "./ProfileInfoSideBar";
import { useHistory, useParams } from "react-router";
import { useAppSelector } from "../../../hooks/storeHooks";

interface IProps {
  id: string;
}

const ProfileInfo = ({ id }: IProps) => {
  const { profileInfo, userBlogs, alert } = useAppSelector((state) => state);
  const [blogsCount, setBlogsCount] = useState(0);
  const [user, setUser] = useState<IUser>();

  const divRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { slug } = useParams<IParams>();
  const history = useHistory();
  useEffect(() => {
    if (alert.errors) history.push("/");
  }, [alert.errors, history]);
  useEffect(() => {
    if (!id) return;
    if (profileInfo.every((user) => user._id !== id)) {
      dispatch(getProfileInfo(id));
    } else {
      const existUser = profileInfo.find((user) => user._id === id);
      if (!existUser) return;

      setUser(existUser);
    }
  }, [dispatch, id, profileInfo]);

  useEffect(() => {
    const data = userBlogs.find((item) => item.id === slug);

    if (data) setBlogsCount(data.count || 0);
  }, [slug, userBlogs]);

  if (!user) return <Loading />;

  const info = {
    setRef: divRef,
    name: user.name,
    surname: user.surname,
    coverImage: user.coverImg,
    avatarImage: user.avatar,
    heading: user.heading,
    _id: slug,
  };

  return (
    <>
      <ProfileHeader info={info} />
      <div className="row">
        <ProfileInfoSideBar
          userIntro={user.intro}
          followersCount={user.followers.length}
          followingsCount={user.followings.length}
          blogsCount={blogsCount}
        />
        <div className="col-lg-9 col-md-8 col-12">
          <ProfileBlogs />
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
