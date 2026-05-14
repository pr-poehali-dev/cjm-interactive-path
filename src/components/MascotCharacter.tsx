import React from "react";

interface MascotProps {
  isWalking?: boolean;
  size?: number;
  expression?: "happy" | "excited" | "thinking";
}

const MascotCharacter: React.FC<MascotProps> = ({
  isWalking = false,
  size = 64,
  expression = "happy",
}) => {
  const eyeY = expression === "excited" ? 38 : 40;

  return (
    <div
      className={isWalking ? "animate-mascot-walk" : "animate-float"}
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        {/* Body */}
        <ellipse cx="50" cy="72" rx="22" ry="18" fill="#343A7E" />
        <ellipse cx="50" cy="70" rx="18" ry="14" fill="#4a52a8" />

        {/* Legs */}
        <rect x="38" y="82" width="8" height="12" rx="4" fill="#343A7E" />
        <rect x="54" y="82" width="8" height="12" rx="4" fill="#343A7E" />
        <ellipse cx="42" cy="94" rx="6" ry="4" fill="#1a1f5e" />
        <ellipse cx="58" cy="94" rx="6" ry="4" fill="#1a1f5e" />

        {/* Arms */}
        <ellipse
          cx="28"
          cy="68"
          rx="6"
          ry="10"
          fill="#343A7E"
          transform="rotate(-20 28 68)"
        />
        <ellipse
          cx="72"
          cy="65"
          rx="6"
          ry="10"
          fill="#343A7E"
          transform="rotate(30 72 65)"
        />
        {/* Waving hand */}
        <circle cx="76" cy="56" r="6" fill="#343A7E" />
        <ellipse cx="76" cy="50" rx="3" ry="5" fill="#FF5420" />

        {/* Helmet */}
        <circle cx="50" cy="42" r="28" fill="#1a1f5e" />
        <circle cx="50" cy="42" r="26" fill="#343A7E" />

        {/* Visor */}
        <ellipse cx="50" cy="42" rx="19" ry="17" fill="#6b75c9" opacity="0.3" />
        <ellipse cx="50" cy="42" rx="18" ry="16" fill="#0a0d2e" />
        <ellipse cx="50" cy="42" rx="16" ry="14" fill="#0d1035" />

        {/* Eyes */}
        <circle cx="43" cy={eyeY} r="5" fill="white" />
        <circle cx="57" cy={eyeY} r="5" fill="white" />
        <circle cx="44" cy={eyeY + 1} r="3" fill="#1a1f5e" />
        <circle cx="58" cy={eyeY + 1} r="3" fill="#1a1f5e" />
        <circle cx="45" cy={eyeY} r="1.2" fill="white" />
        <circle cx="59" cy={eyeY} r="1.2" fill="white" />

        {/* Smile */}
        {expression === "excited" ? (
          <path
            d="M43 49 Q50 56 57 49"
            stroke="#FF5420"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <path
            d="M44 49 Q50 54 56 49"
            stroke="#FF5420"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Helmet details */}
        <path
          d="M24 35 Q28 15 50 14 Q72 15 76 35"
          stroke="#6b75c9"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <circle cx="50" cy="16" r="3" fill="#FF5420" />

        {/* Visor shine */}
        <ellipse
          cx="43"
          cy="34"
          rx="5"
          ry="3"
          fill="white"
          opacity="0.12"
          transform="rotate(-20 43 34)"
        />

        {/* Chest emblem */}
        <circle cx="50" cy="68" r="6" fill="#FF5420" opacity="0.9" />
        <text x="50" y="72" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">
          BP
        </text>
      </svg>
    </div>
  );
};

export default MascotCharacter;
