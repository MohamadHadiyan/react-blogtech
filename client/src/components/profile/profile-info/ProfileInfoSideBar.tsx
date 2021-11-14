import { useCallback, useEffect, useState } from "react";
import Button from "../../global/Button";
import { Card } from "../../global/Card";
import FlexBox, { Col } from "../../global/FlexBox";

interface ISidBar {
  userIntro?: string;
  blogsCount: number;
  followersCount: number;
  followingsCount: number;
}
const ProfileInfoSideBar = ({
  userIntro,
  blogsCount,
  followersCount,
  followingsCount,
}: ISidBar) => {
  const [intro, setIntro] = useState("");
  const cardItems = [
    { icon: "file-alt", title: "Posts", count: blogsCount },
    { icon: "user", title: "Followers", count: followersCount },
    { icon: "user", title: "Followings", count: followingsCount },
  ];

  const handleRead = useCallback(
    (length: number) => {
      if (length < 201 && userIntro) return setIntro(userIntro);
      setIntro(userIntro ? userIntro.slice(0, 197) + "..." : "");
    },
    [userIntro]
  );

  useEffect(() => {
    if (!userIntro) return;
    handleRead(userIntro.length);
  }, [handleRead, userIntro]);

  return (
    <Col md="4" lg="3">
      {userIntro && (
        <Card className="mb-4 p-3 p-xl-4">
          <h5>About Me</h5>
          <p>{intro}</p>
          {userIntro.length > 200 && (
            <Button
              className="text-purple fw-bold ps-0"
              onClick={() => handleRead(intro.length)}
            >
              Read {intro.length > 200 ? "Less" : "More"}
            </Button>
          )}
        </Card>
      )}
      <Card className="mb-4 p-3 p-xl-4">
        {cardItems.map((item, i) => (
          <FlexBox
            justify="between"
            items="center"
            className={`${
              i === cardItems.length - 1 ? "" : "border-bottom pb-3 mb-3"
            }`}
            key={item.title + i}
          >
            <div>
              <h5 className="mb-0 fw-bold">{item.count}</h5>
              <p className="mb-0 small text-secondary">{item.title}</p>
            </div>
            <div>
              <span>
                <i className={`far fa-${item.icon} fs-5 text-secondary`} />
              </span>
            </div>
          </FlexBox>
        ))}
      </Card>
    </Col>
  );
};

export default ProfileInfoSideBar;
