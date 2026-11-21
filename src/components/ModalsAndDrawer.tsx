import React, { useEffect, useState } from 'react';
import { Check, Copy, Gift, Minus, Plus, QrCode, Smartphone, X } from 'lucide-react';
import { PRODUCT_IMAGES } from '../data/assets';
import { PASSPORT_CUSTOMS_PACK, PRODUCTS, SKIN_PROFILES } from '../data/kloungeData';
import { ClaimedPrize, PassportProgress, QuizSubmission } from '../types/klounge';

interface ModalsAndDrawerProps {
  bookOpen: boolean;
  onOpenBook: () => void;
  onCloseBook: () => void;
  productId: string | null;
  onCloseProduct: () => void;
  appModalOpen: boolean;
  onCloseAppModal: () => void;
  drawerOpen: boolean;
  onCloseDrawer: () => void;
  bag: Record<string, number>;
  onUpdateQty: (id: string, delta: number) => void;
  onAddProduct: (id: string) => void;
  onReserveBag: () => void;
  claimedPrizes: ClaimedPrize[];
  passport: PassportProgress;
  quizResult: QuizSubmission | null;
  glowPoints: number;
  onExploreShop: () => void;
  onToast: (msg: string) => void;
  toastMsg: string | null;
}

const formatEur = (n: number) =>
  n.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: n % 1 ? 2 : 0,
  });

export const ModalsAndDrawer: React.FC<ModalsAndDrawerProps> = ({
  bookOpen,
  onOpenBook,
  onCloseBook,
  productId,
  onCloseProduct,
  appModalOpen,
  onCloseAppModal,
  drawerOpen,
  onCloseDrawer,
  bag,
  onUpdateQty,
  onAddProduct,
  onReserveBag,
  claimedPrizes,
  passport,
  quizResult,
  glowPoints,
  onExploreShop,
  onToast,
  toastMsg,
}) => {
  // Diagnosis Booking form state
  const [bName, setBName] = useState('');
  const [bEmail, setBEmail] = useState('');
  const [bType, setBType] = useState<'Skin + Hair' | 'Skin' | 'Hair' | 'VIP Skip-the-Line'>(
    'Skin + Hair'
  );
  const [bWeek, setBWeek] = useState<'Week 1 · March (23–29)' | 'Week 2 · April (Mar 30–Apr 5)'>(
    'Week 1 · March (23–29)'
  );
  const [bSlot, setBSlot] = useState('Weekday afternoon');
  const [bErr, setBErr] = useState(false);
  const [bDoneText, setBDoneText] = useState<string | null>(null);

  // App Access form state
  const [appEmail, setAppEmail] = useState('');
  const [appDevice, setAppDevice] = useState<'iOS' | 'Android'>('iOS');
  const [appPassCode, setAppPassCode] = useState<string>('KL-APP-2026');
  const [appRequested, setAppRequested] = useState(false);
  const [appErr, setAppErr] = useState(false);

  const product = productId ? PRODUCTS.find((p) => p.id === productId) : null;
  const anyOverlayOpen = bookOpen || Boolean(product) || appModalOpen || drawerOpen;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseBook();
        onCloseProduct();
        onCloseAppModal();
        onCloseDrawer();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCloseBook, onCloseProduct, onCloseAppModal, onCloseDrawer]);

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = bName.trim();
    const m = bEmail.trim();
    if (!n || !/^\S+@\S+\.\S+$/.test(m)) {
      setBErr(true);
      return;
    }
    setBErr(false);
    const quizNote = quizResult
      ? ` Your ${SKIN_PROFILES[quizResult.profileKey].title} quiz dossier is attached.`
      : '';
    setBDoneText(
      `Thank you ${n}. Your ${bType} request for ${bWeek} (${bSlot.toLowerCase()}) at 10 rue Pastourelle is confirmed.${quizNote} We emailed your visit summary to ${m}.`
    );
  };

  const handleCloseBook = () => {
    setBErr(false);
    setBDoneText(null);
    onCloseBook();
  };

  const handleAppRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const m = appEmail.trim();
    if (!/^\S+@\S+\.\S+$/.test(m)) {
      setAppErr(true);
      return;
    }
    setAppErr(false);
    const rnd = Math.floor(1000 + Math.random() * 8999);
    setAppPassCode(`KL-${appDevice.toUpperCase()}-${rnd}`);
    setAppRequested(true);
  };

  const bagItems = Object.entries(bag)
    .map(([id, qty]) => {
      const item = PRODUCTS.find((p) => p.id === id);
      return item && qty > 0 ? { product: item, qty } : null;
    })
    .filter((x): x is { product: (typeof PRODUCTS)[number]; qty: number } => Boolean(x));

  const bagTotal = bagItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const bagRetailTotal = bagItems.reduce(
    (sum, item) => sum + item.product.originalPrice * item.qty,
    0
  );
  const bagSavings = Math.max(0, bagRetailTotal - bagTotal);

  return (
    <>
      {/* Backdrop */}
      {anyOverlayOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#14203F]/45 backdrop-blur-[2px]"
          onClick={() => {
            handleCloseBook();
            onCloseProduct();
            onCloseAppModal();
            onCloseDrawer();
          }}
        />
      )}

      {/* Diagnosis Booking Modal */}
      {bookOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="bookModalTitle"
          className="fixed top-1/2 left-1/2 z-[60] max-h-[calc(100vh-40px)] w-[min(560px,calc(100vw-28px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-[#14203F]/15 bg-[#F7F9FB] p-6 shadow-2xl md:p-8"
        >
          <button
            type="button"
            onClick={handleCloseBook}
            aria-label="Close booking dialog"
            className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#14203F]/15 bg-white text-[#14203F] hover:border-[#233F7A]"
          >
            <X className="h-4 w-4" />
          </button>

          {!bDoneText ? (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#233F7A]">
                Free · In store · March – April (2 Weeks){' '}
                <span className="font-kr ml-1.5 font-semibold tracking-normal">진단</span>
              </div>
              <h3 id="bookModalTitle" className="font-display mt-2 text-[1.95rem] text-[#14203F]">
                Book your Skin + Hair Diagnosis
              </h3>

              {quizResult && (
                <div className="mt-3 rounded border border-[#233F7A]/25 bg-[#E7EDF4] px-3.5 py-2.5 text-[13px] text-[#14203F]">
                  <strong className="text-[#233F7A]">Attached Quiz Profile:</strong>{' '}
                  {SKIN_PROFILES[quizResult.profileKey].title} (
                  {quizResult.hairNeed === 'repair' ? 'Deep Repair Scalp' : 'Lightweight Shine'})
                </div>
              )}

              <form onSubmit={handleBookSubmit} noValidate className="mt-5 grid gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1 text-[12px] font-semibold text-[#56637E]">
                    <span>First name</span>
                    <input
                      type="text"
                      value={bName}
                      onChange={(e) => setBName(e.target.value)}
                      autoComplete="given-name"
                      placeholder="Chloé"
                      className="rounded-md border border-[#14203F]/15 bg-white px-3.5 py-2.5 text-[14.5px] text-[#14203F] focus:border-[#233F7A] focus:outline-none"
                    />
                  </label>
                  <label className="grid gap-1 text-[12px] font-semibold text-[#56637E]">
                    <span>Email</span>
                    <input
                      type="email"
                      value={bEmail}
                      onChange={(e) => setBEmail(e.target.value)}
                      autoComplete="email"
                      placeholder="chloe@email.com"
                      className="rounded-md border border-[#14203F]/15 bg-white px-3.5 py-2.5 text-[14.5px] text-[#14203F] focus:border-[#233F7A] focus:outline-none"
                    />
                  </label>
                </div>

                <div className="grid gap-1.5">
                  <span className="text-[12px] font-semibold text-[#56637E]">Experience / Pass</span>
                  <div className="flex flex-wrap gap-2">
                    {(['Skin + Hair', 'Skin', 'Hair', 'VIP Skip-the-Line'] as const).map(
                      (typeOption) => (
                        <button
                          key={typeOption}
                          type="button"
                          onClick={() => setBType(typeOption)}
                          className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                            bType === typeOption
                              ? 'bg-[#233F7A] text-white'
                              : 'border border-[#14203F]/15 bg-white text-[#14203F]'
                          }`}
                        >
                          {typeOption}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1 text-[12px] font-semibold text-[#56637E]">
                    <span>Pop-up Week (2 Weeks Only)</span>
                    <select
                      value={bWeek}
                      onChange={(e) =>
                        setBWeek(
                          e.target.value as
                            | 'Week 1 · March (23–29)'
                            | 'Week 2 · April (Mar 30–Apr 5)'
                        )
                      }
                      className="rounded-md border border-[#14203F]/15 bg-white px-3.5 py-2.5 text-[14.5px] text-[#14203F] focus:border-[#233F7A] focus:outline-none"
                    >
                      <option value="Week 1 · March (23–29)">Week 1 · March 23 – 29</option>
                      <option value="Week 2 · April (Mar 30–Apr 5)">
                        Week 2 · March 30 – April 5
                      </option>
                    </select>
                  </label>

                  <label className="grid gap-1 text-[12px] font-semibold text-[#56637E]">
                    <span>Preferred time</span>
                    <select
                      value={bSlot}
                      onChange={(e) => setBSlot(e.target.value)}
                      className="rounded-md border border-[#14203F]/15 bg-white px-3.5 py-2.5 text-[14.5px] text-[#14203F] focus:border-[#233F7A] focus:outline-none"
                    >
                      <option>Weekday morning</option>
                      <option>Weekday afternoon</option>
                      <option>Weekday evening</option>
                      <option>Weekend</option>
                    </select>
                  </label>
                </div>

                {bErr && (
                  <p className="text-[13px] font-medium text-[#A3263A]">
                    Please enter your first name and a valid email so we can confirm your slot.
                  </p>
                )}

                <button
                  type="submit"
                  className="mt-1 rounded-full bg-[#233F7A] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#14203F]"
                >
                  Request my free slot
                </button>
                <p className="text-[12px] text-[#56637E]">
                  Hosted at 10 rue Pastourelle, 75003 Paris · Tue–Sun 11:00–20:00.
                </p>
              </form>
            </div>
          ) : (
            <div className="grid gap-4 py-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#233F7A] text-white">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="font-display text-[1.85rem] text-[#14203F]">Request received</h3>
              <p className="text-[14.5px] text-[#56637E]">{bDoneText}</p>
              <button
                type="button"
                onClick={handleCloseBook}
                className="mx-auto mt-1 rounded-full border border-[#14203F]/20 bg-white px-6 py-2.5 text-[13.5px] font-semibold text-[#14203F]"
              >
                Back to K-Lounge
              </button>
            </div>
          )}
        </div>
      )}

      {/* Product Detail Modal */}
      {product && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${product.brand} ${product.name}`}
          className="fixed top-1/2 left-1/2 z-[60] max-h-[calc(100vh-40px)] w-[min(680px,calc(100vw-28px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-[#14203F]/15 bg-[#F7F9FB] p-6 shadow-2xl md:p-8"
        >
          <button
            type="button"
            onClick={onCloseProduct}
            aria-label="Close product details"
            className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#14203F]/15 bg-white text-[#14203F] hover:border-[#233F7A]"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="grid items-center gap-6 sm:grid-cols-[0.9fr_1.1fr]">
            <div className="aspect-square overflow-hidden rounded-md bg-white p-6">
              <img
                src={PRODUCT_IMAGES[product.img]}
                alt={`${product.brand} ${product.name}`}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="grid gap-3">
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#233F7A]">
                {product.brand} · {product.cat}
              </div>
              <h3 className="font-display text-[1.75rem] leading-[1.1] text-[#14203F]">
                {product.name}
              </h3>
              <div className="flex flex-wrap items-baseline gap-3 tabular-nums">
                <span className="font-display text-[1.75rem] text-[#14203F]">
                  {formatEur(product.price)}
                </span>
                <span className="text-[14.5px] text-[#56637E] line-through">
                  {formatEur(product.originalPrice)}
                </span>
                <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#233F7A]">
                  -{product.discountPercent}% Pop-Up Price
                </span>
              </div>
              <p className="text-[14.5px] text-[#56637E]">{product.desc}</p>

              <dl className="grid grid-cols-[90px_1fr] gap-y-2 border-y border-[#14203F]/12 py-3 text-[13px]">
                <dt className="font-semibold text-[#56637E]">Size</dt>
                <dd className="text-[#14203F]">{product.size}</dd>
                <dt className="font-semibold text-[#56637E]">Key Active</dt>
                <dd className="text-[#14203F]">{product.keyActive}</dd>
                <dt className="font-semibold text-[#56637E]">How to use</dt>
                <dd className="text-[#14203F]">{product.use}</dd>
              </dl>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => onAddProduct(product.id)}
                  className="rounded-full bg-[#233F7A] px-6 py-3 text-[13.5px] font-semibold text-white hover:bg-[#14203F]"
                >
                  Add to visit bag
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onCloseProduct();
                    onOpenBook();
                  }}
                  className="text-[13px] font-semibold text-[#233F7A] underline underline-offset-4"
                >
                  Ask an expert in store
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Access to the K-Lounge App Modal */}
      {appModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="appModalTitle"
          className="fixed top-1/2 left-1/2 z-[60] max-h-[calc(100vh-40px)] w-[min(560px,calc(100vw-28px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-[#14203F]/15 bg-[#F7F9FB] p-6 shadow-2xl md:p-8"
        >
          <button
            type="button"
            onClick={onCloseAppModal}
            aria-label="Close app access dialog"
            className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#14203F]/15 bg-white text-[#14203F] hover:border-[#233F7A]"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#233F7A]">
            Access the K-Lounge App{' '}
            <span className="font-kr ml-1.5 font-semibold tracking-normal">모바일 앱</span>
          </div>
          <h3 id="appModalTitle" className="font-display mt-2 text-[1.9rem] text-[#14203F]">
            Carry your Paris diagnosis &amp; rewards in your pocket.
          </h3>

          {/* Live Synced Digital Pass Card */}
          <div className="mt-4 flex items-center justify-between gap-4 rounded-md border border-[#14203F]/14 bg-[#14203F] p-5 text-white">
            <div>
              <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#AFC3E2]">
                Instant Marais Member Key
              </div>
              <div className="mt-1 font-mono text-[1.15rem] font-bold tracking-wider tabular-nums">
                {appPassCode}
              </div>
              <div className="mt-1.5 text-[12.5px] text-[#C3CCDD] tabular-nums">
                {quizResult
                  ? `Profile: ${SKIN_PROFILES[quizResult.profileKey].title}`
                  : 'Take Skin Quiz to personalize'}{' '}
                · {glowPoints} Glow XP
              </div>
            </div>
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-white text-[#14203F]">
              <QrCode className="h-10 w-10" />
            </div>
          </div>

          {!appRequested ? (
            <form onSubmit={handleAppRequest} noValidate className="mt-5 grid gap-4">
              <div className="grid gap-1.5">
                <span className="text-[12px] font-semibold text-[#56637E]">Choose platform</span>
                <div className="flex gap-2">
                  {(['iOS', 'Android'] as const).map((os) => (
                    <button
                      key={os}
                      type="button"
                      onClick={() => setAppDevice(os)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold ${
                        appDevice === os
                          ? 'bg-[#233F7A] text-white'
                          : 'border border-[#14203F]/15 bg-white text-[#14203F]'
                      }`}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      {os === 'iOS' ? 'iOS · App Store / TestFlight' : 'Android · Google Play'}
                    </button>
                  ))}
                </div>
              </div>

              <label className="grid gap-1 text-[12px] font-semibold text-[#56637E]">
                <span>Send direct download invite to</span>
                <input
                  type="email"
                  value={appEmail}
                  onChange={(e) => setAppEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="rounded-md border border-[#14203F]/15 bg-white px-3.5 py-2.5 text-[14.5px] text-[#14203F] focus:border-[#233F7A] focus:outline-none"
                />
              </label>

              {appErr && (
                <p className="text-[13px] font-medium text-[#A3263A]">
                  Please enter a valid email address for your download link.
                </p>
              )}

              <button
                type="submit"
                className="rounded-full bg-[#233F7A] px-6 py-3 text-[14px] font-semibold text-white hover:bg-[#14203F]"
              >
                Send my App Access link
              </button>
            </form>
          ) : (
            <div className="mt-5 rounded-md border border-[#233F7A]/25 bg-white p-4 text-[14px] text-[#14203F]">
              <strong className="text-[#233F7A]">Download invite queued for {appEmail}.</strong>{' '}
              Show key <span className="font-mono font-bold">{appPassCode}</span> at the NFC Mirror
              inside 10 rue Pastourelle to pair your avatar automatically.
            </div>
          )}
        </div>
      )}

      {/* Slide-Over Visit Bag & Unlocked Pop-Up Rewards Drawer */}
      <aside
        aria-label="Your visit bag and pop-up rewards"
        className={`fixed top-0 right-0 bottom-0 z-[65] flex w-[min(430px,100vw)] flex-col border-l border-[#14203F]/15 bg-[#F7F9FB] shadow-2xl transition-transform duration-200 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-[#14203F]/12 px-6 py-4">
          <div>
            <h3 className="font-display text-[1.6rem] text-[#14203F]">Your visit bag</h3>
            <p className="text-[12px] text-[#56637E]">
              Reserved for 10 rue Pastourelle · 2 Weeks (Mar–Apr)
            </p>
          </div>
          <button
            type="button"
            onClick={onCloseDrawer}
            aria-label="Close bag"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#14203F]/15 bg-white text-[#14203F]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Passport Customs & Grand Tombola */}
          {(passport.mission1Done ||
            passport.mission2Done ||
            passport.mission3Done) && (
            <div className="mb-4 rounded-md border border-[#14203F]/18 bg-[#14203F] p-4 text-white">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em] text-[#AFC3E2]">
                <span>K-Lounge Passport Stamps</span>
                <span className="tabular-nums">
                  {Number(passport.mission1Done) +
                    Number(passport.mission2Done) +
                    Number(passport.mission3Done)}{' '}
                  / 3
                </span>
              </div>
              {passport.mission1Done &&
              passport.mission2Done &&
              passport.mission3Done ? (
                <div className="mt-2 grid gap-1.5 text-[12.5px] text-[#DCE6F7]">
                  <div className="font-semibold text-white">
                    Customs Bundle Unlocked · 10 rue Pastourelle:
                  </div>
                  <div>
                    {PASSPORT_CUSTOMS_PACK.map((x) => x.item).join(' · ')}
                  </div>
                  {passport.tombolaTicket && (
                    <div className="mt-1 rounded bg-white/10 px-2.5 py-1.5 font-mono text-[11.5px] text-white">
                      Tombola {passport.tombolaTicket}:{' '}
                      {passport.tombolaPrize ?? 'Ready to spin in Passport section'}
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-1.5 text-[12.5px] text-[#C3CCDD]">
                  Complete all 3 Passport missions to unlock Mask + Salt Bread + Yuzu Lemonade +
                  Grand Tombola ticket.
                </p>
              )}
            </div>
          )}

          {/* Won Pop-Up Prizes */}
          {claimedPrizes.length > 0 && (
            <div className="mb-5 rounded-md border border-[#233F7A]/25 bg-[#E7EDF4] p-4">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#233F7A]">
                <Gift className="h-3.5 w-3.5" />
                <span>Unlocked Pop-Up Gifts ({claimedPrizes.length})</span>
              </div>
              <div className="mt-2.5 grid gap-2.5">
                {claimedPrizes.map((prize) => (
                  <div
                    key={prize.code}
                    className="flex items-center justify-between gap-2 rounded bg-white px-3 py-2 text-[13px]"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-[#14203F]">{prize.title}</div>
                      <div className="font-mono text-[11.5px] font-bold text-[#233F7A]">
                        {prize.code}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(prize.code).catch(() => {});
                        onToast(`Copied ${prize.code}`);
                      }}
                      aria-label={`Copy ${prize.code}`}
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[#14203F]/15 text-[#56637E] hover:text-[#14203F]"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Lines */}
          {bagItems.length === 0 ? (
            <div className="grid place-items-center gap-3 py-12 text-center text-[#56637E]">
              <p className="text-[14.5px]">No products added yet.</p>
              <button
                type="button"
                onClick={() => {
                  onCloseDrawer();
                  onExploreShop();
                }}
                className="rounded-full border border-[#14203F]/20 bg-white px-5 py-2.5 text-[13px] font-semibold text-[#14203F] hover:border-[#233F7A]"
              >
                Explore the Seoul selection
              </button>
            </div>
          ) : (
            <div className="grid divide-y divide-[#14203F]/10">
              {bagItems.map(({ product: item, qty }) => (
                <div key={item.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-3.5 py-3.5">
                  <img
                    src={PRODUCT_IMAGES[item.img]}
                    alt={item.name}
                    className="h-16 w-14 rounded bg-white object-contain p-1"
                  />
                  <div className="min-w-0">
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#56637E]">
                      {item.brand}
                    </div>
                    <div className="truncate text-[14px] font-semibold text-[#14203F]">
                      {item.name}
                    </div>
                    <div className="mt-1.5 inline-flex items-center gap-2 rounded-full border border-[#14203F]/15 bg-white px-2 py-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, -1)}
                        aria-label="Remove one"
                        className="p-0.5 text-[#14203F]"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-4 text-center text-[12.5px] font-semibold tabular-nums">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, 1)}
                        aria-label="Add one"
                        className="p-0.5 text-[#14203F]"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="font-display text-[1.15rem] text-[#14203F]">
                      {formatEur(item.price * qty)}
                    </div>
                    <div className="text-[11px] text-[#56637E] line-through">
                      {formatEur(item.originalPrice * qty)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {(bagItems.length > 0 || claimedPrizes.length > 0) && (
          <footer className="grid gap-3 border-t border-[#14203F]/12 bg-white px-6 py-5">
            {bagItems.length > 0 && (
              <div className="grid gap-1">
                {bagSavings > 0 && (
                  <div className="flex items-center justify-between text-[12.5px] font-semibold text-[#233F7A] tabular-nums">
                    <span>2-Week Pop-Up Discount Saved</span>
                    <span>-{formatEur(bagSavings)}</span>
                  </div>
                )}
                <div className="flex items-baseline justify-between">
                  <span className="text-[14px] font-semibold text-[#56637E]">
                    Pop-Up in-store total
                  </span>
                  <strong className="font-display text-[1.55rem] text-[#14203F] tabular-nums">
                    {formatEur(bagTotal)}
                  </strong>
                </div>
              </div>
            )}
            <p className="text-[12px] text-[#56637E]">
              Reserved with March 23 – April 5 pop-up discount. Pay in store at 10 rue Pastourelle
              after testing.
            </p>
            {bagItems.length > 0 && (
              <button
                type="button"
                onClick={onReserveBag}
                className="w-full rounded-full bg-[#233F7A] px-6 py-3 text-[14px] font-semibold text-white hover:bg-[#14203F]"
              >
                Confirm in-store reservation
              </button>
            )}
          </footer>
        )}
      </aside>

      {/* Non-intrusive Status Toast */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-[75] -translate-x-1/2 rounded-full bg-[#14203F] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-lg"
        >
          {toastMsg}
        </div>
      )}
    </>
  );
};
