import React from "react";

import style from "./ToastMessage.module.css";

export interface Toast {
  /** The type of toast: "success" or "failure". */
  status: "success" | "failure" | "";
  /** The message to display. */
  message: string;
}

export interface ToastMessageProps {
  /** The toast message details. */
  toast: Toast;
}

/**
 * A toast notification component for displaying success or failure messages.
 *
 * @returns The rendered toast message.
 */
const ToastMessage: React.FC<ToastMessageProps> = ({ toast }) => {
  const { status, message } = toast;

  // Use "alert" for errors and "status" for non-critical updates
  const role: "alert" | "status" = status === "failure" ? "alert" : "status";

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

export default ToastMessage;
