import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Sparkles, Send, X, Instagram, MessageCircle, Loader2, Bot } from 'lucide-react';
import { SiteSettings, Ministry, ChurchEvent } from '../types';
import { streamGemini, type GeminiTurn } from '../lib/gemini';
import { buildAssistantSystem, ASSISTANT_SUGGESTIONS } from '../lib/assistantContext';

interface ChurchAssistantProps {
  settings: SiteSettings;
  ministries: Ministry[];
  events: ChurchEvent[];
  onOpenWhatsApp?: () => void;
}

interface Msg {
  role: 'user' | 'model';
  text: string;
}

export const ChurchAssistant: React.FC<ChurchAssistantProps> = ({
  settings,
  ministries,
  events,
  onOpenWhatsApp,
}) => {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const welcome = `Olá! 👋 Sou a Ana, assistente da ${settings.churchName || 'AD Barravento'}. Posso ajudar com horários, endereço, departamentos e como baixar as fotos. O que você gostaria de saber?`;

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  useEffect(() => {
    if (open) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open, messages, busy, scrollToBottom]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;
      setError(null);
      setInput('');

      const history = [...messages, { role: 'user' as const, text }];
      setMessages([...history, { role: 'model', text: '' }]);
      setBusy(true);

      const turns: GeminiTurn[] = history.map((m) => ({ role: m.role, text: m.text }));
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        let acc = '';
        for await (const chunk of streamGemini(turns, {
          system: buildAssistantSystem(settings, ministries, events),
          model: 'gemini-flash-lite-latest',
          temperature: 0.6,
          maxOutputTokens: 512,
          signal: controller.signal,
        })) {
          acc += chunk;
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { role: 'model', text: acc };
            return next;
          });
        }
        if (!acc.trim()) {
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
              role: 'model',
              text: 'Desculpe, não consegui responder agora. Tente reformular ou fale com a igreja pelo Instagram.',
            };
            return next;
          });
        }
      } catch (e) {
        if ((e as Error)?.name !== 'AbortError') {
          setError('Tive um problema para responder. Tente novamente em instantes.');
          setMessages((prev) => prev.slice(0, -1));
        }
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, messages, settings, ministries, events]
  );

  const igHref = `https://instagram.com/${(settings.instagram || 'ad_barravento').replace('@', '')}`;

  return (
    <>
      {/* Floating trigger */}
      <button
        id="assistant-fab"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Fechar assistente' : 'Abrir assistente da igreja'}
        className="group fixed bottom-24 right-4 sm:bottom-28 sm:right-6 z-40 flex items-center gap-2.5 rounded-full bg-gradient-flame text-white pl-3.5 pr-4 py-3 shadow-warm animate-pulse-ring transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 min-h-[52px]"
      >
        {open ? (
          <X className="w-5 h-5" />
        ) : (
          <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
        )}
        <span className="text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap">
          {open ? 'Fechar' : 'Assistente IA'}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              role="dialog"
              aria-label="Assistente da igreja"
              className="fixed z-50 flex flex-col overflow-hidden bg-surface border border-line shadow-warm
                         inset-x-3 bottom-3 top-20 rounded-3xl
                         sm:inset-auto sm:bottom-28 sm:right-6 sm:top-auto sm:w-[400px] sm:h-[560px]"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header */}
              <div className="relative shrink-0 bg-gradient-night text-white px-5 py-4 flex items-center gap-3">
                <div className="absolute -top-10 -right-6 w-32 h-32 bg-flame/30 blur-3xl rounded-full pointer-events-none" />
                <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 border border-white/15">
                  <Bot className="w-6 h-6 text-gold-bright" />
                </div>
                <div className="relative flex-1 min-w-0">
                  <p className="font-heading font-bold text-base leading-tight">Assistente da Igreja</p>
                  <p className="text-xs text-cream/70 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Online • respostas por IA
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Fechar"
                  className="relative p-2 rounded-xl text-cream/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-canvas">
                {/* Welcome bubble */}
                <div className="flex gap-2.5">
                  <Avatar />
                  <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-elevate border border-line px-3.5 py-2.5 text-sm text-fg leading-relaxed">
                    {welcome}
                  </div>
                </div>

                {messages.length === 0 && (
                  <div className="pt-1 flex flex-wrap gap-2">
                    {ASSISTANT_SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full border border-line bg-surface text-muted hover:text-terracotta dark:hover:text-gold hover:border-brand/40 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {messages.map((m, i) =>
                  m.role === 'user' ? (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-[82%] rounded-2xl rounded-tr-md bg-gradient-flame text-white px-3.5 py-2.5 text-sm leading-relaxed shadow-sm">
                        {m.text}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex gap-2.5">
                      <Avatar />
                      <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-elevate border border-line px-3.5 py-2.5 text-sm text-fg leading-relaxed whitespace-pre-wrap">
                        {m.text || (busy && i === messages.length - 1 ? <TypingDots /> : '')}
                      </div>
                    </div>
                  )
                )}

                {error && (
                  <p className="text-xs text-terracotta dark:text-gold text-center py-1">{error}</p>
                )}
              </div>

              {/* Composer */}
              <div className="shrink-0 border-t border-line bg-surface px-3 py-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex items-end gap-2"
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escreva sua pergunta..."
                    disabled={busy}
                    className="flex-1 rounded-2xl border border-line bg-canvas px-4 py-2.5 text-sm text-fg placeholder:text-subtle focus:outline-none focus:border-brand/50 disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={busy || !input.trim()}
                    aria-label="Enviar"
                    className="shrink-0 h-11 w-11 rounded-2xl bg-gradient-flame text-white flex items-center justify-center shadow-glow disabled:opacity-40 disabled:shadow-none transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </form>

                <div className="mt-2 flex items-center justify-between px-1">
                  <span className="text-[10px] text-subtle">A IA pode errar. Confirme informações importantes.</span>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={igHref}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="p-1.5 rounded-lg text-subtle hover:text-terracotta dark:hover:text-gold hover:bg-elevate transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <button
                      onClick={onOpenWhatsApp}
                      aria-label="WhatsApp"
                      className="p-1.5 rounded-lg text-subtle hover:text-terracotta dark:hover:text-gold hover:bg-elevate transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const Avatar: React.FC = () => (
  <div className="shrink-0 mt-0.5 h-8 w-8 rounded-xl bg-gradient-flame text-white flex items-center justify-center shadow-glow">
    <Sparkles className="w-4 h-4" />
  </div>
);

const TypingDots: React.FC = () => (
  <span className="inline-flex items-center gap-1 py-1">
    <span className="w-1.5 h-1.5 rounded-full bg-subtle animate-bounce [animation-delay:-0.3s]" />
    <span className="w-1.5 h-1.5 rounded-full bg-subtle animate-bounce [animation-delay:-0.15s]" />
    <span className="w-1.5 h-1.5 rounded-full bg-subtle animate-bounce" />
  </span>
);
