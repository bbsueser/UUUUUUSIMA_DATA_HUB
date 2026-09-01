import React, { useState } from "react";
import {
  X,
  Trash2,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { DatasetItem } from "../data/mockData";
import { useData } from "../context/DataContext";

interface DeleteDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: DatasetItem | null;
  onSuccess?: (msg: string) => void;
}

export const DeleteDatasetModal: React.FC<DeleteDatasetModalProps> = ({
  isOpen,
  onClose,
  dataset,
  onSuccess,
}) => {
  const { deleteDataset } = useData();
  const [confirmedRisk, setConfirmedRisk] = useState(false);

  if (!isOpen || !dataset) return null;

  const refCount = dataset.associatedCourses ? dataset.associatedCourses.length : 0;
  const hasReferences = refCount > 0;

  const handleDelete = () => {
    const res = deleteDataset(dataset.id);
    if (res.success) {
      if (onSuccess) onSuccess(res.message);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 space-y-4 text-xs">
        {/* 顶部 */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-red-600 font-extrabold text-sm">
            <Trash2 className="w-4 h-4" />
            <span>删除数据集确认</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 提示内容 */}
        <div className="space-y-3">
          <p className="text-slate-700 leading-relaxed">
            您确定要删除数据集 <strong className="text-slate-900 font-bold">《{dataset.title}》</strong> 吗？删除后相关元数据与历史版本将被移除。
          </p>

          {/* 引用风险警示 */}
          {hasReferences ? (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-amber-900">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>⚠️ 引用风险提示：存在 {refCount} 个关联实验</span>
              </div>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                该数据集正被以下实验课程引用。删除后可能导致学生进行对应实验时出现数据丢失或挂载失败：
              </p>
              <div className="space-y-1 pt-1">
                {dataset.associatedCourses.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 bg-white/80 px-2 py-1 rounded text-[11px] text-slate-700 border border-amber-200/60"
                  >
                    <BookOpen className="w-3 h-3 text-amber-600 shrink-0" />
                    <span className="font-semibold text-slate-900">{c.courseName}</span>
                    <span className="text-slate-400">·</span>
                    <span>{c.labName}</span>
                  </div>
                ))}
              </div>

              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedRisk}
                  onChange={(e) => setConfirmedRisk(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span className="text-[11px] font-semibold text-red-700">
                  我已知晓并确认删除该数据集
                </span>
              </label>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-[11px]">
              该数据集当前未被任何实验课程引用，可安全删除。
            </div>
          )}
        </div>

        {/* 按钮 */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors text-xs"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={hasReferences && !confirmedRisk}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  );
};
