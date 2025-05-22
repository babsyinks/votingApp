import React from "react";
import PropTypes from "prop-types";
import InputFile from "./InputFile";
import InputText from "./InputText";

/**
 * A component that renders input components depending on the type.
 *
 * @param {Object} props - Component props containing all configurations needed for the input.
 * @returns {JSX.Element} The rendered input component.
 */
function Input(props) {
  const { type } = props;

  switch (type) {
    case "file":
      return <InputFile {...props} />;
    case "text":
    case "password":
      return <InputText {...props} />;
    default:
      props.type = "text";
      return <InputText {...props} />;
  }
}

Input.propTypes = {
  type: PropTypes.oneOf(["text", "password", "file"]).isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  resetKey: PropTypes.number,
  placeholder: PropTypes.string,
  custom: PropTypes.shape({
    custClass: PropTypes.string,
    custStyle: PropTypes.object,
  }),
};

export default Input;
