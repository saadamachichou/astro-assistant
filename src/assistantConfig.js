const ALLOWED_CHAT_ROLES = new Set(["user", "assistant"]);
const DEFAULT_HISTORY_LIMIT = 6;
const DEFAULT_MESSAGE_CHARACTER_LIMIT = 520;
const LANGUAGE_DIRECTIVES = {
  en: "Mirror the visitor in English unless they clearly switch language.",
  fr: "Mirror the visitor in French unless they clearly switch language.",
  ar: "Mirror the visitor in Arabic unless they clearly switch language.",
};

export function detectMessageLanguage(text = "") {
  if (/[\u0600-\u06FF]/.test(text)) return "ar";

  const normalized = String(text).toLowerCase();
  if (
    /\b(bonjour|salut|merci|devis|tarif|prix|site web|application|boutique|d[ée]lai|fran[çc]ais|contactez|rendez-vous|appel|t[ée]l[ée]phone)\b/i.test(
      normalized,
    )
  ) {
    return "fr";
  }

  return "en";
}

export function resolveLanguage(selectedLanguage = "en", messages = []) {
  const latestUserMessage = Array.isArray(messages)
    ? [...messages].reverse().find((message) => message?.role === "user")?.content || ""
    : "";

  if (latestUserMessage) {
    return detectMessageLanguage(latestUserMessage);
  }

  return selectedLanguage === "fr" || selectedLanguage === "ar" ? selectedLanguage : "en";
}

export function buildSystemMessage({ systemPrompt, knowledgeBase, language = "en" }) {
  const languageDirective = LANGUAGE_DIRECTIVES[language] || LANGUAGE_DIRECTIVES.en;

  return {
    role: "system",
    content: [
      systemPrompt.trim(),
      "",
      languageDirective,
      "",
      "Use the compact company brief as source of truth. If uncertain, say our team can confirm after reviewing the project.",
      "",
      "COMPACT COMPANY BRIEF",
      knowledgeBase.trim(),
    ].join("\n"),
  };
}

export function normalizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((message) => {
      return (
        message &&
        ALLOWED_CHAT_ROLES.has(message.role) &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
      );
    })
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }));
}

export function compactMessages(
  messages,
  { limit = DEFAULT_HISTORY_LIMIT, maxCharacters = DEFAULT_MESSAGE_CHARACTER_LIMIT } = {},
) {
  return normalizeMessages(messages)
    .slice(-limit)
    .map((message) => ({
      ...message,
      content:
        message.content.length > maxCharacters
          ? `${message.content.slice(0, maxCharacters).trim()}...`
          : message.content,
    }));
}

export function compactAssistantReply(reply, maxCharacters = 320) {
  if (typeof reply !== "string") {
    return "";
  }

  const normalized = reply
    .replace(/\*\*/g, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

  if (normalized.length <= maxCharacters && /[.!?]$/.test(normalized)) {
    return normalized;
  }

  const questionIndex = normalized.indexOf("?");

  if (questionIndex >= 0 && questionIndex <= maxCharacters) {
    return normalized.slice(0, questionIndex + 1).trim();
  }

  const shortened = normalized.slice(0, maxCharacters);
  const sentenceEnd = Math.max(shortened.lastIndexOf("."), shortened.lastIndexOf("!"), shortened.lastIndexOf("?"));

  if (sentenceEnd >= 60) {
    return shortened.slice(0, sentenceEnd + 1).trim();
  }

  return `${shortened.replace(/[,;:\s]+$/g, "").trim()}.`;
}
