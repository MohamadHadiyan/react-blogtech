import React from "react";
import { MenuItemType } from "./Dropdown";

const ShareLink = (link: string, divider?: boolean) => {
  const menuItems: MenuItemType[] = [
    {
      header: "Share",
      divider,
      items: [
        {
          icon: <i className="fab fa-facebook me-2" />,
          title: "Facebooke",
          to: {
            pathname: `https://www.facebook.com/sharer/sharer.php?u=${link}&feature=share&display=popup`,
          },
          target: "_blank",
        },
        {
          icon: <i className="fab fa-twitter me-2" />,
          title: "Twitter",
          to: {
            pathname: `http://twitter.com/share?url=${link}&text=Simple Share Buttons&hashtags=simplesharebuttons`,
          },
          target: "_blank",
        },
        {
          icon: <i className="fab fa-linkedin me-2" />,
          title: "Linked In",
          to: {
            pathname: `https://www.linkedin.com/sharing/share-offsite/?url=${link}&feature=share`,
          },
          target: "_blank",
        },
        {
          icon: <i className="fas fa-copy me-2" />,
          title: "Copy Link",
          onClick: () => {
            navigator.clipboard.writeText(link);
          },
        },
      ],
    },
  ];

  return menuItems;
};

export default ShareLink;
