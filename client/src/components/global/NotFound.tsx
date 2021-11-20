import { useAppSelector } from "../../hooks/storeHooks";
import FlexBox from "./FlexBox";

const NotFound = () => {
  const { alert } = useAppSelector((state) => state);
  
  if (alert.loading) return <div />;

  return (
    <FlexBox
      justify="center"
      items="center"
      className="position-relative vh-100"
    >
      <div className="text-center text-secondary">
        <h1 className="display-1">404</h1>
        <p className="fs-5">This page could not be found.</p>
      </div>
    </FlexBox>
  );
};

export default NotFound;
