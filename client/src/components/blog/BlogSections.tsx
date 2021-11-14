import React from "react";
import Author from "../global/Author";
import FlexBox from "../global/FlexBox";
import { BlogLink, BlogText } from "./BlogComponents";

type TInfo = {
  id: string;
  avatar: string;
  name: string;
};

interface IAuthor {
  info: TInfo;
}

export const AuthorBox = ({ info }: IAuthor) => {
  return (
    <FlexBox justify="between">
      <Author id={info.id} avatar={info.avatar} name={info.name} />
      <div>
        <BlogText className="fw-semi-bold text-secondary">Share</BlogText>
        <BlogLink to="#">
          <i className="fab fa-facebook-square purple-link" />
        </BlogLink>
        <BlogLink to="#">
          <i className="fab fa-twitter purple-link" />
        </BlogLink>
        <BlogLink to="#">
          <i className="fab fa-linkedin purple-link" />
        </BlogLink>
        <BlogLink to="#">
          <i className="fab fa-instagram-square purple-link " />
        </BlogLink>
      </div>
    </FlexBox>
  );
};
