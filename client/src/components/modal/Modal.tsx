import React, { FC } from "react";
import Button from "components/ui/Button";
import defaultStyle from "./Modal.module.css";

export interface ModalProps {
  /** The content/message shown inside the modal. */
  message: string;
  /** The text for the confirm button. */
  positiveBtnTxt?: string;
  /** The text for the cancel button. */
  negativeBtnTxt?: string;
  /** Function to run on confirm. */
  positiveHandler?: () => void;
  /** Function to run on cancel. */
  negativeHandler?: () => void;
  /** Accessible label for the modal. */
  ariaLabel?: string;
  /** ID of the element that labels the modal. */
  ariaLabelledBy?: string;
  /** ID of the element that describes the modal. */
  ariaDescribedBy?: string;
}

/**
 * A modal dialog component for confirmations and alerts.
 *
 * Accessibility: Uses `role="dialog"` and `aria-modal="true"`.
 */
const Modal: FC<ModalProps> = ({
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
    className: defaultStyle["modal-positive"],
  };

  const negativeBtnProp = {
    onClick: negativeHandler,
    className: defaultStyle["modal-negative"],
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
        <div className={defaultStyle["modal-msg"]} id={ariaDescribedBy}>
          {message}
        </div>
        <span>
          {positiveBtnTxt && (
            <Button {...positiveBtnProp}>{positiveBtnTxt}</Button>
          )}
          {negativeBtnTxt && (
            <Button {...negativeBtnProp}>{negativeBtnTxt}</Button>
          )}
        </span>
      </div>
    </div>
  );
};

export default Modal;
