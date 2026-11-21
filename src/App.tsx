import { useCallback, useEffect, useRef, useState } from 'react';
import { DiagnosisAndAppSection } from './components/DiagnosisAndAppSection';
import { FaqAndAgentSection } from './components/FaqAndAgentSection';
import { GamesAndPrizesSection } from './components/GamesAndPrizesSection';
import { ModalsAndDrawer } from './components/ModalsAndDrawer';
import { OpeningBannerAndHero } from './components/OpeningBannerAndHero';
import { PassportAndPerksSection } from './components/PassportAndPerksSection';
import { PopupGuideSection } from './components/PopupGuideSection';
import { ProductsSection } from './components/ProductsSection';
import { SiteFooter } from './components/SiteFooter';
import { SkinQuizSection } from './components/SkinQuizSection';
import { TopHeaderNav } from './components/TopHeaderNav';
import { VisitSection } from './components/VisitSection';
import { VoiceAgentDrawer } from './components/VoiceAgentDrawer';
import { ArcadePrize, PRODUCTS } from './data/kloungeData';
import { useVoiceAgent } from './hooks/useVoiceAgent';
import {
  AppPreviewTab,
  ClaimedPrize,
  CycleTrackingState,
  PassportProgress,
  QuizSubmission,
  SiteTab,
} from './types/klounge';

const STORAGE_POINTS_KEY = 'klounge_paris_glow_points_v1';
const STORAGE_PRIZES_KEY = 'klounge_paris_claimed_prizes_v1';
const STORAGE_QUIZ_KEY = 'klounge_paris_quiz_result_v1';
const STORAGE_PASSPORT_KEY = 'klounge_paris_passport_v1';
const STORAGE_CYCLE_KEY = 'klounge_paris_cycle_v1';

const DEFAULT_PASSPORT: PassportProgress = {
  mission1Done: false,
  mission2Done: false,
  mission3Done: false,
  socialHandle: '',
  tombolaTicket: null,
  tombolaPrize: null,
};

function defaultPeriodStartIso(): string {
  const dt = new Date();
  dt.setDate(dt.getDate() - 11); // Starts on Day 12 (Follicular Phase)
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getDefaultCycleState(): CycleTrackingState {
  const start = defaultPeriodStartIso();
  return {
    lastPeriodStart: start,
    cycleLength: 28,
    periodLength: 5,
    loggedDays: [start],
    symptomsToday: [],
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<SiteTab>('popup');
  const [bag, setBag] = useState<Record<string, number>>({});
  const [glowPoints, setGlowPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_POINTS_KEY);
      return saved ? Number(saved) : 100;
    } catch {
      return 100;
    }
  });
  const [claimedPrizes, setClaimedPrizes] = useState<ClaimedPrize[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PRIZES_KEY);
      return saved ? (JSON.parse(saved) as ClaimedPrize[]) : [];
    } catch {
      return [];
    }
  });
  const [quizResult, setQuizResult] = useState<QuizSubmission | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_QUIZ_KEY);
      return saved ? (JSON.parse(saved) as QuizSubmission) : null;
    } catch {
      return null;
    }
  });
  const [passport, setPassport] = useState<PassportProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PASSPORT_KEY);
      return saved ? (JSON.parse(saved) as PassportProgress) : DEFAULT_PASSPORT;
    } catch {
      return DEFAULT_PASSPORT;
    }
  });
  const [cycleState, setCycleState] = useState<CycleTrackingState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CYCLE_KEY);
      return saved ? (JSON.parse(saved) as CycleTrackingState) : getDefaultCycleState();
    } catch {
      return getDefaultCycleState();
    }
  });

  const [quizBonusAwarded, setQuizBonusAwarded] = useState<boolean>(() => Boolean(quizResult));
  const [activeAppTab, setActiveAppTab] = useState<AppPreviewTab>('cycle');

  // Modals & Drawers
  const [bookOpen, setBookOpen] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_POINTS_KEY, String(glowPoints));
    } catch {
      // Ignore storage error
    }
  }, [glowPoints]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PRIZES_KEY, JSON.stringify(claimedPrizes));
    } catch {
      // Ignore storage error
    }
  }, [claimedPrizes]);

  useEffect(() => {
    if (!quizResult) return;
    try {
      localStorage.setItem(STORAGE_QUIZ_KEY, JSON.stringify(quizResult));
    } catch {
      // Ignore storage error
    }
  }, [quizResult]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PASSPORT_KEY, JSON.stringify(passport));
    } catch {
      // Ignore storage error
    }
  }, [passport]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CYCLE_KEY, JSON.stringify(cycleState));
    } catch {
      // Ignore storage error
    }
  }, [cycleState]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMsg(null);
    }, 2600);
  }, []);

  const handleSelectTab = useCallback((tab: SiteTab, sectionId?: string) => {
    setActiveTab(tab);
    if (sectionId === 'cycle-sync') {
      setActiveAppTab('cycle');
    }
    if (sectionId) {
      window.setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 45);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleAddProduct = useCallback(
    (id: string) => {
      setBag((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
      const prod = PRODUCTS.find((p) => p.id === id);
      if (prod) {
        showToast(`${prod.name} added to your visit bag`);
      }
    },
    [showToast]
  );

  const handleAddRoutine = useCallback(
    (ids: string[]) => {
      setBag((prev) => {
        const next = { ...prev };
        ids.forEach((id) => {
          next[id] = (next[id] ?? 0) + 1;
        });
        return next;
      });
      setDrawerOpen(true);
      showToast('Full customized routine reserved in your visit bag');
    },
    [showToast]
  );

  const handleUpdateQty = useCallback((id: string, delta: number) => {
    setBag((prev) => {
      const nextQty = (prev[id] ?? 0) + delta;
      const next = { ...prev };
      if (nextQty <= 0) {
        delete next[id];
      } else {
        next[id] = nextQty;
      }
      return next;
    });
  }, []);

  const handleReserveBag = useCallback(() => {
    setBag({});
    setDrawerOpen(false);
    showToast('Selection reserved. Present your bag, Passport & prize codes at 10 rue Pastourelle!');
  }, [showToast]);

  const handleCompleteQuiz = useCallback(
    (submission: QuizSubmission) => {
      setQuizResult(submission);
      if (!quizBonusAwarded) {
        setQuizBonusAwarded(true);
        setGlowPoints((pts) => pts + 50);
        showToast('Skin Dossier ready · +50 Glow Points unlocked');
      } else {
        showToast('Skin Dossier updated');
      }
    },
    [quizBonusAwarded, showToast]
  );

  const handleEarnPoints = useCallback(
    (amount: number, reason: string) => {
      setGlowPoints((pts) => pts + amount);
      showToast(reason);
    },
    [showToast]
  );

  const handleClaimPrize = useCallback(
    (prize: ArcadePrize) => {
      if (glowPoints < prize.costPoints) {
        showToast(`Need ${prize.costPoints - glowPoints} more Glow Points`);
        return;
      }
      if (claimedPrizes.some((c) => c.prizeId === prize.id)) {
        showToast('Gift pass already unlocked');
        return;
      }
      const codeNum = Math.floor(1000 + Math.random() * 8999);
      const newClaim: ClaimedPrize = {
        prizeId: prize.id,
        title: prize.title,
        tier: prize.tier,
        detail: prize.detail,
        storeNote: prize.storeNote,
        code: `${prize.codePrefix}-${codeNum}`,
        claimedAt: new Date().toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
      };
      setGlowPoints((pts) => pts - prize.costPoints);
      setClaimedPrizes((prev) => [newClaim, ...prev]);
      showToast(`Unlocked ${prize.title} (${newClaim.code})`);
    },
    [claimedPrizes, glowPoints, showToast]
  );

  const handleCompleteMission1 = useCallback(
    (handle: string) => {
      setPassport((prev) => {
        const next: PassportProgress = {
          ...prev,
          mission1Done: true,
          socialHandle: handle,
        };
        if (next.mission1Done && next.mission2Done && next.mission3Done && !next.tombolaTicket) {
          next.tombolaTicket = `#KL-TOMBOLA-${Math.floor(1000 + Math.random() * 8999)}`;
        }
        return next;
      });
      if (!passport.mission1Done) {
        setGlowPoints((pts) => pts + 50);
      }
      showToast('Passport Stamp 1 Granted (+50 Glow Points)');
    },
    [passport.mission1Done, showToast]
  );

  const handleCompleteMission2 = useCallback(() => {
    setPassport((prev) => {
      const next: PassportProgress = { ...prev, mission2Done: true };
      if (next.mission1Done && next.mission2Done && next.mission3Done && !next.tombolaTicket) {
        next.tombolaTicket = `#KL-TOMBOLA-${Math.floor(1000 + Math.random() * 8999)}`;
      }
      return next;
    });
    if (!passport.mission2Done) {
      setGlowPoints((pts) => pts + 75);
    }
    showToast('Match-3 Won · Passport Stamp 2 Granted (+75 Glow Points)');
  }, [passport.mission2Done, showToast]);

  const handleCompleteMission3 = useCallback(() => {
    setPassport((prev) => {
      const next: PassportProgress = { ...prev, mission3Done: true };
      if (next.mission1Done && next.mission2Done && next.mission3Done && !next.tombolaTicket) {
        next.tombolaTicket = `#KL-TOMBOLA-${Math.floor(1000 + Math.random() * 8999)}`;
      }
      return next;
    });
    if (!passport.mission3Done) {
      setGlowPoints((pts) => pts + 75);
    }
    showToast('Brand Identified · Passport Stamp 3 Granted (+75 Glow Points)');
  }, [passport.mission3Done, showToast]);

  const handleSpinTombola = useCallback(
    (prizeLabel: string) => {
      setPassport((prev) => ({
        ...prev,
        tombolaTicket:
          prev.tombolaTicket ?? `#KL-TOMBOLA-${Math.floor(1000 + Math.random() * 8999)}`,
        tombolaPrize: prizeLabel,
      }));
      showToast(`Grand Tombola Capsule Drawn: ${prizeLabel}`);
    },
    [showToast]
  );

  const handleSyncQuizToApp = useCallback(() => {
    setActiveAppTab('avatar');
    handleSelectTab('app', 'app');
    showToast('Quiz profile synced to K-Lounge App Avatar');
  }, [handleSelectTab, showToast]);

  const handleSyncQuizToCycle = useCallback(() => {
    setActiveAppTab('cycle');
    handleSelectTab('app', 'cycle-sync');
    showToast('Quiz profile linked to your Period & Cycle Skincare plan');
  }, [handleSelectTab, showToast]);

  const bagCount = Object.values(bag).reduce((sum, q) => sum + q, 0);

  const voiceAgent = useVoiceAgent({
    activeTab,
    quizProfile: quizResult?.profileKey ?? null,
    cyclePhase: `Period start ${cycleState.lastPeriodStart} (${cycleState.cycleLength}-day cycle)`,
    bagCount,
    onSelectTab: handleSelectTab,
    onAddProduct: handleAddProduct,
    onOpenProduct: (id) => setProductId(id),
    onOpenBook: () => setBookOpen(true),
    onOpenAppModal: () => setAppModalOpen(true),
    onOpenBag: () => setDrawerOpen(true),
    onToast: showToast,
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9FB] text-[#14203F]">
      <TopHeaderNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        bagCount={bagCount}
        prizeCount={claimedPrizes.length + (passport.tombolaPrize ? 1 : 0)}
        onOpenBook={() => setBookOpen(true)}
        onOpenBag={() => setDrawerOpen(true)}
      />

      <main className="flex-1" role="tabpanel" aria-label={`Active section: ${activeTab}`}>
        {activeTab === 'popup' && (
          <>
            <OpeningBannerAndHero
              onOpenBook={() => setBookOpen(true)}
              onOpenAppModal={() => setAppModalOpen(true)}
              onSelectTab={handleSelectTab}
            />
            <PopupGuideSection
              onOpenBook={() => setBookOpen(true)}
              onSelectTab={handleSelectTab}
            />
          </>
        )}

        {activeTab === 'passport' && (
          <PassportAndPerksSection
            passport={passport}
            quizResult={quizResult}
            onCompleteMission1={handleCompleteMission1}
            onCompleteMission2={handleCompleteMission2}
            onCompleteMission3={handleCompleteMission3}
            onSpinTombola={handleSpinTombola}
            onOpenBookVip={() => setBookOpen(true)}
            onOpenAppModal={() => setAppModalOpen(true)}
            onToast={showToast}
          />
        )}

        {activeTab === 'quiz' && (
          <SkinQuizSection
            quizResult={quizResult}
            onCompleteQuiz={handleCompleteQuiz}
            onAddProductsToBag={handleAddRoutine}
            onOpenProduct={(id) => setProductId(id)}
            onBookWithQuiz={() => setBookOpen(true)}
            onSyncToApp={handleSyncQuizToApp}
            onSyncToCycle={handleSyncQuizToCycle}
          />
        )}

        {activeTab === 'app' && (
          <DiagnosisAndAppSection
            quizResult={quizResult}
            glowPoints={glowPoints}
            passport={passport}
            cycleState={cycleState}
            activeAppTab={activeAppTab}
            onChangeAppTab={setActiveAppTab}
            onUpdateCycle={setCycleState}
            onAddProduct={handleAddProduct}
            onOpenProduct={(id) => setProductId(id)}
            onEarnPoints={handleEarnPoints}
            onOpenBook={() => setBookOpen(true)}
            onOpenAppModal={() => setAppModalOpen(true)}
            onSelectTab={handleSelectTab}
            onToast={showToast}
          />
        )}

        {activeTab === 'games' && (
          <GamesAndPrizesSection
            glowPoints={glowPoints}
            claimedPrizes={claimedPrizes}
            onEarnPoints={handleEarnPoints}
            onClaimPrize={handleClaimPrize}
            onOpenBag={() => setDrawerOpen(true)}
            onToast={showToast}
          />
        )}

        {activeTab === 'products' && (
          <ProductsSection
            onAddProduct={handleAddProduct}
            onAddStarterBundle={handleAddRoutine}
            onOpenProduct={(id) => setProductId(id)}
            onSelectTab={handleSelectTab}
          />
        )}

        {activeTab === 'visit' && <VisitSection onOpenBook={() => setBookOpen(true)} />}

        {(activeTab === 'faq' || activeTab === 'agent') && (
          <FaqAndAgentSection
            mode={activeTab}
            messages={voiceAgent.messages}
            isSending={voiceAgent.isSending}
            isRecording={voiceAgent.isRecording}
            isTranscribing={voiceAgent.isTranscribing}
            recordingSeconds={voiceAgent.recordingSeconds}
            voiceRepliesEnabled={voiceAgent.voiceRepliesEnabled}
            onToggleVoiceReplies={voiceAgent.setVoiceRepliesEnabled}
            speakingMessageId={voiceAgent.speakingMessageId}
            voiceError={voiceAgent.voiceError}
            onSendCommand={voiceAgent.sendCommand}
            onToggleRecording={voiceAgent.toggleRecording}
            onSpeakText={voiceAgent.speakText}
            onStopAudio={voiceAgent.stopAudioPlayback}
            onSelectTab={handleSelectTab}
          />
        )}
      </main>

      <SiteFooter
        onSelectTab={handleSelectTab}
        onOpenAppModal={() => setAppModalOpen(true)}
        onToast={showToast}
      />

      <VoiceAgentDrawer
        messages={voiceAgent.messages}
        isSending={voiceAgent.isSending}
        isRecording={voiceAgent.isRecording}
        isTranscribing={voiceAgent.isTranscribing}
        recordingSeconds={voiceAgent.recordingSeconds}
        voiceRepliesEnabled={voiceAgent.voiceRepliesEnabled}
        onToggleVoiceReplies={voiceAgent.setVoiceRepliesEnabled}
        voiceError={voiceAgent.voiceError}
        onSendCommand={voiceAgent.sendCommand}
        onToggleRecording={voiceAgent.toggleRecording}
        onOpenFullFaqTab={handleSelectTab}
      />

      <ModalsAndDrawer
        bookOpen={bookOpen}
        onOpenBook={() => setBookOpen(true)}
        onCloseBook={() => setBookOpen(false)}
        productId={productId}
        onCloseProduct={() => setProductId(null)}
        appModalOpen={appModalOpen}
        onCloseAppModal={() => setAppModalOpen(false)}
        drawerOpen={drawerOpen}
        onCloseDrawer={() => setDrawerOpen(false)}
        bag={bag}
        onUpdateQty={handleUpdateQty}
        onAddProduct={handleAddProduct}
        onReserveBag={handleReserveBag}
        claimedPrizes={claimedPrizes}
        passport={passport}
        quizResult={quizResult}
        glowPoints={glowPoints}
        onExploreShop={() => handleSelectTab('products')}
        onToast={showToast}
        toastMsg={toastMsg}
      />
    </div>
  );
}
