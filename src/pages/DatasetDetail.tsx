import React, { useState } from "react";
import {
  Database,
  Download,
  Share2,
  Bookmark,
  ChevronLeft,
  CheckCircle2,
  HardDrive,
  Lock,
  Globe,
  Play,
  Trash2,
  Calendar,
  User,
  ShieldCheck,
  Edit3,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { DatasetItem } from "../data/mockData";
import Header from "../components/Header";
import { EditDatasetModal } from "../components/EditDatasetModal";
import { DeleteDatasetModal } from "../components/DeleteDatasetModal";
import { DatasetViewer } from "../components/DatasetViewer";
import { DatasetOverviewDoc } from "../components/DatasetOverviewDoc";

interface DatasetDetailProps {
  onNavigate: (view: string) => void;
}

export default function DatasetDetail({ onNavigate }: DatasetDetailProps) {
  const {
    currentUser,
    datasets,
    selectedDatasetId,
    toggleFavorite,
    storageInfo,
  } = useData();

  const [activeTab, setActiveTab] = useState<"overview" | "preview">("overview");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // 弹窗状态
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [copiedPath, setCopiedPath] = useState(false);

  // 获取当前选中的数据集（若未选中或不存在则默认回退到第一个）
  const dataset: DatasetItem =
    datasets.find((d) => d.id === selectedDatasetId) || datasets[0] || INITIAL_FALLBACK;

  const isAdmin = currentUser.role === "admin";
  const isOwnDataset =
    dataset.author &&
    (dataset.author.name === currentUser.name || dataset.author.role === currentUser.role);
  const isAuthor = isAdmin || isOwnDataset;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard?.writeText(text);
    if (type === "path") {
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
    }
    showToast(`已成功复制到剪贴板！`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-800">
      {/* 统一顶栏 */}
      <Header onNavigate={onNavigate} activeNav="dataset-hall" />

      {/* 面包屑导航栏 */}
      <div className="bg-white border-b border-slate-200/80 px-6 sm:px-12 py-2.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500">
          <button
            onClick={() => onNavigate("dataset-hall")}
            className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-medium transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>返回数据大厅</span>
          </button>
          <span>/</span>
          <span className="text-slate-400">数据集详情</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-md">
            {dataset.title}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <HardDrive className="w-3.5 h-3.5 text-blue-500" />
            <span>
              个人配额: <strong className="text-slate-700 font-mono">{storageInfo.usedGB}</strong> / {storageInfo.totalGB} GB
            </span>
          </div>
          <div className="h-3 w-px bg-slate-200" />
          <button
            onClick={() => onNavigate("jupyter-env")}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>前往实验工作区</span>
          </button>
        </div>
      </div>

      {/* Toast 浮层提示 */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 数据集详情页顶部 Header 区域 */}
      <section className="bg-gradient-to-b from-[#eef5fd] via-[#f4f8fe] to-white border-b border-slate-200/80 px-6 sm:px-12 py-6">
        <div className="max-w-[1400px] mx-auto space-y-4">
          {/* 顶行：状态标签群 与 右侧快捷操作工具栏 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {dataset.visibility === "public" || (dataset.visibility as any) === "school" ? (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <Globe className="w-3 h-3 text-emerald-600" />
                  公开数据集
                </span>
              ) : (
                <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-600" />
                  个人私有
                </span>
              )}
            </div>

            {/* 右侧动作工具栏：管理权限、下载、收藏与分享 */}
            <div className="flex flex-wrap items-center gap-2">
              {/* 作者管理按钮组 */}
              {isAuthor && (
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="hover:bg-blue-50 text-blue-700 px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>编辑</span>
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="hover:bg-rose-50 text-rose-600 px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>删除</span>
                  </button>
                </div>
              )}

              {/* 前往实验环境 */}
              <button
                onClick={() => onNavigate("jupyter-env")}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                title="在实验环境中挂载使用"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>进入实验工作区</span>
              </button>

              {/* 下载按钮 */}
              {dataset.permission === "download_and_mount" || isAdmin ? (
                <button
                  onClick={() => showToast(`开始打包下载《${dataset.title}》源文件 (${dataset.fileSize})...`)}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>下载数据</span>
                </button>
              ) : null}

              {/* 收藏按钮: 仅针对他人/平台公开数据集显示，自己的数据集无需收藏 */}
              {!isOwnDataset && (
                <button
                  onClick={() => {
                    toggleFavorite(dataset.id);
                    showToast(dataset.isFavorite ? "已从我的收藏中移除" : "已加入我的收藏");
                  }}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors shadow-2xs cursor-pointer ${
                    dataset.isFavorite
                      ? "bg-rose-50 border-rose-300 text-rose-600 font-semibold"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                  title={dataset.isFavorite ? "取消收藏" : "加入我的收藏"}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${dataset.isFavorite ? "fill-current text-rose-500" : ""}`} />
                  <span>{dataset.favoriteCount || 0}</span>
                </button>
              )}

              {/* 分享按钮 */}
              <button
                onClick={() => handleCopy(window.location.href, "url")}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 p-1.5 rounded-lg text-xs flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                title="复制分享链接"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 标题 */}
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            {dataset.title}
          </h1>

          {/* 业务应用场景 */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <span className="text-xs text-slate-400 font-medium shrink-0">业务应用场景:</span>
            <span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-md border border-blue-200">
              {dataset.theme || dataset.themes?.[0] || "通用场景"}
            </span>
          </div>

          {/* 宽敞横向指标条：发布者、更新时间、大小、样本数、挂载路径与保护 */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 pt-3 border-t border-slate-200/60">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>
                发布者: <strong className="text-slate-700">{dataset.author.name}</strong> ({dataset.author.org})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>更新时间: {dataset.updatedAt}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>文件大小: <strong className="text-slate-800">{dataset.fileSize}</strong></span>
            </div>
            {dataset.rowCount ? (
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-400">样本量:</span>
                <strong className="text-slate-800">{dataset.rowCount.toLocaleString()} 条</strong>
              </div>
            ) : null}
            <div className="flex items-center gap-1.5 font-mono bg-slate-100/80 px-2 py-0.5 rounded border border-slate-200 text-slate-600">
              <span className="text-slate-400">挂载相对路径:</span>
              <span className="text-slate-700">{dataset.mountPath}</span>
              <button
                onClick={() => handleCopy(dataset.mountPath, "path")}
                className="text-blue-600 hover:text-blue-700 font-semibold ml-1 hover:underline cursor-pointer"
              >
                {copiedPath ? "已复制" : "复制"}
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>平台只读隔离保护</span>
            </div>
          </div>
        </div>
      </section>

      {/* 主体单栏全宽布局 */}
      <main className="max-w-[1400px] mx-auto w-full px-6 sm:px-12 py-6 flex-1">
        {/* Tab 导航头与内容卡片 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="flex items-center border-b border-slate-200 px-4 bg-slate-50/70 text-xs font-semibold overflow-x-auto no-scrollbar">
            {[
              { id: "overview", label: "📑 数据集概述 (文档)", badge: "README" },
              { id: "preview", label: "📂 文件目录与样本预览" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-5 border-b-2 font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700 font-bold"
                        : "bg-slate-200/80 text-slate-600"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab 详细内容 */}
          <div className="p-6 sm:p-8">
            {/* Tab 1: 数据集概述与文档 */}
            {activeTab === "overview" && (
              <div>
                <DatasetOverviewDoc dataset={dataset} onNavigate={onNavigate} />
              </div>
            )}

            {/* Tab 2: 样本数据预览器 */}
            {activeTab === "preview" && (
              <div>
                <DatasetViewer dataset={dataset} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 编辑数据集弹窗 */}
      <EditDatasetModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        dataset={dataset}
        onSuccess={(msg) => showToast(msg)}
      />

      {/* 删除数据集弹窗 */}
      <DeleteDatasetModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        dataset={dataset}
        onSuccess={(msg) => {
          showToast(msg);
          setTimeout(() => {
            onNavigate("dataset-hall");
          }, 800);
        }}
      />
    </div>
  );
}

const INITIAL_FALLBACK: DatasetItem = {
  id: "ds-fallback",
  title: "数据集详情",
  description: "暂无数据集描述",
  techDomain: "表格数据",
  theme: "商业零售",
  format: "CSV",
  fileSize: "0 MB",
  sizeBytes: 0,
  visibility: "public",
  permission: "download_and_mount",
  version: "V1.0",
  versionsList: [],
  author: {
    name: "系统管理员",
    role: "admin",
    org: "UUSIMA 平台",
  },
  createdAt: "2025-05-01",
  updatedAt: "2025-05-01",
  downloadCount: 0,
  mountCount: 0,
  favoriteCount: 0,
  isFavorite: false,
  isMounted: false,
  mountPath: "/datasets/shared/ds-fallback",
  associatedCourses: [],
};
