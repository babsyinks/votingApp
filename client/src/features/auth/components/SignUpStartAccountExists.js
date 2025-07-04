import AlternativeAccessMeans from "./AlternativeAccessMeans";

export default function SignUpStartAccountExists() {
  return (
    <AlternativeAccessMeans
      question="Already have an account?"
      btnLabel="Sign in"
      route="/login"
    />
  );
}
