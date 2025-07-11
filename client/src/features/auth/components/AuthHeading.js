import Heading from "components/ui/Heading";

export default function AuthHeading({ children }) {
  return (
    <Heading type="h1" className="text-2xl lh-2r fw-600 ta-center">
      {children}
    </Heading>
  );
}
