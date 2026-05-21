const CONTACT_EMAIL = "contact@astroqodelabs.com";

const REPLIES = {
  en: {
    services:
      "ASTROQODELABS builds websites, web apps, SaaS platforms, e-commerce stores, dashboards, automation, AI chatbots, integrations, and cloud-ready software. What are you trying to create?",
    website:
      "Yes. ASTROQODELABS can build business websites, landing pages, portfolios, WordPress sites, and custom websites focused on mobile UX, speed, and lead generation. What kind of website do you need?",
    explainWebsite:
      "A website is your online place where visitors understand your offer, trust you, and take action. Should people contact you, book, buy, or learn?",
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
    ideaPlan:
      "No problem. We can turn the idea into a plan by choosing the audience, goal, must-have pages, and main action. What is the idea in one sentence?",
    fullWebsite:
      "A full website usually includes home, offer, about, trust proof, and contact pages. What business, product, or service should it present?",
    landingPage:
      "A landing page is one focused page for one offer. It explains the product, benefits, proof, and next action. What are you launching?",
    productLaunch:
      "For a product launch, start with a focused landing page: product, audience, benefits, visuals, and contact or preorder action. What product is it?",
    productDevice:
      "That sounds like a strong product landing page. For a mechanical device, show the problem, use cases, photos/video, benefits, and request-quote action. Who should buy it?",
  },
  fr: {
    services:
      "ASTROQODELABS cree des sites web, applications web, SaaS, boutiques e-commerce, dashboards, automatisations, chatbots IA, integrations et logiciels cloud-ready. Que voulez-vous creer ?",
    website:
      "Oui. ASTROQODELABS peut creer des sites vitrine, landing pages, portfolios, sites WordPress et sites sur mesure axes mobile, performance et generation de leads. Quel type de site voulez-vous ?",
    explainWebsite:
      "Un site web est votre espace en ligne pour expliquer l'offre, rassurer les visiteurs et les faire agir. Ils doivent vous contacter, reserver, acheter ou decouvrir ?",
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
    ideaPlan:
      "Pas de souci. On peut transformer l'idee en plan avec audience, objectif, pages essentielles et action principale. Quelle est l'idee en une phrase ?",
    fullWebsite:
      "Un site complet contient souvent accueil, offre, a propos, preuves de confiance et contact. Quelle activite, produit ou service doit-il presenter ?",
    landingPage:
      "Une landing page est une page focalisee sur une offre. Elle explique le produit, les benefices, les preuves et l'action suivante. Que lancez-vous ?",
    productLaunch:
      "Pour un lancement produit, commencez par une landing page: produit, audience, benefices, visuels et contact ou precommande. Quel est le produit ?",
    productDevice:
      "Cela ressemble a une bonne landing page produit. Pour un appareil mecanique, montrez probleme, usages, visuels, benefices et demande de devis. Qui doit l'acheter ?",
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
    key: "explainWebsite",
    patterns: [
      /\b(what (is|are) websites?|what (is|are) a websites?|what website are|what is a site|dont know what websites? are|don't know what websites? are)\b/i,
      /\b(c'est quoi un site|un site web c'est quoi|je ne sais pas ce qu'est un site)\b/i,
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
    patterns: [/\b(website|site web|portfolio|wordpress)\b/i, /\b(site vitrine|page de vente)\b/i],
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

const CONTEXTUAL_MATCHERS = [
  {
    key: "ideaPlan",
    patterns: [
      /\b(only have an idea|need a clear plan|clear plan|turn.*idea.*plan)\b/i,
      /\b(juste une idee|idee.*plan clair|plan clair)\b/i,
    ],
  },
  {
    key: "fullWebsite",
    patterns: [
      /\b(full website|complete website|whole website|entire website)\b/i,
      /\b(site complet|site entier)\b/i,
    ],
  },
  {
    key: "explainWebsite",
    patterns: [
      /\b(i dont know u tell me|i don't know you tell me|you tell me|i dont know what website|i don't know what website)\b/i,
      /\b(je ne sais pas|dis moi|dites moi)\b/i,
    ],
  },
  {
    key: "landingPage",
    patterns: [/\b(landing pages?|landing)\b/i, /\b(landing page|page de vente)\b/i],
  },
  {
    key: "productLaunch",
    patterns: [
      /\b(product launch|product lauch|launch a product|new product)\b/i,
      /\b(lancement produit|lancer un produit|nouveau produit)\b/i,
    ],
  },
  {
    key: "productDevice",
    patterns: [
      /\b(mechanical device|mecanical device|device for builders|tool for builders|construction device|builders)\b/i,
      /\b(appareil mecanique|outil pour constructeurs|outil pour batiment|batiment)\b/i,
    ],
  },
];

const INTERNAL_LEAK_PATTERNS = [
  /widget behavior/i,
  /boundaries:/i,
  /compact company brief/i,
  /company knowledge/i,
  /system prompt/i,
];

export function getFastReply({ messages, language = "en" }) {
  const cleanMessages = Array.isArray(messages) ? messages : [];
  const latestUserMessage = [...cleanMessages].reverse().find((message) => message?.role === "user")?.content || "";
  const normalizedLanguage = language === "fr" ? "fr" : "en";

  if (!latestUserMessage || latestUserMessage.length > 320) {
    return "";
  }

  const normalizedMessage = latestUserMessage.trim();
  const conversationText = cleanMessages.map((message) => message?.content || "").join("\n").slice(-1400);

  for (const matcher of CONTEXTUAL_MATCHERS) {
    if (matcher.patterns.some((pattern) => pattern.test(normalizedMessage))) {
      return REPLIES[normalizedLanguage][matcher.key];
    }
  }

  if (
    /\b(product|device|builder|mechanical|mecanical|produit|appareil|batiment)\b/i.test(normalizedMessage) &&
    /\b(landing|launch|lancement|page)\b/i.test(conversationText)
  ) {
    return REPLIES[normalizedLanguage].productDevice;
  }

  for (const matcher of MATCHERS) {
    if (matcher.patterns.some((pattern) => pattern.test(normalizedMessage))) {
      return REPLIES[normalizedLanguage][matcher.key];
    }
  }

  return "";
}

export function getSafeFallbackReply(language = "en") {
  return language === "fr"
    ? "Je peux vous guider simplement. Dites-moi ce que vous vendez, qui doit l'utiliser, et l'action principale attendue."
    : "I can guide this simply. Tell me what you offer, who it is for, and the main action visitors should take.";
}

export function looksLikeInternalLeak(reply) {
  return typeof reply === "string" && INTERNAL_LEAK_PATTERNS.some((pattern) => pattern.test(reply));
}
