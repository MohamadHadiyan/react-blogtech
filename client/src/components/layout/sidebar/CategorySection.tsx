import React from "react";
import { ICategory } from "../../../utils/TypeScript";
import ActiveLink from "../../global/ActiveLink";
import FlexBox from "../../global/FlexBox";

interface IProps {
  categories: ICategory[];
  showTitle?: boolean;
}
const CategorySection = ({ categories, showTitle }: IProps) => {
  return (
    <>
      {showTitle && (
        <div className="pb-4">
          <h5 className={`card-title text-capitalize m-0`}>Categories</h5>
        </div>
      )}
      <div>
        {categories.map(
          (cate) =>
            cate.count > 0 && (
              <ActiveLink
                color="link"
                to={`/blogs/${cate.name}`}
                key={cate.name}
              >
                <FlexBox justify="between" className="my-1">
                  <span>{cate.name}</span>
                  <span>{cate.count}</span>
                </FlexBox>
              </ActiveLink>
            )
        )}
      </div>
    </>
  );
};

export default CategorySection;
