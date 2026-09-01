import React, { useState, useEffect } from "react";
import {
  Upload,
  Sparkles,
  Wand2,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  Eye,
  Trash2,
  Image as ImageIcon,
  Info,
  Maximize2,
} from "lucide-react";
import { DatasetCover } from "./DatasetCover";
import { ImageLightboxModal } from "./ImageLightboxModal";

export const PRESET_COVERS = [
  { label: "计算机视觉 / 目标检测", url: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=1200&auto=format&fit=crop&q=80" },
  { label: "自然语言 / 预训练大模型", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80" },
  { label: "智慧医疗 / 医学影像诊断", url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80" },
  { label: "工业互联网 / 声学振动检测", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80" },
  { label: "智慧城市 / 交通遥感感知", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80" },
  { label: "金融量化 / 多因子高频时序", url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80" },
];

export const MAX_COVER_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

interface CoverSelectorSectionProps {
  coverSourceType: "algorithm" | "preset" | "upload";
  onCoverSourceTypeChange: (type: "algorithm" | "preset" | "upload") => void;
  customCoverImage: string;
  onCustomCoverImageChange: (url: string) => void;
  title: string;
  techDomains: string[];
  themes: string[];
  format?: string;
  fileSize?: string;
}

export const CoverSelectorSection: React.FC<CoverSelectorSectionProps> = ({
  coverSourceType,
  onCoverSourceTypeChange,
  customCoverImage,
  onCustomCoverImageChange,
  title,
  techDomains,
  themes,
  format = "CSV",
  fileSize = "24.5 MB",
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");
  const [lightboxTitle, setLightboxTitle] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 图像规格元数据
  const [imageMeta, setImageMeta] = useState<{
    width?: number;
    height?: number;
    sizeStr?: string;
    format?: string;
  } | null>(null);

  // 当 customCoverImage 发生变化时探测其分辨率
  useEffect(() => {
    if (!customCoverImage) {
      setImageMeta(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = customCoverImage;
    img.onload = () => {
      setImageMeta((prev) => ({
        ...prev,
        width: img.naturalWidth,
        height: img.naturalHeight,
      }));
    };
  }, [customCoverImage]);

  // 处理文件上传校验
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // 1. 体积限制校验 (≤ 5MB)
    if (file.size > MAX_COVER_IMAGE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setUploadError(`文件体积为 ${sizeMB} MB，已超过 5MB 上限限制，请压缩图片后重试！`);
      return;
    }

    // 2. 格式校验
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("仅支持上传 JPG、PNG、WebP、SVG 或 GIF 格式的图片文件！");
      return;
    }

    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const img = new Image();
      img.src = result;
      img.onload = () => {
        // 3. 分辨率检查
        if (img.naturalWidth < 320 || img.naturalHeight < 180) {
          setUploadError(`图片分辨率过低 (${img.naturalWidth}×${img.naturalHeight})，推荐至少 640×360 px 以保证清晰度。`);
        }
        setImageMeta({
          width: img.naturalWidth,
          height: img.naturalHeight,
          sizeStr,
          format: file.type.replace("image/", "").toUpperCase(),
        });
        onCustomCoverImageChange(result);
        onCoverSourceTypeChange("upload");
      };
    };
    reader.readAsDataURL(file);
  };

  const handleOpenLightbox = (url: string, imgTitle: string) => {
    setLightboxImage(url);
    setLightboxTitle(imgTitle);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-4 space-y-3.5">
      {/* 顶部标题与恢复按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span>数据集封面展示</span>
          </label>
          <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 font-medium">
            选填 · 默认智能生成
          </span>
        </div>
        {coverSourceType !== "algorithm" && (
          <button
            type="button"
            onClick={() => {
              onCoverSourceTypeChange("algorithm");
              onCustomCoverImageChange("");
              setUploadError(null);
            }}
            className="text-[11px] text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer font-medium transition-colors"
          >
            <RotateCw className="w-3 h-3" />
            <span>恢复智能算法图元</span>
          </button>
        )}
      </div>

      {/* 封面来源切换 Tab 选项卡 */}
      <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => {
            onCoverSourceTypeChange("algorithm");
            onCustomCoverImageChange("");
            setUploadError(null);
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            coverSourceType === "algorithm"
              ? "bg-white text-indigo-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>智能算法图元 (默认)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onCoverSourceTypeChange("preset");
            if (!customCoverImage && PRESET_COVERS[0]) {
              onCustomCoverImageChange(PRESET_COVERS[0].url);
            }
            setUploadError(null);
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            coverSourceType === "preset"
              ? "bg-white text-indigo-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>预设精选图库</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onCoverSourceTypeChange("upload");
            setUploadError(null);
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            coverSourceType === "upload"
              ? "bg-white text-indigo-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-blue-600" />
          <span>本地上传 / 外链</span>
        </button>
      </div>

      {/* Tab 1: 自动算法图元说明与实时联动预览 */}
      {coverSourceType === "algorithm" && (
        <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center gap-3.5">
          <div className="w-28 h-18 rounded-lg overflow-hidden shrink-0 shadow-2xs border border-slate-200">
            <DatasetCover
              dataset={{
                id: "preview-temp",
                title: title || "数据集名称",
                techDomains: techDomains,
                techDomain: techDomains[0] || "未分类",
                themes: themes,
                theme: themes[0] || "通用领域",
                format: format,
                fileSize: fileSize,
                sizeBytes: 1024 * 1024 * 20,
                visibility: "public",
                permission: "download_and_mount",
                version: "V1.0",
                versionsList: [],
                author: { name: "当前用户", role: "teacher", org: "人工智能学院" },
                createdAt: "",
                updatedAt: "",
                mountCount: 0,
                downloadCount: 0,
                favoriteCount: 0,
                isFavorite: false,
                isMounted: false,
                mountPath: "",
                associatedCourses: [],
              }}
              size="thumb"
              className="w-full h-full"
              showBadges={false}
            />
          </div>
          <div className="space-y-1 text-slate-600">
            <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>智能根据任务类型与标题计算几何图元</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              无需手动配图，系统将根据选填的任务类型（如目标检测、时序预测、NLP等）自动生成符合学科特色的几何图元封面。
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: 预设精选图库候选选择 */}
      {coverSourceType === "preset" && (
        <div className="space-y-3 bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>选择预设封面 (点击选择，悬停可查看大图):</span>
            <span className="font-mono text-slate-400">均为 16:9 标准高清分辨率</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {PRESET_COVERS.map((preset, idx) => {
              const isSelected = customCoverImage === preset.url;
              return (
                <div
                  key={idx}
                  onClick={() => onCustomCoverImageChange(preset.url)}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all aspect-video shadow-2xs ${
                    isSelected
                      ? "border-indigo-600 shadow-md ring-2 ring-indigo-500/20"
                      : "border-slate-200 hover:border-indigo-300 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end justify-between p-1.5">
                    <span className="text-[9px] text-white font-medium truncate drop-shadow-xs">
                      {preset.label}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenLightbox(preset.url, preset.label);
                      }}
                      title="查看原图大图"
                      className="p-1 bg-black/60 hover:bg-indigo-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ZoomIn className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5 shadow-xs">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 当前选中的预设封面完整预览卡片 */}
          {customCoverImage && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* 紧凑 16:9 完整预览视口，object-contain 确保 100% 完整可见 */}
                <div className="w-24 h-14 bg-slate-900/5 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    src={customCoverImage}
                    alt="已选封面预览"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>已选定高清封面</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    比例: 16:9 标准比例 · 完整适配数据集卡片与详情页 Banner
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenLightbox(customCoverImage, "已选封面完整大图")}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-200 cursor-pointer shrink-0"
              >
                <Maximize2 className="w-3 h-3" />
                <span>点击查看完整大图</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: 本地上传 / 外链输入 (含严格限制与完整预览) */}
      {coverSourceType === "upload" && (
        <div className="space-y-3 bg-white p-3.5 rounded-xl border border-slate-200">
          {/* 上传要求指引条 */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 flex items-start gap-2 text-[11px] text-slate-600">
            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div>
                <strong>上传要求：</strong>最大支持 <strong>5MB</strong>，格式支持 <strong>JPG / PNG / WebP / SVG</strong>。
              </div>
              <div className="text-slate-400 text-[10px]">
                建议分辨率 <strong>1280×720</strong> 或 <strong>1920×1080 (16:9 标准比例)</strong>，预览区为完整全景视口，点击可放大查看。
              </div>
            </div>
          </div>

          {/* 错误提示 */}
          {uploadError && (
            <div className="bg-red-50 text-red-700 p-2.5 rounded-lg border border-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* 选择文件 & URL 输入 */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <label className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 cursor-pointer font-semibold text-xs shrink-0 transition-colors shadow-2xs">
              <Upload className="w-3.5 h-3.5" />
              <span>选择本地图片文件</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <span className="text-slate-400 text-xs shrink-0">或输入网络图片 URL:</span>

            <input
              type="url"
              value={customCoverImage}
              onChange={(e) => {
                onCustomCoverImageChange(e.target.value);
                setUploadError(null);
              }}
              placeholder="https://example.com/cover.jpg"
              className="w-full sm:flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono"
            />
          </div>

          {/* 已就绪封面紧凑无裁剪全景预览框 (完整展示、不拉伸、点击可查看原图) */}
          {customCoverImage && (
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>封面效果预览 (完整无裁切呈现):</span>
                {imageMeta?.width && imageMeta?.height && (
                  <span className="font-mono text-[11px] text-slate-500 font-normal">
                    📐 {imageMeta.width} × {imageMeta.height} px {imageMeta.sizeStr ? `· ${imageMeta.sizeStr}` : ""}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                {/* 紧凑且 100% 完整可见的预览视口 (object-contain) */}
                <div
                  onClick={() => handleOpenLightbox(customCoverImage, "自定义封面完整原图")}
                  className="group relative w-48 h-28 bg-slate-900 rounded-lg overflow-hidden border border-slate-300 shadow-2xs cursor-pointer shrink-0 flex items-center justify-center"
                >
                  <img
                    src={customCoverImage}
                    alt="封面完整预览"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                    <ZoomIn className="w-5 h-5" />
                    <span className="text-[10px] font-semibold">点击查看完整原图</span>
                  </div>
                </div>

                {/* 规格说明与操作按钮 */}
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>图片已就绪并完成规格解析</span>
                    </div>
                    <div className="text-[11px] text-slate-500 leading-relaxed">
                      已按原生比例进行无损容器内嵌展示，点击左侧缩略图可开启高清灯箱查看完整大图与缩放细节。
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenLightbox(customCoverImage, "自定义封面完整原图")}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 cursor-pointer shadow-2xs"
                    >
                      <Maximize2 className="w-3 h-3 text-blue-600" />
                      <span>查看完整大图</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onCustomCoverImageChange("");
                        setImageMeta(null);
                        setUploadError(null);
                      }}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-red-200 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>移除图片</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 完整大图灯箱弹窗 */}
      <ImageLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageUrl={lightboxImage}
        title={lightboxTitle}
        imageMeta={imageMeta || undefined}
      />
    </div>
  );
};
