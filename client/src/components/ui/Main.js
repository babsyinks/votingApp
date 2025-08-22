import React from "react";
import PropTypes from "prop-types";

/**
 * The main component that semantically represents the main content of a page.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.className] - Additional class names.
 * @param {Object} [props.style] - Inline styles.
 * @param {React.ReactNode} [props.children] - Main content to render.
 * @returns {JSX.Element}
 */
export default function Main({ className = "", style = {}, children }) {
  return (
    <main className={className} style={style}>
      {children}
    </main>
  );
}

Main.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};
