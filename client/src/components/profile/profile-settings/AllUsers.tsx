import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storeHooks";
import { getAllUsers } from "../../../redux/actions/allUsersAction";
import { IUserCard } from "../../../utils/TypeScript";
import Loading from "../../alert/Loading";
import { Card, CardBody, CardHeader } from "../../global/Card";
import FlexBox from "../../global/FlexBox";
import SearchBox from "../SearchBox";
import UserCard from "./UserCard";

const AllUsers = () => {
  const { auth, allUsers } = useAppSelector((state) => state);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUserCard[]>([]);
  const [searchUser, setSearchUser] = useState<IUserCard>();

  const handleSearch = (name: string) => {
    const user = allUsers.find((item) => item.name === name);
    if (user) setSearchUser(user);
    else setSearchUser(undefined);
  };

  useEffect(() => {
    setUsers(allUsers);
    setLoading(false);
  }, [allUsers]);

  useEffect(() => {
    if (!auth.user || !auth.access_token || auth.user.role !== "admin") return;
    setLoading(true);
    dispatch(getAllUsers(auth.user, auth.access_token));
  }, [auth.access_token, auth.user, dispatch]);

  return (
    <Card>
      <CardHeader>
        <h4 className="m-0">
          All Users
          <span className="ms-2 small text-secondary">({users.length})</span>
        </h4>
      </CardHeader>
      <div className="p-3 p-xl-4 border-bottom">
        <SearchBox handler={handleSearch} />
      </div>
      <CardBody
        className="position-relative"
        style={loading ? { height: "130px" } : {}}
      >
        <FlexBox row className="g-3">
          {loading && <Loading position="absolute" />}
          {searchUser ? (
            <UserCard user={searchUser} />
          ) : users.length ? (
            users.map((item) => <UserCard key={item._id} user={item} />)
          ) : (
            !loading && (
              <h5 className="text-center py-4 text-secondary">
                There are no Users.
              </h5>
            )
          )}
        </FlexBox>
      </CardBody>
    </Card>
  );
};

export default AllUsers;
