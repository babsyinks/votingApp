import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Admin from "./pages/Admin";
import ElectionTimeSetter from "./ElectionTimeSetter";
import Help from "./Help";
import NotFound from "./NotFound";
import RegisterOrLogin from "./RegisterOrLogin";
import ElectionDetails from "./pages/ElectionDetails";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/login" element={<RegisterOrLogin />} />
          <Route exact path="/admin" element={<Admin />} />
          <Route exact path="/vote" element={<ElectionDetails />} />
          <Route exact path="/time" element={<ElectionTimeSetter />} />
          <Route exact path="/help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
