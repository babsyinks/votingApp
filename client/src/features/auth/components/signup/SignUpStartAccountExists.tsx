import AuthAlternativeAccessMeans from "../AuthAlternativeAccessMeans";

/**
 * This component displays a means for the user to sign in from the sign up page if the user
 * has an existing account. 
 */
export default function SignUpStartAccountExists() {
  return (
    <AuthAlternativeAccessMeans
      question="Already have an account?"
      btnLabel="Sign in"
      route="/signin"
    />
  );
}
