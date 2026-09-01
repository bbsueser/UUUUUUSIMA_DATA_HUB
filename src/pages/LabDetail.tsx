import React, { useState } from "react";
import {
  Clock,
  Users,
  UserCheck,
  BookOpen,
  Database,
  ArrowRight,
  Plus,
  Play,
  FileText,
  CheckCircle2,
  HardDrive,
  Lock,
  Download,
  Eye,
  ChevronDown,
  ChevronLeft,
  Sparkles,
  Bot,
  ExternalLink,
  Search,
  Tag,
  Share2,
  Layers,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { DatasetItem } from "../data/mockData";
import Header from "../components/Header";

interface LabDetailProps {
  onNavigate: (view: string) => void;
}

export default function LabDetail({ onNavigate }: LabDetailProps) {
  const {
    currentUser,
    setCurrentUser,
    allUsers,
    datasets,
    mountedDatasets,
    toggleMount,
  } = useData();

  const [activeTab, setActiveTab] = useState<"brief" | "courses" | "manual" | "datasets">("brief");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedDatasetForPreview, setSelectedDatasetForPreview] = useState<DatasetItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 关联到当前实验的数据集
  const associatedDatasets = datasets.filter(
    (d) =>
      d.associatedCourses.some((c) => c.labId === "lab-jupyter-01") ||
      d.id === "ds-001" ||
      d.id === "ds-002" ||
      d.id === "ds-003"
  );

  const handleMountAction = (dsId: string) => {
    const res = toggleMount(dsId);
    setToastMsg(res.message);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-800">
      <Header onNavigate={onNavigate} activeNav="lab-hall" />

      {/* 面包屑返回栏 */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500">
          <button
            onClick={() => onNavigate("lab-hall")}
            className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-medium transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>返回实验大厅</span>
          </button>
          <span>/</span>
          <span className="text-slate-400">实验环境详情</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold">人工智能平台-jupyter</span>
        </div>

        <div className="flex items-center gap-3 text-slate-500">
          <span className="flex items-center gap-1 text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>云端集群状态正常</span>
          </span>
        </div>
      </div>

      {/* Toast 提示 */}
      {toastMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 实验详情 Banner */}
      <section className="bg-gradient-to-r from-[#4c40b8] via-[#5c49d8] to-[#715ae6] text-white py-12 px-6 sm:px-12 relative overflow-hidden">
        {/* 背景光晕装饰 */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex-1 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                人工智能平台-jupyter
              </h1>
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-semibold border border-white/30 text-white shadow-2xs">
                <Bot className="w-3.5 h-3.5 text-amber-300" />
                实验智能体
              </span>
            </div>

            <p className="text-white/80 text-sm leading-relaxed max-w-2xl">
              Jupyter 是一款开源的交互式笔记本应用，让用户能够创建和分享包含实时代码、方程式、可视化和叙述性文本的文档。它支持多种编程语言，非常适合数据科学、机器学习和教学。
            </p>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => onNavigate("jupyter-env")}
                className="bg-white hover:bg-slate-100 text-[#4c40b8] font-bold px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm"
              >
                <span>立即体验</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate("dataset-hall")}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 text-sm"
              >
                <Database className="w-4 h-4 text-amber-300" />
                <span>浏览数据中心</span>
              </button>
            </div>
          </div>

          {/* 右侧 3D 实验环境示意图卡片 */}
          <div className="w-full md:w-80 shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-2xl">
            <div className="bg-white rounded-xl p-3 text-slate-800 space-y-2 text-xs shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-blue-600">
                  <Play className="w-3 h-3 fill-current" />
                  <span>JupyterLab 4.2.1</span>
                </div>
                <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded text-[10px] font-semibold">
                  运行就绪
                </span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-500 font-mono">
                <div>Kernel: Python 3.10.14</div>
                <div>GPU: NVIDIA T4 Tensor Core</div>
                <div className="text-blue-600 font-semibold">
                  已挂载数据集: {mountedDatasets.length} 个
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 个核心数据统计浮动卡片 */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100 flex items-center justify-between text-slate-800">
            <div>
              <div className="text-xs text-slate-400 font-medium">累计时长 (分钟)</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                596,421
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100 flex items-center justify-between text-slate-800">
            <div>
              <div className="text-xs text-slate-400 font-medium">累计访问量 (人次)</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                1,326
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100 flex items-center justify-between text-slate-800">
            <div>
              <div className="text-xs text-slate-400 font-medium">累计使用人数</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                1,167
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100 flex items-center justify-between text-slate-800">
            <div>
              <div className="text-xs text-slate-400 font-medium">关联课程数量</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                35
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* 详情选项卡导航 (简介 / 关联课程 / 操作手册 / 关联数据集) */}
      <main className="max-w-6xl mx-auto w-full px-6 py-8 flex-1">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Tabs 头部 */}
          <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50/50">
            <button
              onClick={() => setActiveTab("brief")}
              className={`py-4 px-4 font-semibold text-sm border-b-2 transition-all ${
                activeTab === "brief"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              简介
            </button>
            <button
              onClick={() => setActiveTab("courses")}
              className={`py-4 px-4 font-semibold text-sm border-b-2 transition-all ${
                activeTab === "courses"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              关联课程 (35)
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={`py-4 px-4 font-semibold text-sm border-b-2 transition-all ${
                activeTab === "manual"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              操作手册
            </button>
            <button
              onClick={() => setActiveTab("datasets")}
              className={`py-4 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === "datasets"
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-slate-600 hover:text-blue-600"
              }`}
            >
              <Database className="w-4 h-4 text-blue-600" />
              <span>关联数据集 ({associatedDatasets.length})</span>
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                NEW
              </span>
            </button>
          </div>

          {/* Tab 1: 简介内容 */}
          {activeTab === "brief" && (
            <div className="p-8 text-sm text-slate-700 leading-relaxed space-y-6">
              <p>
                Jupyter 是一个开源项目，它的核心是 Jupyter Notebook，一个交互式 Web 应用程序，让用户能够创建和分享包含实时代码、方程式、可视化和叙述性文本的文档。它最初是为 Python 语言设计的，但现在已支持超过 40 种编程语言（或称“内核”），包括 R、Julia 和 Scala 等。Jupyter 的名字是这三种核心语言（Julia、Python、R）的组合，彰显了其跨语言的特性。Jupyter 致力于促进开放科学、开放数据和开放教育。
              </p>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">功能介绍</h3>
                <p>Jupyter 的主要功能在于其强大的交互性和多功能性。用户可以在一个文档中混合多种内容，包括：</p>
                <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
                  <li>
                    <strong className="text-slate-800">实时代码：</strong>可以直接在单元格中编写、运行代码，并立即查看输出结果。
                  </li>
                  <li>
                    <strong className="text-slate-800">富媒体输出：</strong>代码执行结果可以是文本、表格、图像、视频、音频，甚至是交互式图表。
                  </li>
                  <li>
                    <strong className="text-slate-800">数学方程式：</strong>支持 LaTeX 格式的数学公式，便于进行科学计算和展示。
                  </li>
                  <li>
                    <strong className="text-slate-800">叙述性文本：</strong>使用 Markdown 语法，可以轻松添加标题、段落、列表、链接等，用于解释代码和分析过程。
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-blue-900">已为当前实验接入数据中心托管能力</div>
                  <div className="text-xs text-blue-700 mt-0.5">
                    支持在 Jupyter 中一键只读挂载教学数据集，不复制物理文件，秒级映射。
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("datasets")}
                  className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shrink-0"
                >
                  查看已关联的数据集
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: 关联课程 */}
          {activeTab === "courses" && (
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow bg-white">
                  <div className="h-32 bg-gradient-to-tr from-blue-500 to-indigo-600 p-4 text-white flex flex-col justify-between">
                    <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded w-fit">
                      新大陆时代科技
                    </span>
                    <h4 className="font-bold text-base">人工智能训练师 (高级工)</h4>
                  </div>
                  <div className="p-4 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>人工智能/机器学习</span>
                      <span className="font-semibold text-blue-600">0 人在学</span>
                    </div>
                    <p className="text-slate-600 line-clamp-2">
                      紧跟国家职业技能标准，涵盖计算机视觉、NLP与多模态数据工程全流程实训。
                    </p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow bg-white">
                  <div className="h-32 bg-gradient-to-tr from-sky-400 to-blue-600 p-4 text-white flex flex-col justify-between">
                    <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded w-fit">
                      软件版实训
                    </span>
                    <h4 className="font-bold text-base">AI学件-人工智能训练师（高级工）</h4>
                  </div>
                  <div className="p-4 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>人工智能/机器学习</span>
                      <span className="font-semibold text-blue-600">41 人在学</span>
                    </div>
                    <p className="text-slate-600 line-clamp-2">
                      基于典型行业真实任务场景，提供交互式案例教学与随堂评测。
                    </p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow bg-white">
                  <div className="h-32 bg-gradient-to-tr from-indigo-500 to-purple-600 p-4 text-white flex flex-col justify-between">
                    <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded w-fit">
                      深度学习课程
                    </span>
                    <h4 className="font-bold text-base">深度学习应用技术</h4>
                  </div>
                  <div className="p-4 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>人工智能/深度学习</span>
                      <span className="font-semibold text-blue-600">23 人在学</span>
                    </div>
                    <p className="text-slate-600 line-clamp-2">
                      深入浅出讲解CNN、RNN、Transformer底层架构及PyTorch工程落地。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: 操作手册 */}
          {activeTab === "manual" && (
            <div className="p-8 text-sm text-slate-700 space-y-4">
              <h3 className="font-bold text-base text-slate-900">Jupyter 实验操作指南</h3>
              <p className="text-slate-600 leading-relaxed">
                1. 点击顶部【立即体验】按钮进入沉浸式 Jupyter 实验工作台。<br />
                2. 在工作台左侧点击【数据中心】图标，即可查看教师已关联推荐的数据集。<br />
                3. 点击【一键挂载】，系统将通过符号链接自动映射至环境的 <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">/home/jovyan/datasets/</code> 目录。<br />
                4. 在代码中通过标准路径即可直接只读读取数据，无需手动下载与重复上传。
              </p>
            </div>
          )}

          {/* Tab 4: 关联数据集卡片 */}
          {activeTab === "datasets" && (
            <div className="p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <span>本实验已关联的公开教学数据集</span>
                    <span className="text-xs font-normal text-slate-500">
                      (共 {associatedDatasets.length} 个)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    学生可在此直接将所需数据集挂载到个人 Jupyter 工作空间，或直接在线预览样本数据字典。
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate("dataset-hall")}
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>去数据中心发现更多</span>
                  </button>
                  <button
                    onClick={() => onNavigate("jupyter-env")}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>打开 Jupyter 实验</span>
                  </button>
                </div>
              </div>

              {/* 数据集卡片列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {associatedDatasets.map((ds) => (
                  <div
                    key={ds.id}
                    className="border border-slate-200 rounded-xl p-5 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer">
                          {ds.title}
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                            ds.isMounted
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {ds.isMounted ? "● 已挂载到环境" : "未挂载"}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {ds.description}
                      </p>

                      {/* 维度一：技术领域 + 维度二：主题 + 文件格式 */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="bg-blue-50 text-blue-700 text-[11px] font-medium px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>技术领域: {ds.techDomain}</span>
                        </span>
                        <span className="bg-indigo-50 text-indigo-700 text-[11px] font-medium px-2 py-0.5 rounded border border-indigo-100">
                          主题: {ds.theme}
                        </span>
                        <span className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded font-mono font-medium">
                          {ds.format}
                        </span>
                        <span className="text-xs text-slate-400 ml-auto font-mono">
                          {ds.fileSize}
                        </span>
                      </div>

                      {/* 关联的具体课程与章节 */}
                      {ds.associatedCourses.length > 0 && (
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-1">
                          <div className="font-semibold text-slate-700 flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-blue-600" />
                            <span>推荐教学章节：</span>
                          </div>
                          <div className="text-slate-500">
                            {ds.associatedCourses[0].courseName} - {ds.associatedCourses[0].chapter}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 卡片底部操作 */}
                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400">
                        权限: {ds.permission === "download_and_mount" ? "允许下载 & 挂载" : "仅允许挂载 (只读)"}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedDatasetForPreview(ds);
                          }}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>数据字典/预览</span>
                        </button>

                        <button
                          onClick={() => handleMountAction(ds.id)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                            ds.isMounted
                              ? "bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          {ds.isMounted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>已挂载 (点击卸载)</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>一键挂载到 Jupyter</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 数据集快速预览 Modal */}
      {selectedDatasetForPreview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {selectedDatasetForPreview.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="font-semibold text-blue-600">
                    技术领域: {selectedDatasetForPreview.techDomain}
                  </span>
                  <span>|</span>
                  <span>主题: {selectedDatasetForPreview.theme}</span>
                  <span>|</span>
                  <span>大小: {selectedDatasetForPreview.fileSize}</span>
                  <span>|</span>
                  <span>版本: {selectedDatasetForPreview.version}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDatasetForPreview(null)}
                className="text-slate-400 hover:text-slate-700 text-sm p-1 rounded hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <div className="font-bold text-slate-800 text-sm mb-1.5">数据集描述</div>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedDatasetForPreview.description}
                </p>
              </div>

              {/* 字段字典 */}
              {selectedDatasetForPreview.columns && (
                <div>
                  <div className="font-bold text-slate-800 text-sm mb-1.5">
                    字段特征字典 ({selectedDatasetForPreview.columns.length} 列)
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-2">列名</th>
                          <th className="p-2">类型</th>
                          <th className="p-2">缺失率</th>
                          <th className="p-2">均值/极值</th>
                          <th className="p-2">样例值</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        {selectedDatasetForPreview.columns.map((col) => (
                          <tr key={col.name}>
                            <td className="p-2 font-mono font-medium text-slate-900">{col.name}</td>
                            <td className="p-2 font-mono text-blue-600">{col.type}</td>
                            <td className="p-2">{col.nullPercentage}</td>
                            <td className="p-2 font-mono text-slate-500">
                              {col.mean ? `mean:${col.mean}` : "-"}
                            </td>
                            <td className="p-2 font-mono text-slate-500 truncate max-w-xs">
                              {col.sampleValues.join(", ")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 表格前 100 行样本预览 */}
              {selectedDatasetForPreview.previewRows && (
                <div>
                  <div className="font-bold text-slate-800 text-sm mb-1.5">
                    表格数据只读预览 (Top Rows)
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          {Object.keys(selectedDatasetForPreview.previewRows[0]).map((k) => (
                            <th key={k} className="p-2 border-r border-slate-200 font-mono">
                              {k}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600 font-mono">
                        {selectedDatasetForPreview.previewRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            {Object.values(row).map((v: any, i) => (
                              <td key={i} className="p-2 border-r border-slate-200">
                                {String(v)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                挂载路径: {selectedDatasetForPreview.mountPath}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDatasetForPreview(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    handleMountAction(selectedDatasetForPreview.id);
                    setSelectedDatasetForPreview(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                >
                  {selectedDatasetForPreview.isMounted ? "从实验卸载" : "一键挂载到 Jupyter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
