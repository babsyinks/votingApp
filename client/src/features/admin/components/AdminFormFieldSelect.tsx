import React from "react";
import Select from "components/ui/Select";
import AdminFormFieldGroup from "./AdminFormFieldGroup";
import getOptions from "../helpers/options";
import { AdminFormFieldBaseProps } from "../types/adminFormFieldTypes";

export type AdminFormFieldSelectProps = Required<
  Pick<AdminFormFieldBaseProps<HTMLSelectElement>, "label" | "name" | "value" | "onChange">
>;

/**
 * AdminFormFieldSelect component
 *
 * Renders a select dropdown field with a label in a consistent admin form layout.
 * 
 * @param props - Component props
 * @returns The rendered AdminFormFieldSelect component.
 */
const AdminFormFieldSelect: React.FC<AdminFormFieldSelectProps> = ({
  label,
  name,
  value,
  onChange,
}) => {
  return (
    <AdminFormFieldGroup label={label} name={name}>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        selectOptions={getOptions()}
      />
    </AdminFormFieldGroup>
  );
};

export default AdminFormFieldSelect;
