import React, { useState } from 'react';
import {
  Calendar,
  Camera,
  CheckCircle2,
  KeyRound,
  QrCode,
  Smartphone,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { APP_PHONE_IMG, HAIR_IMG } from '../data/assets';
import { APP_NFT_PASSES, SKIN_PROFILES } from '../data/kloungeData';
import {
  AppPreviewTab,
  CycleTrackingState,
  PassportProgress,
  QuizSubmission,
  SiteTab,
} from '../types/klounge';
import { PeriodTrackerPanel } from './PeriodTrackerPanel';

interface DiagnosisAndAppSectionProps {
  quizResult: QuizSubmission | null;
  glowPoints: number;
  passport: PassportProgress;
  cycleState: CycleTrackingState;
  activeAppTab: AppPreviewTab;
  onChangeAppTab: (tab: AppPreviewTab) => void;
  onUpdateCycle: (updater: (prev: CycleTrackingState) => CycleTrackingState) => void;
  onAddProduct: (id: string) => void;
  onOpenProduct: (id: string) => void;
  onEarnPoints: (amount: number, reason: string) => void;
  onOpenBook: () => void;
  onOpenAppModal: () => void;
  onSelectTab: (tab: SiteTab, sectionId?: string) => void;
  onToast: (msg: string) => void;
}

export const DiagnosisAndAppSection: React.FC<DiagnosisAndAppSectionProps> = ({
  quizResult,
  glowPoints,
  passport,
  cycleState,
  activeAppTab,
  onChangeAppTab,
  onUpdateCycle,
  onAddProduct,
  onOpenProduct,
  onEarnPoints,
  onOpenBook,
  onOpenAppModal,
  onSelectTab,
  onToast,
}) => {
  // Interactive Daily Glow Log & Skin Journey Selfie Check-in
  const [hydrationScore, setHydrationScore] = useState(65);
  const [sensitivityScore, setSensitivityScore] = useState(35);
  const [selfieLogCount, setSelfieLogCount] = useState(3);

  const profile = quizResult ? SKIN_PROFILES[quizResult.profileKey] : SKIN_PROFILES.hydration;

  const missionsDone =
    Number(passport.mission1Done) +
    Number(passport.mission2Done) +
    Number(passport.mission3Done);

  const totalXp = 720 + glowPoints + selfieLogCount * 40;
  const avatarLevel = Math.max(4, Math.floor(totalXp / 300));
  const nextLevelCap = (avatarLevel + 1) * 300;
  const xpPercent = Math.min(100, Math.round((totalXp / nextLevelCap) * 100));

  const getDailyAdvice = () => {
    if (sensitivityScore >= 65) {
      return {
        headline: 'Barrier Soothing Focus Today',
        step: 'Pause exfoliating pads. Layer SKIN1004 Probio-Cica Essence Toner twice with gentle palm presses, then lock in comfort with Atobarrier 365 Cream.',
      };
    }
    if (hydrationScore < 50) {
      return {
        headline: 'Deep 5D Dew Replenishment',
        step: 'Apply Torriden DIVE-IN Multi Pad for 5 minutes as a cheek sheet mask before 3 drops of Hyaluronic Serum on damp skin.',
      };
    }
    return {
      headline: 'Follicular Phase · Hydration Focus',
      step: 'Skin hydration is in steady range. Seal morning moisture with cooling Hydro Cream and top with JUNG SAEM MOOL SPF50+ Cushion.',
    };
  };

  const dailyAdvice = getDailyAdvice();

  const handleLogSelfie = () => {
    setSelfieLogCount((c) => c + 1);
    onEarnPoints(25, 'Daily Skin Selfie logged in K-Lounge App (+25 Glow XP)');
  };

  return (
    <>
      {/* Access to the K-Lounge App & Web3 Loyalty Ecosystem */}
      <section id="app" className="scroll-mt-20 border-b border-[#14203F]/12 bg-[#E7EDF4] py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-5 md:px-7">
          <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
            {/* Phone Visual + Access Buttons */}
            <div className="grid justify-items-center gap-6">
              <div className="relative w-full max-w-[380px]">
                <div
                  className="bg-silver-gradient absolute inset-8 rounded-full opacity-90 blur-2xl"
                  aria-hidden="true"
                />
                <img
                  src={APP_PHONE_IMG}
                  alt="The K-Lounge app: avatar, daily skin selfie, cycle sync and Skin Hero NFT access"
                  loading="lazy"
                  className="relative w-full mix-blend-multiply"
                />
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={onOpenAppModal}
                  className="inline-flex items-center gap-2 rounded-full bg-[#14203F] px-6 py-3 text-[13.5px] font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[#233F7A]"
                >
                  <QrCode className="h-4 w-4" />
                  Get App Access &amp; QR Pass
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTab('quiz')}
                  className="inline-flex items-center gap-2 rounded-full border border-[#14203F]/20 bg-white px-5 py-3 text-[13.5px] font-semibold text-[#14203F] hover:border-[#233F7A]"
                >
                  <Smartphone className="h-4 w-4 text-[#233F7A]" />
                  {quizResult ? 'Update Avatar from Quiz' : 'Create Avatar via Quiz'}
                </button>
              </div>

              <div className="text-center text-[12px] font-semibold text-[#56637E]">
                iOS TestFlight · Android APK · On-Chain Loyalty &amp; Marais NFC Check-in
              </div>
            </div>

            {/* Interactive Web App Access Portal (Zoom App Details) */}
            <div className="grid gap-5">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#233F7A]">
                  Access the K-Lounge App · Pop-Up &amp; Beyond{' '}
                  <span className="font-kr ml-1.5 font-semibold tracking-normal">앱 &amp; 웹3</span>
                </div>
                <h2 className="font-display mt-3 text-[clamp(2rem,4vw,3.2rem)] leading-[1.06] text-[#14203F]">
                  Your skin, as a companion you level up every day.
                </h2>
                <p className="mt-2.5 max-w-[56ch] text-[15.5px] text-[#56637E]">
                  Built directly on your in-store diagnosis baselines: track daily selfies, sync
                  with your menstrual cycle, complete daily quests, and unlock physical exclusives
                  with <strong className="text-[#14203F]">Skin Hero NFTs</strong> and on-chain
                  loyalty levels.
                </p>
              </div>

              {/* Interactive Zoom App Portal */}
              <div className="overflow-hidden rounded-md border border-[#14203F]/14 bg-white">
                {/* Member XP Status Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#14203F]/12 bg-[#14203F] px-5 py-3.5 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#233F7A] font-display text-[1rem] italic text-[#CFE0FF]">
                      Lv.{avatarLevel}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold leading-tight">
                        {quizResult ? profile.title : 'Chloé · Marais Visitor'}
                      </div>
                      <div className="text-[11px] text-[#AFC3E2] tabular-nums">
                        Mission Level · {missionsDone}/3 Passport Stamps
                      </div>
                    </div>
                  </div>
                  <div className="min-w-[160px] flex-1 sm:max-w-[220px]">
                    <div className="flex justify-between text-[11px] font-semibold text-[#CFE0FF] tabular-nums">
                      <span>{totalXp} / {nextLevelCap} XP</span>
                      <span>{xpPercent}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                      <div
                        className="h-full bg-[#AFC3E2] transition-[width] duration-200"
                        style={{ width: `${xpPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* App Tabs */}
                <div
                  className="flex flex-wrap border-b border-[#14203F]/12 bg-[#F7F9FB]"
                  role="tablist"
                  aria-label="Preview K-Lounge App features"
                >
                  {[
                    { id: 'avatar' as const, label: '01 · Avatar & Quests', icon: UserCheck },
                    { id: 'daily' as const, label: '02 · Skin Journey & AI', icon: Sparkles },
                    { id: 'cycle' as const, label: '03 · Period & Cycle Sync', icon: Calendar },
                    { id: 'nft' as const, label: '04 · Skin Hero NFT', icon: KeyRound },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const active = activeAppTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChangeAppTab(tab.id)}
                        className={`inline-flex flex-1 items-center justify-center gap-1.5 px-3 py-3 text-[12px] font-semibold whitespace-nowrap transition-colors ${
                          active
                            ? 'bg-[#233F7A] text-white'
                            : 'text-[#56637E] hover:bg-white hover:text-[#14203F]'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-6">
                  {activeAppTab === 'avatar' && (
                    <div className="grid gap-5 sm:grid-cols-[0.44fr_0.56fr]">
                      <div className="flex flex-col items-center justify-center rounded-md border border-[#14203F]/12 bg-[#E7EDF4]/75 p-5 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#14203F] font-display text-[1.9rem] italic text-white">
                          Lv.{avatarLevel}
                        </div>
                        <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                          {quizResult ? 'Synced from Quiz' : 'Default Preview Twin'}
                        </div>
                        <div className="mt-0.5 font-display text-[1.25rem] text-[#14203F]">
                          {profile.title}
                        </div>
                        <div className="mt-1 text-[12px] text-[#56637E] tabular-nums">
                          Daily Quest: Complete {missionsDone}/3 Missions
                        </div>
                      </div>

                      <div className="grid content-between gap-3">
                        <div>
                          <h3 className="font-display text-[1.45rem] text-[#14203F]">
                            My Avatar &amp; Quests
                          </h3>
                          <p className="mt-1.5 text-[14px] text-[#56637E]">{profile.summary}</p>
                        </div>
                        <div className="grid gap-2 border-t border-[#14203F]/12 pt-3 text-[13px]">
                          <div className="flex justify-between">
                            <span className="text-[#56637E]">Daily Quest Status</span>
                            <button
                              type="button"
                              onClick={() => onSelectTab('passport')}
                              className="font-semibold text-[#233F7A] underline"
                            >
                              {missionsDone === 3
                                ? 'All 3 Missions Completed'
                                : `Continue (${missionsDone}/3)`}
                            </button>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#56637E]">Pop-Up Check-in</span>
                            <span className="font-semibold text-[#14203F]">
                              NFC Mirror · 10 rue Pastourelle
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeAppTab === 'daily' && (
                    <div className="grid gap-5">
                      {/* My Skin Journey & Selfie Upload curve */}
                      <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-[#14203F]/12 bg-[#F7F9FB] p-4">
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                            My Skin Journey &amp; Upload
                          </div>
                          <div className="mt-0.5 text-[13.5px] font-semibold text-[#14203F] tabular-nums">
                            {selfieLogCount} skin check-ins logged · Barrier trend rising
                          </div>
                          {/* Clean mini SVG trend curve */}
                          <svg viewBox="0 0 220 44" className="mt-2 h-11 w-full max-w-[240px]">
                            <path
                              d="M4 34 Q 42 36, 74 26 T 144 19 T 214 8"
                              fill="none"
                              stroke="#233F7A"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                            <circle cx="74" cy="26" r="3" fill="#233F7A" />
                            <circle cx="144" cy="19" r="3" fill="#233F7A" />
                            <circle cx="214" cy="8" r="4" fill="#14203F" />
                          </svg>
                        </div>

                        <button
                          type="button"
                          onClick={handleLogSelfie}
                          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#14203F] px-4 py-2.5 text-[12.5px] font-semibold text-white hover:bg-[#233F7A]"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          Add today’s skin check-in
                        </button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="grid gap-1.5 text-[13px] font-semibold text-[#14203F]">
                          <span className="flex justify-between">
                            <span>Morning Hydration Feel</span>
                            <span className="text-[#233F7A] tabular-nums">{hydrationScore}%</span>
                          </span>
                          <input
                            type="range"
                            min={20}
                            max={100}
                            value={hydrationScore}
                            onChange={(e) => setHydrationScore(Number(e.target.value))}
                            className="accent-[#233F7A]"
                          />
                        </label>
                        <label className="grid gap-1.5 text-[13px] font-semibold text-[#14203F]">
                          <span className="flex justify-between">
                            <span>Redness / Reactivity</span>
                            <span className="text-[#233F7A] tabular-nums">{sensitivityScore}%</span>
                          </span>
                          <input
                            type="range"
                            min={10}
                            max={100}
                            value={sensitivityScore}
                            onChange={(e) => setSensitivityScore(Number(e.target.value))}
                            className="accent-[#233F7A]"
                          />
                        </label>
                      </div>

                      <div className="rounded-md border border-[#14203F]/12 bg-[#F7F9FB] p-4">
                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                          Diagnostic-Based Skin Advice
                        </div>
                        <h4 className="mt-1 font-display text-[1.35rem] text-[#14203F]">
                          {dailyAdvice.headline}
                        </h4>
                        <p className="mt-1 text-[14px] text-[#56637E]">{dailyAdvice.step}</p>
                      </div>
                    </div>
                  )}

                  {activeAppTab === 'cycle' && (
                    <PeriodTrackerPanel
                      cycleState={cycleState}
                      quizResult={quizResult}
                      onUpdateCycle={onUpdateCycle}
                      onAddProduct={onAddProduct}
                      onOpenProduct={onOpenProduct}
                      onToast={onToast}
                    />
                  )}

                  {activeAppTab === 'nft' && (
                    <div className="grid gap-3">
                      <div className="rounded-md border border-[#233F7A]/25 bg-[#14203F] p-4 text-white">
                        <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#AFC3E2]">
                          Web3 Loyalty &amp; “Skin Hero” NFT Exclusive Access
                        </div>
                        <p className="mt-1 text-[13.5px] text-[#DCE6F7]">
                          Collect digital loyalty stamps &amp; “Skin Hero” passes in the app to
                          unlock limited physical Seoul products at the Marais pop-up and e-store.
                        </p>
                      </div>
                      {APP_NFT_PASSES.map((pass) => (
                        <div
                          key={pass.id}
                          className="flex flex-col justify-between gap-2 rounded-md border border-[#14203F]/12 bg-[#F7F9FB] p-4 sm:flex-row sm:items-center"
                        >
                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                              {pass.edition}
                            </div>
                            <h4 className="font-display text-[1.25rem] text-[#14203F]">
                              {pass.name}
                            </h4>
                            <p className="text-[13px] text-[#56637E]">{pass.perk}</p>
                          </div>
                          <button
                            type="button"
                            onClick={onOpenAppModal}
                            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-[#14203F]/20 bg-white px-3.5 py-2 text-[12px] font-semibold text-[#14203F] hover:border-[#233F7A] sm:self-center"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#233F7A]" />
                            Claim Pass
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* In-store Free Skin + Hair Diagnosis Studio */}
      <section
        id="diagnosis"
        className="scroll-mt-20 bg-[#F7F9FB] py-16 md:py-24"
      >
        <div className="mx-auto max-w-[1280px] px-5 md:px-7">
          <div className="grid items-end gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#233F7A]">
                Skin + Hair Diagnosis{' '}
                <span className="font-kr ml-1.5 font-semibold tracking-normal">
                  피부 · 두피 진단
                </span>
              </div>
              <h2 className="font-display mt-3 text-[clamp(2rem,4vw,3.3rem)] leading-[1.06] text-[#14203F]">
                Before any product,{' '}
                <em className="italic text-[#233F7A]">we read your skin and your hair.</em>
              </h2>
            </div>

            <div>
              <p className="max-w-[46ch] text-[15.5px] text-[#56637E]">
                Two dedicated Korean skin &amp; AI specialists on site analyze your skin and scalp
                in Le Marais, then pair your printed Skin Report with the K-Lounge app.
              </p>
              <p className="mt-2.5 text-[12px] font-bold uppercase tracking-[0.15em] text-[#233F7A]">
                Complimentary · 2 Korean Experts On Site · March – April 2026
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-[1fr_1fr_0.92fr]">
            {/* Card 1: Face scan */}
            <div className="grid content-start gap-4 rounded-md border border-[#14203F]/14 bg-white p-6">
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#233F7A]">
                Skin diagnosis
              </div>
              <h3 className="font-display text-[1.9rem] text-[#14203F]">Your skin, mapped.</h3>

              <div className="relative aspect-[4/4.3] w-full overflow-hidden rounded border border-[#14203F]/10 bg-[#14203F]">
                <img
                  src="/assets/aistudio/IMG_3995_3e3bab87.jpeg"
                  alt="AI facial skin mapping showing hydration, sensitivity, and barrier grid points"
                  loading="lazy"
                  className="h-full w-full object-cover object-top"
                />
                <div
                  aria-hidden="true"
                  className="animate-scan-beam absolute right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-[#CFE0FF] to-transparent shadow-[0_0_18px_#9FC0FF]"
                />
              </div>

              <ul className="grid gap-2 text-[14px] text-[#56637E]">
                <li>· Hydration and sebum levels</li>
                <li>· Sensitivity, redness and barrier health</li>
                <li>· Pores, texture and radiance</li>
              </ul>
            </div>

            {/* Card 2: Hair & scalp */}
            <div className="grid content-between gap-5 rounded-md border border-[#14203F]/14 bg-white p-6">
              <div className="grid gap-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#233F7A]">
                  Hair &amp; scalp diagnosis
                </div>
                <h3 className="font-display text-[1.9rem] text-[#14203F]">
                  Your hair, from the root.
                </h3>

                <ul className="grid gap-2.5 border-y border-[#14203F]/12 py-4 text-[14.5px] text-[#14203F]">
                  <li>· Scalp condition: oily, dry or sensitive</li>
                  <li>· Hair fiber damage and breakage</li>
                  <li>· Density, shine and hydration balance</li>
                </ul>

                <p className="text-[14.5px] text-[#56637E]">
                  K-beauty treats the scalp like skin. Guided by our hostess and Korean specialists,
                  every guest leaves with clarity on both skin and scalp care.
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenBook}
                className="justify-self-start rounded-full bg-[#233F7A] px-6 py-3 text-[14px] font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[#14203F]"
              >
                Book my free diagnosis
              </button>
            </div>

            {/* Card 3: Hair visual */}
            <div className="relative min-h-[340px] overflow-hidden rounded-md border border-[#14203F]/14 md:col-span-2 lg:col-span-1">
              <img
                src={HAIR_IMG}
                alt="Long glossy dark hair after a K-beauty hair routine"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute right-4 bottom-4 left-4 rounded bg-[#14203F]/85 p-4 text-[13.5px] text-white backdrop-blur-md">
                Your results print onto your souvenir Skin Report and feed your avatar in the
                K-Lounge app.
              </div>
            </div>
          </div>

          {/* 4-Step Flow */}
          <div
            className="mt-8 grid divide-y divide-[#14203F]/12 overflow-hidden rounded-md border border-[#14203F]/14 bg-white sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4"
            aria-label="How the diagnosis works"
          >
            {[
              { n: '01', title: 'Hostess check-in', desc: 'Collect your K-Lounge Passport or skip queue with VIP.' },
              { n: '02', title: 'Skin + hair scan', desc: '2 Korean experts scan your skin and scalp in store.' },
              { n: '03', title: 'Skin Report & routine', desc: 'Receive your printed “My Skin Report” & tailored matches.' },
              { n: '04', title: 'Sync to K-Lounge App', desc: 'Pair your avatar, daily selfie coach & cycle sync.' },
            ].map((s) => (
              <div key={s.n} className="grid content-start gap-1.5 p-5">
                <span className="font-display text-[1.55rem] italic text-[#233F7A] tabular-nums">
                  {s.n}
                </span>
                <strong className="text-[15px] text-[#14203F]">{s.title}</strong>
                <span className="text-[13.5px] text-[#56637E]">{s.desc}</span>
              </div>
            ))}
          </div>

          {/* Skin Analysis & Skincare Advice Studio Gallery */}
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <figure className="overflow-hidden rounded-md border border-[#14203F]/14 bg-white">
              <img
                src="/assets/aistudio/IMG_3997_767e0c73.png"
                alt="Korean specialist selecting targeted active serums with gloved precision"
                loading="lazy"
                className="aspect-[4/4.2] w-full object-cover object-top"
              />
              <figcaption className="border-t border-[#14203F]/10 p-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                  Clinical Skincare Advice
                </div>
                <p className="mt-1 text-[13.5px] text-[#56637E]">
                  Active dropper serums calibrated around your barrier level, sensitivity, and cycle
                  phase.
                </p>
              </figcaption>
            </figure>

            <figure className="overflow-hidden rounded-md border border-[#14203F]/14 bg-white">
              <img
                src="/assets/aistudio/IMG_3993_2d9ba951.jpeg"
                alt="Visitor reading personalized AM/PM skincare solutions in My Skin Report"
                loading="lazy"
                className="aspect-[4/4.2] w-full object-cover object-top"
              />
              <figcaption className="border-t border-[#14203F]/10 p-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                  My Skin Report · Foldout Guide
                </div>
                <p className="mt-1 text-[13.5px] text-[#56637E]">
                  Every skin reads differently—leave with tailored Morning &amp; Evening K-beauty
                  steps.
                </p>
              </figcaption>
            </figure>

            <figure className="overflow-hidden rounded-md border border-[#14203F]/14 bg-white">
              <img
                src="/assets/aistudio/IMG_3994_ff4b1e5c.jpeg"
                alt="Model seated reading the printed This is My Skin Report broadsheet newspaper"
                loading="lazy"
                className="aspect-[4/4.2] w-full object-cover object-top"
              />
              <figcaption className="border-t border-[#14203F]/10 p-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                  Seoul Broadsheet Dossier
                </div>
                <p className="mt-1 text-[13.5px] text-[#56637E]">
                  Printed on site at 10 rue Pastourelle and linked with QR to your K-Lounge app
                  profile.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </>
  );
};
