import React, { useState } from "react";
import type { CJMStep } from "@/data/cjmSteps";
import Icon from "@/components/ui/icon";

interface StepDetailProps {
  step: CJMStep;
  onClose: () => void;
}

interface Comment {
  id: number;
  text: string;
  author: string;
  time: string;
}

const StepDetail: React.FC<StepDetailProps> = ({ step, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newLink, setNewLink] = useState({ label: "", url: "" });
  const [links, setLinks] = useState<{ label: string; url: string }[]>(step.links || []);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const addComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newComment,
        author: "Вы",
        time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setNewComment("");
  };

  const addLink = () => {
    if (!newLink.label || !newLink.url) return;
    setLinks((prev) => [...prev, newLink]);
    setNewLink({ label: "", url: "" });
    setShowLinkForm(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setImages((prev) => [...prev, ev.target!.result as string]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="detail-panel h-full flex flex-col overflow-hidden" style={{ maxHeight: "100%" }}>
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
            <span
              className="text-xs font-bold font-montserrat tracking-wider"
              style={{ color: step.color }}
            >
              УРОВЕНЬ {step.id}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white font-golos leading-tight">{step.title}</h2>
          <p className="text-sm mt-0.5" style={{ color: `${step.color}cc` }}>
            {step.tagline}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 flex-shrink-0"
        >
          <Icon name="X" size={16} className="text-white/60" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-5 space-y-5">

        {/* Scenarios */}
        {step.scenarios && step.scenarios.length > 0 && (
          <div>
            {step.scenarios.map((scenario, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <div
                  className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2"
                  style={{ color: step.color }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    style={{ background: `${step.color}30`, border: `1px solid ${step.color}50` }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {scenario.title}
                </div>
                <div className="space-y-1.5 pl-2">
                  {scenario.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: step.color }}
                      />
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
            <div
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: step.color }}
            >
              Что происходит
            </div>
            {step.details.map((d, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ background: `${step.color}25`, color: step.color, border: `1px solid ${step.color}40` }}
                >
                  {i + 1}
                </div>
                <span className="text-sm text-white/80 font-golos leading-relaxed">{d}</span>
              </div>
            ))}
          </div>
        )}

        {/* Note */}
        {step.note && (
          <div
            className="rounded-xl p-3 text-sm font-golos"
            style={{
              background: "rgba(255, 84, 32, 0.1)",
              border: "1px solid rgba(255, 84, 32, 0.3)",
              color: "#ff9d7a",
            }}
          >
            {step.note}
          </div>
        )}

        {/* Outcomes */}
        {step.outcomes && step.outcomes.length > 0 && (
          <div>
            <div
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: step.color }}
            >
              Результат уровня
            </div>
            <div className="flex flex-wrap gap-2">
              {step.outcomes.map((o, i) => (
                <div
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-lg font-golos"
                  style={{
                    background: `${step.color}20`,
                    border: `1px solid ${step.color}40`,
                    color: `${step.color}ee`,
                  }}
                >
                  ✦ {o}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uploaded Images */}
        {images.length > 0 && (
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-2 text-white/50">
              Изображения
            </div>
            <div className="grid grid-cols-2 gap-2">
              {images.map((src, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden aspect-video">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  >
                    <Icon name="X" size={12} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold uppercase tracking-wider text-white/50">Ссылки</div>
            <button
              className="text-xs px-2 py-1 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: step.color }}
              onClick={() => setShowLinkForm(!showLinkForm)}
            >
              + добавить
            </button>
          </div>
          {showLinkForm && (
            <div className="mb-2 space-y-2 animate-slide-down">
              <input
                className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none font-golos"
                style={{ background: "rgba(52, 58, 126, 0.5)", border: "1px solid rgba(107, 117, 201, 0.3)" }}
                placeholder="Название ссылки"
                value={newLink.label}
                onChange={(e) => setNewLink((p) => ({ ...p, label: e.target.value }))}
              />
              <input
                className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none font-golos"
                style={{ background: "rgba(52, 58, 126, 0.5)", border: "1px solid rgba(107, 117, 201, 0.3)" }}
                placeholder="https://..."
                value={newLink.url}
                onChange={(e) => setNewLink((p) => ({ ...p, url: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && addLink()}
              />
              <button
                className="w-full rounded-lg py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
                style={{ background: step.color }}
                onClick={addLink}
              >
                Добавить
              </button>
            </div>
          )}
          {links.length > 0 && (
            <div className="space-y-1.5">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-golos px-3 py-2 rounded-lg transition-all hover:bg-white/5 group"
                  style={{
                    background: "rgba(52, 58, 126, 0.3)",
                    border: "1px solid rgba(107, 117, 201, 0.2)",
                    color: step.color,
                  }}
                >
                  <Icon name="Link" size={13} />
                  <span className="flex-1 truncate">{link.label}</span>
                  <Icon name="ExternalLink" size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Comments */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-2 text-white/50">
            Комментарии ({comments.length})
          </div>
          {comments.length > 0 && (
            <div className="space-y-2 mb-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl p-3"
                  style={{ background: "rgba(52, 58, 126, 0.3)", border: "1px solid rgba(107, 117, 201, 0.2)" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white/70">{c.author}</span>
                    <span className="text-xs text-white/30">{c.time}</span>
                  </div>
                  <p className="text-sm text-white/80 font-golos">{c.text}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 outline-none font-golos"
              style={{ background: "rgba(52, 58, 126, 0.4)", border: "1px solid rgba(107, 117, 201, 0.3)" }}
              placeholder="Добавить комментарий..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addComment()}
            />
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
              style={{ background: step.color }}
              onClick={addComment}
            >
              <Icon name="Send" size={15} className="text-white" />
            </button>
          </div>
        </div>

        {/* Image upload */}
        <div>
          <label
            className="flex items-center gap-2 text-sm cursor-pointer px-3 py-2.5 rounded-xl transition-all hover:bg-white/5 font-golos"
            style={{
              background: "rgba(52, 58, 126, 0.3)",
              border: "1px dashed rgba(107, 117, 201, 0.4)",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <Icon name="Image" size={16} />
            Прикрепить изображение
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default StepDetail;
