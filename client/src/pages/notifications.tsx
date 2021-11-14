import React, { useState } from "react";
import ActiveLink from "../components/global/ActiveLink";
import Button from "../components/global/Button";
import FlexBox, { Col } from "../components/global/FlexBox";

const Notifications = () => {
  const [current, setCurrent] = useState("all");

  return (
    <FlexBox row justify="center" className="mt-5">
      <Col lg="8">
        <h3 className="p-2 mb-4">Notifications</h3>

        {/* Tabs */}
        <ul
          className="nav nav-tabs nav-justified"
          id="notify-tab"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <ActiveLink
              to="#all_notify"
              className={`nav-link ${current === "all" ? "active" : ""}`}
              id="all-notify-tab"
              data-bs-toggle="tab"
              data-bs-target="all"
              type="button"
              role="tab"
              aria-controls="all-notify"
              aria-selected="true"
              onClick={() => setCurrent("all")}
            >
              <i className="far fa-bell me-2" />
              All notifications
            </ActiveLink>
          </li>
          <li className="nav-item" role="presentation">
            <ActiveLink
              to="#unread"
              className={`nav-link ${current === "unread" ? "active" : ""}`}
              id="unread-notify-tab"
              data-bs-toggle="tab"
              data-bs-target="unread-notify"
              type="button"
              role="tab"
              aria-controls="unread-notify"
              aria-selected="false"
              onClick={() => setCurrent("unread")}
            >
              <i className="far fa-bell-slash me-2" />
              Unread notifications
            </ActiveLink>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content" id="notify-tab-content">
          <div
            className={`tab-pane fade ${
              current === "all" ? "show active" : ""
            }`}
            id="all-notify"
            role="tabpanel"
            aria-labelledby="all-notify-tap"
          >
            <div
              className="m-2 border rounded-3 bg-white p-3"
              style={{ minHeight: "100px" }}
            >
              <ul className="list-group list-group-flush">
                <li className="list-group-item ">
                  <input type="checkbox" className="form-check-input mb-2" />
                  <FlexBox justify="between">
                    <h5>this is notifications</h5>
                    <small className="text-muted">9/25/2021</small>
                  </FlexBox>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Necessitatibus, ipsum!
                  </p>
                  <div className="text-end">
                    <Button className="text-danger px-1" title="Delete">
                      <i className="far fa-trash-alt" />
                    </Button>
                    <Button className="px-1" title="Mark as readed">
                      <i className="far fa-check-square" />
                    </Button>
                  </div>
                </li>
                <li className="list-group-item ">
                  <input type="checkbox" className="form-check-input mb-2" />
                  <FlexBox justify="between">
                    <h5>this is notifications</h5>
                    <small className="text-muted">9/25/2021</small>
                  </FlexBox>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    amet consectetur adipisicing elit.
                  </p>
                  <div className="text-end">
                    <Button className="text-danger px-1" title="Delete">
                      <i className="far fa-trash-alt" />
                    </Button>
                    <Button className="px-1" title="Mark as readed">
                      <i className="far fa-check-square" />
                    </Button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`tab-pane fade ${
              current === "unread" ? "show active" : ""
            }`}
            id="unread-notify"
            role="tabpanel"
            aria-labelledby="unread-notify-tap"
          >
            <div
              className="m-2 border rounded-3 bg-light p-3 text-center"
              style={{ minHeight: "100px" }}
            >
              <i className="far fa-bell fa-2x" />

              <p className="fw-semi-bold">There are no notifications</p>
            </div>
          </div>
        </div>
      </Col>
    </FlexBox>
  );
};

export default Notifications;
