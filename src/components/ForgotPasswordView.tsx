/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Screen } from "../types";

interface ForgotPasswordViewProps {
  onNavigate: (screen: Screen) => void;
}

export default function ForgotPasswordView({ onNavigate }: ForgotPasswordViewProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const validate = () => {
    if (!email) {
      setEmailError("O campo de email é obrigatório");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Insira um endereço de email válido");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <main className="page relative min-h-screen flex items-center justify-center">
      <motion.div
        className="card flex flex-col items-center bg-[#F5F2EC]/90 backdrop-blur-md p-8 md:p-10 rounded-2xl border border-[#E4DFCF] shadow-lg max-w-[440px] w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
      >
        {/* Return Button */}
        <button
          onClick={() => onNavigate(Screen.Splash)}
          className="absolute top-4 left-4 text-[#C8A84B] hover:text-[#7A9E82] text-sm flex items-center gap-1 select-none font-light"
          id="btnBackToSplash"
        >
          ← Início
        </button>

        {!isSent ? (
          <>
            {/* Logo */}
            <div className="logo flex items-center gap-2 mb-2 select-none" aria-label="Yuan">
              <span className="logo__part font-display font-medium text-4xl">Esqueci minha senha</span>
            </div>

            {/* Divider line */}
            <div className="logo__line" aria-hidden="true"></div>

            {/* Subtitle */}
            <p className="subtitle text-sm text-[#9A9180] font-body font-light mb-8">
              Insira seu email para redefinir a senha
            </p>

            {/* Form */}
            <form className="form w-full flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              <div className={`field ${emailError ? "field--error" : ""}`} id="fieldEmail">
                <input
                  className="field__input w-full p-4 rounded-xl border bg-[#FDFAF5]"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  required
                />
                <span className="field__error" id="emailError" role="alert">
                  {emailError}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(Screen.Login)}
                className="forgot-link text-xs text-[#7A9E82] hover:underline mb-2 block"
                id="linkVoltarLogin"
              >
                Voltar ao login
              </button>

              <button type="submit" className="btn-entrar" id="btnEntrar" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="btn-entrar__loader" aria-hidden="true" />
                    <span className="btn-entrar__text opacity-70">Enviando...</span>
                  </>
                ) : (
                  <span className="btn-entrar__text">Enviar link</span>
                )}
              </button>
            </form>
          </>
        ) : (
          <motion.div
            className="text-center flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-[#7A9E82]/10 rounded-full flex items-center justify-center text-[#7A9E82] text-3xl mb-4">
              ✉️
            </div>
            <h3 className="font-display font-semibold text-2xl text-[#4A4438] mb-2">Link Enviado!</h3>
            <p className="text-sm text-[#9A9180] font-light font-body mb-8 px-4 leading-relaxed">
              Enviamos um link de redefinição para o email <strong className="text-[#4A4438] font-medium">{email}</strong>. Por favor, verifique sua caixa de entrada e spam.
            </p>

            <button
              onClick={() => onNavigate(Screen.Login)}
              className="btn-entrar max-w-[200px]"
              id="btnBackToLoginSuccess"
            >
              Ir para o Login
            </button>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
