import React from "react";
import Input from "components/ui/Input";
import AdminFormFieldGroup from "./AdminFormFieldGroup";
import { AdminFormFieldBaseProps } from "../types/adminFormFieldTypes";

/**
 * Props for the AdminFormFieldText component.
 * Reuses the shared base props but ensures value and onChange are required.
 */
export type AdminFormFieldTextProps = Required<
  Pick<AdminFormFieldBaseProps<HTMLInputElement>, "label" | "name" | "value" | "onChange">
>;

/**
 * Admin form field component for rendering a text input with label.
 *
 * Renders a labeled text input field wrapped in an AdminFormFieldGroup
 * 
 * @param props - Component props
 * @returns The rendered AdminFormFieldText component.
 */
const AdminFormFieldText: React.FC<AdminFormFieldTextProps> = ({
  label,
  name,
  value,
  onChange,
}) => {
  return (
    <AdminFormFieldGroup label={label} name={name}>
      <Input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="line-input"
      />
    </AdminFormFieldGroup>
  );
};

export default AdminFormFieldText;
