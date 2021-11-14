import ActiveLink from "../global/ActiveLink";

const Footer = () => {
  return (
    <footer className="mt-5">
      <div className="container py-3 border-top">
        <div className="row center">
          <div className="col-12 col-md-6">
            <nav className="nav center">
              <ActiveLink color="link" className="nav-link">
                Privacy
              </ActiveLink>
              <ActiveLink color="link" className="nav-link">
                Terms
              </ActiveLink>
              <ActiveLink color="link" className="nav-link">
                Feedback
              </ActiveLink>
              <ActiveLink color="link" className="nav-link">
                Support
              </ActiveLink>
            </nav>
          </div>
          <div className="col-12 col-md-6">
            <p className="m-0 mt-2 text-center">
              &copy; 2021{" "}
              <ActiveLink color="purple" className="text-uppercase">
                <strong>BlogTech</strong>
              </ActiveLink>{" "}
              All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
