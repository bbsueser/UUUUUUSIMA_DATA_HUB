import React, { useMemo } from "react";
import {
  FileSpreadsheet,
  FileCode,
  FileText,
  Image as ImageIcon,
  Layers,
  Database,
  TrendingUp,
  Cpu,
  Eye,
  Activity,
  Scan,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react";
import { DatasetItem } from "../data/mockData";

interface DatasetCoverProps {
  dataset: DatasetItem;
  size?: "card" | "thumb" | "banner" | "mini";
  showBadges?: boolean;
  className?: string;
}

// 确定性色彩调色板 (基于字符串哈希，保证每个数据集拥有固定、美观的科技渐变底色)
const PALETTES = [
  {
    name: "Cyber Ocean",
    from: "from-blue-600",
    via: "via-indigo-700",
    to: "to-slate-900",
    accent: "text-cyan-300",
    border: "border-blue-400/20",
    glow: "rgba(56, 189, 248, 0.25)",
    tagBg: "bg-blue-950/70 text-cyan-200 border-cyan-500/30",
  },
  {
    name: "Aurora Violet",
    from: "from-indigo-600",
    via: "via-purple-700",
    to: "to-slate-950",
    accent: "text-purple-300",
    border: "border-purple-400/20",
    glow: "rgba(192, 132, 252, 0.25)",
    tagBg: "bg-purple-950/70 text-purple-200 border-purple-500/30",
  },
  {
    name: "Emerald Matrix",
    from: "from-emerald-600",
    via: "via-teal-800",
    to: "to-slate-900",
    accent: "text-emerald-300",
    border: "border-emerald-400/20",
    glow: "rgba(52, 211, 153, 0.25)",
    tagBg: "bg-emerald-950/70 text-emerald-200 border-emerald-500/30",
  },
  {
    name: "Deep Space Amber",
    from: "from-amber-600",
    via: "via-rose-800",
    to: "to-slate-950",
    accent: "text-amber-300",
    border: "border-amber-400/20",
    glow: "rgba(251, 191, 36, 0.25)",
    tagBg: "bg-amber-950/70 text-amber-200 border-amber-500/30",
  },
  {
    name: "Slate Modernist",
    from: "from-sky-700",
    via: "via-slate-800",
    to: "to-slate-950",
    accent: "text-sky-300",
    border: "border-sky-400/20",
    glow: "rgba(125, 211, 252, 0.25)",
    tagBg: "bg-slate-900/80 text-sky-200 border-sky-500/30",
  },
];

// 计算字符串 Hash
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const DatasetCover: React.FC<DatasetCoverProps> = ({
  dataset,
  size = "card",
  showBadges = true,
  className = "",
}) => {
  const hash = useMemo(() => hashCode(dataset.id + dataset.title), [dataset.id, dataset.title]);
  const palette = PALETTES[hash % PALETTES.length];

  // 智能推断数据模态 (Modality Type)
  const modality = useMemo(() => {
    const format = dataset.format;
    const tech = (dataset.techDomains?.join(" ") || dataset.techDomain || "").toLowerCase();
    const title = dataset.title.toLowerCase();

    if (
      format === "Images" ||
      tech.includes("图像") ||
      tech.includes("目标检测") ||
      tech.includes("分割") ||
      tech.includes("姿态") ||
      title.includes("影像") ||
      title.includes("光片") ||
      title.includes("街景")
    ) {
      return "vision";
    }

    if (
      tech.includes("文本") ||
      tech.includes("语料") ||
      tech.includes("指令") ||
      tech.includes("问答") ||
      tech.includes("nlp") ||
      tech.includes("大模型") ||
      format === "TXT"
    ) {
      return "nlp";
    }

    if (
      tech.includes("时序") ||
      tech.includes("时间序列") ||
      tech.includes("行情") ||
      tech.includes("量化") ||
      tech.includes("预测") ||
      tech.includes("电网")
    ) {
      return "timeseries";
    }

    if (tech.includes("振动") || tech.includes("声") || tech.includes("音频")) {
      return "signal";
    }

    return "tabular";
  }, [dataset]);

  // 如果数据集自带用户手动上传的自定义封面图，优先直接展示
  const hasCustomCover = !!dataset.customCoverImage;

  // 如果数据集自带实际样本图片且属于视觉类数据集，则展示多图画廊胶片蒙版
  const hasImageSamples = !hasCustomCover && dataset.previewImages && dataset.previewImages.length > 0;

  // 尺寸样式映射
  const containerHeight =
    size === "thumb"
      ? "w-14 h-14 rounded-xl shrink-0"
      : size === "mini"
      ? "w-10 h-10 rounded-lg shrink-0"
      : size === "banner"
      ? "w-full h-44 sm:h-52 rounded-2xl"
      : "w-full h-32 sm:h-36 rounded-xl"; // card default

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${palette.from} ${palette.via} ${palette.to} flex items-center justify-center select-none ${containerHeight} ${className}`}
    >
      {/* 优先图层：用户自定义封面图片 */}
      {hasCustomCover ? (
        <div className="absolute inset-0 w-full h-full">
          <img
            src={dataset.customCoverImage}
            alt={dataset.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-90 contrast-105"
          />
          {/* 覆盖一层微暗渐变确保上方文字与徽章清晰可见 */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-black/30" />
        </div>
      ) : (
        /* 背景纹理层：网格、射线与算法几何光影 */
        <div className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`grid-${dataset.id}-${size}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-white/40" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${dataset.id}-${size})`} />
          </svg>
        </div>
      )}

      {/* 视觉样本画廊胶片（针对有真实图片的医学/自动驾驶数据集） */}
      {hasImageSamples && size !== "thumb" && size !== "mini" ? (
        <div className="absolute inset-0 flex items-center justify-center gap-1.5 p-2 opacity-35 hover:opacity-50 transition-opacity mix-blend-luminosity">
          {dataset.previewImages!.slice(0, 3).map((img, i) => (
            <div
              key={i}
              className="h-full flex-1 rounded-lg overflow-hidden border border-white/20 shadow-inner bg-slate-900/60"
            >
              <img
                src={img.url}
                alt={img.name || `Sample ${i + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter contrast-125 brightness-90"
              />
            </div>
          ))}
          {/* 暗角与微光过渡渐变 */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
        </div>
      ) : (
        /* 智能算法几何抽象图元 (Procedural Generative Geometric SVG) */
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          {modality === "vision" && (
            <div className="w-full h-full flex items-center justify-around px-6">
              <div className="w-20 h-16 border-2 border-dashed border-cyan-300/60 rounded-md relative flex items-center justify-center">
                <Scan className="w-8 h-8 text-cyan-300 animate-pulse" />
                <span className="absolute -top-2.5 -left-1 bg-cyan-500/80 text-[9px] font-mono text-white px-1 rounded">
                  DET: 0.98
                </span>
              </div>
              <div className="w-12 h-12 rounded-full border border-cyan-400/40 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-cyan-400/50" />
              </div>
            </div>
          )}

          {modality === "nlp" && (
            <div className="w-full h-full flex flex-col justify-center gap-2 px-8">
              <div className="h-2 w-3/4 bg-purple-300/30 rounded-full flex gap-1 items-center px-1">
                <div className="h-1 w-4 bg-purple-300/80 rounded-full" />
                <div className="h-1 w-6 bg-purple-300/60 rounded-full" />
                <div className="h-1 w-3 bg-purple-300/80 rounded-full" />
              </div>
              <div className="h-2 w-full bg-purple-300/20 rounded-full flex gap-1 items-center px-1">
                <div className="h-1 w-8 bg-purple-300/70 rounded-full" />
                <div className="h-1 w-12 bg-purple-300/50 rounded-full" />
              </div>
              <div className="h-2 w-1/2 bg-purple-300/30 rounded-full" />
            </div>
          )}

          {modality === "timeseries" && (
            <div className="w-full h-full flex items-end justify-between px-6 pb-4">
              <svg className="w-full h-16" viewBox="0 0 100 40">
                <path
                  d="M0 30 Q 15 5, 30 20 T 60 10 T 85 25 T 100 8"
                  fill="none"
                  stroke="rgba(103, 232, 249, 0.7)"
                  strokeWidth="2.5"
                />
                <path
                  d="M0 30 Q 15 5, 30 20 T 60 10 T 85 25 T 100 8 L100 40 L0 40 Z"
                  fill="rgba(103, 232, 249, 0.15)"
                />
              </svg>
            </div>
          )}

          {modality === "signal" && (
            <div className="w-full h-full flex items-center justify-center px-4">
              <Activity className="w-24 h-24 text-amber-300/40" />
            </div>
          )}

          {modality === "tabular" && (
            <div className="w-full h-full grid grid-cols-4 gap-1 p-4 opacity-30">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-4 bg-white/30 rounded-xs border border-white/20" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 中心核心模态 Logo (仅在缩略图或卡片中强调) */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-2">
        {size === "thumb" || size === "mini" ? (
          <div className="p-2 rounded-lg bg-black/30 backdrop-blur-xs border border-white/20 text-white shadow-md">
            {modality === "vision" ? (
              <Eye className="w-5 h-5 text-cyan-300" />
            ) : modality === "nlp" ? (
              <MessageSquare className="w-5 h-5 text-purple-300" />
            ) : modality === "timeseries" ? (
              <TrendingUp className="w-5 h-5 text-sky-300" />
            ) : (
              <Database className="w-5 h-5 text-emerald-300" />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-white shadow-lg">
            {modality === "vision" ? (
              <Eye className="w-4 h-4 text-cyan-300" />
            ) : modality === "nlp" ? (
              <Sparkles className="w-4 h-4 text-purple-300" />
            ) : modality === "timeseries" ? (
              <TrendingUp className="w-4 h-4 text-sky-300" />
            ) : (
              <Database className="w-4 h-4 text-emerald-300" />
            )}
            <span className="text-xs font-semibold tracking-wide text-slate-100">
              {dataset.techDomain || dataset.techDomains?.[0] || "AI 数据集"}
            </span>
          </div>
        )}
      </div>

      {/* 卡片顶部与底部徽章层 */}
      {showBadges && (size === "card" || size === "banner") && (
        <>
          {/* 左上角格式胶囊 */}
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
            <span className="bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20 shadow-xs flex items-center gap-1">
              {dataset.format === "CSV" || dataset.format === "XLSX" ? (
                <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
              ) : dataset.format === "JSON" ? (
                <FileCode className="w-3 h-3 text-amber-400" />
              ) : dataset.format === "Images" ? (
                <ImageIcon className="w-3 h-3 text-cyan-400" />
              ) : (
                <Layers className="w-3 h-3 text-indigo-400" />
              )}
              {dataset.format}
            </span>
            <span className="bg-black/50 backdrop-blur-md text-slate-300 font-mono text-[10px] px-1.5 py-0.5 rounded-md border border-white/10">
              {dataset.fileSize}
            </span>
          </div>

          {/* 右上角样本量/规格徽章 (通用表达：条/样本) */}
          <div className="absolute top-2.5 right-2.5 z-10">
            {dataset.rowCount ? (
              <span className="bg-white/20 backdrop-blur-md text-white font-mono text-[10px] font-medium px-2 py-0.5 rounded-md border border-white/25 shadow-xs">
                {dataset.rowCount >= 10000 ? `${(dataset.rowCount / 10000).toFixed(1)}w 条` : `${dataset.rowCount} 条`}
              </span>
            ) : (
              <span className="bg-white/20 backdrop-blur-md text-white font-mono text-[10px] font-medium px-2 py-0.5 rounded-md border border-white/25 shadow-xs">
                {dataset.version}
              </span>
            )}
          </div>

          {/* 右下角封面来源提示微标 */}
          <div className="absolute bottom-2 right-2 z-10 pointer-events-none opacity-80">
            {hasCustomCover ? (
              <span className="text-[9px] text-emerald-200 font-medium flex items-center gap-0.5 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs border border-emerald-500/30">
                <Sparkles className="w-2.5 h-2.5 text-emerald-300" />
                自定义封面
              </span>
            ) : (
              <span className="text-[9px] text-white/80 font-mono flex items-center gap-0.5 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-xs border border-white/10">
                <Zap className="w-2.5 h-2.5 text-cyan-300" />
                智能算法封面
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DatasetCover;
