import React, { useMemo, useState } from 'react';
import { Plus, Sparkles, Tag } from 'lucide-react';
import { PRODUCT_IMAGES } from '../data/assets';
import {
  CATEGORIES,
  OTHER_BRANDS,
  PRODUCTS,
  ProductCategory,
} from '../data/kloungeData';
import { SiteTab } from '../types/klounge';

interface ProductsSectionProps {
  onAddProduct: (id: string) => void;
  onAddStarterBundle: (ids: string[]) => void;
  onOpenProduct: (id: string) => void;
  onSelectTab: (tab: SiteTab, sectionId?: string) => void;
}

const formatEur = (n: number) =>
  n.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: n % 1 ? 2 : 0,
  });

const STARTER_TRIO_IDS = ['torriden-serum', 'aestura-cream', 'mediheal-rose'];

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  onAddProduct,
  onAddStarterBundle,
  onOpenProduct,
  onSelectTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');

  const firstBuyProducts = useMemo(
    () =>
      PRODUCTS.filter((p) => Boolean(p.firstBuyDrop)).sort(
        (a, b) => Number(a.firstBuyDrop?.rank ?? 99) - Number(b.firstBuyDrop?.rank ?? 99)
      ),
    []
  );

  const visibleProducts = PRODUCTS.filter(
    (p) => selectedCategory === 'All' || p.cat === selectedCategory
  );

  const trioItems = STARTER_TRIO_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );
  const trioRetail = trioItems.reduce((sum, p) => sum + p.originalPrice, 0);
  const trioPopup = trioItems.reduce((sum, p) => sum + p.price, 0);

  return (
    <section id="shop" className="scroll-mt-20 py-14 md:py-20">
      <div className="mx-auto max-w-[1280px] px-5 md:px-7">
        {/* Pop-Up Period Discount Header Band */}
        <div className="rounded-md border border-[#14203F]/14 bg-[#14203F] p-6 text-white md:p-8">
          <div className="grid items-center gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#AFC3E2]">
                <Tag className="h-3.5 w-3.5" />
                <span>2-Week Pop-Up Discount · March 23 – April 5, 2026</span>
                <span className="font-kr font-semibold tracking-normal">파리 팝업 할인가</span>
              </div>
              <h1 className="font-display mt-3 text-[clamp(2rem,4vw,3.3rem)] leading-[1.06] text-white">
                First things to buy, <em className="italic text-[#CFE0FF]">up to 25% off</em> for
                two weeks only.
              </h1>
              <p className="mt-2.5 max-w-[58ch] text-[15px] text-[#DCE6F7]">
                Every formula inside our Le Marais pop-up carries a special launch discount
                (15%–25% off standard Paris prices) from March 23 to April 5. Reserve online and
                pay in store after testing with our Korean specialists.
              </p>
            </div>

            {/* Quick Starter Trio Card */}
            <div className="rounded-md border border-white/15 bg-white/10 p-5 backdrop-blur-xs">
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#CFE0FF]">
                Opening Trio · First-Buy Edit
              </div>
              <div className="mt-1 font-display text-[1.4rem] text-white">
                Glass Skin Starter Pack
              </div>
              <p className="mt-1 text-[13px] text-[#DCE6F7]">
                Torriden DIVE-IN Serum + AESTURA Atobarrier 365 Cream + MEDIHEAL Rose PDRN Mask
              </p>
              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-white/15 pt-3">
                <div className="flex items-baseline gap-2.5 tabular-nums">
                  <span className="font-display text-[1.7rem] text-white">
                    {formatEur(trioPopup)}
                  </span>
                  <span className="text-[13.5px] text-[#AFC3E2] line-through">
                    {formatEur(trioRetail)}
                  </span>
                  <span className="text-[12px] font-bold text-[#CFE0FF]">
                    Save {formatEur(trioRetail - trioPopup)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onAddStarterBundle(STARTER_TRIO_IDS)}
                  className="rounded-full bg-white px-4 py-2 text-[12.5px] font-semibold text-[#14203F] transition-colors hover:bg-[#E7EDF4]"
                >
                  Reserve starter trio
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Curated First Things You Can Buy */}
        <div className="mt-14">
          <div className="flex flex-col justify-between gap-4 border-b border-[#14203F]/12 pb-5 md:flex-row md:items-end">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#233F7A]">
                First Drops on Day 1{' '}
                <span className="font-kr ml-1.5 font-semibold tracking-normal">첫 구매 추천</span>
              </div>
              <h2 className="font-display mt-2 text-[clamp(1.7rem,3.2vw,2.5rem)] leading-[1.08] text-[#14203F]">
                The first six things to put in your basket.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('quiz')}
              className="inline-flex items-center gap-1.5 self-start text-[13.5px] font-semibold text-[#233F7A] underline underline-offset-4 hover:text-[#14203F] md:self-end"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Not sure where to start? Take the Skin Quiz
            </button>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {firstBuyProducts.map((p) => (
              <article
                key={p.id}
                className="flex flex-col justify-between overflow-hidden rounded-md border border-[#14203F]/14 bg-white"
              >
                <div className="flex items-center justify-between border-b border-[#14203F]/10 bg-[#F7F9FB] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em]">
                  <span className="text-[#233F7A] tabular-nums">
                    #{p.firstBuyDrop?.rank} · {p.firstBuyDrop?.tag}
                  </span>
                  <span className="text-[#14203F] tabular-nums">-{p.discountPercent}% Pop-Up</span>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-center gap-4 p-4">
                  <button
                    type="button"
                    onClick={() => onOpenProduct(p.id)}
                    aria-label={`Inspect ${p.brand} ${p.name}`}
                    className="h-24 w-24 rounded bg-[#E7EDF4]/60 p-2"
                  >
                    <img
                      src={PRODUCT_IMAGES[p.img]}
                      alt={`${p.brand} ${p.name}`}
                      className="h-full w-full object-contain"
                    />
                  </button>

                  <div className="min-w-0">
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#56637E]">
                      {p.brand} · {p.size}
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenProduct(p.id)}
                      className="mt-0.5 line-clamp-2 text-left font-display text-[1.2rem] leading-[1.15] text-[#14203F] hover:text-[#233F7A]"
                    >
                      {p.name}
                    </button>
                    <p className="mt-1.5 text-[12.5px] leading-snug text-[#56637E]">
                      {p.firstBuyDrop?.note}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#14203F]/10 bg-[#F7F9FB]/60 px-4 py-3">
                  <div className="flex items-baseline gap-2 tabular-nums">
                    <span className="font-display text-[1.45rem] text-[#14203F]">
                      {formatEur(p.price)}
                    </span>
                    <span className="text-[13px] text-[#56637E] line-through">
                      {formatEur(p.originalPrice)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddProduct(p.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#233F7A] px-4 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#14203F]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add to bag
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Full Catalog with Category Filter + Pop-Up Discounted Pricing */}
        <div className="mt-16 flex flex-col justify-between gap-6 border-t border-[#14203F]/12 pt-14 md:flex-row md:items-end">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#233F7A]">
              Full Pop-Up Selection{' '}
              <span className="font-kr ml-1.5 font-semibold tracking-normal">전체 셀렉션</span>
            </div>
            <h2 className="font-display mt-2.5 text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.06] text-[#14203F]">
              Handpicked in Seoul, discounted for Le Marais.
            </h2>
            <p className="mt-2 max-w-[52ch] text-[15px] text-[#56637E]">
              Every price below includes your March 23 – April 5 pop-up discount. Add items to
              reserve your try-on bag at 10 rue Pastourelle.
            </p>
          </div>

          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Filter selection by category"
          >
            {CATEGORIES.map((cat) => {
              const pressed = cat === selectedCategory;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors duration-150 ${
                    pressed
                      ? 'bg-[#14203F] text-white'
                      : 'border border-[#14203F]/14 bg-white text-[#14203F] hover:border-[#233F7A]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((p) => (
            <article
              key={p.id}
              className="group flex flex-col justify-between overflow-hidden rounded-md border border-[#14203F]/12 bg-white transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => onOpenProduct(p.id)}
                aria-label={`View ${p.brand} ${p.name}`}
                className="aspect-[4/3.6] w-full overflow-hidden bg-[#E7EDF4]/55 p-6"
              >
                <img
                  src={PRODUCT_IMAGES[p.img]}
                  alt={`${p.brand} ${p.name}`}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.03]"
                />
              </button>

              <div className="flex flex-1 flex-col justify-between gap-3 p-5">
                <div>
                  <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[0.14em]">
                    <span className="text-[#56637E]">{p.brand} · {p.cat}</span>
                    <span className="text-[#233F7A] tabular-nums">-{p.discountPercent}% Pop-Up</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenProduct(p.id)}
                    className="mt-1.5 text-left font-display text-[1.35rem] leading-[1.15] text-[#14203F] hover:text-[#233F7A]"
                  >
                    {p.name}
                  </button>
                  <div className="mt-1 text-[13px] text-[#56637E]">{p.size}</div>
                </div>

                <div className="flex items-center justify-between border-t border-[#14203F]/10 pt-3">
                  <div className="flex items-baseline gap-2 tabular-nums">
                    <span className="font-display text-[1.35rem] text-[#14203F]">
                      {formatEur(p.price)}
                    </span>
                    <span className="text-[12.5px] text-[#56637E] line-through">
                      {formatEur(p.originalPrice)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddProduct(p.id)}
                    aria-label={`Add ${p.name} to bag`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#14203F]/20 bg-[#F7F9FB] text-[#14203F] transition-colors duration-150 hover:border-[#233F7A] hover:bg-[#233F7A] hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Also in the lounge clean typographic brand row */}
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-[#14203F]/12 py-5 text-[14px]">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#233F7A]">
            Also in the lounge
          </span>
          {OTHER_BRANDS.map((brand) => (
            <span key={brand} className="font-semibold text-[#14203F]">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
