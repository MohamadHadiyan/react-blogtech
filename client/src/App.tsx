import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Alert } from "./components/alert/Alert";
import ScrollHandler from "./components/global/ScrollHandler";
import PageRender from "./PageRender";
import { refreshToken } from "./redux/actions/authAction";
import { getHomeBlogs, getTopBlogs } from "./redux/actions/blogAction";
import io from "socket.io-client";
import { SOCKET } from "./redux/types/socketType";
import SocketClient from "./SocketClient";
import ForgotPassword from "./pages/forgot_password";
import ResetPassword from "./pages/reset_password/[slug]";
import Register from "./pages/register";
import Login from "./pages/login";
import { getArchiveDate } from "./redux/actions/archiveAction";
import { getCategoriesName } from "./redux/actions/categoryAction";
import { getTagsName } from "./redux/actions/tagAction";
import AlertCookie from "./components/alert/AlertCookie";
import Cookies from "js-cookie";

function App() {
  const [showCookie, setShowCookie] = useState(false);
  const dispatch = useDispatch();

  const cookie = Cookies.get("coockie_notice_accepted");
  const accepted = cookie === undefined ? false : JSON.parse(cookie);

  const handleSetCookie = () => {
    Cookies.set("coockie_notice_accepted", "true", { expires: 365 });
    setShowCookie(false);
  };

  useEffect(() => {
    if (accepted) return;

    let timer = setTimeout(() => {
      setShowCookie(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, [accepted]);

  useEffect(() => {
    dispatch(
      refreshToken((token) => {
        dispatch(getHomeBlogs());
        dispatch(getTopBlogs());
        dispatch(getArchiveDate());
        dispatch(getCategoriesName());
        dispatch(getTagsName());
      }, true)
    );
  }, [dispatch]);

  useEffect(() => {
    const socket = io();
    dispatch({ type: SOCKET, payload: socket });

    return () => {
      socket.close();
    };
  }, [dispatch]);

  useEffect(() => {
    const theme = window.localStorage.getItem("theme");
    const color = window.localStorage.getItem("fav_color");

    if (theme) {
      document.documentElement.classList.add(`${theme}`);
    }

    if (color) {
      document.documentElement.classList.add(`fav-${color}`);
    }
  }, []);

  useEffect(() => {
    const time = setInterval(() => {
      dispatch(refreshToken());
    }, 84e4);

    return () => clearInterval(time);
  }, [dispatch]);

  return (
    <Router>
      <SocketClient />
      <ScrollHandler />
      <Alert />
      <AlertCookie
        handleSetCookie={handleSetCookie}
        isOpen={showCookie}
        handleClose={() => setShowCookie(false)}
      />
      <Switch>
        <Route exact path="/" component={PageRender} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/forgot_password" component={ForgotPassword} />
        <Route exact path="/reset_password/:slug" component={ResetPassword} />
        <Route exact path="/:page" component={PageRender} />
        <Route exact path="/:page/:slug" component={PageRender} />
      </Switch>
    </Router>
  );
}

export default App;
