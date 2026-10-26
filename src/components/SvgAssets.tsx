import React from 'react';
import { ShirtCode, PantsCode } from '../utils/lkpdLogic';

export const SHIRT_COLORS: Record<ShirtCode, { body: string; accent: string; name: string }> = {
  M: { body: '#FF5A5F', accent: '#E11D48', name: 'Merah' },
  B: { body: '#38BDF8', accent: '#0284C7', name: 'Biru' },
  K: { body: '#FACC15', accent: '#CA8A04', name: 'Kuning' },
};

export const PANTS_COLORS: Record<PantsCode, { body: string; waist: string; pocket: string; name: string }> = {
  P: { body: '#FFFFFF', waist: '#E2E8F0', pocket: '#94A3B8', name: 'Putih' },
  H: { body: '#2D3748', waist: '#1E293B', pocket: '#CBD5E1', name: 'Hitam' },
};

/**
 * Detailed Kawaii Shirt SVG (80x75 viewBox)
 * Features curved hanger hook on top, peter pan rounded collar, rounded short sleeves,
 * 3 white round buttons on chest, and 1 small pocket on left chest with a tiny star icon.
 */
export const ShirtSvg: React.FC<{
  code: ShirtCode;
  width?: number;
  height?: number;
  showHanger?: boolean;
  className?: string;
}> = ({ code, width = 80, height = 75, showHanger = true, className = '' }) => {
  const c = SHIRT_COLORS[code];
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Curved Hanger Hook */}
      {showHanger && (
        <g>
          <path
            d="M40 14 C40 9, 46 8, 46 4 C46 1.5, 42 1, 39 2.5 C37 3.5, 37 6, 38 7.5"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M27 20 L40 13 L53 20"
            stroke="#94A3B8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* Main Shirt Body + Rounded Short Sleeves */}
      <path
        d="M25 18 L10 27 C7 29, 7 34, 10 37 L18 42 L22 35 L22 66 C22 69, 25 71, 28 71 L52 71 C55 71, 58 69, 58 66 L58 35 L62 42 L70 37 C73 34, 73 29, 70 27 L55 18 Z"
        fill={c.body}
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Placket Line */}
      <line
        x1="40"
        y1="26"
        x2="40"
        y2="70"
        stroke={c.accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Peter Pan Rounded Collar */}
      <path
        d="M27 18 C27 26, 36 28, 40 23 C35 19, 31 18, 27 18 Z"
        fill={c.accent}
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M53 18 C53 26, 44 28, 40 23 C45 19, 49 18, 53 18 Z"
        fill={c.accent}
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3 White Round Buttons on Chest */}
      <circle cx="40" cy="34" r="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
      <circle cx="40" cy="45" r="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
      <circle cx="40" cy="56" r="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />

      {/* Small Chest Pocket with Little Star */}
      <path
        d="M46 34 H55 V43 C55 45.5, 53 47, 50.5 47 C48 47, 46 45.5, 46 43 V34 Z"
        fill={c.accent}
        stroke="#1E293B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points="50.5,36.5 51.5,39 54,39 52,40.5 52.8,43 50.5,41.5 48.2,43 49,40.5 47,39 49.5,39"
        fill="#FEF08A"
      />
    </svg>
  );
};

/**
 * Detailed Kawaii Pants SVG (80x75 viewBox)
 * Features waistband with center button, curved left-right pocket lines, and rounded bottom cuffs.
 */
export const PantsSvg: React.FC<{
  code: PantsCode;
  width?: number;
  height?: number;
  showHanger?: boolean;
  className?: string;
}> = ({ code, width = 80, height = 75, showHanger = false, className = '' }) => {
  const c = PANTS_COLORS[code];
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {showHanger && (
        <path
          d="M40 12 C40 8, 45 7, 45 3.5 C45 1.5, 41 1, 39 2.5"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}

      {/* Main Pants Body */}
      <path
        d="M20 16 H60 L64 62 C64 65, 62 67, 59 67 H46 C44 67, 43 65, 42 62 L40 40 L38 62 C37 65, 36 67, 34 67 H21 C18 67, 16 65, 16 62 L20 16 Z"
        fill={c.body}
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Waistband */}
      <rect
        x="20"
        y="14"
        width="40"
        height="10"
        rx="4"
        fill={c.waist}
        stroke="#1E293B"
        strokeWidth="3"
      />

      {/* Center Waist Button */}
      <circle cx="40" cy="19" r="2.8" fill={c.pocket} stroke="#1E293B" strokeWidth="2" />

      {/* Curved Pocket Lines Left & Right */}
      <path
        d="M21 26 C26 26, 29 30, 29 35"
        stroke={c.pocket}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M59 26 C54 26, 51 30, 51 35"
        stroke={c.pocket}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Center Seam Line */}
      <line
        x1="40"
        y1="24"
        x2="40"
        y2="38"
        stroke={c.pocket}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Rounded Bottom Cuffs */}
      <rect
        x="15"
        y="60"
        width="21"
        height="8"
        rx="4"
        fill={c.waist}
        stroke="#1E293B"
        strokeWidth="3"
      />
      <rect
        x="44"
        y="60"
        width="21"
        height="8"
        rx="4"
        fill={c.waist}
        stroke="#1E293B"
        strokeWidth="3"
      />
    </svg>
  );
};

/**
 * Chibi Character standing on a 2-tier pink boutique stage, wearing the selected
 * SVG Shirt and SVG Pants directly on its body & legs, with blinking eyes and 4 sparkling stars!
 */
export const ChibiCharacterSvg: React.FC<{
  shirt: ShirtCode;
  pants: PantsCode;
  popKey?: number;
  width?: number;
  height?: number;
}> = ({ shirt, pants, popKey = 0, width = 155, height = 225 }) => {
  return (
    <svg
      key={popKey}
      width={width}
      height={height}
      viewBox="0 0 160 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="chibi-character-svg"
    >
      {/* 2-Tier Boutique Stage Ellipses */}
      <ellipse
        cx="80"
        cy="210"
        rx="66"
        ry="15"
        fill="#F472B6"
        stroke="#1E293B"
        strokeWidth="3"
      />
      <ellipse
        cx="80"
        cy="204"
        rx="54"
        ry="11"
        fill="#FBCFE8"
        stroke="#1E293B"
        strokeWidth="3"
      />

      {/* 4 Sparkling Stars (#FACC15) around Character */}
      <g className="sparkle-stars">
        <path
          d="M22 46 L25 53 L32 56 L25 59 L22 66 L19 59 L12 56 L19 53 Z"
          fill="#FACC15"
          stroke="#1E293B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M138 42 L141 49 L148 52 L141 55 L138 62 L135 55 L128 52 L135 49 Z"
          fill="#FACC15"
          stroke="#1E293B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M18 142 L20.5 147.5 L26 150 L20.5 152.5 L18 158 L15.5 152.5 L10 150 L15.5 147.5 Z"
          fill="#FACC15"
          stroke="#1E293B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M142 138 L144.5 143.5 L150 146 L144.5 148.5 L142 154 L139.5 148.5 L134 146 L139.5 143.5 Z"
          fill="#FACC15"
          stroke="#1E293B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>

      {/* Animated Chibi Body + Outfit Group */}
      <g className="chibi-outfit-animated">
        {/* Back Hair */}
        <path
          d="M44 48 C36 65, 38 86, 48 92 L112 92 C122 86, 124 65, 116 48 Z"
          fill="#475569"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Cute Shoes & Feet */}
        <ellipse cx="65" cy="197" rx="11" ry="6.5" fill="#EC4899" stroke="#1E293B" strokeWidth="3" />
        <ellipse cx="95" cy="197" rx="11" ry="6.5" fill="#EC4899" stroke="#1E293B" strokeWidth="3" />

        {/* Cute Chibi Hands */}
        <circle cx="42" cy="126" r="7" fill="#FDE68A" stroke="#1E293B" strokeWidth="3" />
        <circle cx="118" cy="126" r="7" fill="#FDE68A" stroke="#1E293B" strokeWidth="3" />

        {/* Worn SVG Pants on Chibi Legs */}
        <g transform="translate(40, 132)">
          <PantsSvg code={pants} width={80} height={68} showHanger={false} />
        </g>

        {/* Neck */}
        <rect
          x="73"
          y="84"
          width="14"
          height="14"
          rx="5"
          fill="#FDE68A"
          stroke="#1E293B"
          strokeWidth="3"
        />

        {/* Worn SVG Shirt on Chibi Torso */}
        <g transform="translate(36, 78)">
          <ShirtSvg code={shirt} width={88} height={74} showHanger={false} />
        </g>

        {/* Cute Round Head (#FDE68A) */}
        <circle
          cx="80"
          cy="56"
          r="33"
          fill="#FDE68A"
          stroke="#1E293B"
          strokeWidth="3"
        />

        {/* Cartoon Fringe Hair (#475569) */}
        <path
          d="M46 54 C45 30, 62 18, 80 18 C98 18, 115 30, 114 54 C108 42, 101 48, 96 38 C90 49, 82 47, 78 36 C72 48, 63 48, 58 39 C53 47, 49 50, 46 54 Z"
          fill="#475569"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Cute Hair Ribbon / Bow */}
        <path
          d="M102 24 C108 18, 116 22, 112 29 C116 34, 108 38, 102 31 Z"
          fill="#F472B6"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Blinking Eyes (#1E293B) with White Shine Dots */}
        <g className="chibi-eyes">
          <circle cx="66" cy="59" r="5.2" fill="#1E293B" />
          <circle cx="64.2" cy="57" r="2" fill="#FFFFFF" />
          <circle cx="94" cy="59" r="5.2" fill="#1E293B" />
          <circle cx="92.2" cy="57" r="2" fill="#FFFFFF" />
        </g>

        {/* Pink Blushing Cheeks (#FDA4AF) */}
        <ellipse cx="56" cy="66" rx="5.5" ry="3.2" fill="#FDA4AF" />
        <ellipse cx="104" cy="66" rx="5.5" ry="3.2" fill="#FDA4AF" />

        {/* Cheerful Smiling Mouth */}
        <path
          d="M73 67 Q80 74 87 67"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
};
