import React, { useEffect, useState } from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { SiteTab } from '../types/klounge';

interface OpeningBannerAndHeroProps {
  onOpenBook: () => void;
  onOpenAppModal: () => void;
  onSelectTab: (tab: SiteTab, sectionId?: string) => void;
}

interface CountdownSnapshot {
  label: string;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getCountdownSnapshot(): CountdownSnapshot {
  const now = new Date();
  const currentYear = now.getFullYear();

  const openThisYear = new Date(currentYear, 2, 23, 11, 0, 0); // March 23, 11:00
  const closeThisYear = new Date(currentYear, 3, 5, 20, 0, 0); // April 5, 20:00

  let target: Date;
  let label: string;

  if (now < openThisYear) {
    target = openThisYear;
    label = 'Opens Mar 23';
  } else if (now <= closeThisYear) {
    target = closeThisYear;
    label = 'Closes Apr 5';
  } else {
    target = new Date(currentYear + 1, 2, 23, 11, 0, 0);
    label = `Opens Mar 23, ${currentYear + 1}`;
  }

  const diffMs = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { label, days, hours, minutes, seconds };
}

export const OpeningBannerAndHero: React.FC<OpeningBannerAndHeroProps> = ({
  onOpenBook,
  onOpenAppModal,
  onSelectTab,
}) => {
  const [countdown, setCountdown] = useState<CountdownSnapshot>(() => getCountdownSnapshot());

  useEffect(() => {
    const id = window.setInterval(() => {
      setCountdown(getCountdownSnapshot());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const countdownText = `${pad(countdown.days)}d : ${pad(countdown.hours)}h : ${pad(
    countdown.minutes
  )}m : ${pad(countdown.seconds)}s`;

  return (
    <div id="top">
      {/* First Picture Editorial Hero + Compact Translucent Moving Countdown */}
      <section
        className="relative overflow-hidden bg-[#D5DDE8]"
        aria-label="K-Lounge Paris Pop-up Hero"
      >
        <img
          src="/assets/aistudio/IMG_4788_47130cff.jpeg"
          alt="Woman with glowing glass skin in a sunlit Parisian apartment"
          className="h-[340px] w-full object-cover object-[76%_20%] md:absolute md:inset-0 md:h-full md:object-[66%_center]"
        />

        <div className="relative z-10 mx-auto flex max-w-[1280px] items-center px-5 pb-14 md:min-h-[min(84vh,700px)] md:px-7 md:pb-20">
          <div className="grid max-w-[540px] gap-4 py-10 md:py-16">
            {/* Compact Translucent Floating Countdown */}
            <div className="animate-float-gentle inline-flex w-fit items-center gap-2.5 rounded-full border border-white/55 bg-white/35 px-3.5 py-1.5 text-[11.5px] font-semibold text-[#14203F] backdrop-blur-md">
              <Clock className="h-3.5 w-3.5 text-[#233F7A]" />
              <span className="uppercase tracking-[0.12em] text-[#233F7A]">{countdown.label}</span>
              <span aria-hidden="true" className="text-[#14203F]/30">
                ·
              </span>
              <span className="font-bold tracking-[0.06em] tabular-nums">{countdownText}</span>
            </div>

            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#233F7A]">
              Pop-up · Paris 3e · 2 Weeks Only · March 23 – April 5{' '}
              <span className="font-kr ml-1.5 font-semibold tracking-normal">팝업</span>
            </div>

            <h1 className="font-display text-[clamp(2.55rem,5.2vw,4.35rem)] leading-[1.03] text-[#14203F]">
              Discover K-Beauty <em className="italic text-[#233F7A]">like never before</em> in
              Paris.
            </h1>

            <p className="max-w-[44ch] text-[clamp(1rem,1.3vw,1.14rem)] font-medium text-[#14203F]/85">
              For two exclusive weeks in March and April, step into our Le Marais pop-up sanctuary
              and experience Korean skin science, sensory testing, and custom routines first-hand.
            </p>

            <p className="border-t border-[#14203F]/15 pt-3 text-[13px] font-semibold text-[#14203F]">
              Complimentary Skin + Hair Diagnosis on site · Up to 25% off launch prices · 10 rue
              Pastourelle
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                type="button"
                onClick={onOpenBook}
                className="inline-flex items-center justify-center rounded-full bg-[#233F7A] px-6 py-3 text-[13.5px] font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[#14203F]"
              >
                Book my free diagnosis
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('products')}
                className="inline-flex items-center justify-center rounded-full border border-[#14203F]/20 bg-white/80 px-5 py-3 text-[13.5px] font-semibold text-[#14203F] backdrop-blur-xs transition-colors duration-150 hover:border-[#233F7A] hover:bg-white"
              >
                First buys (-25%)
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('quiz')}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#14203F]/20 bg-white/80 px-5 py-3 text-[13.5px] font-semibold text-[#14203F] backdrop-blur-xs transition-colors duration-150 hover:border-[#233F7A] hover:bg-white"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#233F7A]" />
                Test your skin
              </button>
              <button
                type="button"
                onClick={onOpenAppModal}
                className="inline-flex items-center justify-center rounded-full border border-[#14203F]/20 bg-white/80 px-5 py-3 text-[13.5px] font-semibold text-[#14203F] backdrop-blur-xs transition-colors duration-150 hover:border-[#233F7A] hover:bg-white"
              >
                App QR Pass
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Moving Countdown Ribbon on Transparency */}
        <div
          className="absolute right-0 bottom-0 left-0 z-20 overflow-hidden border-t border-white/45 bg-[#F7F9FB]/32 py-2 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#14203F] backdrop-blur-md"
          aria-label="Live moving pop-up countdown"
        >
          <div className="animate-marquee">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center">
                <span className="inline-flex items-center gap-6 px-6 tabular-nums">
                  <span>Compte à rebours · {countdownText}</span>
                  <span aria-hidden="true" className="text-[#14203F]/35">
                    ·
                  </span>
                  <span>2 Weeks Only · March 23 – April 5</span>
                  <span aria-hidden="true" className="text-[#14203F]/35">
                    ·
                  </span>
                  <span>10 rue Pastourelle, Paris 3e</span>
                  <span aria-hidden="true" className="text-[#14203F]/35">
                    ·
                  </span>
                  <span>Compte à rebours · {countdownText}</span>
                  <span aria-hidden="true" className="text-[#14203F]/35">
                    ·
                  </span>
                  <span>15%–25% Pop-Up Discounts &amp; Free Skin Diagnosis</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brushed Silver Manifesto Band */}
      <section
        className="bg-silver-gradient py-16 text-center md:py-24"
        aria-label="K-Lounge Manifesto"
      >
        <div className="mx-auto max-w-[1280px] px-5 md:px-7">
          <blockquote className="font-display mx-auto max-w-[22ch] text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.12] text-[#14203F]">
            K-Lounge is not a shop in Paris. It’s{' '}
            <em className="italic text-[#233F7A]">the French relationship</em> with Korean Beauty.
          </blockquote>
          <div className="mt-6 text-[12px] font-bold uppercase tracking-[0.2em] text-[#233F7A]">
            k-lounge · 케이 라운지
          </div>
        </div>
      </section>
    </div>
  );
};
