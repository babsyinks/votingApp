import React from "react";
import Input from "components/ui/Input";
import AdminFormFieldGroup from "./AdminFormFieldGroup";

const AdminFormFieldText = ({ label, name, value, onChange }) => {
  return (
    <AdminFormFieldGroup label={label} name={name}>
      <Input type="text" name={name} value={value} onChange={onChange} className="line-input" />
    </AdminFormFieldGroup>
  );
};

export default AdminFormFieldText;
