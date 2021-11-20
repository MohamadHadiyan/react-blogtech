import React, { useEffect, useState } from "react";
import { useMedia } from "../../hooks/useMedia";
import getUniqueID from "../../utils/GetUniqueID";
import { InputChange } from "../../utils/TypeScript";
import { DefaultDropDownMenu } from "./Dropdown";
import FlexBox, { Col } from "./FlexBox";
import PasswordHints from "./PasswordHints";
import PasswordStrengthProgress from "./PasswordStrengthProgress";

type InputType = "text" | "password" | "checkbox" | "email";

interface IInput {
  label?: React.ReactNode;
  defaultValue?: string;
  defaultChecked?: boolean;
  boxClassName?: string;
  className?: string;
  labelClass?: string;
  type?: InputType;
  row?: boolean;
  placeholder?: string;
  passwordHint?: boolean;
  strengthProgress?: boolean;
  children?: React.ReactNode;
  callbackValue?: (text: string) => void;
  callbackChecked?: (checked: boolean) => void;
  firstlabel?: boolean;
}

const InputBox = ({
  type = "text",
  defaultValue = "",
  placeholder = "",
  label,
  passwordHint,
  strengthProgress,
  boxClassName = "",
  callbackValue,
  callbackChecked,
  className = "",
  labelClass = "",
  children,
  row,
  defaultChecked = false,
  firstlabel,
}: IInput) => {
  const [value, setValue] = useState(defaultValue);
  const [checked, setChecked] = useState(defaultChecked);
  const [typePass, setTypePass] = useState(true);
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const uniqeId = getUniqueID();
  const media = useMedia("(min-width: 576px)");

  const menuItems = [{ items: [{ icon: <PasswordHints /> }] }];

  useEffect(() => {
    setValue(defaultValue);
    setChecked(defaultChecked);
  }, [defaultChecked, defaultValue]);

  useEffect(() => {
    if (typeof label === "string" && !media) setText(label);
    else setText("");
  }, [label, media]);

  const handleChange = (e: InputChange) => {
    const target = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setChecked(!checked);
      if (callbackChecked) callbackChecked(target.checked);
    } else {
      const val = target.value;
      setValue(val);
      if (callbackValue) callbackValue(val);
    }
  };

  const checkbox = (
    <input
      checked={checked}
      onChange={handleChange}
      id={uniqeId}
      type="checkbox"
      className={`form-check-input ${className}`}
    />
  );

  const inputLabel = (
    <label
      htmlFor={uniqeId}
      className={
        row ? `col-form-label ${labelClass}` : `form-label ${labelClass}`
      }
    >
      {label}
    </label>
  );

  return (
    <div
      className={
        row
          ? `row ${
              type === "checkbox"
                ? "align-items-center justify-content-between"
                : ""
            } ${
              boxClassName.includes("mb-") ? "" : "mb-0 mb-lg-3 "
            } ${boxClassName}`
          : `${
              type === "checkbox" ? "form-check" : "form-group"
            } mb-3 ${boxClassName}`
      }
    >
      {firstlabel &&
        label &&
        (type === "checkbox" ? true : !text) &&
        (row && type === "checkbox" ? (
          <Col col="11">{inputLabel}</Col>
        ) : (
          <Col col="3">{inputLabel}</Col>
        ))}

      {type === "checkbox" &&
        (row ? <Col col="auto">{checkbox}</Col> : checkbox)}

      {!firstlabel && label && type === "checkbox" && (
        <Col col="11">{inputLabel}</Col>
      )}
      {!firstlabel && label && !text && row && <Col col="3">{inputLabel}</Col>}
      {!firstlabel && label && !text && !row && type !== "checkbox" && (
        <Col col="11">{inputLabel}</Col>
      )}

      {type !== "checkbox" && (
        <>
          <div className={row ? "col-sm-9 " : ""}>
            <div className={type === `password` ? "pass" : ""}>
              <input
                type={
                  typePass && type === "password"
                    ? "password"
                    : type === "password"
                    ? "text"
                    : type
                }
                autoComplete="on"
                name={uniqeId}
                className={`form-control ${className}`}
                id={uniqeId}
                placeholder={placeholder || text}
                value={value}
                onChange={handleChange}
              />
              {type === "password" && (
                <small onClick={() => setTypePass(!typePass)}>
                  <i className={`fas fa-${typePass ? "eye-slash" : "eye"}`} />
                </small>
              )}
            </div>
            {children}
            {strengthProgress && (
              <FlexBox justify="between" items="center">
                <div className="w-100">
                  <PasswordStrengthProgress password={value} />
                </div>
                {passwordHint && (
                  <DefaultDropDownMenu
                    menuItems={menuItems}
                    isOpen={isOpen}
                    icon={
                      <i
                        className="fas fa-info-circle text-link"
                        style={{
                          transform: `translateY${value ? "(16px)" : "(4px)"}`,
                        }}
                      />
                    }
                    transform="translate(0px, 30px)"
                    toggle={() => setIsOpen(!isOpen)}
                  />
                )}
              </FlexBox>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default InputBox;
