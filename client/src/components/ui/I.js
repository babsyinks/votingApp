import React from "react";
import PropTypes from "prop-types";
import AccessibleWrapper from "components/accessibility/AccessibleWrapper";

/**
 * An <i> element for icons or emphasized inline text.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.className] - ClassName(s) for styling.
 * @param {Object} [props.style] - Inline styles.
 * @param {Function} [props.onClick] - The click handler for this component.
 * @param {Boolean} [props.withAccessibility] - Whether to wrap in AccessibleWrapper.
 * @param {String} [props.role] - ARIA role.
 * @param {String} [props.ariaLabel] - ARIA label text.
 * @param {String} [props.ariaLabelledBy] - ID of labelling element.
 * @param {String} [props.ariaDescribedBy] - ID of describing element.
 * @param {String} [props.title] - Tooltip or additional label.
 * @param {React.ReactNode} props.children - Inner content.
 * @returns {JSX.Element} The rendered <i> element.
 */
export default function I({
  className = "",
  style = {},
  onClick,
  withAccessibility = false,
  role,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  title,
  children,
}) {
  const content = (
    <i
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </i>
  );

  return withAccessibility ? (
    <AccessibleWrapper
      role={role}
      ariaLabel={ariaLabel}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      title={title}
    >
      {content}
    </AccessibleWrapper>
  ) : content;
}

I.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  withAccessibility: PropTypes.bool,
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
};
