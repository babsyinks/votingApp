import React from "react";
import PropTypes from "prop-types";
import InputFile from "./InputFile";
import InputText from "./InputText";
import InputDate from "./InputDate";
import InputTime from "./InputTime";

const componentMap = {
  file: InputFile,
  text: InputText,
  password: InputText,
  date: InputDate,
  time: InputTime,
};

/**
 * A component that renders input components depending on the type.
 *
 * @param {Object} props - Component props containing all configurations needed for the input.
 * @returns {JSX.Element} The rendered input component.
 */
function Input(props) {
  const { type = "text" } = props;
  const Component = componentMap[type] || InputText;

  return <Component {...props} />;
}

Input.propTypes = {
  type: PropTypes.oneOf(["text", "password", "file", "date", "time"]).isRequired,
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
