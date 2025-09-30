import React from "react";
import TextArea from "components/ui/TextArea";
import AdminFormFieldGroup from "./AdminFormFieldGroup";
import { AdminFormFieldBaseProps } from "../types/adminFormFieldTypes";

/**
 * Props for the AdminFormFieldTextArea component.
 * Reuses the shared base props but enforces correct types for textarea.
 */
export type AdminFormFieldTextAreaProps = Required<
  Pick<
    AdminFormFieldBaseProps<HTMLTextAreaElement>,
    "label" | "name" | "value" | "onChange"
  >
>;

/**
 * Admin form field component for rendering a textarea with label.
 *
 * Renders a labeled textarea field wrapped in an AdminFormFieldGroup
 * 
 * @param props - Component props
 * @returns The rendered AdminFormFieldTextArea component.
 */
const AdminFormFieldTextArea: React.FC<AdminFormFieldTextAreaProps> = ({
  label,
  name,
  value,
  onChange,
}) => {
  return (
    <AdminFormFieldGroup label={label} name={name}>
      <TextArea name={name} value={value} onChange={onChange} />
    </AdminFormFieldGroup>
  );
};

export default AdminFormFieldTextArea;
