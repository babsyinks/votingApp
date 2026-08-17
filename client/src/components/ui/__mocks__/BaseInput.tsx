import { FormEvent, useState } from "react";

import { BaseInputProps } from "../BaseInput";

export default function MockBaseInput(props: BaseInputProps) {
  const { value, onChange, onInput, ...rest } = props;
  const [val, setVal] = useState(value || "");

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    onInput?.(e);
    setVal(e.currentTarget.value);
  };

  return (
    <input
      data-testid="mock-baseinput"
      value={val}
      onChange={(e) => {
        if (onChange) {
          onChange(e);
        }
        setVal(e.target.value);
      }}
      onInput={handleInput}
      {...rest}
    />
  );
}
