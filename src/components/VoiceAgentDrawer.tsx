import React, { useState } from 'react';
import { Check, Mic, Send, Square, Volume2, VolumeX, X } from 'lucide-react';
import { AgentChatMessage, SiteTab } from '../types/klounge';

interface VoiceAgentDrawerProps {
  messages: AgentChatMessage[];
  isSending: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  recordingSeconds: number;
  voiceRepliesEnabled: boolean;
  onToggleVoiceReplies: (enabled: boolean) => void;
  voiceError: string | null;
  onSendCommand: (text: string, via?: 'voice' | 'text') => void;
  onToggleRecording: () => void;
  onOpenFullFaqTab: (tab: SiteTab, sectionId?: string) => void;
}

export const VoiceAgentDrawer: React.FC<VoiceAgentDrawerProps> = ({
  messages,
  isSending,
  isRecording,
  isTranscribing,
  recordingSeconds,
  voiceRepliesEnabled,
  onToggleVoiceReplies,
  voiceError,
  onSendCommand,
  onToggleRecording,
  onOpenFullFaqTab,
}) => {
  const [open, setOpen] = useState(false);
  const [quickInput, setQuickInput] = useState('');

  const latestModelMessage = [...messages].reverse().find((m) => m.role === 'model');
  const latestUserMessage = [...messages].reverse().find((m) => m.role === 'user');
  const formattedTimer = `0:${String(recordingSeconds).padStart(2, '0')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onSendCommand(quickInput, 'text');
    setQuickInput('');
  };

  return (
    <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
      {open && (
        <div
          className="mb-3 w-[min(370px,calc(100vw-2rem))] overflow-hidden rounded-lg border border-[#14203F]/18 bg-white shadow-[0_18px_45px_rgba(20,32,63,0.18)]"
          role="dialog"
          aria-label="K-Lounge Quick Voice AI Concierge"
        >
          <div className="flex items-center justify-between gap-2 bg-[#14203F] px-4 py-3 text-white">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9FB4D6]">
                MY PERSONAL AGENT
              </div>
              <div className="text-[13.5px] font-semibold">Vocal Command &amp; K-Beauty Guide</div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onToggleVoiceReplies(!voiceRepliesEnabled)}
                aria-label={voiceRepliesEnabled ? 'Mute voice replies' : 'Enable voice replies'}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                {voiceRepliesEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4 text-white/60" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close voice concierge"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-3 p-4">
            {/* Voice Button */}
            <button
              type="button"
              onClick={onToggleRecording}
              disabled={isTranscribing || isSending}
              className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-semibold transition-colors disabled:opacity-50 ${
                isRecording
                  ? 'bg-[#B42318] text-white'
                  : 'bg-[#233F7A] text-white hover:bg-[#14203F]'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="h-3.5 w-3.5 fill-current" />
                  <span className="tabular-nums">Stop &amp; Send ({formattedTimer})</span>
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  <span>
                    {isTranscribing
                      ? 'Transcribing...'
                      : isSending
                        ? 'Processing...'
                        : 'Speak a voice command'}
                  </span>
                </>
              )}
            </button>

            {latestUserMessage && (
              <div className="text-right text-[12.5px] text-[#56637E]">
                “{latestUserMessage.text}”
              </div>
            )}

            {latestModelMessage && (
              <div
                className={`rounded-md border p-3 text-[13.5px] leading-relaxed ${
                  latestModelMessage.isError
                    ? 'border-[#B42318]/25 bg-[#FEF3F2] text-[#912018]'
                    : 'border-[#14203F]/10 bg-[#F7F9FB] text-[#14203F]'
                }`}
              >
                <p>{latestModelMessage.text}</p>
                {latestModelMessage.actionSummary && (
                  <div className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#233F7A]">
                    <Check className="h-3.5 w-3.5" />
                    <span>{latestModelMessage.actionSummary}</span>
                  </div>
                )}
              </div>
            )}

            {voiceError && (
              <div className="text-[12px] font-medium text-[#B42318]" role="alert">
                {voiceError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Ask or command..."
                aria-label="Quick command input"
                className="min-w-0 flex-1 rounded-full border border-[#14203F]/18 bg-[#F7F9FB] px-3.5 py-2 text-[13px] text-[#14203F] placeholder:text-[#56637E] focus:border-[#233F7A] focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSending || !quickInput.trim()}
                aria-label="Send quick command"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#14203F] text-white hover:bg-[#233F7A] disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            <div className="flex items-center justify-between border-t border-[#14203F]/10 pt-2.5 text-[12px]">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenFullFaqTab('agent', 'personal-agent');
                }}
                className="font-semibold text-[#233F7A] hover:underline"
              >
                Open MY PERSONAL AGENT tab
              </button>
              <span className="text-[#56637E]">EN · FR · KR</span>
            </div>
          </div>
        </div>
      )}

      {/* Single Compact Floating MY PERSONAL AGENT Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? 'Minimize MY PERSONAL AGENT' : 'Open MY PERSONAL AGENT'}
        className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#14203F] px-4 py-3 text-[13px] font-semibold text-white shadow-[0_10px_28px_rgba(20,32,63,0.28)] transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[#233F7A]"
      >
        <Mic className={`h-4 w-4 ${isRecording ? 'text-[#FCA5A5]' : 'text-[#9CC2FF]'}`} />
        <span>{isRecording ? `Listening ${formattedTimer}` : 'MY PERSONAL AGENT'}</span>
      </button>
    </div>
  );
};
