import React, { useMemo, useState } from 'react';
import { Calendar, Check, Droplets, Minus, Plus, Sparkles } from 'lucide-react';
import { PRODUCT_IMAGES } from '../data/assets';
import {
  APP_CYCLE_PHASES,
  CYCLE_SYMPTOM_ADVICE,
  PRODUCTS,
  SKIN_PROFILES,
} from '../data/kloungeData';
import { CycleSymptom, CycleTrackingState, QuizSubmission } from '../types/klounge';

interface PeriodTrackerPanelProps {
  cycleState: CycleTrackingState;
  quizResult: QuizSubmission | null;
  onUpdateCycle: (updater: (prev: CycleTrackingState) => CycleTrackingState) => void;
  onAddProduct: (id: string) => void;
  onOpenProduct: (id: string) => void;
  onToast: (msg: string) => void;
}

const formatEur = (n: number) =>
  n.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: n % 1 ? 2 : 0,
  });

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDays(iso: string, offset: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + offset);
  return toIsoDate(dt);
}

function diffDays(fromIso: string, toIso: string): number {
  const [fy, fm, fd] = fromIso.split('-').map(Number);
  const [ty, tm, td] = toIso.split('-').map(Number);
  const a = Date.UTC(fy, fm - 1, fd);
  const b = Date.UTC(ty, tm - 1, td);
  return Math.round((b - a) / 86400000);
}

function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

export const PeriodTrackerPanel: React.FC<PeriodTrackerPanelProps> = ({
  cycleState,
  quizResult,
  onUpdateCycle,
  onAddProduct,
  onOpenProduct,
  onToast,
}) => {
  const todayIso = useMemo(() => toIsoDate(new Date()), []);
  const [previewPhaseId, setPreviewPhaseId] = useState<
    'menstrual' | 'follicular' | 'ovulation' | 'luteal' | null
  >(null);

  const computed = useMemo(() => {
    const rawDiff = diffDays(cycleState.lastPeriodStart, todayIso);
    const len = cycleState.cycleLength;
    const normalizedDay = (((rawDiff % len) + len) % len) + 1;
    const daysUntilNext = len - normalizedDay + 1;
    const nextPeriodIso = addDays(todayIso, daysUntilNext);
    const ovulationDay = Math.max(cycleState.periodLength + 2, len - 14);

    let autoPhaseId: 'menstrual' | 'follicular' | 'ovulation' | 'luteal' = 'luteal';
    if (normalizedDay <= cycleState.periodLength) {
      autoPhaseId = 'menstrual';
    } else if (normalizedDay < ovulationDay - 1) {
      autoPhaseId = 'follicular';
    } else if (normalizedDay <= ovulationDay + 1) {
      autoPhaseId = 'ovulation';
    } else {
      autoPhaseId = 'luteal';
    }

    return {
      cycleDay: normalizedDay,
      daysUntilNext,
      nextPeriodIso,
      ovulationDay,
      autoPhaseId,
    };
  }, [cycleState.lastPeriodStart, cycleState.cycleLength, cycleState.periodLength, todayIso]);

  const activePhaseId = previewPhaseId ?? computed.autoPhaseId;
  const activePhase =
    APP_CYCLE_PHASES.find((p) => p.id === activePhaseId) ?? APP_CYCLE_PHASES[0];
  const phaseIdx = APP_CYCLE_PHASES.findIndex((p) => p.id === activePhaseId);

  // Build 14-day window centered around today (-4 to +9 days)
  const calendarStrip = useMemo(() => {
    const len = cycleState.cycleLength;
    return Array.from({ length: 14 }, (_, idx) => {
      const offset = idx - 4;
      const iso = addDays(todayIso, offset);
      const d = diffDays(cycleState.lastPeriodStart, iso);
      const dayInCycle = (((d % len) + len) % len) + 1;
      const isPredictedPeriod = dayInCycle <= cycleState.periodLength;
      const isLoggedPeriod = cycleState.loggedDays.includes(iso);
      const isOvulationWindow = Math.abs(dayInCycle - computed.ovulationDay) <= 1;
      return {
        iso,
        dayNum: Number(iso.split('-')[2]),
        dayInCycle,
        isToday: iso === todayIso,
        isPeriod: isLoggedPeriod || isPredictedPeriod,
        isLoggedPeriod,
        isOvulationWindow,
      };
    });
  }, [
    cycleState.cycleLength,
    cycleState.lastPeriodStart,
    cycleState.loggedDays,
    cycleState.periodLength,
    computed.ovulationDay,
    todayIso,
  ]);

  const handleToggleDay = (iso: string) => {
    if (diffDays(todayIso, iso) > 0) {
      onToast('Log period dates on or before today');
      return;
    }
    const alreadyLogged = cycleState.loggedDays.includes(iso);
    onUpdateCycle((prev) => ({
      ...prev,
      loggedDays: alreadyLogged
        ? prev.loggedDays.filter((d) => d !== iso)
        : [...prev.loggedDays, iso],
    }));
  };

  const handleMarkPeriodToday = () => {
    onUpdateCycle((prev) => ({
      ...prev,
      lastPeriodStart: todayIso,
      loggedDays: prev.loggedDays.includes(todayIso)
        ? prev.loggedDays
        : [...prev.loggedDays, todayIso],
    }));
    setPreviewPhaseId(null);
    onToast('Period Day 1 logged · Skincare plan switched to Menstrual Barrier Care');
  };

  const handleToggleSymptom = (symptom: CycleSymptom) => {
    onUpdateCycle((prev) => {
      const exists = prev.symptomsToday.includes(symptom);
      return {
        ...prev,
        symptomsToday: exists
          ? prev.symptomsToday.filter((s) => s !== symptom)
          : [...prev.symptomsToday, symptom],
      };
    });
  };

  // Dynamically combine Phase products + logged Symptom bonus products + Quiz match
  const matchedProducts = useMemo(() => {
    const ids = new Set<string>(activePhase.productIds);
    cycleState.symptomsToday.forEach((sym) => {
      ids.add(CYCLE_SYMPTOM_ADVICE[sym].bonusProductId);
    });
    if (quizResult) {
      const quizFirst = SKIN_PROFILES[quizResult.profileKey].productIds[0];
      if (quizFirst) ids.add(quizFirst);
    }
    return [...ids]
      .slice(0, 3)
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [activePhase.productIds, cycleState.symptomsToday, quizResult]);

  const progressArc = Math.round((computed.cycleDay / cycleState.cycleLength) * 301);

  return (
    <div id="cycle-sync" className="scroll-mt-24 grid gap-6">
      {/* Top Tracker Controls + Status Wheel */}
      <div className="grid gap-5 lg:grid-cols-[0.44fr_0.56fr]">
        {/* Left: Live Radial Wheel + Quick Log */}
        <div className="flex flex-col justify-between gap-4 rounded-md border border-[#14203F]/12 bg-[#F7F9FB] p-5">
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 120 120" className="h-28 w-28 shrink-0">
              <circle cx="60" cy="60" r="48" fill="none" stroke="#D9DCDF" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke="#233F7A"
                strokeWidth="8"
                strokeDasharray={`${progressArc} 302`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              <text
                x="60"
                y="54"
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#14203F"
              >
                Day {computed.cycleDay}
              </text>
              <text x="60" y="70" textAnchor="middle" fontSize="9.5" fill="#233F7A" fontWeight="600">
                of {cycleState.cycleLength} · {activePhase.shortName}
              </text>
            </svg>

            <div className="grid gap-1">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                {previewPhaseId ? 'Phase Preview' : 'Your Live Cycle'}
              </div>
              <div className="font-display text-[1.45rem] leading-tight text-[#14203F]">
                {activePhase.shortName} Phase
              </div>
              <div className="font-kr text-[12px] font-semibold text-[#233F7A]">
                {activePhase.korean}
              </div>
              <div className="text-[12.5px] text-[#56637E] tabular-nums">
                Next period in <strong className="text-[#14203F]">{computed.daysUntilNext}d</strong>{' '}
                ({formatShortDate(computed.nextPeriodIso)})
              </div>
            </div>
          </div>

          {/* Period Start Date & Length Steppers */}
          <div className="grid gap-3 border-t border-[#14203F]/12 pt-4">
            <label className="grid gap-1 text-[12px] font-semibold text-[#56637E]">
              <span>Last period start date</span>
              <input
                type="date"
                max={todayIso}
                value={cycleState.lastPeriodStart}
                onChange={(e) => {
                  if (!e.target.value) return;
                  setPreviewPhaseId(null);
                  onUpdateCycle((prev) => ({
                    ...prev,
                    lastPeriodStart: e.target.value,
                  }));
                }}
                className="rounded border border-[#14203F]/18 bg-white px-3 py-1.5 text-[13.5px] font-semibold text-[#14203F] focus:border-[#233F7A] focus:outline-none"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded border border-[#14203F]/12 bg-white px-3 py-2">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#56637E]">
                  Cycle Length
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <button
                    type="button"
                    aria-label="Decrease cycle length"
                    onClick={() =>
                      onUpdateCycle((p) => ({ ...p, cycleLength: Math.max(21, p.cycleLength - 1) }))
                    }
                    className="rounded border border-[#14203F]/15 p-1 text-[#14203F] hover:border-[#233F7A]"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-[13.5px] font-bold text-[#14203F] tabular-nums">
                    {cycleState.cycleLength}d
                  </span>
                  <button
                    type="button"
                    aria-label="Increase cycle length"
                    onClick={() =>
                      onUpdateCycle((p) => ({ ...p, cycleLength: Math.min(35, p.cycleLength + 1) }))
                    }
                    className="rounded border border-[#14203F]/15 p-1 text-[#14203F] hover:border-[#233F7A]"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="rounded border border-[#14203F]/12 bg-white px-3 py-2">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#56637E]">
                  Period Days
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <button
                    type="button"
                    aria-label="Decrease period days"
                    onClick={() =>
                      onUpdateCycle((p) => ({
                        ...p,
                        periodLength: Math.max(3, p.periodLength - 1),
                      }))
                    }
                    className="rounded border border-[#14203F]/15 p-1 text-[#14203F] hover:border-[#233F7A]"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-[13.5px] font-bold text-[#14203F] tabular-nums">
                    {cycleState.periodLength}d
                  </span>
                  <button
                    type="button"
                    aria-label="Increase period days"
                    onClick={() =>
                      onUpdateCycle((p) => ({
                        ...p,
                        periodLength: Math.min(7, p.periodLength + 1),
                      }))
                    }
                    className="rounded border border-[#14203F]/15 p-1 text-[#14203F] hover:border-[#233F7A]"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleMarkPeriodToday}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#14203F] px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-[#233F7A]"
            >
              <Droplets className="h-3.5 w-3.5" />
              Log period started today
            </button>
          </div>
        </div>

        {/* Right: 14-Day Period Calendar + Symptom Check-In */}
        <div className="grid content-between gap-4">
          {/* 14-Day Strip */}
          <div className="rounded-md border border-[#14203F]/12 bg-[#F7F9FB] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                <Calendar className="h-3.5 w-3.5" />
                <span>14-Day Cycle Window (Click past/today to log period)</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#56637E]">
                <span>■ Period / Est.</span>
                <span>○ Fertile / Ovulation</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1.5">
              {calendarStrip.map((cell) => (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => handleToggleDay(cell.iso)}
                  title={`Cycle Day ${cell.dayInCycle} (${formatShortDate(cell.iso)})`}
                  className={`flex flex-col items-center rounded border py-1.5 text-center transition-colors ${
                    cell.isPeriod
                      ? 'border-[#233F7A] bg-[#233F7A] text-white'
                      : cell.isOvulationWindow
                      ? 'border-[#233F7A]/45 bg-[#E7EDF4] text-[#14203F]'
                      : 'border-[#14203F]/12 bg-white text-[#14203F] hover:border-[#233F7A]'
                  } ${cell.isToday ? 'ring-2 ring-[#14203F] ring-offset-1' : ''}`}
                >
                  <span className="text-[10px] opacity-75 tabular-nums">D{cell.dayInCycle}</span>
                  <span className="text-[12.5px] font-bold tabular-nums">{cell.dayNum}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms Today Check-in */}
          <div className="rounded-md border border-[#14203F]/12 bg-[#F7F9FB] p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
              How does your skin feel today? (Links to skincare advice)
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {(Object.keys(CYCLE_SYMPTOM_ADVICE) as CycleSymptom[]).map((sym) => {
                const active = cycleState.symptomsToday.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    aria-pressed={active}
                    onClick={() => handleToggleSymptom(sym)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                      active
                        ? 'bg-[#14203F] text-white'
                        : 'border border-[#14203F]/15 bg-white text-[#14203F] hover:border-[#233F7A]'
                    }`}
                  >
                    {active && <Check className="h-3 w-3 text-[#AFC3E2]" />}
                    {CYCLE_SYMPTOM_ADVICE[sym].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4-Phase Switcher for Planning Ahead */}
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {APP_CYCLE_PHASES.map((phase) => {
              const isCurrent = phase.id === activePhaseId;
              const isAuto = phase.id === computed.autoPhaseId;
              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() =>
                    setPreviewPhaseId(phase.id === computed.autoPhaseId ? null : phase.id)
                  }
                  className={`rounded border px-2.5 py-2 text-left text-[11.5px] font-semibold transition-colors ${
                    isCurrent
                      ? 'border-[#233F7A] bg-[#14203F] text-white'
                      : 'border-[#14203F]/12 bg-[#F7F9FB] text-[#56637E] hover:text-[#14203F]'
                  }`}
                >
                  <div>{phase.shortName}</div>
                  <div className="text-[10px] opacity-80">
                    {isAuto ? 'Current Phase' : `Phase 0${APP_CYCLE_PHASES.indexOf(phase) + 1}`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Linked Skincare Prescription Card */}
      <div className="rounded-md border border-[#14203F]/14 bg-[#E7EDF4]/75 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#14203F]/12 pb-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#233F7A]">
              Cycle-Linked Skincare Prescription · Phase 0{phaseIdx + 1}
              {quizResult ? ` + ${SKIN_PROFILES[quizResult.profileKey].title}` : ''}
            </div>
            <h4 className="font-display mt-1 text-[1.45rem] text-[#14203F]">{activePhase.focus}</h4>
          </div>
          <span className="text-[12px] font-semibold text-[#56637E]">{activePhase.hormoneState}</span>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="grid gap-2 text-[13.5px]">
            <div>
              <strong className="text-[#14203F]">Biology Impact: </strong>
              <span className="text-[#56637E]">{activePhase.skinImpact}</span>
            </div>
            <div>
              <strong className="text-[#14203F]">Morning Rhythm: </strong>
              <span className="text-[#56637E]">{activePhase.morningRoutine}</span>
            </div>
            <div>
              <strong className="text-[#14203F]">Evening Rhythm: </strong>
              <span className="text-[#56637E]">{activePhase.eveningRoutine}</span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1 text-[12.5px] font-semibold">
              <span className="text-[#233F7A]">Favor: {activePhase.ingredient}</span>
              <span className="text-[#56637E]">Note: {activePhase.avoidOrPause}</span>
            </div>

            {cycleState.symptomsToday.length > 0 && (
              <div className="mt-1 rounded border border-[#233F7A]/20 bg-white p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Symptom Adjustments Today</span>
                </div>
                <ul className="mt-1.5 grid gap-1 text-[12.5px] text-[#14203F]">
                  {cycleState.symptomsToday.map((sym) => (
                    <li key={sym}>
                      <strong>{CYCLE_SYMPTOM_ADVICE[sym].label}:</strong>{' '}
                      <span className="text-[#56637E]">{CYCLE_SYMPTOM_ADVICE[sym].tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Direct Matched K-Lounge Products for this Phase */}
          <div className="grid content-start gap-2.5">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#56637E]">
              Recommended Formulations for Today
            </div>
            {matchedProducts.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded border border-[#14203F]/12 bg-white p-2.5"
              >
                <button
                  type="button"
                  onClick={() => onOpenProduct(item.id)}
                  className="h-12 w-12 shrink-0 rounded bg-[#F7F9FB] p-1"
                  aria-label={`Inspect ${item.name}`}
                >
                  <img
                    src={PRODUCT_IMAGES[item.img]}
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#56637E]">
                    {item.brand}
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenProduct(item.id)}
                    className="truncate text-left text-[13.5px] font-semibold text-[#14203F] hover:text-[#233F7A]"
                  >
                    {item.name}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right tabular-nums">
                    <div className="flex items-baseline justify-end gap-1.5">
                      <span className="font-display text-[1.05rem] text-[#14203F]">
                        {formatEur(item.price)}
                      </span>
                      <span className="text-[11px] text-[#56637E] line-through">
                        {formatEur(item.originalPrice)}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-[#233F7A]">
                      -{item.discountPercent}% Pop-Up
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddProduct(item.id)}
                    className="rounded-full bg-[#233F7A] px-3 py-1.5 text-[11.5px] font-semibold text-white hover:bg-[#14203F]"
                  >
                    + Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
