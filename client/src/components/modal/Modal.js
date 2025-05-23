import React from "react";
import Button from "../ui/Button";
import defaultStyle from "./Modal.module.css";

const Modal = ({
  message,
  positiveBtnTxt,
  negativeBtnTxt,
  positiveHandler,
  negativeHandler,
}) => {
  const positiveBtnProp = {
    onClick: positiveHandler,
    className: defaultStyle["modal-positive"]
  };

  const negativeBtnProp = {
    onClick: negativeHandler,
    className: defaultStyle["modal-negative"]
  }
  return (
    <div className={defaultStyle.backdrop}>
      <div className={defaultStyle.modal}>
        <div className={defaultStyle["modal-msg"]}>{message}</div>
        <span>
          {positiveBtnTxt && (
            <Button {...positiveBtnProp} >
              {positiveBtnTxt}
            </Button>
          )}
          {negativeBtnTxt && (
            <Button {...negativeBtnProp} >
              {negativeBtnTxt}
            </Button>
          )}
        </span>
      </div>
    </div>
  );
};

export default Modal;
