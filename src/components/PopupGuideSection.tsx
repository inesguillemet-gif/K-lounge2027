import React, { useState } from 'react';
import { ArrowRight, Check, Clock, Sparkles } from 'lucide-react';
import { POPUP_IMG } from '../data/assets';
import { POPUP_MONTH_HIGHLIGHTS, POPUP_STATIONS } from '../data/kloungeData';

import { SiteTab } from '../types/klounge';

interface PopupGuideSectionProps {
  onOpenBook: () => void;
  onSelectTab: (tab: SiteTab, sectionId?: string) => void;
}

export const PopupGuideSection: React.FC<PopupGuideSectionProps> = ({
  onOpenBook,
  onSelectTab,
}) => {
  const [selectedStation, setSelectedStation] = useState(0);
  const current = POPUP_STATIONS[selectedStation];

  return (
    <section id="popup" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-5 md:px-7">
        {/* Top intro grid preserving authentic interior lookbook */}
        <div className="grid items-center gap-8 md:grid-cols-[1.02fr_0.98fr] md:gap-14">
          <div className="overflow-hidden rounded-md border border-[#14203F]/10 bg-[#E7EDF4] aspect-[4/4.4] md:aspect-[4/5]">
            <img
              src={POPUP_IMG}
              alt="Inside the K-Lounge pop-up: navy wall, silver displays and the diagnosis station"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="grid gap-5">
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#233F7A]">
              The Pop-up <span className="font-kr ml-1.5 font-semibold tracking-normal">팝업</span>
            </div>

            <h2 className="font-display text-[clamp(2rem,4vw,3.3rem)] leading-[1.06] text-[#14203F]">
              The secret behind the Korean glow, two exclusive weeks in the Marais.
            </h2>

            <p className="max-w-[56ch] text-[15.5px] text-[#56637E]">
              For two weeks only (<strong className="font-semibold text-[#14203F]">March 23 – April 5</strong>), we
              are bringing a handpicked selection of top-tier K-beauty formulas never sold in
              France before. Step inside six dedicated spaces at 10 rue Pastourelle.
            </p>

            {/* Clean key info table (unboxed metadata) */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-y border-[#14203F]/14 py-4 text-[14px] sm:grid-cols-3">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#56637E]">
                  Dates (2 Weeks)
                </dt>
                <dd className="mt-0.5 font-semibold text-[#14203F] tabular-nums">
                  March 23 – April 5
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#56637E]">
                  Opening Hours
                </dt>
                <dd className="mt-0.5 font-semibold text-[#14203F] tabular-nums">
                  Tue – Sun · 11:00–20:00
                </dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#56637E]">
                  Admission
                </dt>
                <dd className="mt-0.5 font-semibold text-[#233F7A]">Free entry &amp; testing</dd>
              </div>
            </dl>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                onClick={onOpenBook}
                className="inline-flex items-center gap-2 rounded-full bg-[#233F7A] px-6 py-3 text-[14px] font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[#14203F]"
              >
                Book your free visit slot
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('games')}
                className="text-[14px] font-semibold text-[#14203F] underline decoration-[#233F7A]/40 underline-offset-4 hover:text-[#233F7A]"
              >
                Unlock pop-up gifts before arriving
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Floor & Station Guide: What's going to be there */}
        <div className="mt-16 rounded-md border border-[#14203F]/14 bg-[#E7EDF4]/65 p-5 md:mt-20 md:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-[#14203F]/14 pb-6 md:flex-row md:items-end">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#233F7A]">
                Inside 10 rue Pastourelle{' '}
                <span className="font-kr ml-1.5 font-semibold tracking-normal">팝업 공간</span>
              </div>
              <h3 className="font-display mt-2 text-[clamp(1.7rem,3vw,2.45rem)] text-[#14203F]">
                What awaits you inside the pop-up.
              </h3>
            </div>
            <p className="max-w-[44ch] text-[14px] text-[#56637E]">
              Select any of the six stations below to explore experiences, product bars, tastings,
              and gift redemptions during our 2-week March–April pop-up.
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Left station index */}
            <div className="grid divide-y divide-[#14203F]/12 border-y border-[#14203F]/12">
              {POPUP_STATIONS.map((station, idx) => {
                const active = idx === selectedStation;
                return (
                  <button
                    key={station.number}
                    type="button"
                    onClick={() => setSelectedStation(idx)}
                    className={`flex w-full items-center justify-between gap-4 px-3 py-3.5 text-left transition-colors duration-150 ${
                      active
                        ? 'bg-[#14203F] text-white'
                        : 'bg-transparent text-[#14203F] hover:bg-white/60'
                    }`}
                  >
                    <div className="flex items-baseline gap-3.5 min-w-0">
                      <span
                        className={`font-display text-[1.15rem] italic tabular-nums ${
                          active ? 'text-[#AFC3E2]' : 'text-[#233F7A]'
                        }`}
                      >
                        {station.number}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-[14.5px] font-semibold">{station.title}</div>
                        <div
                          className={`truncate text-[12px] ${
                            active ? 'text-white/75' : 'text-[#56637E]'
                          }`}
                        >
                          {station.subtitle}
                        </div>
                      </div>
                    </div>
                    <ArrowRight
                      className={`h-4 w-4 shrink-0 transition-transform duration-150 ${
                        active ? 'translate-x-0.5 text-white' : 'text-[#56637E]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right active station dossier */}
            <div className="flex flex-col justify-between rounded-md border border-[#14203F]/12 bg-white p-6 md:p-8">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#233F7A]">
                  <span>
                    Station {current.number} ·{' '}
                    <span className="font-kr font-semibold tracking-normal">{current.korean}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[#56637E] tabular-nums">
                    <Clock className="h-3.5 w-3.5 text-[#233F7A]" />
                    {current.timing}
                  </span>
                </div>

                <h4 className="font-display mt-3 text-[1.85rem] leading-[1.12] text-[#14203F]">
                  {current.title}
                </h4>
                <p className="mt-3 text-[15px] leading-relaxed text-[#56637E]">
                  {current.description}
                </p>

                <ul className="mt-5 grid gap-2.5 border-t border-[#14203F]/12 pt-5">
                  {current.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14px] text-[#14203F]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#233F7A]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#14203F]/12 pt-5">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#56637E]">
                  <Sparkles className="h-4 w-4 text-[#233F7A]" />
                  No purchase required to visit or test
                </span>
                <button
                  type="button"
                  onClick={onOpenBook}
                  className="rounded-full border border-[#14203F]/20 bg-[#F7F9FB] px-4 py-2 text-[13px] font-semibold text-[#14203F] transition-colors duration-150 hover:border-[#233F7A] hover:bg-white"
                >
                  Reserve a diagnosis slot
                </button>
              </div>
            </div>
          </div>

          {/* 2-Week Pop-up Programme */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {POPUP_MONTH_HIGHLIGHTS.map((item) => (
              <article
                key={item.month}
                className="rounded-md border border-[#14203F]/12 bg-white/85 p-5"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-[1.35rem] text-[#14203F]">{item.month}</span>
                  <span className="font-kr text-[11px] font-semibold text-[#233F7A]">
                    {item.korean}
                  </span>
                </div>
                <div className="mt-1 text-[12px] font-semibold text-[#56637E] tabular-nums">
                  {item.dates}
                </div>
                <h4 className="mt-2.5 text-[14.5px] font-bold text-[#14203F]">{item.theme}</h4>
                <p className="mt-1.5 text-[13.5px] text-[#56637E]">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Featured Campaign & Skin Lab Visuals (Direct Upload Showcase) */}
        <div className="mt-16 border-t border-[#14203F]/12 pt-14">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#233F7A]">
                Inside the Seoul Skin Lab{' '}
                <span className="font-kr ml-1.5 font-semibold tracking-normal">피부 리포트 비주얼</span>
              </div>
              <h3 className="font-display mt-2 text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.08] text-[#14203F]">
                Skin analysis, bespoke serums &amp; <em className="italic text-[#233F7A]">your printed report.</em>
              </h3>
            </div>
            <p className="max-w-[44ch] text-[14px] text-[#56637E]">
              Every scan and test at 10 rue Pastourelle translates into concrete K-beauty routines,
              serum pairings, and your souvenir print edition.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                img: '/assets/aistudio/IMG_3997_767e0c73.png',
                alt: 'Korean specialist calibrating active skincare serums with glass droppers',
                tag: '01 · Custom Serum Lab',
                title: 'Targeted Active Advice',
                caption: 'Explore 15%–25% pop-up serum drops',
                tab: 'products' as SiteTab,
              },
              {
                img: '/assets/aistudio/IMG_3995_3e3bab87.jpeg',
                alt: 'AI dermal facial scan mapping pores, hydration, and barrier sensitivity',
                tag: '02 · AI Dermal Grid',
                title: 'Complimentary Skin Scan',
                caption: 'See diagnosis & period sync',
                tab: 'app' as SiteTab,
              },
              {
                img: '/assets/aistudio/IMG_3993_2d9ba951.jpeg',
                alt: 'Woman reading personalized My Skin Report skincare advice foldout',
                tag: '03 · My Skin Report',
                title: 'Tailored AM/PM Solutions',
                caption: 'Start the 5-step Skin Quiz',
                tab: 'quiz' as SiteTab,
              },
              {
                img: '/assets/aistudio/IMG_3994_ff4b1e5c.jpeg',
                alt: 'Visitor seated holding This is My Skin Report broadsheet dossier',
                tag: '04 · First 1,000 Print',
                title: 'Broadsheet & Passport',
                caption: 'Unlock missions & tombola',
                tab: 'passport' as SiteTab,
              },
            ].map((card) => (
              <button
                key={card.tag}
                type="button"
                onClick={() => onSelectTab(card.tab)}
                className="group flex flex-col overflow-hidden rounded-md border border-[#14203F]/14 bg-white text-left transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="aspect-[3/3.6] w-full overflow-hidden bg-[#F7F9FB]">
                  <img
                    src={card.img}
                    alt={card.alt}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-2 border-t border-[#14203F]/10 p-4">
                  <div>
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-[#233F7A]">
                      {card.tag}
                    </div>
                    <h4 className="font-display mt-1 text-[1.25rem] leading-tight text-[#14203F]">
                      {card.title}
                    </h4>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#233F7A]">
                    <span>{card.caption}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
