import AuthAlternativeAccessMeans from "../AuthAlternativeAccessMeans";

export default function SignInAccountDoesNotExist() {
  return (
    <AuthAlternativeAccessMeans
      question="Don't have an account?"
      btnLabel="Sign up"
      route="/signup-start"
    />
  );
}
