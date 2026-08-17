import * as React from "react";

import { FormItemContext } from "./context";
import { createPrimitiveComponent } from "../shared/createPrimitiveComponent";

const FormItemPrimitive = createPrimitiveComponent({
  primitive: "div",
  baseClass: "space-y-2",
  displayName: "FormItem",
});

export const FormItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof FormItemPrimitive>
>((props, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <FormItemPrimitive ref={ref} {...props} />
    </FormItemContext.Provider>
  );
});

FormItem.displayName = "FormItem";
