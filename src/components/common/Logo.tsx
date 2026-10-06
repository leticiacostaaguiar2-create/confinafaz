import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showSubtitle = true,
}) => {
  const iconSize = size === 'sm' ? 26 : size === 'lg' ? 44 : 34;

  const textColor = variant === 'dark' ? 'text-stone-900' : 'text-white';
  const subColor = variant === 'dark' ? 'text-stone-500' : 'text-emerald-200/80';
  const brandColor = variant === 'dark' ? 'text-emerald-800' : 'text-amber-400';

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Hexagon/Shield background with organic rounded curves */}
          <rect
            x="3"
            y="3"
            width="42"
            height="42"
            rx="12"
            className={variant === 'dark' ? 'fill-emerald-900' : 'fill-emerald-800'}
          />
          {/* Subtle gold border accent */}
          <rect
            x="3.5"
            y="3.5"
            width="41"
            height="41"
            rx="11.5"
            stroke="#eab308"
            strokeOpacity="0.3"
            strokeWidth="1"
          />

          {/* Bovine Horns & Head stylized + Horizon Lines */}
          {/* Horizon sun/valley line */}
          <path
            d="M8 32C14 29 20 28 24 28C28 28 34 29 40 32"
            stroke="#ca8a04"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Bovine Horns curved outward */}
          <path
            d="M13 14C15 19 18 21 24 21C30 21 33 19 35 14"
            stroke="#fef08a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Head muzzle */}
          <path
            d="M20 21L19 31C19 33.5 21 35 24 35C27 35 29 33.5 29 31L28 21"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Leaf representing agro/sustentabilidade on the right ear */}
          <path
            d="M29 17C33 15 36 17 35 21C31 21 29 19 29 17Z"
            fill="#34d399"
          />
          {/* Forehead star / ear tag accent */}
          <circle cx="24" cy="25" r="1.5" fill="#facc15" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-wider uppercase font-['Plus_Jakarta_Sans'] ${size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-lg'} ${textColor}`}>
            VALE
          </span>
          <span className={`font-black tracking-wider uppercase font-['Plus_Jakarta_Sans'] ${size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-lg'} ${brandColor}`}>
            FORTE
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-[10px] tracking-wider uppercase font-medium mt-0.5 ${subColor}`}>
            Agropecuária & Confinamento
          </span>
        )}
      </div>
    </div>
  );
};
