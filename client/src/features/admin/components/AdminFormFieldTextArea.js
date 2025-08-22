import React from "react";
import TextArea from "components/ui/TextArea";
import AdminFormFieldGroup from "./AdminFormFieldGroup";

const AdminFormFieldTextArea = ({ label, name, value, onChange }) => {
  return (
    <AdminFormFieldGroup label={label} name={name}>
      <TextArea name={name} value={value} onChange={onChange} />
    </AdminFormFieldGroup>
  );
};

export default AdminFormFieldTextArea;
