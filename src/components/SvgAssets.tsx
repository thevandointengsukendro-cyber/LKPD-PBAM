import React from 'react';
import { ShirtCode, PantsCode } from '../utils/lkpdLogic';

export const SHIRT_COLORS: Record<ShirtCode, { body: string; accent: string; shade: string; name: string }> = {
  M: { body: '#FF5A5F', accent: '#E11D48', shade: '#FDA4AF', name: 'Merah' },
  B: { body: '#38BDF8', accent: '#0284C7', shade: '#BAE6FD', name: 'Biru' },
  K: { body: '#FACC15', accent: '#CA8A04', shade: '#FEF08A', name: 'Kuning' },
};

export const PANTS_COLORS: Record<PantsCode, { body: string; waist: string; pocket: string; shade: string; name: string }> = {
  P: { body: '#FFFFFF', waist: '#E2E8F0', pocket: '#94A3B8', shade: '#F1F5F9', name: 'Putih' },
  H: { body: '#2D3748', waist: '#1E293B', pocket: '#CBD5E1', shade: '#1A202C', name: 'Hitam' },
};

/**
 * Detailed Kawaii / Gacha Life 2 Upper Shirt SVG (80x75 viewBox)
 * Curved hanger hook on top, peter pan rounded collar, cuffed short sleeves,
 * 3 white round buttons on chest, and 1 small pocket on left chest with a star icon.
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
      {showHanger && (
        <g>
          <path
            d="M40 13 C40 8.5, 45.5 7.5, 45.5 4 C45.5 1.5, 41.5 1, 39 2.5 C37 3.5, 37 5.5, 38 7"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M26 19 L40 12 L54 19"
            stroke="#94A3B8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* Shirt Body & Sleeves */}
      <path
        d="M25 18 L9 27 C6.5 29, 6.5 33.5, 9.5 36.5 L17 42 L22 35 L21 65 C21 68.5, 24 70.5, 27.5 70.5 L52.5 70.5 C56 70.5, 59 68.5, 59 65 L58 35 L63 42 L70.5 36.5 C73.5 33.5, 73.5 29, 71 27 L55 18 Z"
        fill={c.body}
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Gacha-style Sleeve Cuffs */}
      <path d="M10.5 34.5 L18.5 40" stroke={c.accent} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M69.5 34.5 L61.5 40" stroke={c.accent} strokeWidth="2.5" strokeLinecap="round" />

      {/* Center Placket */}
      <line x1="40" y1="25" x2="40" y2="69" stroke={c.accent} strokeWidth="2.5" strokeLinecap="round" />

      {/* Peter Pan Rounded Collar */}
      <path
        d="M26.5 18 C26.5 26.5, 35.5 28.5, 40 23 C35.5 19, 31 18, 26.5 18 Z"
        fill={c.accent}
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M53.5 18 C53.5 26.5, 44.5 28.5, 40 23 C44.5 19, 49 18, 53.5 18 Z"
        fill={c.accent}
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3 White Round Chest Buttons */}
      <circle cx="40" cy="34" r="2.8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
      <circle cx="40" cy="45" r="2.8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
      <circle cx="40" cy="56" r="2.8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />

      {/* Left Chest Pocket with Star */}
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
 * Detailed Kawaii / Gacha Life 2 Lower Pants SVG (80x75 viewBox)
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
      <path d="M21 26 C26 26, 29 30, 29 35" stroke={c.pocket} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M59 26 C54 26, 51 30, 51 35" stroke={c.pocket} strokeWidth="2.5" strokeLinecap="round" />

      {/* Center Seam */}
      <line x1="40" y1="24" x2="40" y2="38" stroke={c.pocket} strokeWidth="2.5" strokeLinecap="round" />

      {/* Rounded Bottom Cuffs */}
      <rect x="15" y="60" width="21" height="8" rx="4" fill={c.waist} stroke="#1E293B" strokeWidth="3" />
      <rect x="44" y="60" width="21" height="8" rx="4" fill={c.waist} stroke="#1E293B" strokeWidth="3" />
    </svg>
  );
};

/**
 * Gacha Life 2 Style Chibi Character SVG!
 * Inspired directly by Gacha Life 2 (Luni):
 * - Layered spiky anime hair (#433D60) with dark shadow locks (#2B2640) and signature zig-zag lavender highlight (#7E75A6)
 * - Expressive multi-layered anime eyes with teal/cyan gradient iris, specular highlights, and round stylish glasses
 * - Blinking animation (@keyframes blink) every 3s
 * - Full Gacha chibi body wearing the selected Shirt (M, B, K) with rolled sleeves, Peter Pan collar, 3 buttons, star pocket,
 *   and the selected Pants (P, H) with waistband, pockets, and cuffs, plus Gacha sandals on a 2-tier boutique stage!
 */
export const ChibiCharacterSvg: React.FC<{
  shirt: ShirtCode;
  pants: PantsCode;
  popKey?: number;
  width?: number;
  height?: number;
}> = ({ shirt, pants, popKey = 0, width = 152, height = 220 }) => {
  const sCol = SHIRT_COLORS[shirt];
  const pCol = PANTS_COLORS[pants];

  return (
    <svg
      key={popKey}
      width={width}
      height={height}
      viewBox="0 0 180 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="chibi-character-svg"
    >
      <defs>
        <radialGradient id="gachaAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.28" />
          <stop offset="65%" stopColor="#F472B6" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="eyeIrisGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#172554" />
          <stop offset="55%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>

      {/* Soft Gacha Studio Aura */}
      <circle cx="90" cy="128" r="76" fill="url(#gachaAura)" />

      {/* 2-Tier Boutique Stage Ellipses (#F472B6 & #FBCFE8) */}
      <ellipse
        cx="90"
        cy="232"
        rx="72"
        ry="14"
        fill="#F472B6"
        stroke="#1E293B"
        strokeWidth="3"
      />
      <ellipse
        cx="90"
        cy="226"
        rx="58"
        ry="10"
        fill="#FBCFE8"
        stroke="#1E293B"
        strokeWidth="3"
      />
      {/* Character Drop Shadow on Stage */}
      <ellipse cx="90" cy="225" rx="36" ry="5.5" fill="rgba(30, 41, 59, 0.22)" />

      {/* 4 Sparkling Stars (#FACC15) around Character */}
      <g className="sparkle-stars">
        <path
          d="M20 52 L23.5 60 L31.5 63.5 L23.5 67 L20 75 L16.5 67 L8.5 63.5 L16.5 60 Z"
          fill="#FACC15"
          stroke="#1E293B"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M160 46 L163 53 L170 56 L163 59 L160 66 L157 59 L150 56 L157 53 Z"
          fill="#FACC15"
          stroke="#1E293B"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M18 158 L20.5 164 L26.5 166.5 L20.5 169 L18 175 L15.5 169 L9.5 166.5 L15.5 164 Z"
          fill="#FACC15"
          stroke="#1E293B"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M162 152 L164.5 158 L170.5 160.5 L164.5 163 L162 169 L159.5 163 L153.5 160.5 L159.5 158 Z"
          fill="#FACC15"
          stroke="#1E293B"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </g>

      {/* Main Animated Gacha Life 2 Character Group */}
      <g className="chibi-outfit-animated">
        {/* ================= BACK HAIR LAYER (Spiky Anime Nape Locks) ================= */}
        <path
          d="M36 68 L22 86 L34 90 L26 108 L45 104 L42 118 L60 108 L120 108 L138 118 L135 104 L154 108 L146 90 L158 86 L144 68 Z"
          fill="#2B2640"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ================= GACHA SANDALS / SHOES ================= */}
        <g>
          {/* Left Foot & Sandal */}
          <path
            d="M60 212 C56 214, 55 222, 61 225 L79 225 C83 225, 84 219, 81 212 Z"
            fill="#3B4252"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <ellipse cx="69" cy="219" rx="7" ry="4" fill="#FDE2C8" stroke="#1E293B" strokeWidth="2.2" />
          <path d="M61 218 H78" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
          <path d="M58 224 H81" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />

          {/* Right Foot & Sandal */}
          <path
            d="M99 212 C96 219, 97 225, 101 225 L119 225 C125 222, 124 214, 120 212 Z"
            fill="#3B4252"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <ellipse cx="111" cy="219" rx="7" ry="4" fill="#FDE2C8" stroke="#1E293B" strokeWidth="2.2" />
          <path d="M102 218 H119" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
          <path d="M99 224 H122" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* ================= WORN GACHA PANTS (P or H) ================= */}
        <g>
          {/* Main Trousers Shape fitted to Gacha Legs */}
          <path
            d="M64 156 H116 L122 210 C122 213, 119 215, 115 215 H99 C96 215, 94 213, 93 209 L90 180 L87 209 C86 213, 84 215, 81 215 H65 C61 215, 58 213, 58 210 L64 156 Z"
            fill={pCol.body}
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Waistband */}
          <rect
            x="63"
            y="154"
            width="54"
            height="10"
            rx="4"
            fill={pCol.waist}
            stroke="#1E293B"
            strokeWidth="3"
          />
          {/* Waistband Button */}
          <circle cx="90" cy="159" r="2.8" fill={pCol.pocket} stroke="#1E293B" strokeWidth="2" />
          {/* Curved Side Pockets */}
          <path d="M64 166 C70 166, 74 170, 74 176" stroke={pCol.pocket} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M116 166 C110 166, 106 170, 106 176" stroke={pCol.pocket} strokeWidth="2.5" strokeLinecap="round" />
          {/* Center Fly Seam */}
          <line x1="90" y1="164" x2="90" y2="178" stroke={pCol.pocket} strokeWidth="2.5" strokeLinecap="round" />
          {/* Rounded Bottom Pants Cuffs */}
          <rect x="57" y="207" width="27" height="8" rx="3.5" fill={pCol.waist} stroke="#1E293B" strokeWidth="3" />
          <rect x="96" y="207" width="27" height="8" rx="3.5" fill={pCol.waist} stroke="#1E293B" strokeWidth="3" />
        </g>

        {/* ================= GACHA ARMS & HANDS ================= */}
        <g>
          {/* Left Arm & Hand */}
          <path
            d="M55 122 L44 160 C42 166, 45 171, 50 171 C54 171, 57 167, 57 162 L64 132 Z"
            fill="#FDE2C8"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="51" cy="165" r="2.2" fill="#F4B89A" />

          {/* Right Arm & Hand */}
          <path
            d="M125 122 L136 160 C138 166, 135 171, 130 171 C126 171, 123 167, 123 162 L116 132 Z"
            fill="#FDE2C8"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="129" cy="165" r="2.2" fill="#F4B89A" />
        </g>

        {/* ================= NECK ================= */}
        <rect
          x="82"
          y="98"
          width="16"
          height="16"
          rx="6"
          fill="#FDE2C8"
          stroke="#1E293B"
          strokeWidth="3"
        />
        <path d="M84 103 Q90 107 96 103" stroke="#E5A98C" strokeWidth="2.5" strokeLinecap="round" />

        {/* ================= WORN GACHA SHIRT (M, B, or K) ================= */}
        <g>
          {/* Main Fitted Shirt Torso & Rolled Sleeves */}
          <path
            d="M68 106 L50 116 C47 118, 46 123, 49 127 L59 133 L64 125 L62 156 C62 158.5, 64.5 160, 68 160 H112 C115.5 160, 118 158.5, 118 156 L116 125 L121 133 L131 127 C134 123, 133 118, 130 116 L112 106 Z"
            fill={sCol.body}
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Gacha Rolled Sleeve Cuffs */}
          <path
            d="M49 124 L60 130"
            stroke={sCol.accent}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M131 124 L120 130"
            stroke={sCol.accent}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Center Shirt Placket */}
          <line x1="90" y1="114" x2="90" y2="159" stroke={sCol.accent} strokeWidth="2.5" strokeLinecap="round" />

          {/* Peter Pan Rounded Collar */}
          <path
            d="M73 106 C73 116, 84 118, 90 112 C84 107, 78 106, 73 106 Z"
            fill={sCol.accent}
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M107 106 C107 116, 96 118, 90 112 C96 107, 102 106, 107 106 Z"
            fill={sCol.accent}
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 3 White Round Chest Buttons */}
          <circle cx="90" cy="123" r="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
          <circle cx="90" cy="135" r="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
          <circle cx="90" cy="147" r="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />

          {/* Left Chest Pocket with Little Star */}
          <path
            d="M97 123 H109 V134 C109 137, 106.5 139, 103 139 C99.5 139, 97 137, 97 134 V123 Z"
            fill={sCol.accent}
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon
            points="103,126 104.2,129 107.2,129 104.8,130.8 105.7,133.8 103,132 100.3,133.8 101.2,130.8 98.8,129 101.8,129"
            fill="#FEF08A"
          />
        </g>

        {/* ================= GACHA LIFE 2 ANIME CHIBI HEAD ================= */}
        <g>
          {/* Left & Right Ears */}
          <ellipse cx="42" cy="74" rx="7.5" ry="9.5" fill="#FDE2C8" stroke="#1E293B" strokeWidth="3" />
          <path d="M40 71 C43 72, 43 76, 40 77" stroke="#E09F80" strokeWidth="2.2" strokeLinecap="round" />
          <ellipse cx="138" cy="74" rx="7.5" ry="9.5" fill="#FDE2C8" stroke="#1E293B" strokeWidth="3" />
          <path d="M140 71 C137 72, 137 76, 140 77" stroke="#E09F80" strokeWidth="2.2" strokeLinecap="round" />

          {/* Chibi Head Contour (Wide Gacha Anime Cheek Shape) */}
          <path
            d="M44 62 C44 34, 64 22, 90 22 C116 22, 136 34, 136 62 C136 86, 118 103, 90 103 C62 103, 44 86, 44 62 Z"
            fill="#FDE2C8"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Soft Pink Blushing Cheeks (#FDA4AF) */}
          <ellipse cx="59" cy="81" rx="7.5" ry="4" fill="#FDA4AF" opacity="0.85" />
          <ellipse cx="121" cy="81" rx="7.5" ry="4" fill="#FDA4AF" opacity="0.85" />

          {/* Blinking Gacha Anime Eyes Group */}
          <g className="chibi-eyes" style={{ transformOrigin: '90px 71px' }}>
            {/* Left Eye */}
            <ellipse cx="69" cy="72" rx="11.5" ry="12.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
            <ellipse cx="70" cy="73" rx="8.5" ry="10.5" fill="url(#eyeIrisGrad)" />
            <ellipse cx="70" cy="73" rx="4.2" ry="5.5" fill="#0F172A" />
            <circle cx="65.5" cy="67" r="3.4" fill="#FFFFFF" />
            <circle cx="74" cy="77.5" r="1.8" fill="#FFFFFF" />
            {/* Bold Upper Eyelash */}
            <path
              d="M55 66 C60 58, 75 58, 82 65"
              stroke="#1E1B2E"
              strokeWidth="4.2"
              strokeLinecap="round"
            />

            {/* Right Eye */}
            <ellipse cx="111" cy="72" rx="11.5" ry="12.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
            <ellipse cx="110" cy="73" rx="8.5" ry="10.5" fill="url(#eyeIrisGrad)" />
            <ellipse cx="110" cy="73" rx="4.2" ry="5.5" fill="#0F172A" />
            <circle cx="105.5" cy="67" r="3.4" fill="#FFFFFF" />
            <circle cx="114" cy="77.5" r="1.8" fill="#FFFFFF" />
            {/* Bold Upper Eyelash */}
            <path
              d="M98 65 C105 58, 120 58, 125 66"
              stroke="#1E1B2E"
              strokeWidth="4.2"
              strokeLinecap="round"
            />
          </g>

          {/* Gacha Life 2 Stylish Round Glasses */}
          <g>
            <circle cx="69" cy="73" r="15" fill="rgba(255,255,255,0.08)" stroke="#231F20" strokeWidth="2.6" />
            <circle cx="111" cy="73" r="15" fill="rgba(255,255,255,0.08)" stroke="#231F20" strokeWidth="2.6" />
            <path d="M84 72 Q90 69 96 72" stroke="#231F20" strokeWidth="2.6" strokeLinecap="round" />
            <line x1="45" y1="70" x2="54" y2="72" stroke="#231F20" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="126" y1="72" x2="135" y2="70" stroke="#231F20" strokeWidth="2.4" strokeLinecap="round" />
          </g>

          {/* Tiny Anime Nose & Cheerful Open Smile */}
          <path d="M89 79 L91 81" stroke="#D99B7E" strokeWidth="2.2" strokeLinecap="round" />
          <path
            d="M83 87 Q90 85 97 87 C97 93, 83 93, 83 87 Z"
            fill="#E57373"
            stroke="#1E293B"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path d="M85.5 90 Q90 93 94.5 90" fill="#F8B4B4" />

          {/* ================= FRONT LAYERED GACHA LIFE 2 HAIR ================= */}
          {/* Main Spiky Fluffy Hair Canopy */}
          <path
            d="M40 76 C33 62, 34 42, 46 30 L38 24 L56 22 C66 14, 82 11, 98 13 L112 6 L108 16 C122 18, 134 24, 142 32 L134 36 C144 44, 147 60, 140 76 L133 58 L128 74 L120 54 C115 66, 106 72, 98 60 C94 69, 85 71, 80 58 C73 69, 63 70, 58 56 L51 74 L46 58 Z"
            fill="#433D60"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Side Locks Framing the Face */}
          <path
            d="M41 58 C37 72, 40 88, 49 96 C47 84, 48 72, 52 62 Z"
            fill="#35304D"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M139 58 C143 72, 140 88, 131 96 C133 84, 132 72, 128 62 Z"
            fill="#35304D"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Signature Gacha Life 2 Zig-Zag Hair Highlight Streak */}
          <path
            d="M49 44 L58 39 L64 47 L76 41 L84 48 L98 41 L106 48 L118 40 L127 46"
            stroke="#8B80B6"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.88"
          />

          {/* Expressive Anime Eyebrows */}
          <path d="M58 54 Q69 49 79 55" stroke="#1E1B2E" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M101 55 Q111 49 122 54" stroke="#1E1B2E" strokeWidth="3.2" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
};
