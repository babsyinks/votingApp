import React from "react";
import PropTypes from "prop-types";
import defaultStyle from "./Base.module.css";
import getCompClasses from "../../util/getCompClasses";
import AccessibleWrapper from "components/accessibility/AccessibleWrapper";

/**
 * A section component used for grouping related content.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.type] - The type of the section. E.g flex-vert.
 * @param {String} [props.className] - Additional class names to style the section.
 * @param {Object} [props.style] - Inline styles.
 * @param {React.ReactNode} [props.children] - Child elements.
 * @param {Boolean} [props.withAccessibility] - Whether to enable accessibility wrapper.
 * @param {String} [props.role] - Optional ARIA role.
 * @param {String} [props.ariaLabel] - ARIA label for screen readers.
 * @param {String} [props.ariaLabelledBy] - ID of element that labels this section.
 * @param {String} [props.ariaDescribedBy] - ID of element that describes this section.
 * @param {String} [props.title] - Optional tooltip / extra info.
 * @returns {JSX.Element}
 */
export default function Section({
  type = "flex-vert",
  className = "",
  style = {},
  children,
  withAccessibility = false,
  role,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  title,
}) {
  const sectionContent = (
    <section
      className={`${defaultStyle.section} ${defaultStyle[type]} ${getCompClasses(defaultStyle, className)}`}
      style={style}
    >
      {children}
    </section>
  );

  if (!withAccessibility) return sectionContent;

  return (
    <AccessibleWrapper
      role={role}
      ariaLabel={ariaLabel}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      title={title}
    >
      {sectionContent}
    </AccessibleWrapper>
  );
}

Section.propTypes = {
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
    "flex",
  ]),
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  withAccessibility: PropTypes.bool,
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  title: PropTypes.string,
};
