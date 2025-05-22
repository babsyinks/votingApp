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
 * @param {Object} [props.custom] - Additional style classes and objects to pass to the element.
 * @param {React.ReactNode} props.children - Child elements to render inside the block.
 * @returns {JSX.Element} The rendered block component.
 */
export default function Block({
  type = "block",
  custom = { custClass: "", custStyle: {} },
  children,
}) {
  const { custClass = "", custStyle = {} } = custom;
  return (
    <div
      className={`${defaultStyle[type]} ${getCompClasses(defaultStyle, custClass)}`}
      style={custStyle || {}}
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
    "flex-vert-fs",
    "block",
    "inline",
  ]),
  custom: PropTypes.object,
  children: PropTypes.node,
};
