import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Block.module.css";
import getCompClasses from "../../util/getCompClasses";
/**
 * A block component that renders its children inside a div. Its main purpose is to logically group
 * components.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.type] - The type of the block. E.g block or flex-vert.
 * @param {String} [props.className] - The className to use to additionally style this component.
 * @param {Object} [props.style] - Additional inline styles to use to style this component.
 * @param {React.ReactNode} [props.children] - Child elements to render inside the block.
 * @returns {JSX.Element} The rendered block component.
 */
export default function Block({
  type = "block",
  className = "",
  style = {},
  children,
}) {
  return (
    <div
      className={`${defaultStyle[type]} ${getCompClasses(defaultStyle, className)}`}
      style={style}
    >
      {children}
    </div>
  );
}

Block.propTypes = {
  type: PropTypes.oneOf([
    "flex-vert",
    "flex-horz",
    "flex-horz-sb",
    "flex-vert-sb",
    "flex-vert-fs",
    "flex-horz-fs",
    "block",
    "inline",
  ]),
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};
