const GUIDE_STEPS = {
  en: {
    "project-type": {
      title: "What result do you want?",
      choices: [
        {
          id: "website",
          label: "Get clients",
          prompt: "I want to attract more clients and present my business clearly online.",
          nextStage: "website-goal",
          leadPatch: { projectType: "Website" },
        },
        {
          id: "ecommerce",
          label: "Sell online",
          prompt: "I want to sell products or digital offers online and need help planning the store.",
          nextStage: "ecommerce-needs",
          leadPatch: { projectType: "E-commerce" },
        },
        {
          id: "web-app",
          label: "Automate work",
          prompt: "I want a web app that automates work, manages data, or improves an internal process.",
          nextStage: "webapp-features",
          leadPatch: { projectType: "Web app" },
        },
        {
          id: "saas",
          label: "Launch SaaS",
          prompt: "I want to launch a SaaS or MVP with accounts, dashboards, and subscriptions.",
          nextStage: "webapp-features",
          leadPatch: { projectType: "SaaS / MVP" },
        },
        {
          id: "improve",
          label: "Fix a project",
          prompt: "I already have a website or app and want to improve, fix, or modernize it.",
          nextStage: "improve-focus",
          leadPatch: { projectType: "Project improvement" },
        },
        {
          id: "not-sure",
          label: "Guide me",
          prompt: "I have an idea, but I am not sure what solution I need.",
          nextStage: "discovery",
          leadPatch: { projectType: "Not sure" },
        },
      ],
    },
    "website-goal": {
      title: "What should the website do?",
      choices: [
        {
          id: "business-website",
          label: "Present business",
          prompt: "The website should present my business clearly and bring more clients.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Present the business and bring more clients" },
        },
        {
          id: "portfolio",
          label: "Portfolio",
          prompt: "The website should show my work, projects, or services in a polished portfolio.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Show work and services in a portfolio" },
        },
        {
          id: "booking",
          label: "Booking",
          prompt: "The website should let clients book or request appointments.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Let clients book or request appointments" },
        },
        {
          id: "landing-page",
          label: "Landing page",
          prompt: "I need a landing page focused on one offer or campaign.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Create a focused landing page" },
        },
      ],
    },
    "webapp-features": {
      title: "Which feature matters most?",
      choices: [
        {
          id: "login-dashboard",
          label: "Login + dashboard",
          prompt: "The web app needs user login and a dashboard.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Build login and dashboard features" },
        },
        {
          id: "admin-panel",
          label: "Admin panel",
          prompt: "The web app needs an admin panel to manage data and users.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Build an admin panel" },
        },
        {
          id: "automation",
          label: "Automation",
          prompt: "The web app should automate a workflow or internal process.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Automate a workflow" },
        },
        {
          id: "saas",
          label: "SaaS",
          prompt: "I want to build a SaaS platform with accounts, roles, and subscriptions.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Build a SaaS platform" },
        },
      ],
    },
    "ecommerce-needs": {
      title: "What does the store need?",
      choices: [
        {
          id: "payments",
          label: "Payments",
          prompt: "The store needs online checkout and payment integration.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Add online checkout and payments" },
        },
        {
          id: "product-catalog",
          label: "Product catalog",
          prompt: "The store needs a clean product catalog and product management.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Build a product catalog and management flow" },
        },
        {
          id: "shopify-woocommerce",
          label: "Shopify/Woo",
          prompt: "I need help choosing between Shopify, WooCommerce, or a custom store.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Choose the right e-commerce platform" },
        },
        {
          id: "paid-access",
          label: "Paid access",
          prompt: "I want to sell digital products, paid access, or subscriptions.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Sell digital products or paid access" },
        },
      ],
    },
    "improve-focus": {
      title: "What needs improvement?",
      choices: [
        {
          id: "design",
          label: "Design",
          prompt: "I want to improve the design and user experience of my existing project.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Improve design and user experience" },
        },
        {
          id: "speed",
          label: "Speed",
          prompt: "I want to improve performance, loading speed, and technical quality.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Improve performance and technical quality" },
        },
        {
          id: "security",
          label: "Security",
          prompt: "I want to improve security, authentication, or protected areas.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Improve security and authentication" },
        },
        {
          id: "new-features",
          label: "New features",
          prompt: "I want to add new features to an existing website or app.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Add new features" },
        },
      ],
    },
    discovery: {
      title: "What stage are you at?",
      choices: [
        {
          id: "just-idea",
          label: "Just an idea",
          prompt: "I only have an idea and need help turning it into a clear plan.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Turn an idea into a clear plan" },
        },
        {
          id: "have-content",
          label: "Have content",
          prompt: "I already have content or examples and need help choosing the best solution.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Choose the best solution from existing content" },
        },
        {
          id: "need-advice",
          label: "Need advice",
          prompt: "I need advice on what to build first and what matters most.",
          nextStage: "timeline",
          leadPatch: { projectGoal: "Get advice on what to build first" },
        },
      ],
    },
    timeline: {
      title: "When do you want to start?",
      choices: [
        {
          id: "asap",
          label: "ASAP",
          prompt: "I would like to start as soon as possible.",
          nextStage: "budget",
          leadPatch: { timeline: "ASAP" },
        },
        {
          id: "this-month",
          label: "This month",
          prompt: "I would like to start this month.",
          nextStage: "budget",
          leadPatch: { timeline: "This month" },
        },
        {
          id: "planning",
          label: "Planning",
          prompt: "I am still planning and want to understand the best direction first.",
          nextStage: "budget",
          leadPatch: { timeline: "Planning" },
        },
      ],
    },
    budget: {
      title: "Do you have a budget range?",
      choices: [
        {
          id: "small",
          label: "Small MVP",
          prompt: "I am thinking about a small MVP or first version budget.",
          nextStage: "handoff",
          leadPatch: { budgetRange: "Small MVP" },
        },
        {
          id: "growth",
          label: "Growth build",
          prompt: "I have a growth budget for a serious business-ready build.",
          nextStage: "handoff",
          leadPatch: { budgetRange: "Growth build" },
        },
        {
          id: "not-set",
          label: "Not set",
          prompt: "I do not have a budget yet and need help understanding what affects cost.",
          nextStage: "handoff",
          leadPatch: { budgetRange: "Not set" },
        },
      ],
    },
    handoff: {
      title: "Ready for the team?",
      choices: [
        {
          id: "save-brief",
          label: "Save brief",
          prompt: "I am ready to save a short project brief for the ASTROQODELABS team.",
          nextStage: "handoff",
          leadPatch: {},
          intent: "save",
        },
        {
          id: "ask-more",
          label: "Ask more",
          prompt: "I want to ask a few more questions before saving the brief.",
          nextStage: "handoff",
          leadPatch: {},
        },
      ],
    },
  },
  fr: {
    "project-type": {
      title: "Quel resultat voulez-vous ?",
      choices: [
        {
          id: "website",
          label: "Trouver clients",
          prompt: "Je veux attirer plus de clients et presenter clairement mon activite en ligne.",
          nextStage: "website-goal",
          leadPatch: { projectType: "Site web" },
        },
        {
          id: "ecommerce",
          label: "Vendre en ligne",
          prompt: "Je veux vendre des produits ou offres digitales en ligne et planifier la boutique.",
          nextStage: "ecommerce-needs",
          leadPatch: { projectType: "E-commerce" },
        },
        {
          id: "web-app",
          label: "Automatiser",
          prompt: "Je veux une application web qui automatise un travail, gere des donnees ou ameliore un processus interne.",
          nextStage: "webapp-features",
          leadPatch: { projectType: "Application web" },
        },
        {
          id: "saas",
          label: "Lancer SaaS",
          prompt: "Je veux lancer un SaaS ou MVP avec comptes, dashboards et abonnements.",
          nextStage: "webapp-features",
          leadPatch: { projectType: "SaaS / MVP" },
        },
        {
          id: "improve",
          label: "Corriger projet",
          prompt: "J'ai deja un site ou une app et je veux l'ameliorer, le corriger ou le moderniser.",
          nextStage: "improve-focus",
          leadPatch: { projectType: "Amelioration de projet" },
        },
        {
          id: "not-sure",
          label: "Me guider",
          prompt: "J'ai une idee, mais je ne sais pas encore quelle solution il me faut.",
          nextStage: "discovery",
          leadPatch: { projectType: "Pas sur" },
        },
      ],
    },
  },
};

const FRENCH_OVERRIDES = {
  "website-goal": {
    title: "Quel est le but du site ?",
    labels: ["Presenter l'activite", "Portfolio", "Reservation", "Landing page"],
  },
  "webapp-features": {
    title: "Quelle fonction est prioritaire ?",
    labels: ["Connexion + dashboard", "Admin panel", "Automatisation", "SaaS"],
  },
  "ecommerce-needs": {
    title: "De quoi la boutique a besoin ?",
    labels: ["Paiements", "Catalogue", "Shopify/Woo", "Acces payant"],
  },
  "improve-focus": {
    title: "Que faut-il ameliorer ?",
    labels: ["Design", "Vitesse", "Securite", "Nouvelles fonctions"],
  },
  discovery: {
    title: "Ou en est le projet ?",
    labels: ["Juste une idee", "Contenu pret", "Besoin de conseil"],
  },
  timeline: {
    title: "Quand voulez-vous commencer ?",
    labels: ["Des que possible", "Ce mois-ci", "Planification"],
  },
  budget: {
    title: "Avez-vous un budget ?",
    labels: ["Petit MVP", "Build serieux", "Pas encore"],
  },
  handoff: {
    title: "Pret pour l'equipe ?",
    labels: ["Enregistrer", "Demander plus"],
  },
};

function cloneStep(step) {
  return {
    ...step,
    choices: step.choices.map((choice) => ({
      ...choice,
      leadPatch: { ...(choice.leadPatch || {}) },
    })),
  };
}

function translateFallbackStep(stage) {
  const baseStep = cloneStep(GUIDE_STEPS.en[stage] || GUIDE_STEPS.en["project-type"]);
  const override = FRENCH_OVERRIDES[stage];

  if (!override) {
    return baseStep;
  }

  return {
    ...baseStep,
    title: override.title,
    choices: baseStep.choices.map((choice, index) => ({
      ...choice,
      label: override.labels[index] || choice.label,
    })),
  };
}

export function getGuideStep(language = "en", stage = "project-type") {
  if (language === "fr") {
    return GUIDE_STEPS.fr[stage] ? cloneStep(GUIDE_STEPS.fr[stage]) : translateFallbackStep(stage);
  }

  return cloneStep(GUIDE_STEPS.en[stage] || GUIDE_STEPS.en["project-type"]);
}

export function selectGuideChoice(currentStage, choice) {
  return {
    currentStage,
    nextStage: choice?.nextStage || currentStage || "project-type",
    prompt: choice?.prompt || "",
    leadPatch: { ...(choice?.leadPatch || {}) },
    intent: choice?.intent || "message",
  };
}
