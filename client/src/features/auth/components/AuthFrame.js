import Block from "components/ui/Block";

export default function AuthFrame({ className = "", children }) {
  return (
    <Block
      type="flex-horz"
      className={`bg-blue-faded mnh-100vh p-1xr flex ${className}`}
    >
      <Block className="bg-blue-faded border-rounded-1r bs-blue-faded w-full mxw-28 p-2r mt-1p5r">
        {children}
      </Block>
    </Block>
  );
}
