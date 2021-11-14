import { useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

const ScrollHandler = ({ location }: RouteComponentProps) => {
  useEffect(() => {
    const element = document.getElementById(location.hash.slice(1));
    const time = setTimeout(() => {
      window.scrollTo({
        top: element ? element.offsetTop : 0,
        behavior: element ? "smooth" : "auto",
      });
    }, 20);

    return () => clearTimeout(time);
  }, [location]);

  return null;
};

export default withRouter(ScrollHandler);
