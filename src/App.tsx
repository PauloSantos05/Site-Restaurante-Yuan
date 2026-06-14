/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Screen, UserSession } from "./types";
import SplashView from "./components/SplashView";
import LoginView from "./components/LoginView";
import RegisterView from "./components/RegisterView";
import ForgotPasswordView from "./components/ForgotPasswordView";
import DashboardView from "./components/DashboardView";
import Decorations from "./components/Decorations";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Splash);
  const [session, setSession] = useState<UserSession>({
    fullName: "",
    email: "",
    phone: "",
    isLoggedIn: false
  });

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleLoginSuccess = (userSession: UserSession) => {
    setSession(userSession);
    setCurrentScreen(Screen.Dashboard);
  };

  const handleRegisterSuccess = (userSession: UserSession) => {
    setSession(userSession);
    setCurrentScreen(Screen.Dashboard);
  };

  const handleGuestAccess = (guestSession: UserSession) => {
    setSession(guestSession);
    setCurrentScreen(Screen.Dashboard);
  };

  const handleLogout = () => {
    setSession({
      fullName: "",
      email: "",
      phone: "",
      isLoggedIn: false
    });
    setCurrentScreen(Screen.Splash);
  };

  return (
    <div className="min-h-screen bg-[#F0EDE6] overflow-x-hidden font-body text-[#4A4438] relative">
      {/* Absolute background bamboo leaves & decoration graphics */}
      <Decorations />

      {/* Render screens based on currentState with AnimatePresence */}
      <AnimatePresence mode="wait">
        {currentScreen === Screen.Splash && (
          <motion.div key="splash" className="w-full flex items-center justify-center">
            <SplashView
              onNavigate={handleNavigate}
              onGuestAccess={handleGuestAccess}
            />
          </motion.div>
        )}

        {currentScreen === Screen.Login && (
          <motion.div key="login" className="w-full flex items-center justify-center">
            <LoginView
              onNavigate={handleNavigate}
              onLoginSuccess={handleLoginSuccess}
            />
          </motion.div>
        )}

        {currentScreen === Screen.Register && (
          <motion.div key="register" className="w-full flex items-center justify-center">
            <RegisterView
              onNavigate={handleNavigate}
              onRegisterSuccess={handleRegisterSuccess}
            />
          </motion.div>
        )}

        {currentScreen === Screen.ForgotPassword && (
          <motion.div key="forgot-password" className="w-full flex items-center justify-center">
            <ForgotPasswordView
              onNavigate={handleNavigate}
            />
          </motion.div>
        )}

        {currentScreen === Screen.Dashboard && (
          <motion.div key="dashboard" className="w-full">
            <DashboardView
              session={session}
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
