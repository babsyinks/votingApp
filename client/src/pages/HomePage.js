import React from "react";
import { useSelector } from "react-redux";
import { userAuth } from "../features/auth/userAuthSlice";
import Main from "../components/ui/Main";
import HeroSection from "../features/home/components/HeroSection";
import FeatureSection from "../features/home/components/FeatureSection";

export default function HomePage() {
  const userIsAuthenticated = useSelector(userAuth);

  return (
    <Main className="mnh-100vh">
      <HeroSection userIsAuthenticated={userIsAuthenticated} />
      <FeatureSection />
    </Main>
  );
}
