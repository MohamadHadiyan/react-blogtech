import React from "react";
import { useParams } from "react-router-dom";
import { IParams } from "./utils/TypeScript";
import NotFound from "./components/global/NotFound";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

const generatePage = (name: string) => {
  const component = () => require(`./pages/${name}`).default;

  try {
    return (
      <div>
        <Header />
        <div className="container mt-4 mt-lg-5 pt-4 min-h-100vh">
          {React.createElement(component())}
        </div>
        <Footer />
      </div>
    );
  } catch (err) {
    return (
      <div>
        <Header />
        <NotFound />
      </div>
    );
  }
};

const PageRender = () => {
  const { page, slug }: IParams = useParams();
  let name = "";

  if (page) {
    name = slug ? `${page}/[slug]` : `${page}`;
  }

  return generatePage(name);
};

export default PageRender;
