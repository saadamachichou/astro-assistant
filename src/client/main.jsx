import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bot,
  ChevronRight,
  ClipboardCheck,
  Inbox,
  Languages,
  Mail,
  Minimize2,
  Phone,
  RotateCcw,
  Send,
  Sparkles,
  UserRound,
  X,
  Zap,
} from "lucide-react";

import { Avatar, AvatarFallback } from "./components/ui/avatar.jsx";
import { Badge } from "./components/ui/badge.jsx";
import { Button } from "./components/ui/button.jsx";
import { Card, CardContent, CardHeader } from "./components/ui/card.jsx";
import { Input } from "./components/ui/input.jsx";
import { getGuideStep, selectGuideChoice } from "../guidedChoices.js";
import { cn } from "./lib/utils.js";
import "./styles.css";

const COPY = {
  en: {
    gateTitle: "Choose your language",
    gateCopy: "Start in the language your visitor prefers. You can switch anytime.",
    opening:
      "Hey, I'm Astro Assistant. Tell me what you're trying to build, or pick a starting point and I'll help you find the best path with ASTROQODELABS.",
    placeholder: "Write your message...",
    send: "Send",
    saveBrief: "Save brief",
    saveHint: "Ready to hand off?",
    saved: "Saved to PostgreSQL.",
    leadError: "Could not save the brief.",
    clear: "Clear",
    language: "Language",
    thinking: "Astro is shaping the answer...",
  },
  fr: {
    gateTitle: "Choisissez votre langue",
    gateCopy: "Commencez dans la langue preferee du visiteur. Vous pouvez changer a tout moment.",
    opening:
      "Bonjour, je suis Astro Assistant. Dites-moi ce que vous voulez creer, ou choisissez un point de depart, et je vous aiderai a trouver la meilleure direction avec ASTROQODELABS.",
    placeholder: "Ecrivez votre message...",
    send: "Envoyer",
    saveBrief: "Enregistrer",
    saveHint: "Pret pour le suivi ?",
    saved: "Enregistre dans PostgreSQL.",
    leadError: "Impossible d'enregistrer le brief.",
    clear: "Effacer",
    language: "Langue",
    thinking: "Astro prepare la reponse...",
  },
};

function App() {
  const prefersReducedMotion = useReducedMotion();
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [guideStage, setGuideStage] = useState("project-type");
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [leadStatus, setLeadStatus] = useState(null);
  const [leadDraft, setLeadDraft] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    projectGoal: "",
    budgetRange: "",
    timeline: "",
  });

  const copy = COPY[language || "en"];
  const hasChatStarted = Boolean(language);
  const guideStep = useMemo(() => {
    if (!hasChatStarted) {
      return null;
    }

    return getGuideStep(language, guideStage);
  }, [guideStage, hasChatStarted, language]);

  const visibleMessages = useMemo(() => {
    if (!hasChatStarted) {
      return [];
    }

    return messages.length
      ? messages
      : [
          {
            role: "assistant",
            content: copy.opening,
          },
        ];
  }, [copy.opening, hasChatStarted, messages]);

  if (isAdminRoute) {
    return <AdminPanel />;
  }

  function chooseLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    setMessages([]);
    setGuideStage("project-type");
  }

  function resetLanguage() {
    setLanguage(null);
    setMessages([]);
    setInput("");
    setGuideStage("project-type");
  }

  function clearChat() {
    if (!language) {
      return;
    }

    setMessages([]);
    setInput("");
    setLeadStatus(null);
    setGuideStage("project-type");
  }

  function updateLeadDraft(field, value) {
    setLeadDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  }

  function applyLeadPatch(patch) {
    if (!patch || Object.keys(patch).length === 0) {
      return;
    }

    setLeadDraft((currentDraft) => ({
      ...currentDraft,
      ...patch,
    }));
  }

  function handleGuideChoice(choice) {
    const selection = selectGuideChoice(guideStage, choice);

    setGuideStage(selection.nextStage);
    applyLeadPatch(selection.leadPatch);

    if (selection.intent === "save") {
      setIsLeadFormOpen(true);
      return;
    }

    sendMessage(selection.prompt);
  }

  async function saveLead(event) {
    event.preventDefault();

    const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content || "";
    const projectGoal = leadDraft.projectGoal.trim() || latestUserMessage;

    setLeadStatus({ type: "loading", message: "Saving..." });

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...leadDraft,
          projectGoal,
          language,
          messages: messages.length ? messages : visibleMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || copy.leadError);
      }

      setLeadStatus({ type: "success", message: copy.saved });
      setIsLeadFormOpen(false);
    } catch (error) {
      setLeadStatus({
        type: "error",
        message: error instanceof Error ? error.message : copy.leadError,
      });
    }
  }

  async function sendMessage(content) {
    const cleanContent = content.trim();

    if (!cleanContent || !language || isLoading) {
      return;
    }

    const nextMessages = [...messages, { role: "user", content: cleanContent }];
    const assistantMessage = {
      role: "assistant",
      content: "",
      pending: true,
    };

    setMessages([...nextMessages, assistantMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          messages: nextMessages,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.fallback || data.error || "Astro Assistant is unavailable.");
      }

      if (!response.body) {
        throw new Error("Astro Assistant did not return a response stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        streamedContent += decoder.decode(value, { stream: true });
        setMessages([...nextMessages, { role: "assistant", content: streamedContent }]);
      }

      streamedContent += decoder.decode();
      setMessages([...nextMessages, { role: "assistant", content: streamedContent.trim() }]);
    } catch (error) {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          error: true,
          content:
            error instanceof Error
              ? error.message
              : "Astro Assistant is unavailable right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage(input);
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#03060c] text-white">
      <BackgroundAtmosphere />

      <section className="relative z-10 flex min-h-dvh w-full items-center px-6 py-10 md:px-12">
        <div className="max-w-[42rem]">
          <motion.p
            className="font-display text-xs font-black uppercase tracking-[0.35em] text-cyan-300"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          >
            ASTROQODELABS
          </motion.p>
          <motion.h1
            className="mt-7 max-w-[8ch] font-display text-[clamp(4.2rem,10vw,8.8rem)] font-black leading-[0.83] tracking-[-0.06em]"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            Astro Assistant
          </motion.h1>
          <motion.p
            className="mt-8 max-w-[34rem] text-base leading-8 text-slate-300 md:text-lg"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            A refined local AI widget for qualifying project leads, explaining services, and preparing
            clear briefs with your Ollama model.
          </motion.p>
          <motion.div
            className="mt-9 flex flex-wrap gap-3"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
          >
            <Badge variant="success" className="gap-2">
              <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.8)]" />
              Ollama online
            </Badge>
            <Badge variant="secondary">qwen2.5:7b</Badge>
            <Badge variant="secondary">Framer Motion</Badge>
            <Badge variant="secondary">shadcn style</Badge>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            aria-label="Open Astro Assistant"
            className="group fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full border border-cyan-200/20 bg-slate-950/76 p-2 pr-5 text-left shadow-astro shadow-cyan-950/20 outline-none backdrop-blur-2xl transition-colors hover:border-cyan-200/40 focus-visible:ring-2 focus-visible:ring-cyan-300/70"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.92 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 16, scale: 0.92 }}
            whileHover={prefersReducedMotion ? undefined : { y: -3, scale: 1.015 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
            onClick={() => setIsOpen(true)}
          >
            <span className="absolute inset-[-10px] -z-10 rounded-full bg-cyan-300/10 blur-xl transition group-hover:bg-violet-300/15" />
            <span className="relative grid size-14 place-items-center rounded-full bg-[radial-gradient(circle_at_32%_25%,#dffaff_0,#56dbff_28%,#7057ff_78%)] text-slate-950 shadow-halo">
              <Sparkles className="size-6" />
              <span className="absolute right-0 top-1 size-3 rounded-full border-2 border-slate-950 bg-emerald-300" />
            </span>
            <span className="hidden flex-col sm:flex">
              <span className="font-display text-sm font-black leading-5">Astro Assistant</span>
              <span className="text-xs text-slate-400">Ask about your project</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className="fixed bottom-5 right-5 z-40 w-[min(476px,calc(100vw-24px))] overflow-hidden rounded-[2rem]"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.94 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 18, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            <Card className="relative h-[min(732px,calc(100dvh-40px))] overflow-hidden border-cyan-100/20 bg-[#050813]/94 shadow-[0_26px_90px_rgba(0,0,0,0.55),0_0_80px_rgba(46,213,255,0.08)]">
              <div aria-hidden="true" className="absolute inset-0">
                <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(125,243,255,0.12),rgba(11,17,31,0.03)_58%,transparent)]" />
                <div className="absolute inset-y-20 left-0 w-px bg-gradient-to-b from-transparent via-cyan-200/35 to-transparent" />
                <div className="absolute inset-y-20 right-0 w-px bg-gradient-to-b from-transparent via-violet-200/22 to-transparent" />
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent" />
              </div>

              <CardHeader className="relative border-b border-white/10 bg-[linear-gradient(180deg,rgba(18,27,45,0.86),rgba(9,14,27,0.74))] p-4">
                <div className="flex items-center gap-3.5 max-[420px]:gap-2.5">
                  <div className="relative shrink-0">
                    <span className="absolute inset-[-5px] rounded-full border border-cyan-200/20 bg-cyan-300/8 blur-[1px]" />
                    <Avatar className="relative size-13 border border-cyan-200/28 bg-slate-950 shadow-halo max-[420px]:size-12">
                      <AvatarFallback className="bg-[radial-gradient(circle_at_30%_22%,#d9fbff_0,#54dfff_32%,#654cff_92%)] text-slate-950">
                        AQ
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -right-0.5 top-1.5 size-3 rounded-full border-2 border-[#111827] bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.9)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate font-display text-[1.05rem] font-black tracking-normal max-[420px]:text-[0.95rem]">
                        Astro Assistant
                      </h2>
                      <Badge variant="success" className="hidden px-2 py-0.5 text-[0.66rem] sm:inline-flex">
                        Live
                      </Badge>
                    </div>
                    <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 truncate">
                        <Zap className="size-3 text-cyan-300" />
                        qwen2.5:7b
                      </span>
                      <span className="size-1 rounded-full bg-slate-600" />
                      <span className="truncate">Local concierge</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-slate-950/38 p-1 max-[420px]:gap-0.5">
                    <Button variant="ghost" size="icon" className="size-9 rounded-full max-[420px]:size-8" aria-label={copy.language} onClick={resetLanguage}>
                      <Languages className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-9 rounded-full max-[420px]:size-8" aria-label={copy.clear} onClick={clearChat}>
                      <RotateCcw className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-9 rounded-full max-[420px]:size-8" aria-label="Close chat" onClick={() => setIsOpen(false)}>
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative grid h-[calc(100%-85px)] min-w-0 grid-rows-[1fr_auto] overflow-hidden p-0">
                {!hasChatStarted ? (
                  <LanguageGate copy={copy} onChoose={chooseLanguage} />
                ) : (
                  <>
                    <Conversation messages={visibleMessages} thinking={copy.thinking} />
                    <div className="relative border-t border-white/10 bg-[linear-gradient(180deg,rgba(7,11,23,0.84),rgba(4,7,16,0.98))] p-3.5">
                      <div aria-hidden="true" className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/35 to-transparent" />
                      <QuickActions step={guideStep} disabled={isLoading} onPick={handleGuideChoice} />
                      <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2">
                        <span className="truncate text-xs font-semibold text-slate-400">{copy.saveHint}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 shrink-0 rounded-full px-3 text-xs"
                          onClick={() => setIsLeadFormOpen(true)}
                        >
                          <ClipboardCheck className="size-3.5" />
                          {copy.saveBrief}
                        </Button>
                      </div>
                      {leadStatus && (
                        <p
                          className={cn(
                            "mt-2 text-xs",
                            leadStatus.type === "success" && "text-emerald-200",
                            leadStatus.type === "error" && "text-red-200",
                            leadStatus.type === "loading" && "text-cyan-200",
                          )}
                        >
                          {leadStatus.message}
                        </p>
                      )}
                      <form
                        className="mt-3 flex min-h-[62px] items-center gap-2 rounded-[1.35rem] border border-cyan-200/16 bg-[#030712]/92 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_18px_44px_rgba(0,0,0,0.36)] transition focus-within:border-cyan-300/45 focus-within:ring-2 focus-within:ring-cyan-300/14"
                        onSubmit={handleSubmit}
                      >
                        <span aria-hidden="true" className="ml-2 size-2.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.85)]" />
                        <Input
                          value={input}
                          onChange={(event) => setInput(event.target.value)}
                          disabled={isLoading}
                          placeholder={copy.placeholder}
                          className="h-11 flex-1 border-0 bg-transparent px-2 text-[0.93rem] shadow-none placeholder:text-slate-500 focus:ring-0"
                          onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                              event.preventDefault();
                              handleSubmit(event);
                            }
                          }}
                        />
                        <Button
                          type="submit"
                          size="icon"
                          disabled={isLoading || !input.trim()}
                          aria-label={copy.send}
                          className="size-11 shrink-0 rounded-[1.05rem] bg-gradient-to-br from-cyan-200 via-cyan-300 to-violet-400 text-slate-950 shadow-[0_14px_32px_rgba(56,213,255,0.24)] hover:from-cyan-100 hover:to-violet-300"
                        >
                          {isLoading ? <Minimize2 className="size-4 animate-pulse" /> : <Send className="size-4" />}
                        </Button>
                      </form>
                    </div>
                    <AnimatePresence>
                      {isLeadFormOpen && (
                        <LeadCaptureModal
                          copy={copy}
                          draft={leadDraft}
                          onChange={updateLeadDraft}
                          onClose={() => setIsLeadFormOpen(false)}
                          onSubmit={saveLead}
                          status={leadStatus}
                        />
                      )}
                    </AnimatePresence>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.aside>
        )}
      </AnimatePresence>
    </main>
  );
}

function LeadCaptureModal({ copy, draft, onChange, onClose, onSubmit, status }) {
  return (
    <motion.div
      className="absolute inset-0 z-50 grid place-items-end bg-slate-950/62 p-3 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        className="w-full rounded-[1.45rem] border border-cyan-100/18 bg-[#070b15] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.48)]"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        onSubmit={onSubmit}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-black">Project brief</h3>
            <p className="mt-1 text-xs text-slate-400">Saved locally in PostgreSQL.</p>
          </div>
          <Button type="button" variant="ghost" size="icon" className="rounded-full" aria-label="Close" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <LeadInput icon={UserRound} label="Name" value={draft.name} onChange={(value) => onChange("name", value)} />
          <LeadInput icon={Mail} label="Email" value={draft.email} onChange={(value) => onChange("email", value)} />
          <LeadInput icon={Phone} label="Phone" value={draft.phone} onChange={(value) => onChange("phone", value)} />
          <LeadInput label="Project type" value={draft.projectType} onChange={(value) => onChange("projectType", value)} />
          <LeadInput label="Budget" value={draft.budgetRange} onChange={(value) => onChange("budgetRange", value)} />
          <LeadInput label="Timeline" value={draft.timeline} onChange={(value) => onChange("timeline", value)} />
        </div>

        <label className="mt-3 block text-xs font-bold text-slate-300">
          Project goal
          <textarea
            value={draft.projectGoal}
            onChange={(event) => onChange("projectGoal", event.target.value)}
            className="mt-2 min-h-20 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/62 px-3 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/45 focus:ring-2 focus:ring-cyan-300/14"
            placeholder="Short project summary..."
          />
        </label>

        {status?.type === "error" && <p className="mt-3 text-xs text-red-200">{status.message}</p>}

        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="ghost" className="rounded-full" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="rounded-full">
            <ClipboardCheck className="size-4" />
            {copy.saveBrief}
          </Button>
        </div>
      </motion.form>
    </motion.div>
  );
}

function LeadInput({ icon: Icon, label, value, onChange }) {
  return (
    <label className="block text-xs font-bold text-slate-300">
      {label}
      <span className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/62 px-3 focus-within:border-cyan-300/45 focus-within:ring-2 focus-within:ring-cyan-300/14">
        {Icon && <Icon className="size-4 shrink-0 text-cyan-200" />}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 min-w-0 flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
        />
      </span>
    </label>
  );
}

function AdminPanel() {
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState({ type: "loading", message: "Loading leads..." });

  async function loadLeads() {
    setStatus({ type: "loading", message: "Loading leads..." });

    try {
      const response = await fetch(`/api/admin/leads${window.location.search}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load leads.");
      }

      setLeads(data.leads || []);
      setStatus({ type: "success", message: `${data.leads?.length || 0} leads loaded.` });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Could not load leads.",
      });
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  return (
    <main className="min-h-dvh bg-[#03060c] px-5 py-6 text-white md:px-8">
      <BackgroundAtmosphere />
      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-xs font-black uppercase tracking-[0.28em] text-cyan-300">ASTROQODELABS</p>
            <h1 className="mt-3 font-display text-4xl font-black tracking-normal">Lead dashboard</h1>
            <p className="mt-2 text-sm text-slate-400">Local PostgreSQL leads from Astro Assistant.</p>
          </div>
          <Button type="button" className="rounded-full" onClick={loadLeads}>
            <Inbox className="size-4" />
            Refresh
          </Button>
        </div>

        <p
          className={cn(
            "mt-4 text-sm",
            status.type === "error" && "text-red-200",
            status.type === "success" && "text-emerald-200",
            status.type === "loading" && "text-cyan-200",
          )}
        >
          {status.message}
        </p>

        <div className="mt-6 grid gap-4">
          {leads.map((lead) => (
            <article
              key={lead.id}
              className="rounded-[1.3rem] border border-white/10 bg-slate-950/62 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-display text-xl font-black">
                    {lead.name || lead.projectType || "New lead"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {[lead.email, lead.phone].filter(Boolean).join(" / ") || "No contact detail yet"}
                  </p>
                </div>
                <Badge variant="secondary">{lead.status}</Badge>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-4">
                <LeadFact label="Language" value={lead.language} />
                <LeadFact label="Type" value={lead.projectType} />
                <LeadFact label="Budget" value={lead.budgetRange} />
                <LeadFact label="Timeline" value={lead.timeline} />
              </div>

              {lead.projectGoal && <p className="mt-4 text-sm leading-6 text-slate-200">{lead.projectGoal}</p>}

              <details className="mt-4 rounded-2xl border border-white/10 bg-black/18 p-3">
                <summary className="cursor-pointer text-sm font-bold text-cyan-100">Conversation transcript</summary>
                <div className="mt-3 space-y-2 text-sm text-slate-300">
                  {(lead.messages || []).map((message, index) => (
                    <p key={`${lead.id}-${index}`} className="leading-6">
                      <span className="font-bold text-slate-100">{message.role}:</span> {message.content}
                    </p>
                  ))}
                </div>
              </details>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function LeadFact({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
      <p className="text-[0.68rem] font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-words text-slate-100">{value || "Not specified"}</p>
    </div>
  );
}

function BackgroundAtmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0">
      <div className="absolute left-[-12rem] top-[-14rem] size-[34rem] rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-[-10rem] top-[-8rem] size-[30rem] rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute bottom-[-16rem] left-[38%] size-[34rem] rounded-full bg-blue-500/8 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,rgba(3,6,12,0.8)_76%)]" />
    </div>
  );
}

function LanguageGate({ copy, onChoose }) {
  return (
    <div className="astro-panel-grid relative grid h-full content-center overflow-hidden px-7 py-10 text-center">
      <div aria-hidden="true" className="absolute left-1/2 top-[18%] h-32 w-56 -translate-x-1/2 rounded-full bg-cyan-300/8 blur-3xl" />
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
      >
        <div className="mx-auto grid size-16 place-items-center rounded-[1.35rem] border border-cyan-200/24 bg-[linear-gradient(145deg,rgba(103,232,249,0.18),rgba(124,58,237,0.12))] shadow-halo">
          <Bot className="size-7 text-cyan-100" />
        </div>
        <h3 className="mt-6 font-display text-3xl font-black tracking-normal">{copy.gateTitle}</h3>
        <p className="mx-auto mt-3 max-w-[20rem] text-sm leading-6 text-slate-400">{copy.gateCopy}</p>
        <div className="mt-7 grid grid-cols-2 gap-3">
          <Button variant="outline" size="lg" className="h-14 rounded-2xl" onClick={() => onChoose("en")}>
            English
            <ChevronRight className="size-4" />
          </Button>
          <Button variant="outline" size="lg" className="h-14 rounded-2xl" onClick={() => onChoose("fr")}>
            Francais
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function Conversation({ messages, thinking }) {
  const scrollAnchorRef = useRef(null);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      scrollAnchorRef.current?.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [messages]);

  return (
    <div className="scrollbar-thin astro-panel-grid relative flex min-h-0 w-full max-w-full min-w-0 flex-col gap-3 overflow-x-hidden overflow-y-auto px-5 py-5 [contain:inline-size]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-4 flex items-center gap-2 opacity-40">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-200/25 to-transparent" />
        <span className="size-1.5 rounded-full bg-cyan-200/70 shadow-[0_0_12px_rgba(125,243,255,0.9)]" />
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-200/18 to-transparent" />
      </div>
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div
            key={`${message.role}-${index}-${message.content.slice(0, 12)}`}
            layout
            className={cn("relative z-10 flex", message.role === "user" ? "justify-end" : "justify-start")}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {message.role === "assistant" && (
              <div className="mr-2 mt-1 grid size-7 shrink-0 place-items-center rounded-full border border-cyan-200/20 bg-cyan-300/10 text-[0.65rem] font-black text-cyan-100 shadow-[0_0_22px_rgba(56,213,255,0.1)]">
                AQ
              </div>
            )}
            <div
              className={cn(
                "min-w-0 max-w-[84%] rounded-[1.35rem] px-4 py-3 text-sm leading-6 shadow-sm",
                "whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
                message.role === "user"
                  ? "rounded-br-md border border-cyan-200/28 bg-[linear-gradient(145deg,rgba(34,211,238,0.18),rgba(99,102,241,0.13))] text-cyan-50 shadow-[0_12px_34px_rgba(56,213,255,0.09)]"
                  : "rounded-bl-md border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,0.095),rgba(255,255,255,0.045))] text-slate-100 shadow-[0_18px_44px_rgba(0,0,0,0.2)]",
                message.error && "border-red-300/30 bg-red-400/10 text-red-100",
              )}
            >
              {message.content || thinking}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={scrollAnchorRef} aria-hidden="true" className="h-px" />
    </div>
  );
}

function QuickActions({ step, disabled, onPick }) {
  if (!step) {
    return null;
  }

  return (
    <div className="w-full max-w-full min-w-0 pb-1 [contain:inline-size]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="truncate text-xs font-black uppercase tracking-[0.12em] text-cyan-100/80">{step.title}</p>
        <span className="hidden text-[0.7rem] font-semibold text-slate-500 sm:inline">or write below</span>
      </div>
      <motion.div
        key={step.title}
        className="flex w-full max-w-full min-w-0 flex-wrap gap-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
      >
        {step.choices.map((choice) => (
          <Button
            key={choice.id}
            type="button"
            variant="secondary"
            size="sm"
            className="h-9 shrink-0 rounded-full border-white/12 bg-white/[0.065] px-3.5 text-[0.82rem] text-slate-100 hover:border-cyan-200/25 hover:bg-cyan-300/10"
            disabled={disabled}
            onClick={() => onPick(choice)}
          >
            {choice.label}
          </Button>
        ))}
      </motion.div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
