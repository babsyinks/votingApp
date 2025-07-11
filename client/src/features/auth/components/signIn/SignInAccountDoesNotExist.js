import AlternativeAccessMeans from "../AlternativeAccessMeans";

export default function SignInAccountDoesNotExist() {
  return (
    <AlternativeAccessMeans
      question="Don't have an account?"
      btnLabel="Sign up"
      route="/signup-start"
    />
  );
}
