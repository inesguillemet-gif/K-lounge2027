import React, { useMemo, useState } from 'react';
import {
  Check,
  Mic,
  Minus,
  Plus,
  Search,
  Send,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  FaqCategory,
  VOICE_COMMAND_PRESETS,
} from '../data/kloungeData';
import { AgentChatMessage, SiteTab } from '../types/klounge';

interface FaqAndAgentSectionProps {
  mode: 'agent' | 'faq';
  messages: AgentChatMessage[];
  isSending: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  recordingSeconds: number;
  voiceRepliesEnabled: boolean;
  onToggleVoiceReplies: (enabled: boolean) => void;
  speakingMessageId: string | null;
  voiceError: string | null;
  onSendCommand: (text: string, via?: 'voice' | 'text') => void;
  onToggleRecording: () => void;
  onSpeakText: (messageId: string, text: string) => void;
  onStopAudio: () => void;
  onSelectTab: (tab: SiteTab, sectionId?: string) => void;
}

export const FaqAndAgentSection: React.FC<FaqAndAgentSectionProps> = ({
  mode,
  messages,
  isSending,
  isRecording,
  isTranscribing,
  recordingSeconds,
  voiceRepliesEnabled,
  onToggleVoiceReplies,
  speakingMessageId,
  voiceError,
  onSendCommand,
  onToggleRecording,
  onSpeakText,
  onStopAudio,
  onSelectTab,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<FaqCategory>('All');
  const [faqQuery, setFaqQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  const filteredFaq = useMemo(() => {
    const q = faqQuery.trim().toLowerCase();
    return FAQ_ITEMS.filter((item) => {
      const catOk = selectedFaqCategory === 'All' || item.category === selectedFaqCategory;
      const queryOk =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return catOk && queryOk;
    });
  }, [faqQuery, selectedFaqCategory]);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendCommand(inputText, 'text');
    setInputText('');
  };

  const formattedTimer = `0:${String(recordingSeconds).padStart(2, '0')}`;

  return (
    <div>
      {/* Voice-Enabled MY PERSONAL AGENT */}
      {mode === 'agent' && (
        <section id="personal-agent" className="scroll-mt-20 bg-[#F7F9FB] py-14 md:py-20">
          <div className="mx-auto max-w-[1280px] px-5 md:px-7">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#14203F]/12 pb-6">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#233F7A]">
                  MY PERSONAL AGENT{' '}
                  <span className="font-kr ml-1.5 font-semibold tracking-normal">나만의 AI 에이전트</span>
                </div>
                <h1 className="font-display mt-3 text-[clamp(2rem,4vw,3.2rem)] text-[#14203F]">
                  Ask by voice or steer the site{' '}
                  <em className="italic text-[#233F7A]">hands-free.</em>
                </h1>
                <p className="mt-2.5 max-w-[58ch] text-[15px] text-[#56637E]">
                  Speak in English, French, or Korean to get skincare &amp; pop-up answers or
                  trigger instant actions: open tabs, reserve discounted items, or book your free
                  diagnosis.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onSelectTab('faq', 'faq')}
                  className="inline-flex shrink-0 items-center rounded-full border border-[#14203F]/18 bg-white px-4 py-2 text-[13px] font-semibold text-[#14203F] hover:border-[#233F7A]"
                >
                  Browse FAQ
                </button>
                <button
                  type="button"
                  onClick={() => onToggleVoiceReplies(!voiceRepliesEnabled)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
                    voiceRepliesEnabled
                      ? 'border-[#233F7A] bg-[#233F7A] text-white'
                      : 'border-[#14203F]/18 bg-white text-[#14203F] hover:border-[#233F7A]'
                  }`}
                >
                  {voiceRepliesEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-[#56637E]" />
                  )}
                  <span>Spoken replies: {voiceRepliesEnabled ? 'On' : 'Off'}</span>
                </button>
              </div>
            </div>

          <div className="mt-8 grid items-start gap-7 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Left: Voice & Chat Terminal */}
            <div className="overflow-hidden rounded-lg border border-[#14203F]/14 bg-white">
              {/* Top Mic Control Strip */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#14203F]/10 bg-[#E7EDF4]/70 px-5 py-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onToggleRecording}
                    disabled={isTranscribing || isSending}
                    aria-label={
                      isRecording ? 'Stop voice recording and send' : 'Start voice command'
                    }
                    className={`inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition-colors disabled:opacity-50 ${
                      isRecording
                        ? 'bg-[#B42318] text-white hover:bg-[#912018]'
                        : 'bg-[#14203F] text-white hover:bg-[#233F7A]'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <Square className="h-3.5 w-3.5 fill-current" />
                        <span>Stop &amp; Send ({formattedTimer})</span>
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4" />
                        <span>
                          {isTranscribing
                            ? 'Transcribing speech...'
                            : isSending
                              ? 'Thinking...'
                              : 'Speak a command'}
                        </span>
                      </>
                    )}
                  </button>

                  {isRecording && (
                    <span className="text-[12.5px] font-semibold text-[#B42318] tabular-nums">
                      Listening — tap Stop when finished
                    </span>
                  )}
                  {!isRecording && !isTranscribing && !isSending && (
                    <span className="hidden text-[12.5px] text-[#56637E] sm:inline">
                      Supports English, Français &amp; 한국어
                    </span>
                  )}
                </div>

                {speakingMessageId && (
                  <button
                    type="button"
                    onClick={onStopAudio}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#14203F]/20 bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#14203F] hover:border-[#233F7A]"
                  >
                    <VolumeX className="h-3.5 w-3.5 text-[#233F7A]" />
                    Stop audio
                  </button>
                )}
              </div>

              {/* Conversation Transcript */}
              <div
                className="grid max-h-[380px] gap-4 overflow-y-auto p-5"
                aria-live="polite"
                aria-label="K-Lounge AI conversation history"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-lg px-4 py-3 text-[14.5px] leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#233F7A] text-white'
                          : msg.isError
                            ? 'border border-[#B42318]/30 bg-[#FEF3F2] text-[#912018]'
                            : 'border border-[#14203F]/10 bg-[#F7F9FB] text-[#14203F]'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {msg.actionSummary && (
                        <div className="mt-2.5 flex items-center gap-1.5 border-t border-[#14203F]/10 pt-2 text-[12px] font-semibold text-[#233F7A]">
                          <Check className="h-3.5 w-3.5 shrink-0" />
                          <span>{msg.actionSummary}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-1 flex items-center gap-2.5 px-1 text-[11px] font-medium text-[#56637E] tabular-nums">
                      <span>
                        {msg.role === 'user' ? 'You' : 'K-Lounge Concierge'}
                        {msg.via === 'voice' ? ' · Voice' : ''} · {msg.timestamp}
                      </span>
                      {msg.role === 'model' && !msg.isError && (
                        <button
                          type="button"
                          onClick={() =>
                            speakingMessageId === msg.id
                              ? onStopAudio()
                              : onSpeakText(msg.id, msg.text)
                          }
                          className="inline-flex items-center gap-1 font-semibold text-[#233F7A] hover:underline"
                        >
                          <Volume2 className="h-3 w-3" />
                          {speakingMessageId === msg.id ? 'Playing...' : 'Listen'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {(isTranscribing || isSending) && (
                  <div className="text-[13px] font-medium text-[#56637E]">
                    {isTranscribing
                      ? 'Transcribing your voice command...'
                      : 'Consulting K-Lounge Concierge...'}
                  </div>
                )}
              </div>

              {voiceError && (
                <div
                  className="mx-5 mb-3 rounded-md border border-[#B42318]/25 bg-[#FEF3F2] px-4 py-2.5 text-[13px] font-medium text-[#912018]"
                  role="alert"
                >
                  {voiceError}
                </div>
              )}

              {/* Text Command / Question Input */}
              <form
                onSubmit={handleSubmitForm}
                className="flex items-center gap-2.5 border-t border-[#14203F]/10 bg-[#F7F9FB] p-4"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a question or command (e.g. 'Add AESTURA cream to my bag')"
                  aria-label="Ask a question or enter a command"
                  className="flex-1 rounded-full border border-[#14203F]/18 bg-white px-4 py-2.5 text-[14px] text-[#14203F] placeholder:text-[#56637E] focus:border-[#233F7A] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSending || !inputText.trim()}
                  aria-label="Send message"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#233F7A] px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#14203F] disabled:opacity-45"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>

            {/* Right: Vocal Command Guide & Instant Triggers */}
            <aside className="grid gap-4 rounded-lg border border-[#14203F]/14 bg-white p-6">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#233F7A]">
                  Try saying or tapping
                </div>
                <h2 className="font-display mt-1.5 text-[1.5rem] text-[#14203F]">
                  Quick vocal commands &amp; prompts
                </h2>
                <p className="mt-1 text-[13.5px] text-[#56637E]">
                  Use the microphone above—or test any command below—to trigger actions or answer
                  K-Lounge pop-up questions immediately.
                </p>
              </div>

              <div className="grid gap-2.5">
                {VOICE_COMMAND_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    disabled={isSending || isTranscribing}
                    onClick={() => onSendCommand(preset.prompt, 'text')}
                    className="group flex flex-col items-start rounded-md border border-[#14203F]/12 bg-[#F7F9FB] px-4 py-3 text-left transition-colors hover:border-[#233F7A] hover:bg-white disabled:opacity-50"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                      {preset.kind === 'command' ? 'Voice Command' : 'Pop-Up Question'} ·{' '}
                      {preset.label}
                    </span>
                    <span className="mt-0.5 text-[13.5px] font-medium text-[#14203F]">
                      “{preset.prompt}”
                    </span>
                  </button>
                ))}
              </div>

              <div className="border-t border-[#14203F]/10 pt-4 text-[13px] text-[#56637E]">
                Tip: You can also launch <strong className="text-[#14203F]">MY PERSONAL AGENT</strong>{' '}
                from the bottom-right corner button at any time while browsing other tabs.
              </div>
            </aside>
          </div>
        </div>
      </section>
      )}

      {/* Searchable FAQ Accordion */}
      {mode === 'faq' && (
        <section id="faq" className="scroll-mt-20 border-t border-[#14203F]/10 bg-white py-16 md:py-20">
          <div className="mx-auto max-w-[1280px] px-5 md:px-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#233F7A]">
                  Frequently Asked Questions{' '}
                  <span className="font-kr ml-1.5 font-semibold tracking-normal">자주 묻는 질문</span>
                </div>
                <h1 className="font-display mt-3 text-[clamp(2rem,3.8vw,3rem)] text-[#14203F]">
                  Everything about the <em className="italic text-[#233F7A]">2-week Paris</em>{' '}
                  pop-up.
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-[270px] sm:flex-none">
                  <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#56637E]" />
                  <input
                    type="search"
                    value={faqQuery}
                    onChange={(e) => setFaqQuery(e.target.value)}
                    placeholder="Filter FAQ keywords..."
                    aria-label="Filter FAQ questions"
                    className="w-full rounded-full border border-[#14203F]/18 bg-[#F7F9FB] py-2.5 pr-4 pl-10 text-[13.5px] text-[#14203F] placeholder:text-[#56637E] focus:border-[#233F7A] focus:bg-white focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onSelectTab('agent', 'personal-agent')}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#233F7A] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#14203F]"
                >
                  <Mic className="h-3.5 w-3.5" />
                  <span>Ask MY PERSONAL AGENT</span>
                </button>
              </div>
            </div>

          {/* FAQ Category Filter Controls */}
          <div
            className="mt-6 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter FAQ by category"
          >
            {FAQ_CATEGORIES.map((category) => {
              const active = selectedFaqCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedFaqCategory(category)}
                  className={`whitespace-nowrap rounded-md px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                    active
                      ? 'bg-[#14203F] text-white'
                      : 'border border-[#14203F]/15 bg-[#F7F9FB] text-[#14203F] hover:border-[#233F7A]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Accordion List */}
          <div className="mt-8 grid gap-3">
            {filteredFaq.length === 0 ? (
              <div className="rounded-md border border-[#14203F]/12 bg-[#F7F9FB] p-8 text-center text-[14.5px] text-[#56637E]">
                No FAQ entries match “{faqQuery}”. Ask the AI Concierge above by voice or text for an
                instant custom answer.
              </div>
            ) : (
              filteredFaq.map((item, idx) => {
                const isOpen = openFaqId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-md border transition-colors ${
                      isOpen
                        ? 'border-[#233F7A] bg-[#F7F9FB]'
                        : 'border-[#14203F]/12 bg-white hover:border-[#14203F]/28'
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left"
                    >
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#56637E] tabular-nums">
                          {String(idx + 1).padStart(2, '0')} · {item.category}
                        </div>
                        <div className="mt-1 text-[16px] font-semibold text-[#14203F]">
                          {item.question}
                        </div>
                      </div>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                          isOpen
                            ? 'border-[#233F7A] bg-[#233F7A] text-white'
                            : 'border-[#14203F]/18 bg-white text-[#14203F]'
                        }`}
                        aria-hidden="true"
                      >
                        {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="border-t border-[#14203F]/10 px-5 py-4 text-[14.5px] leading-relaxed text-[#14203F]/85">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
      )}
    </div>
  );
};
