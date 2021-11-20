import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/storeHooks";
import { ALERT } from "../../redux/types/alertType";

interface IProps {
  title: string;
  body: string | string[];
  bgColor: string;
}

const Toast = ({ title, body, bgColor }: IProps) => {
  const { alert } = useAppSelector((state) => state);
  const dispatch = useDispatch();

  const duration = Array.isArray(body) ? body.length * 10000 : 10000;

  useEffect(() => {
    let timer = setTimeout(() => {
      if (alert.errors || alert.success) {
        dispatch({
          type: ALERT,
          payload: { loading: false, errors: "", success: "" },
        });
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [alert.errors, alert.success, dispatch, duration]);

  const handleClose = () => {
    dispatch({
      type: ALERT,
      payload: { loading: false, errors: "", success: "" },
    });
  };

  return (
    <div
      className={`toast show position-fixed text-light ${bgColor}`}
      style={{ top: "5px", right: "5px", zIndex: 2010 }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={`toast-header text-light ${bgColor}`}>
        <strong className="me-auto">{title}</strong>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
          onClick={handleClose}
        />
      </div>
      <div className="toast-body">
        {typeof body === "string" ? (
          body
        ) : (
          <ul>
            {body.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Toast;
