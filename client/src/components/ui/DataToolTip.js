import React from "react";
import PropTypes from "prop-types";
import "./DataToolTip.css";
import AccessibleWrapper from "components/accessibility/AccessibleWrapper";

/**
 * A component that renders a tooltip using a `data-tooltip` attribute.
 * Can optionally enhance accessibility using `AccessibleWrapper`.
 *
 * @param {Object} props - Component props.
 * @param {String} props.data - The text to show inside the tooltip.
 * @param {React.ReactNode} props.children - The child content over which the tooltip appears.
 * @param {Boolean} [props.withAccessibility] - Whether to wrap the component with AccessibleWrapper.
 * @param {String} [props.role] - Optional ARIA role.
 * @param {String} [props.ariaLabel] - ARIA label text.
 * @param {String} [props.ariaLabelledBy] - ID of element that labels this tooltip.
 * @param {String} [props.ariaDescribedBy] - ID of element that describes this tooltip.
 * @param {String} [props.title] - Native tooltip / accessibility label.
 */
export default function DataToolTip({
  data,
  children,
  withAccessibility = false,
  role,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  title,
}) {
  const content = (
    <div data-tooltip={data}>
      {children}
    </div>
  );

  return withAccessibility ? (
    <AccessibleWrapper
      role={role}
      ariaLabel={ariaLabel}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      title={title || data}
    >
      {content}
    </AccessibleWrapper>
  ) : (
    content
  );
}

DataToolTip.propTypes = {
  data: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  withAccessibility: PropTypes.bool,
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  title: PropTypes.string,
};
