/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Screen {
  Splash = "splash",
  Login = "login",
  Register = "register",
  ForgotPassword = "forgot_password",
  Dashboard = "dashboard"
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "entradas" | "principais" | "sobremesas" | "bebidas";
  imagePrompt: string;
  spicyLevel: 0 | 1 | 2 | 3;
  isImperialSpecialty: boolean;
}

export interface TableBooking {
  id: string;
  date: string;
  time: string;
  guests: number;
  saloon: string;
  status: "confirmado" | "pendente";
  customerName: string;
  notes?: string;
}

export interface UserSession {
  fullName: string;
  email: string;
  phone: string;
  isLoggedIn: boolean;
}
