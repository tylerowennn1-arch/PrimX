export type Language = "EN" | "ES" | "FR";

const LANGUAGE_KEY = "px_language";

const dictionaries = {
  EN: {
    home: "Home",
    about: "About",
    tiers: "Account Tiers",
    faq: "FAQ",
    contact: "Contact",
    login: "Login",
    getStarted: "Get Started",
    heroEyebrow: "Cryptocurrency-powered investing · Global asset access",
    heroTitleStart: "Build wealth with",
    heroTitleAccent: "Cryptocurrency and global markets",
    heroText:
      "PrimXCapital is a premium digital asset platform offering managed investment plans, secure crypto funding and fast withdrawals for serious investors worldwide.",
    startInvesting: "Start Investing",
    clientLogin: "Sign In",
    bankSecurity: "Bank-grade security",
    encryptedVault: "Encrypted vault",
    howEyebrow: "Get Started",
    howTitle: "How it works",
    howSubtitle:
      "Open an account, fund with crypto, choose a plan, then track every request from your dashboard.",
    plansEyebrow: "Investment Plans",
    plansTitle: "Choose your investment plan",
    plansSubtitle:
      "Fixed-term plans with transparent profit targets — built for new clients through to high-net-worth portfolios.",
  },
  ES: {
    home: "Inicio",
    about: "Acerca de",
    tiers: "Planes",
    faq: "FAQ",
    contact: "Contacto",
    login: "Ingresar",
    getStarted: "Comenzar",
    heroEyebrow: "Inversión en Criptomonedas · Acceso global",
    heroTitleStart: "Crea patrimonio con",
    heroTitleAccent: "Criptomonedas y mercados globales",
    heroText:
      "PrimXCapital es una plataforma premium de activos digitales que ofrece planes de inversión gestionados, financiación segura en cripto y retiros rápidos para inversores serios en todo el mundo.",
    startInvesting: "Empezar a invertir",
    clientLogin: "Ingresar",
    bankSecurity: "Seguridad bancaria",
    encryptedVault: "Bóveda cifrada",
    howEyebrow: "Comenzar",
    howTitle: "Cómo funciona",
    howSubtitle:
      "Abre una cuenta, financia con cripto, elige un plan y sigue cada solicitud desde tu panel.",
    plansEyebrow: "Planes de inversión",
    plansTitle: "Elige tu plan de inversión",
    plansSubtitle:
      "Planes a plazo fijo con objetivos de beneficio transparentes para clientes nuevos y portafolios premium.",
  },
  FR: {
    home: "Accueil",
    about: "À propos",
    tiers: "Plans",
    faq: "FAQ",
    contact: "Contact",
    login: "Connexion",
    getStarted: "Commencer",
    heroEyebrow: "Investissement en Cryptomonnaies · Accès mondial",
    heroTitleStart: "Développez votre capital avec",
    heroTitleAccent: "Cryptomonnaies et marchés mondiaux",
    heroText:
      "PrimXCapital est une plateforme premium d'actifs numériques offrant des plans d'investissement gérés, un financement crypto sécurisé et des retraits rapides pour les investisseurs sérieux du monde entier.",
    startInvesting: "Investir maintenant",
    clientLogin: "Connexion",
    bankSecurity: "Sécurité bancaire",
    encryptedVault: "Coffre chiffré",
    howEyebrow: "Commencer",
    howTitle: "Comment ça marche",
    howSubtitle:
      "Ouvrez un compte, financez en crypto, choisissez un plan puis suivez chaque demande depuis votre tableau de bord.",
    plansEyebrow: "Plans d'investissement",
    plansTitle: "Choisissez votre plan",
    plansSubtitle:
      "Des plans à durée fixe avec objectifs de profit transparents pour clients débutants et portefeuilles premium.",
  },
} as const;

export function getLanguage(): Language {
  if (typeof window === "undefined") return "EN";
  const saved = localStorage.getItem(LANGUAGE_KEY) as Language | null;
  return saved === "ES" || saved === "FR" ? saved : "EN";
}

export function setLanguage(language: Language) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANGUAGE_KEY, language);
  window.dispatchEvent(new CustomEvent("px-language-change", { detail: language }));
}

export function subscribeLanguage(setter: (language: Language) => void) {
  if (typeof window === "undefined") return () => undefined;
  const handler = (event: Event) =>
    setter((event as CustomEvent<Language>).detail || getLanguage());
  window.addEventListener("px-language-change", handler);
  return () => window.removeEventListener("px-language-change", handler);
}

export function t(language: Language) {
  return dictionaries[language];
}
