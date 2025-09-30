import React from "react";
import Input from "components/ui/Input";
import AdminFormFieldGroup from "./AdminFormFieldGroup";
import { AdminFormFieldBaseProps } from "../types/adminFormFieldTypes";

export type AdminFormFieldFileProps = Pick<
  AdminFormFieldBaseProps<HTMLInputElement>,
  "label" | "name" | "onChange" | "resetFile"
>;

/**
 * AdminFormFieldFile component
 *
 * Renders a file input field with a label in a consistent admin form layout.
 * 
 * @param props - Component props
 * @returns The rendered AdminFormFieldFile component.
 */
const AdminFormFieldFile: React.FC<AdminFormFieldFileProps> = ({
  label,
  name,
  resetFile,
  onChange,
}) => {
  return (
    <AdminFormFieldGroup label={label} name={name}>
      <Input type="file" name={name} resetKey={resetFile} onChange={onChange} />
    </AdminFormFieldGroup>
  );
};

export default AdminFormFieldFile;
