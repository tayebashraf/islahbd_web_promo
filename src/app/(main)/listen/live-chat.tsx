"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, MapPin, PencilLine, Send, ShieldCheck, SmilePlus, UserX } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { API_BASE, getDeviceId } from "@/lib/api";
import { num } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useStoredString } from "@/lib/use-client-store";

interface ChatMessage {
  id: number;
  user: string;
  userId?: string;
  location: string;
  message: string;
  isAdmin: boolean;
  timestamp: string;
  reactions?: Record<string, number>;
  reactionBy?: Record<string, string>;
}

const CHAT_URL = `${API_BASE}/api/live/chat/`;
const REACT_URL = `${API_BASE}/api/live/chat/reaction/`;
const POLL_MS = 4000;
/** While following the live edge, the newest few stay crisp; older ones fade and blur upward. */
const CRISP = 4;
const KEEP = 100;
/** Same reaction set as the app (one per person; tapping it again removes it). */
const REACTIONS = ["❤️", "👍", "🤲", "✅", "🌸"];
const QUICK = ["মাশাআল্লাহ 🌟", "সুবহানাল্লাহ", "আলহামদুলিল্লাহ", "জাযাকাল্লাহু খাইরান"];
const TONES = ["#417360", "#C08A2E", "#0284C7", "#BE185D", "#7C3AED", "#0F766E"];
const toneFor = (s: string) => TONES[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % TONES.length];

/** One-reaction-per-person toggle, mirroring the backend rule. */
function toggled(m: ChatMessage, me: string, emoji: string): Pick<ChatMessage, "reactions" | "reactionBy"> {
  const reactions = { ...(m.reactions ?? {}) };
  const reactionBy = { ...(m.reactionBy ?? {}) };
  const mine = reactionBy[me];
  if (mine) {
    if ((reactions[mine] ?? 0) > 1) reactions[mine] -= 1;
    else delete reactions[mine];
  }
  if (mine !== emoji) {
    reactions[emoji] = (reactions[emoji] ?? 0) + 1;
    reactionBy[me] = emoji;
  } else delete reactionBy[me];
  return { reactions, reactionBy };
}

/**
 * Live chat stage: new messages rise from the bottom while older ones drift
 * up, fade and blur. Scrolling up turns the effect off so history reads
 * clearly; double-tap or long-press a message to react.
 */
export function LiveChat({ open }: { open: boolean }) {
  const { t, lang } = useLang();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // Saved identity (read after hydration) until the visitor types a new one.
  const [savedName, saveName] = useStoredString("islah_chat_name");
  const [savedLocation, saveLocation] = useStoredString("islah_chat_location");
  const [mode, saveMode] = useStoredString("islah_chat_mode"); // "named" | "anon"
  const [draftName, setName] = useState<string | null>(null);
  const [draftLocation, setLocation] = useState<string | null>(null);
  const name = draftName ?? savedName ?? "";
  const location = draftLocation ?? savedLocation ?? "";
  // Composer steps: a single invite button → who you are → write.
  const [step, setStep] = useState<"idle" | "identity" | "write">("idle");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  // Messages are only fetched in the browser, so reading the device id here is hydration-safe.
  const [me] = useState(() => (typeof window === "undefined" ? "" : getDeviceId()));

  // Scroll state: following the live edge vs. reading history.
  const listRef = useRef<HTMLDivElement>(null);
  const [follow, setFollow] = useState(true);
  const [unread, setUnread] = useState(0);
  const lastCount = useRef(0);
  const [picker, setPicker] = useState<number | null>(null);

  // Insert new messages and refresh reaction tallies of ones we already have.
  const merge = useCallback((rows: ChatMessage[]) => {
    setMessages((prev) => {
      const byId = new Map(prev.map((m) => [m.id, m]));
      for (const r of rows) if (r && typeof r.id === "number") byId.set(r.id, { ...byId.get(r.id), ...r });
      return [...byId.values()].sort((a, b) => a.id - b.id).slice(-KEEP);
    });
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(CHAT_URL, { cache: "no-store" });
        if (!res.ok) return;
        const rows = (await res.json()) as ChatMessage[];
        if (active && Array.isArray(rows)) merge(rows);
      } catch {
        /* transient */
      }
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [merge]);

  // Stick to the newest message while following; otherwise count what's new.
  useEffect(() => {
    const added = messages.length - lastCount.current;
    lastCount.current = messages.length;
    const el = listRef.current;
    if (!el || added <= 0) return;
    if (follow) el.scrollTo({ top: el.scrollHeight, behavior: added > 5 ? "auto" : "smooth" });
    else setUnread((u) => u + added);
  }, [messages.length, follow]);

  // Tapping anywhere outside the open picker closes it.
  useEffect(() => {
    if (picker === null) return;
    const close = (e: PointerEvent) => !(e.target as Element).closest?.("[data-react-ui]") && setPicker(null);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [picker]);

  const onScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 28;
    setFollow(atBottom);
    if (atBottom) setUnread(0);
    setPicker(null);
  };
  const jumpToLatest = () => {
    const el = listRef.current;
    el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    setUnread(0);
  };

  const react = async (m: ChatMessage, emoji: string) => {
    setPicker(null);
    if (!me || !open) return;
    const before = { reactions: m.reactions, reactionBy: m.reactionBy };
    setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, ...toggled(x, me, emoji) } : x)));
    try {
      const res = await fetch(REACT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: String(m.id), userId: me, emoji }),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as Pick<ChatMessage, "reactions" | "reactionBy">;
      if (data?.reactions) setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, reactions: data.reactions, reactionBy: data.reactionBy } : x)));
    } catch {
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, ...before } : x)));
    }
  };

  const send = async (msg: string) => {
    msg = msg.trim();
    if (!msg || sending || !open) return;
    setSending(true);
    setErr("");
    const named = mode === "named" && !!name.trim();
    try {
      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, user: named ? name.trim() : "Anonymous", location: named ? location.trim() : "", isAdmin: false, userId: getDeviceId() }),
      });
      if (!res.ok) throw new Error();
      merge([(await res.json()) as ChatMessage]);
      setText("");
    } catch {
      setErr(t("মেসেজ পাঠানো যায়নি — আবার চেষ্টা করুন", "Couldn't send — try again"));
    } finally {
      setSending(false);
    }
  };

  // Always confirm who is commenting (fields come pre-filled from last time).
  const begin = () => setStep("identity");
  const asNamed = () => {
    saveName(name.trim());
    saveLocation(location.trim());
    saveMode("named");
    setStep("write");
  };
  const asAnon = () => {
    saveMode("anon");
    setStep("write");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Stage: scrollable; while following the live edge the top fades out */}
      <div className="relative">
        <div
          ref={listRef}
          onScroll={onScroll}
          className="scroll-hide h-[300px] overflow-y-auto overscroll-contain sm:h-[340px]"
          style={
            follow
              ? { maskImage: "linear-gradient(to bottom, transparent 0%, black 28%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 28%)" }
              : { maskImage: "linear-gradient(to bottom, transparent 0%, black 6%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 6%)" }
          }
          aria-live="polite"
        >
          <div className="flex min-h-full flex-col justify-end gap-2 pt-16 pb-1">
            {messages.length === 0 && (
              <p className="pb-8 text-center text-sm text-ink-3">{open ? t("প্রথম মেসেজটি আপনিই দিন…", "Be the first to say something…") : t("লাইভ চলাকালীন মেসেজ দেখা যাবে", "Messages appear during the live")}</p>
            )}
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <Bubble
                  key={m.id}
                  m={m}
                  mine={!!me && m.userId === me}
                  myReaction={me ? m.reactionBy?.[me] : undefined}
                  depth={follow ? messages.length - 1 - i : 0}
                  pickerOpen={picker === m.id}
                  canReact={open}
                  onPicker={(v) => setPicker(v ? m.id : null)}
                  onReact={(e) => react(m, e)}
                  lang={lang}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {!follow && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              onClick={jumpToLatest}
              className="absolute bottom-2 left-1/2 flex h-9 -translate-x-1/2 items-center gap-1.5 rounded-full bg-brand px-4 text-[13px] font-medium text-white shadow-[var(--shadow-float)]"
            >
              <ArrowDown className="h-4 w-4" />
              {unread > 0 ? t(`${num(unread, lang)}টি নতুন মেসেজ`, `${unread} new`) : t("সর্বশেষে যান", "Latest")}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Composer */}
      <div className="mt-3">
        {!open ? (
          <p className="flex h-11 items-center justify-center rounded-full border border-dashed border-line text-sm text-ink-3">{t("লাইভ চলাকালীন মন্তব্য জানানো যাবে", "You can comment during the live")}</p>
        ) : step === "idle" ? (
          <button onClick={begin} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-medium text-white transition hover:bg-brand-strong active:scale-[0.99]">
            <PencilLine className="h-4 w-4" />
            {t("আপনিও মন্তব্য জানান", "Share your comment")}
          </button>
        ) : step === "identity" ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-line bg-panel-2 p-3">
            <p className="mb-2 text-sm font-medium text-ink">{t("মন্তব্যের সাথে আপনার পরিচয়", "Who's commenting?")}</p>
            <div className="grid grid-cols-2 gap-2">
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder={t("আপনার নাম", "Your name")} maxLength={40} className="h-11 rounded-xl border border-line bg-panel px-3 text-[15px] text-ink outline-none placeholder:text-ink-3 focus:border-brand" />
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t("এলাকা / ঠিকানা", "Area")} maxLength={40} className="h-11 rounded-xl border border-line bg-panel px-3 text-[15px] text-ink outline-none placeholder:text-ink-3 focus:border-brand" />
            </div>
            <button onClick={asNamed} disabled={!name.trim()} className="mt-2 h-11 w-full rounded-xl bg-brand text-[15px] font-medium text-white transition disabled:opacity-40">
              {t("চালিয়ে যান", "Continue")}
            </button>
            <button onClick={asAnon} className="mt-1 flex h-10 w-full items-center justify-center gap-1.5 text-sm text-ink-2 hover:text-brand">
              <UserX className="h-4 w-4" />
              {t("অপরিচিত হিসেবে মেসেজ করুন", "Message anonymously")}
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="scroll-hide -mx-1 flex gap-1.5 overflow-x-auto px-1">
              {QUICK.map((q) => (
                <button key={q} type="button" disabled={sending} onClick={() => send(q)} className="shrink-0 rounded-full border border-line bg-panel px-3 py-1 text-[13px] text-ink-2 transition hover:border-brand/40 hover:text-brand disabled:opacity-40">
                  {q}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(text);
              }}
              className="flex items-center gap-2"
            >
              <input autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder={t("মন্তব্য লিখুন…", "Write a comment…")} maxLength={500} className="h-11 min-w-0 flex-1 rounded-full border border-line bg-panel px-4 text-[15px] text-ink outline-none placeholder:text-ink-3 focus:border-brand" />
              <button type="submit" disabled={!text.trim() || sending} aria-label={t("পাঠান", "Send")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white transition active:scale-95 disabled:opacity-40">
                <Send className="h-[18px] w-[18px] rtl:-scale-x-100" />
              </button>
            </form>
          </motion.div>
        )}
        {err && <p className="mt-2 text-xs text-live">{err}</p>}
      </div>
    </div>
  );
}

/** One chat bubble. Double-click / long-press opens the reaction picker. */
function Bubble({
  m,
  mine,
  myReaction,
  depth,
  pickerOpen,
  canReact,
  onPicker,
  onReact,
  lang,
}: {
  m: ChatMessage;
  mine: boolean;
  myReaction?: string;
  depth: number;
  pickerOpen: boolean;
  canReact: boolean;
  onPicker: (open: boolean) => void;
  onReact: (emoji: string) => void;
  lang: Parameters<typeof num>[1];
}) {
  const press = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelPress = () => {
    if (press.current) clearTimeout(press.current);
    press.current = null;
  };
  const fade = Math.max(0, depth - CRISP);
  const tallies = Object.entries(m.reactions ?? {}).filter(([, n]) => n > 0);

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(4px)" }}
      animate={{ opacity: Math.max(0.2, 1 - fade * 0.22), y: 0, scale: 1 - fade * 0.02, filter: `blur(${Math.max(0, fade - 1) * 1.1}px)` }}
      exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.4 } }}
      transition={{ type: "spring", stiffness: 240, damping: 26 }}
      className={cn("group flex items-end gap-2", mine ? "origin-bottom-right flex-row-reverse" : "origin-bottom-left")}
    >
      {!mine && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white" style={{ background: m.isAdmin ? "var(--gold)" : toneFor(m.user || "?") }}>
          {m.isAdmin ? <ShieldCheck className="h-4 w-4" /> : (m.user || "?").trim().charAt(0).toUpperCase()}
        </span>
      )}

      <div className={cn("relative flex max-w-[84%] flex-col", mine ? "items-end" : "items-start")}>
        <AnimatePresence>
          {pickerOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              data-react-ui
              className={cn("absolute -top-12 z-10 flex gap-0.5 rounded-full border border-line bg-panel p-1 shadow-[var(--shadow-float)]", mine ? "end-0" : "start-0")}
            >
              {REACTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => onReact(e)}
                  className={cn("flex h-9 w-9 items-center justify-center rounded-full text-xl transition hover:scale-125", myReaction === e && "bg-brand-soft")}
                  aria-label={e}
                >
                  {e}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-1">
          <div
            data-react-ui
            onDoubleClick={() => canReact && onPicker(!pickerOpen)}
            onPointerDown={() => {
              if (!canReact) return;
              cancelPress();
              press.current = setTimeout(() => onPicker(true), 450);
            }}
            onPointerUp={cancelPress}
            onPointerLeave={cancelPress}
            onPointerMove={(e) => (Math.abs(e.movementY) > 3 ? cancelPress() : undefined)}
            onContextMenu={(e) => canReact && e.preventDefault()}
            className={cn(
              "rounded-2xl border px-3 py-1.5 select-none",
              mine ? "rounded-ee-md border-transparent bg-brand text-white" : m.isAdmin ? "rounded-es-md border-gold/30 bg-gold-soft" : "rounded-es-md border-line bg-panel",
            )}
          >
            {!mine && (
              <p className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-2">
                {m.user || "Anonymous"}
                {m.location && (
                  <span className="flex items-center gap-0.5 font-normal text-ink-3">
                    <MapPin className="h-3 w-3" />
                    {m.location}
                  </span>
                )}
              </p>
            )}
            <p className={cn("text-[15px] leading-snug break-words", mine ? "text-white" : "text-ink")}>{m.message}</p>
          </div>
          {canReact && (
            <button
              data-react-ui
              onClick={() => onPicker(!pickerOpen)}
              aria-label="React"
              className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-3 opacity-0 transition group-hover:opacity-100 hover:bg-panel-2 hover:text-brand sm:flex"
            >
              <SmilePlus className="h-4 w-4" />
            </button>
          )}
        </div>

        {tallies.length > 0 && (
          <div className={cn("-mt-1.5 flex flex-wrap gap-1", mine ? "me-2" : "ms-2")}>
            {tallies.map(([e, n]) => (
              <button
                key={e}
                onClick={() => canReact && onReact(e)}
                className={cn(
                  "flex h-6 items-center gap-0.5 rounded-full border bg-panel px-1.5 text-[12px] shadow-sm transition",
                  myReaction === e ? "border-brand/50 bg-brand-soft text-brand" : "border-line text-ink-2",
                )}
              >
                <span className="text-[13px]">{e}</span>
                {n > 1 && <span className="font-num">{num(n, lang)}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
