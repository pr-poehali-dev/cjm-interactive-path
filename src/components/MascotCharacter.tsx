import React from "react";

const MASCOT_URL = "https://cdn.poehali.dev/projects/19599be6-d8e2-4f4f-a000-dce2999f89ab/bucket/e166e5db-1d4c-453b-872d-92dfc21ddcd8.png";

interface MascotProps {
  isWalking?: boolean;
  size?: number;
  expression?: "happy" | "excited" | "thinking";
}

const MascotCharacter: React.FC<MascotProps> = ({
  isWalking = false,
  size = 64,
}) => {
  return (
    <div
      className={isWalking ? "animate-mascot-walk" : "animate-float"}
      style={{ width: size, height: size * 1.2, flexShrink: 0 }}
    >
      <img
        src={MASCOT_URL}
        alt="Феликс — маскот"
        style={{
          width: size,
          height: size * 1.2,
          objectFit: "contain",
          objectPosition: "center bottom",
          filter: "drop-shadow(0 4px 16px rgba(255,84,32,0.25))",
        }}
        draggable={false}
      />
    </div>
  );
};

export default MascotCharacter;