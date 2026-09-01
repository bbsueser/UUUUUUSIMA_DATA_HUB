import React, { useState } from "react";
import {
  X,
  History,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileUp,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  User,
  HardDrive,
} from "lucide-react";
import { DatasetItem } from "../data/mockData";
import { useData } from "../context/DataContext";

interface VersionManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: DatasetItem | null;
  onSuccess?: (msg: string) => void;
}

export const VersionManagementModal: React.FC<VersionManagementModalProps> = ({
  isOpen,
  onClose,
  dataset,
  onSuccess,
}) => {
  const { rollbackVersion, uploadNewVersion, deleteVersion } = useData();

  const [activeTab, setActiveTab] = useState<"list" | "upload">("list");

  // 上传新版本表单
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [changelog, setChangelog] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !dataset) return null;

  const currentNum = parseInt(dataset.version.replace(/[^0-9]/g, "") || "1", 10);
  const nextVerStr = `V${currentNum + 1}.0`;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setErrorMessage(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const handleSwitchVersion = (verStr: string) => {
    rollbackVersion(dataset.id, verStr);
    if (onSuccess) onSuccess(`已将当前生效版本切换为 ${verStr}`);
  };

  const handleDeleteHistoricalVersion = (verStr: string) => {
    const res = deleteVersion(dataset.id, verStr);
    if (res.success) {
      if (onSuccess) onSuccess(res.message);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleSubmitNewVersion = () => {
    if (!changelog.trim()) {
      setErrorMessage("请填写版本变更说明，便于使用者了解更新内容！");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const fileSizeStr = selectedFile
        ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
        : "18.6 MB";
      const sizeBytes = selectedFile ? selectedFile.size : 19503513;

      const res = uploadNewVersion(dataset.id, {
        changelog: changelog.trim(),
        fileSize: fileSizeStr,
        sizeBytes,
        fileName: selectedFile?.name,
      });

      setIsSubmitting(false);
      if (res.success) {
        if (onSuccess) onSuccess(res.message);
        setSelectedFile(null);
        setChangelog("");
        setActiveTab("list");
      } else {
        setErrorMessage(res.message);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 space-y-5 max-h-[90vh] flex flex-col">
        {/* 顶部标题 */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">版本生命周期管理</h2>
                <span className="bg-blue-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                  当前: {dataset.version}
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5 truncate max-w-md">
                数据集: <strong className="text-slate-700">{dataset.title}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab 切换 */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 shrink-0">
          <button
            onClick={() => {
              setActiveTab("list");
              setErrorMessage(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "list"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>所有版本历史 ({dataset.versionsList?.length || 1})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("upload");
              setErrorMessage(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "upload"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-blue-600 hover:bg-blue-50 border border-blue-200"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>发布下一迭代版本 ({nextVerStr})</span>
          </button>
        </div>

        {/* 错误提示条 */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 内容展示区 (可滚动) */}
        <div className="overflow-y-auto pr-1 flex-1 text-xs">
          {activeTab === "list" ? (
            /* 版本列表视图 */
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 leading-relaxed text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  支持随时回滚至任意历史版本。切换后 Jupyter 挂载环境将自动映射至对应版本的只读数据文件。
                </span>
              </div>

              <div className="space-y-2.5">
                {(dataset.versionsList || []).map((ver) => {
                  const isCurrent = dataset.version === ver.version;
                  return (
                    <div
                      key={ver.version}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                        isCurrent
                          ? "bg-blue-50/80 border-blue-300 shadow-2xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-slate-900">
                            {ver.version}
                          </span>
                          {isCurrent ? (
                            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              当前生效版本
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              历史版本
                            </span>
                          )}
                          <span className="text-slate-400 text-xs">
                            {ver.updatedAt}
                          </span>
                        </div>

                        <p className="text-slate-600 text-xs leading-relaxed font-normal">
                          {ver.changelog}
                        </p>

                        <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-0.5">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            {ver.author}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <HardDrive className="w-3 h-3 text-slate-400" />
                            {ver.size}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isCurrent && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSwitchVersion(ver.version)}
                              className="px-3 py-1.5 bg-white hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-200 rounded-lg font-semibold transition-colors shadow-2xs"
                            >
                              设为当前
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteHistoricalVersion(ver.version)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
                              title="删除此历史版本"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* 发布新版本表单视图 */
            <div className="space-y-4">
              <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 space-y-1">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                  <span>准备发布版本: {nextVerStr}</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  新版本上传后将自动设为该数据集的主力有效版本，并向收藏该数据集的师生发送站内更新通知。
                </p>
              </div>

              {/* 文件上传区 */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">
                  上传新版本数据包文件
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : selectedFile
                      ? "border-emerald-400 bg-emerald-50/40"
                      : "border-slate-300 hover:border-slate-400 bg-slate-50"
                  }`}
                >
                  <input
                    type="file"
                    id="version-file-input"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="space-y-1">
                      <FileUp className="w-6 h-6 text-emerald-600 mx-auto" />
                      <div className="font-bold text-slate-800 text-xs">
                        已选择文件: {selectedFile.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        文件大小: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                      <label
                        htmlFor="version-file-input"
                        className="inline-block text-[11px] text-blue-600 hover:underline cursor-pointer pt-1"
                      >
                        重新选择
                      </label>
                    </div>
                  ) : (
                    <label htmlFor="version-file-input" className="cursor-pointer space-y-1 block">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                      <div className="font-semibold text-slate-700 text-xs">
                        点击上传或将更新的数据文件拖拽至此处
                      </div>
                      <div className="text-[10px] text-slate-400">
                        支持 CSV, JSON, Parquet, ZIP 等格式，单文件上限 5GB
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* 变更说明 */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 flex items-center gap-1">
                  <span>版本变更说明 (Change Log)</span>
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={changelog}
                  onChange={(e) => {
                    setChangelog(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="例如：补充了2026年Q1数据样本，修正了部分缺失值，优化了特征列命名规范..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white text-xs leading-relaxed"
                />
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("list")}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold text-xs"
                >
                  返回版本列表
                </button>
                <button
                  type="button"
                  onClick={handleSubmitNewVersion}
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-sm flex items-center gap-1.5 text-xs disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "发布中..." : `确认发布 ${nextVerStr}`}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 底部关闭按钮 */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors text-xs"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
