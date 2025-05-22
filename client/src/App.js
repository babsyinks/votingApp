import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Admin from "./pages/Admin";
import AdminSignIn from "./AdminSignIn";
import ElectionTimeSetter from "./ElectionTimeSetter";
import Help from "./Help";
import NotFound from "./NotFound";
import RegisterOrLogin from "./RegisterOrLogin";
import VoteNominees from "./features/election/components/VoteNominees";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<RegisterOrLogin />} />
          <Route exact path="/admin" element={<Admin />} />
          <Route exact path="/vote" element={<VoteNominees />} />
          <Route exact path="/time" element={<ElectionTimeSetter />} />
          <Route exact path="/admin-signin" element={<AdminSignIn />} />
          <Route exact path="/help" element={<Help />} />
          <Route
            exact
            path="/reset-election"
            element={<AdminSignIn resetElection={true} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
