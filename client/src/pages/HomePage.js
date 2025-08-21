import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userAuth } from "features/auth/userAuthSlice";
import { fetchThenSetCurrentTimerStatus } from "features/timer/timerSlice";
import featureCardConfig from "features/home/config/featureCardConfig";
import Main from "components/ui/Main";
import MainHeader from "layout/MainHeader";
import MainFooter from "layout/MainFooter";
import HeroSection from "features/home/components/HeroSection";
import MiniFeatureSection from "features/home/components/MiniFeatureSection";
import TestimonialList from "features/home/components/TestimonialList";
import IndustriesServedDetails from "features/home/components/IndustriesServed";
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
      <MiniFeatureSection section={featureCardConfig.expect} />
      <TestimonialList />
      <MiniFeatureSection section={featureCardConfig.features} />
      <IndustriesServedDetails />
      <HelpSection />
      <MainFooter />
    </Main>
  );
}
