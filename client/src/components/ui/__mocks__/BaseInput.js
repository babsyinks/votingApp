import React from "react";

export default function MockBaseInput(props) {
  const { value, onChange, onInput, ...rest } = props;
  const [val, setVal] = React.useState(value || "");

  const handleInput = (e) => {
    onInput?.(e);
    setVal(e.target.value);
  };

  return (
    <input
      data-testid="mock-baseinput"
      value={val}
      onChange={(e) => {
        onChange(e);
        setVal(e.target.value);
      }}
      onInput={handleInput}
      {...rest}
    />
  );
}
