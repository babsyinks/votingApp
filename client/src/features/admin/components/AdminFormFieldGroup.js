import React from "react";
import Block from "../../../components/ui/Block";
import Label from "../../../components/ui/Label";

const AdminFormFieldGroup = ({ label, name, children }) => {
  return (
    <Block type="flex-horz-fs" className="mb-2p">
      <Label name={name} className="wd-md bld">
        {label}
      </Label>
      {children}
    </Block>
  );
};

export default AdminFormFieldGroup;
