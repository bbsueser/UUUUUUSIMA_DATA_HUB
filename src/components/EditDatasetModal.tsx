import React, { useState, useEffect } from "react";
import {
  X,
  Edit3,
  Tag,
  Globe,
  Lock,
  Download,
  AlertTriangle,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Check,
  Search,
} from "lucide-react";
import {
  DatasetItem,
  BUSINESS_SCENARIOS,
  DATASET_OVERVIEW_TEMPLATE,
  extractDatasetSummary,
} from "../data/mockData";
import { useData } from "../context/DataContext";
import { DatasetCover } from "./DatasetCover";
import { CoverSelectorSection } from "./CoverSelectorSection";

interface EditDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: DatasetItem | null;
  onSuccess?: (msg: string) => void;
}

export const EditDatasetModal: React.FC<EditDatasetModalProps> = ({
  isOpen,
  onClose,
  dataset,
  onSuccess,
}) => {
  const { updateDataset } = useData();

  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [overviewDoc, setOverviewDoc] = useState("");
  const [theme, setTheme] = useState<string>("智慧农业");
  const [scenarioSearch, setScenarioSearch] = useState<string>("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [permission, setPermission] = useState<"download_and_mount" | "mount_only">("download_and_mount");
  const [customCoverImage, setCustomCoverImage] = useState<string>("");
  const [coverSourceType, setCoverSourceType] = useState<"algorithm" | "preset" | "upload">("algorithm");

  // 错误提示
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (dataset) {
      setTitle(dataset.title || "");
      setShortDesc(dataset.description || "");
      setOverviewDoc(dataset.overviewDoc || "");
      setTheme(dataset.theme || dataset.themes?.[0] || "智慧农业");
      setVisibility(dataset.visibility === "private" ? "private" : "public");
      setPermission(dataset.permission || "download_and_mount");
      setCustomCoverImage(dataset.customCoverImage || "");
      setCoverSourceType(dataset.customCoverImage ? "upload" : "algorithm");
      setErrorMessage(null);
    }
  }, [dataset, isOpen]);

  if (!isOpen || !dataset) return null;

  const handleSave = () => {
    if (!title.trim()) {
      setErrorMessage("数据集名称不能为空！");
      return;
    }
    if (!shortDesc.trim()) {
      setErrorMessage("数据集简短描述不能为空（用于卡片展示）！");
      return;
    }

    const trimmedOverview = overviewDoc.trim();

    const res = updateDataset(dataset.id, {
      title: title.trim(),
      description: shortDesc.trim(),
      overviewDoc: trimmedOverview || undefined,
      theme,
      themes: [theme],
      visibility,
      permission,
      customCoverImage: coverSourceType === "algorithm" ? undefined : customCoverImage || undefined,
    });

    if (res.success) {
      if (onSuccess) onSuccess("数据集修改成功！");
      onClose();
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 space-y-5 max-h-[90vh] flex flex-col font-sans">
        {/* 顶部标题 */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">编辑数据集属性与元数据</h2>
              <p className="text-slate-500 text-xs mt-0.5">修改数据集名称、业务场景分类、短描述及详细技术文档</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 错误提示条 */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 主表单区域 (可滚动) */}
        <div className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
          {/* 数据集名称 */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 flex items-center gap-1">
              <span>数据集名称</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="请输入数据集名称"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white text-xs font-semibold transition-all"
            />
          </div>

          {/* 业务应用场景分类 (智慧农业、情感分析等 30+ 场景，带搜索检索) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1">
                <span>业务应用场景</span>
                <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-blue-600 font-medium">当前选中: {theme}</span>
            </div>

            {/* 场景快速搜索框 */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={scenarioSearch}
                onChange={(e) => setScenarioSearch(e.target.value)}
                placeholder="搜索场景（如：农业、金融、医疗、电商、交通...）"
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              {scenarioSearch && (
                <button
                  type="button"
                  onClick={() => setScenarioSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 场景网格选择 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-40 overflow-y-auto pr-1 p-1 bg-slate-50 rounded-xl border border-slate-200 scrollbar-thin">
              {BUSINESS_SCENARIOS.filter((sc) =>
                sc.toLowerCase().includes(scenarioSearch.trim().toLowerCase())
              ).map((sc) => (
                <button
                  key={sc}
                  type="button"
                  onClick={() => setTheme(sc)}
                  className={`p-2 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer truncate ${
                    theme === sc
                      ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                  title={sc}
                >
                  {sc}
                </button>
              ))}
              {BUSINESS_SCENARIOS.filter((sc) =>
                sc.toLowerCase().includes(scenarioSearch.trim().toLowerCase())
              ).length === 0 && (
                <div className="col-span-full py-4 text-center text-slate-400 text-xs flex flex-col items-center gap-1">
                  <span>未找到与 “{scenarioSearch}” 匹配的业务场景</span>
                  <button
                    type="button"
                    onClick={() => setScenarioSearch("")}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    清空搜索词
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 数据集短描述 (必填，用于卡片与网格展示) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 flex items-center gap-1">
              <span>数据集简短描述 (卡片展示)</span>
              <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="50~100字简短描述，用于大厅卡片列表直接展示..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 text-xs leading-relaxed"
            />
          </div>

          {/* 数据集详细概述与说明文档 (Markdown) */}
          <div className="space-y-2.5 bg-blue-50/40 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>数据集详细概述与说明文档 (Markdown)</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setOverviewDoc(DATASET_OVERVIEW_TEMPLATE);
                }}
                className="text-[11px] text-blue-600 hover:text-blue-700 bg-white border border-blue-200 px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer hover:bg-blue-50/50"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>插入规范模板</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              详情页展示完整结构（业务背景与样本量 → 字段字典 → 适用模型 → 代码调用示例）。
            </p>
            <textarea
              rows={8}
              value={overviewDoc}
              onChange={(e) => setOverviewDoc(e.target.value)}
              placeholder={DATASET_OVERVIEW_TEMPLATE}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 font-mono text-xs leading-relaxed transition-all shadow-inner"
            />
          </div>

          {/* 可见性维度 (极简两档：公开 vs 个人私有) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800">可见性设置</label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setVisibility("public")}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  visibility === "public"
                    ? "bg-blue-50/60 border-blue-500 text-blue-900 shadow-2xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 text-xs">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>公开数据集 (全平台可见)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  发布至数据大厅，供全平台用户进行探索与教学实训使用。
                </p>
              </div>

              <div
                onClick={() => setVisibility("private")}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  visibility === "private"
                    ? "bg-amber-50/60 border-amber-500 text-amber-900 shadow-2xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 text-xs">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>个人私有 (仅自己可见)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  仅您本人在“我的数据集”与实验环境中可见及使用。
                </p>
              </div>
            </div>
          </div>

          {/* 封面定制 */}
          <CoverSelectorSection
            coverSourceType={coverSourceType}
            onCoverSourceTypeChange={setCoverSourceType}
            customCoverImage={customCoverImage}
            onCustomCoverImageChange={setCustomCoverImage}
            title={title}
            techDomains={[]}
            themes={[theme]}
            format={dataset.format}
            fileSize={dataset.fileSize}
          />
        </div>

        {/* 弹窗底部操作 */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>保存修改</span>
          </button>
        </div>
      </div>
    </div>
  );
};
