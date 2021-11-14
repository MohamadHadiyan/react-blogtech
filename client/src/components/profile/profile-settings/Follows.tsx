import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storeHooks";
import {
  getFollowers,
  getFollowings,
} from "../../../redux/actions/profileAction";
import { IUserCard } from "../../../utils/TypeScript";
import Loading from "../../alert/Loading";
import { Card, CardBody, CardHeader } from "../../global/Card";
import FlexBox from "../../global/FlexBox";
import SearchBox from "../SearchBox";
import UserCard from "./UserCard";

const Follows = ({ tab }: { tab: "followers" | "followings" }) => {
  const { auth } = useAppSelector((state) => state);
  const [fUsers, setFUsers] = useState<IUserCard[]>([]);
  const [searchFUser, setSearchFUser] = useState<IUserCard>();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSearch = (name: string) => {
    if (!auth.user) return;
    const fUser = auth.user[tab].find((item) => item.name === name);
    if (fUser) setSearchFUser(fUser);
    else setSearchFUser(undefined);
  };

  useEffect(() => {
    if (!auth.access_token || !auth.user) return;
    const follows =
      tab === "followers" ? auth.user.followers : auth.user.followings;

    if (!follows || !follows.length) return setFUsers([]);

    if (typeof follows[0] !== "string") {
      setFUsers(follows);
      setLoading(false);
    } else {
      setLoading(true);
      if (tab === "followers") {
        dispatch(getFollowers(auth.user._id, auth.access_token));
      } else {
        dispatch(getFollowings(auth.user._id, auth.access_token));
      }
    }
  }, [auth.access_token, auth.user, dispatch, tab]);

  if (!auth.access_token || !auth.user) return <div />;

  const follows =
    tab === "followers" ? auth.user.followers : auth.user.followings;
  const title = tab[0].toUpperCase() + tab.slice(1);

  return (
    <Card>
      <CardHeader>
        <h4 className="m-0">
          {title}
          <span className="ms-2">
            {follows && !!follows.length ? `( ${follows.length} )` : ""}
          </span>
        </h4>
      </CardHeader>
      {follows && !!follows.length && (
        <div className="p-3 p-xl-4 border-bottom">
          <SearchBox handler={handleSearch} />
        </div>
      )}
      <CardBody
        className="position-relative"
        style={loading ? { height: "130px" } : {}}
      >
        <FlexBox row className="g-3">
          {loading && <Loading position="absolute" />}
          {searchFUser ? (
            <UserCard user={searchFUser} tab={tab} />
          ) : fUsers.length ? (
            fUsers.map((item) => (
              <UserCard key={item._id} user={item} tab={tab} />
            ))
          ) : (
            !loading && (
              <h5 className="text-center py-4 text-secondary">
                There are no {title}.
              </h5>
            )
          )}
        </FlexBox>
      </CardBody>
    </Card>
  );
};

export default Follows;
