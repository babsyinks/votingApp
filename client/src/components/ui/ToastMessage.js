import React from "react";
import PropTypes from "prop-types";
import style from "./ToastMessage.module.css";

/**
 * A toast notification component for displaying success or failure messages.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.toast - The toast message details.
 * @param {string} props.toast.status - The type of toast: "success" or "failure",
 * @param {string} props.toast.message - The message to display.
 * @returns {JSX.Element} The rendered toast message.
 */
const ToastMessage = ({ toast }) => {
  const { status, message } = toast;

  // Use "alert" for errors and "status" for non-critical updates
  const role = status === "failure" ? "alert" : "status";

  return (
    <div
      className={`${style.display} ${style[status]}`}
      role={role}
      aria-live="assertive"
    >
      {message}
    </div>
  );
};

ToastMessage.propTypes = {
  toast: PropTypes.shape({
    status: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
};

export default ToastMessage;
