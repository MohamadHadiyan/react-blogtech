import { IUserCard } from "../../../utils/TypeScript";
import ActiveLink from "../../global/ActiveLink";
import Avatar from "../../global/Avatar";
import { DefaultDropDownMenu, MenuItemType } from "../../global/Dropdown";
import FlexBox, { Col } from "../../global/FlexBox";
import UserFollow from "../UserFollow";

const UserCard = ({ user, tab }: { user: IUserCard; tab?: string }) => {
  const menuItems: MenuItemType[] = [
    {
      items: [
        {
          title: "share",
          icon: <i className="fas fa-share-alt pe-2" />,
          className: "py-2",
        },
        {
          title: "Block",
          icon: <i className="fas fa-user-slash pe-2" />,
          className: "py-2",
        },
      ],
    },
  ];

  if (tab === "followings")
    menuItems[0].items.unshift({
      icon: <UserFollow followed_id={user._id} color="" />,
      className: "ps-1",
    });

  return (
    <Col lg="6">
      <FlexBox justify="between" className="border rounded p-2">
        <ActiveLink
          to={`/profile/${user._id}`}
          className="d-flex align-items-end flex-wrap"
          color="link"
        >
          <Avatar size="2x" src={user.avatar} rounded="3" />
          <div className="ms-2">
            <h5 className="d-inline-block">
              {user.name} {user.surname ? user.surname : ""}
            </h5>
          </div>
        </ActiveLink>
        <DefaultDropDownMenu
          menuItems={menuItems}
          transform={"translate(-30px, 0px)"}
        />
      </FlexBox>
    </Col>
  );
};

export default UserCard;
