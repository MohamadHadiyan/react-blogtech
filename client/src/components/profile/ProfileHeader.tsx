import React, { useState } from "react";
import { useEffect } from "react";
import { useMedia } from "../../hooks/useMedia";
import { InputChange } from "../../utils/TypeScript";
import Button from "../global/Button";
import FlexBox, { Col } from "../global/FlexBox";
import UserFollow from "./UserFollow";

type handlerType = (e: InputChange) => void;

type InfoType = {
  coverImage: string;
  avatarImage: string;
  heading: string;
  name: string;
  surname: string;
  verified?: boolean;
  _id?: string;
};

type HeaderType =
  | {
      mutable: true;
      avatarHandler: handlerType;
      coverHandler: handlerType;
      submitHandler: () => void;
      info: InfoType;
    }
  | {
      mutable?: false;
      avatarHandler?: never;
      coverHandler?: never;
      submitHandler?: never;
      info: InfoType;
    };

const ProfileHeader = ({
  mutable = false,
  avatarHandler,
  coverHandler,
  submitHandler,
  ...res
}: HeaderType) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const media = useMedia("(min-width: 768px)");

  useEffect(() => {
    if (media) {
      setIsDesktop(true);
    } else {
      setIsDesktop(false);
    }
  }, [media]);

  return (
    <FlexBox row>
      <Col col="12" className="mb-0 mb-md-4">
        <div
          className={`card btn-reveal-trigger shadow-sm rounded-0 ${
            isDesktop ? "rounded-bottom" : ""
          } border-0`}
        >
          <div
            className={`card-header position-relative min-vh-30 ${
              isDesktop ? "mb-6" : "mb-5"
            } `}
            style={isDesktop ? {} : { minHeight: "20vh" }}
          >
            <CoverImg
              imgUrl={res.info.coverImage}
              mutable={mutable}
              handler={coverHandler}
            />
          </div>
          <UserInfoSection
            info={res.info}
            mutable={mutable}
            handler={avatarHandler}
            submitHandler={submitHandler}
            isDesktop={isDesktop}
          />
        </div>
      </Col>
    </FlexBox>
  );
};

interface IProps {
  verified?: boolean;
  imgUrl: string;
  mutable?: boolean;
  handler?: handlerType;
}

const CoverImg = ({ imgUrl, mutable, handler }: IProps) => {
  return (
    <div className="cover-image">
      <div
        className="bg-holder rounded-bottom-0"
        style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : {}}
      >
        {mutable && (
          <>
            <input
              type="file"
              name="coverImg"
              className="d-none"
              id="upload-cover-image"
              onChange={handler}
            />
            <label
              htmlFor="upload-cover-image"
              className="cover-image-file-input"
            >
              <i className="fas fa-camera" />
              <span className="ps-2">Change Cover Photo</span>
            </label>
          </>
        )}
      </div>
    </div>
  );
};

const Avatar = ({ imgUrl, mutable, verified, handler }: IProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="col-auto position-relative">
      <div className="avatar-5xl  shadow-sm img-thumbnail rounded-circle mb-4">
        <div className="h-100 w-100 rounded-circle overflow-hidden position-relative text-center">
          {imgUrl && <img src={imgUrl} alt="avatar" />}
          {mutable && (
            <>
              <input
                type="file"
                name="avatar"
                id="file-upload"
                className="d-none"
                onChange={handler}
              />
              <label
                htmlFor="file-upload"
                className="mb-0 overlay-icon d-flex flex-center"
              >
                <span className="bg-holder overlay overlay-0"></span>
                <span className="z-index-1 text-white dark__text-white text-center fs--1">
                  <i className="fas fa-camera" />
                  <span className="d-block">Upload</span>
                </span>
              </label>
            </>
          )}
        </div>
        {verified && (
          <div
            className="verified"
            onMouseEnter={() => setShowTooltip(!showTooltip)}
            onMouseLeave={() => setShowTooltip(!showTooltip)}
          >
            🗸
            {showTooltip && (
              <div className="tooltip fade show t-0 bs-tooltip-top verified-text">
                <span className="bg-dark px-2 py-1 small rounded">
                  Verified
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface IUserInfo {
  info: InfoType;
  isDesktop: boolean;
  submitHandler?: () => void;
  mutable?: boolean;
  handler?: handlerType;
}

const UserInfoSection = ({ info, ...res }: IUserInfo) => {
  return (
    <FlexBox
      justify="between"
      items="end"
      className={`w-100 position-absolute bottom-0 px-2 px-lg-4 mb-md-2`}
    >
      <FlexBox items="end">
        <Avatar
          imgUrl={info.avatarImage}
          mutable={res.mutable}
          handler={res.handler}
          verified={info.verified}
        />
        <div className="col text-capitalize ms-2 ms-lg-4">
          {res.isDesktop ? (
            <h3 className="title">{`${info.name} ${
              info.surname ? info.surname : ""
            }`}</h3>
          ) : (
            <h5 className="title">{`${info.name} ${
              info.surname ? info.surname : ""
            }`}</h5>
          )}
          {info.heading && res.isDesktop && (
            <div className="text-secondary text-bold small">{info.heading}</div>
          )}
        </div>
      </FlexBox>
      <div className="mb-1">
        {res.mutable ? (
          <Button onClick={res.submitHandler} color="purple">
            {res.isDesktop ? "Update" : <i className="fas fa-upload" />}
          </Button>
        ) : (
          info._id && <UserFollow followed_id={info._id} border />
        )}
      </div>
    </FlexBox>
  );
};

export default ProfileHeader;
