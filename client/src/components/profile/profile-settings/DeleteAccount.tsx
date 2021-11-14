import React from "react";
import Button from "../../global/Button";
import { Card, CardBody, CardHeader } from "../../global/Card";
import FlexBox from "../../global/FlexBox";

const DeleteAccount = () => {
  return (
    <Card>
      <CardHeader>
        <h5 className="m-0">Delete Your Account</h5>
        <p className="m-0 text-secondary">
          Delete or close your account permanently.
        </p>
      </CardHeader>
      <CardBody>
        <h6 className="text-danger m-0">Warning</h6>
        <p className="text-secondary">
          If you close your account, you will lose all your posts and followers
          forever. Please be certain.
        </p>
        <FlexBox row className="text-end">
          <div className="col-12 col-lg-9"></div>
          <div className="col-12 col-lg-3">
            <Button block color="danger-soft">
              Close Account
            </Button>
          </div>
        </FlexBox>
      </CardBody>
    </Card>
  );
};

export default DeleteAccount;
