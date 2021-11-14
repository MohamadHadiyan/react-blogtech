import { useEffect } from "react";
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
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      refreshToken((token) => {
        dispatch(getHomeBlogs());
        dispatch(getTopBlogs());
        dispatch(getArchiveDate());
        dispatch(getCategoriesName());
        dispatch(getTagsName());
      })
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
  },[]);

  return (
    <Router>
      <SocketClient />
      <ScrollHandler />
      <Alert />
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
