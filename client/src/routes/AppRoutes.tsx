import { Routes, Route } from "react-router-dom";

import Admin from "@/pages/Admin";
import DashBoard from "@/pages/DashBoard";
import ElectionTimerSettings from "@/pages/ElectionTimerSettings";
import ForgotPassword from "@/pages/ForgotPassword";
import Help from "@/pages/Help";
import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";
import OAuthSuccess from "@/pages/OAuthSuccess";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import Results from "@/pages/Results";
import SignIn from "@/pages/SignIn";
import SignUpStart from "@/pages/SignUpStart";
import VerifyCode from "@/pages/VerifyCode";
import VotingProcess from "@/pages/VotingProcess";

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
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
