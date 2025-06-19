import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userAuth } from "features/auth/userAuthSlice";
import {
  fetchThenSetCurrentTimerStatus,
} from "features/timer/timerSlice";
import Main from "components/ui/Main";
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
      <ElectionStatusIndicator />
      <HeroSection userIsAuthenticated={userIsAuthenticated} />
      <FeatureSection />
      <HelpSection />
    </Main>
  );
}
