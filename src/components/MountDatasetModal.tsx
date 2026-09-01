import React, { useState, useMemo } from "react";
import {
  Search,
  X,
  Plus,
  Globe,
  Lock,
  Heart,
  Database,
  CheckCircle2,
  Copy,
  FolderOpen,
  ChevronRight,
  Sparkles,
  Layers,
  LayoutGrid,
  List,
} from "lucide-react";
import { DatasetItem, BUSINESS_SCENARIOS, extractDatasetSummary } from "../data/mockData";

interface MountDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasets: DatasetItem[];
  currentUserName: string;
  currentUserRole: string;
  onToggleMount: (id: string) => { success: boolean; message: string; isMounted: boolean };
  onSuccessToast?: (msg: string) => void;
}

export const MountDatasetModal: React.FC<MountDatasetModalProps> = ({
  isOpen,
  onClose,
  datasets,
  currentUserName,
  currentUserRole,
  onToggleMount,
  onSuccessToast,
}) => {
  // 1. 范围 Tab: "all" (全部公开) | "my_uploaded" (我的数据/个人) | "favorites" (我的收藏)
  const [activeTab, setActiveTab] = useState<"all" | "my_uploaded" | "favorites">("all");

  // 2. 搜索关键词
  const [searchKeyword, setSearchKeyword] = useState("");

  // 3. 行业业务场景分类筛选 (与数据大厅 BUSINESS_SCENARIOS 完全对齐)
  const [selectedScenario, setSelectedScenario] = useState<string>("all");

  // 4. 展示密度视图: "compact-grid" (3~4列高密度网格) vs "dense-list" (高密度单行表格)
  const [viewDensity, setViewDensity] = useState<"grid" | "list">("grid");

  // 5. 快速预览选中的数据集
  const [previewDataset, setPreviewDataset] = useState<DatasetItem | null>(null);

  // 过滤后的数据集列表
  const filteredDatasets = useMemo(() => {
    return datasets
      .filter((item) => {
        // Tab 范围过滤
        if (activeTab === "my_uploaded") {
          const isPersonal = item.visibility === "private";
          const isMyUpload =
            item.author?.name === currentUserName ||
            item.author?.role === currentUserRole ||
            currentUserRole === "admin";
          if (!isPersonal || !isMyUpload) return false;
        } else if (activeTab === "favorites") {
          if (!item.isFavorite) return false;
        } else {
          // 全部公开数据 (排除个人私有)
          if (item.visibility === "private") return false;
        }

        // 行业场景过滤 (与数据大厅一致：匹配 theme 或 themes 数组)
        if (selectedScenario !== "all") {
          const matchTheme =
            item.theme === selectedScenario ||
            (item.themes && item.themes.includes(selectedScenario)) ||
            (item as any).businessScenario === selectedScenario;
          if (!matchTheme) return false;
        }

        // 搜索关键词 (匹配标题、描述、格式、作者、行业场景)
        if (searchKeyword.trim()) {
          const q = searchKeyword.toLowerCase();
          const matchTitle = item.title?.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          const matchTheme =
            item.theme?.toLowerCase().includes(q) ||
            (item.themes && item.themes.some((t) => t.toLowerCase().includes(q)));
          const matchFormat = item.format?.toLowerCase().includes(q);
          const matchAuthor = item.author?.name?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchTheme && !matchFormat && !matchAuthor) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // 已挂载的置前展示，其余按挂载热度降序
        if (a.isMounted && !b.isMounted) return -1;
        if (!a.isMounted && b.isMounted) return 1;
        return (b.mountCount || 0) - (a.mountCount || 0);
      });
  }, [datasets, activeTab, selectedScenario, searchKeyword, currentUserName, currentUserRole]);

  // 计数统计
  const counts = useMemo(() => {
    const allCount = datasets.filter((d) => d.visibility !== "private").length;
    const myCount = datasets.filter(
      (d) =>
        d.visibility === "private" &&
        (d.author?.name === currentUserName ||
          d.author?.role === currentUserRole ||
          currentUserRole === "admin")
    ).length;
    const favCount = datasets.filter((d) => d.isFavorite).length;
    const mountedCount = datasets.filter((d) => d.isMounted).length;
    return { allCount, myCount, favCount, mountedCount };
  }, [datasets, currentUserName, currentUserRole]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[88vh] max-h-[820px] flex flex-col overflow-hidden border border-slate-200 text-slate-800">
        {/* 顶部 Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">挂载数据集到当前实验环境</h2>
                <span className="text-[11px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                  当前环境已挂载 {counts.mountedCount} 个
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                支持检索全平台公开、个人及收藏数据集，挂载后只读映射至实验环境目录
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 筛选与搜索工具条 */}
        <div className="px-5 py-2.5 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          {/* 左侧范围 Tab 切换 */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                setActiveTab("all");
                setPreviewDataset(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>全部公开数据</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === "all" ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600"
                }`}
              >
                {counts.allCount}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("my_uploaded");
                setPreviewDataset(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "my_uploaded"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>我的数据集</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === "my_uploaded"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {counts.myCount}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("favorites");
                setPreviewDataset(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "favorites"
                  ? "bg-white text-rose-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  activeTab === "favorites" ? "fill-rose-500 text-rose-500" : ""
                }`}
              />
              <span>我的收藏</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === "favorites"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {counts.favCount}
              </span>
            </button>
          </div>

          {/* 右侧：行业场景筛选、搜索框、视图模式切换 */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            {/* 行业场景标签下拉选择器 (完全使用 BUSINESS_SCENARIOS) */}
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer max-w-[150px]"
            >
              <option value="all">全部行业场景 ({BUSINESS_SCENARIOS.length})</option>
              {BUSINESS_SCENARIOS.map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
                </option>
              ))}
            </select>

            {/* 搜索框 */}
            <div className="relative w-44 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索名称 / 行业标签 / 格式..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-8 pr-7 py-1.5 text-xs rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 视图密度切换: 网格 vs 列表 */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewDensity("grid")}
                title="紧凑多列网格"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewDensity === "grid"
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewDensity("list")}
                title="高密度表格列表"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewDensity === "list"
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 中间主体区域 (左右分栏或紧凑多列展示) */}
        <div className="flex-1 flex overflow-hidden bg-slate-50/50">
          {/* 数据集内容列表 */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-2 ${
              previewDataset ? "border-r border-slate-200" : ""
            }`}
          >
            {filteredDatasets.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Database className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-700">未找到符合条件的数据集</p>
                  <p className="text-xs text-slate-400">
                    可尝试切换Tab或清空搜索关键词/行业场景分类
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchKeyword("");
                    setSelectedScenario("all");
                    setActiveTab("all");
                  }}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  重置筛选条件
                </button>
              </div>
            ) : viewDensity === "grid" ? (
              /* 紧凑网格视图 (单行展示 3~4 个卡片，信息清晰精练) */
              <div
                className={`grid gap-2.5 ${
                  previewDataset
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                }`}
              >
                {filteredDatasets.map((ds) => {
                  const isSelected = previewDataset?.id === ds.id;
                  const industryTag = ds.theme || ds.businessScenario || "通用行业";
                  return (
                    <div
                      key={ds.id}
                      onClick={() => setPreviewDataset(ds)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                        ds.isMounted
                          ? "bg-emerald-50/50 border-emerald-300/90 shadow-2xs hover:border-emerald-400"
                          : isSelected
                          ? "bg-blue-50/50 border-blue-400 shadow-2xs ring-1 ring-blue-400/20"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs"
                      }`}
                    >
                      <div className="space-y-1.5">
                        {/* 顶栏：行业标签 + 属性 */}
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">
                              {industryTag}
                            </span>
                            {ds.visibility === "private" && (
                              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200/60 flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5" />
                                <span>个人</span>
                              </span>
                            )}
                          </div>

                          {ds.isMounted ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>已挂载</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                              {ds.fileSize}
                            </span>
                          )}
                        </div>

                        {/* 数据集标题与简要描述 */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600">
                            {ds.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                            {ds.description || "暂无描述信息"}
                          </p>
                        </div>
                      </div>

                      {/* 底部信息与操作按钮 */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-[10px] text-slate-400">
                          {ds.isMounted ? ds.fileSize : `挂载 ${ds.mountCount || 0} 次`}
                        </span>

                        <div onClick={(e) => e.stopPropagation()}>
                          {ds.isMounted ? (
                            <button
                              onClick={() => {
                                const res = onToggleMount(ds.id);
                                onSuccessToast?.(res.message);
                              }}
                              className="px-2.5 py-0.5 rounded text-[11px] font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                            >
                              卸载
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const res = onToggleMount(ds.id);
                                onSuccessToast?.(res.message);
                              }}
                              className="px-2.5 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>挂载</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* 高密度单行表格列表视图 (一行一条，信息利用率极高) */
              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-2xs">
                {filteredDatasets.map((ds) => {
                  const isSelected = previewDataset?.id === ds.id;
                  const industryTag = ds.theme || ds.businessScenario || "通用行业";
                  return (
                    <div
                      key={ds.id}
                      onClick={() => setPreviewDataset(ds)}
                      className={`px-3.5 py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        ds.isMounted
                          ? "bg-emerald-50/40"
                          : isSelected
                          ? "bg-blue-50/50 font-medium"
                          : ""
                      }`}
                    >
                      {/* 左侧信息 */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* 行业标签 */}
                        <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 shrink-0">
                          {industryTag}
                        </span>

                        {/* 标题与描述 */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {ds.title}
                            </span>
                            {ds.visibility === "private" && (
                              <span className="text-[9px] font-bold bg-amber-50 text-amber-700 px-1 py-0.2 rounded border border-amber-200 shrink-0">
                                个人私有
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {ds.description || "暂无描述"}
                          </p>
                        </div>
                      </div>

                      {/* 中部参数 */}
                      <div className="hidden md:flex items-center gap-4 text-xs text-slate-500 shrink-0">
                        <span className="font-mono text-slate-600 text-xs w-16 text-right">
                          {ds.fileSize}
                        </span>
                        <span className="text-slate-400 text-[11px] w-20 text-right">
                          挂载 {ds.mountCount || 0} 次
                        </span>
                      </div>

                      {/* 右侧挂载操作按钮 */}
                      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {ds.isMounted ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>已挂载</span>
                            </span>
                            <button
                              onClick={() => {
                                const res = onToggleMount(ds.id);
                                onSuccessToast?.(res.message);
                              }}
                              className="px-2.5 py-1 rounded text-[11px] font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                            >
                              卸载
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              const res = onToggleMount(ds.id);
                              onSuccessToast?.(res.message);
                            }}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>挂载</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 右侧抽屉：数据集详情与字段概览及 Python 快速读取代码 */}
          {previewDataset && (
            <div className="w-72 sm:w-84 bg-white overflow-y-auto p-4 space-y-3.5 border-l border-slate-200 flex flex-col justify-between shrink-0">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                      {previewDataset.theme || previewDataset.businessScenario || "行业场景"}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">{previewDataset.title}</h3>
                  </div>
                  <button
                    onClick={() => setPreviewDataset(null)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 基本参数 */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">行业分类</span>
                    <span className="font-semibold text-slate-800">{previewDataset.theme || "行业场景"}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">文件大小</span>
                    <span className="font-semibold">{previewDataset.fileSize}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">数据格式</span>
                    <span className="font-mono font-semibold">{previewDataset.format}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">只读路径</span>
                    <span className="font-mono text-[10px] text-slate-700 truncate max-w-[140px]">
                      {previewDataset.mountPath || `/datasets/${previewDataset.id}`}
                    </span>
                  </div>
                </div>

                {/* 描述信息 */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-700">数据说明</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-h-28 overflow-y-auto">
                    {previewDataset.description || "暂无详细描述信息。"}
                  </p>
                </div>

                {/* Jupyter 实验代码 */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Jupyter 读取代码</span>
                    <button
                      onClick={() => {
                        const code = `import pandas as pd\ndf = pd.read_csv("${previewDataset.mountPath || `/home/jovyan/datasets/${previewDataset.id}`}")\nprint(df.shape)`;
                        navigator.clipboard.writeText(code);
                        onSuccessToast?.("示例代码已复制");
                      }}
                      className="text-blue-600 hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>复制</span>
                    </button>
                  </div>
                  <pre className="bg-[#1e1e1e] text-slate-200 p-2.5 rounded-xl text-[10px] font-mono overflow-x-auto leading-relaxed">
{`import pandas as pd
df = pd.read_${previewDataset.format === "JSON" ? "json" : previewDataset.format === "Parquet" ? "parquet" : "csv"}("${previewDataset.mountPath || `/home/jovyan/datasets/${previewDataset.id}`}")
df.head()`}
                  </pre>
                </div>
              </div>

              {/* 底部挂载操作 */}
              <div className="pt-2.5 border-t border-slate-100">
                {previewDataset.isMounted ? (
                  <button
                    onClick={() => {
                      const res = onToggleMount(previewDataset.id);
                      onSuccessToast?.(res.message);
                    }}
                    className="w-full py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                  >
                    从当前环境卸载
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const res = onToggleMount(previewDataset.id);
                      onSuccessToast?.(res.message);
                    }}
                    className="w-full py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>立即挂载到当前环境</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 底部 Footer */}
        <div className="px-5 py-2.5 border-t border-slate-100 bg-white flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="text-[11px] text-slate-400">
            挂载的数据集为容器内只读软链接映射，随时可一键卸载。
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer transition-colors text-xs"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
