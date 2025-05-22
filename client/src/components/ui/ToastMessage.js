import React from "react";
import style from "./ToastMessage.module.css";
const ToastMessage = ({ toast }) => {
  const { status, message } = toast;
  return <div className={`${style.display} ${style[status]}`}>{message}</div>;
};

export default ToastMessage;
