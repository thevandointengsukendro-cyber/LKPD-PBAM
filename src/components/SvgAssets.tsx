import React from 'react';
import { TopCode, BottomCode, OutfitKey, ALL_OUTFITS } from '../utils/lkpdLogic';

/**
 * Songket Tumpal Decorative Border (Pucuk Rebung Palembang)
 */
export const TumpalBorderSvg: React.FC<{ width?: number; height?: number; className?: string }> = ({
  width = 642,
  height = 18,
  className = '',
}) => {
  const triangles = Array.from({ length: 32 }, (_, i) => i * 20);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 640 18"
      preserveAspectRatio="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="640" height="18" fill="#7F1D1D" />
      <line x1="0" y1="2" x2="640" y2="2" stroke="#F59E0B" strokeWidth="1.5" />
      <line x1="0" y1="16" x2="640" y2="16" stroke="#F59E0B" strokeWidth="1.5" />
      {triangles.map((x) => (
        <g key={x}>
          <polygon points={`${x + 2},15 ${x + 10},4 ${x + 18},15`} fill="#FBBF24" />
          <circle cx={x + 10} cy="11.5" r="1.6" fill="#7F1D1D" />
        </g>
      ))}
    </svg>
  );
};

/**
 * Ilustrasi Kartu Atasan (Untuk Lemari Butik di Halaman 3)
 * Menampilkan visual baju atasan + hiasan kepala secara jelas & autentik.
 */
export const TopCardIllustrationSvg: React.FC<{
  code: TopCode;
  width?: number;
  height?: number;
}> = ({ code, width = 62, height = 62 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Latar bingkai bulat krem-emas */}
      <rect x="4" y="4" width="82" height="82" rx="14" fill="#FFFDF7" stroke="#B45309" strokeWidth="2.5" />

      {code === 'AG' && (
        <g>
          {/* Mahkota Karsuhun Kipas Emas + Sanggul Malang Mini di Atas */}
          <ellipse cx="45" cy="24" rx="18" ry="7" fill="#1C1917" stroke="#451A03" strokeWidth="1.5" />
          <path
            d="M27 23 C29 10, 61 10, 63 23 Z"
            fill="#FBBF24"
            stroke="#78350F"
            strokeWidth="2"
          />
          <polygon points="45,7 41,21 49,21" fill="#FDE047" stroke="#78350F" strokeWidth="1.4" />
          <circle cx="45" cy="15" r="2.8" fill="#991B1B" />
          {/* Tusuk Cempako Kiri & Kanan */}
          <line x1="20" y1="15" x2="29" y2="22" stroke="#D97706" strokeWidth="2" />
          <circle cx="19" cy="14" r="3" fill="#FDE047" stroke="#78350F" strokeWidth="1.2" />
          <line x1="70" y1="15" x2="61" y2="22" stroke="#D97706" strokeWidth="2" />
          <circle cx="71" cy="14" r="3" fill="#FDE047" stroke="#78350F" strokeWidth="1.2" />
          {/* Untaian Melati */}
          <circle cx="60" cy="27" r="2" fill="#FFFBEB" stroke="#78350F" strokeWidth="1" />
          <circle cx="61" cy="32" r="2" fill="#FFFBEB" stroke="#78350F" strokeWidth="1" />
          <circle cx="61" cy="37" r="2" fill="#FFFBEB" stroke="#78350F" strokeWidth="1" />

          {/* Baju Aesan Gede Maroon + Teratai Dada Bertingkat + Slempang Sawit */}
          <path
            d="M20 44 L31 37 H59 L70 44 L65 78 H25 L20 44 Z"
            fill="#881337"
            stroke="#451A03"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Teratai Dada Bundar Bersusun Emas */}
          <ellipse cx="45" cy="46" rx="18" ry="9" fill="#F59E0B" stroke="#451A03" strokeWidth="1.8" />
          <ellipse cx="45" cy="44" rx="13" ry="6" fill="#FDE047" stroke="#78350F" strokeWidth="1.4" />
          <circle cx="45" cy="44" r="3" fill="#991B1B" />
          {/* Slempang Sawit Menyilang Emas */}
          <path d="M31 39 L58 76" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" />
          <path d="M59 39 L32 76" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" />
          {/* Kelat Bahu di Lengan */}
          <rect x="20" y="50" width="7" height="4" rx="1.5" fill="#FDE047" stroke="#78350F" strokeWidth="1.2" />
          <rect x="63" y="50" width="7" height="4" rx="1.5" fill="#FDE047" stroke="#78350F" strokeWidth="1.2" />
        </g>
      )}

      {code === 'AP' && (
        <g>
          {/* Mahkota Paksangko Lengkung Emas dengan Burung Hong + Kembang Goyang */}
          <ellipse cx="45" cy="23" rx="14" ry="6" fill="#1C1917" stroke="#451A03" strokeWidth="1.5" />
          <path
            d="M28 24 Q45 9 62 24 Z"
            fill="#F59E0B"
            stroke="#78350F"
            strokeWidth="2"
          />
          {/* Ornamen Burung Hong di Tengah */}
          <path d="M40 18 L45 11 L50 18 L45 21 Z" fill="#FDE047" stroke="#78350F" strokeWidth="1.2" />
          {/* Kembang Goyang Miring */}
          <line x1="25" y1="12" x2="32" y2="20" stroke="#B45309" strokeWidth="1.8" />
          <circle cx="24" cy="11" r="2.8" fill="#FDE047" stroke="#78350F" strokeWidth="1" />
          <line x1="65" y1="12" x2="58" y2="20" stroke="#B45309" strokeWidth="1.8" />
          <circle cx="66" cy="11" r="2.8" fill="#FDE047" stroke="#78350F" strokeWidth="1" />

          {/* Baju Kurung Tanggung Merah Bata Bertabur Bintang Emas */}
          <path
            d="M17 44 L29 36 H61 L73 44 L68 62 L61 60 V79 H29 V60 L22 62 L17 44 Z"
            fill="#B91C1C"
            stroke="#451A03"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Teratai Paksangko Segi Enam Berlekuk Emas-Krem */}
          <polygon
            points="45,35 59,41 54,51 36,51 31,41"
            fill="#FDE68A"
            stroke="#78350F"
            strokeWidth="1.8"
          />
          <polygon
            points="45,38 54,42 50,48 40,48 36,42"
            fill="#F59E0B"
            stroke="#78350F"
            strokeWidth="1.2"
          />
          {/* Taburan Bintang Emas di Baju Kurung */}
          <circle cx="36" cy="58" r="2" fill="#FDE047" />
          <circle cx="45" cy="61" r="2" fill="#FDE047" />
          <circle cx="54" cy="58" r="2" fill="#FDE047" />
          <circle cx="39" cy="69" r="2" fill="#FDE047" />
          <circle cx="51" cy="69" r="2" fill="#FDE047" />
          {/* Lis Emas Bawah Baju Kurung */}
          <rect x="29" y="74" width="32" height="4" fill="#FBBF24" stroke="#78350F" strokeWidth="1" />
        </g>
      )}

      {code === 'BH' && (
        <g>
          {/* Sanggul Palembang Rapi + Tusuk Emas Sederhana (Tanpa Mahkota Besar) */}
          <ellipse cx="45" cy="21" rx="13" ry="8" fill="#1C1917" stroke="#451A03" strokeWidth="1.8" />
          <circle cx="33" cy="18" r="3" fill="#FBBF24" stroke="#78350F" strokeWidth="1.2" />
          <circle cx="57" cy="18" r="3" fill="#FBBF24" stroke="#78350F" strokeWidth="1.2" />
          <path d="M38 19 Q45 15 52 19" stroke="#FDE047" strokeWidth="2" fill="none" />

          {/* Baju Kurung Beludru Hitam Longgar + Sulaman Benang Emas */}
          <path
            d="M17 43 L29 35 H61 L73 43 L68 64 L61 62 V80 H29 V62 L22 64 L17 43 Z"
            fill="#1C1917"
            stroke="#451A03"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Kerah Tegak & Sulaman Leher V Benang Emas */}
          <rect x="37" y="32" width="16" height="5" rx="2" fill="#1C1917" stroke="#FBBF24" strokeWidth="1.8" />
          <path d="M34 36 L45 49 L56 36" stroke="#FBBF24" strokeWidth="2.8" fill="none" strokeLinejoin="round" />
          <path d="M38 36 L45 44 L52 36" stroke="#FDE047" strokeWidth="1.6" fill="none" />
          {/* Motif Bunga Emas Kecil di Beludru Hitam */}
          <circle cx="36" cy="55" r="2.2" fill="#FBBF24" />
          <circle cx="54" cy="55" r="2.2" fill="#FBBF24" />
          <circle cx="45" cy="62" r="2.4" fill="#FDE047" />
          <circle cx="36" cy="68" r="2.2" fill="#FBBF24" />
          <circle cx="54" cy="68" r="2.2" fill="#FBBF24" />
          {/* Lis Sulaman Emas di Ujung Lengan & Bawah Baju */}
          <line x1="18" y1="60" x2="23" y2="61" stroke="#FBBF24" strokeWidth="3" />
          <line x1="72" y1="60" x2="67" y2="61" stroke="#FBBF24" strokeWidth="3" />
          <rect x="29" y="75" width="32" height="4.5" fill="#FBBF24" stroke="#78350F" strokeWidth="1" />
        </g>
      )}
    </svg>
  );
};

/**
 * Ilustrasi Kartu Bawahan (Untuk Lemari Butik di Halaman 3)
 * Membedakan Songket Palembang vs Tenun Jumputan Palembang secara tegas.
 */
export const BottomCardIllustrationSvg: React.FC<{
  code: BottomCode;
  width?: number;
  height?: number;
}> = ({ code, width = 62, height = 62 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="4" width="82" height="82" rx="14" fill="#FFFDF7" stroke="#B45309" strokeWidth="2.5" />

      {code === 'S' ? (
        <g>
          {/* Kain Songket Palembang: Maroon Tua + Tenun Benang Emas Tumpal & Belah Ketupat */}
          <rect x="24" y="14" width="42" height="62" rx="4" fill="#7F1D1D" stroke="#451A03" strokeWidth="2.4" />
          {/* Sabuk Pending Emas di Pinggang */}
          <rect x="24" y="14" width="42" height="8" fill="#F59E0B" stroke="#451A03" strokeWidth="1.8" />
          <ellipse cx="45" cy="18" rx="6" ry="3.5" fill="#FDE047" stroke="#78350F" strokeWidth="1.2" />
          {/* Kisi Belah Ketupat Emas (Motif Lepus / Bungo Intan) */}
          <line x1="25" y1="30" x2="65" y2="54" stroke="#FBBF24" strokeWidth="1.4" />
          <line x1="25" y1="44" x2="65" y2="68" stroke="#FBBF24" strokeWidth="1.4" />
          <line x1="65" y1="30" x2="25" y2="54" stroke="#FBBF24" strokeWidth="1.4" />
          <line x1="65" y1="44" x2="25" y2="68" stroke="#FBBF24" strokeWidth="1.4" />
          {/* Panel Tumpal Pucuk Rebung di Tengah & Bawah */}
          <polygon points="31,74 38,61 45,74" fill="#FBBF24" />
          <polygon points="45,74 52,61 59,74" fill="#FBBF24" />
          <circle cx="45" cy="36" r="2.5" fill="#FDE047" />
          <circle cx="35" cy="48" r="2.2" fill="#FDE047" />
          <circle cx="55" cy="48" r="2.2" fill="#FDE047" />
        </g>
      ) : (
        <g>
          {/* Kain Tenun Jumputan Palembang: Krem-Kuning Emas & Merah Bata Motif Titik Ikat-Celup */}
          <rect x="24" y="14" width="42" height="62" rx="4" fill="#FDE68A" stroke="#451A03" strokeWidth="2.4" />
          {/* Panel Vertikal Merah Bata Khas Jumputan */}
          <rect x="38" y="21" width="14" height="55" fill="#B91C1C" />
          {/* Ban Pinggang Cokelat-Emas */}
          <rect x="24" y="14" width="42" height="7" fill="#9A3412" stroke="#451A03" strokeWidth="1.8" />
          {/* Motif Titik-Titik Ikat Celup (Pelangi / Titik Tujuh) */}
          {[29, 43, 57].map((cy) => (
            <g key={cy}>
              {/* Gugus Titik di Panel Krem Kiri */}
              <circle cx="31" cy={cy} r="2.4" fill="#9A3412" />
              <circle cx="28" cy={cy + 4} r="1.6" fill="#B91C1C" />
              <circle cx="34" cy={cy + 4} r="1.6" fill="#B91C1C" />
              {/* Gugus Titik Belah Ketupat di Panel Tengah Merah Bata */}
              <circle cx="45" cy={cy - 2} r="1.8" fill="#FEF3C7" />
              <circle cx="42" cy={cy + 2} r="1.8" fill="#FEF3C7" />
              <circle cx="48" cy={cy + 2} r="1.8" fill="#FEF3C7" />
              <circle cx="45" cy={cy + 6} r="1.8" fill="#FEF3C7" />
              {/* Gugus Titik di Panel Krem Kanan */}
              <circle cx="59" cy={cy} r="2.4" fill="#9A3412" />
              <circle cx="56" cy={cy + 4} r="1.6" fill="#B91C1C" />
              <circle cx="62" cy={cy + 4} r="1.6" fill="#B91C1C" />
            </g>
          ))}
          <rect x="24" y="70" width="42" height="6" fill="#78350F" />
        </g>
      )}
    </svg>
  );
};

/**
 * Karakter Perempuan Chibi Utama - Palembang Heritage Edition
 *
 * Mendukung:
 * - top = null ("innerwear"/baju dasar sopan krem gading ketika belum memilih atasan)
 * - top = 'AG' (Baju Aesan Gede + Sanggul Malang + Mahkota Karsuhun + Teratai Dada + Kalung Kebo Munggah + Slempang Sawit + Kelat Bahu + Untaian Melati)
 * - top = 'AP' (Baju Aesan Paksangko Kurung Merah Bata Bertabur Bintang + Teratai Paksangko + Mahkota Paksangko Burung Hong + Kembang Goyang)
 * - top = 'BH' (Baju Kurung Beludru Hitam + Sulaman Benang Emas + Sanggul Palembang Rapi + Tusuk Emas Sederhana tanpa mahkota besar)
 * - bottom = null (Rok/kain dasar krem gading sopan ketika belum memilih bawahan)
 * - bottom = 'S' (Kain Songket Palembang Maroon Benang Emas Motif Tumpal)
 * - bottom = 'J' (Kain Tenun Jumputan Palembang Motif Ikat-Celup Titik & Belah Ketupat)
 */
export const PalembangChibiCharacterSvg: React.FC<{
  top: TopCode | null;
  bottom: BottomCode | null;
  width?: number;
  height?: number;
  className?: string;
  showShadow?: boolean;
}> = ({
  top,
  bottom,
  width = 160,
  height = 225,
  className = '',
  showShadow = true,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 270"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Pijakan Panggung Emas-Maroon di Bawah Karakter */}
      {showShadow && (
        <g>
          <ellipse cx="100" cy="254" rx="54" ry="11" fill="#7F1D1D" stroke="#451A03" strokeWidth="2.5" />
          <ellipse cx="100" cy="251" rx="46" ry="7.5" fill="#FBBF24" stroke="#78350F" strokeWidth="1.5" />
        </g>
      )}

      {/* ==================== 1. SANGGUL & MAHKOTA BELAKANG ==================== */}
      {top === 'AG' && (
        <g id="headpiece-back-AG">
          {/* Sanggul Malang Lebar Khas Pengantin Aesan Gede */}
          <ellipse cx="100" cy="58" rx="48" ry="18" fill="#1C1917" stroke="#451A03" strokeWidth="2.5" />
          <ellipse cx="55" cy="59" rx="14" ry="12" fill="#292524" stroke="#451A03" strokeWidth="2" />
          <ellipse cx="145" cy="59" rx="14" ry="12" fill="#292524" stroke="#451A03" strokeWidth="2" />
          {/* Tusuk Cempako Bertangkai Kiri & Kanan */}
          <line x1="34" y1="30" x2="60" y2="52" stroke="#D97706" strokeWidth="2.6" />
          <circle cx="32" cy="28" r="5" fill="#FDE047" stroke="#78350F" strokeWidth="1.8" />
          <line x1="42" y1="22" x2="65" y2="46" stroke="#D97706" strokeWidth="2.4" />
          <circle cx="40" cy="20" r="4.5" fill="#FBBF24" stroke="#78350F" strokeWidth="1.8" />

          <line x1="166" y1="30" x2="140" y2="52" stroke="#D97706" strokeWidth="2.6" />
          <circle cx="168" cy="28" r="5" fill="#FDE047" stroke="#78350F" strokeWidth="1.8" />
          <line x1="158" y1="22" x2="135" y2="46" stroke="#D97706" strokeWidth="2.4" />
          <circle cx="160" cy="20" r="4.5" fill="#FBBF24" stroke="#78350F" strokeWidth="1.8" />

          {/* Mahkota Karsuhun Tinggi Berbentuk Kipas Megah */}
          <path
            d="M52 54 C54 12, 146 12, 148 54 Z"
            fill="#F59E0B"
            stroke="#451A03"
            strokeWidth="2.6"
          />
          <path
            d="M62 52 C65 20, 135 20, 138 52 Z"
            fill="#FBBF24"
            stroke="#78350F"
            strokeWidth="2"
          />
          {/* Puncak Menara Karsuhun Tengah */}
          <polygon points="100,4 89,44 111,44" fill="#FDE047" stroke="#451A03" strokeWidth="2.2" />
          <polygon points="77,14 72,46 86,46" fill="#FDE047" stroke="#78350F" strokeWidth="1.8" />
          <polygon points="123,14 114,46 128,46" fill="#FDE047" stroke="#78350F" strokeWidth="1.8" />
          <circle cx="100" cy="26" r="4.5" fill="#991B1B" stroke="#451A03" strokeWidth="1.5" />
          <circle cx="80" cy="32" r="3.2" fill="#991B1B" />
          <circle cx="120" cy="32" r="3.2" fill="#991B1B" />
        </g>
      )}

      {top === 'AP' && (
        <g id="headpiece-back-AP">
          {/* Sanggul Sedang & Mahkota Paksangko Lengkung */}
          <ellipse cx="100" cy="54" rx="36" ry="15" fill="#1C1917" stroke="#451A03" strokeWidth="2.4" />
          {/* Tusuk Kembang Goyang Berjejer Miring */}
          <line x1="48" y1="24" x2="68" y2="48" stroke="#D97706" strokeWidth="2.2" />
          <circle cx="46" cy="22" r="4.5" fill="#FDE047" stroke="#78350F" strokeWidth="1.6" />
          <line x1="58" y1="16" x2="74" y2="44" stroke="#D97706" strokeWidth="2.2" />
          <circle cx="56" cy="14" r="4" fill="#FBBF24" stroke="#78350F" strokeWidth="1.6" />

          <line x1="152" y1="24" x2="132" y2="48" stroke="#D97706" strokeWidth="2.2" />
          <circle cx="154" cy="22" r="4.5" fill="#FDE047" stroke="#78350F" strokeWidth="1.6" />
          <line x1="142" y1="16" x2="126" y2="44" stroke="#D97706" strokeWidth="2.2" />
          <circle cx="144" cy="14" r="4" fill="#FBBF24" stroke="#78350F" strokeWidth="1.6" />

          {/* Mahkota Paksangko Lengkung Anggun */}
          <path
            d="M60 54 Q100 14 140 54 Z"
            fill="#F59E0B"
            stroke="#451A03"
            strokeWidth="2.5"
          />
          <path
            d="M68 53 Q100 23 132 53 Z"
            fill="#FDE047"
            stroke="#78350F"
            strokeWidth="1.8"
          />
        </g>
      )}

      {(top === 'BH' || top === null) && (
        <g id="headpiece-back-BH">
          {/* Sanggul Palembang Rapi Klasik (Tanpa Mahkota Pengantin Besar) */}
          <ellipse cx="100" cy="48" rx="30" ry="16" fill="#1C1917" stroke="#451A03" strokeWidth="2.5" />
          {top === 'BH' && (
            <g>
              {/* Tusuk Sanggul Emas Sederhana di Sisi Kiri & Kanan */}
              <circle cx="67" cy="45" r="5" fill="#FBBF24" stroke="#451A03" strokeWidth="1.8" />
              <circle cx="62" cy="52" r="3.5" fill="#FDE047" stroke="#451A03" strokeWidth="1.5" />
              <circle cx="133" cy="45" r="5" fill="#FBBF24" stroke="#451A03" strokeWidth="1.8" />
              <circle cx="138" cy="52" r="3.5" fill="#FDE047" stroke="#451A03" strokeWidth="1.5" />
              {/* Sisir Sanggul Emas Tipis di Atas */}
              <path d="M82 37 Q100 30 118 37" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          )}
        </g>
      )}

      {/* ==================== 2. LEHER & KEPALA CHIBI PEREMPUAN ==================== */}
      {/* Leher */}
      <rect x="91" y="114" width="18" height="16" rx="6" fill="#FDE6D2" stroke="#451A03" strokeWidth="2.4" />

      {/* Telinga & Anting Sumping / Giwang Tradisional */}
      <circle cx="57" cy="88" r="8" fill="#FDE6D2" stroke="#451A03" strokeWidth="2.4" />
      <circle cx="143" cy="88" r="8" fill="#FDE6D2" stroke="#451A03" strokeWidth="2.4" />
      {/* Giwang Emas */}
      <circle cx="56" cy="93" r="3.8" fill="#FBBF24" stroke="#451A03" strokeWidth="1.5" />
      <circle cx="144" cy="93" r="3.8" fill="#FBBF24" stroke="#451A03" strokeWidth="1.5" />

      {/* Wajah Chibi Proporsional & Ramah */}
      <rect
        x="60"
        y="50"
        width="80"
        height="68"
        rx="32"
        fill="#FFF1E6"
        stroke="#451A03"
        strokeWidth="2.6"
      />

      {/* Rambut Depan (Belah Tengah Anggun Khas Gadis Palembang) */}
      <path
        d="M59 80 C58 55, 76 46, 100 48 C124 46, 142 55, 141 80 C134 64, 118 57, 100 60 C82 57, 66 64, 59 80 Z"
        fill="#1C1917"
        stroke="#451A03"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* Alis Rapi & Ekspresif */}
      <path d="M72 74 Q80 70 88 73" stroke="#451A03" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M112 73 Q120 70 128 74" stroke="#451A03" strokeWidth="2.6" strokeLinecap="round" />

      {/* Mata Chibi Besar Berkilau Cokelat Tua Hangat */}
      <g>
        {/* Mata Kiri */}
        <ellipse cx="81" cy="86" rx="9" ry="10.5" fill="#FFFFFF" stroke="#451A03" strokeWidth="2.4" />
        <ellipse cx="81" cy="87" rx="6.5" ry="8" fill="#451A03" />
        <ellipse cx="81" cy="89" rx="4.5" ry="5" fill="#92400E" />
        <circle cx="78.5" cy="83.5" r="2.8" fill="#FFFFFF" />
        <circle cx="84" cy="90.5" r="1.4" fill="#FFFFFF" />
        {/* Bulu Mata Lentik */}
        <path d="M71 80 L68 77" stroke="#451A03" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M74 77 L72 74" stroke="#451A03" strokeWidth="2.2" strokeLinecap="round" />

        {/* Mata Kanan */}
        <ellipse cx="119" cy="86" rx="9" ry="10.5" fill="#FFFFFF" stroke="#451A03" strokeWidth="2.4" />
        <ellipse cx="119" cy="87" rx="6.5" ry="8" fill="#451A03" />
        <ellipse cx="119" cy="89" rx="4.5" ry="5" fill="#92400E" />
        <circle cx="116.5" cy="83.5" r="2.8" fill="#FFFFFF" />
        <circle cx="122" cy="90.5" r="1.4" fill="#FFFFFF" />
        {/* Bulu Mata Lentik */}
        <path d="M129 80 L132 77" stroke="#451A03" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M126 77 L128 74" stroke="#451A03" strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* Rona Pipi Hangat & Hidung Mungil & Senyum Ramah */}
      <ellipse cx="69" cy="96" rx="5.5" ry="3" fill="#FCA5A5" />
      <ellipse cx="131" cy="96" rx="5.5" ry="3" fill="#FCA5A5" />
      <path d="M99 92 Q100 94 101 92" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M93 101 Q100 107 107 101"
        stroke="#881337"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* ==================== 3. DETAIL DEPAN MAHKOTA & UNTAIAN MELATI ==================== */}
      {top === 'AG' && (
        <g id="headpiece-front-AG">
          {/* Jamang / Pita Dahi Emas Berukir */}
          <path
            d="M60 58 Q100 46 140 58 L138 51 Q100 40 62 51 Z"
            fill="#FBBF24"
            stroke="#451A03"
            strokeWidth="2"
          />
          <circle cx="100" cy="50" r="3.5" fill="#991B1B" stroke="#451A03" strokeWidth="1.2" />
          {/* Untaian Bunga Melati Menggantung di Sisi Telinga Kanan & Kiri */}
          {[96, 103, 110, 117, 124].map((cy, idx) => (
            <g key={cy}>
              <circle
                cx={145 + (idx % 2)}
                cy={cy}
                r="3.2"
                fill="#FFFBEB"
                stroke="#451A03"
                strokeWidth="1.4"
              />
              <circle
                cx={55 - (idx % 2)}
                cy={cy}
                r="3.2"
                fill="#FFFBEB"
                stroke="#451A03"
                strokeWidth="1.4"
              />
            </g>
          ))}
          <ellipse cx="145" cy="131" rx="3.5" ry="5" fill="#15803D" stroke="#451A03" strokeWidth="1.4" />
          <ellipse cx="55" cy="131" rx="3.5" ry="5" fill="#15803D" stroke="#451A03" strokeWidth="1.4" />
        </g>
      )}

      {top === 'AP' && (
        <g id="headpiece-front-AP">
          {/* Jamang Paksangko & Ornamen Burung Hong Emas di Dahi Atas */}
          <path
            d="M62 57 Q100 47 138 57 L136 50 Q100 41 64 50 Z"
            fill="#FBBF24"
            stroke="#451A03"
            strokeWidth="2"
          />
          {/* Burung Hong (Phoenix Palembang) di Tengah Mahkota Paksangko */}
          <path
            d="M90 46 L100 32 L110 46 L100 52 Z"
            fill="#FDE047"
            stroke="#451A03"
            strokeWidth="1.8"
          />
          <path d="M84 42 Q92 37 98 44" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M116 42 Q108 37 102 44" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="100" cy="43" r="2.6" fill="#B91C1C" />
        </g>
      )}

      {/* ==================== 4. BAWAHAN (KAIN SONGKET / JUMPUTAN / DASAR) ==================== */}
      {/* Sepatu Selop Emas Tradisional */}
      <ellipse cx="86" cy="246" rx="12" ry="6.5" fill="#B45309" stroke="#451A03" strokeWidth="2.2" />
      <ellipse cx="86" cy="245" rx="8" ry="4" fill="#FBBF24" />
      <ellipse cx="114" cy="246" rx="12" ry="6.5" fill="#B45309" stroke="#451A03" strokeWidth="2.2" />
      <ellipse cx="114" cy="245" rx="8" ry="4" fill="#FBBF24" />

      {bottom === null && (
        <g id="bottom-neutral">
          {/* Bawahan Dasar Sopan Krem Gading saat belum memilih kain */}
          <path
            d="M72 175 H128 L131 242 H69 L72 175 Z"
            fill="#F5EBE1"
            stroke="#451A03"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line x1="100" y1="178" x2="100" y2="241" stroke="#D6C7B2" strokeWidth="2" />
          <rect x="72" y="234" width="56" height="5" fill="#E7D8C5" />
        </g>
      )}

      {bottom === 'S' && (
        <g id="bottom-songket">
          {/* Kain Songket Palembang: Maroon Tua + Tenun Benang Emas Motif Tumpal & Lepus */}
          <path
            d="M70 174 H130 L133 243 H67 L70 174 Z"
            fill="#7F1D1D"
            stroke="#451A03"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          {/* Kisi Belah Ketupat Emas (Motif Bungo Intan) */}
          <line x1="72" y1="184" x2="128" y2="214" stroke="#FBBF24" strokeWidth="1.6" />
          <line x1="70" y1="202" x2="128" y2="232" stroke="#FBBF24" strokeWidth="1.6" />
          <line x1="128" y1="184" x2="72" y2="214" stroke="#FBBF24" strokeWidth="1.6" />
          <line x1="130" y1="202" x2="72" y2="232" stroke="#FBBF24" strokeWidth="1.6" />
          {/* Panel Tumpal Pucuk Rebung Emas di Tengah & Bawah Kain */}
          <rect x="93" y="175" width="14" height="67" fill="#881337" stroke="#FBBF24" strokeWidth="1.4" />
          {[184, 198, 212, 226].map((cy) => (
            <polygon key={cy} points={`95,${cy + 8} 100,${cy} 105,${cy + 8}`} fill="#FDE047" />
          ))}
          {/* Baris Segitiga Tumpal Bawah */}
          {[70, 82, 94, 106, 118].map((cx) => (
            <polygon key={cx} points={`${cx},241 ${cx + 6},231 ${cx + 12},241`} fill="#FBBF24" />
          ))}
          {/* Sabuk Pending Emas Berukir di Pinggang */}
          <rect x="70" y="172" width="60" height="8" rx="2" fill="#F59E0B" stroke="#451A03" strokeWidth="2" />
          <ellipse cx="100" cy="176" rx="9" ry="4.5" fill="#FDE047" stroke="#451A03" strokeWidth="1.6" />
        </g>
      )}

      {bottom === 'J' && (
        <g id="bottom-jumputan">
          {/* Kain Tenun Jumputan Palembang: Krem Keemasan + Merah Bata + Gugus Titik Ikat Celup */}
          <path
            d="M70 174 H130 L133 243 H67 L70 174 Z"
            fill="#FDE68A"
            stroke="#451A03"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          {/* Panel Tengah & Tepi Merah Bata Khas Kain Jumputan */}
          <rect x="90" y="175" width="20" height="67" fill="#B91C1C" />
          <rect x="69" y="234" width="62" height="8" fill="#9A3412" />
          {/* Gugus Titik-Titik Ikat Celup (Motif Titik Tujuh) */}
          {[188, 206, 222].map((cy) => (
            <g key={cy}>
              {/* Sisi Kiri Krem */}
              <circle cx="80" cy={cy} r="2.6" fill="#9A3412" />
              <circle cx="76" cy={cy + 4} r="1.8" fill="#B91C1C" />
              <circle cx="84" cy={cy + 4} r="1.8" fill="#B91C1C" />
              {/* Sisi Tengah Merah Bata (Titik Krem Belah Ketupat) */}
              <circle cx="100" cy={cy - 3} r="2" fill="#FEF3C7" />
              <circle cx="96" cy={cy + 1} r="2" fill="#FEF3C7" />
              <circle cx="104" cy={cy + 1} r="2" fill="#FEF3C7" />
              <circle cx="100" cy={cy + 5} r="2" fill="#FEF3C7" />
              {/* Sisi Kanan Krem */}
              <circle cx="120" cy={cy} r="2.6" fill="#9A3412" />
              <circle cx="116" cy={cy + 4} r="1.8" fill="#B91C1C" />
              <circle cx="124" cy={cy + 4} r="1.8" fill="#B91C1C" />
            </g>
          ))}
          {/* Ban Pinggang Tenun Jumputan */}
          <rect x="70" y="172" width="60" height="7" rx="2" fill="#9A3412" stroke="#451A03" strokeWidth="2" />
        </g>
      )}

      {/* ==================== 5. ATASAN (BAJU ADAT / BAJU DASAR SOPAN) ==================== */}
      {/* Telapak Tangan Chibi */}
      <circle cx="57" cy="176" r="6.5" fill="#FDE6D2" stroke="#451A03" strokeWidth="2.2" />
      <circle cx="143" cy="176" r="6.5" fill="#FDE6D2" stroke="#451A03" strokeWidth="2.2" />

      {top === null && (
        <g id="top-neutral">
          {/* Baju Dasar Sopan Krem Gading (Saat Belum Memilih Atasan) */}
          <path
            d="M54 134 L72 124 H128 L146 134 L148 172 L134 174 L130 146 V178 H70 V146 L66 174 L52 172 L54 134 Z"
            fill="#FFFBEB"
            stroke="#451A03"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M84 124 Q100 134 116 124" stroke="#B45309" strokeWidth="2" fill="none" />
          <text
            x="100"
            y="157"
            textAnchor="middle"
            fill="#92400E"
            fontSize="9"
            fontWeight="800"
          >
            BAJU DASAR
          </text>
        </g>
      )}

      {top === 'AG' && (
        <g id="top-aesan-gede">
          {/* Lengan & Badan Baju Dodot / Aesan Gede Maroon Keemasan */}
          <path
            d="M53 134 L72 124 H128 L147 134 L149 171 L135 173 L130 146 V177 H70 V146 L65 173 L51 171 L53 134 Z"
            fill="#881337"
            stroke="#451A03"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          {/* Slempang Sawit Emas Menyilang di Dada */}
          <path d="M73 128 L126 175" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" />
          <path d="M127 128 L74 175" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" />
          <path d="M73 128 L126 175" stroke="#78350F" strokeWidth="1.4" strokeDasharray="3 3" />
          <path d="M127 128 L74 175" stroke="#78350F" strokeWidth="1.4" strokeDasharray="3 3" />

          {/* Teratai Dada Bundar Bersusun 3 Tingkat Khas Aesan Gede */}
          <ellipse cx="100" cy="138" rx="30" ry="15" fill="#F59E0B" stroke="#451A03" strokeWidth="2.2" />
          <ellipse cx="100" cy="135" rx="23" ry="11" fill="#FBBF24" stroke="#78350F" strokeWidth="1.8" />
          <ellipse cx="100" cy="132" rx="15" ry="7" fill="#FDE047" stroke="#78350F" strokeWidth="1.5" />
          {/* Kalung Kebo Munggah Bertingkat */}
          <circle cx="100" cy="133" r="4" fill="#991B1B" stroke="#451A03" strokeWidth="1.4" />
          <ellipse cx="100" cy="158" rx="11" ry="6" fill="#FDE047" stroke="#451A03" strokeWidth="1.8" />
          <circle cx="100" cy="158" r="2.5" fill="#991B1B" />

          {/* Kelat Bahu Emas & Gelang Kano di Lengan */}
          <rect x="52" y="143" width="13" height="6" rx="2" fill="#FDE047" stroke="#451A03" strokeWidth="1.8" />
          <rect x="135" y="143" width="13" height="6" rx="2" fill="#FDE047" stroke="#451A03" strokeWidth="1.8" />
          <rect x="51" y="164" width="13" height="6" rx="2" fill="#FBBF24" stroke="#451A03" strokeWidth="1.8" />
          <rect x="136" y="164" width="13" height="6" rx="2" fill="#FBBF24" stroke="#451A03" strokeWidth="1.8" />
        </g>
      )}

      {top === 'AP' && (
        <g id="top-aesan-paksangko">
          {/* Baju Kurung Tanggung Merah Bata (Memanjang hingga Pinggul Atas, Berbeda dari Aesan Gede) */}
          <path
            d="M52 134 L71 124 H129 L148 134 L149 172 L135 174 L131 146 V191 H69 V146 L65 174 L51 172 L52 134 Z"
            fill="#B91C1C"
            stroke="#451A03"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          {/* Teratai Paksangko Berbentuk Segi Enam Berlekuk Emas-Krem */}
          <polygon
            points="100,123 128,131 120,148 80,148 72,131"
            fill="#FDE68A"
            stroke="#451A03"
            strokeWidth="2.2"
          />
          <polygon
            points="100,127 120,133 114,143 86,143 80,133"
            fill="#F59E0B"
            stroke="#78350F"
            strokeWidth="1.6"
          />
          <circle cx="100" cy="135" r="3.5" fill="#7F1D1D" />

          {/* Motif Taburan Bintang Emas Khas Baju Kurung Paksangko */}
          {[
            [82, 158],
            [100, 156],
            [118, 158],
            [78, 172],
            [93, 170],
            [107, 170],
            [122, 172],
            [60, 152],
            [140, 152],
          ].map(([cx, cy], idx) => (
            <g key={idx}>
              <circle cx={cx} cy={cy} r="2.6" fill="#FDE047" />
              <circle cx={cx} cy={cy} r="1" fill="#9A3412" />
            </g>
          ))}

          {/* Lis Sulam Emas di Tepi Bawah Baju Kurung Tanggung & Ujung Lengan */}
          <rect x="69" y="183" width="62" height="7" fill="#FBBF24" stroke="#451A03" strokeWidth="1.8" />
          <rect x="51" y="165" width="14" height="6" fill="#FBBF24" stroke="#451A03" strokeWidth="1.8" />
          <rect x="135" y="165" width="14" height="6" fill="#FBBF24" stroke="#451A03" strokeWidth="1.8" />
        </g>
      )}

      {top === 'BH' && (
        <g id="top-beludru-hitam">
          {/* Baju Kurung Beludru Hitam Longgar Berlengan Panjang + Sulaman Benang Emas */}
          <path
            d="M52 134 L71 124 H129 L148 134 L149 172 L135 174 L131 146 V192 H69 V146 L65 174 L51 172 L52 134 Z"
            fill="#1C1917"
            stroke="#451A03"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          {/* Kerah Tegak & Sulaman Leher V Benang Emas (Tanpa Teratai Pengantin Besar) */}
          <rect x="86" y="119" width="28" height="7" rx="3" fill="#1C1917" stroke="#FBBF24" strokeWidth="2.2" />
          <path
            d="M78 126 L100 150 L122 126"
            stroke="#FBBF24"
            strokeWidth="4"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M84 126 L100 143 L116 126"
            stroke="#FDE047"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Motif Bunga Emas Kecil di Dada & Badan Baju Beludru */}
          {[
            [82, 156],
            [118, 156],
            [100, 162],
            [82, 173],
            [118, 173],
            [60, 152],
            [140, 152],
          ].map(([cx, cy], idx) => (
            <g key={idx}>
              <circle cx={cx} cy={cy} r="3" fill="#FBBF24" />
              <circle cx={cx} cy={cy} r="1.2" fill="#FEF3C7" />
            </g>
          ))}
          {/* Lis Sulaman Benang Emas di Ujung Lengan & Tepi Bawah Baju Kurung */}
          <rect x="69" y="184" width="62" height="7" fill="#FBBF24" stroke="#78350F" strokeWidth="1.8" />
          <line x1="71" y1="187.5" x2="129" y2="187.5" stroke="#7F1D1D" strokeWidth="1.5" strokeDasharray="4 3" />
          <rect x="51" y="165" width="14" height="6" fill="#FBBF24" stroke="#78350F" strokeWidth="1.8" />
          <rect x="135" y="165" width="14" height="6" fill="#FBBF24" stroke="#78350F" strokeWidth="1.8" />
        </g>
      )}
    </svg>
  );
};

/**
 * Roda Spin 6 Sektor Busana Adat Palembang (Halaman 4 Bagian 3.2)
 * Sektor berukuran sama besar (60 derajat per sektor):
 * (AG, S), (AG, J), (AP, S), (AP, J), (BH, S), (BH, J)
 */
const WHEEL_SECTOR_STYLES: Record<
  OutfitKey,
  { bg: string; textColor: string; subColor: string }
> = {
  'AG,S': { bg: '#881337', textColor: '#FEF3C7', subColor: '#FDE047' },
  'AG,J': { bg: '#FDE68A', textColor: '#451A03', subColor: '#9A3412' },
  'AP,S': { bg: '#B91C1C', textColor: '#FFFBEB', subColor: '#FDE047' },
  'AP,J': { bg: '#F59E0B', textColor: '#451A03', subColor: '#7F1D1D' },
  'BH,S': { bg: '#292524', textColor: '#FEF3C7', subColor: '#FBBF24' },
  'BH,J': { bg: '#FEF3C7', textColor: '#451A03', subColor: '#881337' },
};

export const PalembangSpinWheelSvg: React.FC<{
  angle: number;
  size?: number;
}> = ({ angle, size = 188 }) => {
  const cx = 110;
  const cy = 110;
  const r = 96;

  const degToRad = (deg: number) => (deg * Math.PI) / 180;

  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center select-none"
    >
      {/* Jarum Penunjuk Emas-Maroon di Puncak Atas */}
      <div
        style={{ top: '-8px', zIndex: 20 }}
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
      >
        <svg width="30" height="28" viewBox="0 0 30 28" fill="none">
          <path
            d="M15 26 L3 4 H27 L15 26 Z"
            fill="#881337"
            stroke="#451A03"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <circle cx="15" cy="9" r="4" fill="#FDE047" stroke="#451A03" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Roda Berputar 6 Sektor Sama Besar */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 220 220"
        style={{
          transform: `rotate(${angle}deg)`,
          transition: 'transform 620ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Bingkai Ukiran Emas Luar */}
        <circle cx={cx} cy={cy} r={r + 8} fill="#78350F" stroke="#451A03" strokeWidth="3" />
        <circle cx={cx} cy={cy} r={r + 4} fill="#F59E0B" />

        {ALL_OUTFITS.map((item, idx) => {
          const startDeg = idx * 60 - 120;
          const endDeg = startDeg + 60;
          const midDeg = startDeg + 30;

          const x1 = cx + r * Math.cos(degToRad(startDeg));
          const y1 = cy + r * Math.sin(degToRad(startDeg));
          const x2 = cx + r * Math.cos(degToRad(endDeg));
          const y2 = cy + r * Math.sin(degToRad(endDeg));

          const tx = cx + r * 0.63 * Math.cos(degToRad(midDeg));
          const ty = cy + r * 0.63 * Math.sin(degToRad(midDeg));

          const style = WHEEL_SECTOR_STYLES[item.key];

          return (
            <g key={item.key}>
              <path
                d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                fill={style.bg}
                stroke="#451A03"
                strokeWidth="2.4"
              />
              <g transform={`translate(${tx}, ${ty}) rotate(${midDeg + 90})`}>
                <text
                  x="0"
                  y="-2"
                  textAnchor="middle"
                  fill={style.textColor}
                  fontSize="12.5"
                  fontWeight="900"
                >
                  {item.label}
                </text>
                <text
                  x="0"
                  y="10"
                  textAnchor="middle"
                  fill={style.subColor}
                  fontSize="8"
                  fontWeight="800"
                >
                  1/6
                </text>
              </g>
            </g>
          );
        })}

        {/* Ornamen Titik Emas di Sekeliling Bingkai Roda */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
          const px = cx + (r + 4) * Math.cos(degToRad(deg));
          const py = cy + (r + 4) * Math.sin(degToRad(deg));
          return <circle key={deg} cx={px} cy={py} r="2.3" fill="#FEF3C7" />;
        })}

        {/* Pusat Roda Motif Bunga Songket Emas */}
        <circle cx={cx} cy={cy} r="22" fill="#7F1D1D" stroke="#451A03" strokeWidth="3" />
        <circle cx={cx} cy={cy} r="15" fill="#FBBF24" stroke="#451A03" strokeWidth="2" />
        <text x={cx} y={cy + 3.5} textAnchor="middle" fill="#451A03" fontSize="9.5" fontWeight="900">
          SPIN
        </text>
      </svg>
    </div>
  );
};
