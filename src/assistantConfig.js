const ALLOWED_CHAT_ROLES = new Set(["user", "assistant"]);
const DEFAULT_HISTORY_LIMIT = 6;
const DEFAULT_MESSAGE_CHARACTER_LIMIT = 520;
const LANGUAGE_DIRECTIVES = {
  en: "The visitor selected English before starting the conversation. Reply in English unless the visitor explicitly switches language.",
  fr: "The visitor selected French before starting the conversation. Reply in French unless the visitor explicitly switches language.",
};

export function buildSystemMessage({ systemPrompt, knowledgeBase, language = "en" }) {
  const languageDirective = LANGUAGE_DIRECTIVES[language] || LANGUAGE_DIRECTIVES.en;

  return {
    role: "system",
    content: [
      systemPrompt.trim(),
      "",
      languageDirective,
      "",
      "Use the compact company brief below as the source of truth for ASTROQODELABS facts. If the brief is missing or uncertain, say the team can confirm after reviewing the project.",
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
