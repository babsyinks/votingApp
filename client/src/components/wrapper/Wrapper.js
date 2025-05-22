import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Wrapper.module.css";
/**
 * A simple wrapper component that renders its children inside a div and styles them based on the type.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.type] - The type of the wrapper.
 * @param {Object} [props.style] - Additional styles to be passed to the element
 * @param {React.ReactNode} props.children - Child elements to render inside the wrapper.
 * @returns {JSX.Element} The rendered wrapper component.
 */
export default function Wrapper({
  type = "fx-cn-cn-cm", // means: display: flex; align-items: center; justify-content: center; flex-direction: column
  style = {},
  children,
}) {
  return (
    <div
      className={`${defaultStyle.fx} ${defaultStyle[type] || ""}`}
      style={style}
    >
      {children}
    </div>
  );
}

Wrapper.propTypes = {
  type: PropTypes.oneOf([
    "fx-cn-cn-rw",
    "fx-cn-cn-cm",
    "fx-cn-fs-cm",
    "fx-sb-cn-rw",
  ]),
  style: PropTypes.object,
  children: PropTypes.node,
};
