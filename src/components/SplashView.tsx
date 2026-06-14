/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Screen, UserSession } from "../types";

interface SplashViewProps {
  onNavigate: (screen: Screen) => void;
  onGuestAccess: (session: UserSession) => void;
}

export default function SplashView({ onNavigate, onGuestAccess }: SplashViewProps) {
  const handleGuest = () => {
    onGuestAccess({
      fullName: "Visitante Imperial",
      email: "visitante@yuan.com.br",
      phone: "(11) 99999-9999",
      isLoggedIn: true
    });
  };

  return (
    <main className="page relative min-h-screen flex items-center justify-center">
      <motion.div
        className="card flex flex-col items-center bg-[#F5F2EC]/60 backdrop-blur-md p-10 rounded-2xl border border-[#E4DFCF] shadow-lg max-w-[460px] w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Subtle decorative Chinese knot icon or emblem above */}
        <motion.div 
          className="text-[#C8A84B] text-3xl mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          🐉
        </motion.div>

        {/* Logo */}
        <div className="logo flex items-center gap-3 mb-3 select-none" aria-label="Yuan">
          <span className="logo__part logo__part--large font-display font-bold text-6xl tracking-widest text-[#7A9E82]">YU</span>
          <span className="logo__icon" aria-hidden="true">
            <svg width="42" height="42" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="13" stroke="#C8A84B" strokeWidth="2" />
              <circle cx="16" cy="16" r="7" stroke="#C8A84B" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="2" fill="#C8A84B" />
            </svg>
          </span>
          <span className="logo__part logo__part--large font-display font-bold text-6xl tracking-widest text-[#7A9E82]">AN</span>
        </div>

        {/* Divider line */}
        <motion.div
          className="logo__line"
          aria-hidden="true"
          initial={{ scaleX: 0.2 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />

        {/* Subtitle */}
        <motion.p
          className="subtitle text-sm font-light uppercase tracking-widest text-[#9A9180] mb-8 font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Culinária Imperial Chinesa
        </motion.p>

        {/* Interactive options */}
        <motion.div
          className="w-full flex flex-col gap-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <button
            onClick={() => onNavigate(Screen.Login)}
            className="btn-entrar font-medium transition-all"
            id="btnGoLogin"
          >
            Fazer Login
          </button>

          <button
            onClick={() => onNavigate(Screen.Register)}
            className="w-full py-4 bg-[#FDFAF5] text-[#7A9E82] border-1.5 border-[#7A9E82] rounded-xl text-xs font-semibold tracking-wider hover:bg-[#FDFDFD] active:scale-98 transition-all uppercase text-center"
            id="btnGoRegister"
          >
            Criar Minha Conta
          </button>

          <button
            onClick={handleGuest}
            className="w-full py-2.5 text-[#9A9180] hover:text-[#4A4438] text-xs font-light tracking-wide hover:underline active:scale-98 transition-all text-center"
            id="btnGoGuest"
          >
            Entrar como Convidado
          </button>
        </motion.div>

        {/* Traditional aesthetic footer in card */}
        <p className="text-[10px] text-[#A8A08E] font-serif tracking-[0.2em] uppercase mt-10">
          — 誠 信 尊 貴 傳 承 —
        </p>
      </motion.div>
    </main>
  );
}
