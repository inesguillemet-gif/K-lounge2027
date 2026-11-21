import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { LOGO_DARK } from '../data/assets';
import { SiteTab } from '../types/klounge';

const STORAGE_NEWSLETTER_KEY = 'klounge_paris_newsletter_email_v1';

interface SiteFooterProps {
  onSelectTab: (tab: SiteTab, sectionId?: string) => void;
  onOpenAppModal: () => void;
  onToast?: (msg: string) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  onSelectTab,
  onOpenAppModal,
  onToast,
}) => {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_NEWSLETTER_KEY);
    } catch {
      return null;
    }
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg(null);
    setSubscribedEmail(trimmed);
    setEmail('');
    try {
      localStorage.setItem(STORAGE_NEWSLETTER_KEY, trimmed);
    } catch {
      // Ignore storage error
    }
    onToast?.('You are subscribed to K-Lounge opening details & K-beauty drops');
  };

  return (
    <footer className="bg-[#14203F] py-14 text-[#B9C4D8]">
      <div className="mx-auto max-w-[1280px] px-5 md:px-7">
        {/* Stay Updated Newsletter Strip */}
        <div className="mb-10 grid gap-6 border-b border-white/10 pb-10 md:grid-cols-[1.15fr_1fr] md:items-center">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9FB4D6]">
              Stay Updated <span className="font-kr ml-1.5 font-semibold tracking-normal">소식 받기</span>
            </div>
            <h3 className="font-display mt-2 text-[clamp(1.6rem,2.6vw,2.1rem)] leading-[1.12] text-white">
              Opening details &amp; exclusive K-beauty drops before we open.
            </h3>
            <p className="mt-2 max-w-[48ch] text-[13.5px] text-[#B9C4D8]">
              Be first to know when Le Marais slots, limited first-buy skincare drops (-25%), and
              March 23 opening alerts go live.
            </p>
          </div>

          <div>
            {subscribedEmail ? (
              <div
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/8 px-5 py-4 text-[13.5px] text-white"
                role="status"
              >
                <span className="inline-flex items-center gap-2 font-medium">
                  <Check className="h-4 w-4 shrink-0 text-[#9CC2FF]" />
                  Subscribed with <strong className="font-semibold">{subscribedEmail}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSubscribedEmail(null)}
                  className="text-[12px] font-semibold text-[#9FB4D6] underline underline-offset-4 hover:text-white"
                >
                  Change email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} noValidate className="flex flex-col gap-2.5 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Enter your email address"
                  aria-label="Email address for Stay Updated newsletter"
                  autoComplete="email"
                  className="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-[14px] text-white placeholder:text-[#9FB4D6]/75 focus:border-white focus:bg-white/15 focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-white px-6 py-3 text-[13.5px] font-semibold text-[#14203F] transition-colors hover:bg-[#E7EDF4]"
                >
                  Stay updated
                </button>
              </form>
            )}
            {errorMsg && (
              <p className="mt-2 text-[12.5px] font-medium text-[#FFB4B4]" role="alert">
                {errorMsg}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.9fr_0.9fr_0.9fr]">
          <div>
            <img src={LOGO_DARK} alt="k-lounge 케이 라운지" className="h-9 w-auto" />
            <p className="mt-4 max-w-[34ch] text-[14px]">
              Not a shop in Paris. The French relationship with Korean Beauty. Open 2 weeks only
              (March 23 – April 5, 2026) in Le Marais.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-white">
              The Pop-up
            </h4>
            <ul className="mt-3 grid gap-2 text-[14px]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('popup', 'popup')}
                  className="text-left hover:text-white"
                >
                  What awaits you
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('quiz', 'quiz')}
                  className="text-left hover:text-white"
                >
                  Skin &amp; Scalp Quiz
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('app', 'diagnosis')}
                  className="text-left hover:text-white"
                >
                  Skin + Hair Diagnosis
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('visit', 'visit')}
                  className="text-left hover:text-white"
                >
                  10 rue Pastourelle
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-white">
              Experience
            </h4>
            <ul className="mt-3 grid gap-2 text-[14px]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('products', 'shop')}
                  className="text-left hover:text-white"
                >
                  First Drops &amp; Discounts (-25%)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('passport', 'passport')}
                  className="text-left hover:text-white"
                >
                  Passport &amp; Peggy Gou VIP
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('games', 'games')}
                  className="text-left hover:text-white"
                >
                  Glow Arcade &amp; Prizes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('app', 'cycle-sync')}
                  className="text-left hover:text-white"
                >
                  Period &amp; Cycle Skincare
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('agent', 'personal-agent')}
                  className="text-left hover:text-white"
                >
                  MY PERSONAL AGENT (Voice AI)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('faq', 'faq')}
                  className="text-left hover:text-white"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAppModal}
                  className="text-left hover:text-white"
                >
                  Get App QR Pass
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-white">
              Follow
            </h4>
            <ul className="mt-3 grid gap-2 text-[14px]">
              <li>Instagram · @klounge.paris</li>
              <li>TikTok · @klounge.paris</li>
              <li>hello@k-lounge.paris</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 text-[12.5px] text-[#8E9BB4]">
          <span>© 2026 K-Lounge · 10 rue Pastourelle, 75003 Paris · 2 Weeks · March – April</span>
          <span>In-store pickup reservation · No online shipping checkout</span>
        </div>
      </div>
    </footer>
  );
};
