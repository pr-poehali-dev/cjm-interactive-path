import React from "react";

interface StepNodeProps {
  step: number;
  total: number;
  emoji: string;
  title: string;
  color: string;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  onClick: () => void;
  side: "left" | "right";
}

const StepNode: React.FC<StepNodeProps> = ({
  step,
  emoji,
  title,
  color,
  isActive,
  isCompleted,
  isLocked,
  onClick,
  side,
}) => {
  return (
    <div
      className={`flex items-center gap-3 ${side === "right" ? "flex-row" : "flex-row-reverse"}`}
      style={{ width: "100%" }}
    >
      {/* Label */}
      <div
        className={`flex-1 ${side === "right" ? "text-left" : "text-right"} cursor-pointer group`}
        onClick={onClick}
        style={{ maxWidth: "calc(50% - 52px)" }}
      >
        <div
          className={`inline-block px-3 py-1.5 rounded-xl transition-all duration-300 ${
            isLocked ? "opacity-40" : "opacity-100"
          } ${isActive ? "scale-105" : "hover:scale-102"}`}
          style={{
            background: isActive
              ? `linear-gradient(135deg, ${color}40, ${color}20)`
              : "rgba(52, 58, 126, 0.3)",
            border: isActive ? `1px solid ${color}80` : "1px solid rgba(107, 117, 201, 0.2)",
          }}
        >
          <div
            className="text-xs font-semibold font-golos"
            style={{ color: isActive ? color : "rgba(255,255,255,0.5)" }}
          >
            LVL {step}
          </div>
          <div
            className={`text-sm font-medium font-golos leading-tight ${
              isActive ? "text-white" : isLocked ? "text-white/30" : "text-white/70"
            }`}
          >
            {title}
          </div>
        </div>
      </div>

      {/* Node */}
      <div
        className={`step-node relative flex-shrink-0 flex items-center justify-center rounded-full cursor-pointer
          ${isActive ? "active" : ""}
          ${isLocked ? "opacity-40 cursor-not-allowed" : ""}
        `}
        style={{
          width: 52,
          height: 52,
          background: isCompleted
            ? `linear-gradient(135deg, ${color}, ${color}cc)`
            : isActive
              ? `linear-gradient(135deg, #FF5420, #ff7a50)`
              : isLocked
                ? "rgba(45, 52, 116, 0.8)"
                : `linear-gradient(135deg, ${color}80, ${color}40)`,
          border: isActive
            ? "2.5px solid #FF5420"
            : isCompleted
              ? `2px solid ${color}`
              : "2px solid rgba(107, 117, 201, 0.4)",
          boxShadow: isActive
            ? `0 0 20px rgba(255, 84, 32, 0.5), 0 0 40px rgba(255, 84, 32, 0.2)`
            : isCompleted
              ? `0 0 12px ${color}60`
              : "none",
        }}
        onClick={isLocked ? undefined : onClick}
      >
        {isCompleted && !isActive ? (
          <span className="text-xl">✓</span>
        ) : isLocked ? (
          <span className="text-xl opacity-50">🔒</span>
        ) : (
          <span className="text-xl">{emoji}</span>
        )}

        {/* Active pulse ring */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-full animate-pulse-glow"
            style={{ border: "2px solid rgba(255, 84, 32, 0.4)" }}
          />
        )}

        {/* Step number badge */}
        <div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black font-montserrat"
          style={{
            background: isActive ? "#FF5420" : isCompleted ? color : "rgba(52, 58, 126, 0.9)",
            color: "white",
            border: "1.5px solid rgba(255,255,255,0.2)",
          }}
        >
          {step}
        </div>
      </div>

      {/* Spacer for the other side */}
      <div style={{ flex: 1, maxWidth: "calc(50% - 52px)" }} />
    </div>
  );
};

export default StepNode;
