import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShowMsg } from "../../components/alert/Alert";
import FlexBox from "../../components/global/FlexBox";
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
    <FlexBox
      justify="center"
      items="center"
      className="h-100 w-100 min-h-100vh"
    >
      {errorMsg && <ShowMsg msg={errorMsg} color="danger" />}
      {successMsg && <ShowMsg msg={successMsg} color="success" />}
    </FlexBox>
  );
};

export default Active;
