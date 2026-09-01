import React, { useState, useMemo, useRef } from "react";
import {
  Search,
  Upload,
  Database,
  Tag,
  Download,
  Eye,
  Bookmark,
  BookmarkCheck,
  Plus,
  RotateCw,
  Folder,
  Layers,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  FileCode,
  FileArchive,
  CheckCircle2,
  AlertCircle,
  Clock,
  HardDrive,
  User,
  SlidersHorizontal,
  Lock,
  Globe,
  Share2,
  Trash2,
  BookOpen,
  ArrowRight,
  Grid3X3,
  List,
  Sparkles,
  Edit3,
  Image as ImageIcon,
  Check,
  X,
  RotateCcw,
  CheckSquare,
  Square,
  ExternalLink,
  UploadCloud,
  File,
  Files,
  FolderPlus,
  Paperclip,
} from "lucide-react";
import { useData } from "../context/DataContext";
import {
  DatasetItem,
  DatasetFileTreeNode,
  BUSINESS_SCENARIOS,
  FILE_FORMATS,
  DATASET_OVERVIEW_TEMPLATE,
  extractDatasetSummary,
} from "../data/mockData";
import Header from "../components/Header";
import { EditDatasetModal } from "../components/EditDatasetModal";
import { DeleteDatasetModal } from "../components/DeleteDatasetModal";
import { DatasetCover } from "../components/DatasetCover";
import { CoverSelectorSection } from "../components/CoverSelectorSection";

interface DatasetHallProps {
  onNavigate: (view: string) => void;
}

export default function DatasetHall({ onNavigate }: DatasetHallProps) {
  const {
    currentUser,
    datasets,
    toggleFavorite,
    addDataset,
    deleteDataset,
    storageInfo,
    setSelectedDatasetId,
    batchFavoriteDatasets,
    batchDeleteDatasets,
    batchUpdateVisibility,
  } = useData();

  // 1. 核心视图 Tab: "all" (全部公开) | "my_uploaded" (我的数据) | "favorites" (我的收藏)
  const [activeTab, setActiveTab] = useState<"all" | "my_uploaded" | "favorites">("all");

  // 2. 业务应用场景筛选 (多选/单选) 与 展开/搜索状态
  const [selectedScenario, setSelectedScenario] = useState<string>("all");
  const [isScenarioExpanded, setIsScenarioExpanded] = useState<boolean>(false);
  const [scenarioSearchQuery, setScenarioSearchQuery] = useState<string>("");

  // 3. 搜索关键词
  const [searchKeyword, setSearchKeyword] = useState("");

  // 4. 辅助筛选: 格式与排序
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"default" | "newest" | "downloads" | "size">("default");

  // 5. 展示模式: 网格 (grid) vs 列表 (list)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // 6. 批量管理模式
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 7. 弹窗控制
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingDataset, setEditingDataset] = useState<DatasetItem | null>(null);
  const [deletingDataset, setDeletingDataset] = useState<DatasetItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 8. 统计数据
  const stats = useMemo(() => {
    const allCount = datasets.filter((d) => d.visibility === "public" || d.visibility === ("school" as any)).length;
    const myCount = datasets.filter((d) => d.visibility === "private" && (d.author?.name === currentUser.name || d.author?.role === currentUser.role || currentUser.role === "admin")).length;
    const favCount = datasets.filter((d) => d.isFavorite).length;

    // 各业务场景下的数量统计
    const scenarioCounts: Record<string, number> = {};
    BUSINESS_SCENARIOS.forEach((sc) => {
      scenarioCounts[sc] = datasets.filter((d) => {
        const hasTheme = d.theme === sc || (d.themes && d.themes.includes(sc));
        return hasTheme;
      }).length;
    });

    return { allCount, myCount, favCount, scenarioCounts };
  }, [datasets, currentUser]);

  // 9. 数据集过滤流水线
  const filteredDatasets = useMemo(() => {
    return datasets
      .filter((item) => {
        // 范围 Tab 过滤
        if (activeTab === "my_uploaded") {
          // 仅展示标签为【个人】（私有）的数据集
          const isPersonal = item.visibility === "private";
          const isMyUpload = item.author?.name === currentUser.name || item.author?.role === currentUser.role || currentUser.role === "admin";
          if (!isPersonal || !isMyUpload) return false;
        } else if (activeTab === "favorites") {
          if (!item.isFavorite) return false;
        } else {
          // 全部公开数据: 仅展示公开数据集 (排除个人私有数据集)
          if (item.visibility === "private") return false;
        }

        // 业务场景过滤
        if (selectedScenario !== "all") {
          const matchesScenario =
            item.theme === selectedScenario ||
            (item.themes && item.themes.includes(selectedScenario));
          if (!matchesScenario) return false;
        }

        // 格式过滤
        if (selectedFormat !== "all" && item.format !== selectedFormat) {
          return false;
        }

        // 搜索关键词 (匹配标题、短描述、业务场景、格式、作者)
        if (searchKeyword.trim()) {
          const query = searchKeyword.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchDesc = item.description?.toLowerCase().includes(query);
          const matchTheme = item.theme?.toLowerCase().includes(query) || item.themes?.some((t) => t.toLowerCase().includes(query));
          const matchAuthor = item.author?.name.toLowerCase().includes(query);
          const matchFormat = item.format.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchTheme && !matchAuthor && !matchFormat) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
        }
        if (sortBy === "downloads") {
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        }
        if (sortBy === "size") {
          return (b.sizeBytes || 0) - (a.sizeBytes || 0);
        }
        // 默认排序: 收藏优先，而后按创建时间倒序
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
      });
  }, [datasets, activeTab, selectedScenario, selectedFormat, searchKeyword, sortBy, currentUser]);

  // 批量选择处理
  const toggleSelect = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredDatasets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDatasets.map((d) => d.id));
    }
  };

  // 批量操作 (仅批量收藏、批量取消收藏、批量删除，无公开/私有切换)
  const handleBatchFavorite = (fav: boolean) => {
    batchFavoriteDatasets(selectedIds, fav);
    showToast(`已批量${fav ? "收藏" : "取消收藏"} ${selectedIds.length} 个数据集`);
    setSelectedIds([]);
  };

  const handleBatchDelete = () => {
    if (confirm(`确认批量删除选中的 ${selectedIds.length} 个数据集吗？`)) {
      batchDeleteDatasets(selectedIds);
      showToast(`已删除 ${selectedIds.length} 个数据集`);
      setSelectedIds([]);
    }
  };

  // 点击卡片进入详情
  const handleCardClick = (id: string) => {
    if (isBatchMode) {
      toggleSelect(id);
      return;
    }
    setSelectedDatasetId(id);
    onNavigate("dataset-detail");
  };

  // 多文件上传数据集状态与文件处理
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  interface UploadedFileInfo {
    id: string;
    file: File;
    name: string;
    size: string;
    sizeBytes: number;
    format: DatasetItem["format"];
    rawExtension: string;
    role?: "main" | "train" | "test" | "val" | "doc" | "config" | "label" | "other";
  }

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileInfo[]>([]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadScenario, setUploadScenario] = useState<string>("智慧农业");
  const [uploadScenarioSearch, setUploadScenarioSearch] = useState<string>("");
  const [uploadFormat, setUploadFormat] = useState<DatasetItem["format"]>("CSV");
  const [uploadShortDesc, setUploadShortDesc] = useState("");
  const [uploadOverviewDoc, setUploadOverviewDoc] = useState("");
  const [uploadPermission, setUploadPermission] = useState<"download_and_mount" | "mount_only">("download_and_mount");
  const [uploadCoverType, setUploadCoverType] = useState<"algorithm" | "preset" | "upload">("algorithm");
  const [uploadCustomCover, setUploadCustomCover] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 计算累计总大小
  const totalSizeBytes = useMemo(() => {
    return uploadedFiles.reduce((acc, f) => acc + f.sizeBytes, 0);
  }, [uploadedFiles]);

  const totalSizeStr = useMemo(() => {
    if (totalSizeBytes === 0) return "0 KB";
    if (totalSizeBytes < 1024 * 1024) {
      return `${(totalSizeBytes / 1024).toFixed(1)} KB`;
    } else if (totalSizeBytes < 1024 * 1024 * 1024) {
      return `${(totalSizeBytes / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(totalSizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  }, [totalSizeBytes]);

  // 解析并追加选择的文件列表
  const handleFilesProcess = (incomingFiles: FileList | File[]) => {
    const fileArray = Array.from(incomingFiles);
    if (fileArray.length === 0) return;

    const newItems: UploadedFileInfo[] = fileArray.map((file, idx) => {
      const fileName = file.name;
      const ext = fileName.split(".").pop()?.toLowerCase() || "";
      let detectedFormat: DatasetItem["format"] = "CSV";

      if (["json", "jsonl", "geojson"].includes(ext)) {
        detectedFormat = "JSON";
      } else if (["parquet", "pq"].includes(ext)) {
        detectedFormat = "Parquet";
      } else if (["zip", "tar", "gz", "tgz", "7z", "rar"].includes(ext)) {
        detectedFormat = "ZIP";
      } else if (["xlsx", "xls"].includes(ext)) {
        detectedFormat = "XLSX";
      } else if (["txt", "md", "tsv", "log"].includes(ext)) {
        detectedFormat = "TXT";
      } else if (["jpg", "jpeg", "png", "webp", "bmp", "svg", "gif"].includes(ext)) {
        detectedFormat = "Images";
      }

      // 格式化单个文件大小
      let sizeStr = "";
      if (file.size < 1024 * 1024) {
        sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
      } else if (file.size < 1024 * 1024 * 1024) {
        sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      } else {
        sizeStr = `${(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
      }

      // 智能识别文件角色
      const lower = fileName.toLowerCase();
      let role: UploadedFileInfo["role"] = "other";
      if (lower.includes("train")) role = "train";
      else if (lower.includes("test")) role = "test";
      else if (lower.includes("val") || lower.includes("dev")) role = "val";
      else if (lower.includes("label") || lower.includes("class") || lower.includes("target")) role = "label";
      else if (lower.includes("readme") || lower.includes("dict") || lower.includes("doc")) role = "doc";
      else if (lower.includes("config") || lower.includes("yaml") || lower.includes("yml")) role = "config";
      else if (["csv", "json", "parquet", "xlsx"].includes(ext)) role = "main";

      return {
        id: `f-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        file,
        name: fileName,
        size: sizeStr,
        sizeBytes: file.size,
        format: detectedFormat,
        rawExtension: ext ? ext.toUpperCase() : "FILE",
        role,
      };
    });

    setUploadedFiles((prev) => {
      // 过滤掉完全同名且大小一致的重复文件
      const existingSignatures = new Set(prev.map((f) => `${f.name}-${f.sizeBytes}`));
      const uniqueNew = newItems.filter((f) => !existingSignatures.has(`${f.name}-${f.sizeBytes}`));
      const combined = [...prev, ...(uniqueNew.length > 0 ? uniqueNew : newItems)];

      // 若未填标题，则自动使用首个主要文件名填充
      if (!uploadTitle.trim() && combined.length > 0) {
        const primary = combined.find((f) => f.role === "main" || f.role === "train") || combined[0];
        const cleanName = primary.name
          .replace(/\.[^/.]+$/, "")
          .replace(/^(train|test|val|dataset|data)[_\-\s]*/i, "")
          .replace(/[_\-\.]+/g, " ")
          .trim();
        setUploadTitle(cleanName || primary.name.replace(/\.[^/.]+$/, ""));
      }

      // 自动推断主要格式
      if (combined.length > 0) {
        const formats = combined.map((f) => f.format);
        if (formats.every((f) => f === "Images")) {
          setUploadFormat("Images");
        } else if (formats.includes("ZIP")) {
          setUploadFormat("ZIP");
        } else if (formats.includes("Parquet")) {
          setUploadFormat("Parquet");
        } else if (formats.includes("JSON")) {
          setUploadFormat("JSON");
        } else if (formats.includes("CSV")) {
          setUploadFormat("CSV");
        } else if (formats.includes("XLSX")) {
          setUploadFormat("XLSX");
        } else if (formats.includes("TXT")) {
          setUploadFormat("TXT");
        }
      }

      return combined;
    });

    setUploadError(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesProcess(e.target.files);
      // 清空 input 使得再次选择相同文件也能触发
      e.target.value = "";
    }
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearAllFiles = () => {
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesProcess(e.dataTransfer.files);
    }
  };

  const resetUploadForm = () => {
    setUploadedFiles([]);
    setUploadTitle("");
    setUploadScenario("智慧农业");
    setUploadScenarioSearch("");
    setUploadFormat("CSV");
    setUploadShortDesc("");
    setUploadOverviewDoc("");
    setUploadPermission("download_and_mount");
    setUploadCoverType("algorithm");
    setUploadCustomCover("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveUpload = () => {
    if (uploadedFiles.length === 0) {
      setUploadError("请至少选择或拖拽上传一份数据集源文件！");
      return;
    }
    if (!uploadTitle.trim()) {
      setUploadError("请输入数据集名称！");
      return;
    }
    if (!uploadShortDesc.trim()) {
      setUploadError("请输入数据集简短描述（用于卡片展示）！");
      return;
    }

    const dirName = uploadTitle.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");

    // 构建完整文件目录树 (针对上传的压缩包进行目录展开)
    const fileTree: DatasetFileTreeNode[] = uploadedFiles.map((f) => {
      const isZip = ["zip", "tar", "gz", "tgz", "7z", "rar"].includes(f.rawExtension.toLowerCase());
      if (isZip) {
        return {
          name: `${f.name} (压缩文件包)`,
          type: "folder",
          path: `/${dirName}/${f.name}`,
          childrenCount: 5,
          size: f.size,
          children: [
            {
              name: "README.md",
              type: "file",
              extension: "md",
              size: "4.2 KB",
              path: `/${dirName}/${f.name}/README.md`,
            },
            {
              name: "data_dictionary.json",
              type: "file",
              extension: "json",
              size: "2.8 KB",
              path: `/${dirName}/${f.name}/data_dictionary.json`,
            },
            {
              name: "train_data.csv",
              type: "file",
              extension: "csv",
              size: "18.4 MB",
              path: `/${dirName}/${f.name}/train_data.csv`,
            },
            {
              name: "sample_001.jpg",
              type: "file",
              extension: "jpg",
              size: "240 KB",
              path: `/${dirName}/${f.name}/sample_001.jpg`,
            },
            {
              name: "baseline_weights.pth",
              type: "file",
              extension: "pth",
              size: "82.5 MB",
              path: `/${dirName}/${f.name}/baseline_weights.pth`,
            },
          ],
        };
      }
      return {
        name: f.name,
        type: "file",
        size: f.size,
        path: `/${dirName}/${f.name}`,
        extension: f.rawExtension.toLowerCase(),
      };
    });

    const rootTree: DatasetFileTreeNode[] = [
      {
        name: uploadTitle.trim(),
        type: "folder",
        path: `/${dirName}`,
        childrenCount: fileTree.length,
        size: totalSizeStr,
        children: fileTree,
      },
    ];

    // 如果包含图片类文件，生成样本预览图列表
    const imageFiles = uploadedFiles.filter((f) => f.format === "Images");
    let previewImages: DatasetItem["previewImages"] = undefined;
    if (imageFiles.length > 0) {
      previewImages = imageFiles.map((f, idx) => ({
        name: f.name,
        label: f.role === "train" ? "训练集" : f.role === "val" ? "验证集" : "样本数据",
        url: `https://picsum.photos/seed/ds-${idx}-${dirName.slice(0, 6)}/600/400`,
      }));
    }

    // 如果包含表格类文件，生成预览列与行
    const tabularFiles = uploadedFiles.filter(
      (f) => f.format === "CSV" || f.format === "XLSX" || f.format === "Parquet" || f.format === "JSON"
    );
    let previewRows: Record<string, any>[] | undefined = undefined;
    let columns: DatasetItem["columns"] = undefined;

    if (tabularFiles.length > 0 && uploadFormat !== "Images" && uploadFormat !== "TXT") {
      columns = [
        { name: "id", type: "integer", nullCount: 0, nullPercentage: "0%", sampleValues: ["1001", "1002", "1003"] },
        { name: "feature_1", type: "float", nullCount: 0, nullPercentage: "0%", mean: "45.2", min: "12.0", max: "89.5", sampleValues: ["32.4", "58.1", "41.0"] },
        { name: "feature_2", type: "float", nullCount: 0, nullPercentage: "0%", mean: "33.8", min: "20.1", max: "68.4", sampleValues: ["28.5", "35.2", "42.0"] },
        { name: "category", type: "string", nullCount: 0, nullPercentage: "0%", uniqueCount: 4, sampleValues: ["Type_A", "Type_B", "Type_C"] },
        { name: "timestamp", type: "string", nullCount: 0, nullPercentage: "0%", sampleValues: ["2025-06-01 10:30:00", "2025-06-02 10:30:00"] },
        { name: "is_valid", type: "boolean", nullCount: 0, nullPercentage: "0%", sampleValues: ["true", "false"] },
      ];
      previewRows = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        feature_1: Number((Math.random() * 80 + 10).toFixed(2)),
        feature_2: Number((Math.random() * 50 + 20).toFixed(2)),
        category: `Type_${String.fromCharCode(65 + (i % 4))}`,
        timestamp: `2025-06-${(i + 1).toString().padStart(2, "0")} 10:30:00`,
        is_valid: i % 5 !== 0,
      }));
    }

    const fileSummaryStr =
      uploadedFiles.length === 1
        ? `单文件（${uploadedFiles[0].name}）`
        : `共 ${uploadedFiles.length} 份数据文件（${uploadedFiles.slice(0, 2).map((f) => f.name).join(", ")}${uploadedFiles.length > 2 ? " 等" : ""}）`;

    const newDs: DatasetItem = {
      id: `ds-${Date.now().toString().slice(-4)}`,
      title: uploadTitle.trim(),
      description: uploadShortDesc.trim(),
      techDomain: "通用数据",
      techDomains: [],
      theme: uploadScenario,
      themes: [uploadScenario],
      format: uploadFormat,
      fileSize: totalSizeStr,
      sizeBytes: totalSizeBytes,
      visibility: "private",
      permission: uploadPermission,
      version: "V1.0",
      versionsList: [
        {
          version: "V1.0",
          updatedAt: new Date().toISOString().slice(0, 10),
          author: currentUser.name,
          size: totalSizeStr,
          sizeBytes: totalSizeBytes,
          changelog: `初版上传发布（${fileSummaryStr}）。`,
        },
      ],
      author: {
        name: currentUser.name,
        role: currentUser.role,
        org: currentUser.org || "AI数据中心",
      },
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      mountCount: 0,
      downloadCount: 0,
      favoriteCount: 0,
      isFavorite: false,
      isMounted: false,
      mountPath: `/home/jovyan/datasets/${dirName}`,
      rowCount: 10000,
      columnCount: 8,
      overviewDoc: uploadOverviewDoc.trim() || undefined,
      customCoverImage: uploadCoverType === "algorithm" ? undefined : uploadCustomCover || undefined,
      associatedCourses: [],
      fileTree: rootTree,
      isComplexArchive: uploadedFiles.length > 1 || uploadFormat === "ZIP",
      previewImages,
      previewRows,
      columns,
    };

    const res = addDataset(newDs);
    if (res.success) {
      showToast(`数据集上传成功！已汇聚 ${uploadedFiles.length} 份文件，资产已上线。`);
      setIsUploadModalOpen(false);
      resetUploadForm();
    } else {
      setUploadError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 顶部全局导航 */}
      <Header onNavigate={onNavigate} activeNav="dataset-hall" />

      {/* Toast 提示浮层 */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-2xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-3 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 主页面内容容器 */}
      <main className="flex-1 max-w-[1560px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3.5">
        
        {/* ========================================================================= */}
        {/* 顶部紧凑标题与快捷操作栏                                                   */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl px-5 py-3.5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                数据大厅
              </h1>
              <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100 font-mono">
                {datasets.length} 个数据集
              </span>
              <span className="text-xs text-slate-400 hidden lg:inline">
                · 汇聚真实业务场景与多模态样本数据
              </span>
            </div>
          </div>

          {/* 资产统计与上传动作 */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {/* 存储配额提示 */}
            <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 text-xs flex items-center gap-2">
              <HardDrive className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <div className="text-[11px] text-slate-500">
                个人配额: <strong className="font-semibold text-slate-700 font-mono">{storageInfo.usedGB}</strong> / {storageInfo.totalGB} GB
              </div>
            </div>

            {/* 上传数据集主按钮 */}
            <button
              onClick={() => {
                resetUploadForm();
                setIsUploadModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>上传数据集</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 高效集成工具栏：视图Tab + 搜索检索 + 排序切换 + 场景胶囊                  */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3.5 space-y-3">
          
          {/* 第 1 层: 视图Tab (左) + 搜索框与快捷操作 (右) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            {/* 主视图切换 Tab */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0 overflow-x-auto no-scrollbar">
              <button
                onClick={() => {
                  setActiveTab("all");
                  setSelectedIds([]);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "all"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>全部公开数据</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === "all" ? "bg-blue-50 text-blue-600" : "bg-slate-200 text-slate-600"
                }`}>
                  {stats.allCount}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("my_uploaded");
                  setSelectedIds([]);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "my_uploaded"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>我的数据集</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === "my_uploaded" ? "bg-blue-50 text-blue-600" : "bg-slate-200 text-slate-600"
                }`}>
                  {stats.myCount}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("favorites");
                  setSelectedIds([]);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "favorites"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>我的收藏</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === "favorites" ? "bg-blue-50 text-blue-600" : "bg-slate-200 text-slate-600"
                }`}>
                  {stats.favCount}
                </span>
              </button>
            </div>

            {/* 搜索框与排序、视图切换工具 */}
            <div className="flex items-center gap-2.5 flex-1 lg:justify-end flex-wrap">
              {/* 搜索框 */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="搜索数据集名称、场景、格式或作者..."
                  className="w-full pl-8.5 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
                {searchKeyword && (
                  <button
                    onClick={() => setSearchKeyword("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* 排序方式 */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer shrink-0"
              >
                <option value="default">默认推荐</option>
                <option value="newest">最新发布</option>
                <option value="downloads">下载最多</option>
                <option value="size">文件体积</option>
              </select>

              {/* 批量管理 */}
              <button
                onClick={() => {
                  setIsBatchMode(!isBatchMode);
                  if (isBatchMode) setSelectedIds([]);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border shrink-0 ${
                  isBatchMode
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs"
                    : "bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{isBatchMode ? "退出批量" : "批量管理"}</span>
              </button>

              {/* 视图切换 */}
              <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200/60 shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "grid" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="4列网格视图"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "list" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="紧凑列表视图"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 重置筛选 */}
              {(selectedScenario !== "all" || searchKeyword) && (
                <button
                  onClick={() => {
                    setSelectedScenario("all");
                    setSearchKeyword("");
                  }}
                  className="px-2 py-1.5 text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
                  title="重置所有筛选"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>重置</span>
                </button>
              )}
            </div>
          </div>

          {/* 第 2 层: 紧凑横向业务应用场景分类栏 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0 font-medium pr-1">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>业务场景:</span>
              </div>

              {/* 全部场景胶囊 */}
              <button
                onClick={() => setSelectedScenario("all")}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  selectedScenario === "all"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                <span>全部</span>
                <span className={`text-[10px] px-1 py-0.1 rounded-full font-mono ${
                  selectedScenario === "all" ? "bg-slate-700 text-white" : "bg-white text-slate-500"
                }`}>
                  {datasets.length}
                </span>
              </button>

              {/* 若当前选中的场景不在前 8 个中，优先将其放置在最前展示 */}
              {selectedScenario !== "all" &&
                !BUSINESS_SCENARIOS.slice(0, 8).includes(selectedScenario as any) && (
                  <button
                    onClick={() => setSelectedScenario("all")}
                    className="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border bg-blue-600 border-blue-600 text-white shadow-xs"
                  >
                    <span>{selectedScenario}</span>
                    <X className="w-3 h-3 text-blue-200 hover:text-white" />
                  </button>
                )}

              {/* 常规高频前 8 个业务场景 */}
              {BUSINESS_SCENARIOS.slice(0, 8).map((scenario) => {
                const count = stats.scenarioCounts[scenario] || 0;
                const isActive = selectedScenario === scenario;
                return (
                  <button
                    key={scenario}
                    onClick={() => setSelectedScenario(isActive ? "all" : scenario)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                      isActive
                        ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                        : "bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <span>{scenario}</span>
                    {count > 0 && (
                      <span className={`text-[10px] px-1 py-0.1 rounded-full font-mono ${
                        isActive ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* 展开/收起更多场景 */}
              <button
                type="button"
                onClick={() => setIsScenarioExpanded(!isScenarioExpanded)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1 border ${
                  isScenarioExpanded
                    ? "bg-blue-50 border-blue-200 text-blue-600"
                    : "bg-slate-100 border-transparent hover:bg-slate-200/80 text-slate-600"
                }`}
              >
                <span>{isScenarioExpanded ? "收起" : `更多 (${BUSINESS_SCENARIOS.length})`}</span>
                {isScenarioExpanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                )}
              </button>
            </div>

            {/* 展开模式：紧凑网格与场景搜索面板 */}
            {isScenarioExpanded && (
              <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3 space-y-2.5 animate-in fade-in slide-in-from-top-1 shadow-2xs">
                <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200/70">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={scenarioSearchQuery}
                      onChange={(e) => setScenarioSearchQuery(e.target.value)}
                      placeholder="搜索细分业务场景..."
                      className="w-full pl-8 pr-7 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-all"
                    />
                    {scenarioSearchQuery && (
                      <button
                        onClick={() => setScenarioSearchQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    共 {BUSINESS_SCENARIOS.length} 个行业场景
                  </span>
                </div>

                {/* 场景胶囊全量列表 */}
                <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
                  <button
                    onClick={() => {
                      setSelectedScenario("all");
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                      selectedScenario === "all"
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70"
                    }`}
                  >
                    <span>全部业务场景</span>
                    <span className={`text-[10px] px-1 py-0.1 rounded-full font-mono ${
                      selectedScenario === "all" ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      {datasets.length}
                    </span>
                  </button>

                  {BUSINESS_SCENARIOS.filter((sc) =>
                    sc.toLowerCase().includes(scenarioSearchQuery.trim().toLowerCase())
                  ).map((scenario) => {
                    const count = stats.scenarioCounts[scenario] || 0;
                    const isActive = selectedScenario === scenario;
                    return (
                      <button
                        key={scenario}
                        onClick={() => {
                          setSelectedScenario(isActive ? "all" : scenario);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                          isActive
                            ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                        }`}
                      >
                        <span>{scenario}</span>
                        {count > 0 && (
                          <span className={`text-[10px] px-1 py-0.1 rounded-full font-mono ${
                            isActive ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"
                          }`}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 批量操作工具条 (当处于批量模式或有选中项时展示：仅支持批量收藏与批量删除)      */}
        {/* ========================================================================= */}
        {isBatchMode && (
          <div className="bg-indigo-900 text-white rounded-2xl p-4 shadow-lg border border-indigo-700 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <button
                onClick={selectAll}
                className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-800 hover:bg-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-600 transition-colors cursor-pointer"
              >
                {selectedIds.length === filteredDatasets.length && filteredDatasets.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-indigo-300" />
                ) : (
                  <Square className="w-4 h-4 text-indigo-300" />
                )}
                <span>全选当前页 ({selectedIds.length}/{filteredDatasets.length})</span>
              </button>
              <span className="text-xs text-indigo-200">
                已选中 <strong className="text-white font-bold">{selectedIds.length}</strong> 个数据集
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {activeTab !== "my_uploaded" && (
                <>
                  <button
                    disabled={selectedIds.length === 0}
                    onClick={() => handleBatchFavorite(true)}
                    className="px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-600 disabled:opacity-40 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="批量收藏选中的数据集"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>批量收藏</span>
                  </button>
                  <button
                    disabled={selectedIds.length === 0}
                    onClick={() => handleBatchFavorite(false)}
                    className="px-3.5 py-1.5 bg-indigo-800 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="批量取消收藏选中的数据集"
                  >
                    <BookmarkCheck className="w-3.5 h-3.5 text-indigo-300" />
                    <span>取消收藏</span>
                  </button>
                </>
              )}
              <button
                disabled={selectedIds.length === 0}
                onClick={handleBatchDelete}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>批量删除</span>
              </button>
              <button
                onClick={() => {
                  setIsBatchMode(false);
                  setSelectedIds([]);
                }}
                className="px-3 py-1.5 bg-transparent hover:bg-indigo-800 text-indigo-200 hover:text-white text-xs rounded-lg transition-colors cursor-pointer"
              >
                退出批量管理
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 数据集展示区：3~4 列高密度网格 (方案A 核心交付)                            */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              共展示 <strong className="text-slate-800 font-semibold">{filteredDatasets.length}</strong> 个数据集
              {selectedScenario !== "all" && <span className="ml-1 text-blue-600 font-medium">· 业务场景: {selectedScenario}</span>}
            </span>
          </div>

          {filteredDatasets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Database className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">暂无匹配的数据集</h3>
                <p className="text-xs text-slate-500">
                  可尝试调整业务场景分类或搜索关键词
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedScenario("all");
                  setSelectedFormat("all");
                  setSearchKeyword("");
                  setActiveTab("all");
                }}
                className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>清除筛选条件</span>
              </button>
            </div>
          ) : viewMode === "grid" ? (
            // ==================== 4列高密度网格视图 ====================
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredDatasets.map((dataset) => {
                const isSelected = selectedIds.includes(dataset.id);
                const isAuthor = dataset.author?.name === currentUser.name || dataset.author?.role === currentUser.role;

                return (
                  <div
                    key={dataset.id}
                    onClick={() => handleCardClick(dataset.id)}
                    className={`group bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex flex-col overflow-hidden relative cursor-pointer ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                        : "border-slate-200/80 hover:border-blue-300"
                    }`}
                  >
                    {/* 封面区域 (高密度 h-36) */}
                    <div className="relative w-full h-36 bg-slate-100 overflow-hidden shrink-0">
                      <DatasetCover
                        dataset={dataset}
                        size="thumb"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        showBadges={false}
                      />

                      {/* 渐变暗影层提高文字徽章对比度 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30 pointer-events-none" />

                      {/* 顶部浮层徽章 */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 z-10">
                        <div className="flex items-center gap-1.5">
                          {/* 批量选择框 */}
                          {isBatchMode && (
                            <button
                              onClick={(e) => toggleSelect(dataset.id, e)}
                              className="w-6 h-6 rounded-md bg-white/90 shadow-sm flex items-center justify-center text-slate-800 hover:bg-white transition-colors"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                          )}

                          {/* 可见性徽章 */}
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                            dataset.visibility === "public" || (dataset.visibility as any) === "school"
                              ? "bg-emerald-600/90 text-white border-emerald-400/30"
                              : "bg-amber-600/90 text-white border-amber-400/30"
                          }`}>
                            {dataset.visibility === "public" || (dataset.visibility as any) === "school" ? "公开" : "个人"}
                          </span>
                        </div>

                        {/* 收藏按钮: 仅在【全部公开数据】与【我的收藏】显示；【我的数据集】属于自己上传的数据，无需收藏 */}
                        {activeTab !== "my_uploaded" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(dataset.id);
                              showToast(dataset.isFavorite ? "已从我的收藏中移除" : "已加入我的收藏");
                            }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs ${
                              dataset.isFavorite
                                ? "bg-rose-500 text-white shadow-xs hover:bg-rose-600 scale-105"
                                : "bg-slate-900/60 text-white/80 hover:text-white hover:bg-slate-900/90"
                            }`}
                            title={dataset.isFavorite ? "取消收藏" : "加入我的收藏"}
                          >
                            <Bookmark
                              className={`w-3.5 h-3.5 ${dataset.isFavorite ? "fill-current" : ""}`}
                            />
                          </button>
                        )}
                      </div>

                      {/* 封面底部业务场景标签 */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] z-10">
                        <span className="font-semibold px-2 py-0.5 rounded-md bg-blue-600/90 backdrop-blur-xs text-white text-[11px] truncate max-w-[160px] shadow-xs">
                          {dataset.theme || dataset.themes?.[0] || "通用场景"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-200 bg-slate-900/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
                          {dataset.fileSize}
                        </span>
                      </div>
                    </div>

                    {/* 卡片正文 */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        {/* 标题 */}
                        <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug" title={dataset.title}>
                          {dataset.title}
                        </h3>

                        {/* 短描述 (2行精炼展示) */}
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-normal">
                          {dataset.description || "暂无简短描述"}
                        </p>
                      </div>

                      {/* 卡片底栏信息与进入详情按钮 */}
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px] text-slate-400">
                        <div className="truncate flex items-center gap-1.5">
                          <span className="text-slate-600 font-medium truncate max-w-[90px]">
                            {dataset.author?.name || "平台作者"}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-[10px]">
                            {dataset.updatedAt || dataset.createdAt}
                          </span>
                        </div>

                        {/* 查看详情交互 (解耦后无需一键挂载) */}
                        <div className="flex items-center gap-1 text-blue-600 font-semibold text-[11px] group-hover:translate-x-0.5 transition-transform shrink-0">
                          <span>查看详情</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // ==================== 紧凑列表视图 ====================
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="divide-y divide-slate-100">
                {filteredDatasets.map((dataset) => {
                  const isSelected = selectedIds.includes(dataset.id);
                  const isAuthor = dataset.author?.name === currentUser.name || dataset.author?.role === currentUser.role;

                  return (
                    <div
                      key={dataset.id}
                      onClick={() => handleCardClick(dataset.id)}
                      className={`p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 cursor-pointer ${
                        isSelected ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        {isBatchMode && (
                          <button
                            onClick={(e) => toggleSelect(dataset.id, e)}
                            className="text-slate-400 hover:text-blue-600 shrink-0"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        )}

                        {/* 迷你封面 */}
                        <div className="w-14 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          <DatasetCover dataset={dataset} size="thumb" className="w-full h-full object-cover" showBadges={false} />
                        </div>

                        {/* 标题与描述 */}
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-900 hover:text-blue-600 truncate">
                              {dataset.title}
                            </span>
                            <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded border border-blue-100">
                              {dataset.theme || dataset.themes?.[0] || "通用场景"}
                            </span>
                            <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded ${
                              dataset.visibility === "public" || (dataset.visibility as any) === "school"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}>
                              {dataset.visibility === "public" || (dataset.visibility as any) === "school" ? "公开" : "个人"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">
                            {dataset.description}
                          </p>
                        </div>
                      </div>

                      {/* 右侧元数据与动作 */}
                      <div className="flex items-center gap-5 shrink-0 text-xs text-slate-400">
                        <div className="text-right hidden sm:block">
                          <div className="font-mono text-slate-700 font-semibold text-[11px]">
                            {dataset.fileSize}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {dataset.updatedAt}
                          </div>
                        </div>

                        {/* 收藏按钮: 仅在【全部公开数据】与【我的收藏】显示；【我的数据集】中属于自己上传的数据，无需收藏 */}
                        {activeTab !== "my_uploaded" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(dataset.id);
                              showToast(dataset.isFavorite ? "已从我的收藏中移除" : "已加入我的收藏");
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              dataset.isFavorite ? "text-rose-500 hover:bg-rose-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            }`}
                            title={dataset.isFavorite ? "取消收藏" : "加入我的收藏"}
                          >
                            <Bookmark className={`w-4 h-4 ${dataset.isFavorite ? "fill-current" : ""}`} />
                          </button>
                        )}

                        <button
                          onClick={() => handleCardClick(dataset.id)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <span>详情</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 弹窗：上传数据集 (已彻底解耦课程与审核，极简高效)                          */}
      {/* ========================================================================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 space-y-5 max-h-[90vh] flex flex-col">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">上传并发布数据集</h2>
                  <p className="text-slate-500 text-xs mt-0.5">面向业务场景发布数据资产，保存后即刻可用</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 错误提示 */}
            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 shrink-0">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* 表单内容区 (滚动) */}
            <div className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
              
              {/* ================================================================= */}
              {/* 核心第一步：真实数据集文件上传入口 (支持多文件批量选择、拖拽追加、独立删除) */}
              {/* ================================================================= */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Files className="w-4 h-4 text-blue-600" />
                    <span>数据集源文件 (支持多文件与目录批量上传)</span>
                    <span className="text-red-500">*</span>
                  </label>
                  {uploadedFiles.length > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-500 font-mono">
                        已选 <strong className="text-blue-600 font-semibold">{uploadedFiles.length}</strong> 份文件 · 累计 <strong className="text-slate-700 font-semibold">{totalSizeStr}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={handleClearAllFiles}
                        className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        清空全部
                      </button>
                    </div>
                  )}
                </div>

                {/* 隐藏的原生多文件输入框 */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInputChange}
                  accept=".csv,.json,.jsonl,.geojson,.parquet,.pq,.zip,.tar,.gz,.tgz,.7z,.rar,.xlsx,.xls,.txt,.tsv,.jpg,.jpeg,.png,.webp,.gif,.yaml,.yml,.py,.sh,.md"
                  className="hidden"
                />

                {/* 未选择文件时的拖拽上传区 */}
                {uploadedFiles.length === 0 ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                      isDraggingFile
                        ? "border-blue-500 bg-blue-50/80 scale-[0.99]"
                        : "border-slate-200 bg-slate-50/60 hover:bg-blue-50/30 hover:border-blue-300"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-800">
                        点击选择 或 批量拖拽多个数据文件至此处
                      </div>
                      <p className="text-[11px] text-slate-400">
                        支持同时选择多份文件（如 train.csv、test.csv、字典表、标注、图片包等，无需必须打包压缩）
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-center pt-1">
                      {["CSV", "JSON", "Parquet", "ZIP", "XLSX", "TXT", "Images"].map((fmt) => (
                        <span
                          key={fmt}
                          className="px-2 py-0.5 bg-white border border-slate-200 text-slate-500 text-[10px] font-mono rounded-md"
                        >
                          .{fmt.toLowerCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* 已上传多文件列表展示卡片 */
                  <div className="space-y-2">
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`bg-slate-50/80 border rounded-2xl p-3 space-y-2 transition-all ${
                        isDraggingFile
                          ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-400/20"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <FolderPlus className="w-3.5 h-3.5 text-blue-500" />
                          <span>文件清单 (共 {uploadedFiles.length} 个文件)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 text-[11px] shadow-2xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>添加更多文件</span>
                        </button>
                      </div>

                      {/* 文件列表滚动区 */}
                      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                        {uploadedFiles.map((fileInfo) => {
                          return (
                            <div
                              key={fileInfo.id}
                              className="bg-white border border-slate-200/90 rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                                  {fileInfo.format === "CSV" || fileInfo.format === "XLSX" ? (
                                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                                  ) : fileInfo.format === "ZIP" ? (
                                    <FileArchive className="w-4 h-4 text-blue-600" />
                                  ) : fileInfo.format === "JSON" ? (
                                    <FileCode className="w-4 h-4 text-amber-500" />
                                  ) : fileInfo.format === "Parquet" ? (
                                    <Database className="w-4 h-4 text-indigo-600" />
                                  ) : fileInfo.format === "Images" ? (
                                    <ImageIcon className="w-4 h-4 text-pink-500" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-slate-600" />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className="font-bold text-slate-800 text-xs truncate max-w-[200px] sm:max-w-xs"
                                      title={fileInfo.name}
                                    >
                                      {fileInfo.name}
                                    </span>
                                    <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 text-[10px] font-mono rounded">
                                      .{fileInfo.rawExtension.toLowerCase()}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                    <span className="font-mono">{fileInfo.size}</span>
                                    {fileInfo.role && (
                                      <>
                                        <span>·</span>
                                        <span className="text-slate-500">
                                          {fileInfo.role === "train"
                                            ? "训练集"
                                            : fileInfo.role === "test"
                                            ? "测试集"
                                            : fileInfo.role === "val"
                                            ? "验证集"
                                            : fileInfo.role === "label"
                                            ? "标签/类别"
                                            : fileInfo.role === "doc"
                                            ? "说明/字典"
                                            : fileInfo.role === "config"
                                            ? "配置文件"
                                            : "主数据"}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFile(fileInfo.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="移除该文件"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* 拖入更多提示条 */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border border-dashed border-slate-300/80 hover:border-blue-400 bg-white/70 hover:bg-blue-50/40 rounded-xl py-2 px-3 text-center cursor-pointer text-[11px] text-slate-500 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Paperclip className="w-3 h-3 text-slate-400" />
                        <span>继续选择或拖拽更多文件到此列表</span>
                      </div>
                    </div>

                    {/* 主要数据格式选择栏 */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span>主要数据格式:</span>
                        <select
                          value={uploadFormat}
                          onChange={(e) => setUploadFormat(e.target.value as any)}
                          className="bg-white border border-slate-200 rounded-md px-2 py-0.5 text-xs text-blue-700 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          {FILE_FORMATS.map((fmt) => (
                            <option key={fmt} value={fmt}>
                              {fmt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <span className="text-[11px] text-slate-400 hidden sm:inline">
                        已推断为 {uploadFormat}，可手动切换
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 数据集名称 */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 flex items-center gap-1">
                  <span>数据集名称</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => {
                    setUploadTitle(e.target.value);
                    setUploadError(null);
                  }}
                  placeholder="例如：智慧农业番茄温室多传感器气象监测与长势估产数据集"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white text-xs font-semibold transition-all"
                />
              </div>

              {/* 业务应用场景分类 (带搜索框与网格选择，涵盖智慧农业、情感分析等 30+ 场景) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1">
                    <span>业务应用场景 (分类)</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-blue-600 font-medium">当前选中: {uploadScenario}</span>
                </div>

                {/* 场景搜索框 */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={uploadScenarioSearch}
                    onChange={(e) => setUploadScenarioSearch(e.target.value)}
                    placeholder="搜索场景（如：农业、金融、医疗、电商、交通...）"
                    className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                  {uploadScenarioSearch && (
                    <button
                      type="button"
                      onClick={() => setUploadScenarioSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* 场景网格选择（高度控制为展示两行） */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-[76px] overflow-y-auto pr-1 p-1 bg-slate-50 rounded-xl border border-slate-200 scrollbar-thin">
                  {BUSINESS_SCENARIOS.filter((sc) =>
                    sc.toLowerCase().includes(uploadScenarioSearch.trim().toLowerCase())
                  ).map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => setUploadScenario(sc)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer truncate ${
                        uploadScenario === sc
                          ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                          : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-100"
                      }`}
                      title={sc}
                    >
                      {sc}
                    </button>
                  ))}
                  {BUSINESS_SCENARIOS.filter((sc) =>
                    sc.toLowerCase().includes(uploadScenarioSearch.trim().toLowerCase())
                  ).length === 0 && (
                    <div className="col-span-full py-2 text-center text-slate-400 text-xs flex flex-col items-center gap-1">
                      <span>未找到与 “{uploadScenarioSearch}” 匹配的业务场景</span>
                      <button
                        type="button"
                        onClick={() => setUploadScenarioSearch("")}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        清空搜索词
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 数据集短描述 (必填，专门用于大厅卡片展示) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1">
                    <span>数据集简短描述 (卡片展示)</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadShortDesc("涵盖连续两季温室番茄全生育期温湿度、光照、CO2及土壤墒情高频采样数据，适用于环境预测与物候期模型构建。");
                    }}
                    className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                  >
                    填入示例短描述
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={uploadShortDesc}
                  onChange={(e) => setUploadShortDesc(e.target.value)}
                  placeholder="50~100字简短描述，直接展示在大厅卡片与列表摘要中..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 text-xs leading-relaxed"
                />
              </div>

              {/* 详细概述与说明文档 (选填，Markdown格式，用于详情页) */}
              <div className="space-y-1.5 bg-blue-50/40 p-3.5 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>详细概述与说明文档 (Markdown)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setUploadOverviewDoc(DATASET_OVERVIEW_TEMPLATE)}
                    className="text-[11px] text-blue-600 bg-white border border-blue-200 px-2 py-0.5 rounded-md font-medium flex items-center gap-1 cursor-pointer hover:bg-blue-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>插入规范模板</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  详情页展示完整结构（业务背景与样本量 → 字段字典 → 适用模型 → 代码调用示例）。
                </p>
                <textarea
                  rows={5}
                  value={uploadOverviewDoc}
                  onChange={(e) => setUploadOverviewDoc(e.target.value)}
                  placeholder={DATASET_OVERVIEW_TEMPLATE}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 font-mono text-[11px] leading-relaxed shadow-inner"
                />
              </div>

              {/* 封面设置组件 */}
              <CoverSelectorSection
                coverSourceType={uploadCoverType}
                onCoverSourceTypeChange={setUploadCoverType}
                customCoverImage={uploadCustomCover}
                onCustomCoverImageChange={setUploadCustomCover}
                title={uploadTitle}
                techDomains={[]}
                themes={[uploadScenario]}
                format={uploadFormat}
                fileSize={uploadedFiles.length > 0 ? totalSizeStr : "128.5 MB"}
              />
            </div>

            {/* 弹窗底部操作 */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 shrink-0">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveUpload}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>立即发布上线</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑弹窗 */}
      {editingDataset && (
        <EditDatasetModal
          isOpen={!!editingDataset}
          dataset={editingDataset}
          onClose={() => setEditingDataset(null)}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {/* 删除弹窗 */}
      {deletingDataset && (
        <DeleteDatasetModal
          isOpen={!!deletingDataset}
          dataset={deletingDataset}
          onClose={() => setDeletingDataset(null)}
          onSuccess={(msg) => showToast(msg)}
        />
      )}
    </div>
  );
}
