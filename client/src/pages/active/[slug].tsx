import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShowErrorMsg, ShowSuccessMsg } from "../../components/alert/Alert";
import { postAPI } from "../../utils/FetchData";
import { IParams } from "../../utils/TypeScript";

const Active = () => {
  const { slug }: IParams = useParams();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (slug) {
      postAPI("active", { active_token: slug })
        .then((res) => setSuccessMsg(res.data.msg))
        .catch((err) => setErrorMsg(err.response.data.msg));
    }
  }, [slug]);

  return (
    <div>
      {errorMsg && ShowErrorMsg(errorMsg)}
      {successMsg && ShowSuccessMsg(successMsg)}
    </div>
  );
};

export default Active;
