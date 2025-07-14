import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Base.module.css";
import getCompClasses from "../../util/getCompClasses";
import AccessibleWrapper from "components/accessibility/AccessibleWrapper";

/**
 * A span element for inline text or components with optional styling and accessibility.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.type] - The type of the span (e.g., "inline-block").
 * @param {String} [props.className] - Additional CSS class names.
 * @param {Object} [props.style] - Inline styles.
 * @param {Function} [props.onClick] - Click handler.
 * @param {React.ReactNode} props.children - Content inside the span.
 * @param {Boolean} [props.withAccessibility] - Whether to wrap with AccessibleWrapper.
 * @param {String} [props.role] - ARIA role (e.g., "button").
 * @param {String} [props.ariaLabel] - ARIA label.
 * @param {String} [props.ariaLabelledBy] - ID of label element.
 * @param {String} [props.ariaDescribedBy] - ID of description element.
 * @param {String} [props.title] - Optional tooltip / description.
 * @returns {JSX.Element} The rendered span component.
 */
export default function Span({
  type = "inline",
  className = "",
  style = {},
  onClick,
  children,
  withAccessibility = false,
  role,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  title,
}) {
  const spanContent = (
    <span
      className={`${defaultStyle[type]} ${getCompClasses(defaultStyle, className)}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </span>
  );

  if (!withAccessibility) return spanContent;

  return (
    <AccessibleWrapper
      role={role}
      ariaLabel={ariaLabel}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      title={title}
      onClick={onClick}
    >
      {spanContent}
    </AccessibleWrapper>
  );
}

Span.propTypes = {
  type: PropTypes.oneOf([
    "flex-vert",
    "flex-horz",
    "flex-vert-sb",
    "flex-horz-sb",
    "flex-vert-sa",
    "flex-horz-sa",
    "flex-vert-fs",
    "flex-horz-fs",
    "flex-vert-fe",
    "flex-horz-fe",
    "block",
    "inline",
    "inline-block",
    "flex",
  ]),
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  withAccessibility: PropTypes.bool,
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  title: PropTypes.string,
};
