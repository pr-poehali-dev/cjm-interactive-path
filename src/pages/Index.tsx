import React, { useState, useRef, useEffect, useCallback } from "react";
import { CJM_STEPS } from "@/data/cjmSteps";
import MascotCharacter from "@/components/MascotCharacter";
import StepNode from "@/components/StepNode";
import StepDetail from "@/components/StepDetail";
import Icon from "@/components/ui/icon";

export default function Index() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showDetail, setShowDetail] = useState(false);
  const [mascotPos, setMascotPos] = useState(8);
  const [isMoving, setIsMoving] = useState(false);
  const [showUnlockEffect, setShowUnlockEffect] = useState(false);
  const [xp, setXp] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathContainerRef = useRef<HTMLDivElement>(null);

  const getMascotTopForStep = useCallback((stepIdx: number): number => {
    const node = nodeRefs.current[stepIdx];
    const container = pathContainerRef.current;
    if (!node || !container) return 8;
    const nodeRect = node.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return nodeRect.top - containerRect.top + nodeRect.height / 2 - 32;
  }, []);

  const spawnParticles = (x: number, y: number) => {
    const emojis = ["⭐", "✨", "🌟", "💫", "⚡"];
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 80,
      y: y + (Math.random() - 0.5) * 40,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 900);
  };

  const handleStepClick = (stepId: number) => {
    const stepIdx = stepId - 1;
    const top = getMascotTopForStep(stepIdx);

    setIsMoving(true);
    setMascotPos(top);

    setTimeout(() => {
      setIsMoving(false);
      setActiveStep(stepId);
      const isNew = !completedSteps.has(stepId);

      if (isNew) {
        setCompletedSteps((prev) => new Set([...prev, stepId]));
        setXp((prev) => prev + 100);
        setShowUnlockEffect(true);

        const node = nodeRefs.current[stepIdx];
        if (node) {
          const rect = node.getBoundingClientRect();
          spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }

        setTimeout(() => setShowUnlockEffect(false), 1500);
      }

      setShowDetail(true);
    }, 480);
  };

  const currentStep = activeStep ? CJM_STEPS.find((s) => s.id === activeStep)! : null;
  const progressPercent = (completedSteps.size / CJM_STEPS.length) * 100;
  const zigzagSide = (idx: number): "left" | "right" => (idx % 2 === 0 ? "right" : "left");

  return (
    <div
      className="min-h-screen noise-bg relative overflow-x-hidden"
      style={{
        background: "linear-gradient(160deg, #0d1035 0%, #1a1f5e 35%, #0f1240 70%, #080b2a 100%)",
        fontFamily: "'Golos Text', sans-serif",
      }}
    >
      {/* Stars background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 55 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: "white",
              opacity: Math.random() * 0.5 + 0.1,
              animation: `sparkle ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-50 text-base"
          style={{
            left: p.x,
            top: p.y,
            animation: "particles 0.9s ease-out forwards",
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Header */}
      <header className="relative z-10 px-6 pt-8 pb-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#FF5420" }} />
              <span className="text-xs text-white/40 font-golos uppercase tracking-widest">
                Customer Journey Map
              </span>
            </div>
            <h1 className="text-3xl font-black font-montserrat leading-none text-white">
              Путь{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #FF5420, #ff9d7a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                клиента
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* XP */}
            <div
              className="px-4 py-2 rounded-xl flex items-center gap-2"
              style={{ background: "rgba(52,58,126,0.5)", border: "1px solid rgba(107,117,201,0.3)" }}
            >
              <span className="text-lg">⚡</span>
              <div>
                <div className="text-xs text-white/40 font-golos leading-none">Опыт</div>
                <div className="text-sm font-bold text-white font-montserrat">{xp} XP</div>
              </div>
            </div>

            {/* Progress bar */}
            <div
              className="px-4 py-2 rounded-xl"
              style={{ background: "rgba(52,58,126,0.5)", border: "1px solid rgba(107,117,201,0.3)" }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white/40 font-golos">Прогресс</span>
                <span className="text-xs font-bold text-white/70 font-montserrat">
                  {completedSteps.size}/{CJM_STEPS.length}
                </span>
              </div>
              <div className="w-28 h-2 rounded-full overflow-hidden" style={{ background: "rgba(52,58,126,0.8)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progressPercent}%`,
                    background: "linear-gradient(90deg, #FF5420, #ff9d7a)",
                    boxShadow: progressPercent > 0 ? "0 0 8px rgba(255,84,32,0.5)" : "none",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-12 flex gap-5 items-start">

        {/* Path */}
        <div className="flex-1 min-w-0 relative" ref={pathContainerRef}>

          {/* Moving mascot */}
          <div
            className="absolute z-20 pointer-events-none"
            style={{
              top: mascotPos,
              left: "50%",
              transform: "translateX(-50%)",
              transition: "top 0.5s cubic-bezier(0.34, 1.1, 0.64, 1)",
              width: 64,
            }}
          >
            {showUnlockEffect && (
              <div
                className="absolute -top-11 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap animate-slide-down shadow-lg"
                style={{ background: "#FF5420", color: "white", fontFamily: "'Montserrat', sans-serif" }}
              >
                +100 XP! 🎉
              </div>
            )}
            <MascotCharacter isWalking={isMoving} size={64} expression={showUnlockEffect ? "excited" : "happy"} />
          </div>

          {/* Steps list */}
          <div className="pt-4 space-y-1">
            {CJM_STEPS.map((step, idx) => {
              const side = zigzagSide(idx);
              const isActive = step.id === activeStep;
              const isCompleted = completedSteps.has(step.id);

              return (
                <div key={step.id} className="relative">
                  {/* Connector */}
                  {idx < CJM_STEPS.length - 1 && (
                    <div
                      className="absolute left-1/2 -translate-x-px z-0"
                      style={{
                        top: "calc(100% - 4px)",
                        width: 2,
                        height: 18,
                        background: isCompleted
                          ? `linear-gradient(180deg, ${step.color}cc, ${CJM_STEPS[idx + 1].color}60)`
                          : "rgba(107,117,201,0.15)",
                        transition: "background 0.5s ease",
                      }}
                    />
                  )}
                  <div
                    ref={(el) => { nodeRefs.current[idx] = el; }}
                    className="relative z-10 py-1"
                  >
                    <StepNode
                      step={step.id}
                      total={CJM_STEPS.length}
                      emoji={step.emoji}
                      title={step.title}
                      color={step.color}
                      isActive={isActive}
                      isCompleted={isCompleted}
                      isLocked={false}
                      onClick={() => handleStepClick(step.id)}
                      side={side}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Finish */}
          <div className="mt-8 flex flex-col items-center gap-2 pb-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-700"
              style={{
                background:
                  completedSteps.size === CJM_STEPS.length
                    ? "linear-gradient(135deg, #FFD700, #ff9d00)"
                    : "rgba(52,58,126,0.3)",
                border:
                  completedSteps.size === CJM_STEPS.length
                    ? "2px solid #FFD700"
                    : "2px dashed rgba(107,117,201,0.25)",
                boxShadow:
                  completedSteps.size === CJM_STEPS.length ? "0 0 24px rgba(255,215,0,0.5)" : "none",
              }}
            >
              🏁
            </div>
            {completedSteps.size === CJM_STEPS.length && (
              <div className="text-sm font-bold font-montserrat animate-star-pop" style={{ color: "#FFD700" }}>
                Путь пройден! 🏆
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div
          className="rounded-2xl overflow-hidden flex-shrink-0"
          style={{
            width: 340,
            maxHeight: "calc(100vh - 180px)",
            position: "sticky",
            top: 24,
            background: "rgba(10, 13, 46, 0.92)",
            border: currentStep ? `1px solid ${currentStep.color}50` : "1px solid rgba(107,117,201,0.15)",
            backdropFilter: "blur(24px)",
            transition: "border-color 0.4s ease",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {showDetail && currentStep ? (
            <StepDetail
              key={activeStep}
              step={currentStep}
              onClose={() => setShowDetail(false)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-72 p-8 text-center gap-5">
              <div className="animate-float">
                <MascotCharacter size={88} expression="happy" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm font-golos mb-1">Привет! Я Феликс, твой проводник</p>
                <p className="text-white/40 text-xs font-golos leading-relaxed">
                  Выбирай шаги на карте слева — я буду рассказывать, что происходит на каждом уровне
                </p>
              </div>
              <div
                className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl animate-pulse-glow"
                style={{
                  background: "rgba(255,84,32,0.12)",
                  border: "1px solid rgba(255,84,32,0.3)",
                  color: "#ff9d7a",
                }}
              >
                <Icon name="MousePointer2" size={12} />
                Кликни на любой уровень
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer legend */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-8">
        <div
          className="rounded-xl px-5 py-3 flex items-center gap-6 flex-wrap"
          style={{ background: "rgba(10,13,46,0.7)", border: "1px solid rgba(107,117,201,0.12)" }}
        >
          <span className="text-xs text-white/25 font-golos">Легенда:</span>
          <div className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: "rgba(255,84,32,0.3)", border: "1.5px solid #FF5420" }}
            />
            <span className="text-xs text-white/40 font-golos">Активный</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full text-center text-[9px] flex items-center justify-center" style={{ background: "rgba(52,58,126,0.6)", border: "1px solid rgba(107,117,201,0.3)", color: "white" }}>✓</div>
            <span className="text-xs text-white/40 font-golos">Пройден</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full" style={{ background: "rgba(52,58,126,0.3)", border: "1px dashed rgba(107,117,201,0.3)" }} />
            <span className="text-xs text-white/40 font-golos">Не открыт</span>
          </div>
          <span className="ml-auto text-xs text-white/20 font-golos hidden md:block">
            Нажимай → читай детали → оставляй комментарии и ссылки
          </span>
        </div>
      </div>
    </div>
  );
}