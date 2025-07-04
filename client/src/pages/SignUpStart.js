import Heading from "components/ui/Heading";
import Block from "components/ui/Block";
import SignUpStartAccountExists from "features/auth/components/SignUpStartAccountExists";
import SignUpStartAccountDoesNotExist from "features/auth/components/SignUpStartAccountDoesNotExist";

export default function SignUpStart() {
  return (
    <Block className="space-y-4 max-w-md mx-auto">
      <Heading type="h1" className="text-2xl font-semibold">
        Create your account
      </Heading>
      <SignUpStartAccountDoesNotExist />
      <SignUpStartAccountExists />
    </Block>
  );
}
