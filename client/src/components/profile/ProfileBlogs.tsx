import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks/storeHooks";
import { useSearchParam } from "../../hooks/useSearchParam";
import { getBlogsByUser } from "../../redux/actions/blogAction";
import { ALERT } from "../../redux/types/alertType";
import { getAPI } from "../../utils/FetchData";
import { BlogPrivacyType, IBlog, IParams } from "../../utils/TypeScript";
import Loading from "../alert/Loading";
import {
  Card,
  CardBody,
  CardHeader,
  CardListGroup,
  CardListItem,
  CardTitle,
} from "../global/Card";
import Pagination from "../global/Pagination";
import PrivacyNavbar from "./profile-settings/PrivacyNavbar";
import SearchBox from "./SearchBox";
import UserPost from "./UserPost";

const ProfileBlogs = () => {
  const { userBlogs, auth } = useAppSelector((state) => state);
  const { value, currentSearch } = useSearchParam("page", "1", /page=\d+/);
  const { slug } = useParams<IParams>();
  const dispatch = useDispatch();
  const history = useHistory();

  const limit = 6;
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [searchBlogs, setSearchBlogs] = useState<IBlog[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [privacy, setPrivacy] = useState<BlogPrivacyType | "">("");
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePagination = (num: number) => {
    if (searchTitle) {
      history.push(`?tab=blogs&title=${searchTitle}&page=${num}#user_blogs`);
      handlerSearch(searchTitle, num);
    } else {
      history.push(`?tab=blogs&page=${num}#user_blogs`);
    }
  };

  const handlerSearch = (str: string, page?: number) => {
    const data = userBlogs.find((item) => item.id === slug);
    const search = str.toLowerCase().trim();

    if (!data || search.length < 3) return setSearchBlogs([]);

    const blogs = data.blogs.map((item) => {
      return { ...item, title: item.title.toLowerCase() };
    });

    setLoading(true);
    setSearchTitle(str);

    if (count > limit) {
      const token = auth.access_token;
      getAPI(
        `search_user_blog/${slug}?title=${search}&page=${page || 1}`,
        token
      )
        .then((res) => {
          setCount(res.data.count);
          setSearchBlogs(res.data.blogs);
          setLoading(false);
        })
        .catch((err: any) => {
          dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
          setLoading(false);
        });
    } else {
      const reg = new RegExp(search, "gi");
      const matchedBlogs = blogs.filter((item) => item.title.match(reg));

      if (matchedBlogs.length > 0) {
        setCount(matchedBlogs.length);
        setSearchBlogs(matchedBlogs);
        setLoading(false);
      }
    }
  };

  const handleSelectTab = (tab: BlogPrivacyType | "all") => {
    if (!auth.user || !auth.access_token) return;

    setLoading(true);
    setPrivacy(tab === "all" ? "" : tab);
    history.push(`?tab=blogs&page=1#user_blogs`);
  };

  useEffect(() => {
    if (!currentSearch || searchBlogs.length) return;

    const data = userBlogs.find((blog) => blog.id === slug);

    if (data && data.search === currentSearch) {
      setBlogs(data.blogs);
      setCount(data.count);
      setLoading(false);
    }
  }, [currentSearch, searchBlogs.length, slug, userBlogs]);

  useEffect(() => {
    const isLoged = window.localStorage.getItem("is_logged");
    const token = auth.access_token;

    if (isLoged && token && currentSearch) {
      const data = { token, type: privacy };
      setLoading(true);
      dispatch(getBlogsByUser(slug, currentSearch, limit, data));
    } else if (currentSearch) {
      setLoading(true);
      dispatch(getBlogsByUser(slug, currentSearch, limit));
    }
  }, [auth.access_token, currentSearch, dispatch, privacy, slug]);

  const isUserSelf = auth.user && auth.user._id === slug ? true : false;
  const currentData = searchBlogs.length ? searchBlogs : blogs;

  return (
    <Card setRef={cardRef} id="user_blogs" >
      <CardHeader className="d-flex justify-content-between">
        <CardTitle>
          My Posts <span className="text-muted">({count || 0})</span>
        </CardTitle>
        {blogs && blogs.length > 0 && isUserSelf && !loading && (
          <Link to="/create_blog" className="btn btn-purple fw-semi-bold">
            Create Blog
          </Link>
        )}
      </CardHeader>

      {(count || searchTitle) && (
        <div className="p-3 p-xl-4 border-bottom">
          <SearchBox handler={handlerSearch} />
        </div>
      )}
      {auth.user && auth.access_token && auth.user._id === slug && (
        <PrivacyNavbar callbackValue={handleSelectTab} />
      )}
      <CardBody
        className="position-relative p-0 p-lg-3"
        style={loading ? { minHeight: "176px" } : {}}
      >
        {blogs && blogs.length > 0 ? (
          <CardListGroup>
            {currentData.map((blog, i) => (
              <CardListItem
                key={blog._id}
                first={i === 0}
                last={i === blogs.length - 1}
              >
                <UserPost isUser={isUserSelf} post={blog} />
              </CardListItem>
            ))}
          </CardListGroup>
        ) : (
          !loading && (
            <div className="text-center">
              <h5 className="text-center py-4 text-secondary d-inline-block me-3">
                There are no blog.
              </h5>
              {isUserSelf && (
                <Link to="/create_blog" className="btn btn-purple fw-semi-bold">
                  Create Blog
                </Link>
              )}
            </div>
          )
        )}
        {loading && (
          <Loading
            position="absolute"
            color="light-soft"
            stroke="currentcolor"
            style={{ width: "40px", height: "40px" }}
          />
        )}
        {((count > limit && blogs.length) || searchBlogs.length > limit) && (
          <Pagination
            page={Number(value)}
            count={
              count % limit === 0
                ? count / limit
                : Math.floor(count / limit) + 1
            }
            handler={handlePagination}
            className="mt-3 mb-2 px-2 mt-lg-5"
          />
        )}
      </CardBody>
    </Card>
  );
};

export default ProfileBlogs;
