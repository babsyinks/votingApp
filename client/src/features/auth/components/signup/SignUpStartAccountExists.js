import AuthAlternativeAccessMeans from "../AuthAlternativeAccessMeans";

export default function SignUpStartAccountExists() {
  return (
    <AuthAlternativeAccessMeans
      question="Already have an account?"
      btnLabel="Sign in"
      route="/signin"
    />
  );
}
