import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/storeHooks";
import { updateFollows } from "../../redux/actions/profileAction";
import { TColor } from "../../utils/TypeScript";
import LoadingButton from "../global/LoadingButton";

interface IProps {
  followed_id: string;
  border?: boolean;
  color?: TColor;
}
const UserFollow = ({ followed_id, border, color }: IProps) => {
  const { auth } = useAppSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [followed, setFollowed] = useState(false);
  const dispatch = useDispatch();

  const handleFollow = () => {
    if (!auth.user || !auth.access_token || !followed_id) return;

    setLoading(true);
    dispatch(
      updateFollows({
        followed_id,
        user_id: auth.user._id,
        actionType: followed ? "remove" : "add",
        token: auth.access_token,
      })
    );
  };

  useEffect(() => {
    if (!auth.user || !auth.access_token || !followed_id) return;

    const user = auth.user;
    const followed =
      user.followings &&
      user.followings.some((item) =>
        typeof item === "string"
          ? item === followed_id
          : item._id === followed_id
      )
        ? true
        : false;

    setFollowed(followed);
    setLoading(false);
  }, [auth.access_token, auth.user, followed_id]);

  if (!auth.user || !auth.access_token) return null;

  return (
    <LoadingButton
      onClick={handleFollow}
      show={followed}
      loading={loading}
      title="Follow"
      border={border}
      color={typeof color === "string" ? color : followed ? "" : "purple"}
      width={{ before: 130, after: 150 }}
      affterChild={
        <>
          <i className="fas fa-user-minus me-2" />
          UnFollow
        </>
      }
      beforeChild={
        <>
          <i className="fas fa-user-plus me-2" />
          Follow
        </>
      }
    />
  );
};

export default UserFollow;
