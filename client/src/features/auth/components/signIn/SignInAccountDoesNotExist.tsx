import AuthAlternativeAccessMeans from "../AuthAlternativeAccessMeans";

/**
 * This component displays a means for the user to sign up from the sign in page if the user
 * does not have an existing account.
 */
export default function SignInAccountDoesNotExist() {
  return (
    <AuthAlternativeAccessMeans
      question="Don't have an account?"
      btnLabel="Sign up"
      route="/signup-start"
    />
  );
}
