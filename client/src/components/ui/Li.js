import React from "react";
import PropTypes from "prop-types";

/**
 * A list item component.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.className] - Additional class names.
 * @param {Object} [props.style] - Inline styles.
 * @param {React.ReactNode} [props.children] - The item to render in this List Item component.
 * @returns {JSX.Element}
 */
export default function Li({ className = "", style = {}, children, }) {
  return (
    <li className={className} style={style}>
      {children}
    </li>
  );
}

Li.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
};
