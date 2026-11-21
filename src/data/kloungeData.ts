export type ProductCategory =
  | 'All'
  | 'Skincare'
  | 'Haircare'
  | 'Makeup'
  | 'Masks'
  | 'Fragrance'
  | 'Wellness';

export interface Product {
  id: string;
  brand: string;
  name: string;
  size: string;
  price: number; // Active 2-Week Pop-Up Discounted Price (March 23 – April 5, 2026)
  originalPrice: number; // Standard Paris Retail Price
  discountPercent: number;
  cat: Exclude<ProductCategory, 'All'>;
  img: string;
  desc: string;
  use: string;
  profiles: Array<'barrier' | 'hydration' | 'calm' | 'balance' | 'scalp-repair' | 'scalp-light'>;
  keyActive: string;
  firstBuyDrop?: {
    rank: string;
    tag: string;
    note: string;
  };
}

export const PRODUCTS: Product[] = [
  {
    id: 'aestura-cream',
    brand: 'AESTURA',
    name: 'Atobarrier 365 Cream',
    size: '80 ml',
    price: 22.5,
    originalPrice: 28,
    discountPercent: 20,
    cat: 'Skincare',
    img: 'p-aestura-cream',
    desc: 'A rich barrier cream with ceramide capsules for dry and sensitive skin. It strengthens the skin barrier and keeps skin comfortable all day.',
    use: 'Last step of your routine, morning and evening.',
    profiles: ['barrier', 'calm'],
    keyActive: 'DermaON Ceramide Capsules',
    firstBuyDrop: {
      rank: '01',
      tag: 'Seoul #1 Barrier Cream',
      note: 'Rarely stocked in Paris—our top barrier hero with 20% off during the 2-week pop-up.',
    },
  },
  {
    id: 'aestura-lotion',
    brand: 'AESTURA',
    name: 'Atobarrier 365 Lotion',
    size: '150 ml',
    price: 22,
    originalPrice: 26,
    discountPercent: 15,
    cat: 'Skincare',
    img: 'p-aestura-lotion',
    desc: 'A light lotion version of the Atobarrier formula. Fast moisture for face and body, ideal for dry and sensitive skin.',
    use: 'Apply to face or body after cleansing.',
    profiles: ['barrier', 'balance'],
    keyActive: 'Ceramide · Cholesterol · Fatty Acids',
  },
  {
    id: 'aestura-hydro',
    brand: 'AESTURA',
    name: 'Atobarrier 365 Hydro Soothing Cream',
    size: '60 ml',
    price: 20.5,
    originalPrice: 24,
    discountPercent: 15,
    cat: 'Skincare',
    img: 'p-aestura-hydro',
    desc: 'A cooling gel-cream that hydrates and calms weakened skin, with a fresh, non-greasy finish.',
    use: 'Morning and evening, or as a soothing mask.',
    profiles: ['balance', 'hydration'],
    keyActive: 'Trehalose & Cooling Amino Complex',
  },
  {
    id: 'skin1004-ampoule',
    brand: 'SKIN1004',
    name: 'Madagascar Centella Probio-Cica Intensive Ampoule',
    size: '95 ml',
    price: 17.5,
    originalPrice: 22,
    discountPercent: 20,
    cat: 'Skincare',
    img: 'p-skin1004-ampoule',
    desc: 'Centella asiatica from Madagascar with probiotics. Soothes redness and reinforces fragile, reactive skin.',
    use: '2–3 drops after toner, morning and evening.',
    profiles: ['calm', 'barrier'],
    keyActive: 'Fermented Centella & TECA',
  },
  {
    id: 'skin1004-cream',
    brand: 'SKIN1004',
    name: 'Madagascar Centella Probio-Cica Enrich Cream',
    size: '50 ml',
    price: 17,
    originalPrice: 20,
    discountPercent: 15,
    cat: 'Skincare',
    img: 'p-skin1004-cream',
    desc: 'A nourishing cica cream that calms and seals in moisture for a healthy, supple skin barrier.',
    use: 'Last step of your routine.',
    profiles: ['calm', 'barrier'],
    keyActive: 'Probio-Cica & Macadamia Seed Oil',
  },
  {
    id: 'skin1004-toner',
    brand: 'SKIN1004',
    name: 'Madagascar Centella Probio-Cica Essence Toner',
    size: '210 ml',
    price: 15.5,
    originalPrice: 18,
    discountPercent: 15,
    cat: 'Skincare',
    img: 'p-skin1004-toner',
    desc: 'An essence-toner that preps and soothes the skin right after cleansing, so the next steps absorb better.',
    use: 'Pat into skin with your hands after cleansing.',
    profiles: ['calm', 'balance'],
    keyActive: 'Fermented Madagascan Centella',
  },
  {
    id: 'torriden-serum',
    brand: 'Torriden',
    name: 'DIVE-IN Low Molecular Hyaluronic Acid Serum',
    size: '50 ml',
    price: 16,
    originalPrice: 20,
    discountPercent: 20,
    cat: 'Skincare',
    img: 'p-torriden-serum',
    desc: 'Five types of hyaluronic acid for deep, layered hydration. A cult Korean serum for plump, dewy skin.',
    use: 'After toner, morning and evening.',
    profiles: ['hydration', 'balance'],
    keyActive: '5D-Complex Hyaluronic Acid & Panthenol',
    firstBuyDrop: {
      rank: '02',
      tag: 'Instant Glass Skin Drop',
      note: 'Our fastest-moving hydration serum—easy first buy to pair with any routine (-20%).',
    },
  },
  {
    id: 'torriden-pad',
    brand: 'Torriden',
    name: 'DIVE-IN Multi Pad',
    size: '80 pads',
    price: 18.5,
    originalPrice: 22,
    discountPercent: 15,
    cat: 'Skincare',
    img: 'p-torriden-pad',
    desc: 'Hydrating toner pads that cleanse gently, exfoliate lightly and calm the skin in one swipe.',
    use: 'Swipe over the face after cleansing, or leave on as a mini mask.',
    profiles: ['hydration', 'balance'],
    keyActive: 'Low-Molecular HA & Allantoin',
  },
  {
    id: 'torriden-cream',
    brand: 'Torriden',
    name: 'DIVE-IN Soothing Cream',
    size: '100 ml',
    price: 18,
    originalPrice: 21,
    discountPercent: 15,
    cat: 'Skincare',
    img: 'p-torriden-cream',
    desc: 'A light, cooling cream that locks in hydration and soothes dehydrated skin without heaviness.',
    use: 'Last step of your routine.',
    profiles: ['hydration', 'balance'],
    keyActive: '5D Hyaluronic Acid & Trehalose',
  },
  {
    id: 'unove-shampoo',
    brand: 'UNOVE',
    name: 'Deep Damage Repair Shampoo',
    size: '500 g',
    price: 18.5,
    originalPrice: 22,
    discountPercent: 15,
    cat: 'Haircare',
    img: 'p-unove-shampoo',
    desc: 'A repairing shampoo for damaged hair, with a soft, elegant scent and a silky finish.',
    use: 'Massage into wet hair and scalp, then rinse.',
    profiles: ['scalp-repair', 'scalp-light'],
    keyActive: 'Hydrolyzed Keratin & 30 Proteins',
  },
  {
    id: 'unove-treatment',
    brand: 'UNOVE',
    name: 'Deep Damage Treatment EX',
    size: '207 ml',
    price: 15,
    originalPrice: 19,
    discountPercent: 20,
    cat: 'Haircare',
    img: 'p-unove-treatment',
    desc: 'A protein treatment that restores softness and shine to damaged, brittle hair.',
    use: 'After shampoo, leave 1–3 minutes, then rinse.',
    profiles: ['scalp-repair'],
    keyActive: '3,000% Protein & 5 Plant Oils',
    firstBuyDrop: {
      rank: '03',
      tag: 'Olive Young Hair #1',
      note: 'Tested at the Hair & Scalp Bar—the signature Silk-Hair first pick at 20% off.',
    },
  },
  {
    id: 'unove-oil',
    brand: 'UNOVE',
    name: 'Silk Oil Essence · Tender Bloom',
    size: '70 ml',
    price: 22,
    originalPrice: 26,
    discountPercent: 15,
    cat: 'Haircare',
    img: 'p-unove-oil',
    desc: 'A lightweight hair oil for glow and softness, with a touch of floral musk.',
    use: 'Apply to lengths and ends, on damp or dry hair.',
    profiles: ['scalp-repair', 'scalp-light'],
    keyActive: 'Argan, Camellia & Silk Amino Acids',
  },
  {
    id: 'jsm-cushion',
    brand: 'JUNG SAEM MOOL',
    name: 'Essential Skin Nuder Cushion',
    size: '14 g · SPF50+ PA+++',
    price: 30.5,
    originalPrice: 36,
    discountPercent: 15,
    cat: 'Makeup',
    img: 'p-jsm-cushion',
    desc: 'The makeup-artist cushion for a natural, skin-like finish with sun protection.',
    use: 'Pat onto the skin with the puff, building coverage where needed.',
    profiles: ['hydration', 'balance'],
    keyActive: 'Hue Balancing Powder & SPF50+',
    firstBuyDrop: {
      rank: '04',
      tag: 'Custom Cushion Bar Star',
      note: 'Shade-matched on site + free sticker bar customization during the pop-up (-15%).',
    },
  },
  {
    id: 'clio-palette',
    brand: 'CLIO',
    name: 'Pro Eye Palette Air',
    size: '10 shades',
    price: 21,
    originalPrice: 26,
    discountPercent: 20,
    cat: 'Makeup',
    img: 'p-clio-palette',
    desc: 'Airy, blendable eyeshadows in soft, wearable tones. An Olive Young Awards winner.',
    use: 'Build from light to deep shades with a brush or fingertip.',
    profiles: ['balance'],
    keyActive: 'Micro-Milled Matte & Satin Pigments',
  },
  {
    id: 'mediheal-vitc',
    brand: 'MEDIHEAL',
    name: 'Vitamin C Sheet Mask',
    size: '1 mask',
    price: 2,
    originalPrice: 2.5,
    discountPercent: 20,
    cat: 'Masks',
    img: 'p-mediheal-vitc',
    desc: 'A brightening sheet mask with vitamin C for clear, toned, radiant skin.',
    use: 'Leave on 15–20 minutes, then pat in the remaining essence.',
    profiles: ['balance', 'hydration'],
    keyActive: 'Ascorbic Acid & Niacinamide',
  },
  {
    id: 'mediheal-rose',
    brand: 'MEDIHEAL',
    name: 'Rose PDRN Sheet Mask',
    size: '1 mask',
    price: 2,
    originalPrice: 2.5,
    discountPercent: 20,
    cat: 'Masks',
    img: 'p-mediheal-rose',
    desc: 'A glow sheet mask with rose extract and PDRN for a healthy, luminous complexion.',
    use: 'Leave on 15–20 minutes, then pat in the remaining essence.',
    profiles: ['calm', 'hydration', 'barrier'],
    keyActive: 'Damask Rose Water & Vegan PDRN',
    firstBuyDrop: {
      rank: '05',
      tag: '€2 Impulse Glow Grab',
      note: 'Zero-risk €2 starter treat at checkout—ideal to try vegan PDRN for the first time.',
    },
  },
  {
    id: 'tamburins-chamo',
    brand: 'TAMBURINS',
    name: 'Chamo Perfume',
    size: '50 ml',
    price: 83.5,
    originalPrice: 98,
    discountPercent: 15,
    cat: 'Fragrance',
    img: 'p-tamburins-chamo',
    desc: 'A soft, comforting fragrance from the cult Seoul perfume house, with a clean chamomile signature.',
    use: 'Spray on pulse points.',
    profiles: ['calm', 'barrier'],
    keyActive: 'Thick Chamomile · Soft Wood Grain · Musk',
    firstBuyDrop: {
      rank: '06',
      tag: 'Seoul Fragrance Drop',
      note: 'Limited Paris luggage allotment from Hannam-dong with €14.50 off only during March–April.',
    },
  },
  {
    id: 'lactofit',
    brand: 'LACTO-FIT',
    name: 'Probiotics Gold',
    size: 'Box of stick sachets',
    price: 12,
    originalPrice: 16,
    discountPercent: 25,
    cat: 'Wellness',
    img: 'p-lactofit',
    desc: 'Korea’s best-known daily probiotic, in easy stick sachets. Beauty that starts from within.',
    use: 'One stick a day, directly or mixed in water.',
    profiles: ['calm', 'barrier', 'hydration', 'balance'],
    keyActive: '2 Billion CFU Synbiotic Blend',
  },
];

export const CATEGORIES: ProductCategory[] = [
  'All',
  'Skincare',
  'Haircare',
  'Makeup',
  'Masks',
  'Fragrance',
  'Wellness',
];

export const OTHER_BRANDS = [
  'ILLIYOON',
  'AMUSE',
  'rom&nd',
  'NONFICTION',
  'Delight Project',
  'Beauty supplement sticks',
];

export interface PopupStation {
  number: string;
  korean: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  timing: string;
}

export const POPUP_STATIONS: PopupStation[] = [
  {
    number: '01',
    korean: '진단 스튜디오',
    title: 'Free Skin & Scalp Diagnosis Studio',
    subtitle: '20-minute optical scan · Walk-in or booked',
    description:
      'Every visit starts with clinical-grade Korean diagnostic optics measuring hydration retention, TEWL barrier strength, pore texture, redness, and scalp follicle sebum.',
    highlights: [
      'Real-time hydration, sebum & sensitivity mapping',
      'Micro-camera scalp & hair fiber check',
      'Printed + K-Lounge App synced prescription card',
    ],
    timing: 'Daily slots · 11:00 – 19:30',
  },
  {
    number: '02',
    korean: '셀렉션 바',
    title: 'First-in-France Seoul Curation',
    subtitle: '15+ cult brands · Full open testers',
    description:
      'Touch, layer, and compare Olive Young #1 formulas and Seoul flagship exclusives rarely stocked in Europe—curated by skin function rather than hype.',
    highlights: [
      'Full AESTURA, SKIN1004 & Torriden barrier & hydration bars',
      'UNOVE silk protein hair textures to test',
      'JUNG SAEM MOOL & CLIO shade-matching mirrors',
    ],
    timing: 'Open access all day',
  },
  {
    number: '03',
    korean: '향기 라운지',
    title: 'Sensory Fragrance & Texture Lounge',
    subtitle: 'TAMBURINS · NONFICTION · Calm ritual room',
    description:
      'A quiet brushed-silver alcove dedicated to slow sensory testing—pair Seoul botanical hand balms and clean chamomile perfumes with chilled Korean barley tea.',
    highlights: [
      'TAMBURINS Chamo & NONFICTION scent blotter gallery',
      'Multi-layer essence & cream absorption comparison',
      'Shade & undertone consultation corner',
    ],
    timing: 'Open access all day',
  },
  {
    number: '04',
    korean: '이너뷰티 바',
    title: 'Inner-Beauty & Seoul Snack Counter',
    subtitle: 'LACTO-FIT · Delight Project · Collagen sticks',
    description:
      'Korean beauty begins in the gut. Sample stick-pack probiotics, vitamin jelly sticks, and cult Seoul bagel chips from Delight Project while reviewing your routine.',
    highlights: [
      'Complimentary LACTO-FIT Gold tasting sticks',
      'Delight Project honey-butter & garlic bagel chips',
      'Daily roasted corn-silk & yuja infusions',
    ],
    timing: '12:00 – 19:00 tastings',
  },
  {
    number: '05',
    korean: '아케이드 & 혜택',
    title: 'Glow Arcade & Gift Redemption Desk',
    subtitle: 'Redeem online quiz & game reward codes',
    description:
      'Present any claim code won in the online Glow Arcade or Skin Quiz right at the counter to collect complimentary MEDIHEAL sheet masks, fast-pass slots, and totes.',
    highlights: [
      'Instant voucher verification with your digital claim code',
      'Limited 2-Week March–April Capsule Drops for visitors',
      'Priority diagnosis check-in lane for Pass holders',
    ],
    timing: 'Tue – Sun · Until 20:00',
  },
  {
    number: '06',
    korean: '아바타 스테이션',
    title: 'K-Lounge App & Avatar Sync Terminal',
    subtitle: 'Digital skin twin · NFT holder perks',
    description:
      'Tap your phone at the NFC mirror after your scan to generate your live K-Lounge Avatar, unlock daily Cycle Sync schedules, and claim holder-only Seoul drops.',
    highlights: [
      'Instant diagnosis-to-avatar profile pairing',
      'Preview the daily selfie hydration tracker',
      'In-store NFT collector gift shelf',
    ],
    timing: 'All opening hours',
  },
];

export const POPUP_MONTH_HIGHLIGHTS = [
  {
    month: 'Week 1 · March',
    korean: '1주차 · 3월 오픈',
    theme: 'Grand Opening, Peggy Gou Night & Barrier Reset',
    dates: 'March 23 – March 29, 2026',
    detail:
      'Opening week with First-1,000 Hangul Passports, complimentary daily Salt Bread (first 100), ceramide diagnostics, and Peggy Gou opening night.',
  },
  {
    month: 'Week 2 · April',
    korean: '2주차 · 4월 피날레',
    theme: 'Glass Skin Lab, Keyring Bar & Grand Tombola Draw',
    dates: 'March 30 – April 5, 2026',
    detail:
      'Final week featuring live cushion sticker customization, UNOVE scalp checks, and the closing Grand Tombola draw for a flight to Seoul.',
  },
];

export type SkinProfileKey = 'barrier' | 'hydration' | 'calm' | 'balance';

export interface QuizQuestion {
  id: string;
  stepLabel: string;
  question: string;
  options: Array<{
    id: string;
    label: string;
    detail: string;
    weights: Partial<Record<SkinProfileKey, number>>;
    hair?: 'repair' | 'light';
  }>;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'morning-feel',
    stepLabel: '01 · Baseline',
    question: 'How does your skin feel 20 minutes after cleansing with plain water?',
    options: [
      {
        id: 'tight',
        label: 'Tight, papery or flaky around cheeks',
        detail: 'Moisture evaporates quickly without rich lipid support.',
        weights: { barrier: 3, hydration: 1 },
      },
      {
        id: 'dehydrated',
        label: 'Dull with fine surface lines, yet still produces oil',
        detail: 'Classic water-dehydrated skin seeking humectants.',
        weights: { hydration: 3, balance: 1 },
      },
      {
        id: 'reactive',
        label: 'Flushed, warm or slightly prickly to touch',
        detail: 'Microbiome & barrier need calming cica intervention.',
        weights: { calm: 3, barrier: 1 },
      },
      {
        id: 'combo',
        label: 'Comfortable overall, shiny on T-zone by afternoon',
        detail: 'Balanced to combination seeking light sebum harmony.',
        weights: { balance: 3, hydration: 1 },
      },
    ],
  },
  {
    id: 'primary-goal',
    stepLabel: '02 · Priority',
    question: 'What is the #1 shift you want from a Korean routine this March – April?',
    options: [
      {
        id: 'plump',
        label: 'Bouncy, luminous glass-skin hydration',
        detail: 'Deep multi-molecular moisture without sticky residue.',
        weights: { hydration: 3 },
      },
      {
        id: 'soothe',
        label: 'Reduce visible redness and reactivity',
        detail: 'Steady, cool, predictable comfort all day.',
        weights: { calm: 3 },
      },
      {
        id: 'fortify',
        label: 'Rebuild resilience after winter dryness or actives',
        detail: 'Triple-lipid ceramide protection.',
        weights: { barrier: 3 },
      },
      {
        id: 'refine',
        label: 'Smooth texture, refined pores & weightless glow',
        detail: 'Balanced oil-water ratio under SPF and makeup.',
        weights: { balance: 3 },
      },
    ],
  },
  {
    id: 'scalp-hair',
    stepLabel: '03 · Scalp & Hair',
    question: 'Because K-beauty treats scalp like facial skin—how is your hair right now?',
    options: [
      {
        id: 'damaged',
        label: 'Dry, colour-treated or heat-stressed lengths',
        detail: 'Needs concentrated protein & silk lipid bonding.',
        weights: { barrier: 1, calm: 1 },
        hair: 'repair',
      },
      {
        id: 'fine-oily',
        label: 'Fine strands or roots that lose volume fast',
        detail: 'Prefers weightless hydration and micro-shine oil on ends.',
        weights: { balance: 2 },
        hair: 'light',
      },
      {
        id: 'sensitive-scalp',
        label: 'Tight or easily irritated scalp between washes',
        detail: 'Gentle cleansing and gentle moisture balance.',
        weights: { calm: 2 },
        hair: 'repair',
      },
      {
        id: 'normal-dull',
        label: 'Healthy scalp, just lacking Seoul mirror shine',
        detail: 'Focus on glossy cuticle sealing.',
        weights: { hydration: 1 },
        hair: 'light',
      },
    ],
  },
  {
    id: 'texture',
    stepLabel: '04 · Texture Preference',
    question: 'Which texture feels most natural on your skin every morning?',
    options: [
      {
        id: 'watery',
        label: 'Toner pads + weightless watery serum layers',
        detail: 'Korean 3-skin absorption style.',
        weights: { hydration: 2, balance: 1 },
      },
      {
        id: 'cushion-cream',
        label: 'Velvety, enveloping cream that hugs the skin',
        detail: 'Long-wear moisture lock for Paris weather.',
        weights: { barrier: 2, calm: 1 },
      },
      {
        id: 'gel',
        label: 'Fresh, cooling gel-cream that disappears on contact',
        detail: 'Zero heaviness under foundation or cushion.',
        weights: { balance: 2, hydration: 1 },
      },
      {
        id: 'ampoule',
        label: 'Silky ampoule + barrier seal combo',
        detail: 'Targeted soothing active first, soft seal second.',
        weights: { calm: 2, barrier: 1 },
      },
    ],
  },
  {
    id: 'lifestyle',
    stepLabel: '05 · Environment',
    question: 'What stresses your skin most in your daily Paris routine?',
    options: [
      {
        id: 'commute',
        label: 'Metro air, wind & fluctuating spring temperatures',
        detail: 'Triggers sudden moisture loss and cheek tightness.',
        weights: { barrier: 2, calm: 1 },
      },
      {
        id: 'screens',
        label: 'Long indoor screen hours & low office humidity',
        detail: 'Depletes surface water reserve by 3 PM.',
        weights: { hydration: 2 },
      },
      {
        id: 'pollution',
        label: 'City dust, sunscreen buildup & congested pores',
        detail: 'Needs gentle daily resurfacing + light balance.',
        weights: { balance: 2 },
      },
      {
        id: 'stress',
        label: 'Hormonal cycle shifts or lack of sleep',
        detail: 'Sudden flare-ups, sensitivity and dullness.',
        weights: { calm: 2 },
      },
    ],
  },
];

export interface SkinProfileResult {
  key: SkinProfileKey;
  korean: string;
  title: string;
  tagline: string;
  summary: string;
  morningTip: string;
  eveningTip: string;
  metrics: {
    hydrationNeed: number;
    barrierFocus: number;
    soothingPriority: number;
  };
  productIds: string[];
  hairProductIds: string[];
}

export const SKIN_PROFILES: Record<SkinProfileKey, SkinProfileResult> = {
  barrier: {
    key: 'barrier',
    korean: '수분 장벽 리셋',
    title: 'Ceramide Barrier Builder',
    tagline: 'Lipid replenishment & all-day Paris weather shield',
    summary:
      'Your skin barrier is craving structured lipids—ceramides, cholesterol, and fatty acids in golden skin-identical ratios to stop moisture loss before it starts.',
    morningTip: 'Press damp essence toner gently into skin, then seal immediately with Atobarrier 365 Cream before SPF.',
    eveningTip: 'Layer a soothing ampoule underneath a generous night layer of cream, plus a Rose PDRN mask twice weekly.',
    metrics: { hydrationNeed: 78, barrierFocus: 96, soothingPriority: 82 },
    productIds: ['aestura-cream', 'skin1004-ampoule', 'mediheal-rose'],
    hairProductIds: ['unove-shampoo', 'unove-treatment'],
  },
  hydration: {
    key: 'hydration',
    korean: '물광 다층 수분',
    title: '5D Glass-Glow Hydrator',
    tagline: 'Weightless multi-molecular plumping hydration',
    summary:
      'Your skin lacks water rather than heavy oil. Five molecular weights of hyaluronic acid flood multiple surface layers for bouncy, reflective Korean glass skin.',
    morningTip: 'Sweep DIVE-IN Multi Pad across cheeks for 3 minutes, follow with DIVE-IN Serum while skin stays mist-damp.',
    eveningTip: 'Double-layer your serum before sealing with DIVE-IN Soothing Cream and boost inner radiance with LACTO-FIT.',
    metrics: { hydrationNeed: 95, barrierFocus: 70, soothingPriority: 68 },
    productIds: ['torriden-pad', 'torriden-serum', 'torriden-cream'],
    hairProductIds: ['unove-shampoo', 'unove-oil'],
  },
  calm: {
    key: 'calm',
    korean: '시카 진정 밸런스',
    title: 'Probio-Cica Calm Seeker',
    tagline: 'Microbiome soothing & redness reduction',
    summary:
      'Reactive skin thrives when inflammation stays quiet. Fermented Madagascan Centella paired with probiotics stabilizes redness and builds calm tolerance.',
    morningTip: 'Skip harsh rubbing—pat Probio-Cica Essence Toner directly with clean palms, then mist-seal with light cream.',
    eveningTip: 'Use 3 drops of Probio-Cica Intensive Ampoule focused on flushed zones and finish with Rose PDRN Sheet Mask on stressful weeks.',
    metrics: { hydrationNeed: 80, barrierFocus: 86, soothingPriority: 97 },
    productIds: ['skin1004-toner', 'skin1004-ampoule', 'skin1004-cream'],
    hairProductIds: ['unove-shampoo', 'unove-treatment'],
  },
  balance: {
    key: 'balance',
    korean: '산뜻 수분 밸런스',
    title: 'Dewy Oil-Water Balancer',
    tagline: 'Cooling gel textures & natural satin finish',
    summary:
      'Your skin seeks equilibrium: fresh water hydration without congestion, paired with breathable barriers that sit seamlessly beneath JUNG SAEM MOOL cushion wear.',
    morningTip: 'Refresh with a DIVE-IN Multi Pad swipe, then lock in cooling hydration using Atobarrier 365 Hydro Soothing Cream.',
    eveningTip: 'Support clarity with a Vitamin C Sheet Mask mid-week and restore bounce with 5D Hyaluronic Serum.',
    metrics: { hydrationNeed: 84, barrierFocus: 72, soothingPriority: 74 },
    productIds: ['torriden-pad', 'aestura-hydro', 'mediheal-vitc'],
    hairProductIds: ['unove-oil', 'lactofit'],
  },
};

export interface ArcadePrize {
  id: string;
  tier: 'Gift' | 'Access' | 'Treat';
  title: string;
  detail: string;
  storeNote: string;
  costPoints: number;
  codePrefix: string;
}

export const ARCADE_PRIZES: ArcadePrize[] = [
  {
    id: 'prize-mask',
    tier: 'Gift',
    title: 'Complimentary MEDIHEAL Sheet Mask',
    detail: 'Choose Vitamin C or Rose PDRN at check-in at 10 rue Pastourelle.',
    storeNote: 'Valid once per visitor · March – April (2 weeks only)',
    costPoints: 100,
    codePrefix: 'KL-MASK',
  },
  {
    id: 'prize-snack',
    tier: 'Treat',
    title: 'Seoul Snack & Probiotic Tasting Duo',
    detail: 'A Delight Project bagel chip pack + LACTO-FIT Gold sachet at the bar.',
    storeNote: 'Redeem at Inner-Beauty Counter · While stocks last',
    costPoints: 120,
    codePrefix: 'KL-TASTE',
  },
  {
    id: 'prize-fastpass',
    tier: 'Access',
    title: 'Diagnosis Fast-Pass Slot',
    detail: 'Skip the walk-in wait for your complimentary Skin + Hair Diagnosis.',
    storeNote: 'Show code at Studio reception · 2 weeks in March – April',
    costPoints: 150,
    codePrefix: 'KL-FAST',
  },
  {
    id: 'prize-15off',
    tier: 'Gift',
    title: '15% Off Your Pop-Up Selection',
    detail: 'Applies to your curated skincare, haircare or makeup bag in store.',
    storeNote: 'Valid on your visit · 10 rue Pastourelle',
    costPoints: 200,
    codePrefix: 'KL-PARIS15',
  },
  {
    id: 'prize-tote',
    tier: 'Gift',
    title: 'Limited K-Lounge Marais Canvas Tote',
    detail: 'Collector navy & silver editorial tote reserved for your pop-up visit.',
    storeNote: 'Limited 2-week March–April edition · Present code at desk',
    costPoints: 250,
    codePrefix: 'KL-TOTE',
  },
];

export interface MemoryCardItem {
  pairId: string;
  label: string;
  sub: string;
  korean: string;
  imgKey?: string;
}

export const MEMORY_PAIRS: MemoryCardItem[] = [
  {
    pairId: 'ceramide',
    label: 'AESTURA',
    sub: 'Ceramide 365',
    korean: '세라마이드',
    imgKey: 'p-aestura-cream',
  },
  {
    pairId: 'centella',
    label: 'SKIN1004',
    sub: 'Probio-Cica',
    korean: '병풀 진정',
    imgKey: 'p-skin1004-ampoule',
  },
  {
    pairId: 'hyaluronic',
    label: 'Torriden',
    sub: '5D Hyaluronic',
    korean: '히알루론산',
    imgKey: 'p-torriden-serum',
  },
  {
    pairId: 'silk',
    label: 'UNOVE',
    sub: 'Silk Protein',
    korean: '실크 케어',
    imgKey: 'p-unove-oil',
  },
  {
    pairId: 'rose',
    label: 'MEDIHEAL',
    sub: 'Rose PDRN',
    korean: '로즈 글로우',
    imgKey: 'p-mediheal-rose',
  },
  {
    pairId: 'chamo',
    label: 'TAMBURINS',
    sub: 'Chamo Note',
    korean: '카모 향',
    imgKey: 'p-tamburins-chamo',
  },
];

export interface CyclePhaseDetail {
  id: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  name: string;
  shortName: string;
  korean: string;
  hormoneState: string;
  skinImpact: string;
  focus: string;
  ingredient: string;
  avoidOrPause: string;
  product: string;
  productIds: [string, string];
  morningRoutine: string;
  eveningRoutine: string;
  tip: string;
}

export const APP_CYCLE_PHASES: CyclePhaseDetail[] = [
  {
    id: 'menstrual',
    name: 'Days 1–5 · Rest & Barrier',
    shortName: 'Menstrual',
    korean: '생리기 · 장벽 진정',
    hormoneState: 'Estrogen & progesterone at lowest baseline',
    skinImpact: 'Higher transepidermal water loss, drier patches & heightened sensitivity',
    focus: 'Replenish depleted lipids & soothe fragile skin',
    ingredient: 'Ceramide Capsules + Panthenol',
    avoidOrPause: 'Pause high-acid exfoliants & retinol',
    product: 'AESTURA Atobarrier 365 Cream + Rose PDRN Mask',
    productIds: ['aestura-cream', 'mediheal-rose'],
    morningRoutine: 'Rinse lightly or use lukewarm water, pat essence toner, then seal with Atobarrier 365 Cream before SPF.',
    eveningRoutine: 'Double-layer ceramide moisture and calm tightness with a chilled MEDIHEAL Rose PDRN sheet mask.',
    tip: 'Skin barrier permeability rises during menstruation. Keep steps cushiony, unscented, and deeply lipid-rich.',
  },
  {
    id: 'follicular',
    name: 'Days 6–13 · Brighten & Glow',
    shortName: 'Follicular',
    korean: '여포기 · 물광 부스트',
    hormoneState: 'Estrogen steadily rising · collagen synthesis up',
    skinImpact: 'Skin feels calmer, clearer & more receptive to active layering',
    focus: 'Maximize glass-skin hydration & bounce',
    ingredient: '5D Hyaluronic Acid + Vitamin C',
    avoidOrPause: 'Avoid overly heavy occlusive balms by day',
    product: 'Torriden DIVE-IN Serum + MEDIHEAL Vitamin C',
    productIds: ['torriden-serum', 'mediheal-vitc'],
    morningRoutine: 'Swipe a Torriden DIVE-IN Multi Pad for gentle polish, then press 3 drops of 5D Hyaluronic Serum into damp skin.',
    eveningRoutine: 'Treat twice weekly with Vitamin C brightening sheet masks while absorption and cell turnover peak.',
    tip: 'Your prime K-beauty glow window. Water-based humectant layers absorb best right after period days end.',
  },
  {
    id: 'ovulation',
    name: 'Days 14–16 · Light & Luminous',
    shortName: 'Ovulation',
    korean: '배란기 · 산뜻 수분',
    hormoneState: 'Estrogen peaks alongside LH surge',
    skinImpact: 'High natural radiance paired with mild afternoon T-zone shine',
    focus: 'Lock in weightless dew without clogging pores',
    ingredient: 'Trehalose & Cooling Amino Complex',
    avoidOrPause: 'Skip thick oil-heavy cream masks',
    product: 'AESTURA Hydro Soothing Cream + JSM Cushion',
    productIds: ['aestura-hydro', 'jsm-cushion'],
    morningRoutine: 'Use a thin cooling layer of Atobarrier 365 Hydro Soothing Cream followed by JUNG SAEM MOOL SPF50+ Cushion.',
    eveningRoutine: 'Cleanse thoroughly to clear sebum buildup and apply a light hydrating toner + soothing gel-cream.',
    tip: 'Peak natural luminance. Switch to breathable gel textures and thin cushion coverage that flexes with skin warmth.',
  },
  {
    id: 'luteal',
    name: 'Days 17–28 · Calm & Clarify',
    shortName: 'Luteal',
    korean: '황체기 · 피지 & 시카',
    hormoneState: 'Progesterone rises, triggering excess sebum',
    skinImpact: 'Pores appear fuller, higher risk of pre-period congestion & redness',
    focus: 'Steady sebum flow & calm inflammation early',
    ingredient: 'Fermented Centella + Probiotics',
    avoidOrPause: 'Pause pore-clogging richness on the chin/jawline',
    product: 'SKIN1004 Probio-Cica Ampoule + LACTO-FIT',
    productIds: ['skin1004-ampoule', 'lactofit'],
    morningRoutine: 'Prep with fermented Centella essence-toner and lighter gel hydration across T-zone & jawline.',
    eveningRoutine: 'Spot-layer Probio-Cica Intensive Ampoule over reactive areas and take 1 LACTO-FIT Probiotic stick daily.',
    tip: 'Progesterone increases oil viscosity before your period. Pair microbiome cica outdoors with gut probiotics within.',
  },
];

export const CYCLE_SYMPTOM_ADVICE: Record<
  'breakouts' | 'dryness' | 'redness' | 'oiliness' | 'cramps' | 'fatigue',
  { label: string; tip: string; bonusProductId: string }
> = {
  breakouts: {
    label: 'Hormonal blemishes',
    tip: 'Do not pick or stack drying acids. Dab SKIN1004 Probio-Cica Ampoule locally and use DIVE-IN toner pads gently on congested zones.',
    bonusProductId: 'skin1004-ampoule',
  },
  dryness: {
    label: 'Tight / flaky skin',
    tip: 'Sandwich 5D Hyaluronic Serum under Atobarrier 365 Cream while skin is still mist-damp.',
    bonusProductId: 'aestura-cream',
  },
  redness: {
    label: 'Warmth / flushing',
    tip: 'Chill your Probio-Cica Cream for 10 minutes before evening application to visibly quiet reactivity.',
    bonusProductId: 'skin1004-cream',
  },
  oiliness: {
    label: 'T-zone shine',
    tip: 'Swap rich night cream for Torriden DIVE-IN Soothing Cream or AESTURA Hydro Gel on the nose and chin.',
    bonusProductId: 'torriden-cream',
  },
  cramps: {
    label: 'Period cramps / low energy',
    tip: 'Keep bedtime minimal (2 steps max): cleansing + a 15-minute MEDIHEAL Rose PDRN sheet mask while resting.',
    bonusProductId: 'mediheal-rose',
  },
  fatigue: {
    label: 'Dull / puffy mornings',
    tip: 'Take 1 LACTO-FIT Probiotic Gold stick and brighten dull skin tone with a quick morning Vitamin C sheet mask.',
    bonusProductId: 'mediheal-vitc',
  },
};

export const APP_NFT_PASSES = [
  {
    id: 'nft-marais',
    edition: 'Edition 01 · 300 Passes',
    name: 'Le Marais Founding Key',
    perk: '2 complimentary MEDIHEAL masks during the 2-week March–April pop-up + priority diagnosis booking.',
  },
  {
    id: 'nft-glass',
    edition: 'Edition 02 · 150 Passes',
    name: 'Seoul Glow Collector',
    perk: 'Private April closing evening testing session + complimentary Delight Project & UNOVE deluxe gift set.',
  },
  {
    id: 'nft-salon',
    edition: 'Edition 03 · 75 Passes',
    name: 'K-Lounge Salon VIP',
    perk: 'Full seasonal routine refill at 10 rue Pastourelle + early invite to Paris flagship launch.',
  },
];

export interface DetectiveCase {
  id: string;
  caseNumber: string;
  clues: {
    packaging: string;
    colorTexture: string;
    ingredient: string;
  };
  answerBrand: string;
  options: string[];
  revealProductImg: string;
  rewardNote: string;
}

export const GUESS_BRAND_CASES: DetectiveCase[] = [
  {
    id: 'case-torriden',
    caseNumber: 'File 01',
    clues: {
      packaging: 'Clean clinical sky-blue dropper bottle with crisp white label',
      colorTexture: 'Translucent pastel blue watery serum with instant absorption',
      ingredient: '5D Low-Molecular Hyaluronic Acid + Panthenol',
    },
    answerBrand: 'Torriden',
    options: ['Torriden', 'AESTURA', 'SKIN1004', 'CLIO'],
    revealProductImg: 'p-torriden-serum',
    rewardNote: 'Olive Young #1 Hydration Icon',
  },
  {
    id: 'case-aestura',
    caseNumber: 'File 02',
    clues: {
      packaging: 'Minimalist white apothecary tube with silver cap & clean navy typography',
      colorTexture: 'Silky ivory cream containing visible soft-melt lipid micro-capsules',
      ingredient: 'Ceramide · Cholesterol · Fatty Acids (365 Ratio)',
    },
    answerBrand: 'AESTURA',
    options: ['MEDIHEAL', 'AESTURA', 'TAMBURINS', 'UNOVE'],
    revealProductImg: 'p-aestura-cream',
    rewardNote: 'Korea Dermatologist Barrier Standard',
  },
  {
    id: 'case-skin1004',
    caseNumber: 'File 03',
    clues: {
      packaging: 'Sculpted warm-amber glass silhouette inspired by botanical extracts',
      colorTexture: 'Rich milky-gold cushiony ampoule that cools flushed cheeks',
      ingredient: 'Fermented Madagascan Centella Asiatica + Probio-Cica',
    },
    answerBrand: 'SKIN1004',
    options: ['JUNG SAEM MOOL', 'LACTO-FIT', 'SKIN1004', 'Torriden'],
    revealProductImg: 'p-skin1004-ampoule',
    rewardNote: 'Calming Microbiome Pioneer',
  },
  {
    id: 'case-tamburins',
    caseNumber: 'File 04',
    clues: {
      packaging: 'Architectural sculptural bottle with matte geometric silver cap',
      colorTexture: 'Fine-mist eau de parfum leaving soft velvety skin warmth',
      ingredient: 'Thick Chamomile · Soft Wood Grain · Musk',
    },
    answerBrand: 'TAMBURINS',
    options: ['TAMBURINS', 'UNOVE', 'CLIO', 'AESTURA'],
    revealProductImg: 'p-tamburins-chamo',
    rewardNote: 'Cult Seoul Fragrance House',
  },
];

export const PASSPORT_CUSTOMS_PACK = [
  { item: '1 Sheet Mask', detail: 'MEDIHEAL Vitamin C or Rose PDRN' },
  { item: '1 Salt Bread', detail: 'Korean Sogeum-ppang (소금빵) fresh baked' },
  { item: '1 Limonade Maison', detail: 'Chilled Yuzu or Fresh Ginger infusion' },
  { item: '1 Grand Tombola Ticket', detail: 'Entry for Seoul flight & wellness prizes' },
];

export const TOMBOLA_GRAND_PRIZES = [
  {
    id: 't-flight',
    label: 'Round-Trip Flight Ticket to Seoul (KR)',
    tier: 'Grand Draw Entry',
    detail: 'Official golden capsule entry for the Spring Closing Paris–Incheon flight draw.',
  },
  {
    id: 't-wellness',
    label: 'K-Beauty & Spa Wellness Gift Set',
    tier: 'Instant / Draw',
    detail: 'TAMBURINS Chamo + UNOVE Silk Hair ritual curated for Paris recovery.',
  },
  {
    id: 't-box',
    label: '1st Quarterly K-Lounge Skincare Box',
    tier: 'Quarterly Drop',
    detail: 'Four seasonal Seoul cult full-sizes delivered every quarter.',
  },
  {
    id: 't-fullsize',
    label: 'Full-Size K-Beauty Mystery Discovery',
    tier: 'In-Store Redeem',
    detail: 'Claim a surprise full-size hero at the 10 rue Pastourelle checkout.',
  },
];

export const QUARTERLY_BOX_EDITIONS = [
  {
    season: 'Spring Edition · March–April',
    korean: '봄 · 장벽 & 물광',
    title: 'The Marais Opening Box',
    price: 59,
    contents: 'Barrier cream, 5D Hyaluronic serum, 2 MEDIHEAL masks & Delight Project snack.',
  },
  {
    season: 'Summer Edition · June–August',
    korean: '여름 · 쿨링 & 진정',
    title: 'Seoul Heat & Pore Reset',
    price: 59,
    contents: 'Soothing Centella essence, SPF50+ cushion, cooling gel & yuzu mist.',
  },
  {
    season: 'Autumn Edition · Sept–Nov',
    korean: '가을 · 실크 & 리페어',
    title: 'Radiance & Hair Silk Edit',
    price: 64,
    contents: 'UNOVE Damage Treatment EX, Vitamin C ampoule, TAMBURINS hand ritual & probiotics.',
  },
];

export const INSTORE_LIMITED_PERKS = [
  {
    code: 'First 100 Daily',
    korean: '소금빵 100명',
    title: 'Warm Korean Salt Bread',
    detail: 'Complimentary freshly baked Korean Sogeum-ppang + homemade Yuzu or Ginger Lemonade for the first 100 visitors.',
  },
  {
    code: 'Lip Bar Perk',
    korean: '립 키링 바',
    title: 'Buy 1 Lip Product = Custom Keyring',
    detail: 'Create your own ribbon, cherry & heart bag-charm keyring at our accessory bar with any lip tint or balm.',
  },
  {
    code: 'Custom Cushion',
    korean: '쿠션 스티커',
    title: 'Custom Cushions with Stickers',
    detail: 'Personalize your JUNG SAEM MOOL cushion case with metallic Seoul stickers & Hangul monograms.',
  },
  {
    code: 'VIP & Creators',
    korean: '브이아이피 패스',
    title: 'Skip-the-Line & Creator Studio',
    detail: 'Booked VIP slots bypass the Marais queue with access to our lit creator zone & cocktail bar.',
  },
];

export const SPECIAL_GUEST_SPOTLIGHT = {
  eyebrow: 'Special Guest · Opening Season',
  korean: '스페셜 게스트 · 페기 구',
  name: 'Peggy Gou',
  role: 'South Korean DJ, Producer & Singer-Songwriter',
  eventTitle: 'K-Lounge × Peggy Gou Paris Cocktail & Bakery Night',
  dateNote: '2-Week Opening Window · March 23 – April 5, 2026 · 10 rue Pastourelle',
  description:
    'Honoring the bridge between Seoul and Paris nightlife: a special opening guest appearance with vinyl curation, artisan Korean bakery bites, and priority creator-zone access for VIP pass holders.',
  highlights: [
    'Live Seoul-meets-Paris DJ set & vinyl listening wall',
    'Limited bakery pop-up moment with fresh Salt Bread & Yuzu spritz',
    'Priority entry for VIP Diagnosis & Passport Holders',
  ],
};

export type FaqCategory =
  | 'All'
  | 'Pop-Up & Access'
  | 'Discounts & First Buys'
  | 'Skin, Hair & Cycle'
  | 'Passport, Games & VIP'
  | 'AI & Voice';

export interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, 'All'>;
  question: string;
  answer: string;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  'All',
  'Pop-Up & Access',
  'Discounts & First Buys',
  'Skin, Hair & Cycle',
  'Passport, Games & VIP',
  'AI & Voice',
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-dates-location',
    category: 'Pop-Up & Access',
    question: 'When and where is the K-Lounge Paris pop-up open?',
    answer:
      'K-Lounge Paris runs for two exclusive weeks from March 23 to April 5, 2026 at 10 rue Pastourelle, 75003 Paris (Le Marais). Opening hours are Tuesday to Sunday, 11:00 to 20:00 (closed Mondays). Nearest Metro stations: Arts et Métiers, Filles du Calvaire, and Temple.',
  },
  {
    id: 'faq-walkin-booking',
    category: 'Pop-Up & Access',
    question: 'Do I need a ticket or booking to enter the pop-up?',
    answer:
      'Entry to the pop-up space, Salt Bread & Matcha bar, and tester tables is free for walk-ins. Pre-booking is only needed if you want a reserved 15-minute Skin + Hair Diagnosis slot or VIP Skip-the-Line access with our aestheticians.',
  },
  {
    id: 'faq-discounts-bag',
    category: 'Discounts & First Buys',
    question: 'How do the 15%–25% pop-up discounts and Visit Bag reservation work?',
    answer:
      'Every curated product features an exclusive 15% to 25% launch discount valid only during the March 23 – April 5 pop-up (plus the €49 Glass Skin Starter Trio). Adding products to your Visit Bag reserves them for your Le Marais visit—there is no online shipping checkout; you pay and pick up directly on site.',
  },
  {
    id: 'faq-first-buys',
    category: 'Discounts & First Buys',
    question: 'What are the best "first things to buy" if I am new to Korean beauty?',
    answer:
      'Check our Opening Drop in the Products tab: AESTURA Atobarrier 365 Cream (€22.50, -20%), Torriden DIVE-IN Hyaluronic Serum (€16, -20%), UNOVE Deep Damage Treatment EX (€15, -20%), JUNG SAEM MOOL Skin Nuder Cushion (€30.50, -15%), MEDIHEAL Rose PDRN Mask (€2), and TAMBURINS Chamo Perfume (€83.50).',
  },
  {
    id: 'faq-diagnosis-report',
    category: 'Skin, Hair & Cycle',
    question: 'What happens during the complimentary Skin + Hair Diagnosis?',
    answer:
      'A K-Lounge aesthetician scans hydration, sebum balance, barrier sensitivity, and scalp comfort using high-magnification Derm-Vision optics, prints your bespoke "This is My Skin Report" broadsheet, and matches you with a calibrated routine and sample kit.',
  },
  {
    id: 'faq-period-tracker',
    category: 'Skin, Hair & Cycle',
    question: 'How does the Period Tracking & Cycle Skincare Advisor work?',
    answer:
      'Inside the App & Cycle tab, enter your last period start date, cycle length, and daily symptoms (breakouts, dryness, redness, oiliness, cramps, or fatigue). The advisor adapts AM/PM active skincare ingredients and gentle alternatives across Menstrual, Follicular, Ovulation, and Luteal phases. Your logs stay privately in your own browser storage.',
  },
  {
    id: 'faq-passport-tombola',
    category: 'Passport, Games & VIP',
    question: 'How do I complete the Passport Trail and enter the Grand Tombola?',
    answer:
      'Complete the 3 digital missions in the Passport & VIP tab—Social Boarding, Match-3 Flip Cards, and K-Beauty Detective—to unlock all 3 stamps and your numbered #KL-TOMBOLA ticket for prizes including Korean sheet mask boxes, Matcha pairings, and a round-trip flight to Seoul.',
  },
  {
    id: 'faq-peggy-gou',
    category: 'Passport, Games & VIP',
    question: 'How can I attend the Peggy Gou Paris Cocktail & Bakery Night?',
    answer:
      'Booking a VIP Skip-the-Line slot or completing your K-Lounge Passport unlocks priority entry alerts for the opening-season K-Lounge × Peggy Gou evening with vinyl curation, complimentary Salt Bread, and yuzu cocktails at 10 rue Pastourelle.',
  },
  {
    id: 'faq-voice-ai',
    category: 'AI & Voice',
    question: 'What can I ask or control with Vocal Commands in the AI Agent?',
    answer:
      'Speak naturally in English, French, or Korean! Ask any question about ingredients, barrier routines, or pop-up logistics—or give hands-free commands like "Open products", "Add Torriden serum to my bag", "Book a free skin diagnosis", "Go to period tracker", or "Start the skin quiz".',
  },
  {
    id: 'faq-voice-privacy',
    category: 'AI & Voice',
    question: 'Which browsers support voice input and voice replies?',
    answer:
      'Clicking the microphone starts instant voice capture using your browser speech recognition or microphone recording transcribed via Gemini, and you can toggle spoken AI audio replies on or off anytime.',
  },
];

export const VOICE_COMMAND_PRESETS: { label: string; prompt: string; kind: 'command' | 'question' }[] = [
  {
    label: 'Open discounted products',
    prompt: 'Show me the Products tab and highlight the best first-buy discounts',
    kind: 'command',
  },
  {
    label: 'Add Torriden Serum to bag',
    prompt: 'Add Torriden DIVE-IN Hyaluronic Serum to my visit bag',
    kind: 'command',
  },
  {
    label: 'Open Period & Cycle Skincare',
    prompt: 'Take me to the Period Tracking and Cycle Skincare advisor',
    kind: 'command',
  },
  {
    label: 'Book Free Diagnosis',
    prompt: 'Book my free Skin + Hair Diagnosis appointment',
    kind: 'command',
  },
  {
    label: 'Dates, hours & address',
    prompt: 'When is the Paris pop-up open and where is 10 rue Pastourelle located?',
    kind: 'question',
  },
  {
    label: 'Commande vocale en français',
    prompt: 'Ouvre le Skin Quiz et conseille-moi une crème barrière pour peau sensible',
    kind: 'command',
  },
];


