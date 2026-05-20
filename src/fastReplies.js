const CONTACT_EMAIL = "contact@astroqodelabs.com";

const REPLIES = {
  en: {
    services:
      "ASTROQODELABS builds websites, web apps, SaaS platforms, e-commerce stores, dashboards, automation, AI chatbots, integrations, and cloud-ready software. What are you trying to create?",
    website:
      "Yes. ASTROQODELABS can build business websites, landing pages, portfolios, WordPress sites, and custom websites focused on mobile UX, speed, and lead generation. What kind of website do you need?",
    customTech:
      "Absolutely. ASTROQODELABS can build a custom robust stack instead of WordPress, with modern frontend, backend, database, APIs, and deployment. What should it do?",
    webApp:
      "Yes. ASTROQODELABS builds custom web apps with dashboards, accounts, admin panels, databases, APIs, and integrations. What should the app help your business do?",
    ecommerce:
      "Yes. ASTROQODELABS can build online stores with catalogs, checkout, subscriptions, Shopify, WooCommerce, or custom e-commerce systems. What do you want to sell?",
    ai:
      "Yes. ASTROQODELABS can build AI chatbots, lead qualification flows, automation, RAG knowledge bases, and local or cloud LLM integrations. What task should AI help with?",
    price:
      "Pricing depends on scope, features, design, integrations, timeline, and support. The team can estimate after reviewing a short project brief. What are you planning to build?",
    timeline:
      "Timeline depends on complexity, content readiness, integrations, feedback speed, and launch needs. The team should confirm after reviewing the scope. When would you like to start?",
    contact:
      `You can contact ASTROQODELABS at ${CONTACT_EMAIL}. I can help you shape a short project brief, but I cannot send messages or data for you.`,
    action:
      "I cannot send, submit, email, store, or change anything for you. I can only help with ASTROQODELABS services and your project brief.",
    offTopic:
      "I can only help with ASTROQODELABS services and your website, app, e-commerce, SaaS, automation, or software project. What are you trying to build?",
    guide:
      "A good first step is to define the goal, users, key features, timeline, and planned investment range. What problem should this project solve first?",
  },
  fr: {
    services:
      "ASTROQODELABS cree des sites web, applications web, SaaS, boutiques e-commerce, dashboards, automatisations, chatbots IA, integrations et logiciels cloud-ready. Que voulez-vous creer ?",
    website:
      "Oui. ASTROQODELABS peut creer des sites vitrine, landing pages, portfolios, sites WordPress et sites sur mesure axes mobile, performance et generation de leads. Quel type de site voulez-vous ?",
    customTech:
      "Oui. ASTROQODELABS peut creer une solution robuste sur mesure au lieu de WordPress, avec frontend, backend, base de donnees, APIs et deploiement. Que doit-elle faire ?",
    webApp:
      "Oui. ASTROQODELABS cree des applications web avec dashboards, comptes, panels admin, bases de donnees, APIs et integrations. Que doit faire l'application pour votre activite ?",
    ecommerce:
      "Oui. ASTROQODELABS peut creer des boutiques avec catalogue, checkout, abonnements, Shopify, WooCommerce ou e-commerce sur mesure. Que voulez-vous vendre ?",
    ai:
      "Oui. ASTROQODELABS peut creer des chatbots IA, automatisations, qualification de leads, bases RAG et integrations LLM locales ou cloud. Quelle tache voulez-vous automatiser ?",
    price:
      "Le prix depend du scope, des fonctionnalites, du design, des integrations, du timing et du support. L'equipe peut estimer apres un court brief. Que voulez-vous construire ?",
    timeline:
      "Le delai depend de la complexite, du contenu, des integrations, de la vitesse des retours et du lancement. L'equipe doit confirmer apres le scope. Quand voulez-vous commencer ?",
    contact:
      `Vous pouvez contacter ASTROQODELABS a ${CONTACT_EMAIL}. Je peux vous aider a structurer un brief, mais je ne peux pas envoyer de message ou de donnees pour vous.`,
    action:
      "Je ne peux pas envoyer, soumettre, stocker ou modifier quoi que ce soit pour vous. Je peux seulement aider avec les services ASTROQODELABS et votre brief projet.",
    offTopic:
      "Je peux seulement aider avec les services ASTROQODELABS et votre projet de site, app, e-commerce, SaaS, automatisation ou logiciel. Que voulez-vous creer ?",
    guide:
      "Le bon depart est de clarifier l'objectif, les utilisateurs, les fonctions essentielles, le delai et l'investissement prevu. Quel probleme voulez-vous resoudre d'abord ?",
  },
};

const MATCHERS = [
  {
    key: "action",
    patterns: [
      /\b(send|submit|forward|store|save|upload|post|publish|delete|change|update|create an account|buy|purchase)\b/i,
      /\b(envoie|envoyer|soumettre|mail|transmettre|stocker|sauvegarder|publier|supprimer|modifier|acheter)\b/i,
    ],
  },
  {
    key: "offTopic",
    patterns: [
      /\b(python script|scraping|instagram|homework|essay|recipe|weather|crypto|trading|legal advice|medical advice)\b/i,
      /\b(script python|scraper|devoir|recette|meteo|crypto|trading|juridique|medical)\b/i,
    ],
  },
  {
    key: "price",
    patterns: [
      /\b(price|cost|quote|estimate|budget|pricing|how much)\b/i,
      /\b(prix|tarif|cout|devis|budget|combien)\b/i,
    ],
  },
  {
    key: "timeline",
    patterns: [
      /\b(timeline|deadline|duration|how long|delivery|launch)\b/i,
      /\b(delai|combien de temps|livraison|lancement)\b/i,
    ],
  },
  {
    key: "contact",
    patterns: [/\b(contact|email|mail|phone|call)\b/i, /\b(contacter|telephone|appel)\b/i],
  },
  {
    key: "webApp",
    patterns: [
      /\b(web app|application|dashboard|portal|admin panel|saas|software|booking|reservation|appointments?|staff|roles?|workflow|platform)\b/i,
      /\b(application web|logiciel|tableau de bord|portail|saas|reservation|rendez-vous|workflow|plateforme)\b/i,
    ],
  },
  {
    key: "customTech",
    patterns: [
      /\b(no wordpress|not wordpress|without wordpress|dont want wordpress|don't want wordpress|do not want wordpress|robust tech|robuste tech|custom tech|custom stack|from scratch)\b/i,
      /\b(pas wordpress|sans wordpress|je ne veux pas wordpress|tech robuste|stack robuste|sur mesure)\b/i,
    ],
  },
  {
    key: "ecommerce",
    patterns: [
      /\b(e-?commerce|online store|shop|storefront|catalog|checkout|sell online|product catalog)\b/i,
      /\b(boutique|catalogue|vendre en ligne|produits)\b/i,
    ],
  },
  {
    key: "ai",
    patterns: [/\b(ai|chatbot|automation|automate|agent|rag|llm)\b/i, /\b(ia|automatisation|automatiser)\b/i],
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
      /\b(project idea|business idea|app idea|startup idea|guide|direction|not sure|unsure|where to start|start first|first version|planning|mvp advice)\b/i,
      /\b(idee de projet|idee d'app|guider|direction|pas sur|par quoi commencer|premiere version|planifier)\b/i,
    ],
  },
];

export function getFastReply({ messages, language = "en" }) {
  const cleanMessages = Array.isArray(messages) ? messages : [];
  const latestUserMessage = [...cleanMessages].reverse().find((message) => message?.role === "user")?.content || "";
  const normalizedLanguage = language === "fr" ? "fr" : "en";

  if (!latestUserMessage || latestUserMessage.length > 320) {
    return "";
  }

  const normalizedMessage = latestUserMessage.trim();

  for (const matcher of MATCHERS) {
    if (matcher.patterns.some((pattern) => pattern.test(normalizedMessage))) {
      return REPLIES[normalizedLanguage][matcher.key];
    }
  }

  return "";
}
