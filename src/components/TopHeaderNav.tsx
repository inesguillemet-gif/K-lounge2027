import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { LOGO_LIGHT } from '../data/assets';
import { SiteTab } from '../types/klounge';

interface TopHeaderNavProps {
  activeTab: SiteTab;
  onSelectTab: (tab: SiteTab, sectionId?: string) => void;
  bagCount: number;
  prizeCount: number;
  onOpenBook: () => void;
  onOpenBag: () => void;
}

export const SITE_TABS: { id: SiteTab; label: string; highlight?: boolean }[] = [
  { id: 'popup', label: 'The Pop-up' },
  { id: 'products', label: 'Products' },
  { id: 'passport', label: 'Passport & VIP' },
  { id: 'quiz', label: 'Skin Quiz' },
  { id: 'app', label: 'App & Cycle' },
  { id: 'games', label: 'Games & Gifts' },
  { id: 'visit', label: 'Visit' },
  { id: 'faq', label: 'FAQ' },
  { id: 'agent', label: 'MY PERSONAL AGENT', highlight: true },
];

export const TopHeaderNav: React.FC<TopHeaderNavProps> = ({
  activeTab,
  onSelectTab,
  bagCount,
  prizeCount,
  onOpenBook,
  onOpenBag,
}) => {
  return (
    <>
      {/* Announcement marquee */}
      <div
        className="overflow-hidden border-b border-white/10 bg-[#14203F] py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white"
        aria-label="Pop-up announcements"
      >
        <div className="animate-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              <span className="inline-flex items-center gap-6 px-6">
                <span>2 Weeks Only · March 23 – April 5, 2026</span>
                <span aria-hidden="true" className="text-white/40">
                  ·
                </span>
                <span>Up to 25% Pop-Up Discount on All Products</span>
                <span aria-hidden="true" className="text-white/40">
                  ·
                </span>
                <span>10 rue Pastourelle, Paris 3e</span>
                <span aria-hidden="true" className="text-white/40">
                  ·
                </span>
                <span>Free Skin + Hair Diagnosis · Special Guest Peggy Gou</span>
                <span aria-hidden="true" className="text-white/40">
                  ·
                </span>
                <span>K-Lounge Passport · Period &amp; Cycle Skincare · Seoul Tombola</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Strict 1-row, 3-zone Top Bar with Desktop Onglets + Compact Mobile Onglet Strip */}
      <header className="sticky top-0 z-40 border-b border-[#14203F]/12 bg-[#F7F9FB]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-5 py-2.5 md:px-7">
          <button
            type="button"
            onClick={() => onSelectTab('popup')}
            className="shrink-0 text-left focus:outline-none"
            aria-label="K-Lounge home"
          >
            <img src={LOGO_LIGHT} alt="k-lounge 케이 라운지" className="h-9 w-auto md:h-10" />
          </button>

          {/* Primary Top Tabs (Onglets) on Desktop */}
          <nav
            role="tablist"
            aria-label="Website sections"
            className="hidden min-w-0 items-center gap-0.5 overflow-x-auto lg:flex xl:gap-1"
          >
            {SITE_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative shrink-0 whitespace-nowrap rounded-md px-2 py-2 text-[12px] font-semibold transition-colors duration-150 xl:px-2.5 xl:text-[12.5px] ${
                    isActive
                      ? 'bg-[#14203F] text-white'
                      : tab.highlight
                        ? 'border border-[#233F7A]/28 bg-[#E7EDF4] text-[#233F7A] hover:bg-[#233F7A] hover:text-white'
                        : 'text-[#14203F]/80 hover:bg-[#E7EDF4] hover:text-[#14203F]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenBook}
              className="hidden shrink-0 whitespace-nowrap rounded-full bg-[#233F7A] px-4 py-2 text-[13px] font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[#14203F] sm:inline-flex"
            >
              Book diagnosis
            </button>

            <button
              type="button"
              onClick={onOpenBag}
              aria-label="Open visit bag and prizes"
              className="relative inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-[#14203F]/15 bg-white px-3.5 text-[13px] font-semibold text-[#14203F] transition-colors duration-150 hover:border-[#233F7A]"
            >
              <ShoppingBag className="h-4 w-4 text-[#233F7A]" />
              <span className="tabular-nums">{bagCount}</span>
              {prizeCount > 0 && (
                <span className="hidden text-[11px] font-bold text-[#233F7A] sm:inline tabular-nums">
                  · {prizeCount} {prizeCount === 1 ? 'gift' : 'gifts'}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Top Onglets Bar for Mobile & Tablet */}
        <div className="border-t border-[#14203F]/10 bg-white/80 lg:hidden">
          <nav
            role="tablist"
            aria-label="Mobile website sections"
            className="mx-auto flex max-w-[1280px] gap-1.5 overflow-x-auto px-5 py-2 md:px-7"
          >
            {SITE_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelectTab(tab.id)}
                  className={`shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#14203F] text-white'
                      : tab.highlight
                        ? 'border border-[#233F7A]/28 bg-[#E7EDF4] text-[#233F7A] hover:bg-[#233F7A] hover:text-white'
                        : 'bg-[#F7F9FB] text-[#14203F]/80 hover:bg-[#E7EDF4]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
};
