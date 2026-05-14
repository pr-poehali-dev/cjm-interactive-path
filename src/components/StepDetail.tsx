import React, { useState, useEffect } from "react";
import type { CJMStep } from "@/data/cjmSteps";
import Icon from "@/components/ui/icon";
import type { StepLink, StepImage, StepFile } from "@/lib/cjmApi";
import { addLink, deleteLink, addImage, deleteImage, addFile, deleteFile, formatFileSize } from "@/lib/cjmApi";

const FILE_ICONS: Record<string, string> = {
  pdf: "FileText",
  html: "FileCode",
  png: "Image",
  jpg: "Image",
  jpeg: "Image",
  gif: "Image",
  webp: "Image",
};

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

const StepDetail: React.FC<StepDetailProps> = ({
  step,
  onClose,
  links,
  images,
  files,
  onLinksChange,
  onImagesChange,
  onFilesChange,
}) => {
  const [comments, setComments] = useState<{ id: number; text: string; time: string }[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newLink, setNewLink] = useState({ label: "", url: "" });
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [savingLink, setSavingLink] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxUrl(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const addComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now(), text: newComment, time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setNewComment("");
  };

  const handleAddLink = async () => {
    if (!newLink.label.trim() || !newLink.url.trim()) return;
    setSavingLink(true);
    try {
      const saved = await addLink(step.id, newLink.label.trim(), newLink.url.trim());
      onLinksChange([...links, saved]);
      setNewLink({ label: "", url: "" });
      setShowLinkForm(false);
    } finally {
      setSavingLink(false);
    }
  };

  const handleDeleteLink = async (id: number) => {
    await deleteLink(id);
    onLinksChange(links.filter((l) => l.id !== id));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const saved = await addImage(step.id, file);
      onImagesChange([...images, saved]);
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleDeleteImage = async (id: number) => {
    await deleteImage(id);
    onImagesChange(images.filter((img) => img.id !== id));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const saved = await addFile(step.id, file);
      onFilesChange([...files, saved]);
    } finally {
      setUploadingFile(false);
      e.target.value = "";
    }
  };

  const handleDeleteFile = async (id: number) => {
    await deleteFile(id);
    onFilesChange(files.filter((f) => f.id !== id));
  };

  return (
    <>
    {/* Lightbox */}
    {lightboxUrl && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(5, 7, 30, 0.95)", backdropFilter: "blur(12px)" }}
        onClick={() => setLightboxUrl(null)}
      >
        <button
          className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
          onClick={() => setLightboxUrl(null)}
        >
          <Icon name="X" size={18} className="text-white" />
        </button>
        <img
          src={lightboxUrl}
          alt=""
          className="max-w-full max-h-full rounded-2xl"
          style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.7)", objectFit: "contain" }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    )}
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

        {/* Note */}
        {step.note && (
          <div className="rounded-xl p-3 text-sm font-golos"
            style={{ background: "rgba(255,84,32,0.1)", border: "1px solid rgba(255,84,32,0.3)", color: "#ff9d7a" }}>
            {step.note}
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

        {/* Images — persistent */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: step.color }}>
              Изображения{images.length > 0 && <span className="text-white/30 ml-1">({images.length})</span>}
            </div>
          </div>
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-2">
              {images.map((img) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-video bg-black/20 cursor-zoom-in"
                  onClick={() => setLightboxUrl(img.url)}>
                  <img src={img.url} alt={img.caption || ""} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  {/* Expand hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(5,7,30,0.4)" }}>
                    <Icon name="Maximize2" size={20} className="text-white drop-shadow-lg" />
                  </div>
                  {/* Delete */}
                  <button
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={(e) => { e.stopPropagation(); handleDeleteImage(img.id); }}
                  >
                    <Icon name="X" size={12} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <label
            className="flex items-center gap-2 text-sm cursor-pointer px-3 py-2.5 rounded-xl transition-all hover:bg-white/5 font-golos"
            style={{
              background: "rgba(52,58,126,0.3)",
              border: `1px dashed ${uploadingImage ? step.color : "rgba(107,117,201,0.4)"}`,
              color: uploadingImage ? step.color : "rgba(255,255,255,0.4)",
            }}
          >
            <Icon name={uploadingImage ? "Loader" : "Image"} size={16} className={uploadingImage ? "animate-spin" : ""} />
            {uploadingImage ? "Загружаю в облако..." : "Прикрепить изображение"}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
          </label>
        </div>

        {/* Files — persistent */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: step.color }}>
              Файлы{files.length > 0 && <span className="text-white/30 ml-1">({files.length})</span>}
            </div>
          </div>
          {files.length > 0 && (
            <div className="space-y-1.5 mb-2">
              {files.map((f) => (
                <div key={f.id} className="flex items-center gap-2 group">
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center gap-2.5 text-sm font-golos px-3 py-2 rounded-xl transition-all hover:bg-white/5 min-w-0"
                    style={{ background: "rgba(52,58,126,0.3)", border: "1px solid rgba(107,117,201,0.2)" }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${step.color}20`, border: `1px solid ${step.color}30` }}>
                      <Icon name={FILE_ICONS[f.file_type] || "File"} size={15} style={{ color: step.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-white/80 truncate text-xs font-medium">{f.name}</div>
                      <div className="text-white/30 text-xs uppercase tracking-wider">
                        {f.file_type}{f.size_bytes ? ` · ${formatFileSize(f.size_bytes)}` : ""}
                      </div>
                    </div>
                    <Icon name="Download" size={13} className="opacity-40 flex-shrink-0" />
                  </a>
                  <button
                    className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                    onClick={() => handleDeleteFile(f.id)}
                  >
                    <Icon name="Trash2" size={13} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <label
            className="flex items-center gap-2 text-sm cursor-pointer px-3 py-2.5 rounded-xl transition-all hover:bg-white/5 font-golos"
            style={{
              background: "rgba(52,58,126,0.3)",
              border: `1px dashed ${uploadingFile ? step.color : "rgba(107,117,201,0.4)"}`,
              color: uploadingFile ? step.color : "rgba(255,255,255,0.4)",
            }}
          >
            <Icon name={uploadingFile ? "Loader" : "Paperclip"} size={16} className={uploadingFile ? "animate-spin" : ""} />
            {uploadingFile ? "Загружаю файл..." : "Прикрепить файл (PDF, HTML, PNG)"}
            <input
              type="file"
              accept=".pdf,.html,.png,application/pdf,text/html,image/png"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploadingFile}
            />
          </label>
        </div>

        {/* Links — persistent */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: step.color }}>
              Ссылки{links.length > 0 && <span className="text-white/30 ml-1">({links.length})</span>}
            </div>
            <button
              className="text-xs px-2 py-1 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: step.color }}
              onClick={() => setShowLinkForm(!showLinkForm)}
            >
              {showLinkForm ? "✕ отмена" : "+ добавить"}
            </button>
          </div>

          {showLinkForm && (
            <div className="mb-3 space-y-2 animate-slide-down">
              <input
                className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none font-golos"
                style={{ background: "rgba(52,58,126,0.5)", border: "1px solid rgba(107,117,201,0.3)" }}
                placeholder="Название ссылки"
                value={newLink.label}
                onChange={(e) => setNewLink((p) => ({ ...p, label: e.target.value }))}
              />
              <input
                className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none font-golos"
                style={{ background: "rgba(52,58,126,0.5)", border: "1px solid rgba(107,117,201,0.3)" }}
                placeholder="https://..."
                value={newLink.url}
                onChange={(e) => setNewLink((p) => ({ ...p, url: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
              />
              <button
                className="w-full rounded-lg py-2 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
                style={{ background: savingLink ? "rgba(255,84,32,0.5)" : step.color }}
                onClick={handleAddLink}
                disabled={savingLink}
              >
                {savingLink
                  ? <><Icon name="Loader" size={14} className="animate-spin" /> Сохраняю...</>
                  : <><Icon name="Save" size={14} /> Сохранить навсегда</>
                }
              </button>
            </div>
          )}

          {links.length > 0 && (
            <div className="space-y-1.5">
              {links.map((link) => (
                <div key={link.id} className="flex items-center gap-2 group">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center gap-2 text-sm font-golos px-3 py-2 rounded-xl transition-all hover:bg-white/5 min-w-0"
                    style={{ background: "rgba(52,58,126,0.3)", border: "1px solid rgba(107,117,201,0.2)", color: step.color }}
                  >
                    <Icon name="Link" size={13} className="flex-shrink-0" />
                    <span className="truncate">{link.label}</span>
                    <Icon name="ExternalLink" size={12} className="opacity-40 flex-shrink-0 ml-auto" />
                  </a>
                  <button
                    className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                    onClick={() => handleDeleteLink(link.id)}
                  >
                    <Icon name="Trash2" size={13} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comments (session only) */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-2 text-white/40">
            Заметки ({comments.length})
          </div>
          {comments.length > 0 && (
            <div className="space-y-2 mb-3">
              {comments.map((c) => (
                <div key={c.id} className="rounded-xl p-3"
                  style={{ background: "rgba(52,58,126,0.3)", border: "1px solid rgba(107,117,201,0.2)" }}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-white/60">Вы</span>
                    <span className="text-xs text-white/25">{c.time}</span>
                  </div>
                  <p className="text-sm text-white/80 font-golos">{c.text}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 outline-none font-golos"
              style={{ background: "rgba(52,58,126,0.4)", border: "1px solid rgba(107,117,201,0.3)" }}
              placeholder="Добавить заметку..."
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

      </div>
    </div>
    </>
  );
};

export default StepDetail;