import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userAuth } from "features/auth/userAuthSlice";
import { fetchThenSetCurrentTimerStatus } from "features/timer/timerSlice";
import Main from "components/ui/Main";
import MainHeader from "layout/MainHeader";
import Footer from "layout/Footer";
import HeroSection from "features/home/components/HeroSection";
import FeatureSection from "features/home/components/FeatureSection";
import HelpSection from "features/home/components/HelpSection";
import ElectionStatusIndicator from "features/home/components/ElectionStatusIndicator";

export default function HomePage() {
  const userIsAuthenticated = useSelector(userAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchThenSetCurrentTimerStatus());
  }, [dispatch]);

  return (
    <Main className="mnh-100vh">
      <MainHeader />
      <ElectionStatusIndicator />
      <HeroSection userIsAuthenticated={userIsAuthenticated} />
      <FeatureSection />
      <HelpSection />
      <Footer />
    </Main>
  );
}
