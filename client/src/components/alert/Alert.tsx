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

export const ShowMsg = ({
  msg,
  color,
}: {
  msg: string;
  color: "danger" | "success";
}) => {
  return (
    <div className={`bg-${color} rounded p-4 fs-5 fw-semi-bold w-100 text-center`}>
      {msg}
    </div>
  );
};
