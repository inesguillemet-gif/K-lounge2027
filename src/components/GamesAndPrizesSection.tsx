import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Copy, Gift, Play, RotateCcw, Sparkles, Trophy, Volume2, VolumeX, Check } from 'lucide-react';
import { PRODUCT_IMAGES } from '../data/assets';
import { ARCADE_PRIZES, ArcadePrize, MEMORY_PAIRS } from '../data/kloungeData';
import { ClaimedPrize } from '../types/klounge';
import { playTone, playVictoryChord } from '../utils/sound';

interface GamesAndPrizesSectionProps {
  glowPoints: number;
  claimedPrizes: ClaimedPrize[];
  onEarnPoints: (amount: number, reason: string) => void;
  onClaimPrize: (prize: ArcadePrize) => void;
  onOpenBag: () => void;
  onToast: (msg: string) => void;
}

interface MemoryCard {
  uid: number;
  pairId: string;
  label: string;
  sub: string;
  korean: string;
  imgKey?: string;
  flipped: boolean;
  matched: boolean;
}

type CatcherState = 'TITLE_MENU' | 'PLAYING' | 'GAME_OVER';

interface FallingItem {
  x: number;
  y: number;
  vy: number;
  radius: number;
  kind: 'drop' | 'cica' | 'pdrn' | 'uv';
  label: string;
  pts: number;
}

function createShuffledDeck(): MemoryCard[] {
  const doubled = [...MEMORY_PAIRS, ...MEMORY_PAIRS].map((item, idx) => ({
    ...item,
    uid: idx,
    flipped: false,
    matched: false,
  }));
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled;
}

export const GamesAndPrizesSection: React.FC<GamesAndPrizesSectionProps> = ({
  glowPoints,
  claimedPrizes,
  onEarnPoints,
  onClaimPrize,
  onOpenBag,
  onToast,
}) => {
  const [activeGame, setActiveGame] = useState<'memory' | 'catcher'>('memory');
  const [muted, setMuted] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // --- Game 1: Seoul Ingredient Memory Match ---
  const [cards, setCards] = useState<MemoryCard[]>(() => createShuffledDeck());
  const [selectedUids, setSelectedUids] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [memoryWon, setMemoryWon] = useState(false);
  const lockBoardRef = useRef(false);

  const resetMemoryGame = () => {
    lockBoardRef.current = false;
    setCards(createShuffledDeck());
    setSelectedUids([]);
    setMoves(0);
    setMemoryWon(false);
    playTone(440, 0.06, 'sine', 0.04, muted);
  };

  const handleCardClick = (uid: number) => {
    if (lockBoardRef.current || memoryWon) return;
    const clicked = cards.find((c) => c.uid === uid);
    if (!clicked || clicked.flipped || clicked.matched) return;

    playTone(540, 0.06, 'sine', 0.04, muted);

    const updated = cards.map((c) => (c.uid === uid ? { ...c, flipped: true } : c));
    const nextSelected = [...selectedUids, uid];
    setCards(updated);
    setSelectedUids(nextSelected);

    if (nextSelected.length === 2) {
      setMoves((m) => m + 1);
      lockBoardRef.current = true;
      const [firstUid, secondUid] = nextSelected;
      const firstCard = updated.find((c) => c.uid === firstUid);
      const secondCard = updated.find((c) => c.uid === secondUid);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        setTimeout(() => {
          setCards((prev) => {
            const matchedDeck = prev.map((c) =>
              c.uid === firstUid || c.uid === secondUid ? { ...c, matched: true } : c
            );
            const allMatched = matchedDeck.every((c) => c.matched);
            if (allMatched) {
              setMemoryWon(true);
              playVictoryChord(muted);
              onEarnPoints(150, 'Completed Seoul Ingredient Match (+150 Glow Points)');
            } else {
              playTone(720, 0.09, 'triangle', 0.05, muted);
            }
            return matchedDeck;
          });
          setSelectedUids([]);
          lockBoardRef.current = false;
        }, 260);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.uid === firstUid || c.uid === secondUid ? { ...c, flipped: false } : c
            )
          );
          setSelectedUids([]);
          lockBoardRef.current = false;
        }, 650);
      }
    }
  };

  const matchedPairsCount = cards.filter((c) => c.matched).length / 2;

  // --- Game 2: Glass Glow Drop Catcher (<canvas>) ---
  const [catcherState, setCatcherState] = useState<CatcherState>('TITLE_MENU');
  const [catcherScore, setCatcherScore] = useState(0);
  const [catcherTimeLeft, setCatcherTimeLeft] = useState(25);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bottleXRef = useRef(0.5); // Normalized 0..1
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const scoreRef = useRef(0);
  const itemsRef = useRef<FallingItem[]>([]);
  const spawnTimerRef = useRef(0);
  const gameEndHandledRef = useRef(false);

  const finishCatcher = useCallback(
    (finalScore: number) => {
      if (gameEndHandledRef.current) return;
      gameEndHandledRef.current = true;
      setCatcherState('GAME_OVER');
      if (finalScore >= 140) {
        playVictoryChord(muted);
        onEarnPoints(150, `Glass Glow Catcher score ${finalScore} (+150 Glow Points)`);
      } else if (finalScore > 0) {
        playTone(580, 0.12, 'triangle', 0.05, muted);
        onEarnPoints(60, `Glass Glow Catcher effort (+60 Glow Points)`);
      }
    },
    [muted, onEarnPoints]
  );

  const startCatcher = () => {
    scoreRef.current = 0;
    itemsRef.current = [];
    spawnTimerRef.current = 0;
    bottleXRef.current = 0.5;
    gameEndHandledRef.current = false;
    setCatcherScore(0);
    setCatcherTimeLeft(25);
    setCatcherState('PLAYING');
    playTone(520, 0.08, 'triangle', 0.05, muted);
  };

  useEffect(() => {
    if (catcherState !== 'PLAYING') return;
    const countdown = window.setInterval(() => {
      setCatcherTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(countdown);
          finishCatcher(scoreRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(countdown);
  }, [catcherState, finishCatcher]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    if (catcherState !== 'PLAYING') return;
    let rafId = 0;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const canvas = canvasRef.current;
      if (!canvas) {
        rafId = requestAnimationFrame(step);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        rafId = requestAnimationFrame(step);
        return;
      }

      const w = canvas.width;
      const h = canvas.height;

      if (keysRef.current.left) bottleXRef.current = Math.max(0.08, bottleXRef.current - 0.72 * dt);
      if (keysRef.current.right) bottleXRef.current = Math.min(0.92, bottleXRef.current + 0.72 * dt);

      spawnTimerRef.current += dt;
      if (spawnTimerRef.current >= 0.44) {
        spawnTimerRef.current = 0;
        const r = Math.random();
        const kind: FallingItem['kind'] =
          r < 0.2 ? 'uv' : r < 0.35 ? 'pdrn' : r < 0.65 ? 'cica' : 'drop';
        itemsRef.current.push({
          x: 28 + Math.random() * (w - 56),
          y: -16,
          vy: kind === 'pdrn' ? 190 : kind === 'uv' ? 175 : 145 + Math.random() * 45,
          radius: kind === 'pdrn' ? 14 : 15,
          kind,
          label: kind === 'drop' ? '5D' : kind === 'cica' ? 'CICA' : kind === 'pdrn' ? 'PDRN' : 'UV',
          pts: kind === 'drop' ? 20 : kind === 'cica' ? 30 : kind === 'pdrn' ? 50 : -25,
        });
      }

      const bx = bottleXRef.current * w;
      const by = h - 38;
      const catchHalfW = 36;

      const nextItems: FallingItem[] = [];
      for (const item of itemsRef.current) {
        item.y += item.vy * dt;
        const hitY = item.y + item.radius >= by - 16 && item.y - item.radius <= by + 14;
        const hitX = Math.abs(item.x - bx) <= catchHalfW + item.radius * 0.5;
        if (hitY && hitX) {
          scoreRef.current = Math.max(0, scoreRef.current + item.pts);
          setCatcherScore(scoreRef.current);
          if (item.kind === 'uv') {
            playTone(190, 0.1, 'sawtooth', 0.04, muted);
          } else {
            playTone(item.kind === 'pdrn' ? 880 : 660, 0.07, 'sine', 0.045, muted);
          }
          continue;
        }
        if (item.y - item.radius <= h + 20) {
          nextItems.push(item);
        }
      }
      itemsRef.current = nextItems;

      // Draw background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#14203F');
      bgGrad.addColorStop(1, '#233F7A');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle horizon grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      for (let gx = 60; gx < w; gx += 60) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }

      // Falling actives
      for (const item of itemsRef.current) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        if (item.kind === 'drop') {
          ctx.fillStyle = '#CFE0FF';
        } else if (item.kind === 'cica') {
          ctx.fillStyle = '#A7E3C6';
        } else if (item.kind === 'pdrn') {
          ctx.fillStyle = '#F7C6D9';
        } else {
          ctx.fillStyle = '#EA5858';
        }
        ctx.fill();
        ctx.fillStyle = item.kind === 'uv' ? '#FFFFFF' : '#14203F';
        ctx.font = '700 9px Manrope, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, item.x, item.y);
        ctx.restore();
      }

      // Draw sleek serum catcher bottle
      ctx.save();
      ctx.fillStyle = '#F7F9FB';
      ctx.beginPath();
      ctx.roundRect(bx - 28, by - 10, 56, 26, 8);
      ctx.fill();
      ctx.fillStyle = '#AFC3E2';
      ctx.fillRect(bx - 10, by - 18, 20, 8);
      ctx.fillStyle = '#14203F';
      ctx.font = '700 9px Manrope, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('K-SERUM', bx, by + 6);
      ctx.restore();

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [catcherState, muted]);

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (catcherState !== 'PLAYING' || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const norm = (e.clientX - rect.left) / rect.width;
    bottleXRef.current = Math.max(0.08, Math.min(0.92, norm));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedCode(code);
    onToast(`Copied reward code ${code}`);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  return (
    <section
      id="games"
      className="scroll-mt-20 bg-[#14203F] py-16 text-white md:py-24"
      aria-label="Glow Arcade and Pop-Up Rewards"
    >
      <div className="mx-auto max-w-[1280px] px-5 md:px-7">
        {/* Top Arcade Header & Live Point HUD */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/15 pb-8 md:flex-row md:items-end">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#AFC3E2]">
              Glow Arcade · Win for the Pop-Up{' '}
              <span className="font-kr ml-1.5 font-semibold tracking-normal">게임 &amp; 혜택</span>
            </div>
            <h2 className="font-display mt-3 text-[clamp(2rem,4vw,3.3rem)] leading-[1.06] text-white">
              Play, earn Glow Points &amp; <em className="italic text-[#C9D7EE]">win gifts</em> for
              Paris.
            </h2>
            <p className="mt-2 max-w-[54ch] text-[15px] text-[#C3CCDD]">
              Win points across two mini-games and unlock complimentary sheet masks, snacks, fast
              passes, and Marais collector totes to claim at 10 rue Pastourelle (March – April · 2 weeks only).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 rounded-md border border-white/15 bg-white/[0.04] px-5 py-3.5">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#AFC3E2]">
                Glow Points
              </div>
              <div className="font-display text-[1.9rem] leading-none text-white tabular-nums">
                {glowPoints}
              </div>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#AFC3E2]">
                Unlocked Gifts
              </div>
              <div className="font-display text-[1.9rem] leading-none text-white tabular-nums">
                {claimedPrizes.length} / {ARCADE_PRIZES.length}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? 'Unmute game audio' : 'Mute game audio'}
              className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-[#AFC3E2] transition-colors hover:border-white hover:text-white"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Main 2-column layout: Left = Playable Games, Right = Pop-Up Prize Redemption */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Playable Game Stage */}
          <div className="rounded-md border border-white/16 bg-white/[0.03] p-5 md:p-7">
            {/* Game switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/12 pb-4">
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Choose mini-game">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeGame === 'memory'}
                  onClick={() => setActiveGame('memory')}
                  className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors duration-150 ${
                    activeGame === 'memory'
                      ? 'bg-white text-[#14203F]'
                      : 'border border-white/25 text-white hover:bg-white/10'
                  }`}
                >
                  01 · Seoul Ingredient Match
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeGame === 'catcher'}
                  onClick={() => setActiveGame('catcher')}
                  className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors duration-150 ${
                    activeGame === 'catcher'
                      ? 'bg-white text-[#14203F]'
                      : 'border border-white/25 text-white hover:bg-white/10'
                  }`}
                >
                  02 · Glass Glow Drop Catcher
                </button>
              </div>

              {activeGame === 'memory' && (
                <div className="flex items-center gap-4 text-[13px] text-[#AFC3E2] tabular-nums">
                  <span>Pairs: {matchedPairsCount}/6</span>
                  <span>Moves: {moves}</span>
                  <button
                    type="button"
                    onClick={resetMemoryGame}
                    className="inline-flex items-center gap-1 font-semibold text-white hover:text-[#AFC3E2]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </button>
                </div>
              )}
            </div>

            {activeGame === 'memory' ? (
              <div className="mt-5">
                <p className="mb-4 text-[13.5px] text-[#C3CCDD]">
                  Match all 6 iconic Seoul formulas &amp; active ingredients to earn{' '}
                  <strong className="text-white">+150 Glow Points</strong>.
                </p>

                {memoryWon ? (
                  <div className="grid place-items-center gap-3 rounded-md border border-white/20 bg-white/[0.06] py-12 text-center">
                    <Trophy className="h-10 w-10 text-[#AFC3E2]" />
                    <h3 className="font-display text-[2rem] text-white">
                      All 6 Seoul Actives Matched
                    </h3>
                    <p className="max-w-[38ch] text-[14.5px] text-[#C3CCDD] tabular-nums">
                      Completed in {moves} moves. +150 Glow Points added to your balance—redeem a
                      pop-up gift on the right.
                    </p>
                    <button
                      type="button"
                      onClick={resetMemoryGame}
                      className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-semibold text-[#14203F] hover:bg-[#E7EDF4]"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Play again
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
                    {cards.map((card) => {
                      const revealed = card.flipped || card.matched;
                      return (
                        <button
                          key={card.uid}
                          type="button"
                          onClick={() => handleCardClick(card.uid)}
                          disabled={card.matched}
                          aria-label={revealed ? `${card.label} ${card.sub}` : 'Hidden formula card'}
                          className={`relative flex aspect-[4/4.6] flex-col items-center justify-center rounded-md border p-2.5 text-center transition-transform duration-150 ${
                            card.matched
                              ? 'border-[#AFC3E2] bg-white text-[#14203F]'
                              : revealed
                              ? 'border-white bg-[#F7F9FB] text-[#14203F]'
                              : 'border-white/15 bg-[#233F7A]/65 text-white hover:-translate-y-0.5 hover:border-white/40'
                          }`}
                        >
                          {revealed ? (
                            <>
                              {card.imgKey && PRODUCT_IMAGES[card.imgKey] && (
                                <img
                                  src={PRODUCT_IMAGES[card.imgKey]}
                                  alt={card.label}
                                  className="h-11 w-11 object-contain sm:h-12 sm:w-12"
                                />
                              )}
                              <span className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#233F7A]">
                                {card.label}
                              </span>
                              <span className="text-[11.5px] font-semibold leading-tight text-[#14203F]">
                                {card.sub}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="font-kr text-[13px] text-[#AFC3E2]">
                                케이 라운지
                              </span>
                              <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">
                                K-Lounge
                              </span>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Game 2: Glass Glow Drop Catcher */
              <div className="mt-5 grid gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#C3CCDD]">
                  <span>
                    Move with mouse, finger, or ← / → keys. Catch 5D Drops (+20), Cica (+30), PDRN
                    (+50). Dodge UV (-25).
                  </span>
                  <div className="flex items-center gap-4 font-semibold text-white tabular-nums">
                    <span>Score: {catcherScore}</span>
                    <span>Time: {catcherTimeLeft}s</span>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-md border border-white/16 bg-[#0F1933]">
                  <canvas
                    ref={canvasRef}
                    width={640}
                    height={340}
                    onPointerMove={handleCanvasPointerMove}
                    onPointerDown={handleCanvasPointerMove}
                    className="block h-[300px] w-full cursor-ew-resize touch-none sm:h-[340px]"
                  />

                  {catcherState === 'TITLE_MENU' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#14203F]/90 p-6 text-center">
                      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#AFC3E2]">
                        25-Second Arcade Challenge
                      </div>
                      <h3 className="font-display text-[2rem] text-white">
                        Glass Glow Drop Catcher
                      </h3>
                      <p className="max-w-[38ch] text-[14px] text-[#C3CCDD]">
                        Score 140+ points to win <strong className="text-white">+150 Glow Points</strong>{' '}
                        toward real Paris pop-up rewards.
                      </p>
                      <button
                        type="button"
                        onClick={startCatcher}
                        className="mt-1 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-[#14203F] transition-transform duration-150 hover:-translate-y-0.5"
                      >
                        <Play className="h-4 w-4 fill-current" />
                        Start 25s round
                      </button>
                    </div>
                  )}

                  {catcherState === 'GAME_OVER' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#14203F]/92 p-6 text-center">
                      <Trophy className="h-9 w-9 text-[#AFC3E2]" />
                      <h3 className="font-display text-[2rem] text-white tabular-nums">
                        Final Score: {catcherScore}
                      </h3>
                      <p className="max-w-[38ch] text-[14px] text-[#C3CCDD]">
                        {catcherScore >= 140
                          ? 'Glass skin mastery! +150 Glow Points added to your Pop-Up Vault.'
                          : catcherScore > 0
                          ? 'Nice catch! +60 Glow Points added—reach 140+ for full 150 bonus.'
                          : 'Missed the actives—give it another quick run!'}
                      </p>
                      <button
                        type="button"
                        onClick={startCatcher}
                        className="mt-1 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-[#14203F]"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Play again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right column: Pop-up Prize Redemption Counter */}
          <div className="grid gap-4 content-start rounded-md border border-white/16 bg-white/[0.03] p-5 md:p-7">
            <div className="flex items-center justify-between gap-2 border-b border-white/12 pb-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#AFC3E2]">
                  Pop-up Gift Counter
                </div>
                <h3 className="font-display mt-1 text-[1.7rem] text-white">
                  Redeem for 10 rue Pastourelle
                </h3>
              </div>
              <Gift className="h-6 w-6 shrink-0 text-[#AFC3E2]" />
            </div>

            <div className="grid gap-3">
              {ARCADE_PRIZES.map((prize) => {
                const claimed = claimedPrizes.find((c) => c.prizeId === prize.id);
                const canAfford = glowPoints >= prize.costPoints;

                return (
                  <div
                    key={prize.id}
                    className={`rounded-md border p-4 transition-colors ${
                      claimed
                        ? 'border-[#AFC3E2]/60 bg-white text-[#14203F]'
                        : 'border-white/14 bg-white/[0.04] text-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div
                          className={`text-[10.5px] font-bold uppercase tracking-[0.14em] ${
                            claimed ? 'text-[#233F7A]' : 'text-[#AFC3E2]'
                          }`}
                        >
                          {prize.tier} ·{' '}
                          <span className="tabular-nums">{prize.costPoints} pts</span>
                        </div>
                        <h4 className="mt-0.5 text-[14.5px] font-bold">{prize.title}</h4>
                        <p
                          className={`mt-1 text-[12.5px] ${
                            claimed ? 'text-[#56637E]' : 'text-[#C3CCDD]'
                          }`}
                        >
                          {prize.detail}
                        </p>
                      </div>

                      {!claimed && (
                        <button
                          type="button"
                          disabled={!canAfford}
                          onClick={() => {
                            playVictoryChord(muted);
                            onClaimPrize(prize);
                          }}
                          className={`shrink-0 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                            canAfford
                              ? 'bg-white text-[#14203F] hover:bg-[#E7EDF4]'
                              : 'border border-white/15 text-white/45 cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? 'Unlock' : `Need ${prize.costPoints - glowPoints}`}
                        </button>
                      )}
                    </div>

                    {claimed && (
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#14203F]/12 pt-2.5">
                        <span className="font-mono text-[13px] font-bold text-[#233F7A] tabular-nums">
                          Code: {claimed.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(claimed.code)}
                          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#14203F] hover:text-[#233F7A]"
                        >
                          {copiedCode === claimed.code ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-[#233F7A]" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              Copy pass
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {claimedPrizes.length > 0 && (
              <button
                type="button"
                onClick={onOpenBag}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-white/20"
              >
                <Sparkles className="h-4 w-4 text-[#AFC3E2]" />
                View all {claimedPrizes.length} saved gift passes in your Visit Bag
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
