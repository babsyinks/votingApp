import Block from "components/ui/Block";

export default function AuthFrame({
  className = "",
  type = "flex-horz",
  isFull = true,
  children,
}) {
  const minHeight = isFull ? "mnh-100vh" : "";
  return (
    <Block
      type={type}
      className={`bg-blue-faded ${minHeight} p-1xr flex ${className}`}
    >
      <Block className="bg-blue-faded border-rounded-1r bs-blue-faded w-full mxw-28 p-2r mt-1p5r">
        {children}
      </Block>
    </Block>
  );
}
