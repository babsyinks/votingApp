import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useWindowSize from "hooks/useWindowSize";
import useStatusOfElectionRedirect from "features/auth/hooks/useStatusOfElectionRedirect";
import { selectUserJustVerified } from "features/auth/verificationSlice";
import AuthFrame from "features/auth/components/AuthFrame";
import AuthHeading from "features/auth/components/AuthHeading";
import SignUpRegistrationForm from "features/auth/components/signup/SignUpRegistrationForm";

export default function Register() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email");
  const userJustVerified = useSelector(selectUserJustVerified);
  const redirect = useStatusOfElectionRedirect();
  const { height } = useWindowSize();
  const mb = height < 940 ? "mb-1p5r" : "";

  useEffect(() => {
    if (redirect.length > 0) {
      navigate(redirect, { replace: true });
    }
  }, [redirect, navigate]);

  if (email && userJustVerified) {
    return (
      <AuthFrame className={mb}>
        <AuthHeading>
          Complete Your Registration
        </AuthHeading>
        <SignUpRegistrationForm email={email} />
      </AuthFrame>
    );
  } else return null;
}
