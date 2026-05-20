const CONTACT_EMAIL = "contact@astroqodelabs.com";

const REPLIES = {
  en: {
    services:
      "ASTROQODELABS builds websites, web apps, SaaS platforms, e-commerce stores, dashboards, automation, AI chatbots, integrations, and cloud-ready software. What are you trying to create?",
    website:
      "Yes. ASTROQODELABS can build business websites, landing pages, portfolios, WordPress sites, and custom websites focused on mobile UX, speed, and lead generation. What kind of website do you need?",
    webApp:
      "Yes. ASTROQODELABS builds custom web apps with dashboards, accounts, admin panels, databases, APIs, and integrations. What should the app help your business do?",
    ecommerce:
      "Yes. ASTROQODELABS can build online stores with catalogs, checkout, payments, subscriptions, WooCommerce, Shopify, or custom e-commerce systems. What do you want to sell?",
    ai:
      "Yes. ASTROQODELABS can build AI chatbots, lead qualification flows, automation, RAG knowledge bases, and local or cloud LLM integrations. What task should AI help with?",
    price:
      "Pricing depends on scope, features, design, integrations, timeline, and support needs. I can collect a short project brief so the team can give you a realistic estimate. What are you planning to build?",
    timeline:
      "Timeline depends on complexity, content readiness, integrations, feedback speed, and launch needs. I can prepare a short brief for the team to review. When would you like to start?",
    contact:
      `You can contact ASTROQODELABS at ${CONTACT_EMAIL}. I can also collect your project details here so the team can follow up with better context.`,
    guide:
      "A good first step is to define the goal, users, must-have features, timeline, and planned investment range. What problem should this project solve first?",
  },
  fr: {
    services:
      "ASTROQODELABS cree des sites web, applications web, SaaS, boutiques e-commerce, dashboards, automatisations, chatbots IA, integrations et logiciels cloud-ready. Que voulez-vous creer ?",
    website:
      "Oui. ASTROQODELABS peut creer des sites vitrine, landing pages, portfolios, sites WordPress et sites sur mesure axes mobile, performance et generation de leads. Quel type de site voulez-vous ?",
    webApp:
      "Oui. ASTROQODELABS cree des applications web avec dashboards, comptes, panels admin, bases de donnees, APIs et integrations. Que doit faire l'application pour votre activite ?",
    ecommerce:
      "Oui. ASTROQODELABS peut creer des boutiques avec catalogue, paiement, abonnements, WooCommerce, Shopify ou e-commerce sur mesure. Que voulez-vous vendre ?",
    ai:
      "Oui. ASTROQODELABS peut creer des chatbots IA, automatisations, qualification de leads, bases RAG et integrations LLM locales ou cloud. Quelle tache voulez-vous automatiser ?",
    price:
      "Le prix depend du scope, des fonctionnalites, du design, des integrations, du timing et du support. Je peux preparer un court brief pour une estimation realiste. Que voulez-vous construire ?",
    timeline:
      "Le delai depend de la complexite, du contenu, des integrations, de la vitesse des retours et du lancement. Je peux preparer un brief pour l'equipe. Quand voulez-vous commencer ?",
    contact:
      `Vous pouvez contacter ASTROQODELABS a ${CONTACT_EMAIL}. Je peux aussi collecter les details du projet ici pour aider l'equipe a vous recontacter avec contexte.`,
    guide:
      "Le bon depart est de clarifier l'objectif, les utilisateurs, les fonctions essentielles, le delai et l'investissement prevu. Quel probleme voulez-vous resoudre d'abord ?",
  },
};

const MATCHERS = [
  {
    key: "price",
    patterns: [
      /\b(price|cost|quote|estimate|budget|pricing|how much)\b/i,
      /\b(prix|tarif|cout|co[uû]t|devis|budget|combien)\b/i,
    ],
  },
  {
    key: "timeline",
    patterns: [
      /\b(timeline|deadline|duration|how long|delivery|launch)\b/i,
      /\b(delai|d[eé]lai|combien de temps|livraison|lancement)\b/i,
    ],
  },
  {
    key: "contact",
    patterns: [/\b(contact|email|mail|phone|call)\b/i, /\b(contacter|telephone|t[eé]l[eé]phone|appel)\b/i],
  },
  {
    key: "ecommerce",
    patterns: [
      /\b(e-?commerce|online store|shop|checkout|payments?|sell online)\b/i,
      /\b(boutique|paiements?|vendre en ligne)\b/i,
    ],
  },
  {
    key: "ai",
    patterns: [/\b(ai|chatbot|automation|automate|agent|rag|llm)\b/i, /\b(ia|automatisation|automatiser)\b/i],
  },
  {
    key: "webApp",
    patterns: [/\b(web app|application|dashboard|portal|admin panel|saas|software)\b/i, /\b(application web|logiciel|tableau de bord|portail|saas)\b/i],
  },
  {
    key: "website",
    patterns: [/\b(website|site web|landing page|portfolio|wordpress)\b/i, /\b(site vitrine|page de vente)\b/i],
  },
  {
    key: "services",
    patterns: [
      /\b(what do you do|services|offer|can you do|help me with)\b/i,
      /\b(que faites-vous|services|offres|vous faites quoi|aidez-moi)\b/i,
    ],
  },
  {
    key: "guide",
    patterns: [
      /\b(idea|guide|direction|not sure|unsure|where to start|start first|first version|planning|mvp advice)\b/i,
      /\b(id[eé]e|guider|direction|pas s[uû]r|par quoi commencer|premiere version|premi[eè]re version|planifier)\b/i,
    ],
  },
];

export function getFastReply({ messages, language = "en" }) {
  const cleanMessages = Array.isArray(messages) ? messages : [];
  const latestUserMessage = [...cleanMessages].reverse().find((message) => message?.role === "user")?.content || "";
  const userMessageCount = cleanMessages.filter((message) => message?.role === "user").length;
  const normalizedLanguage = language === "fr" ? "fr" : "en";

  if (!latestUserMessage || latestUserMessage.length > 240) {
    return "";
  }

  const normalizedMessage = latestUserMessage.trim();

  for (const matcher of MATCHERS) {
    if (matcher.patterns.some((pattern) => pattern.test(normalizedMessage))) {
      return REPLIES[normalizedLanguage][matcher.key];
    }
  }

  if (userMessageCount <= 1 && normalizedMessage.length <= 420) {
    return REPLIES[normalizedLanguage].guide;
  }

  return "";
}
