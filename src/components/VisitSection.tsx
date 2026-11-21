import React, { useState } from 'react';
import { Check, Copy, ExternalLink, MapPin, Navigation } from 'lucide-react';

interface VisitSectionProps {
  onOpenBook: () => void;
}

interface MetroStationSpot {
  id: string;
  name: string;
  lines: string;
  walkTime: string;
  cx: number;
  cy: number;
  mapsOrigin: string;
}

const GOOGLE_MAPS_PLACE_URL =
  'https://www.google.com/maps/search/?api=1&query=10+rue+Pastourelle,+75003+Paris';
const GOOGLE_MAPS_DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=10+rue+Pastourelle,+75003+Paris';

const METRO_STATIONS: MetroStationSpot[] = [
  {
    id: 'arts-et-metiers',
    name: 'Arts et Métiers',
    lines: 'Lines 3 & 11',
    walkTime: '4 min walk (300 m)',
    cx: 82,
    cy: 118,
    mapsOrigin: 'Metro Arts et Metiers, Paris',
  },
  {
    id: 'temple',
    name: 'Temple',
    lines: 'Line 3',
    walkTime: '4 min walk (320 m)',
    cx: 170,
    cy: 56,
    mapsOrigin: 'Metro Temple, Paris',
  },
  {
    id: 'filles-du-calvaire',
    name: 'Filles du Calvaire',
    lines: 'Line 8',
    walkTime: '5 min walk (420 m)',
    cx: 342,
    cy: 112,
    mapsOrigin: 'Metro Filles du Calvaire, Paris',
  },
];

export const VisitSection: React.FC<VisitSectionProps> = ({ onOpenBook }) => {
  const [signupEmail, setSignupEmail] = useState('');
  const [signupFeedback, setSignupFeedback] = useState<string | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<string>('arts-et-metiers');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const selectedStation =
    METRO_STATIONS.find((m) => m.id === selectedStationId) ?? METRO_STATIONS[0];

  const walkingDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    selectedStation.mapsOrigin
  )}&destination=${encodeURIComponent('10 rue Pastourelle, 75003 Paris')}&travelmode=walking`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText('10 rue Pastourelle, 75003 Paris');
      setCopiedAddress(true);
      window.setTimeout(() => setCopiedAddress(false), 2000);
    } catch {
      setCopiedAddress(false);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = signupEmail.trim();
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      setSignupFeedback('Please enter a valid email address.');
      return;
    }
    setSignupFeedback(
      `You are on the list. We will write to ${trimmed} with 2-week March–April pop-up drops and VIP priority slots.`
    );
    setSignupEmail('');
  };

  return (
    <>
      {/* Visit Us · 10 rue Pastourelle */}
      <section id="visit" className="scroll-mt-20 bg-[#F7F9FB] py-16 md:py-24">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 md:grid-cols-2 md:gap-14 md:px-7">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#233F7A]">
              Visit us <span className="font-kr ml-1.5 font-semibold tracking-normal">오시는 길</span>
            </div>
            <p className="font-display mt-3 text-[clamp(2rem,4vw,3rem)] leading-[1.08] text-[#14203F]">
              10 rue Pastourelle
              <br />
              75003 Paris
            </p>

            <dl className="mt-6 grid grid-cols-[90px_1fr] gap-x-4 gap-y-3 border-y border-[#14203F]/12 py-5 text-[14.5px]">
              <dt className="pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#56637E]">
                Dates
              </dt>
              <dd className="font-semibold text-[#14203F] tabular-nums">
                2 Weeks Only · March 23 – April 5, 2026
              </dd>

              <dt className="pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#56637E]">
                Hours
              </dt>
              <dd className="text-[#14203F] tabular-nums">Tuesday – Sunday · 11:00 – 20:00</dd>

              <dt className="pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#56637E]">
                Metro
              </dt>
              <dd className="text-[#56637E]">Arts et Métiers · Filles du Calvaire · Temple</dd>

              <dt className="pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#56637E]">
                Pop-Up Offer
              </dt>
              <dd className="font-semibold text-[#233F7A]">
                15%–25% launch discount on all products + free diagnosis &amp; Salt Bread perks
              </dd>
            </dl>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href={GOOGLE_MAPS_PLACE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#233F7A] px-6 py-3 text-[14px] font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[#14203F]"
              >
                <MapPin className="h-4 w-4" />
                <span>Open in Maps</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </a>
              <a
                href={GOOGLE_MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#14203F]/20 bg-white px-5 py-3 text-[14px] font-semibold text-[#14203F] transition-colors hover:border-[#233F7A]"
              >
                <Navigation className="h-4 w-4 text-[#233F7A]" />
                <span>Get Directions</span>
              </a>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#14203F]/20 bg-white px-4 py-3 text-[13.5px] font-semibold text-[#14203F] transition-colors hover:border-[#233F7A]"
              >
                {copiedAddress ? (
                  <>
                    <Check className="h-4 w-4 text-[#233F7A]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-[#56637E]" />
                    <span>Copy address</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onOpenBook}
                className="inline-flex items-center justify-center rounded-full border border-[#14203F]/20 bg-white px-5 py-3 text-[14px] font-semibold text-[#14203F] hover:border-[#233F7A]"
              >
                Book my diagnosis
              </button>
            </div>
          </div>

          {/* Interactive Google Maps Location Snippet */}
          <div
            className="overflow-hidden rounded-lg border border-[#14203F]/16 bg-white shadow-[0_14px_34px_rgba(20,32,63,0.08)]"
            aria-label="Interactive Le Marais location snippet linking to Google Maps"
          >
            {/* Interactive Street & Walking Route Preview */}
            <div className="relative bg-[#E7EDF4]">
              <svg viewBox="0 0 400 280" fill="none" className="block h-auto w-full">
                <rect width="400" height="280" fill="#E7EDF4" />
                <g stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round">
                  <path d="M-10 70L410 120" />
                  <path d="M60 -10L120 290" />
                  <path d="M250 -10L210 290" />
                  <path d="M-10 218L410 192" />
                  <path d="M330 -10L360 290" />
                </g>
                <g stroke="#D3DCE7" strokeWidth="6" strokeLinecap="round">
                  <path d="M120 148L250 158" />
                  <path d="M160 40L175 280" />
                  <path d="M290 80L300 248" />
                </g>
                <path
                  d="M-10 258Q200 240 410 272"
                  stroke="#B7C4D3"
                  strokeWidth="16"
                  opacity="0.6"
                />

                {/* Dashed walking route from selected Metro to 10 rue Pastourelle */}
                <line
                  x1={selectedStation.cx}
                  y1={selectedStation.cy}
                  x2={205}
                  y2={152}
                  stroke="#233F7A"
                  strokeWidth="2.5"
                  strokeDasharray="5 4"
                />

                <g
                  fontFamily="Manrope,sans-serif"
                  fontSize="9.5"
                  fontWeight="600"
                  fill="#56637E"
                  letterSpacing="1"
                >
                  <text x="16" y="60">
                    RUE DE BRETAGNE
                  </text>
                  <text x="268" y="186" transform="rotate(-3 268 186)">
                    RUE DES ARCHIVES
                  </text>
                  <text x="134" y="140">
                    RUE PASTOURELLE
                  </text>
                  <text x="18" y="274">
                    LA SEINE
                  </text>
                </g>

                {/* Interactive Metro Pins */}
                {METRO_STATIONS.map((metro) => {
                  const active = metro.id === selectedStation.id;
                  return (
                    <g
                      key={metro.id}
                      onClick={() => setSelectedStationId(metro.id)}
                      className="cursor-pointer"
                      role="button"
                      tabIndex={0}
                      aria-label={`Preview walking route from Metro ${metro.name}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedStationId(metro.id);
                        }
                      }}
                    >
                      <circle
                        cx={metro.cx}
                        cy={metro.cy}
                        r={active ? 14 : 11}
                        fill={active ? '#233F7A' : '#FFFFFF'}
                        stroke="#233F7A"
                        strokeWidth="2"
                      />
                      <text
                        x={metro.cx}
                        y={metro.cy + 3.5}
                        textAnchor="middle"
                        fontFamily="Manrope,sans-serif"
                        fontSize="9.5"
                        fontWeight="800"
                        fill={active ? '#FFFFFF' : '#233F7A'}
                      >
                        M
                      </text>
                    </g>
                  );
                })}

                {/* Clickable Main Destination Pin -> Opens Google Maps */}
                <a
                  href={GOOGLE_MAPS_PLACE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open 10 rue Pastourelle, 75003 Paris on Google Maps"
                >
                  <circle cx="205" cy="152" r="28" fill="#233F7A" opacity="0.16" />
                  <circle cx="205" cy="152" r="10" fill="#233F7A" />
                  <circle cx="205" cy="152" r="4" fill="#FFFFFF" />
                  <g transform="translate(222 108)">
                    <rect width="144" height="32" rx="16" fill="#14203F" />
                    <text
                      x="14"
                      y="20"
                      fontFamily="Manrope,sans-serif"
                      fontSize="11"
                      fontWeight="700"
                      fill="#FFFFFF"
                    >
                      10 rue Pastourelle ↗
                    </text>
                  </g>
                </a>
              </svg>

              {/* Floating Walking Time Selector inside Map Snippet */}
              <div className="flex flex-wrap items-center gap-1.5 border-t border-[#14203F]/10 bg-white/90 px-4 py-2.5 backdrop-blur-xs">
                <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#56637E]">
                  Metro route:
                </span>
                {METRO_STATIONS.map((metro) => {
                  const active = metro.id === selectedStation.id;
                  return (
                    <button
                      key={metro.id}
                      type="button"
                      onClick={() => setSelectedStationId(metro.id)}
                      className={`rounded-md px-2.5 py-1 text-[12px] font-semibold transition-colors ${
                        active
                          ? 'bg-[#14203F] text-white'
                          : 'bg-[#F7F9FB] text-[#14203F]/80 hover:bg-[#E7EDF4]'
                      }`}
                    >
                      {metro.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Google Maps Redirect Card Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#14203F]/12 bg-white px-5 py-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#233F7A]">
                  {selectedStation.name} ({selectedStation.lines}) · {selectedStation.walkTime}
                </div>
                <div className="mt-0.5 text-[13.5px] font-semibold text-[#14203F]">
                  K-Lounge Paris · 10 rue Pastourelle, 75003 Paris
                </div>
              </div>

              <a
                href={walkingDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#233F7A] px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#14203F]"
              >
                <span>Open route in Maps</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Opening News VIP Signup */}
      <section id="signup" className="scroll-mt-20 bg-[#233F7A] py-16 text-white md:py-20">
        <div className="mx-auto grid max-w-[1280px] items-center gap-8 px-5 md:grid-cols-2 md:px-7">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C9D7EE]">
              Opening news <span className="font-kr ml-1.5 font-semibold tracking-normal">소식</span>
            </div>
            <h2 className="font-display mt-3 text-[clamp(2rem,3.8vw,3.1rem)] leading-[1.06] text-white">
              Don’t miss our 2-week Paris pop-up, <em className="italic">sign up.</em>
            </h2>
            <p className="mt-2.5 max-w-[44ch] text-[15px] text-[#DCE6F7]">
              Receive exact March–April workshop slots, Peggy Gou opening night alerts, and
              priority Skin + Hair Diagnosis bookings in Le Marais.
            </p>
          </div>

          <div>
            <form
              onSubmit={handleSignupSubmit}
              noValidate
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
                autoComplete="email"
                className="flex-1 rounded-full border border-white/25 bg-white px-5 py-3.5 text-[14.5px] text-[#14203F] placeholder:text-[#56637E] focus:outline-2 focus:outline-white"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-white px-7 py-3.5 text-[14px] font-semibold text-[#14203F] transition-colors hover:bg-[#E7EDF4]"
              >
                Sign up
              </button>
            </form>
            {signupFeedback && (
              <p className="mt-3 text-[13.5px] font-medium text-[#CFE0FF]" role="status">
                {signupFeedback}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
