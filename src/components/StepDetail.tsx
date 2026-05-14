import React, { useState, useEffect } from "react";
import type { CJMStep } from "@/data/cjmSteps";
import Icon from "@/components/ui/icon";
import type { StepLink, StepImage, StepFile } from "@/lib/cjmApi";

interface StepDetailProps {
  step: CJMStep;
  onClose: () => void;
  links: StepLink[];
  images: StepImage[];
  files: StepFile[];
  onLinksChange: (links: StepLink[]) => void;
  onImagesChange: (images: StepImage[]) => void;
  onFilesChange: (files: StepFile[]) => void;
}

const StepDetail: React.FC<StepDetailProps> = ({ step, onClose }) => {
  const [comments, setComments] = useState<{ id: number; text: string; time: string }[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    setComments([]);
    setNewComment("");
  }, [step.id]);

  const addComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now(), text: newComment, time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setNewComment("");
  };

  return (
    <div className="detail-panel h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className="flex items-start gap-3 p-5 pb-4 flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`,
          borderBottom: `1px solid ${step.color}40`,
        }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${step.color}30`, border: `1.5px solid ${step.color}60` }}
        >
          {step.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-bold font-montserrat tracking-wider" style={{ color: step.color }}>
              УРОВЕНЬ {step.id}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white font-golos leading-tight">{step.title}</h2>
          <p className="text-sm mt-0.5" style={{ color: `${step.color}cc` }}>{step.tagline}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0">
          <Icon name="X" size={16} className="text-white/60" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-5 space-y-5">

        {/* Scenarios */}
        {step.scenarios && step.scenarios.length > 0 && (
          <div>
            {step.scenarios.map((scenario, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <div className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: step.color }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    style={{ background: `${step.color}30`, border: `1px solid ${step.color}50` }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {scenario.title}
                </div>
                <div className="space-y-1.5 pl-2">
                  {scenario.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: step.color }} />
                      <span className="text-sm text-white/80 font-golos">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details */}
        {step.details.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: step.color }}>Что происходит</div>
            {step.details.map((d, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ background: `${step.color}25`, color: step.color, border: `1px solid ${step.color}40` }}>
                  {i + 1}
                </div>
                <span className="text-sm text-white/80 font-golos leading-relaxed">{d}</span>
              </div>
            ))}
          </div>
        )}

        {/* Outcomes */}
        {step.outcomes && step.outcomes.length > 0 && (
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: step.color }}>Результат уровня</div>
            <div className="flex flex-wrap gap-2">
              {step.outcomes.map((o, i) => (
                <div key={i} className="text-xs px-2.5 py-1 rounded-lg font-golos"
                  style={{ background: `${step.color}20`, border: `1px solid ${step.color}40`, color: `${step.color}ee` }}>
                  ✦ {o}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: step.color }}>
            Комментарии{comments.length > 0 && <span className="text-white/30 ml-1">({comments.length})</span>}
          </div>
          {comments.length > 0 && (
            <div className="space-y-2 mb-3">
              {comments.map((c) => (
                <div key={c.id} className="rounded-xl px-3 py-2.5 text-sm font-golos"
                  style={{ background: "rgba(52,58,126,0.3)", border: "1px solid rgba(107,117,201,0.2)" }}>
                  <p className="text-white/85 leading-relaxed">{c.text}</p>
                  <p className="text-white/30 text-xs mt-1">{c.time}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 outline-none font-golos"
              style={{ background: "rgba(52,58,126,0.4)", border: "1px solid rgba(107,117,201,0.25)" }}
              placeholder="Добавить заметку..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addComment()}
            />
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-80"
              style={{ background: step.color, opacity: newComment.trim() ? 1 : 0.4 }}
              onClick={addComment}
            >
              <Icon name="Send" size={15} className="text-white" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StepDetail;
