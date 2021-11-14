import zxcvbn from "zxcvbn";

const PasswordStrengthProgress = (props = { password: "" }) => {
  const result = zxcvbn(props.password);
  const num = (result.score * 100) / 4;

  const progressLabel = () => {
    if (!props.password) return "";
    switch (result.score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Normal";
      case 3:
        return "Medium";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };
  const progressColor = () => {
    switch (result.score) {
      case 0:
        return "#ea1111";
      case 1:
        return "#ea1111";
      case 2:
        return "#ffad00";
      case 3:
        return "#70a500";
      case 4:
        return "#00b500";
      default:
        return "none";
    }
  };

  const changePassworColor = () => ({
    width: `${num}%`,
    background: progressColor(),
    minWidth: "1%",
  });

  return (
    <>
      <p
        className="form-text mb-2"
        id="passwordVerdict"
        style={{ color: progressColor() }}
      >
        <strong>{progressLabel()}</strong>
      </p>
      <div id="passwordProgress">
        <div className="progress false">
          <div className="progress-bar" style={changePassworColor()}></div>
        </div>
      </div>
    </>
  );
};

export default PasswordStrengthProgress;
