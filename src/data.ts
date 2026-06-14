/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem } from "./types";

export const CUSTOM_MENU_ITEMS: MenuItem[] = [
  {
    id: "pato-pequim",
    name: "Pato de Pequim Imperial (北京烤鸭)",
    description: "Pato marinado com especiarias secretas da corte, assado lentamente até a pele ficar dourada e crocante. Servido com panquecas finas, pepino, cebolinha e molho de ameixa artesanal.",
    price: 185.0,
    category: "principais",
    imagePrompt: "Crispy Peking Duck served with thin pancakes and scallions on a dark ceramic plate, elegant styling",
    spicyLevel: 0,
    isImperialSpecialty: true
  },
  {
    id: "guioza-ouro",
    name: "Guioza de Ouro Dinastia Yuan (金饺)",
    description: "Massa fina cozida no vapor com recheio suculento de lombo suíno, gengibre e acelga chinesa, finalizada com toques sutis de raspas douradas e azeite de gergelim trufado.",
    price: 48.0,
    category: "entradas",
    imagePrompt: "Delicate steamed Chinese dumplings, gold leaf garnish, in a bamboo steamer, fine dining presentation",
    spicyLevel: 1,
    isImperialSpecialty: true
  },
  {
    id: "camarao-jade",
    name: "Camarões de Jade ao Curry Imperial",
    description: "Camarões gigantes flambados em wok com legumes sazonais ao molho de curry verde aromático e leite de coco fresco, salpicado com castanhas tostadas.",
    price: 112.0,
    category: "principais",
    imagePrompt: "Sautéed tiger prawns in green curry glaze with snap peas, elegant plating on royal jade green dish",
    spicyLevel: 2,
    isImperialSpecialty: false
  },
  {
    id: "bao-imperador",
    name: "Bao do Imperador (帝王包)",
    description: "Pão oriental cozido no vapor, incrivelmente macio, recheado com pancetta laqueada, picles de cebola roxa, coentro fresquíssimo e molho hoisin levemente picante.",
    price: 36.0,
    category: "entradas",
    imagePrompt: "Steamed fluffy bao buns stuffed with slow-cooked glazed pork belly and herbs, dramatic close-up",
    spicyLevel: 1,
    isImperialSpecialty: false
  },
  {
    id: "sopa-wok-dragao",
    name: "Lámen Szechuan Sopro do Dragão",
    description: "Caldinho robusto cozido por 12 horas, noodles artesanais, fatias finas de filet mignon bovino, cogumelo shitake, ovo ajitama e óleo de chili sichuano.",
    price: 78.0,
    category: "principais",
    imagePrompt: "Spicy Szechuan noodle soup with beef and shiitake mushrooms, chili oil droplets on top, deep rich broth",
    spicyLevel: 3,
    isImperialSpecialty: false
  },
  {
    id: "creme-manga-lotus",
    name: "Sopa Doce de Lótus e Coco",
    description: "Sopa gelada de manga maturada com tapioca de sagu, leite de coco aerado e sementes de lótus cristalizadas.",
    price: 32.0,
    category: "sobremesas",
    imagePrompt: "Mango sago pomelo dessert with coconut milk in a crystalline glass bowl, garnished with edible flowers",
    spicyLevel: 0,
    isImperialSpecialty: false
  },
  {
    id: "pudim-cha-verde",
    name: "Flan de Matchá com Calda de Gengibre",
    description: "Pudim cremoso de chá verde matcha de altíssima pureza, coberto por calda brilhante de gengibre caramelizado e sementes de gergelim preto.",
    price: 29.0,
    category: "sobremesas",
    imagePrompt: "Elegant green matcha flan dessert on a minimalist plate with sweet ginger syrup",
    spicyLevel: 0,
    isImperialSpecialty: true
  },
  {
    id: "cha-jasmim",
    name: "Infusão Imperatriz Jasmim Solene",
    description: "O mais requintado chá verde perfumado com flores de jasmim recém-colhidas. Servido em jogo de porcelana tradicional no ritual das dinastias chinesas.",
    price: 24.0,
    category: "bebidas",
    imagePrompt: "Steaming traditional Chinese jasmine tea service in green ceramic cups, tea smoke rising",
    spicyLevel: 0,
    isImperialSpecialty: true
  },
  {
    id: "drinque-yin-yang",
    name: "Coquetel Yin & Yang Aromático",
    description: "Sake importado, licor de lichia imperial, néctar de limão siciliano extraído a frio, finalizado com carvão ativado e uma flor comestível símbolo da dualidade.",
    price: 38.0,
    category: "bebidas",
    imagePrompt: "Contrast dual cocktail in a modern glass with litchi fruit and charcoal pattern",
    spicyLevel: 0,
    isImperialSpecialty: false
  }
];

export const SALOONS = [
  {
    id: "salao-dragao",
    name: "Salão do Dragão Imperial (龙厅)",
    description: "Espaço majestoso decorado com entalhes de madeira vermelha e detalhes em ouro. Ideal para banquetes e momentos luxuosos.",
    capacity: "De 2 a 12 pessoas"
  },
  {
    id: "salao-lotus",
    name: "Pavilhão de Lótus Sereno (莲亭)",
    description: "Um refúgio tranquilo sobre espelho d'água interior, repleto de flores de lótus flutuantes e luz suave.",
    capacity: "De 2 a 6 pessoas"
  },
  {
    id: "jardim-bambu",
    name: "Jardim Imperial Suspenso (竹园)",
    description: "Experiência ao ar livre cercada por bambuzais verdejantes e lanternas de seda sob as estrelas.",
    capacity: "De 1 a 8 pessoas"
  }
];

export const REVIEWS = [
  {
    id: "rev-1",
    author: "Mestre Shen",
    role: "Crítico de Gastronomia Asiática",
    rating: 5,
    comment: "O Pato de Pequim do Yuan honra as melhores tradições da capital chinesa. A crocância da pele combinada à textura delicada das panquecas é impecável."
  },
  {
    id: "rev-2",
    author: "Beatriz M. de Albuquerque",
    role: "Cliente Premium",
    rating: 5,
    comment: "Uma viagem gastronômica esplêndida! O atendimento é cerimonioso, os pratos contam uma história e a decoração é sutilmente sofisticada."
  }
];
