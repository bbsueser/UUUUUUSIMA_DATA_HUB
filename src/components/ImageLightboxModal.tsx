import React from "react";
import { X, ZoomIn, ZoomOut, Maximize2, ExternalLink, Image as ImageIcon, CheckCircle2 } from "lucide-react";

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  imageMeta?: {
    width?: number;
    height?: number;
    sizeStr?: string;
    format?: string;
  };
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title = "封面完整大图预览",
  imageMeta,
}) => {
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    if (isOpen) {
      setScale(1);
    }
  }, [isOpen, imageUrl]);

  if (!isOpen || !imageUrl) return null;

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setScale(1);

  const aspectRatioStr =
    imageMeta?.width && imageMeta?.height
      ? `${(imageMeta.width / imageMeta.height).toFixed(2)}:1 (${
          Math.abs(imageMeta.width / imageMeta.height - 16 / 9) < 0.1 ? "标准 16:9" : "自定义比例"
        })`
      : undefined;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶栏控制条 */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 text-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 bg-indigo-600/30 text-indigo-400 rounded-lg">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold truncate text-slate-100">{title}</h3>
              {imageMeta && (
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  {imageMeta.width && imageMeta.height && (
                    <span>
                      📐 分辨率: {imageMeta.width} × {imageMeta.height} px
                    </span>
                  )}
                  {aspectRatioStr && <span>· 比例: {aspectRatioStr}</span>}
                  {imageMeta.sizeStr && <span>· 体积: {imageMeta.sizeStr}</span>}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* 缩放控制 */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                type="button"
                onClick={handleZoomOut}
                title="缩小"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                title="重置缩放"
                className="px-2 text-[11px] font-mono text-slate-300 hover:text-white"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                title="放大"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 原图新标签页打开 */}
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              title="在新窗口打开原图"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* 关闭按钮 */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 图像主体视口（完整展示、不裁切） */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] min-h-[320px] max-h-[70vh]">
          <img
            src={imageUrl}
            alt={title}
            referrerPolicy="no-referrer"
            style={{ transform: `scale(${scale})`, transition: "transform 0.15s ease-out" }}
            className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-2xl origin-center"
          />
        </div>

        {/* 底栏规格指南提示 */}
        <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>完整原图无损呈现，当前画面无任何拉伸与裁剪</span>
          </div>
          <span>推荐上传规格: 16:9 比例 (1280×720 或 1920×1080), 体积 ≤ 5MB</span>
        </div>
      </div>
    </div>
  );
};
