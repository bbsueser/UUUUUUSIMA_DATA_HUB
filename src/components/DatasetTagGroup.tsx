import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Cpu, Compass, ChevronRight, Filter, Sparkles, X } from "lucide-react";

interface DatasetTagGroupProps {
  techDomains?: string[];
  techDomain?: string;
  themes?: string[];
  theme?: string;
  maxVisible?: number;
  onTagClick?: (type: "tech" | "theme", tag: string) => void;
  size?: "sm" | "md" | "lg";
  mode?: "cluster" | "pills" | "table";
  className?: string;
}

export const DatasetTagGroup: React.FC<DatasetTagGroupProps> = ({
  techDomains,
  techDomain,
  themes,
  theme,
  maxVisible = 2,
  onTagClick,
  size = "md",
  mode = "cluster",
  className = "",
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverCoords, setPopoverCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 计算并定位 Popover
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const popoverWidth = 320; // 预计宽度
      let left = rect.left;
      // 避免超出屏幕右侧
      if (left + popoverWidth > window.innerWidth - 16) {
        left = window.innerWidth - popoverWidth - 16;
      }
      if (left < 16) left = 16;

      // 向上弹出；如果上方空间不足则向下弹出
      const popoverHeight = 240;
      let top = rect.top - popoverHeight - 8;
      if (top < 16) {
        top = rect.bottom + 8;
      }

      setPopoverCoords({ top, left });
    }
  };

  const handleTogglePopover = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPopoverOpen) {
      updatePosition();
      setIsPopoverOpen(true);
    } else {
      setIsPopoverOpen(false);
    }
  };

  // 点击外部关闭 Popover 与滚动更新
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    };
    const handleScrollOrResize = () => {
      if (isPopoverOpen) {
        updatePosition();
      }
    };
    if (isPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isPopoverOpen]);
  const allTechs: string[] = Array.from(
    new Set(
      [
        ...(techDomains || []),
        ...(techDomain && techDomain !== "未分类" ? [techDomain] : []),
      ].filter(Boolean)
    )
  );

  // 规范化所有的应用领域 (业务场景)
  const allThemes: string[] = Array.from(
    new Set(
      [
        ...(themes || []),
        ...(theme && theme !== "通用领域" ? [theme] : []),
      ].filter(Boolean)
    )
  );

  const totalCount = allTechs.length + allThemes.length;
  const isOverflowing = totalCount > maxVisible;

  // 点击外部关闭 Popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    };
    if (isPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopoverOpen]);

  const handleTagClick = (e: React.MouseEvent, type: "tech" | "theme", tag: string) => {
    e.stopPropagation();
    if (onTagClick) {
      onTagClick(type, tag);
    }
  };

  if (totalCount === 0) {
    return (
      <span className="text-[11px] text-slate-400 font-mono">通用数据 / 暂无标签</span>
    );
  }

  // 1. 表格紧凑视图 (Table View)
  if (mode === "table") {
    return (
      <div className={`flex flex-wrap items-center gap-1 relative ${className}`}>
        {allTechs.slice(0, 1).map((t) => (
          <span
            key={t}
            onClick={(e) => handleTagClick(e, "tech", t)}
            className="bg-blue-50 text-blue-700 text-[11px] px-1.5 py-0.5 rounded font-medium truncate max-w-[90px] hover:bg-blue-100 transition-colors"
            title={`技术任务: ${t}`}
          >
            {t}
          </span>
        ))}
        {allThemes.slice(0, 1).map((th) => (
          <span
            key={th}
            onClick={(e) => handleTagClick(e, "theme", th)}
            className="bg-emerald-50 text-emerald-700 text-[11px] px-1.5 py-0.5 rounded font-medium truncate max-w-[90px] hover:bg-emerald-100 transition-colors"
            title={`应用领域: ${th}`}
          >
            {th}
          </span>
        ))}
        {isOverflowing && (
          <div className="relative inline-block">
            <button
              ref={buttonRef}
              type="button"
              onClick={handleTogglePopover}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded transition-all cursor-pointer"
            >
              +{totalCount - 2}
            </button>
            {renderPopover()}
          </div>
        )}
      </div>
    );
  }

  // 2. 详情页完整展开平铺模式 (Pills Mode)
  if (mode === "pills") {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {allTechs.map((t) => (
          <span
            key={t}
            onClick={(e) => handleTagClick(e, "tech", t)}
            className="bg-blue-50/90 text-blue-700 border border-blue-200/80 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <Cpu className="w-3 h-3 text-blue-500" />
            <span className="text-blue-400 text-[10px]">任务:</span>
            <span>{t}</span>
          </span>
        ))}
        {allThemes.map((th) => (
          <span
            key={th}
            onClick={(e) => handleTagClick(e, "theme", th)}
            className="bg-emerald-50/90 text-emerald-700 border border-emerald-200/80 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <Compass className="w-3 h-3 text-emerald-500" />
            <span className="text-emerald-400 text-[10px]">领域:</span>
            <span>{th}</span>
          </span>
        ))}
      </div>
    );
  }

  // 3. 卡片聚合胶囊模式 (Cluster Mode - 专为卡片空间与多标签优化)
  // 分别计算技术与应用可展示的标签
  const visibleTechs = allTechs.slice(0, maxVisible === 1 ? 1 : 2);
  const remainingSlots = Math.max(0, maxVisible - visibleTechs.length);
  const visibleThemes = allThemes.slice(0, remainingSlots > 0 ? remainingSlots : 1);

  const shownCount = visibleTechs.length + visibleThemes.length;
  const hiddenCount = totalCount - shownCount;

  function renderPopover() {
    if (!isPopoverOpen || typeof document === "undefined") return null;

    const content = (
      <div
        ref={popoverRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: `${popoverCoords.top}px`,
          left: `${popoverCoords.left}px`,
          zIndex: 9999,
        }}
        className="w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 p-4 space-y-3 text-left animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>全量标签列表 ({totalCount})</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPopoverOpen(false);
            }}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 任务类型 / 技术领域 */}
        {allTechs.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-blue-700 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-blue-500" />
              <span>任务类型 / 技术领域 ({allTechs.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
              {allTechs.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={(e) => {
                    handleTagClick(e, "tech", t);
                    setIsPopoverOpen(false);
                  }}
                  className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>{t}</span>
                  {onTagClick && <Filter className="w-2.5 h-2.5 text-blue-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 应用领域 / 行业场景 */}
        {allThemes.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <Compass className="w-3 h-3 text-emerald-500" />
              <span>应用场景 / 行业领域 ({allThemes.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
              {allThemes.map((th) => (
                <button
                  key={th}
                  type="button"
                  onClick={(e) => {
                    handleTagClick(e, "theme", th);
                    setIsPopoverOpen(false);
                  }}
                  className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>{th}</span>
                  {onTagClick && <Filter className="w-2.5 h-2.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {onTagClick && (
          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
            <span>💡 提示：点击任意标签可直接按此过滤大厅</span>
          </div>
        )}
      </div>
    );

    return createPortal(content, document.body);
  }

  return (
    <div className={`flex flex-wrap items-center gap-1.5 relative ${className}`}>
      {/* 聚合任务类型胶囊：前缀只出现一次，中间用优雅中圆点隔开 */}
      {visibleTechs.length > 0 && (
        <div className="bg-blue-50/90 hover:bg-blue-100/90 text-blue-700 text-[11px] font-medium px-2 py-0.5 rounded-md border border-blue-200/70 flex items-center gap-1 max-w-[200px] truncate transition-colors">
          <Cpu className="w-3 h-3 text-blue-500 shrink-0" />
          <span className="text-blue-500 font-semibold text-[10px] shrink-0">任务:</span>
          <span className="truncate">
            {visibleTechs.join(" · ")}
          </span>
        </div>
      )}

      {/* 聚合应用领域胶囊：前缀只出现一次，中间用优雅中圆点隔开 */}
      {visibleThemes.length > 0 && (
        <div className="bg-emerald-50/90 hover:bg-emerald-100/90 text-emerald-700 text-[11px] font-medium px-2 py-0.5 rounded-md border border-emerald-200/70 flex items-center gap-1 max-w-[180px] truncate transition-colors">
          <Compass className="w-3 h-3 text-emerald-500 shrink-0" />
          <span className="text-emerald-500 font-semibold text-[10px] shrink-0">领域:</span>
          <span className="truncate">
            {visibleThemes.join(" · ")}
          </span>
        </div>
      )}

      {/* 超出标签折叠交互徽章 */}
      {hiddenCount > 0 && (
        <div className="relative inline-block">
          <button
            ref={buttonRef}
            type="button"
            onClick={handleTogglePopover}
            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md border transition-all cursor-pointer flex items-center gap-0.5 ${
              isPopoverOpen
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border-slate-200 hover:border-indigo-200"
            }`}
            title="点击查看所有任务与应用标签"
          >
            <span>+{hiddenCount}</span>
            <span className="hidden sm:inline font-sans text-[10px] font-normal">标签</span>
          </button>
          {renderPopover()}
        </div>
      )}
    </div>
  );
};

export default DatasetTagGroup;
