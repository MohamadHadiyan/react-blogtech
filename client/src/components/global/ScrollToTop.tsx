import { useEffect } from "react";
import { History } from "history";
import { withRouter } from "react-router-dom";

interface IProps {
  history: History;
}

const ScrollToTop = ({ history }: IProps) => {
  useEffect(() => {
    const unlisten = history.listen(() => window.scrollTo(0, 0));

    return () => unlisten();
  }, [history]);
  return null;
};

export default withRouter(ScrollToTop);
