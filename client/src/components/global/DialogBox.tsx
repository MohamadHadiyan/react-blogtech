import React from "react";
import Button from "./Button";
import FlexBox from "./FlexBox";

interface Iprops {
  show: boolean;
  title?: string;
  description?: React.ReactNode;
  cancel: (value: boolean) => void;
  confirm: (value: boolean) => void;
}

const DialogBox = ({ show, title, description, cancel, confirm }: Iprops) => {
  return show ? (
    <FlexBox
      justify="center"
      items="center"
      className={`position-fixed top-0 start-0 w-100 h-100`}
      style={{ background: "#7c7c7c61", zIndex: 999 }}
    >
      <div className="rounded-3 shadow-lg bg-white">
        <div className="border-bottom p-4">
          <h4>{title}</h4>
          <p className="m-0 text-secondary">{description}</p>
        </div>
        <div className="text-center p-4">
          <Button
            color="success-soft"
            className="me-4"
            onClick={() => cancel(false)}
          >
            Cancel
          </Button>
          <Button color="danger-soft" onClick={() => confirm(true)}>
            Yes, Delete it
          </Button>
        </div>
      </div>
    </FlexBox>
  ) : (
    <></>
  );
};

export default DialogBox;
