import React from "react";
import { IArchiveDate } from "../../../redux/types/archiveType";
import ActiveLink from "../../global/ActiveLink";
import FlexBox from "../../global/FlexBox";

interface IProps {
  archives: IArchiveDate[];
  showTitle?: boolean;
}

const ArchiveSection = ({ archives, showTitle }: IProps) => {
  return (
    <>
      {showTitle && (
        <div className="pb-4">
          <h5 className={`card-title text-capitalize m-0`}>Archive</h5>
        </div>
      )}
      <div>
        {archives.map((item) => (
          <ActiveLink
            color="link"
            to={`/archive?date=${item.createdAt}`}
            key={item.monthName}
          >
            <FlexBox justify="between" className="my-1 small">
              <span>
                {item.monthName} {item.createdAt.slice(0, 4)}
              </span>
              <span>{item.total}</span>
            </FlexBox>
          </ActiveLink>
        ))}
      </div>
    </>
  );
};

export default ArchiveSection;
