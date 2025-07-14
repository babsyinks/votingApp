import React from "react";
import PropTypes from "prop-types";
import Button from "../ui/Button";
import defaultStyle from "./Modal.module.css";

/**
 * A modal dialog component for confirmations and alerts.
 *
 * @param {Object} props - Component props.
 * @param {String} props.message - The content/message shown inside the modal.
 * @param {String} props.positiveBtnTxt - The text for the confirm button.
 * @param {String} props.negativeBtnTxt - The text for the cancel button.
 * @param {Function} props.positiveHandler - Function to run on confirm.
 * @param {Function} props.negativeHandler - Function to run on cancel.
 * @param {String} [props.ariaLabel] - Accessible label for the modal.
 * @param {String} [props.ariaLabelledBy] - ID of the element that labels the modal.
 * @param {String} [props.ariaDescribedBy] - ID of the element that describes the modal.
 * @returns {JSX.Element} The rendered modal component.
 */
const Modal = ({
  message,
  positiveBtnTxt,
  negativeBtnTxt,
  positiveHandler,
  negativeHandler,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
}) => {
  const positiveBtnProp = {
    onClick: positiveHandler,
    className: defaultStyle["modal-positive"]
  };

  const negativeBtnProp = {
    onClick: negativeHandler,
    className: defaultStyle["modal-negative"]
  };

  return (
    <div className={defaultStyle.backdrop}>
      <div
        className={defaultStyle.modal}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      >
        <div
          className={defaultStyle["modal-msg"]}
          id={ariaDescribedBy}
        >
          {message}
        </div>
        <span>
          {positiveBtnTxt && (
            <Button {...positiveBtnProp}>
              {positiveBtnTxt}
            </Button>
          )}
          {negativeBtnTxt && (
            <Button {...negativeBtnProp}>
              {negativeBtnTxt}
            </Button>
          )}
        </span>
      </div>
    </div>
  );
};

Modal.propTypes = {
  message: PropTypes.string.isRequired,
  positiveBtnTxt: PropTypes.string,
  negativeBtnTxt: PropTypes.string,
  positiveHandler: PropTypes.func,
  negativeHandler: PropTypes.func,
  ariaLabel: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
};

export default Modal;
