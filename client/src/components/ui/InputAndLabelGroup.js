import PropTypes from "prop-types";
import Input from "./Input";
import Label from "./Label";
import Block from "./Block";

/**
 * A component that renders a group of components comprising of a label and an input.
 *
 * @param {Object} props - Component props containing all configurations needed for the input.
 * @param {string} [props.label] - The label value.
 * @param {Object} [props.rest] - The input props to be applied to the input element.
 *
 * @returns {JSX.Element} The rendered input component.
 */
export default function InputAndLabelGroup({ label, ...rest }) {
  return (
    <Block>
      <Label name={rest.name || ""}>{label}</Label>
      <Input {...rest} />
    </Block>
  );
}

InputAndLabelGroup.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["text", "password", "email", "file", "date"])
    .isRequired,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};
