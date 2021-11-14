import React from "react";

interface IProps {
  className?: string;
}

const PasswordHints = ({ className = "" }: IProps) => {
  return (
    <div className={className}>
      <h5 className="text-dark">Password reuirements:</h5>
      <p className="small mb-2 text-secondary">
        Ensure that these requirements are met:
      </p>
      <ul className="small text-secondary">
        <li>Minimum 8 charachters long - the more, the better</li>
        <li>At least one lowercase charachters</li>
        <li>At least one uppercase charachters</li>
        <li>At least one number, symbol, or whitespace charachters</li>
      </ul>
    </div>
  );
};

export default PasswordHints;
