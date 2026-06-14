/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MenuItem, TableBooking, UserSession } from "../types";
import { CUSTOM_MENU_ITEMS, SALOONS, REVIEWS } from "../data";
import {
  LogOut,
  Calendar,
  Users,
  CheckCircle2,
  MapPin,
  Sparkles,
  Clock,
  Compass,
  BookOpen,
  ChevronRight,
  ShoppingBag,
  X,
  Plus,
  Minus,
  UtensilsCrossed,
  Heart,
  Home,
  User as UserIcon,
  Search
} from "lucide-react";

interface DashboardViewProps {
  session: UserSession;
  onLogout: () => void;
}

export default function DashboardView({ session, onLogout }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"home" | "menu" | "carrinho" | "perfil">("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Reservation form states
  const [resDate, setResDate] = useState("");
  const [resTime, setResTime] = useState("19:30");
  const [resGuests, setResGuests] = useState(2);
  const [resSaloon, setResSaloon] = useState(SALOONS[0].id);
  const [resNotes, setResNotes] = useState("");
  const [myReservations, setMyReservations] = useState<TableBooking[]>([]);
  const [showResSuccess, setShowResSuccess] = useState(false);
  const [latestRes, setLatestRes] = useState<TableBooking | null>(null);

  // Dish details modal state
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  // Categories helper
  const categories = [
    { id: "all", label: "Todos os Pratos" },
    { id: "entradas", label: "Entradas (前菜)" },
    { id: "principais", label: "Pratos Principais (主菜)" },
    { id: "sobremesas", label: "Sobremesas (甜点)" },
    { id: "bebidas", label: "Bebidas & Chás (饮料)" }
  ];

  // Map home favorites with exact names and image styles matching the user's high-end screenshot
  const homeFavorites: MenuItem[] = [
    {
      id: "har-gow-imperial",
      name: "Har Gow Imperial",
      description: "Delicados dumplings de camarão cozidos no vapor com massa translúcida e temperos imperiais.",
      price: 45.90,
      category: "entradas",
      imagePrompt: "Steaped shrimp dumplings",
      spicyLevel: 0,
      isImperialSpecialty: true
    },
    {
      id: "siu-mai-jade",
      name: "Siu Mai de Jade",
      description: "Tradicionais dumplings abertos recheados com lombo suíno selecionado, cogumelos e toque de trufas.",
      price: 42.90,
      category: "entradas",
      imagePrompt: "Gourmet siu mai open dumplings",
      spicyLevel: 1,
      isImperialSpecialty: true
    },
    {
      id: "pato-laqueado-pequim",
      name: "Pato Laqueado Pequim",
      description: "Pato inteiro laqueado ao estilo imperial de elite, com panquecas finas, pepino fresco, cebolinha e molho hoisin artesanal.",
      price: 189.90,
      category: "principais",
      imagePrompt: "Imperial crispy duck",
      spicyLevel: 0,
      isImperialSpecialty: true
    }
  ];

  // Handcrafted premium URLs or mock illustration containers to capture the luxury gourmet photos
  const favoriteImages: Record<string, string> = {
    "har-gow-imperial": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=500",
    "siu-mai-jade": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=500",
    "pato-laqueado-pequim": "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=500"
  };

  // Filtering menu items
  const filteredItems = CUSTOM_MENU_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart logic
  const handleAddToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existing = prevCart.find(c => c.item.id === item.id);
      if (existing) {
        return prevCart.map(c =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (itemId: string, delta: number) => {
    setCart(prevCart => {
      return prevCart
        .map(c => {
          if (c.item.id === itemId) {
            const nextQty = c.quantity + delta;
            return { ...c, quantity: nextQty };
          }
          return c;
        })
        .filter(c => c.quantity > 0);
    });
  };

  const cartTotal = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
  const cartItemCount = cart.reduce((acc, c) => acc + c.quantity, 0);

  // Favorites toggle
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  // Reservation handler
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resDate) {
      alert("Por favor, selecione uma data.");
      return;
    }

    const selectedSaloonObj = SALOONS.find(s => s.id === resSaloon);

    const newBooking: TableBooking = {
      id: "res-" + Math.floor(Math.random() * 10000),
      date: resDate,
      time: resTime,
      guests: resGuests,
      saloon: selectedSaloonObj ? selectedSaloonObj.name : "Salão Principal",
      status: "confirmado",
      customerName: session.fullName,
      notes: resNotes
    };

    setMyReservations(prev => [newBooking, ...prev]);
    setLatestRes(newBooking);
    setShowResSuccess(true);

    // Reset Form
    setResDate("");
    setResNotes("");
  };

  const handleCancelBooking = (id: string) => {
    if (confirm("Tem certeza que deseja cancelar esta reserva imperial?")) {
      setMyReservations(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] relative text-[#4A4438] pb-16">
      {/* Decorative Top Imperial Line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#7B2D3A] via-[#C8A84B] to-[#7B2D3A]" />

      {/* Navigation Header strictly matching the user's uploaded layout */}
      <header className="sticky top-0 bg-white border-b border-[#EBE7DF] px-6 h-24 flex items-center justify-between z-40 max-w-7xl mx-auto w-full">
        {/* Logo left side */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setActiveTab("home")}>
          <div className="w-7 h-7 rounded-full border border-[#C8A84B]/60 flex items-center justify-center p-0.5">
            <div className="w-5 h-5 rounded-full border border-[#C8A84B] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full border border-[#C8A84B] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#C8A84B]" />
              </div>
            </div>
          </div>
          <span className="font-serif text-[#7A9E82] text-xl tracking-[0.25em] font-medium logo-font">YUAN</span>
        </div>

        {/* Navigation tabs center-middle stacked vertically */}
        <nav className="flex gap-4 sm:gap-8 items-center h-full">
          {/* HOME TAB */}
          <button
            onClick={() => setActiveTab("home")}
            className="flex flex-col items-center gap-1 group relative pb-1 pt-1 h-full justify-center min-w-[50px] sm:min-w-[64px]"
            id="tabHome"
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              activeTab === "home" ? "bg-[#7A9E82]/20 text-[#5B7561]" : "text-[#9A9180] group-hover:text-[#4A4438]"
            }`}>
              <Home size={20} />
            </div>
            <span className={`text-[11px] font-medium tracking-wide transition-colors ${
              activeTab === "home" ? "text-[#5B7561] font-semibold" : "text-[#9A9180]"
            }`}>
              Home
            </span>
            {activeTab === "home" && (
              <motion.div layoutId="headerActiveLine" className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#7A9E82] rounded-full" />
            )}
          </button>

          {/* MENU TAB */}
          <button
            onClick={() => setActiveTab("menu")}
            className="flex flex-col items-center gap-1 group relative pb-1 pt-1 h-full justify-center min-w-[50px] sm:min-w-[64px]"
            id="tabMenu"
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              activeTab === "menu" ? "bg-[#7A9E82]/20 text-[#5B7561]" : "text-[#9A9180] group-hover:text-[#4A4438]"
            }`}>
              <UtensilsCrossed size={19} />
            </div>
            <span className={`text-[11px] font-medium tracking-wide transition-colors ${
              activeTab === "menu" ? "text-[#5B7561] font-semibold" : "text-[#9A9180]"
            }`}>
              Menu
            </span>
            {activeTab === "menu" && (
              <motion.div layoutId="headerActiveLine" className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#7A9E82] rounded-full" />
            )}
          </button>

          {/* CARRINHO TAB with active Count underneath */}
          <button
            onClick={() => setActiveTab("carrinho")}
            className="flex flex-col items-center gap-1 group relative pb-1 pt-1 h-full justify-center min-w-[50px] sm:min-w-[70px]"
            id="tabCart"
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 relative ${
              activeTab === "carrinho" ? "bg-[#7A9E82]/20 text-[#5B7561]" : "text-[#9A9180] group-hover:text-[#4A4438]"
            }`}>
              <ShoppingBag size={19} />
            </div>
            <span className={`text-[11px] font-medium tracking-wide transition-colors text-center ${
              activeTab === "carrinho" ? "text-[#5B7561] font-semibold" : "text-[#9A9180]"
            }`}>
              <span className="block">{cartItemCount}</span>
              <span className="block text-[9px] -mt-0.5 uppercase tracking-wider">Carrinho</span>
            </span>
            {activeTab === "carrinho" && (
              <motion.div layoutId="headerActiveLine" className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#7A9E82] rounded-full" />
            )}
          </button>

          {/* PERFIL TAB */}
          <button
            onClick={() => setActiveTab("perfil")}
            className="flex flex-col items-center gap-1 group relative pb-1 pt-1 h-full justify-center min-w-[50px] sm:min-w-[64px]"
            id="tabProfile"
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              activeTab === "perfil" ? "bg-[#7A9E82]/20 text-[#5B7561]" : "text-[#9A9180] group-hover:text-[#4A4438]"
            }`}>
              <UserIcon size={19} />
            </div>
            <span className={`text-[11px] font-medium tracking-wide transition-colors ${
              activeTab === "perfil" ? "text-[#5B7561] font-semibold" : "text-[#9A9180]"
            }`}>
              Perfil
            </span>
            {activeTab === "perfil" && (
              <motion.div layoutId="headerActiveLine" className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#7A9E82] rounded-full" />
            )}
          </button>
        </nav>

        {/* Search tool right side in sage capsule */}
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {isSearchExpanded && (
              <motion.input
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 160, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== "menu") setActiveTab("menu");
                }}
                placeholder="Pesquisar iguarias..."
                className="p-2 text-xs border border-[#E4DFCF] bg-white rounded-lg outline-none focus:border-[#7A9E82] shadow-xs text-[#4A4438]"
                autoFocus
              />
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsSearchExpanded(prev => !prev)}
            className="w-11 h-10 rounded-xl bg-[#7A9E82]/15 flex items-center justify-center cursor-pointer hover:bg-[#7A9E82]/25 duration-200"
            title="Pesquisar pratos"
          >
            <Search size={18} className="text-[#5B7561]" />
          </button>
        </div>
      </header>

      {/* Main Content View with Transitions */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-6">
        <AnimatePresence mode="wait">
          {/* TAB 1: HOME */}
          {activeTab === "home" && (
            <motion.div
              key="homeTab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-12"
            >
              {/* HERO BANNER STRICTLY INSPIRED BY THE UPLOADED DESIGN */}
              <div className="w-full h-[360px] md:h-[400px] rounded-2xl overflow-hidden relative flex flex-col justify-center items-center text-center shadow-md select-none bg-[#110D09]">
                {/* Background Side-By-Side food representation collage */}
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 h-full opacity-45 relative">
                    <img
                      src="https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=700"
                      alt="Rice Bowl"
                      className="w-full h-full object-cover mix-blend-lighten"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                  </div>
                  <div className="w-1/2 h-full opacity-55 relative">
                    <img
                      src="https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=900"
                      alt="Glazed gourmet stirfry"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-black/80 to-transparent" />
                  </div>
                </div>

                {/* Dark rich ambient overlay for pristine legibility */}
                <div className="absolute inset-0 bg-black/40 z-0" />

                {/* Center Content Grouping */}
                <div className="z-10 px-4 max-w-2xl space-y-3">
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-[1px] w-8 bg-[#C8A84B]/60" />
                    <span className="text-xs uppercase tracking-[0.3em] text-[#C8A84B] font-semibold text-shadow">
                      RESTAURANTE IMPERIAL
                    </span>
                    <div className="h-[1px] w-8 bg-[#C8A84B]/60" />
                  </div>

                  <h1 className="font-serif text-5xl md:text-7xl font-light text-white tracking-[0.25em] leading-none uppercase">
                    YUAN
                  </h1>

                  <p className="text-[11px] md:text-xs text-white/95 uppercase tracking-[0.35em] font-light">
                    EXPERIÊNCIA GASTRONÔMICA IMPERIAL
                  </p>

                  <div className="pt-4">
                    <button
                      onClick={() => setActiveTab("menu")}
                      className="px-8 py-3 bg-[#7B2D3A] text-white rounded-full hover:bg-[#68232F] transition-all transform hover:scale-105 active:scale-98 text-xs font-semibold tracking-wider uppercase shadow-md flex items-center gap-2 mx-auto"
                    >
                      Explorar Menu <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* FAVORITOS DA CASA (STRICT COMPOSITE) */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[#C8A84B] text-xs font-semibold uppercase tracking-wider">
                      <span>★</span>
                      <span>SELEÇÃO ESPECIAL</span>
                    </div>
                    <h2 className="font-serif text-3xl font-medium text-[#4A4438] tracking-wide">
                      Favoritos da Casa
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab("menu");
                      setSelectedCategory("all");
                    }}
                    className="text-xs font-medium text-[#7A9E82] hover:text-[#5B7561] hover:underline flex items-center gap-1"
                  >
                    Ver todos <ChevronRight size={14} />
                  </button>
                </div>

                {/* Three premium selected cards strictly designed to match the uploaded screenshot */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {homeFavorites.map(item => {
                    const picUrl = favoriteImages[item.id] || "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=500";
                    return (
                      <motion.div
                        whileHover={{ y: -6 }}
                        onClick={() => setSelectedDish(item)}
                        key={item.id}
                        className="bg-white rounded-2xl border border-[#EBE7DF] overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full group relative"
                      >
                        {/* Upper image with floating golden Price Tag Pill */}
                        <div className="h-56 relative overflow-hidden bg-[#7B2D3A]/5 border-b border-[#EBE7DF]">
                          <img
                            src={picUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Rich gold floating price pill exactly like the screenshot */}
                          <div className="absolute top-4 right-4 bg-[#9B7744] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md tracking-wide">
                            R$ {item.price.toFixed(2)}
                          </div>

                          {/* Extra luxury indicator badge */}
                          {item.isImperialSpecialty && (
                            <div className="absolute bottom-4 left-4 px-2 py-0.5 bg-[#C8A84B] text-white text-[9px] font-semibold uppercase tracking-wider rounded">
                              Especialidade Imperial
                            </div>
                          )}
                        </div>

                        {/* Text info and purchase action bottom */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-1">
                            <h3 className="font-serif font-semibold text-lg text-[#4A4438] group-hover:text-[#7B2D3A] transition-colors leading-snug">
                              {item.name}
                            </h3>
                            <p className="text-xs text-[#9A9180] font-light leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                            className="w-full py-2 bg-[#7A9E82] hover:bg-[#6D8F75] text-[#FFFFFF] text-[10px] sm:text-xs font-bold rounded-lg tracking-wider uppercase transition-all flex items-center justify-center gap-1.5"
                          >
                            <Plus size={14} /> Adicionar ao Pedido
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: MENU (THE FULL CARDÁPIO ROW AND GRID) */}
          {activeTab === "menu" && (
            <motion.div
              key="menuTab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              {/* Category buttons row */}
              <div className="flex flex-wrap gap-2 pb-2 border-b border-[#EBE7DF]">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase ${
                      selectedCategory === cat.id
                        ? "bg-[#7A9E82] text-white shadow-sm"
                        : "bg-white text-[#9A9180] border border-[#EBE7DF] hover:text-[#4A4438] hover:bg-[#FAF8F5]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Dishes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => {
                  const isFavorite = favorites.includes(item.id);
                  return (
                    <motion.div
                      layout
                      key={item.id}
                      onClick={() => setSelectedDish(item)}
                      className="bg-white rounded-xl border border-[#EBE7DF] overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col h-full group relative"
                    >
                      {/* Dish Thumbnail placeholder box with imperial colors */}
                      <div className="h-44 bg-[#7B2D3A]/5 border-b border-[#EBE7DF] relative flex items-center justify-center overflow-hidden">
                        {/* Interactive Favorite Icon */}
                        <button
                          onClick={(e) => toggleFavorite(item.id, e)}
                          className="absolute top-3 right-3 p-2 bg-[#FDFAF5] border border-[#E4DFCF] rounded-full text-[#9A9180] hover:text-[#7B2D3A] transition-all z-10 shadow-xs"
                          title="Favoritar Prato"
                        >
                          <Heart size={14} fill={isFavorite ? "#7B2D3A" : "transparent"} stroke={isFavorite ? "#7B2D3A" : "currentColor"} />
                        </button>

                        <div className="text-center p-4">
                          <p className="text-[#C8A84B] text-4xl mb-2 select-none group-hover:scale-110 transition-transform duration-300">
                            {item.category === "entradas" ? "🥟" : item.category === "principais" ? "🍲" : item.category === "sobremesas" ? "🧁" : "🍵"}
                          </p>
                          <p className="text-[10px] tracking-widest text-[#9A9180] uppercase font-mono">
                            Prato Dinastia Yuan
                          </p>
                        </div>

                        {/* Special luxury imperial badge info */}
                        {item.isImperialSpecialty && (
                          <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-[#C8A84B] text-[#FFFFFF] text-[9px] font-semibold uppercase tracking-wider rounded">
                            Especialidade Imperial
                          </div>
                        )}
                      </div>

                      {/* Info body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-serif font-medium text-lg leading-tight text-[#4A4438] group-hover:text-[#7B2D3A] transition-colors">
                              {item.name}
                            </h3>
                            <span className="font-serif font-bold text-base text-[#7B2D3A] whitespace-nowrap">
                              R$ {item.price.toFixed(2)}
                            </span>
                          </div>

                          {/* Spicy indicator */}
                          {item.spicyLevel > 0 && (
                            <div className="flex items-center gap-1 mb-2">
                              <span className="text-[10px] text-[#9A9180] font-light">Nível de Pimenta:</span>
                              <span className="text-xs text-[#B94040]">
                                {"🌶️".repeat(item.spicyLevel)}
                              </span>
                            </div>
                          )}

                          <p className="text-xs text-[#9A9180] font-light leading-relaxed line-clamp-3 mb-4">
                            {item.description}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          className="w-full py-2.5 bg-[#7A9E82] hover:bg-[#6D8F75] text-[#FFFFFF] text-xs font-semibold rounded-lg tracking-wider uppercase transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus size={14} /> Adicionar Pedido
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 3: DEDICATED FULL SCREEN CART SCREEN */}
          {activeTab === "carrinho" && (
            <motion.div
              key="carrinhoTab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-2xl border border-[#EBE7DF] shadow-xs space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-[#EBE7DF]">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={22} className="text-[#7B2D3A]" />
                  <h2 className="font-serif text-2xl text-[#4A4438]">Seu Pedido Imperial</h2>
                </div>
                <span className="text-xs text-[#9A9180] uppercase tracking-wider font-medium">
                  {cartItemCount} itens no carrinho
                </span>
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <p className="text-5xl">🍲</p>
                  <p className="text-sm text-[#9A9180] font-light max-w-sm mx-auto">
                    Seu pedido de banquete está vazio. Adicione deliciosas opções tradicionais do menu para fazer seu pedido à cozinha do palácio.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab("menu")}
                      className="px-6 py-2.5 bg-[#7A9E82] text-white rounded-full hover:bg-[#5B7561] text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      Ir para o Menu
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="divide-y divide-[#EBE7DF]/60">
                    {cart.map(c => (
                      <div key={c.item.id} className="py-4 flex justify-between items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif font-semibold text-sm text-[#4A4438] truncate">
                            {c.item.name}
                          </h4>
                          <span className="text-xs text-[#7B2D3A] font-semibold">
                            R$ {(c.item.price * c.quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Stepper Quantity control */}
                        <div className="flex items-center gap-3 border border-[#EBE7DF] rounded-xl bg-[#FAF8F5] p-1 scale-95">
                          <button
                            onClick={() => handleUpdateCartQuantity(c.item.id, -1)}
                            className="p-1 px-1.5 text-[#9A9180] hover:text-[#7B2D3A]"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-semibold text-[#4A4438] w-5 text-center">
                            {c.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateCartQuantity(c.item.id, 1)}
                            className="p-1 px-1.5 text-[#9A9180] hover:text-[#7B2D3A]"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#EBE7DF] pt-6 flex flex-col space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#4A4438] font-semibold uppercase tracking-wider">Subtotal:</span>
                      <span className="font-serif font-bold text-2xl text-[#7B2D3A]">
                        R$ {cartTotal.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        alert("Seu pedido imperial de banquete foi enviado com sucesso à cozinha do Palácio Yuan!");
                        setCart([]);
                        setActiveTab("home");
                      }}
                      className="w-full py-4 bg-[#7B2D3A] text-white hover:bg-[#6A2533] text-xs font-semibold tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} /> Enviar Pedido Imperial
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: PERFIL & RESERVAS & HERANÇA COMBO */}
          {activeTab === "perfil" && (
            <motion.div
              key="perfilTab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* User overview and Log out card */}
              <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] bg-[#C8A84B]/10 text-[#C8A84B] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Perfil Autêntico
                  </span>
                  <h3 className="font-serif text-2xl text-[#4A4438]">{session.fullName}</h3>
                  <p className="text-xs text-[#9A9180]">
                    Email: {session.email} {session.phone ? `· Celular: ${session.phone}` : ""}
                  </p>
                </div>

                <button
                  onClick={onLogout}
                  className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-[#B94040] border border-red-200 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <LogOut size={14} /> Sair da Conta
                </button>
              </div>

              {/* Booking reservation section inside Profile */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Book Table Form code */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#EBE7DF]">
                  <h3 className="font-serif text-xl text-[#4A4438] mb-1">
                    Fazer uma Reserva Ceremoniosa
                  </h3>
                  <div className="h-[1px] bg-[#EBE7DF] w-24 mb-4" />

                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Date */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#4A4438] uppercase tracking-wider">Data da Visita</label>
                        <input
                          type="date"
                          className="p-3 bg-white border border-[#EBE7DF] rounded-xl text-xs outline-none focus:border-[#7A9E82]"
                          value={resDate}
                          onChange={(e) => setResDate(e.target.value)}
                          required
                        />
                      </div>

                      {/* Time */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#4A4438] uppercase tracking-wider">Horário do Banquete</label>
                        <select
                          className="p-3 bg-white border border-[#EBE7DF] rounded-xl text-xs outline-none focus:border-[#7A9E82]"
                          value={resTime}
                          onChange={(e) => setResTime(e.target.value)}
                        >
                          <option value="12:00">12:00 (Almoço Imperial)</option>
                          <option value="13:30">13:30 (Almoço Imperial)</option>
                          <option value="19:00">19:00 (Jantar Imperial)</option>
                          <option value="20:30">20:30 (Jantar Imperial)</option>
                          <option value="22:00">22:00 (Jantar Imperial)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Guests */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#4A4438] uppercase tracking-wider">Nº de Dignitários (Pessoas)</label>
                        <div className="flex items-center border border-[#EBE7DF] rounded-xl bg-white p-1">
                          <button
                            type="button"
                            onClick={() => setResGuests(Math.max(1, resGuests - 1))}
                            className="p-2 text-[#9A9180] hover:text-[#7B2D3A] transition-all"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="flex-1 text-center text-xs font-medium text-[#4A4438]">
                            {resGuests} {resGuests === 1 ? "Pessoa" : "Pessoas"}
                          </span>
                          <button
                            type="button"
                            onClick={() => setResGuests(Math.min(12, resGuests + 1))}
                            className="p-2 text-[#9A9180] hover:text-[#7B2D3A] transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Saloon select */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#4A4438] uppercase tracking-wider">Salão Imperial</label>
                        <select
                          className="p-3 bg-white border border-[#EBE7DF] rounded-xl text-xs outline-none focus:border-[#7A9E82]"
                          value={resSaloon}
                          onChange={(e) => setResSaloon(e.target.value)}
                        >
                          {SALOONS.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.capacity})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Saloon info Description */}
                    <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EBE7DF] text-xs">
                      <p className="font-semibold text-[#7B2D3A] mb-1">
                        {SALOONS.find(s => s.id === resSaloon)?.name}
                      </p>
                      <p className="text-xs text-[#9A9180] font-light leading-relaxed">
                        {SALOONS.find(s => s.id === resSaloon)?.description}
                      </p>
                    </div>

                    {/* Notes protocol / allergies */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#4A4438] uppercase tracking-wider">Notas de Protocolo / Alergias</label>
                      <textarea
                        placeholder="Ex: Necessidade de mesa adaptada, comemoração de aniversário, etc."
                        className="p-3 bg-white border border-[#EBE7DF] rounded-xl text-xs h-20 outline-none focus:border-[#7A9E82] resize-none"
                        value={resNotes}
                        onChange={(e) => setResNotes(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="w-[102%] py-3.5 bg-[#7A9E82] text-white hover:bg-[#6D8F75] text-xs font-semibold tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm">
                      <Calendar size={14} /> Agendar Mesa Imperial
                    </button>
                  </form>
                </div>

                {/* Reservations List */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  {/* Success banner */}
                  {showResSuccess && latestRes && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#7A9E82]/10 border border-[#7A9E82] p-5 rounded-2xl flex items-start gap-3 relative"
                    >
                      <span className="text-xl text-[#7A9E82]">✨</span>
                      <div className="flex-1">
                        <h4 className="text-xs font-semibold text-[#4A4438] uppercase tracking-wider mb-1">
                          Reserva Confirmada!
                        </h4>
                        <p className="text-xs text-[#9A9180] leading-relaxed font-light mb-2">
                          Seu lugar real no <strong className="text-[#4A4438] font-medium">{latestRes.saloon}</strong> foi providenciado para {latestRes.date} às {latestRes.time} para {latestRes.guests} pessoas.
                        </p>
                        <button
                          onClick={() => setShowResSuccess(false)}
                          className="text-[10px] text-[#7A9E82] font-semibold hover:underline"
                        >
                          Entendi
                        </button>
                      </div>
                      <button
                        onClick={() => setShowResSuccess(false)}
                        className="absolute top-3 right-3 text-[#9A9180] hover:text-[#4A4438]"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  )}

                  {/* My Reservations list panel */}
                  <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] flex-1">
                    <h3 className="font-serif text-lg text-[#4A4438] mb-4">
                      Minhas Reservas Ativas ({myReservations.length})
                    </h3>

                    {myReservations.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 mt-4">
                        <p className="text-3xl text-[#9A9180] mb-2 select-none">🏮</p>
                        <p className="text-xs text-[#9A9180] font-light leading-relaxed">
                          Nenhuma mesa reservada no seu nome no momento. Use o formulário para garantir sua presença.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto">
                        {myReservations.map(res => (
                          <div
                            key={res.id}
                            className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EBE7DF] flex justify-between items-start"
                          >
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="px-1.5 py-0.5 bg-[#7A9E82] text-white font-mono text-[9px] uppercase tracking-widest rounded font-medium">
                                  CONFIRMADO
                                </span>
                                <span className="font-mono text-[9px] text-[#9A9180]">ID: {res.id}</span>
                              </div>
                              <h4 className="font-serif font-semibold text-sm text-[#4A4438] mb-1">
                                {res.saloon}
                              </h4>
                              <p className="text-[11px] text-[#9A9180] font-light mb-0.5 flex items-center gap-1">
                                <Calendar size={10} /> Data: {res.date} às {res.time}
                              </p>
                              <p className="text-[11px] text-[#9A9180] font-light flex items-center gap-1">
                                <Users size={10} /> {res.guests} Dignitários
                              </p>
                            </div>

                            <button
                              onClick={() => handleCancelBooking(res.id)}
                              className="p-2 text-[#9A9180] hover:text-[#B94040] hover:bg-black/5 rounded-md transition-all text-xs flex items-center gap-1"
                              title="Cancelar reserva"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Historical context and Reviews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] flex flex-col justify-between">
                  <div>
                    <span className="text-[#C8A84B] text-xl select-none block mb-2">👑</span>
                    <h3 className="font-serif text-xl text-[#4A4438] mb-3">A Herança Tradicional Yuan</h3>
                    <p className="text-xs text-[#9A9180] font-light leading-relaxed mb-4">
                      O <strong className="text-[#4A4438] font-medium">Yuan</strong> traz uma fusão de refinamento clássico e ingredientes luxuosos da herança tradicional asiática da corte chinesa.
                    </p>
                    <p className="text-xs text-[#9A9180] font-light leading-relaxed">
                      Nossos caldos fervem de forma contínua, as técnicas wok utilizam as labaredas ideais, e cada guioza é minuciosamente dobrado de forma artesanal.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-[#EBE7DF] pt-4 mt-4 text-center">
                    <div>
                      <p className="font-serif font-bold text-xs text-[#7B2D3A]">誠 信</p>
                      <p className="text-[9px] text-[#9A9180] uppercase tracking-wide">Confiança</p>
                    </div>
                    <div>
                      <p className="font-serif font-bold text-xs text-[#7B2D3A]">尊 貴</p>
                      <p className="text-[9px] text-[#9A9180] uppercase tracking-wide">Nobreza</p>
                    </div>
                    <div>
                      <p className="font-serif font-bold text-xs text-[#7B2D3A]">傳 承</p>
                      <p className="text-[9px] text-[#9A9180] uppercase tracking-wide">Tradição</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#EBE7DF] space-y-4">
                  <h4 className="font-serif text-lg text-[#4A4438]">Crítica e Opiniões Sábias</h4>
                  <div className="space-y-4">
                    {REVIEWS.map(rev => (
                      <div key={rev.id} className="border-l-2 border-[#C8A84B] pl-4">
                        <p className="text-xs text-[#9A9180] font-light italic leading-relaxed mb-1">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                        <p className="text-[10px] font-semibold text-[#4A4438]">
                          {rev.author} <span className="text-[#9A9180] font-light">({rev.role})</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 text-center select-none">
        <p className="text-xs text-[#9A9180] font-light">
          © {new Date().getFullYear()} Restaurante Yuan — Culinária Imperial S/A. Todos os direitos reservados.
        </p>
      </footer>

      {/* DISH DETAIL MODAL */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#4A4438]/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setSelectedDish(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white max-w-lg w-full rounded-2xl border border-[#EBE7DF] overflow-hidden shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Image banner mock box */}
              <div className="h-52 bg-[#7B2D3A] text-white p-6 relative flex flex-col justify-end">
                <button
                  onClick={() => setSelectedDish(null)}
                  className="absolute top-4 right-4 p-2 bg-white/15 hover:bg-white/30 rounded-full text-white transition-all"
                  id="btnCloseDishModal"
                >
                  <X size={16} />
                </button>

                <p className="text-white/60 text-[10px] font-semibold tracking-wider uppercase mb-1">
                  Especialidade {selectedDish.category}
                </p>
                <h3 className="font-serif font-medium text-2xl text-[#FFFFFF]">
                  {selectedDish.name}
                </h3>
              </div>

              {/* Modal body content */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#EBE7DF]">
                  <div>
                    <span className="text-xs text-[#9A9180] font-light">Preço imperial:</span>
                    <p className="font-serif font-medium text-xl text-[#7B2D3A]">
                      R$ {selectedDish.price.toFixed(2)}
                    </p>
                  </div>

                  {selectedDish.spicyLevel > 0 && (
                    <div className="text-right">
                      <span className="text-[10px] text-[#9A9180] uppercase tracking-wide">Picância</span>
                      <p className="text-sm text-[#B94040]">🌶️{"🌶️".repeat(selectedDish.spicyLevel - 1)}</p>
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#9A9180] font-light leading-relaxed mb-6">
                  {selectedDish.description}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleAddToCart(selectedDish);
                      setSelectedDish(null);
                    }}
                    className="flex-1 py-3.5 bg-[#7B2D3A] text-white hover:bg-[#6A2533] text-xs font-semibold tracking-widest uppercase rounded-xl transition-all"
                  >
                    Adicionar ao Meu Pedido
                  </button>
                  <button
                    onClick={() => setSelectedDish(null)}
                    className="px-5 py-3.5 bg-[#FAF8F5] hover:bg-[#EAE5D7] border border-[#EBE7DF] text-[#4A4438] text-xs font-medium rounded-xl transition-all"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FIXED SIDE CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#4A4438]/40 backdrop-blur-xs z-50 flex justify-end"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-[#FDFAF5] border-l border-[#E4DFCF] w-full max-w-[380px] h-full flex flex-col justify-between shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#E4DFCF] flex justify-between items-center bg-[#F5F2EC]">
                <div className="flex items-center gap-1.5">
                  <ShoppingBag size={18} className="text-[#7B2D3A]" />
                  <h3 className="font-display font-medium text-lg text-[#4A4438]">Seu Pedido Imperial</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 -mr-2 text-[#9A9180] hover:text-[#4A4438] hover:bg-black/5 rounded-md transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer List contents */}
              <div className="flex-1 overflow-y-auto p-5">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <p className="text-4xl text-[#9A9180] mb-3 select-none">🍲</p>
                    <p className="text-xs text-[#9A9180] font-light leading-relaxed">
                      Seu pedido de banquete está vazio. Navegue pelo cardápio e adicione as ricas iguarias que preferir.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {cart.map(c => (
                      <div
                        key={c.item.id}
                        className="pb-4 border-b border-[#E4DFCF]/70 flex gap-3 items-start justify-between"
                      >
                        <div className="flex-1">
                          <h4 className="font-display font-semibold text-xs leading-tight text-[#4A4438]">
                            {c.item.name}
                          </h4>
                          <span className="text-[11px] text-[#7B2D3A] font-semibold">
                            R$ {(c.item.price * c.quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Quantity switcher */}
                        <div className="flex items-center gap-2 border border-[#E4DFCF] rounded-lg bg-[#F5F2EC] p-0.5">
                          <button
                            onClick={() => handleUpdateCartQuantity(c.item.id, -1)}
                            className="p-1 text-[#9A9180] hover:text-[#7B2D3A] transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-xs text-[#4A4438] font-medium w-4 text-center">
                            {c.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateCartQuantity(c.item.id, 1)}
                            className="p-1 text-[#9A9180] hover:text-[#7B2D3A] transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer summary and checkout buttons */}
              <div className="p-5 border-t border-[#E4DFCF] bg-[#F5F2EC]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-[#4A4438] font-semibold uppercase tracking-wider">Subtotal:</span>
                  <span className="font-display font-bold text-lg text-[#7B2D3A]">
                    R$ {cartTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (cart.length === 0) return;
                    alert("Seu pedido imperial de banquete foi enviado com sucesso à cozinha do Palácio Yuan!");
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                  disabled={cart.length === 0}
                  className="w-full py-4 bg-[#7B2D3A] text-white disabled:pointer-events-none hover:bg-[#6A2533] text-xs font-semibold tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                  id="btnSubmitCartOrder"
                >
                  <CheckCircle2 size={14} /> Enviar Pedido Imperial
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
