import React from "react";

/**
 * Common props for Auth form field Input components.
 */
export interface AuthFieldBaseProps {
  /** The current value for this field */
  value: string;
  /** Change handler for this field */
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  /** The placeholder text for this field */
  placeholder?: string;
  /** The maximum length permissible for the input field */
  maxLength?: number;
}
