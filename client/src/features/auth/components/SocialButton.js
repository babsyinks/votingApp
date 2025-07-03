import Button from "components/ui/Button";

export default function SocialButton({ type, className }) {
  const socialLogin = () => {
    window.location.href = `http://localhost:3001/auth/${type.toLowerCase()}`;
  };

  return (
    <Button onClick={socialLogin} className={`btn-social w-full ${className}`}>
      {`Continue with ${type}`}
    </Button>
  );
}
