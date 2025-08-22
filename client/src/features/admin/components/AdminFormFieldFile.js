import React from "react";
import Input from "components/ui/Input";
import AdminFormFieldGroup from "./AdminFormFieldGroup";

const AdminFormFieldFile = ({ label, name, resetFile, onChange }) => {
  return (
    <AdminFormFieldGroup label={label} name={name}>
      <Input type="file" name={name} resetKey={resetFile} onChange={onChange} />
    </AdminFormFieldGroup>
  );
};

export default AdminFormFieldFile;
