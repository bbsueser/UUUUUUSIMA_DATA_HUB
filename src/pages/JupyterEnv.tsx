import React, { useState, useEffect, useRef } from "react";
import {
  Folder,
  FileCode,
  FileText,
  Terminal,
  Database,
  BookOpen,
  HelpCircle,
  Cpu,
  Layers,
  Bot,
  Play,
  RotateCw,
  Plus,
  Upload,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Check,
  Trash2,
  Lock,
  ArrowLeft,
  Settings,
  Maximize2,
  Minimize2,
  HardDrive,
  Copy,
  Info,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { MountDatasetModal } from "../components/MountDatasetModal";

interface JupyterEnvProps {
  onNavigate: (view: string) => void;
}

export default function JupyterEnv({ onNavigate }: JupyterEnvProps) {
  const {
    currentUser,
    setCurrentUser,
    allUsers,
    datasets,
    mountedDatasets,
    toggleMount,
    storageInfo,
  } = useData();

  // 侧边功能栏选中状态
  const [activeSideTab, setActiveSideTab] = useState<
    "brief" | "manual" | "courses" | "resources" | "datasets" | "ai"
  >("datasets");

  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(true);
  const [isMountModalOpen, setIsMountModalOpen] = useState(false);

  // 实验计时器
  const [seconds, setSeconds] = useState(50);
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 工作区 Tab: Terminal or Notebook
  const [activeMainTab, setActiveMainTab] = useState<"terminal" | "notebook">("terminal");

  // 用户下拉菜单
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // 终端命令行交互
  const [terminalHistory, setTerminalHistory] = useState<
    { cmd: string; output: string | React.ReactNode }[]
  >([
    {
      cmd: "uname -a",
      output: "Linux dp-pro-ai-jupyter-18033926960 5.15.0-1048-gcp #56~20.04.1-Ubuntu SMP x86_64 GNU/Linux",
    },
    {
      cmd: "ls -lh /home/jovyan/datasets/",
      output: "total 0\nlrwxrwxrwx 1 jovyan jovyan 42 Aug 24 20:50 ecommerce_user_behavior -> /mnt/uusima/public_datasets/ds_001 (ro)\nlrwxrwxrwx 1 jovyan jovyan 38 Aug 24 20:50 nlp_intent_sentiment_corpus -> /mnt/uusima/public_datasets/ds_003 (ro)",
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const jupyterFileInputRef = useRef<HTMLInputElement>(null);

  // 用户自主上传的文件列表
  const [userUploadedFiles, setUserUploadedFiles] = useState<
    { name: string; size: string; time: string; type: string }[]
  >([]);

  const handleJupyterFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.max(1, Math.round(file.size / 1024))} KB`;
      
      setUserUploadedFiles((prev) => [
        {
          name: file.name,
          size: sizeStr,
          time: "刚刚",
          type: file.name.endsWith(".ipynb") ? "notebook" : file.name.endsWith(".py") ? "python" : file.name.endsWith(".csv") ? "csv" : "file",
        },
        ...prev,
      ]);
      setToastMessage(`文件 ${file.name} (${sizeStr}) 上传成功`);
      setTimeout(() => setToastMessage(null), 3000);
      e.target.value = "";
    }
  };

  // 文件树展开状态
  const [isFileTreeExpanded, setIsFileTreeExpanded] = useState<{ [key: string]: boolean }>({
    root: true,
    datasets: true,
    ecommerce: true,
  });

  const toggleFolder = (key: string) => {
    setIsFileTreeExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Notebook 代码单元格执行状态
  const [cellCode, setCellCode] = useState(`import pandas as pd
import numpy as np

# 从只读挂载目录加载数据集
data_path = "/home/jovyan/datasets/ecommerce_user_behavior/data.csv"
print(f"Loading dataset from: {data_path} (Read-Only Symlink)")

df = pd.DataFrame({
    'user_id': [1002341, 1002342, 1002343, 1002344, 1002345],
    'age_group': ['25-34', '18-24', '35-49', '25-34', '50+'],
    'browse_sec': [480.2, 120.0, 890.5, 310.8, 640.4],
    'cart_adds': [3, 0, 6, 1, 4],
    'repurchased_30d': [1, 0, 1, 0, 1]
})
print("Dataset Shape:", df.shape)
df.head()`);

  const [isCellRunning, setIsCellRunning] = useState(false);
  const [cellOutput, setCellOutput] = useState<string | null>(null);

  const handleRunCell = () => {
    setIsCellRunning(true);
    setTimeout(() => {
      setIsCellRunning(false);
      setCellOutput(`Loading dataset from: /home/jovyan/datasets/ecommerce_user_behavior/data.csv (Read-Only Symlink)
Dataset Shape: (524800, 14)
Execution successfully completed in 0.42s`);
    }, 600);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const trimmed = currentInput.trim();
    let responseText = "";

    if (trimmed === "clear") {
      setTerminalHistory([]);
      setCurrentInput("");
      return;
    } else if (trimmed === "ls" || trimmed === "ls -la") {
      responseText = `total 28
drwxr-xr-x 1 jovyan jovyan 4096 Aug 24 20:50 .
drwxr-xr-x 1 root   root   4096 Aug 24 20:00 ..
drwxr-xr-x 3 jovyan jovyan 4096 Jul 20 14:00 Al-trainer-level3-pr3
drwxr-xr-x 2 jovyan jovyan 4096 Jun 10 11:30 Desktop
drwxr-xr-x 4 jovyan jovyan 4096 Aug 15 09:12 fashion_mnist
drwxr-xr-x 3 jovyan jovyan 4096 Aug 20 16:45 text_classification
drwxr-xr-x 2 jovyan jovyan 4096 Aug 24 20:50 datasets (Symlink Hub)
-rw-r--r-- 1 jovyan jovyan 2410 Aug 24 20:51 data_analysis.ipynb`;
    } else if (trimmed.startsWith("ls datasets") || trimmed.startsWith("ls /home/jovyan/datasets")) {
      const mountedNames = mountedDatasets.map((d) => d.mountPath.split("/").pop()).join("  ");
      responseText = mountedNames
        ? `[只读符号链接目录] /home/jovyan/datasets/:\n${mountedNames}`
        : "datasets 目录为空。请在左侧【数据中心】中点击一键挂载数据集。";
    } else if (trimmed === "df -h") {
      responseText = `Filesystem      Size  Used Avail Use% Mounted on
overlay          50G   14G   34G  30% /
/dev/sda1        50G   14G   34G  30% /home/jovyan
uusima-nas:/ds  500G  120G  380G  24% /mnt/uusima/public_datasets`;
    } else if (trimmed === "python -V" || trimmed === "python --version") {
      responseText = "Python 3.10.14 (main, Mar 19 2024, 21:46:29) [GCC 11.4.0]";
    } else if (trimmed === "help") {
      responseText = `常用指令:
- ls -la : 查看当前文件结构
- ls datasets/ : 查看挂载的数据集软链接
- python script.py : 运行Python脚本
- df -h : 查看当前容器磁盘与存储
- clear : 清屏`;
    } else {
      responseText = `bash: ${trimmed}: command executed (simulation response)`;
    }

    setTerminalHistory((prev) => [...prev, { cmd: trimmed, output: responseText }]);
    setCurrentInput("");
    setTimeout(() => {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerMount = (dsId: string) => {
    const res = toggleMount(dsId);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#1e1e1e] text-slate-200 overflow-hidden font-mono select-none">
      {/* 顶部环境状态栏 (对齐截图1) */}
      <header className="h-10 bg-[#f5f7fa] border-b border-slate-200 text-slate-700 flex items-center justify-between px-3 text-xs font-sans shadow-sm shrink-0 z-30">
        {/* 左侧环境名 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("lab-hall")}
            className="flex items-center gap-1 text-slate-500 hover:text-blue-600 font-medium px-2 py-1 rounded hover:bg-slate-200/60 transition-colors"
            title="返回实验大厅"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回详情</span>
          </button>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-1.5 font-medium text-slate-800">
            <span className="text-slate-500">实验环境：</span>
            <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="font-semibold">人工智能平台-jupyter</span>
            </div>
          </div>
        </div>

        {/* 中间使用时长计时 */}
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded border border-slate-200/80 shadow-2xs">
          <span className="text-slate-500 font-normal">本次环境使用时长:</span>
          <span className="font-mono font-bold text-slate-900 tracking-wider">
            {formatTime(seconds)}
          </span>
        </div>

        {/* 右侧系统监控与用户操作 */}
        <div className="flex items-center gap-3">
          {/* CPU & 内存 */}
          <div className="flex items-center gap-2 text-slate-600">
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span>CPU:</span>
              <div className="w-8 h-2 bg-slate-200 rounded overflow-hidden">
                <div className="w-1/6 h-full bg-emerald-500"></div>
              </div>
              <span className="font-mono text-slate-700">4%</span>
            </div>
            <div className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-mono">
              Mem: 121 MB / 16 GB
            </div>
          </div>

          {/* 视口与布局控制 */}
          <div className="flex items-center gap-1 text-slate-500">
            <button
              onClick={() => setActiveSideTab("datasets")}
              className={`p-1.5 rounded hover:bg-slate-200 hover:text-slate-800 ${
                activeSideTab === "datasets" ? "bg-blue-100 text-blue-700" : ""
              }`}
              title="数据中心"
            >
              <Database className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveMainTab(activeMainTab === "terminal" ? "notebook" : "terminal")}
              className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-800"
              title="切换终端 / Notebook"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-300" />

          {/* 用户身份切换下拉 (演示关键需求) */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-200 text-slate-700 font-medium transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser.avatarText}
              </span>
              <span>{currentUser.name}</span>
              <span className="text-[10px] bg-slate-200 text-slate-600 px-1 py-0.2 rounded">
                {currentUser.roleName}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-xl py-1.5 z-50 text-slate-700 text-xs animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">演示身份快速切换</div>
                  <div className="text-slate-800 font-medium mt-0.5">{currentUser.org}</div>
                </div>
                <div className="py-1">
                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                        currentUser.id === user.id ? "bg-blue-50/70 text-blue-600 font-semibold" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[9px]">
                          {user.avatarText}
                        </span>
                        <span>{user.name}</span>
                        <span className="text-[10px] text-slate-400">({user.roleName})</span>
                      </div>
                      {currentUser.id === user.id && <Check className="w-3 h-3 text-blue-600" />}
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate("dataset-hall");
                    }}
                    className="w-full text-left px-3 py-1.5 text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <Database className="w-3 h-3 text-blue-500" />
                    前往数据大厅
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate("lab-hall");
                    }}
                    className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                  >
                    <RotateCw className="w-3 h-3" />
                    退出并关闭实验环境
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 挂载成功轻量提示 Toast */}
      {toastMessage && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur text-white px-4 py-2 rounded-lg shadow-2xl border border-blue-500/40 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 主体工作区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧垂直图标导航栏 (对齐截图1: 简介、操作手册、关联课程、资源、数据中心、AI) */}
        <aside className="w-14 bg-[#ffffff] border-r border-slate-200 flex flex-col items-center py-3 justify-between shrink-0 select-none z-20 shadow-xs">
          <div className="flex flex-col items-center gap-4 w-full">
            <button
              onClick={() => {
                if (activeSideTab === "brief" && isSideDrawerOpen) {
                  setIsSideDrawerOpen(false);
                } else {
                  setActiveSideTab("brief");
                  setIsSideDrawerOpen(true);
                }
              }}
              className={`flex flex-col items-center justify-center w-11 h-12 rounded-lg text-[11px] font-sans transition-all ${
                activeSideTab === "brief" && isSideDrawerOpen
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Info className="w-4 h-4 mb-1" />
              <span>简介</span>
            </button>

            <button
              onClick={() => {
                if (activeSideTab === "manual" && isSideDrawerOpen) {
                  setIsSideDrawerOpen(false);
                } else {
                  setActiveSideTab("manual");
                  setIsSideDrawerOpen(true);
                }
              }}
              className={`flex flex-col items-center justify-center w-11 h-12 rounded-lg text-[11px] font-sans transition-all ${
                activeSideTab === "manual" && isSideDrawerOpen
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <FileText className="w-4 h-4 mb-1" />
              <span>操作手册</span>
            </button>

            <button
              onClick={() => {
                if (activeSideTab === "courses" && isSideDrawerOpen) {
                  setIsSideDrawerOpen(false);
                } else {
                  setActiveSideTab("courses");
                  setIsSideDrawerOpen(true);
                }
              }}
              className={`flex flex-col items-center justify-center w-11 h-12 rounded-lg text-[11px] font-sans transition-all ${
                activeSideTab === "courses" && isSideDrawerOpen
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <BookOpen className="w-4 h-4 mb-1" />
              <span>关联课程</span>
            </button>

            <button
              onClick={() => {
                if (activeSideTab === "resources" && isSideDrawerOpen) {
                  setIsSideDrawerOpen(false);
                } else {
                  setActiveSideTab("resources");
                  setIsSideDrawerOpen(true);
                }
              }}
              className={`flex flex-col items-center justify-center w-11 h-12 rounded-lg text-[11px] font-sans transition-all ${
                activeSideTab === "resources" && isSideDrawerOpen
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <HardDrive className="w-4 h-4 mb-1" />
              <span>资源</span>
            </button>

            {/* 数据中心 (核心亮点功能) */}
            <button
              onClick={() => {
                if (activeSideTab === "datasets" && isSideDrawerOpen) {
                  setIsSideDrawerOpen(false);
                } else {
                  setActiveSideTab("datasets");
                  setIsSideDrawerOpen(true);
                }
              }}
              className={`flex flex-col items-center justify-center w-11 h-12 rounded-lg text-[11px] font-sans transition-all ${
                activeSideTab === "datasets" && isSideDrawerOpen
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20"
                  : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Database className="w-4 h-4 mb-1" />
              <span>数据中心</span>
            </button>
          </div>

          <div className="flex flex-col items-center gap-3">
            {/* AI 助教 */}
            <button
              onClick={() => {
                if (activeSideTab === "ai" && isSideDrawerOpen) {
                  setIsSideDrawerOpen(false);
                } else {
                  setActiveSideTab("ai");
                  setIsSideDrawerOpen(true);
                }
              }}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
              title="智能助教"
            >
              <Bot className="w-5 h-5" />
            </button>
          </div>
        </aside>

        {/* 左侧可展开内容抽屉 (宽度 320px) */}
        {isSideDrawerOpen && (
          <div className="w-80 bg-[#ffffff] border-r border-slate-200 flex flex-col shrink-0 text-slate-800 font-sans z-10 shadow-sm animate-in slide-in-from-left-2 duration-200">
            {/* 抽屉头部 */}
            <div className="h-10 px-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                {activeSideTab === "datasets" && (
                  <>
                    <Database className="w-4 h-4 text-blue-600" />
                    <span>数据中心挂载管理</span>
                  </>
                )}
                {activeSideTab === "courses" && (
                  <>
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>关联课程列表</span>
                  </>
                )}
                {activeSideTab === "brief" && (
                  <>
                    <Info className="w-4 h-4 text-blue-600" />
                    <span>实验环境简介</span>
                  </>
                )}
                {activeSideTab === "manual" && (
                  <>
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>实验操作手册</span>
                  </>
                )}
                {activeSideTab === "resources" && (
                  <>
                    <HardDrive className="w-4 h-4 text-blue-600" />
                    <span>存储与计算资源</span>
                  </>
                )}
                {activeSideTab === "ai" && (
                  <>
                    <Bot className="w-4 h-4 text-purple-600" />
                    <span>AI 实验智能体</span>
                  </>
                )}
              </div>
              <button
                onClick={() => setIsSideDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs px-1.5 py-0.5 rounded hover:bg-slate-200/50"
              >
                收起
              </button>
            </div>

            {/* 抽屉内容区 */}
            <div className="flex-1 overflow-y-auto p-3 text-xs space-y-3">
              {/* Tab 1: 数据中心挂载面板 */}
              {activeSideTab === "datasets" && (
                <div className="space-y-3">
                  {/* 已挂载列表 */}
                  <div>
                    <div className="flex items-center justify-between text-slate-500 font-semibold text-[11px] mb-1.5">
                      <span>已挂载到当前环境 ({mountedDatasets.length})</span>
                      <span className="text-[10px] text-emerald-600">实时生效</span>
                    </div>

                    {mountedDatasets.length === 0 ? (
                      <div className="border border-dashed border-slate-200 rounded-lg p-4 text-center text-slate-400">
                        暂无挂载数据集，请从下方选择挂载
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {mountedDatasets.map((ds) => (
                          <div
                            key={ds.id}
                            className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 hover:bg-white transition-colors"
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <div className="font-semibold text-slate-800 line-clamp-1">
                                {ds.title}
                              </div>
                              <button
                                onClick={() => triggerMount(ds.id)}
                                className="text-red-500 hover:text-red-700 text-[11px] shrink-0 font-medium px-1.5 py-0.5 rounded hover:bg-red-50 cursor-pointer"
                                title="卸载软链接"
                              >
                                卸载
                              </button>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500">
                              <span className="bg-blue-50 text-blue-700 px-1 py-0.2 rounded font-medium border border-blue-100">
                                {ds.theme || ds.businessScenario || "行业场景"}
                              </span>
                              <span>{ds.fileSize}</span>
                            </div>
                            <div className="mt-2 bg-slate-100 px-2 py-1 rounded text-[10px] font-mono text-slate-600 flex items-center justify-between">
                              <span className="truncate">{ds.mountPath}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(ds.mountPath);
                                  setToastMessage("挂载路径已复制到剪贴板");
                                  setTimeout(() => setToastMessage(null), 2000);
                                }}
                                title="复制路径"
                                className="text-slate-400 hover:text-slate-700 ml-1"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 可用公共与个人数据集 */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-slate-500 font-semibold text-[11px] mb-2">
                      <span>可供挂载的数据集</span>
                    </div>

                    <div className="space-y-2">
                      {datasets
                        .filter((d) => !d.isMounted)
                        .slice(0, 4)
                        .map((ds) => (
                          <div
                            key={ds.id}
                            className="border border-slate-200 rounded-lg p-2.5 bg-white hover:border-blue-300 transition-all shadow-2xs"
                          >
                            <div className="font-semibold text-slate-800 text-xs line-clamp-1">
                              {ds.title}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500">
                              <span className="bg-blue-50 text-blue-700 px-1 py-0.2 rounded font-medium">
                                {ds.theme || ds.businessScenario || "行业场景"}
                              </span>
                              <span>{ds.fileSize}</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-50">
                              <span className="text-[10px] text-slate-400">
                                挂载 {ds.mountCount || 0} 次
                              </span>
                              <button
                                onClick={() => triggerMount(ds.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>一键挂载</span>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* 挂载更多数据集按钮 */}
                    <button
                      onClick={() => setIsMountModalOpen(true)}
                      className="w-full mt-2.5 py-2 border border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/60 hover:bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>搜索与挂载更多数据集...</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: 关联课程 (对齐截图1内容) */}
              {activeSideTab === "courses" && (
                <div className="space-y-3">
                  {/* 课程卡片 1 */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                    <div className="h-20 bg-gradient-to-br from-blue-400 to-indigo-600 p-2.5 text-white flex flex-col justify-between">
                      <div className="text-[10px] font-medium bg-white/20 backdrop-blur-xs px-1.5 py-0.5 rounded w-fit">
                        新大陆时代科技
                      </div>
                      <div className="font-bold text-xs">人工智能训练师 (高级工)</div>
                    </div>
                    <div className="p-2.5 space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-500">
                        <span>人工智能/机器学习</span>
                        <span>0 人在学</span>
                      </div>
                      <div className="text-slate-600 line-clamp-1">
                        课程概述: 人工智能训练师 (高级工) 核心实训
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-purple-600 font-semibold pt-1">
                        <span className="bg-purple-100 px-1.5 py-0.5 rounded">AI 智能体绑定</span>
                      </div>
                    </div>
                  </div>

                  {/* 课程卡片 2 */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                    <div className="h-20 bg-gradient-to-br from-sky-400 to-blue-600 p-2.5 text-white flex flex-col justify-between">
                      <div className="text-[10px] font-medium bg-white/20 backdrop-blur-xs px-1.5 py-0.5 rounded w-fit">
                        软件版实训
                      </div>
                      <div className="font-bold text-xs">AI学件-人工智能训练师（高级工）</div>
                    </div>
                    <div className="p-2.5 space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-500">
                        <span>人工智能/机器学习</span>
                        <span className="text-blue-600 font-medium">41 人在学</span>
                      </div>
                    </div>
                  </div>

                  {/* 课程卡片 3 */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                    <div className="h-20 bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 text-white flex flex-col justify-between">
                      <div className="text-[10px] font-medium bg-white/20 backdrop-blur-xs px-1.5 py-0.5 rounded w-fit">
                        深度学习课程
                      </div>
                      <div className="font-bold text-xs">深度学习应用技术</div>
                    </div>
                    <div className="p-2.5 space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-500">
                        <span>人工智能/深度学习</span>
                        <span className="text-blue-600 font-medium">23 人在学</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: 简介 */}
              {activeSideTab === "brief" && (
                <div className="space-y-3 text-slate-600 leading-relaxed">
                  <div className="font-semibold text-slate-800">实验环境规范</div>
                  <p>
                    Jupyter 是一个开源项目，提供交互式代码编写、可视化输出与 LaTeX 数学公式渲染。
                  </p>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="font-medium text-slate-700">预装环境与算力规格：</div>
                    <ul className="list-disc list-inside text-[11px] space-y-0.5 text-slate-500">
                      <li>Python 3.10.14 / PyTorch 2.3.0</li>
                      <li>NVIDIA CUDA 12.1</li>
                      <li>Pandas 2.2 / Scikit-Learn 1.4</li>
                      <li>配额：4-Core CPU / 16GB 内存</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 4: 操作手册 */}
              {activeSideTab === "manual" && (
                <div className="space-y-2.5 text-slate-600">
                  <div className="font-semibold text-slate-800">实验指引步骤</div>
                  <ol className="list-decimal list-inside space-y-2 text-[11px]">
                    <li className="font-medium text-slate-700">
                      <span>在左侧【数据中心】中点击挂载所需的数据集。</span>
                    </li>
                    <li className="font-medium text-slate-700">
                      <span>打开工作区中的 Notebook 文件或使用 Terminal。</span>
                    </li>
                    <li className="font-medium text-slate-700">
                      <span>使用只读路径读取数据并进行特征工程与模型训练。</span>
                    </li>
                  </ol>
                </div>
              )}

              {/* Tab 5: 资源与存储配额 */}
              {activeSideTab === "resources" && (
                <div className="space-y-3">
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                    <div className="flex justify-between font-semibold text-slate-700 text-xs">
                      <span>个人私有存储配额</span>
                      <span className="text-blue-600 font-mono font-bold">
                        {storageInfo.usedGB} GB / {storageInfo.totalGB} GB
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${storageInfo.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      仅计算个人非公开数据集，公开数据集不占配额。
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 6: AI 助教 */}
              {activeSideTab === "ai" && (
                <div className="space-y-3">
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-2.5 text-purple-900 text-[11px]">
                    <div className="font-bold flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5 text-purple-600" />
                      <span>UUSIMA 智慧实验助手</span>
                    </div>
                    <p className="mt-1 text-slate-600">
                      您好！我可以为您解释代码错误、分析已挂载数据集的数据分布或提供建模建议。
                    </p>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <button
                      onClick={() => {
                        setCellCode((prev) => prev + "\n\n# AI 推荐：计算各数值列相关系数矩阵\nprint(df.corr(numeric_only=True))");
                        setToastMessage("AI 代码片段已插入至 Notebook");
                        setTimeout(() => setToastMessage(null), 2000);
                      }}
                      className="w-full text-left p-2 rounded border border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/50 transition-colors"
                    >
                      💡 帮我生成探索性数据分析 (EDA) 常用代码
                    </button>
                    <button
                      onClick={() => {
                        setCellCode((prev) => prev + "\n\n# AI 推荐：缺失值检测\nprint(df.isnull().sum())");
                        setToastMessage("AI 缺失值检测代码已插入");
                        setTimeout(() => setToastMessage(null), 2000);
                      }}
                      className="w-full text-left p-2 rounded border border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/50 transition-colors"
                    >
                      🔍 检查当前数据集中的缺失值与异常分布
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* JupyterLab 中间工作区 (对齐截图1的主界面) */}
        <main className="flex-1 flex flex-col bg-[#ffffff] overflow-hidden text-slate-700 font-sans">
          {/* JupyterLab 顶部菜单栏 */}
          <div className="h-6 bg-[#f7f7f7] border-b border-slate-200 flex items-center px-2 text-[11px] text-slate-600 space-x-3 select-none shrink-0 font-sans">
            <span className="hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer">File</span>
            <span className="hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer">Edit</span>
            <span className="hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer">View</span>
            <span className="hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer">Run</span>
            <span className="hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer">Kernel</span>
            <span className="hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer">Git</span>
            <span className="hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer">Nbgrader</span>
            <span className="hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer">Tabs</span>
            <span className="hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer">Settings</span>
            <span className="hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer">Help</span>
          </div>

          {/* 选项卡栏与主分割视图 */}
          <div className="flex-1 flex overflow-hidden">
            {/* Jupyter 文件树导航面板 (左侧约 240px，对齐截图1) */}
            <div className="w-64 bg-[#fcfcfc] border-r border-slate-200 flex flex-col shrink-0">
              {/* 文件操作小工具条 */}
              <div className="p-2 border-b border-slate-200 flex items-center justify-between gap-1">
                <button
                  onClick={() => {
                    setActiveMainTab("notebook");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded p-1 flex items-center justify-center shadow-xs"
                  title="新建 Launcher / Notebook"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1 text-slate-500">
                  <button
                    onClick={() => {
                      setToastMessage("文件夹创建成功");
                      setTimeout(() => setToastMessage(null), 2000);
                    }}
                    className="p-1 hover:bg-slate-200 rounded"
                    title="新建文件夹"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => jupyterFileInputRef.current?.click()}
                    className="p-1 hover:bg-slate-200 rounded text-slate-600 hover:text-blue-600 transition-colors"
                    title="上传本地代码/数据集文件到工作区"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="file"
                    ref={jupyterFileInputRef}
                    onChange={handleJupyterFileUpload}
                    className="hidden"
                    accept=".py,.ipynb,.csv,.json,.txt,.zip,.tar.gz,.h5,.onnx"
                  />
                  <button
                    onClick={() => {
                      setToastMessage("文件目录已刷新");
                      setTimeout(() => setToastMessage(null), 2000);
                    }}
                    className="p-1 hover:bg-slate-200 rounded"
                    title="刷新"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 搜索框 */}
              <div className="p-2 border-b border-slate-100">
                <input
                  type="text"
                  placeholder="Filter files by name"
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-blue-400 placeholder:text-slate-400"
                />
              </div>

              {/* 路径指示器 */}
              <div className="px-2.5 py-1 text-[11px] text-slate-500 font-mono border-b border-slate-100 flex items-center gap-1">
                <Folder className="w-3 h-3 text-blue-500" />
                <span>/</span>
              </div>

              {/* 文件与目录列表 */}
              <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 text-xs text-slate-700 font-mono">
                {/* 用户自定义上传的文件 */}
                {userUploadedFiles.map((uf, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (uf.name.endsWith(".ipynb")) {
                        setActiveMainTab("notebook");
                      }
                      setToastMessage(`已选择文件: ${uf.name}`);
                      setTimeout(() => setToastMessage(null), 2000);
                    }}
                    className="flex items-center justify-between py-1 px-1.5 rounded bg-blue-50/50 hover:bg-blue-100/60 text-blue-900 border border-blue-200/60 cursor-pointer animate-in fade-in"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      {uf.type === "notebook" ? (
                        <FileCode className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      ) : uf.type === "python" ? (
                        <FileCode className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      ) : uf.type === "csv" ? (
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                      <span className="truncate font-semibold text-[11px]">{uf.name}</span>
                    </div>
                    <span className="text-[10px] text-blue-500 shrink-0 font-sans">{uf.size}</span>
                  </div>
                ))}

                {/* 默认目录项 */}
                <div className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-100 cursor-pointer">
                  <div className="flex items-center gap-1.5 truncate">
                    <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">AI-trainer-level3-pr3</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">a month ago</span>
                </div>

                <div className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-100 cursor-pointer">
                  <div className="flex items-center gap-1.5 truncate">
                    <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">Desktop</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">a year ago</span>
                </div>

                <div className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-100 cursor-pointer">
                  <div className="flex items-center gap-1.5 truncate">
                    <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">fashion_mnist</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">a month ago</span>
                </div>

                <div className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-100 cursor-pointer">
                  <div className="flex items-center gap-1.5 truncate">
                    <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">text_classification</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">a month ago</span>
                </div>

                {/* 数据中心挂载的虚拟目录 (核心交互) */}
                <div className="mt-1 pt-1 border-t border-slate-200">
                  <div
                    onClick={() => toggleFolder("datasets")}
                    className="flex items-center justify-between py-1 px-1.5 rounded bg-blue-50/60 text-blue-900 font-semibold cursor-pointer hover:bg-blue-100/70"
                  >
                    <div className="flex items-center gap-1.5">
                      {isFileTreeExpanded.datasets ? (
                        <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
                      )}
                      <Database className="w-3.5 h-3.5 text-blue-600" />
                      <span>datasets/</span>
                    </div>
                    <span className="text-[9px] bg-blue-600 text-white px-1 rounded">
                      只读挂载 ({mountedDatasets.length})
                    </span>
                  </div>

                  {/* 展开的已挂载数据集子目录 */}
                  {isFileTreeExpanded.datasets && (
                    <div className="pl-4 space-y-0.5 mt-0.5">
                      {mountedDatasets.map((ds) => (
                        <div key={ds.id} className="space-y-0.5">
                          <div
                            onClick={() => toggleFolder(ds.id)}
                            className="flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-slate-100 cursor-pointer text-slate-800"
                          >
                            <ChevronRight className="w-3 h-3 text-slate-400" />
                            <Folder className="w-3.5 h-3.5 text-blue-500" />
                            <span className="truncate text-[11px]">
                              {ds.mountPath.split("/").pop()}
                            </span>
                          </div>
                          <div className="pl-4 space-y-0.5 text-[10px] text-slate-500">
                            <div className="flex items-center gap-1 py-0.5 px-1 hover:bg-slate-100 rounded cursor-pointer">
                              <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                              <span>data.csv</span>
                              <span className="text-[9px] text-slate-400">({ds.fileSize})</span>
                            </div>
                            <div className="flex items-center gap-1 py-0.5 px-1 hover:bg-slate-100 rounded cursor-pointer">
                              <FileCode className="w-3 h-3 text-amber-600" />
                              <span>metadata.json</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notebook 文件 */}
                <div
                  onClick={() => setActiveMainTab("notebook")}
                  className={`flex items-center justify-between py-1 px-1.5 rounded cursor-pointer ${
                    activeMainTab === "notebook" ? "bg-blue-100 text-blue-800 font-semibold" : "hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <FileCode className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate">data_analysis.ipynb</span>
                  </div>
                  <span className="text-[10px] text-slate-400">just now</span>
                </div>
              </div>
            </div>

            {/* 右侧交互工作台：Terminal 或 Jupyter Notebook */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden text-slate-200">
              {/* 工作区 Tab 栏 */}
              <div className="h-8 bg-[#252526] border-b border-[#333333] flex items-center justify-between px-2 text-xs select-none">
                <div className="flex items-center h-full space-x-1">
                  <button
                    onClick={() => setActiveMainTab("terminal")}
                    className={`h-full px-3 flex items-center gap-2 border-t-2 text-xs transition-colors ${
                      activeMainTab === "terminal"
                        ? "bg-[#1e1e1e] border-blue-500 text-white font-medium"
                        : "bg-[#2d2d2d] border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>jovyan@dp-pro-ai-jupyter-1: 1</span>
                  </button>

                  <button
                    onClick={() => setActiveMainTab("notebook")}
                    className={`h-full px-3 flex items-center gap-2 border-t-2 text-xs transition-colors ${
                      activeMainTab === "notebook"
                        ? "bg-[#1e1e1e] border-orange-500 text-white font-medium"
                        : "bg-[#2d2d2d] border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-orange-400" />
                    <span>data_analysis.ipynb</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-xs font-sans">
                  <span>Python 3 (ipykernel)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
              </div>

              {/* 终端视图 (Terminal) */}
              {activeMainTab === "terminal" && (
                <div className="flex-1 flex flex-col p-3 font-mono text-xs overflow-y-auto bg-[#1e1e1e] text-slate-100">
                  <div className="text-emerald-400 font-bold mb-2">
                    UUSIMA AI Platform Jupyter Cloud Container (Ubuntu 20.04 LTS / CUDA 12.1)
                  </div>
                  <div className="text-slate-400 mb-3">
                    Type <code className="text-amber-300">help</code> or <code className="text-amber-300">ls -la datasets/</code> to inspect mounted read-only datasets.
                  </div>

                  {/* 历史输出 */}
                  {terminalHistory.map((item, idx) => (
                    <div key={idx} className="mb-2 space-y-0.5">
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-emerald-400 font-semibold">
                          jovyan@dp-pro-ai-jupyter-18033926960:~$
                        </span>
                        <span className="text-white">{item.cmd}</span>
                      </div>
                      <div className="text-slate-300 whitespace-pre-wrap pl-4 font-mono text-[11px] leading-relaxed">
                        {item.output}
                      </div>
                    </div>
                  ))}

                  {/* 当前交互输入行 */}
                  <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 mt-1">
                    <span className="text-emerald-400 font-semibold shrink-0">
                      jovyan@dp-pro-ai-jupyter-18033926960:~$
                    </span>
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      placeholder="Enter command (e.g. ls datasets/ , df -h , clear)"
                      className="flex-1 bg-transparent text-white focus:outline-none font-mono caret-emerald-400 placeholder:text-slate-600"
                      autoFocus
                    />
                  </form>
                  <div ref={terminalEndRef} />
                </div>
              )}

              {/* Jupyter Notebook 交互视图 */}
              {activeMainTab === "notebook" && (
                <div className="flex-1 flex flex-col bg-[#ffffff] text-slate-800 overflow-y-auto font-sans">
                  {/* Notebook 工具条 */}
                  <div className="p-2 border-b border-slate-200 bg-slate-50 flex items-center gap-2 text-xs">
                    <button
                      onClick={handleRunCell}
                      disabled={isCellRunning}
                      className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium shadow-xs transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCellRunning ? "Running..." : "Run"}</span>
                    </button>
                    <button
                      onClick={() => {
                        setCellOutput(null);
                        setToastMessage("Kernel Restarted");
                        setTimeout(() => setToastMessage(null), 2000);
                      }}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                      title="Restart Kernel"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-4 w-px bg-slate-300" />
                    <span className="text-slate-500 font-mono text-[11px]">
                      Cell Type: Code (Python 3)
                    </span>
                  </div>

                  {/* Notebook 单元格 */}
                  <div className="p-4 space-y-4 max-w-4xl">
                    {/* Markdown 说明单元格 */}
                    <div className="border border-slate-200 rounded-lg p-3 bg-blue-50/30 text-xs space-y-1">
                      <div className="font-bold text-slate-900"># 实验任务：基于数据中心挂载数据的特征工程与建模</div>
                      <p className="text-slate-600">
                        本实验使用数据中心一键挂载的软链接数据集进行探索性分析。软链接路径位于 <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-blue-700">/home/jovyan/datasets/</code>。
                      </p>
                    </div>

                    {/* 代码单元格 */}
                    <div className="border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
                      <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-mono">
                        <span>In [ 1 ]:</span>
                        <span className="text-[11px] text-slate-400">Python 3.10</span>
                      </div>
                      <textarea
                        value={cellCode}
                        onChange={(e) => setCellCode(e.target.value)}
                        rows={12}
                        className="w-full p-3 font-mono text-xs text-slate-900 bg-[#fafafa] focus:outline-none resize-none leading-relaxed"
                      />

                      {/* 输出区域 */}
                      {cellOutput && (
                        <div className="border-t border-slate-200 bg-white p-3 font-mono text-xs space-y-2">
                          <div className="text-slate-500 text-[11px]">Out [ 1 ]:</div>
                          <pre className="text-slate-800 whitespace-pre-wrap text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                            {cellOutput}
                          </pre>
                          {/* 渲染 Pandas Dataframe 结构 */}
                          <div className="overflow-x-auto border border-slate-200 rounded mt-2">
                            <table className="w-full text-left text-xs text-slate-700">
                              <thead className="bg-slate-100 text-slate-900 font-semibold border-b border-slate-200">
                                <tr>
                                  <th className="p-2 border-r border-slate-200">#</th>
                                  <th className="p-2 border-r border-slate-200">user_id</th>
                                  <th className="p-2 border-r border-slate-200">age_group</th>
                                  <th className="p-2 border-r border-slate-200">browse_sec</th>
                                  <th className="p-2 border-r border-slate-200">cart_adds</th>
                                  <th className="p-2">repurchased_30d</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                <tr>
                                  <td className="p-2 font-mono text-slate-400 border-r border-slate-200">0</td>
                                  <td className="p-2 border-r border-slate-200">1002341</td>
                                  <td className="p-2 border-r border-slate-200">25-34</td>
                                  <td className="p-2 border-r border-slate-200">480.2</td>
                                  <td className="p-2 border-r border-slate-200">3</td>
                                  <td className="p-2 font-bold text-emerald-600">1</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-slate-400 border-r border-slate-200">1</td>
                                  <td className="p-2 border-r border-slate-200">1002342</td>
                                  <td className="p-2 border-r border-slate-200">18-24</td>
                                  <td className="p-2 border-r border-slate-200">120.0</td>
                                  <td className="p-2 border-r border-slate-200">0</td>
                                  <td className="p-2 font-bold text-slate-400">0</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-slate-400 border-r border-slate-200">2</td>
                                  <td className="p-2 border-r border-slate-200">1002343</td>
                                  <td className="p-2 border-r border-slate-200">35-49</td>
                                  <td className="p-2 border-r border-slate-200">890.5</td>
                                  <td className="p-2 border-r border-slate-200">6</td>
                                  <td className="p-2 font-bold text-emerald-600">1</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 底部状态栏 (对齐截图1底部) */}
          <footer className="h-6 bg-[#f7f7f7] border-t border-slate-200 flex items-center justify-between px-3 text-[11px] text-slate-500 font-mono shrink-0 select-none">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Simple Mode: Active
              </span>
              <span>1 $_</span>
              <span>0 🗲</span>
              <span>Mem: 120.62 MB</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">
                jovyan@dp-pro-ai-jupyter-18033926960-5748b48bb7-t9kg6: ~
              </span>
            </div>
          </footer>
        </main>
      </div>

      {/* 实验内挂载数据集弹窗 */}
      <MountDatasetModal
        isOpen={isMountModalOpen}
        onClose={() => setIsMountModalOpen(false)}
        datasets={datasets}
        currentUserName={currentUser.name}
        currentUserRole={currentUser.role}
        onToggleMount={toggleMount}
        onSuccessToast={(msg) => {
          setToastMessage(msg);
          setTimeout(() => setToastMessage(null), 3000);
        }}
      />
    </div>
  );
}
