import ActiveLink from "../global/ActiveLink";
import FlexBox, { Col } from "../global/FlexBox";

const Footer = () => {
  return (
    <footer className="mt-3 mt-lg-4">
      <div className="container py-1 py-md-3 border-top">
        <FlexBox row justify="center">
          <Col md="6">
            <nav className="nav justify-content-center">
              <ActiveLink color="link" className="nav-link px-2 px-lg-3">
                Privacy
              </ActiveLink>
              <ActiveLink color="link" className="nav-link px-2 px-lg-3">
                Terms
              </ActiveLink>
              <ActiveLink color="link" className="nav-link px-2 px-lg-3">
                Feedback
              </ActiveLink>
              <ActiveLink color="link" className="nav-link px-2 px-lg-3">
                Support
              </ActiveLink>
            </nav>
          </Col>
          <Col md="6">
            <p className="m-0 mt-2 text-center">
              &copy; 2021{" "}
              <ActiveLink color="purple" className="text-uppercase">
                <strong>BlogTech</strong>
              </ActiveLink>{" "}
              All Rights Reserved
            </p>
          </Col>
        </FlexBox>
      </div>
    </footer>
  );
};

export default Footer;
