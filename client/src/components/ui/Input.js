import React from "react";
import PropTypes from "prop-types";
import InputFile from "./InputFile";
import InputText from "./InputText";
import InputDate from "./InputDate";
import InputTime from "./InputTime";

const componentMap = {
  file: InputFile,
  date: InputDate,
  time: InputTime,
};

["text", "password", "email"].forEach((type) => {
  componentMap[type] = InputText;
});

/**
 * A component that renders input components depending on the type.
 *
 * @param {Object} props - Component props containing all configurations needed for the input.
 * @returns {JSX.Element} The rendered input component.
 */
function Input(props) {
  let { type } = props;
  if (!type) type = "text";
  const Component = componentMap[type] || InputText;

  return <Component {...props} type={type} />;
}

Input.propTypes = {
  type: PropTypes.oneOf([
    "text",
    "password",
    "email",
    "file",
    "date",
    "time",
    "number",
  ]),
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  resetKey: PropTypes.number,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Input;
