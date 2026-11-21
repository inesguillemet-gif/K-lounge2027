import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Check, RotateCcw, ShoppingBag, Smartphone, Sparkles } from 'lucide-react';
import { PRODUCT_IMAGES } from '../data/assets';
import {
  PRODUCTS,
  QUIZ_QUESTIONS,
  SKIN_PROFILES,
  SkinProfileKey,
} from '../data/kloungeData';
import { QuizSubmission } from '../types/klounge';

interface SkinQuizSectionProps {
  quizResult: QuizSubmission | null;
  onCompleteQuiz: (result: QuizSubmission) => void;
  onAddProductsToBag: (productIds: string[]) => void;
  onOpenProduct: (id: string) => void;
  onBookWithQuiz: () => void;
  onSyncToApp: () => void;
  onSyncToCycle: () => void;
}

const formatEur = (n: number) =>
  n.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: n % 1 ? 2 : 0,
  });

export const SkinQuizSection: React.FC<SkinQuizSectionProps> = ({
  quizResult,
  onCompleteQuiz,
  onAddProductsToBag,
  onOpenProduct,
  onBookWithQuiz,
  onSyncToApp,
  onSyncToCycle,
}) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(quizResult?.answers ?? {});
  const [showResult, setShowResult] = useState(Boolean(quizResult));

  const currentQuestion = QUIZ_QUESTIONS[step];

  const evaluateQuiz = (finalAnswers: Record<string, string>): QuizSubmission => {
    const scores: Record<SkinProfileKey, number> = {
      barrier: 0,
      hydration: 0,
      calm: 0,
      balance: 0,
    };
    let hairNeed: 'repair' | 'light' = 'repair';

    QUIZ_QUESTIONS.forEach((q) => {
      const selectedId = finalAnswers[q.id];
      const opt = q.options.find((o) => o.id === selectedId);
      if (!opt) return;
      (Object.keys(opt.weights) as SkinProfileKey[]).forEach((k) => {
        scores[k] += opt.weights[k] ?? 0;
      });
      if (opt.hair) {
        hairNeed = opt.hair;
      }
    });

    const winner = (Object.entries(scores) as Array<[SkinProfileKey, number]>).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    return {
      profileKey: winner,
      hairNeed,
      answers: finalAnswers,
      completedAt: new Date().toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric',
      }),
    };
  };

  const handleSelectOption = (optionId: string) => {
    const nextAnswers = { ...answers, [currentQuestion.id]: optionId };
    setAnswers(nextAnswers);

    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      const submission = evaluateQuiz(nextAnswers);
      onCompleteQuiz(submission);
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setStep(0);
    setShowResult(false);
  };

  const activeSubmission = quizResult ?? (showResult ? evaluateQuiz(answers) : null);
  const profile = activeSubmission ? SKIN_PROFILES[activeSubmission.profileKey] : null;

  const matchedProducts = useMemo(() => {
    if (!profile || !activeSubmission) return [];
    const faceIds = profile.productIds.slice(0, 2);
    const hairId =
      activeSubmission.hairNeed === 'repair' ? 'unove-treatment' : 'unove-oil';
    const ids = [...faceIds, hairId];
    return ids
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [profile, activeSubmission]);

  const progressPct = Math.round(((step + 1) / QUIZ_QUESTIONS.length) * 100);

  return (
    <section
      id="quiz"
      className="scroll-mt-20 border-y border-[#14203F]/12 bg-[#E7EDF4]/75 py-16 md:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-5 md:px-7">
        <div className="grid items-end gap-5 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#233F7A]">
              Skin &amp; Scalp Pre-Test{' '}
              <span className="font-kr ml-1.5 font-semibold tracking-normal">피부 테스트</span>
            </div>
            <h2 className="font-display mt-3 text-[clamp(2rem,4vw,3.3rem)] leading-[1.06] text-[#14203F]">
              Test your skin before stepping into the lounge.
            </h2>
          </div>
          <p className="max-w-[46ch] text-[15px] text-[#56637E]">
            Five quick questions evaluate your barrier, hydration reserve, and scalp needs—matching
            a tailored K-Lounge routine and unlocking +50 Glow Points for pop-up gifts.
          </p>
        </div>

        <div className="mt-8 rounded-md border border-[#14203F]/14 bg-white p-6 md:p-9">
          {!showResult || !profile || !activeSubmission ? (
            <div className="grid items-center gap-8 lg:grid-cols-[1.22fr_0.78fr]">
              <div className="grid gap-6">
                {/* Progress header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#14203F]/12 pb-4">
                  <div className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.15em] text-[#233F7A]">
                    <span>{currentQuestion.stepLabel}</span>
                    <span className="text-[#14203F]/30">/</span>
                    <span className="text-[#56637E] tabular-nums">
                      Question {step + 1} of {QUIZ_QUESTIONS.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[#E7EDF4]">
                      <div
                        className="h-full bg-[#233F7A] transition-[width] duration-200"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-semibold text-[#56637E] tabular-nums">
                      {progressPct}%
                    </span>
                  </div>
                </div>

                <h3 className="font-display max-w-[26ch] text-[clamp(1.6rem,2.8vw,2.25rem)] leading-[1.12] text-[#14203F]">
                  {currentQuestion.question}
                </h3>

                <div className="grid gap-3 md:grid-cols-2">
                  {currentQuestion.options.map((opt) => {
                    const selected = answers[currentQuestion.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(opt.id)}
                        className={`group flex flex-col justify-between gap-2 rounded-md border p-5 text-left transition-all duration-150 ${
                          selected
                            ? 'border-[#233F7A] bg-[#E7EDF4]/70'
                            : 'border-[#14203F]/14 bg-[#F7F9FB] hover:-translate-y-0.5 hover:border-[#233F7A] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-[15.5px] font-semibold text-[#14203F]">
                            {opt.label}
                          </span>
                          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#233F7A] opacity-60 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </div>
                        <span className="text-[13.5px] text-[#56637E]">{opt.detail}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2 text-[13px]">
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#56637E] transition-colors hover:text-[#14203F] disabled:opacity-35"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous step
                  </button>
                  <span className="text-[#56637E]">+50 Glow Points on completion</span>
                </div>
              </div>

              {/* Editorial Skin Analysis Visual Pair */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                <figure className="relative overflow-hidden rounded-md border border-[#14203F]/12 bg-[#F7F9FB]">
                  <img
                    src="/assets/aistudio/IMG_3995_3e3bab87.jpeg"
                    alt="Digital AI skin mapping scan grid across facial zones"
                    className="aspect-[4/3.2] w-full object-cover object-top"
                  />
                  <figcaption className="border-t border-[#14203F]/10 bg-white px-3.5 py-2 text-[11.5px] font-semibold text-[#56637E]">
                    01 · AI Dermal Zone Mapping
                  </figcaption>
                </figure>
                <figure className="relative overflow-hidden rounded-md border border-[#14203F]/12 bg-[#F7F9FB]">
                  <img
                    src="/assets/aistudio/IMG_3997_767e0c73.png"
                    alt="Clinical K-beauty skincare consultation with precision serum droppers"
                    className="aspect-[4/3.2] w-full object-cover object-top"
                  />
                  <figcaption className="border-t border-[#14203F]/10 bg-white px-3.5 py-2 text-[11.5px] font-semibold text-[#56637E]">
                    02 · Active Formula Advice
                  </figcaption>
                </figure>
              </div>
            </div>
          ) : (
            <div className="grid gap-8">
              {/* Result header */}
              <div className="flex flex-col justify-between gap-4 border-b border-[#14203F]/12 pb-6 md:flex-row md:items-end">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#233F7A]">
                    <span>Your K-Lounge Skin Dossier</span>
                    <span className="text-[#14203F]/30">·</span>
                    <span className="font-kr font-semibold tracking-normal">{profile.korean}</span>
                  </div>
                  <h3 className="font-display mt-2 text-[clamp(1.9rem,3.4vw,2.8rem)] text-[#14203F]">
                    {profile.title}
                  </h3>
                  <p className="mt-1 text-[15px] font-medium text-[#233F7A]">{profile.tagline}</p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={onSyncToCycle}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#233F7A] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#14203F]"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    Link with Period Tracker
                  </button>
                  <button
                    type="button"
                    onClick={onSyncToApp}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#14203F]/20 bg-[#F7F9FB] px-4 py-2 text-[13px] font-semibold text-[#14203F] hover:border-[#233F7A] hover:bg-white"
                  >
                    <Smartphone className="h-3.5 w-3.5 text-[#233F7A]" />
                    Sync to App Avatar
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#14203F]/20 bg-white px-4 py-2 text-[13px] font-semibold text-[#56637E] hover:text-[#14203F]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Retake quiz
                  </button>
                </div>
              </div>

              {/* Analysis grid + Regimen prescription */}
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="grid gap-5 content-start">
                  <p className="text-[15.5px] leading-relaxed text-[#56637E]">{profile.summary}</p>

                  {/* Deterministic balance bars */}
                  <div className="grid gap-3.5 rounded-md border border-[#14203F]/12 bg-[#F7F9FB] p-5">
                    <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#233F7A]">
                      Diagnostic Index
                    </div>
                    {[
                      { label: 'Hydration Demand', value: profile.metrics.hydrationNeed },
                      { label: 'Barrier Support', value: profile.metrics.barrierFocus },
                      { label: 'Calming Priority', value: profile.metrics.soothingPriority },
                    ].map((metric) => (
                      <div key={metric.label} className="grid gap-1.5">
                        <div className="flex items-center justify-between text-[13px] font-semibold text-[#14203F]">
                          <span>{metric.label}</span>
                          <span className="tabular-nums text-[#233F7A]">{metric.value}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#D9DCDF]">
                          <div
                            className="h-full bg-[#233F7A]"
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-3 border-t border-[#14203F]/12 pt-4 text-[14px]">
                    <div>
                      <strong className="text-[#14203F]">Morning Rhythm: </strong>
                      <span className="text-[#56637E]">{profile.morningTip}</span>
                    </div>
                    <div>
                      <strong className="text-[#14203F]">Evening Rhythm: </strong>
                      <span className="text-[#56637E]">{profile.eveningTip}</span>
                    </div>
                    <div>
                      <strong className="text-[#14203F]">Scalp &amp; Hair Track: </strong>
                      <span className="text-[#56637E]">
                        {activeSubmission.hairNeed === 'repair'
                          ? 'Deep keratin-protein restoration with UNOVE Treatment EX.'
                          : 'Weightless floral-silk shine with UNOVE Silk Oil Essence.'}
                      </span>
                    </div>
                  </div>

                  {/* Editorial Skincare Advice Visual Pair */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <img
                      src="/assets/aistudio/IMG_3993_2d9ba951.jpeg"
                      alt="Printed My Skin Report skincare advice dossier"
                      className="aspect-[4/3] w-full rounded border border-[#14203F]/12 object-cover object-top"
                    />
                    <img
                      src="/assets/aistudio/IMG_3997_767e0c73.png"
                      alt="Korean skincare formulation serum dropper application"
                      className="aspect-[4/3] w-full rounded border border-[#14203F]/12 object-cover object-top"
                    />
                  </div>
                </div>

                {/* Matched 3-product routine */}
                <div className="grid gap-4 content-start rounded-md border border-[#14203F]/12 bg-[#F7F9FB] p-5 md:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#233F7A]">
                      Your 3-Step Pop-Up Prescription
                    </span>
                    <span className="text-[12.5px] font-semibold text-[#56637E]">
                      Test live at 10 rue Pastourelle
                    </span>
                  </div>

                  <div className="grid gap-3">
                    {matchedProducts.map((p, idx) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-4 rounded-md border border-[#14203F]/10 bg-white p-3"
                      >
                        <button
                          type="button"
                          onClick={() => onOpenProduct(p.id)}
                          className="h-16 w-16 shrink-0 overflow-hidden rounded bg-[#E7EDF4]/70"
                          aria-label={`Inspect ${p.name}`}
                        >
                          <img
                            src={PRODUCT_IMAGES[p.img]}
                            alt={p.name}
                            className="h-full w-full object-contain p-1.5"
                          />
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#56637E]">
                            Step 0{idx + 1} · {p.brand}
                          </div>
                          <button
                            type="button"
                            onClick={() => onOpenProduct(p.id)}
                            className="truncate text-left font-display text-[1.1rem] text-[#14203F] hover:text-[#233F7A]"
                          >
                            {p.name}
                          </button>
                          <div className="text-[12.5px] text-[#56637E]">{p.keyActive}</div>
                        </div>
                        <div className="text-right tabular-nums">
                          <div className="flex items-baseline justify-end gap-1.5">
                            <span className="font-display text-[1.15rem] text-[#14203F]">
                              {formatEur(p.price)}
                            </span>
                            <span className="text-[11.5px] text-[#56637E] line-through">
                              {formatEur(p.originalPrice)}
                            </span>
                          </div>
                          <div className="text-[11px] font-semibold text-[#233F7A]">
                            -{p.discountPercent}% · {p.size}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => onAddProductsToBag(matchedProducts.map((p) => p.id))}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#233F7A] px-5 py-3 text-[13.5px] font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[#14203F]"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Reserve routine in bag
                    </button>
                    <button
                      type="button"
                      onClick={onBookWithQuiz}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#14203F]/20 bg-white px-5 py-3 text-[13.5px] font-semibold text-[#14203F] transition-colors hover:border-[#233F7A]"
                    >
                      <Check className="h-4 w-4 text-[#233F7A]" />
                      Verify with in-store scan
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[12.5px] font-medium text-[#233F7A]">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    Your Skin Quiz profile is attached and unlocked +50 Glow Points in the Arcade.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
