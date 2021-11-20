import React from "react";
import { ITag } from "../../../utils/TypeScript";
import ActiveLink from "../../global/ActiveLink";

interface IProps {
  tags: ITag[];
  showTitle?: boolean;
}
const TagsSection = ({ tags, showTitle }: IProps) => {
  return (
    <>
      {showTitle && (
        <div className="pb-4">
          <h5 className={`card-title text-capitalize m-0`}>Top Tags</h5>
        </div>
      )}
      <div>
        {tags.slice(0, 10).map((item) => (
          <ActiveLink
            key={item.name}
            to={`/results?tag=${item._id}`}
            className="btn border text-link btn-sm m-1"
          >
            #{item.name}
          </ActiveLink>
        ))}
      </div>
    </>
  );
};

export default TagsSection;
