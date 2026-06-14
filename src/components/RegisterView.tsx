/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Screen, UserSession } from "../types";

interface RegisterViewProps {
  onNavigate: (screen: Screen) => void;
  onRegisterSuccess: (session: UserSession) => void;
}

export default function RegisterView({ onNavigate, onRegisterSuccess }: RegisterViewProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    let isValid = true;

    // Full name validation
    if (!fullName.trim()) {
      setNameError("O campo de Nome Completo é obrigatório");
      isValid = false;
    } else if (fullName.trim().split(" ").length < 2) {
      setNameError("Insira seu nome e sobrenome completo");
      isValid = false;
    } else {
      setNameError("");
    }

    // Email validation
    if (!email) {
      setEmailError("O campo de email é obrigatório");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Insira um email válido (ex: nome@email.com)");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Phone validation
    if (!phone) {
      setPhoneError("O campo de telefone é obrigatório");
      isValid = false;
    } else if (phone.replace(/\D/g, "").length < 10) {
      setPhoneError("Telefone inválido (insira DDD + número)");
      isValid = false;
    } else {
      setPhoneError("");
    }

    // Password validation
    if (!password) {
      setPasswordError("O campo de senha é obrigatório");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Sua senha precisa ter no mínimo 6 caracteres");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setGeneralError("");

    try {
      const response = await fetch("/api/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: fullName,
          email: email,
          telefone: phone,
          senha: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setGeneralError(data.erro || "Falha ao efetuar cadastro imperial.");
        setIsLoading(false);
        return;
      }

      onRegisterSuccess({
        fullName: fullName,
        email: email,
        phone: phone,
        isLoggedIn: true
      });
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setGeneralError("Não foi possível conectar ao servidor imperial.");
    } finally {
      setIsLoading(false);
    }
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

        {/* Logo */}
        <div className="logo flex items-center gap-2 mb-2 select-none" aria-label="Yuan">
          <span className="logo__part font-display font-medium text-4xl">YU</span>
          <span className="logo__icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="13" stroke="#C8A84B" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="7" stroke="#C8A84B" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="2" fill="#C8A84B" />
            </svg>
          </span>
          <span className="logo__part font-display font-medium text-4xl">AN</span>
        </div>

        {/* Divider line */}
        <div className="logo__line" aria-hidden="true"></div>

        {/* Subtitle */}
        <p className="subtitle text-sm text-[#9A9180] font-light mb-8">Crie sua conta</p>

        {/* Form */}
        <form className="form w-full flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          {/* Nome completo field */}
          <div className={`field ${nameError ? "field--error" : ""}`} id="fieldNome">
            <input
              className="field__input w-full p-4 rounded-xl border bg-[#FDFAF5]"
              type="text"
              id="nome"
              name="nome"
              placeholder="Nome Completo"
              autoComplete="name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (nameError) setNameError("");
              }}
              required
            />
            <span className="field__error" id="nomeError" role="alert">
              {nameError}
            </span>
          </div>

          {/* Email field */}
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

          {/* Telefone field */}
          <div className={`field ${phoneError ? "field--error" : ""}`} id="fieldTelefone">
            <input
              className="field__input w-full p-4 rounded-xl border bg-[#FDFAF5]"
              type="text"
              id="telefone"
              name="telefone"
              placeholder="Telefone (DDD + número)"
              autoComplete="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (phoneError) setPhoneError("");
              }}
              required
            />
            <span className="field__error" id="telefoneError" role="alert">
              {phoneError}
            </span>
          </div>

          {/* Senha field */}
          <div className={`field field--password-wrapper ${passwordError ? "field--error" : ""}`} id="fieldSenha">
            <div className="relative w-full">
              <input
                className="field__input w-full p-4 pr-12 rounded-xl border bg-[#FDFAF5]"
                type={showPassword ? "text" : "password"}
                id="senha"
                name="senha"
                placeholder="Senha (mínimo 6 caracteres)"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                required
              />
              <button
                type="button"
                className="field__toggle absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#9A9180] hover:text-[#4A4438]"
                id="toggleSenha"
                onClick={handleTogglePassword}
                aria-label="Controle de sensibilidade da senha"
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  /* Eye-off icon */
                  <svg className="icon-eye-off" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                ) : (
                  /* Eye icon */
                  <svg className="icon-eye" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6" />
                  </svg>
                )}
              </button>
            </div>
            <span className="field__error" id="senhaError" role="alert">
              {passwordError}
            </span>
          </div>

          {/* General error feedback */}
          {generalError && (
            <div className="p-3 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg text-center font-medium" role="alert">
              {generalError}
            </div>
          )}

          {/* Submit button */}
          <button type="submit" className="btn-entrar mt-2" id="btnEntrar" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="btn-entrar__loader" aria-hidden="true" />
                <span className="btn-entrar__text opacity-70">Cadastrando...</span>
              </>
            ) : (
              <span className="btn-entrar__text">Cadastrar</span>
            )}
          </button>
        </form>

        {/* Existing account footer link */}
        <p className="register-line text-xs font-light text-[#9A9180] mt-6">
          Já possui uma conta?{" "}
          <button onClick={() => onNavigate(Screen.Login)} className="register-link text-[#7A9E82] font-semibold hover:underline">
            Faça login
          </button>
        </p>
      </motion.div>
    </main>
  );
}
