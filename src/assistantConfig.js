const ALLOWED_CHAT_ROLES = new Set(["user", "assistant"]);
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
      "Use the company knowledge below as the source of truth for ASTROQODELABS facts. If the knowledge is missing or uncertain, say so instead of guessing.",
      "",
      "COMPANY KNOWLEDGE",
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
