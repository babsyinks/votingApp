import React from "react";
import Block from "components/ui/Block";
import Label from "components/ui/Label";

export interface AdminFormFieldGroupProps {
  /** The label text to display for the form field */
  label: React.ReactNode;
  /** The name/id associated with the label */
  name: string;
  /** The form field element(s) to render next to the label */
  children: React.ReactNode;
}

/**
 * AdminFormFieldGroup component
 *
 * Renders a label and its corresponding form field(s) in a horizontal layout.
 * 
 * @param props - Component props
 * @returns The rendered AdminFormFieldGroup component.
 */
const AdminFormFieldGroup: React.FC<AdminFormFieldGroupProps> = ({
  label,
  name,
  children,
}) => {
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
