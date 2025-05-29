import React from "react";
import PropTypes from "prop-types";

/**
 * An <i> element for italic or emphasized inline text.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.className] - ClassName(s) for styling.
 * @param {Object} [props.style] - Inline styles.
 * @param {React.ReactNode} props.children - Content inside the <i> tag.
 * @returns {JSX.Element} The rendered <i> element.
 */
export default function I({ className = "", style = {}, children }) {
  return (
    <i
      className={className}
      style={style}
    >
      {children}
    </i>
  );
}

I.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
};
