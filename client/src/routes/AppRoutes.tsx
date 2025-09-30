import { Routes, Route } from "react-router-dom";
import HomePage from "pages/HomePage";
import Admin from "pages/Admin";
import Help from "pages/Help";
import NotFound from "pages/NotFound";
import ElectionTimerSettings from "pages/ElectionTimerSettings";
import VotingProcess from "pages/VotingProcess";
import Results from "pages/Results";
import Register from "pages/Register";
import SignIn from "pages/SignIn";
import SignUpStart from "pages/SignUpStart";
import VerifyCode from "pages/VerifyCode";
import OAuthSuccess from "pages/OAuthSuccess";
import ForgotPassword from "pages/ForgotPassword";
import ResetPassword from "pages/ResetPassword";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup-start" element={<SignUpStart />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:resetCode" element={<ResetPassword />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/vote" element={<VotingProcess />} />
      <Route path="/time" element={<ElectionTimerSettings />} />
      <Route path="/help" element={<Help />} />
      <Route path="/results" element={<Results />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
