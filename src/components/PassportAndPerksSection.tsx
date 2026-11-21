import React, { useMemo, useState } from 'react';
import {
  Check,
  Disc3,
  FileText,
  Gift,
  KeyRound,
  RotateCcw,
  Search,
  Sparkles,
  Stamp,
  Ticket,
} from 'lucide-react';
import { PRODUCT_IMAGES } from '../data/assets';
import {
  GUESS_BRAND_CASES,
  INSTORE_LIMITED_PERKS,
  PASSPORT_CUSTOMS_PACK,
  QUARTERLY_BOX_EDITIONS,
  SKIN_PROFILES,
  SPECIAL_GUEST_SPOTLIGHT,
  TOMBOLA_GRAND_PRIZES,
} from '../data/kloungeData';
import { PassportProgress, QuizSubmission } from '../types/klounge';
import { playTone, playVictoryChord } from '../utils/sound';

interface PassportAndPerksSectionProps {
  passport: PassportProgress;
  quizResult: QuizSubmission | null;
  onCompleteMission1: (handle: string) => void;
  onCompleteMission2: () => void;
  onCompleteMission3: () => void;
  onSpinTombola: (prizeLabel: string) => void;
  onOpenBookVip: () => void;
  onOpenAppModal: () => void;
  onToast: (msg: string) => void;
}

const MATCH3_POOL = [
  { key: 'ceramide', label: 'AESTURA', img: 'p-aestura-cream' },
  { key: 'hyaluronic', label: 'Torriden', img: 'p-torriden-serum' },
  { key: 'centella', label: 'SKIN1004', img: 'p-skin1004-ampoule' },
];

function createMatch3Board() {
  const arr = [...MATCH3_POOL, ...MATCH3_POOL, ...MATCH3_POOL].map((item, idx) => ({
    ...item,
    uid: idx,
    flipped: false,
  }));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const PassportAndPerksSection: React.FC<PassportAndPerksSectionProps> = ({
  passport,
  quizResult,
  onCompleteMission1,
  onCompleteMission2,
  onCompleteMission3,
  onSpinTombola,
  onOpenBookVip,
  onOpenAppModal,
  onToast,
}) => {
  const [activeMissionTab, setActiveMissionTab] = useState<1 | 2 | 3>(1);

  // Mission 1: Social Boarding state
  const [socialHandle, setSocialHandle] = useState(passport.socialHandle || '@');
  const [m1Error, setM1Error] = useState(false);

  // Mission 2: Flip the Cards (Match 3 of a kind)
  const [flipBoard, setFlipBoard] = useState(() => createMatch3Board());
  const [flipCount, setFlipCount] = useState(0);

  // Mission 3: K-Beauty Detective (Guess the Brand)
  const [caseIndex, setCaseIndex] = useState(0);
  const [guessedBrand, setGuessedBrand] = useState<string | null>(null);
  const [guessWrong, setGuessWrong] = useState<string | null>(null);

  // Tombola & Report Modal/Panel states
  const [isSpinningTombola, setIsSpinningTombola] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [boxEmail, setBoxEmail] = useState('');
  const [boxTier, setBoxTier] = useState(QUARTERLY_BOX_EDITIONS[0].title);
  const [boxJoined, setBoxJoined] = useState<string | null>(null);

  const stampsCount =
    Number(passport.mission1Done) +
    Number(passport.mission2Done) +
    Number(passport.mission3Done);

  const allMissionsComplete = stampsCount === 3;
  const activeDetectiveCase = GUESS_BRAND_CASES[caseIndex];
  const activeProfile = quizResult ? SKIN_PROFILES[quizResult.profileKey] : SKIN_PROFILES.hydration;

  const matchedKeyInBoard = useMemo(() => {
    const counts: Record<string, number> = {};
    flipBoard.forEach((c) => {
      if (c.flipped) counts[c.key] = (counts[c.key] ?? 0) + 1;
    });
    return Object.entries(counts).find(([, count]) => count >= 3)?.[0] ?? null;
  }, [flipBoard]);

  const handleVerifyMission1 = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = socialHandle.trim();
    if (cleaned.length < 2) {
      setM1Error(true);
      return;
    }
    setM1Error(false);
    playVictoryChord(false);
    onCompleteMission1(cleaned.startsWith('@') ? cleaned : `@${cleaned}`);
  };

  const handleFlipCard = (uid: number) => {
    if (matchedKeyInBoard || passport.mission2Done) return;
    const card = flipBoard.find((c) => c.uid === uid);
    if (!card || card.flipped) return;

    playTone(540, 0.06, 'sine', 0.045);
    const updated = flipBoard.map((c) => (c.uid === uid ? { ...c, flipped: true } : c));
    setFlipBoard(updated);
    setFlipCount((n) => n + 1);

    const counts: Record<string, number> = {};
    updated.forEach((c) => {
      if (c.flipped) counts[c.key] = (counts[c.key] ?? 0) + 1;
    });
    const triple = Object.entries(counts).find(([, cnt]) => cnt >= 3);
    if (triple) {
      playVictoryChord(false);
      onCompleteMission2();
    }
  };

  const handleResetFlipBoard = () => {
    setFlipBoard(createMatch3Board());
    setFlipCount(0);
  };

  const handleGuessBrand = (brand: string) => {
    if (brand === activeDetectiveCase.answerBrand) {
      setGuessWrong(null);
      setGuessedBrand(brand);
      playVictoryChord(false);
      onCompleteMission3();
    } else {
      playTone(210, 0.1, 'sawtooth', 0.04);
      setGuessWrong(brand);
    }
  };

  const handleNextCase = () => {
    setGuessedBrand(null);
    setGuessWrong(null);
    setCaseIndex((idx) => (idx + 1) % GUESS_BRAND_CASES.length);
  };

  const handleTurnTombolaHandle = () => {
    if (!allMissionsComplete || passport.tombolaPrize || isSpinningTombola) return;
    setIsSpinningTombola(true);
    playTone(480, 0.09, 'triangle', 0.05);
    setTimeout(() => {
      const pick =
        TOMBOLA_GRAND_PRIZES[Math.floor(Math.random() * TOMBOLA_GRAND_PRIZES.length)];
      playVictoryChord(false);
      onSpinTombola(pick.label);
      setIsSpinningTombola(false);
    }, 900);
  };

  const handleBoxSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(boxEmail.trim())) {
      onToast('Please enter a valid email for Quarterly Box updates');
      return;
    }
    setBoxJoined(`Reserved waitlist spot for ${boxTier} (${boxEmail.trim()}).`);
    setBoxEmail('');
  };

  return (
    <section
      id="passport"
      className="scroll-mt-20 border-b border-[#14203F]/12 bg-[#F7F9FB] py-16 md:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-5 md:px-7">
        {/* Section Heading: Experience Spine — Passport Trail */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#14203F]/12 pb-8 md:flex-row md:items-end">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#233F7A]">
              The Experience Spine · First 1,000 Visitors{' '}
              <span className="font-kr ml-1.5 font-semibold tracking-normal">
                여권 스탬프 투어
              </span>
            </div>
            <h2 className="font-display mt-3 text-[clamp(2rem,4vw,3.35rem)] leading-[1.06] text-[#14203F]">
              K-Lounge Passport Trail &amp; <em className="italic text-[#233F7A]">3 Missions.</em>
            </h2>
            <p className="mt-2.5 max-w-[58ch] text-[15.5px] text-[#56637E]">
              First 1,000 visitors receive a physical{' '}
              <strong className="font-semibold text-[#14203F]">K-Lounge Passport</strong> with
              Hangul souvenir stamps and a printed <em className="italic">This Is My Skin Report</em>.
              Complete the three digital/in-store missions below to unlock Customs rewards and a
              Grand Tombola ticket for Korea flight prizes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setShowReportPreview((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-[#14203F]/20 bg-white px-5 py-2.5 text-[13px] font-semibold text-[#14203F] transition-colors hover:border-[#233F7A]"
            >
              <FileText className="h-4 w-4 text-[#233F7A]" />
              {showReportPreview ? 'Hide Skin Report' : 'Preview “My Skin Report”'}
            </button>
            <div className="text-right">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#56637E]">
                Passport Stamps
              </div>
              <div className="font-display text-[1.75rem] leading-none text-[#14203F] tabular-nums">
                {stampsCount} / 3 Completed
              </div>
            </div>
          </div>
        </div>

        {/* Optional Printed Newspaper "This Is My Skin Report" Preview Drawer */}
        {showReportPreview && (
          <div className="mt-6 rounded-md border border-[#14203F]/20 bg-white p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#14203F] pb-4">
              <div>
                <div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#56637E]">
                  K-Lounge Paris · Edition Nº 01 · First 1,000 Souvenir Print
                </div>
                <h3 className="font-display mt-1 text-[clamp(1.75rem,3vw,2.5rem)] text-[#14203F]">
                  This is My Skin Report
                </h3>
              </div>
              <div className="text-right text-[12px] font-semibold text-[#233F7A]">
                <div>10 rue Pastourelle · 75003 Paris</div>
                <div className="font-kr">케이 라운지 · 맞춤 피부 리포트</div>
              </div>
            </div>

            <div className="mt-5 grid items-center gap-6 md:grid-cols-[0.75fr_1fr_1fr_0.9fr]">
              <img
                src="/assets/aistudio/IMG_3994_ff4b1e5c.jpeg"
                alt="Visitor reading printed This is My Skin Report broadsheet"
                className="aspect-[4/4.4] w-full rounded border border-[#14203F]/12 object-cover object-top"
              />
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#56637E]">
                  Diagnosed Archetype
                </div>
                <div className="font-display mt-1 text-[1.45rem] text-[#14203F]">
                  {activeProfile.title}
                </div>
                <div className="font-kr text-[13px] font-semibold text-[#233F7A]">
                  {activeProfile.korean}
                </div>
                <p className="mt-2 text-[13.5px] text-[#56637E]">{activeProfile.summary}</p>
              </div>

              <div className="border-y border-[#14203F]/12 py-4 md:border-x md:border-y-0 md:px-6 md:py-0">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#56637E]">
                  AM / PM Prescription
                </div>
                <p className="mt-2 text-[13.5px] text-[#14203F]">
                  <strong>Morning:</strong> {activeProfile.morningTip}
                </p>
                <p className="mt-2 text-[13.5px] text-[#14203F]">
                  <strong>Evening:</strong> {activeProfile.eveningTip}
                </p>
              </div>

              <div className="flex flex-col justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#56637E]">
                    Hangul Passport Stamp
                  </div>
                  <div className="mt-2 inline-flex items-center gap-3 rounded-full border-2 border-dashed border-[#233F7A] px-4 py-2 text-[#233F7A]">
                    <Stamp className="h-5 w-5" />
                    <span className="font-kr text-[13px] font-semibold">
                      파리 팝업 · 인증 완료
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenBookVip}
                  className="self-start rounded-full bg-[#233F7A] px-5 py-2 text-[12.5px] font-semibold text-white hover:bg-[#14203F]"
                >
                  Print in store with Free Diagnosis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Interactive 3-Mission Workspace + Right Passport Customs Book */}
        <div className="mt-8 grid gap-7 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left: 3 Interactive Missions */}
          <div className="overflow-hidden rounded-md border border-[#14203F]/14 bg-white">
            <div
              className="grid grid-cols-3 border-b border-[#14203F]/12 bg-[#E7EDF4]/65"
              role="tablist"
              aria-label="Passport Missions"
            >
              {[
                { num: 1 as const, label: 'Mission 1 · Social Boarding', done: passport.mission1Done },
                { num: 2 as const, label: 'Mission 2 · Flip the Cards', done: passport.mission2Done },
                { num: 3 as const, label: 'Mission 3 · Guess the Brand', done: passport.mission3Done },
              ].map((tab) => {
                const active = activeMissionTab === tab.num;
                return (
                  <button
                    key={tab.num}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveMissionTab(tab.num)}
                    className={`flex items-center justify-center gap-2 px-3 py-3.5 text-[12.5px] font-semibold transition-colors ${
                      active
                        ? 'bg-[#14203F] text-white'
                        : 'text-[#14203F] hover:bg-white/80'
                    }`}
                  >
                    {tab.done && <Check className="h-3.5 w-3.5 shrink-0 text-[#AFC3E2]" />}
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-6 md:p-7">
              {/* MISSION 1: SOCIAL BOARDING */}
              {activeMissionTab === 1 && (
                <div className="grid gap-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#233F7A]">
                        Stamp 1 · Gleam Verification · Boarding Pass
                      </div>
                      <h3 className="font-display mt-1 text-[1.75rem] text-[#14203F]">
                        Social Boarding &amp; Avatar Setup
                      </h3>
                    </div>
                    <span className="text-[12.5px] font-semibold text-[#56637E]">
                      {passport.mission1Done ? 'Stamp 1 Unlocked' : 'Step 1 of 3'}
                    </span>
                  </div>

                  <ol className="grid gap-3 border-y border-[#14203F]/12 py-4 text-[14px] text-[#14203F] sm:grid-cols-3">
                    <li className="grid gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                        01 · App &amp; Account
                      </span>
                      <span className="text-[#56637E]">
                        Download the K-Lounge App &amp; initialize your Bitmoji/Avatar twin.
                      </span>
                    </li>
                    <li className="grid gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                        02 · Follow &amp; Share
                      </span>
                      <span className="text-[#56637E]">
                        Follow <strong>@KLounge.Paris</strong> and repost our 2-week
                        March–April opening story.
                      </span>
                    </li>
                    <li className="grid gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                        03 · Gleam Check
                      </span>
                      <span className="text-[#56637E]">
                        Enter your Instagram/TikTok handle below or show at hostess check-in.
                      </span>
                    </li>
                  </ol>

                  {passport.mission1Done ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#233F7A]/25 bg-[#E7EDF4]/70 p-4">
                      <div>
                        <div className="text-[13.5px] font-bold text-[#14203F]">
                          Stamp 1 Granted · {passport.socialHandle}
                        </div>
                        <div className="text-[12.5px] text-[#56637E]">
                          Show your Boarding Pass QR at hostess reception · +50 Glow Points
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveMissionTab(2)}
                        className="rounded-full bg-[#233F7A] px-5 py-2 text-[13px] font-semibold text-white"
                      >
                        Go to Mission 2
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyMission1} className="grid gap-3 sm:flex sm:items-end">
                      <label className="grid flex-1 gap-1.5 text-[12px] font-semibold text-[#56637E]">
                        <span>Instagram / TikTok Handle for Gleam Verification</span>
                        <input
                          type="text"
                          value={socialHandle}
                          onChange={(e) => setSocialHandle(e.target.value)}
                          placeholder="@yourhandle"
                          className="rounded-md border border-[#14203F]/18 bg-[#F7F9FB] px-4 py-2.5 text-[14.5px] text-[#14203F] focus:border-[#233F7A] focus:outline-none"
                        />
                      </label>
                      <button
                        type="submit"
                        className="rounded-full bg-[#233F7A] px-6 py-3 text-[13.5px] font-semibold text-white hover:bg-[#14203F]"
                      >
                        Verify &amp; Stamp
                      </button>
                      <button
                        type="button"
                        onClick={onOpenAppModal}
                        className="rounded-full border border-[#14203F]/20 bg-white px-5 py-3 text-[13.5px] font-semibold text-[#14203F] hover:border-[#233F7A]"
                      >
                        Open App QR
                      </button>
                    </form>
                  )}
                  {m1Error && (
                    <p className="text-[13px] font-medium text-[#A3263A]">
                      Please enter your social handle to log Mission 1.
                    </p>
                  )}
                </div>
              )}

              {/* MISSION 2: FLIP THE CARDS (MATCH 3 TO WIN FULL SIZE) */}
              {activeMissionTab === 2 && (
                <div className="grid gap-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#233F7A]">
                        Stamp 2 · Interactive Game of Chance
                      </div>
                      <h3 className="font-display mt-1 text-[1.75rem] text-[#14203F]">
                        Flip the Cards — Match 3 to Win Full-Size
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetFlipBoard}
                      className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#233F7A] hover:text-[#14203F]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Shuffle Board
                    </button>
                  </div>

                  <p className="text-[14px] text-[#56637E]">
                    Flip medallions on the board until you reveal{' '}
                    <strong className="text-[#14203F]">3 matching K-Beauty icons</strong> to claim
                    Stamp 2 + +75 Glow Points.
                  </p>

                  <div className="grid grid-cols-3 gap-3 sm:max-w-[460px]">
                    {flipBoard.map((cell) => (
                      <button
                        key={cell.uid}
                        type="button"
                        onClick={() => handleFlipCard(cell.uid)}
                        className={`flex aspect-square flex-col items-center justify-center rounded-full border p-3 text-center transition-transform duration-150 ${
                          cell.flipped
                            ? 'border-[#233F7A] bg-[#E7EDF4] text-[#14203F]'
                            : 'border-[#14203F]/15 bg-[#233F7A] text-white hover:-translate-y-0.5 hover:bg-[#14203F]'
                        }`}
                      >
                        {cell.flipped ? (
                          <>
                            <img
                              src={PRODUCT_IMAGES[cell.img]}
                              alt={cell.label}
                              className="h-11 w-11 object-contain"
                            />
                            <span className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#233F7A]">
                              {cell.label}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-kr text-[12px] text-[#AFC3E2]">케이라운지</span>
                            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75">
                              Flip
                            </span>
                          </>
                        )}
                      </button>
                    ))}
                  </div>

                  {(passport.mission2Done || matchedKeyInBoard) && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#233F7A]/25 bg-[#E7EDF4]/75 p-4">
                      <div className="text-[13.5px] font-semibold text-[#14203F]">
                        Match-3 Complete ({flipCount || 3} flips) · Stamp 2 Unlocked! Show in store
                        for your full-size prize draw.
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveMissionTab(3)}
                        className="rounded-full bg-[#233F7A] px-5 py-2 text-[13px] font-semibold text-white"
                      >
                        Go to Mission 3
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MISSION 3: K-BEAUTY DETECTIVE — GUESS THE BRAND */}
              {activeMissionTab === 3 && (
                <div className="grid gap-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#233F7A]">
                        Stamp 3 · K-Beauty Detective Stand
                      </div>
                      <h3 className="font-display mt-1 text-[1.75rem] text-[#14203F]">
                        Guess the Brand
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-[12.5px] font-semibold text-[#56637E] tabular-nums">
                      <span>{activeDetectiveCase.caseNumber} / 4</span>
                      <button
                        type="button"
                        onClick={handleNextCase}
                        className="text-[#233F7A] underline underline-offset-4 hover:text-[#14203F]"
                      >
                        Next mystery
                      </button>
                    </div>
                  </div>

                  {/* Dark Navy Detective Console mirroring Slide 10 booth */}
                  <div className="rounded-md bg-[#14203F] p-5 text-white md:p-6">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#AFC3E2]">
                      <Search className="h-3.5 w-3.5" />
                      <span>Look Closer · Recognize the Details · Win Your Glow</span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded border border-white/15 bg-white/[0.04] p-3.5">
                        <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#AFC3E2]">
                          1. What’s the packaging?
                        </div>
                        <p className="mt-1.5 text-[13px] text-white/90">
                          {activeDetectiveCase.clues.packaging}
                        </p>
                      </div>
                      <div className="rounded border border-white/15 bg-white/[0.04] p-3.5">
                        <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#AFC3E2]">
                          2. Guess texture &amp; color
                        </div>
                        <p className="mt-1.5 text-[13px] text-white/90">
                          {activeDetectiveCase.clues.colorTexture}
                        </p>
                      </div>
                      <div className="rounded border border-white/15 bg-white/[0.04] p-3.5">
                        <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#AFC3E2]">
                          3. Key ingredient?
                        </div>
                        <p className="mt-1.5 text-[13px] text-white/90">
                          {activeDetectiveCase.clues.ingredient}
                        </p>
                      </div>
                    </div>

                    {!guessedBrand ? (
                      <div className="mt-5 grid gap-2.5 sm:grid-cols-4">
                        {activeDetectiveCase.options.map((brand) => (
                          <button
                            key={brand}
                            type="button"
                            onClick={() => handleGuessBrand(brand)}
                            className={`rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                              guessWrong === brand
                                ? 'border-[#EA5858] bg-[#EA5858]/20 text-white'
                                : 'border-white/25 bg-white/10 text-white hover:bg-white hover:text-[#14203F]'
                            }`}
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-5 flex flex-wrap items-center gap-4 rounded bg-white p-4 text-[#14203F]">
                        <img
                          src={PRODUCT_IMAGES[activeDetectiveCase.revealProductImg]}
                          alt={guessedBrand}
                          className="h-14 w-14 rounded bg-[#E7EDF4] object-contain p-1.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                            Correct · {activeDetectiveCase.rewardNote}
                          </div>
                          <div className="font-display text-[1.35rem]">
                            It’s {guessedBrand} — Stamp 3 Granted!
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleNextCase}
                          className="rounded-full bg-[#14203F] px-4 py-2 text-[12.5px] font-semibold text-white"
                        >
                          Try another clue
                        </button>
                      </div>
                    )}
                    {guessWrong && !guessedBrand && (
                      <p className="mt-2.5 text-[12.5px] text-[#F7C6D9]">
                        Not {guessWrong} — check the packaging &amp; key ingredient clue again.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: K-Lounge Passport Customs & Grand Tombola */}
          <div className="grid content-between gap-5 rounded-md border border-[#14203F]/14 bg-[#E7EDF4]/75 p-6">
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#233F7A]">
                  Mission Completed · Passport Customs
                </div>
                <span className="font-kr text-[12px] font-semibold text-[#233F7A]">
                  여권 보상
                </span>
              </div>

              {/* 3 Visual Hangul Stamps */}
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {[
                  { n: 1, title: 'Social', kr: '미션 1', done: passport.mission1Done },
                  { n: 2, title: 'Cards', kr: '미션 2', done: passport.mission2Done },
                  { n: 3, title: 'Detective', kr: '미션 3', done: passport.mission3Done },
                ].map((s) => (
                  <div
                    key={s.n}
                    className={`flex flex-col items-center justify-center rounded-md border py-3 text-center transition-colors ${
                      s.done
                        ? 'border-[#233F7A] bg-[#14203F] text-white'
                        : 'border-dashed border-[#14203F]/25 bg-white/70 text-[#56637E]'
                    }`}
                  >
                    <Stamp className={`h-5 w-5 ${s.done ? 'text-[#AFC3E2]' : 'opacity-40'}`} />
                    <span className="mt-1 text-[12px] font-bold">{s.title}</span>
                    <span className="font-kr text-[11px] opacity-80">{s.kr}</span>
                  </div>
                ))}
              </div>

              {/* Customs Pack Breakdown */}
              <div className="mt-5 rounded-md border border-[#14203F]/12 bg-white p-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#56637E]">
                  Customs Gift Bundle Unlocked at 3/3 Stamps
                </div>
                <ul className="mt-2.5 grid gap-2 text-[13.5px]">
                  {PASSPORT_CUSTOMS_PACK.map((item) => (
                    <li key={item.item} className="flex items-start gap-2 text-[#14203F]">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          allMissionsComplete ? 'text-[#233F7A]' : 'text-[#14203F]/25'
                        }`}
                      />
                      <span>
                        <strong>{item.item}</strong> —{' '}
                        <span className="text-[#56637E]">{item.detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Grand Tombola Capsule Tumbler */}
            <div className="rounded-md border border-[#14203F]/15 bg-[#14203F] p-5 text-white">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#AFC3E2]">
                  <Ticket className="h-4 w-4" />
                  <span>Grand Tombola Capsule</span>
                </div>
                {passport.tombolaTicket && (
                  <span className="font-mono text-[12px] font-bold text-[#CFE0FF] tabular-nums">
                    {passport.tombolaTicket}
                  </span>
                )}
              </div>

              <p className="mt-2 text-[13.5px] text-[#C3CCDD]">
                Turn the handle for a chance at a{' '}
                <strong className="text-white">Flight Ticket to Seoul (KR)</strong>, Wellness rituals,
                or the Quarterly Skincare Box.
              </p>

              {passport.tombolaPrize ? (
                <div className="mt-4 rounded bg-white p-3.5 text-[#14203F]">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                    Capsule Result Recorded
                  </div>
                  <div className="font-display mt-0.5 text-[1.25rem]">
                    {passport.tombolaPrize}
                  </div>
                  <div className="mt-1 text-[12px] text-[#56637E]">
                    Ticket {passport.tombolaTicket} is saved in your Visit Bag for 10 rue Pastourelle.
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!allMissionsComplete || isSpinningTombola}
                  onClick={handleTurnTombolaHandle}
                  className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition-colors ${
                    allMissionsComplete
                      ? 'bg-white text-[#14203F] hover:bg-[#E7EDF4]'
                      : 'border border-white/20 text-white/50 cursor-not-allowed'
                  }`}
                >
                  <Gift className="h-4 w-4" />
                  {isSpinningTombola
                    ? 'Turning Capsule Handle...'
                    : allMissionsComplete
                    ? 'Turn Handle & Draw Tombola Capsule'
                    : `Complete ${3 - stampsCount} more mission${3 - stampsCount > 1 ? 's' : ''} to draw`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Special Guest Peggy Gou + In-Store Limited Perks + Quarterly Skincare Boxes */}
        <div className="mt-12 grid gap-7 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Special Guest Card: Peggy Gou */}
          <article className="flex flex-col justify-between rounded-md border border-[#14203F]/14 bg-[#14203F] p-6 text-white md:p-8">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#AFC3E2]">
                <span>{SPECIAL_GUEST_SPOTLIGHT.eyebrow}</span>
                <span className="font-kr font-semibold tracking-normal">
                  {SPECIAL_GUEST_SPOTLIGHT.korean}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/25 bg-[#233F7A]">
                  <Disc3 className="h-8 w-8 text-[#CFE0FF]" />
                </div>
                <div>
                  <h3 className="font-display text-[clamp(1.85rem,3vw,2.5rem)] leading-none text-white">
                    {SPECIAL_GUEST_SPOTLIGHT.name}
                  </h3>
                  <p className="mt-1 text-[13.5px] font-medium text-[#AFC3E2]">
                    {SPECIAL_GUEST_SPOTLIGHT.role}
                  </p>
                </div>
              </div>

              <h4 className="mt-5 text-[16px] font-bold text-white">
                {SPECIAL_GUEST_SPOTLIGHT.eventTitle}
              </h4>
              <div className="mt-0.5 text-[12.5px] text-[#AFC3E2]">
                {SPECIAL_GUEST_SPOTLIGHT.dateNote}
              </div>

              <p className="mt-3 text-[14.5px] leading-relaxed text-[#C3CCDD]">
                {SPECIAL_GUEST_SPOTLIGHT.description}
              </p>

              <ul className="mt-5 grid gap-2 border-t border-white/12 pt-4 text-[13.5px] text-[#DCE6F7]">
                {SPECIAL_GUEST_SPOTLIGHT.highlights.map((hl) => (
                  <li key={hl} className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#AFC3E2]" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/12 pt-5">
              <span className="text-[12.5px] text-[#AFC3E2]">
                VIP Pass &amp; Creator Zone Skip-the-Line
              </span>
              <button
                type="button"
                onClick={onOpenBookVip}
                className="rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-[#14203F] hover:bg-[#E7EDF4]"
              >
                Book VIP Skip-the-Line Slot
              </button>
            </div>
          </article>

          {/* In-Store Exclusive Perks + Quarterly Skincare Box */}
          <div className="grid gap-5">
            {/* 4 In-Store Perks */}
            <div className="rounded-md border border-[#14203F]/14 bg-white p-6">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#233F7A]">
                In-Store Customization &amp; Daily Treats{' '}
                <span className="font-kr ml-1.5 font-semibold tracking-normal">스토어 혜택</span>
              </div>
              <h3 className="font-display mt-2 text-[1.75rem] text-[#14203F]">
                Custom keyrings, stickers &amp; fresh Seoul salt bread.
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {INSTORE_LIMITED_PERKS.map((perk) => (
                  <div
                    key={perk.title}
                    className="rounded-md border border-[#14203F]/12 bg-[#F7F9FB] p-4"
                  >
                    <div className="flex items-center justify-between gap-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                      <span>{perk.code}</span>
                      <span className="font-kr font-semibold">{perk.korean}</span>
                    </div>
                    <h4 className="mt-1 text-[14.5px] font-bold text-[#14203F]">{perk.title}</h4>
                    <p className="mt-1 text-[12.5px] text-[#56637E]">{perk.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quarterly Skincare Boxes */}
            <div className="rounded-md border border-[#14203F]/14 bg-[#E7EDF4]/75 p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#233F7A]">
                    Beyond the Pop-up · Subscriptions
                  </div>
                  <h3 className="font-display mt-1 text-[1.6rem] text-[#14203F]">
                    Quarterly K-Lounge Skincare Boxes
                  </h3>
                </div>
                <KeyRound className="h-5 w-5 text-[#233F7A]" />
              </div>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                {QUARTERLY_BOX_EDITIONS.map((box) => {
                  const selected = boxTier === box.title;
                  return (
                    <button
                      key={box.title}
                      type="button"
                      onClick={() => setBoxTier(box.title)}
                      className={`rounded-md border p-3 text-left transition-colors ${
                        selected
                          ? 'border-[#233F7A] bg-white'
                          : 'border-[#14203F]/12 bg-white/60 hover:bg-white'
                      }`}
                    >
                      <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#233F7A]">
                        {box.season.split('·')[0].trim()}
                      </div>
                      <div className="mt-0.5 text-[13.5px] font-bold text-[#14203F]">
                        {box.title}
                      </div>
                      <div className="mt-1 text-[12px] font-semibold text-[#56637E] tabular-nums">
                        €{box.price} / quarter
                      </div>
                    </button>
                  );
                })}
              </div>

              {boxJoined ? (
                <p className="mt-3 text-[13px] font-semibold text-[#233F7A]">{boxJoined}</p>
              ) : (
                <form onSubmit={handleBoxSubscribe} className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="email"
                    value={boxEmail}
                    onChange={(e) => setBoxEmail(e.target.value)}
                    placeholder="Email for Quarterly Box waitlist"
                    aria-label="Email for Quarterly Box waitlist"
                    className="flex-1 rounded-full border border-[#14203F]/18 bg-white px-4 py-2 text-[13.5px] text-[#14203F] focus:border-[#233F7A] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-full bg-[#14203F] px-5 py-2 text-[13px] font-semibold text-white hover:bg-[#233F7A]"
                  >
                    Join Box Waitlist
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
