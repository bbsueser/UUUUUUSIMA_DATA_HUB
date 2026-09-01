import React, { useState, useMemo } from "react";
import { Search, X, Check, Plus, Layers, Tag } from "lucide-react";

interface DatasetTagSelectorProps {
  id?: string;
  title: string;
  type: "techDomain" | "theme";
  allTags: string[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  allowCustomTags?: boolean;
}

export const DatasetTagSelector: React.FC<DatasetTagSelectorProps> = ({
  id,
  title,
  type,
  allTags,
  selectedTags,
  onChange,
  allowCustomTags = true,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const isTech = type === "techDomain";

  // 色彩配置映射 (任务类型: 科技蓝体系; 应用领域: 商务靛蓝体系)
  const themeClasses = {
    icon: isTech ? "text-blue-600" : "text-indigo-600",
    badge: isTech ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-indigo-50 text-indigo-700 border-indigo-200",
    selectedChip: isTech
      ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
      : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
    tagActive: isTech
      ? "bg-blue-600 text-white shadow-2xs font-semibold hover:bg-blue-700"
      : "bg-indigo-600 text-white shadow-2xs font-semibold hover:bg-indigo-700",
    focusBorder: isTech ? "focus:border-blue-500" : "focus:border-indigo-500",
    linkText: isTech ? "text-blue-600 hover:text-blue-700" : "text-indigo-600 hover:text-indigo-700",
    addBtn: isTech ? "bg-blue-600 hover:bg-blue-700" : "bg-indigo-600 hover:bg-indigo-700",
  };

  // 动态合并所有可用标签 (包含预设标签与用户动态新增的自定义标签)
  const availableAllTags = useMemo(() => {
    const set = new Set([...allTags, ...selectedTags]);
    return Array.from(set);
  }, [allTags, selectedTags]);

  // 根据当前检索获取可视标签
  const displayedTags = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return availableAllTags;
    }
    return availableAllTags.filter((tag) => tag.toLowerCase().includes(query));
  }, [availableAllTags, searchQuery]);

  // 是否可添加为新自定义标签
  const canAddCustomTag = useMemo(() => {
    if (!allowCustomTags) return false;
    const query = searchQuery.trim();
    if (!query) return false;
    return !availableAllTags.some((t) => t.toLowerCase() === query.toLowerCase());
  }, [allowCustomTags, searchQuery, availableAllTags]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const handleAddCustom = () => {
    const newTag = searchQuery.trim();
    if (newTag && !selectedTags.includes(newTag)) {
      onChange([...selectedTags, newTag]);
      setSearchQuery("");
    }
  };

  const removeTag = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedTags.filter((t) => t !== tag));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div id={id} className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 space-y-2.5 transition-all">
      {/* 1. 顶栏：标题、类型、选填标记、已选计数与清空按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
            {isTech ? (
              <Tag className={`w-3.5 h-3.5 ${themeClasses.icon}`} />
            ) : (
              <Layers className={`w-3.5 h-3.5 ${themeClasses.icon}`} />
            )}
            <span>{title}</span>
          </label>
          <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 font-medium">
            选填 · 多选
          </span>
        </div>

        <div className="flex items-center gap-2">
          {selectedTags.length > 0 ? (
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${themeClasses.badge}`}>
                已选 {selectedTags.length} 项
              </span>
              <button
                type="button"
                onClick={clearAll}
                className="text-[10px] text-slate-400 hover:text-red-500 transition-colors"
                title="清空当前维度已选标签"
              >
                清空
              </button>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400">
              共 {availableAllTags.length} 项
            </span>
          )}
        </div>
      </div>

      {/* 2. 已选标签快速预览与移除栏 (Selected Chips Area) */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white rounded-lg border border-slate-200/90 shadow-2xs max-h-20 overflow-y-auto">
          <span className="text-[11px] text-slate-400 font-medium mr-0.5">已选标签:</span>
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border transition-colors ${themeClasses.selectedChip}`}
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={(e) => removeTag(tag, e)}
                className="hover:text-red-500 rounded-full transition-colors"
                title={`移除 ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 3. 搜索与快捷过滤条 */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canAddCustomTag) {
                e.preventDefault();
                handleAddCustom();
              }
            }}
            placeholder={`搜索${title}，按回车可快速添加...`}
            className={`w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none ${themeClasses.focusBorder} transition-all`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {canAddCustomTag && (
          <button
            type="button"
            onClick={handleAddCustom}
            className={`text-xs px-2.5 py-1.5 rounded-lg text-white font-medium flex items-center gap-1 shadow-2xs transition-all flex-shrink-0 ${themeClasses.addBtn}`}
          >
            <Plus className="w-3 h-3" />
            <span>添加 "{searchQuery.trim()}"</span>
          </button>
        )}
      </div>

      {/* 4. 单栏竖向滚动标签池 (Single Column with clean vertical scrollbar) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-2.5 max-h-36 overflow-y-auto">
        {displayedTags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {displayedTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                    isSelected
                      ? themeClasses.tagActive
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                  }`}
                >
                  <span>{tag}</span>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="py-4 text-xs text-slate-400 w-full text-center flex flex-col items-center justify-center gap-1">
            <span>未找到与 "{searchQuery}" 相关的标签</span>
            {canAddCustomTag && (
              <button
                type="button"
                onClick={handleAddCustom}
                className={`underline font-medium text-xs ${themeClasses.linkText}`}
              >
                点击添加为新标签
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
