import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useStatusOfElectionRedirect from "features/auth/hooks/useStatusOfElectionRedirect";
import { selectUserJustVerified } from "features/auth/verificationSlice";
import Heading from "components/ui/Heading";
import Block from "components/ui/Block";
import RegistrationForm from "features/auth/components/signup/RegistrationForm";

export default function Register() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email");
  const userJustVerified = useSelector(selectUserJustVerified);
  const redirect = useStatusOfElectionRedirect();

  useEffect(() => {
    if (redirect.length > 0) {
      navigate(redirect, { replace: true });
    }
  }, [redirect, navigate]);

  if (email && userJustVerified) {
    return (
      <Block className="space-y-4 max-w-md mx-auto">
        {" "}
        <Heading type="h1" className="text-2xl font-semibold">
          Complete Your Registration
        </Heading>
        <RegistrationForm email={email} />
      </Block>
    );
  } else return null;
}
