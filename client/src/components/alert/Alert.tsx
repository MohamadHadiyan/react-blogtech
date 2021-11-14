import { useAppSelector } from "../../hooks/storeHooks";
import Loading from "./Loading";
import Toast from "./Toast";

export const Alert = () => {
  const { alert } = useAppSelector((state) => state);

  return (
    <div>
      {alert.loading && <Loading />}

      {alert.errors && (
        <Toast title="Error" body={alert.errors} bgColor="bg-danger" />
      )}

      {alert.success && (
        <Toast title="Sucess" body={alert.success} bgColor="bg-success" />
      )}
    </div>
  );
};

export const ShowErrorMsg = (msg: string) => {
  return <div className="errorMsg">{msg}</div>;
};

export const ShowSuccessMsg = (msg: string) => {
  return <div className="successMsg">{msg}</div>;
};
