import PropTypes from "prop-types";
import defaultStyle from "./Img.module.css";
import getCompClasses from "../../util/getCompClasses";

/**
 * A standardized <img> component with support for fallback images and base styling.
 *
 * @param {Object} props - Component props.
 * @param {String} [props.src] - Source URL of the image.
 * @param {String} [props.alt] - Alternative text for the image (required for accessibility).
 * @param {String} [props.className] - Additional className(s) for styling.
 * @param {Object} [props.style] - Inline styles.
 * @returns {JSX.Element} The rendered image element.
 */
export default function Img({ src, alt, className = "", style = {} }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${defaultStyle.img} ${getCompClasses(defaultStyle, className)}`}
      style={style}
    />
  );
}

Img.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};
