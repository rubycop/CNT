import React, { useContext } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { NearContext } from "./context/near";
import { Contest, Home, Leaderboard, Vote } from "./pages";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";

export const App = () => {
  const near = useContext(NearContext);

  const ProtectedRoute = () => {
    if (!near.isSigned) return <Navigate to="/" replace />;

    return <Outlet />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/privacy" element={<Privacy />} />
        <Route exact path="/terms" element={<Terms />} />

        <Route element={<ProtectedRoute />}>
          <Route exact path="/contests" element={<Contest />} />
          <Route exact path="/vote" element={<Vote />} />
          <Route exact path="/leaderboard" element={<Leaderboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
