const REQUIRED_FIELDS = [
  "serviceRequested",
  "projectGoal",
  "name",
  "companyName",
  "email",
  "phone",
  "location",
  "budgetRange",
  "timeline",
  "communicationMethod",
  "additionalNotes",
];

const FIELD_QUESTIONS = {
  en: {
    serviceRequested: "What do you want to build: website, landing page, web app, e-commerce, SaaS, automation, or something else?",
    projectGoal: "What should this project help your business achieve?",
    name: "What is your full name?",
    companyName: "What is your company or brand name? If none, say personal project.",
    email: "What email should the team use to contact you?",
    phone: "What phone number should the team use?",
    location: "Which country and city are you based in?",
    budgetRange: "Do you have a planned investment range?",
    timeline: "When do you want to start or launch?",
    communicationMethod: "How do you prefer to be contacted: email, phone, or WhatsApp?",
    additionalNotes: "Any extra notes, links, files, or requirements to add? If none, say none.",
    confirm: "Here is the brief: {summary} Should I save this as a confirmed brief for the team?",
  },
  fr: {
    serviceRequested: "Que voulez-vous creer : site web, landing page, application web, e-commerce, SaaS, automatisation ou autre chose ?",
    projectGoal: "Quel resultat voulez-vous obtenir avec ce projet ?",
    name: "Quel est votre nom complet ?",
    companyName: "Quel est le nom de votre entreprise ou marque ? Si aucun, dites projet personnel.",
    email: "Quel email l'equipe doit utiliser pour vous contacter ?",
    phone: "Quel numero de telephone l'equipe doit utiliser ?",
    location: "Dans quel pays et quelle ville etes-vous base ?",
    budgetRange: "Avez-vous une fourchette d'investissement prevue ?",
    timeline: "Quand voulez-vous commencer ou lancer le projet ?",
    communicationMethod: "Comment preferez-vous etre contacte : email, telephone ou WhatsApp ?",
    additionalNotes: "Autres notes, liens, fichiers ou exigences a ajouter ? Si aucun, dites aucun.",
    confirm: "Voici le brief : {summary} Je l'enregistre comme brief confirme pour l'equipe ?",
  },
};

function cleanText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getUserMessages(messages = []) {
  return Array.isArray(messages)
    ? messages.filter((message) => message?.role === "user" && typeof message.content === "string")
    : [];
}

function getLatestUserMessage(messages = []) {
  return [...getUserMessages(messages)].reverse()[0]?.content?.trim() || "";
}

function getPreviousAssistantQuestion(messages = []) {
  const latestUserIndex = Array.isArray(messages)
    ? messages.map((message) => message?.role).lastIndexOf("user")
    : -1;

  if (latestUserIndex <= 0) {
    return "";
  }

  for (let index = latestUserIndex - 1; index >= 0; index -= 1) {
    const message = messages[index];

    if (message?.role === "assistant" && typeof message.content === "string") {
      return message.content;
    }
  }

  return "";
}

function getPreviousAssistantBefore(messages = [], userIndex = -1) {
  if (userIndex <= 0) {
    return "";
  }

  for (let index = userIndex - 1; index >= 0; index -= 1) {
    const message = messages[index];

    if (message?.role === "assistant" && typeof message.content === "string") {
      return message.content;
    }
  }

  return "";
}

function hasMeaningfulAnswer(value) {
  const normalized = cleanText(value).toLowerCase();
  return normalized && !["none", "no", "nope", "aucun", "rien", "not sure"].includes(normalized);
}

function findEmail(text) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
}

function findPhone(text) {
  return text.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0]?.trim() || "";
}

function findUrls(text) {
  return text.match(/https?:\/\/[^\s]+/gi) || [];
}

function detectService(text) {
  const normalized = text.toLowerCase();

  if (/\b(landing|product launch|launch page|page de vente|lancement)\b/.test(normalized)) return "Landing page";
  if (/\b(e-?commerce|store|shop|sell online|boutique|vendre)\b/.test(normalized)) return "E-commerce";
  if (/\b(saas|mvp|subscription|abonnement)\b/.test(normalized)) return "SaaS / MVP";
  if (/\b(web app|application|dashboard|portal|booking|reservation|admin panel|platform|plateforme)\b/.test(normalized)) {
    return "Web application";
  }
  if (/\b(ai|chatbot|automation|automate|ia|automatisation)\b/.test(normalized)) return "AI / automation";
  if (/\b(website|site web|wordpress|portfolio|business site|full website)\b/.test(normalized)) return "Website";
  if (/\b(custom tech|robust tech|robuste tech|custom stack|from scratch)\b/.test(normalized)) return "Custom software";

  return "";
}

function detectBudget(text) {
  const normalized = text.toLowerCase();

  if (/\b(not set|no budget|don't know|dont know|pas encore|je ne sais pas)\b/.test(normalized)) return "Not set";
  return text.match(/(?:[$€£]?\s?\d[\d\s,.kK-]*(?:\s?(?:mad|usd|eur|gbp|dh|dhs|€|\$))?)/)?.[0]?.trim() || "";
}

function detectTimeline(text) {
  const normalized = text.toLowerCase();

  if (/\b(asap|urgent|this week|this month|next month|soon|immediately|planning|launch|deadline)\b/.test(normalized)) {
    return text.trim();
  }

  if (/\b(urgent|ce mois|semaine|mois prochain|bientot|planning|lancement|delai)\b/.test(normalized)) {
    return text.trim();
  }

  return "";
}

function detectCommunicationMethod(text) {
  const normalized = text.toLowerCase();

  if (/\b(whatsapp|phone|call|email|mail|telephone|appel)\b/.test(normalized)) {
    if (normalized.includes("whatsapp")) return "WhatsApp";
    if (/\b(phone|call|telephone|appel)\b/.test(normalized)) return "Phone";
    return "Email";
  }

  return "";
}

function detectLocation(text) {
  if (/\b(country|city|based in|from|located|pays|ville|base)\b/i.test(text)) {
    return text.trim();
  }

  if (/^[A-Za-zÀ-ÿ\s-]+,\s*[A-Za-zÀ-ÿ\s-]+$/.test(text.trim())) {
    return text.trim();
  }

  return "";
}

function detectCategory(profile) {
  const value = `${profile.serviceRequested} ${profile.projectGoal}`.toLowerCase();

  if (/e-commerce|store|shop|sell|boutique/.test(value)) return "e-commerce";
  if (/saas|mvp/.test(value)) return "saas";
  if (/automation|ai|chatbot|ia/.test(value)) return "automation";
  if (/dashboard|portal|web application|booking|platform/.test(value)) return "web-app";
  if (/landing/.test(value)) return "landing-page";
  if (/website|wordpress|portfolio/.test(value)) return "website";

  return "general-project";
}

function setFromPreviousQuestion(profile, question, answer) {
  const normalizedQuestion = question.toLowerCase();
  const cleanAnswer = cleanText(answer);

  if (!cleanAnswer) {
    return;
  }

  if (/full name|nom complet/.test(normalizedQuestion)) profile.name ||= cleanAnswer;
  if (/company|brand|entreprise|marque/.test(normalizedQuestion)) profile.companyName ||= cleanAnswer;
  if (/email/.test(normalizedQuestion)) profile.email ||= findEmail(cleanAnswer) || cleanAnswer;
  if (/phone|numero|telephone/.test(normalizedQuestion)) profile.phone ||= findPhone(cleanAnswer) || cleanAnswer;
  if (/country|city|pays|ville/.test(normalizedQuestion)) profile.location ||= cleanAnswer;
  if (/investment|budget|fourchette/.test(normalizedQuestion)) profile.budgetRange ||= detectBudget(cleanAnswer) || cleanAnswer;
  if (/start|launch|commencer|lancer/.test(normalizedQuestion)) profile.timeline ||= detectTimeline(cleanAnswer) || cleanAnswer;
  if (/contacted|contacte|whatsapp|phone|email/.test(normalizedQuestion)) {
    profile.communicationMethod ||= detectCommunicationMethod(cleanAnswer) || cleanAnswer;
  }
  if (/notes|links|files|requirements|fichiers|exigences/.test(normalizedQuestion)) {
    profile.additionalNotes ||= cleanAnswer;
    profile.fileNotes ||= findUrls(cleanAnswer).join(", ");
  }
  if (/business achieve|resultat|problem|objectif/.test(normalizedQuestion)) {
    profile.projectGoal = cleanAnswer;
  }
  if (/what do you want to build|que voulez-vous creer|service/.test(normalizedQuestion)) {
    profile.serviceRequested = detectService(cleanAnswer) || cleanAnswer;
  }
}

export function extractLeadProfile(messages = [], language = "en") {
  const userMessages = getUserMessages(messages);
  const latestUserMessage = getLatestUserMessage(messages);
  const previousAssistantQuestion = getPreviousAssistantQuestion(messages);
  const allUserText = userMessages.map((message) => message.content).join("\n");
  const profile = {
    language: language === "fr" ? "fr" : "en",
    name: "",
    companyName: "",
    email: findEmail(allUserText),
    phone: findPhone(allUserText),
    location: "",
    serviceRequested: "",
    projectGoal: "",
    budgetRange: "",
    timeline: "",
    communicationMethod: detectCommunicationMethod(allUserText),
    additionalNotes: "",
    fileNotes: findUrls(allUserText).join(", "),
  };

  for (const message of userMessages) {
    const text = message.content.trim();
    profile.serviceRequested ||= detectService(text);
    profile.budgetRange ||= detectBudget(text);
    profile.timeline ||= detectTimeline(text);
    profile.location ||= detectLocation(text);

    if (!profile.projectGoal && text.length > 18 && !findEmail(text) && !findPhone(text)) {
      profile.projectGoal = text;
    }
  }

  if (Array.isArray(messages)) {
    messages.forEach((message, index) => {
      if (message?.role === "user") {
        setFromPreviousQuestion(profile, getPreviousAssistantBefore(messages, index), message.content);
      }
    });
  }

  setFromPreviousQuestion(profile, previousAssistantQuestion, latestUserMessage);

  if (hasMeaningfulAnswer(profile.additionalNotes) || profile.fileNotes) {
    profile.additionalNotes = [profile.additionalNotes, profile.fileNotes && `Links/files: ${profile.fileNotes}`]
      .filter(Boolean)
      .join(" ");
  }

  profile.leadCategory = detectCategory(profile);
  profile.leadProgress = getLeadProgress(profile).progress;
  profile.confirmed = isConfirmation(messages);

  return profile;
}

export function getLeadProgress(profile) {
  const answered = REQUIRED_FIELDS.filter((field) => hasMeaningfulAnswer(profile[field]));
  return {
    answered: answered.length,
    total: REQUIRED_FIELDS.length,
    progress: Math.round((answered.length / REQUIRED_FIELDS.length) * 100),
    missing: REQUIRED_FIELDS.filter((field) => !hasMeaningfulAnswer(profile[field])),
  };
}

export function buildLeadSummary(profile) {
  return [
    `service: ${profile.serviceRequested || "not set"}`,
    `goal: ${profile.projectGoal || "not set"}`,
    `name: ${profile.name || "not set"}`,
    `company: ${profile.companyName || "not set"}`,
    `email: ${profile.email || "not set"}`,
    `phone: ${profile.phone || "not set"}`,
    `location: ${profile.location || "not set"}`,
    `budget: ${profile.budgetRange || "not set"}`,
    `timeline: ${profile.timeline || "not set"}`,
    `contact: ${profile.communicationMethod || "not set"}`,
  ].join("; ");
}

export function isConfirmation(messages = []) {
  const latest = getLatestUserMessage(messages).toLowerCase();
  const previous = getPreviousAssistantQuestion(messages).toLowerCase();

  return (
    /confirmed brief|save this as|enregistre/.test(previous) &&
    /^(yes|yes please|confirm|confirmed|ok|okay|save|oui|confirmer|enregistre)/i.test(latest)
  );
}

export function getNextIntakeReply({ messages = [], language = "en" }) {
  const normalizedLanguage = language === "fr" ? "fr" : "en";
  const profile = extractLeadProfile(messages, normalizedLanguage);
  const progress = getLeadProgress(profile);
  const questions = FIELD_QUESTIONS[normalizedLanguage];

  if (profile.confirmed) {
    return normalizedLanguage === "fr"
      ? "Parfait, le brief est confirme dans le dashboard. L'equipe peut maintenant le revoir."
      : "Perfect, the brief is confirmed in the dashboard. The team can now review it.";
  }

  if (progress.missing.length === 0) {
    return questions.confirm.replace("{summary}", buildLeadSummary(profile));
  }

  const nextField = progress.missing[0];

  if (nextField === "companyName" && !profile.name) {
    return questions.name;
  }

  return questions[nextField] || questions.projectGoal;
}
