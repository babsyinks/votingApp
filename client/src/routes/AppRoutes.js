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
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/register" element={<Register />} />
      <Route exact path="/signin" element={<SignIn />} />
      <Route exact path="/signup-start" element={<SignUpStart />} />
      <Route exact path="/verify-code" element={<VerifyCode />} />
      <Route exact path="/oauth-success" element={<OAuthSuccess />} />
      <Route exact path="/forgot-password" element={<ForgotPassword />} />
      <Route exact path="/reset-password/:resetCode" element={<ResetPassword />} />
      <Route exact path="/admin" element={<Admin />} />
      <Route exact path="/vote" element={<VotingProcess />} />
      <Route exact path="/time" element={<ElectionTimerSettings />} />
      <Route exact path="/help" element={<Help />} />
      <Route exact path="/results" element={<Results />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
