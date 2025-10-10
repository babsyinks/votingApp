import React from "react";

/**
 * Common props for Admin form field components.
 * @template TElement The form element type (e.g., HTMLInputElement, HTMLSelectElement)
 */
export interface AdminFormFieldBaseProps<TElement extends HTMLElement = HTMLElement> {
  /** The label text to display for this field */
  label: React.ReactNode;
  /** The name/id associated with this field */
  name: string;
  /** The current value for this field */
  value?: string;
  /** Change handler for this field */
  onChange?: React.ChangeEventHandler<TElement>;
  /** Optional reset key for file inputs */
  resetFile?: number;
}
