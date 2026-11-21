import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AgentActionPayload,
  AgentChatMessage,
  SiteTab,
} from '../types/klounge';

interface UseVoiceAgentOptions {
  activeTab: SiteTab;
  quizProfile: string | null;
  cyclePhase: string | null;
  bagCount: number;
  onSelectTab: (tab: SiteTab, sectionId?: string) => void;
  onAddProduct: (id: string) => void;
  onOpenProduct: (id: string) => void;
  onOpenBook: () => void;
  onOpenAppModal: () => void;
  onOpenBag: () => void;
  onToast: (msg: string) => void;
}

const VALID_TABS: SiteTab[] = [
  'popup',
  'products',
  'passport',
  'quiz',
  'app',
  'games',
  'visit',
  'faq',
  'agent',
];

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Could not read recorded audio.'));
    reader.readAsDataURL(blob);
  });
}

function nowTimeLabel(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function useVoiceAgent({
  activeTab,
  quizProfile,
  cyclePhase,
  bagCount,
  onSelectTab,
  onAddProduct,
  onOpenProduct,
  onOpenBook,
  onOpenAppModal,
  onOpenBag,
  onToast,
}: UseVoiceAgentOptions) {
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Bonjour! I am your K-Lounge Paris AI Concierge. Ask any FAQ question or use Vocal Command to open tabs, reserve discounted K-beauty drops, or book a free skin diagnosis.',
      via: 'text',
      timestamp: nowTimeLabel(),
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceRepliesEnabled, setVoiceRepliesEnabled] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudioPlayback = useCallback(() => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    setSpeakingMessageId(null);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
    };
  }, []);

  const speakText = useCallback(
    async (messageId: string, text: string) => {
      if (!text.trim()) return;
      stopAudioPlayback();
      setSpeakingMessageId(messageId);
      try {
        const res = await fetch('/api/agent/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        const data = (await res.json()) as {
          audioBase64?: string;
          mimeType?: string;
          error?: string;
        };
        if (!res.ok || !data.audioBase64) {
          throw new Error(data.error || 'Voice playback unavailable');
        }
        const audio = new Audio(
          `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`
        );
        activeAudioRef.current = audio;
        audio.onended = () => {
          setSpeakingMessageId((curr) => (curr === messageId ? null : curr));
        };
        audio.onerror = () => {
          setSpeakingMessageId((curr) => (curr === messageId ? null : curr));
        };
        await audio.play();
      } catch (err) {
        setSpeakingMessageId(null);
        const msg = err instanceof Error ? err.message : 'Unable to play voice reply.';
        setVoiceError(msg);
      }
    },
    [stopAudioPlayback]
  );

  const executeAction = useCallback(
    (payload: AgentActionPayload) => {
      switch (payload.action) {
        case 'NAVIGATE_TAB': {
          const target = payload.tabId;
          if (target && VALID_TABS.includes(target)) {
            onSelectTab(target);
          }
          break;
        }
        case 'OPEN_CYCLE_TRACKER':
          onSelectTab('app', 'cycle-sync');
          break;
        case 'START_QUIZ':
          onSelectTab('quiz', 'quiz');
          break;
        case 'OPEN_BOOKING':
          onOpenBook();
          break;
        case 'OPEN_APP_PASS':
          onOpenAppModal();
          break;
        case 'OPEN_BAG':
          onOpenBag();
          break;
        case 'ADD_PRODUCT':
          if (payload.productId) {
            onAddProduct(payload.productId);
          }
          break;
        case 'OPEN_PRODUCT':
          if (payload.productId) {
            onOpenProduct(payload.productId);
          }
          break;
        case 'NONE':
        default:
          break;
      }
      if (payload.action !== 'NONE' && payload.actionSummary) {
        onToast(payload.actionSummary);
      }
    },
    [
      onAddProduct,
      onOpenAppModal,
      onOpenBag,
      onOpenBook,
      onOpenProduct,
      onSelectTab,
      onToast,
    ]
  );

  const sendCommand = useCallback(
    async (promptText: string, via: 'voice' | 'text' = 'text') => {
      const cleaned = promptText.trim();
      if (!cleaned || isSending) return;

      setVoiceError(null);
      const userMsg: AgentChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        text: cleaned,
        via,
        timestamp: nowTimeLabel(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsSending(true);

      try {
        const history = messages.slice(-6).map((m) => ({
          role: m.role,
          text: m.text,
        }));

        const res = await fetch('/api/agent/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: cleaned,
            history,
            context: {
              activeTab,
              quizProfile,
              cyclePhase,
              bagCount,
            },
          }),
        });

        const data = (await res.json()) as Partial<AgentActionPayload> & {
          error?: string;
        };
        if (!res.ok) {
          throw new Error(data.error || 'AI concierge request failed.');
        }

        const payload: AgentActionPayload = {
          reply: data.reply || 'Here is what I found for K-Lounge Paris.',
          action: data.action || 'NONE',
          tabId: data.tabId,
          productId: data.productId,
          actionSummary: data.actionSummary,
        };

        const aiMsgId = `m-${Date.now()}`;
        const aiMsg: AgentChatMessage = {
          id: aiMsgId,
          role: 'model',
          text: payload.reply,
          via,
          actionSummary: payload.action !== 'NONE' ? payload.actionSummary : undefined,
          timestamp: nowTimeLabel(),
        };
        setMessages((prev) => [...prev, aiMsg]);

        executeAction(payload);

        if (voiceRepliesEnabled && via === 'voice') {
          void speakText(aiMsgId, payload.reply);
        }
      } catch (err) {
        const errorText =
          err instanceof Error
            ? err.message
            : 'Unable to reach the K-Lounge AI Concierge.';
        setVoiceError(errorText);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'model',
            text: errorText,
            isError: true,
            timestamp: nowTimeLabel(),
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [
      activeTab,
      bagCount,
      cyclePhase,
      executeAction,
      isSending,
      messages,
      quizProfile,
      speakText,
      voiceRepliesEnabled,
    ]
  );

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    if (isRecording || isTranscribing || isSending) return;
    setVoiceError(null);
    stopAudioPlayback();

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setVoiceError(
        'Microphone capture is not supported in this browser. Type your command below.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const preferredTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
      const supportedMime =
        preferredTypes.find((type) => MediaRecorder.isTypeSupported(type)) || '';

      const recorder = supportedMime
        ? new MediaRecorder(stream, { mimeType: supportedMime })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;

        const mimeType = (recorder.mimeType || 'audio/webm').split(';')[0];
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        audioChunksRef.current = [];

        if (audioBlob.size < 400) {
          setVoiceError('Recording was too short. Hold or speak clearly and try again.');
          return;
        }

        setIsTranscribing(true);
        try {
          const audioBase64 = await blobToBase64(audioBlob);
          const res = await fetch('/api/agent/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioBase64, mimeType }),
          });
          const data = (await res.json()) as { transcript?: string; error?: string };
          if (!res.ok) {
            throw new Error(data.error || 'Voice transcription failed.');
          }
          const transcript = (data.transcript ?? '').trim();
          if (!transcript) {
            setVoiceError('No speech detected. Please speak closer to your microphone.');
            return;
          }
          await sendCommand(transcript, 'voice');
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Unable to transcribe audio.';
          setVoiceError(msg);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecordingSeconds(0);
      setIsRecording(true);
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Microphone access denied. Enable microphone permission in your browser.';
      setVoiceError(msg);
      setIsRecording(false);
    }
  }, [isRecording, isSending, isTranscribing, sendCommand, stopAudioPlayback]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      void startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return {
    messages,
    isSending,
    isRecording,
    isTranscribing,
    recordingSeconds,
    voiceRepliesEnabled,
    setVoiceRepliesEnabled,
    speakingMessageId,
    voiceError,
    sendCommand,
    toggleRecording,
    speakText,
    stopAudioPlayback,
  };
}
