import React from "react";
import Select from "components/ui/Select";
import AdminFormFieldGroup from "./AdminFormFieldGroup";
import getOptions from "../helpers/options";

const AdminFormFieldSelect = ({ label, name, value, onChange }) => {
  return (
    <AdminFormFieldGroup label={label} name={name}>
      <Select name={name} value={value} onChange={onChange} selectOptions={getOptions()} />
    </AdminFormFieldGroup>
  );
};

export default AdminFormFieldSelect;
