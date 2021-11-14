import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { useAppSelector } from "../../hooks/storeHooks";
import {
  getNotifications,
  updateNotificationView,
} from "../../redux/actions/notificationAction";
import { viewUserNotifications } from "../../redux/actions/profileAction";
import getDate from "../../utils/GetDate";
import { INotification } from "../../utils/TypeScript";
import Loading from "../alert/Loading";
import ActiveLink from "../global/ActiveLink";
import Avatar from "../global/Avatar";
import Button from "../global/Button";
import FlexBox from "../global/FlexBox";
import { BellIcon, ConfigIcon } from "../global/Icons";

interface IProps {
  handleRoute: (path: string) => void;
}
const Notification = ({ handleRoute }: IProps) => {
  const { auth, notifications } = useAppSelector((state) => state);
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const [notifeslist, setNotifesList] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [getedData, setGetedData] = useState(false);
  const [skip, setSkip] = useState(0);
  const [show, setShow] = useState(false);
  const ulRef = useRef<HTMLUListElement>(null);

  const total = notifications.total;
  const data = notifications.data;
  const user_id = auth.user ? auth.user._id : null;

  const handleGetNotifications = () => {
    if (!auth.user || !auth.access_token) return;

    setShow(true);

    if (total === 0 && !getedData) {
      const token = auth.access_token;
      const length = auth.user.notifications.length;
      const limit = length < 5 ? 5 : length;

      setLoading(true);
      setGetedData(true);
      dispatch(getNotifications(skip, limit, token));
      dispatch(viewUserNotifications(auth));
    }
  };

  const handleView = (notify: INotification) => {
    if (!auth.access_token) return;

    dispatch(updateNotificationView(notify, auth.access_token));
    handleRoute(notify.link);
  };

  const handleScroll = useCallback(async () => {
    if (!auth.access_token || !ulRef.current) return;

    const elem = ulRef.current;
    const calc = elem.scrollTop + 480;
    const res = calc >= elem.scrollHeight;

    if (res && !loading && data.length < total && skip < total) {
      const num =
        data.length === 0 ? 0 : 5 + skip > total ? total - 5 : 5 + skip;

      setLoading(true);
      setSkip(num);
      dispatch(getNotifications(num, 5, auth.access_token));
    }
  }, [auth.access_token, data.length, dispatch, loading, skip, total]);

  useEffect(() => {
    if (!show || !ulRef.current) return;
    const target = ulRef.current;

    target.addEventListener("scroll", handleScroll);

    return () => {
      target.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, show]);

  useEffect(() => {
    if (!show) return;
    document.documentElement.addEventListener("click", () => setShow(!show));

    return () => {
      document.documentElement.removeEventListener("click", () =>
        setShow(false)
      );
    };
  }, [show]);

  useEffect(() => {
    setNotifesList(data);
    setLoading(false);
  }, [data]);

  return (
    <div>
      <div
        onClick={handleGetNotifications}
        className={`nav-link py-lg-0 position-relative`}
        id="notify_dropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        title="Notifications"
      >
        <span className="rounded-circle border d-block avatar-md p-1 text-center">
          <BellIcon
            fill
            color={pathname === "/notifications" ? "purple" : "link"}
          />
        </span>
        {auth.user && !!auth.user.notifications.length && (
          <div
            className={`position-absolute bg-danger line-height-1 text-center rounded-circle text-white top-0 right-0`}
            style={{
              padding: "3px 0",
              width: "20px",
              height: "20px",
              fontSize: "12px",
            }}
          >
            {auth.user.notifications.length}
          </div>
        )}
      </div>
      <div
        className="dropdown-menu w-100 left-auto right-0 pb-2"
        aria-labelledby="notify_dropdown"
        style={{ minWidth: "330px" }}
      >
        <FlexBox justify="between" className="border-bottom px-2 pb-2 mb-2">
          <h6 className="p-2 m-0">Notifications</h6>
          {user_id && (
            <Button
              onClick={() =>
                handleRoute(`/profile/${user_id}?tab=notifications`)
              }
              className="rounded-circle"
            >
              <ConfigIcon fill className="text-link" />
            </Button>
          )}
        </FlexBox>
        <ul
          ref={ulRef}
          style={
            notifeslist.length > 2
              ? { maxHeight: "310px", overflowY: "scroll" }
              : {}
          }
          className="px-2"
        >
          {!!notifeslist.length
            ? notifeslist.map((item, i) => (
                <Notify
                  key={item._id}
                  handleRoute={handleRoute}
                  handleView={handleView}
                  notify={item}
                  border={i !== 0}
                />
              ))
            : !loading && (
                <li
                  className="text-center p-3 text-secondary"
                  style={{ minHeight: "80px" }}
                >
                  <BellIcon size="3x" />
                  <h5 className="mt-3 mb-2">Your notification live here</h5>
                  <p>
                    Follow to your favourite blogers to get notified about their
                    latest blogs.
                  </p>
                </li>
              )}
          {loading && (
            <li className="position-relative " style={{ minHeight: "80px" }}>
              <Loading position="absolute" size={40} />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

interface INOtifyProps {
  notify: INotification;
  handleRoute: (path: string) => void;
  handleView: (notify: INotification) => void;
  border: boolean;
}

const Notify = ({ handleRoute, notify, border, handleView }: INOtifyProps) => {
  const hash = notify.link.split("#");

  return (
    <li
      className={`d-flex justify-content-center align-items-center text-center ${
        border ? "border-top mt-1 pt-1" : ""
      }`}
    >
      <ActiveLink onClick={() => handleRoute(`/profile/${notify.sender}`)}>
        <Avatar src={notify.image} size="md" border className="me-2" />
      </ActiveLink>
      <div className="text-start">
        <ActiveLink
          onClick={() => handleRoute(`/profile/${notify.sender}`)}
          color="purple"
          className="small"
        >
          <span>{notify.title} </span>
        </ActiveLink>
        <ActiveLink
          color="link"
          onClick={() => handleView(notify)}
          to={hash[1] ? "#" + hash[1] : "#"}
        >
          <span className="small fw-normal">
            <span>{notify.description}</span>{" "}
            <span>{getDate(notify.createdAt, { fullText: true })}</span>
            {!notify.viewed && (
              <span
                className="d-inline-block bg-secondary rounded-circle ms-2"
                style={{ width: "6px", height: "6px" }}
              ></span>
            )}
          </span>
        </ActiveLink>
      </div>
    </li>
  );
};

export default Notification;
