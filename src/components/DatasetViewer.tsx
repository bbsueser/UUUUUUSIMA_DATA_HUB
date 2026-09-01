import React, { useState, useMemo, useEffect } from "react";
import {
  Copy,
  Folder,
  FolderOpen,
  FileText,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  Image as ImageIcon,
  File,
  ChevronDown,
  ChevronRight,
  X,
  Eye,
  Table as TableIcon,
  Code2,
  Terminal,
  Search,
  FileJson,
  CheckCircle2,
  BarChart3,
  ListTree,
  AlertTriangle,
  Download,
  Layers,
  Cpu,
  Binary,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { DatasetItem, DatasetFileTreeNode } from "../data/mockData";

interface DatasetViewerProps {
  dataset: DatasetItem;
  className?: string;
}

// 支持在线预览的扩展名清单
const PREVIEWABLE_EXTENSIONS = new Set([
  "csv",
  "tsv",
  "xlsx",
  "parquet",
  "json",
  "jsonl",
  "geojson",
  "yaml",
  "yml",
  "jpg",
  "jpeg",
  "png",
  "webp",
  "svg",
  "bmp",
  "gif",
  "txt",
  "md",
  "py",
  "sh",
  "sql",
  "xml",
  "html",
]);

// 判断是否属于二进制/不支持在线预览的文件
const isNonPreviewableFile = (ext?: string) => {
  if (!ext) return true;
  const lower = ext.toLowerCase();
  if (lower === "more" || lower === "folder") return false;
  return !PREVIEWABLE_EXTENSIONS.has(lower);
};

// 针对未提供显式 fileTree 的数据集，自动构建逼真的目录结构树（支持压缩包与单/多文件）
export const getOrGenerateFileTree = (dataset: DatasetItem): DatasetFileTreeNode[] => {
  if (dataset.fileTree && dataset.fileTree.length > 0) {
    return dataset.fileTree;
  }

  const safeSlug = (dataset.id || "dataset").replace(/[^a-zA-Z0-9_]/g, "_");
  const isArchive =
    dataset.format === "ZIP" ||
    dataset.format === "Images" ||
    dataset.title.includes("影像") ||
    dataset.title.includes("检测") ||
    dataset.title.includes("音频") ||
    dataset.title.includes("图片");

  if (isArchive) {
    return [
      {
        name: `${safeSlug}_package.zip (压缩文件包)`,
        type: "folder",
        path: "/",
        childrenCount: 6,
        children: [
          {
            name: "README.md",
            type: "file",
            extension: "md",
            size: "5.4 KB",
            path: "/README.md",
          },
          {
            name: "config.yaml",
            type: "file",
            extension: "yaml",
            size: "2.1 KB",
            path: "/config.yaml",
          },
          {
            name: "annotations.json",
            type: "file",
            extension: "json",
            size: "4.8 MB",
            path: "/annotations.json",
          },
          {
            name: "train",
            type: "folder",
            path: "/train",
            childrenCount: 240,
            children: [
              {
                name: "sample_001.jpg",
                type: "file",
                extension: "jpg",
                size: "340 KB",
                path: "/train/sample_001.jpg",
              },
              {
                name: "sample_002.jpg",
                type: "file",
                extension: "jpg",
                size: "295 KB",
                path: "/train/sample_002.jpg",
              },
              {
                name: "... (更多训练集文件)",
                type: "file",
                extension: "more",
                size: "180 MB",
                path: "/train",
              },
            ],
          },
          {
            name: "weights_baseline.pth",
            type: "file",
            extension: "pth",
            size: "142.5 MB",
            path: "/weights_baseline.pth",
          },
          {
            name: "feature_embeddings.bin",
            type: "file",
            extension: "bin",
            size: "64.0 MB",
            path: "/feature_embeddings.bin",
          },
        ],
      },
    ];
  }

  // 默认结构化/表格/文本类数据集
  const mainExt = dataset.format === "JSON" ? "json" : dataset.format === "XLSX" ? "xlsx" : "csv";
  return [
    {
      name: `${safeSlug}_directory`,
      type: "folder",
      path: "/",
      childrenCount: 4,
      children: [
        {
          name: `${safeSlug}_data.${mainExt}`,
          type: "file",
          extension: mainExt,
          size: dataset.fileSize || "12.8 MB",
          path: `/${safeSlug}_data.${mainExt}`,
        },
        {
          name: "data_dictionary.json",
          type: "file",
          extension: "json",
          size: "3.2 KB",
          path: "/data_dictionary.json",
        },
        {
          name: "README.md",
          type: "file",
          extension: "md",
          size: "4.8 KB",
          path: "/README.md",
        },
        {
          name: "baseline_model.onnx",
          type: "file",
          extension: "onnx",
          size: "38.2 MB",
          path: "/baseline_model.onnx",
        },
      ],
    },
  ];
};

// 动态生成不同类型文件的预览数据与代码
const generateFilePreviewContent = (node: DatasetFileTreeNode, dataset: DatasetItem) => {
  const ext = (node.extension || "").toLowerCase();
  const name = node.name.toLowerCase();

  // 1. 不支持在线预览的二进制/模型文件
  if (isNonPreviewableFile(ext)) {
    return {
      type: "unsupported",
      extension: ext,
      name: node.name,
      size: node.size || "未知大小",
      path: node.path,
    };
  }

  // 2. YAML / 配置文件
  if (ext === "yaml" || ext === "yml") {
    if (dataset.yamlConfig) return { type: "yaml", content: dataset.yamlConfig };
    return {
      type: "yaml",
      content: `# ${node.name} - Dataset Configuration
dataset_name: "${dataset.title}"
version: "${dataset.version}"
theme: "${dataset.theme || "Universal"}"
task_type: "${dataset.techDomain || "General"}"
root_path: "${dataset.mountPath}"

# Data Splits
train: "${dataset.mountPath}/train"
val: "${dataset.mountPath}/val"
test: "${dataset.mountPath}/test"

# Class Definitions
nc: 5
names: ['Class_A', 'Class_B', 'Class_C', 'Class_D', 'Class_E']
`,
    };
  }

  // 3. JSON / JSONL 结构化标注文件
  if (ext === "json" || ext === "jsonl" || ext === "geojson") {
    if (name.includes("label") || name.includes("annotation") || name.includes("instance") || name.includes("coco")) {
      return {
        type: "json",
        content: JSON.stringify(
          {
            info: {
              description: dataset.title,
              version: dataset.version,
              year: 2026,
              contributor: dataset.author?.name || "UUSIMA Platform",
              date_created: dataset.createdAt,
            },
            licenses: [{ id: 1, name: "Academic & Research Open License" }],
            categories: [
              { id: 1, name: "target_primary", supercategory: "object" },
              { id: 2, name: "target_secondary", supercategory: "object" },
              { id: 3, name: "background_context", supercategory: "scene" },
            ],
            images: [
              { id: 101, width: 1920, height: 1080, file_name: "sample_00001.jpg", date_captured: "2026-05-10" },
              { id: 102, width: 1920, height: 1080, file_name: "sample_00002.jpg", date_captured: "2026-05-10" },
            ],
            annotations: [
              { id: 1, image_id: 101, category_id: 1, bbox: [240.5, 180.2, 120.0, 310.4], area: 37248, iscrowd: 0 },
              { id: 2, image_id: 101, category_id: 2, bbox: [580.0, 220.0, 95.5, 140.0], area: 13370, iscrowd: 0 },
              { id: 3, image_id: 102, category_id: 1, bbox: [310.0, 195.0, 115.0, 305.0], area: 35075, iscrowd: 0 },
            ],
          },
          null,
          2
        ),
      };
    }

    if (dataset.previewRows && dataset.previewRows.length > 0) {
      return {
        type: "json",
        content: JSON.stringify(dataset.previewRows.slice(0, 5), null, 2),
      };
    }

    return {
      type: "json",
      content: JSON.stringify(
        {
          dataset_metadata: {
            title: dataset.title,
            version: dataset.version,
            total_records: dataset.rowCount || 12000,
            mount_path: dataset.mountPath,
          },
          sample_records: [
            { id: "S1001", feature_a: 42.5, feature_b: "Normal", is_valid: true, score: 0.94 },
            { id: "S1002", feature_a: 68.2, feature_b: "Positive", is_valid: true, score: 0.88 },
            { id: "S1003", feature_a: 31.0, feature_b: "Normal", is_valid: false, score: 0.52 },
          ],
        },
        null,
        2
      ),
    };
  }

  // 4. 表格文件 (CSV / Parquet / XLSX / TSV)
  if (ext === "csv" || ext === "parquet" || ext === "xlsx" || ext === "tsv") {
    let rows: Record<string, any>[] = [];
    if (dataset.previewRows && dataset.previewRows.length > 0) {
      rows = dataset.previewRows;
    } else {
      rows = Array.from({ length: 15 }, (_, i) => ({
        index: i + 1,
        sample_id: `ID_${(1000 + i * 7).toString()}`,
        metric_score: Number((Math.random() * 80 + 15).toFixed(2)),
        category: `Class_${String.fromCharCode(65 + (i % 4))}`,
        status: i % 4 === 0 ? "Flagged" : "Passed",
        timestamp: `2026-06-0${(i % 9) + 1} 14:30:00`,
      }));
    }
    return {
      type: "table",
      rows,
      cols: Object.keys(rows[0] || {}),
    };
  }

  // 5. 图片文件 (JPG / PNG / WEBP / JPEG / SVG)
  if (ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "webp" || ext === "svg" || ext === "bmp") {
    const existingImg = dataset.previewImages?.find((img) => img.name === node.name);
    const imageUrl =
      existingImg?.url ||
      `https://picsum.photos/seed/${encodeURIComponent(node.name)}/1200/800`;
    return {
      type: "image",
      url: imageUrl,
      name: node.name,
      label: existingImg?.label || "图像样本",
      size: node.size || "240 KB",
      path: node.path,
    };
  }

  // 6. TXT / Markdown / 脚本
  if (ext === "md" || ext === "txt" || ext === "py" || ext === "sh" || ext === "sql") {
    if (ext === "md" && dataset.overviewDoc) {
      return { type: "markdown", content: dataset.overviewDoc };
    }
    if (dataset.previewText && ext === "txt") {
      return { type: "text", content: dataset.previewText };
    }
    return {
      type: "code",
      content: `# ==============================================================================
# Script / Doc: ${node.name}
# Dataset: ${dataset.title}
# Path: ${node.path}
# ==============================================================================

import os
import sys

def load_data():
    """Load and verify data integrity in UUSIMA environment."""
    mount_dir = "${dataset.mountPath}"
    target_file = os.path.join(mount_dir, "${node.name}")
    print(f"Reading target file from: {target_file}")
    
    if os.path.exists(target_file):
        print(f"File verified successfully. Size: ${node.size || 'Ready'}")
        return True
    return False

if __name__ == '__main__':
    load_data()
`,
    };
  }

  // 兜底为不支持预览
  return {
    type: "unsupported",
    extension: ext,
    name: node.name,
    size: node.size || "未知大小",
    path: node.path,
  };
};

// 递归查找文件树中的第一个具体文件
const findFirstFile = (nodes?: DatasetFileTreeNode[]): DatasetFileTreeNode | null => {
  if (!nodes || nodes.length === 0) return null;
  for (const node of nodes) {
    if (node.type === "file" && node.extension !== "more") {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findFirstFile(node.children);
      if (found) return found;
    }
  }
  return null;
};

// 交互式文件树节点组件 (支持展开/折叠、选中高亮、复制相对路径)
const InteractiveFileTreeNode: React.FC<{
  node: DatasetFileTreeNode;
  level?: number;
  selectedPath: string;
  onSelectNode: (node: DatasetFileTreeNode) => void;
  onCopyPath: (path: string) => void;
  keywordFilter?: string;
  forceExpand?: boolean;
}> = ({ node, level = 0, selectedPath, onSelectNode, onCopyPath, keywordFilter = "", forceExpand }) => {
  const [isOpen, setIsOpen] = useState(level < 2 || forceExpand);

  useEffect(() => {
    if (forceExpand !== undefined) {
      setIsOpen(forceExpand);
    }
  }, [forceExpand]);

  const isFolder = node.type === "folder";
  const isSelected = selectedPath === node.path;
  const isOmittedNode = node.extension === "more";
  const isCompressedPackage = isFolder && (node.name.includes(".zip") || node.name.includes(".tar") || node.name.includes("压缩"));

  // 关键词过滤匹配
  if (keywordFilter) {
    const kw = keywordFilter.toLowerCase();
    const matchSelf = node.name.toLowerCase().includes(kw) || (node.extension || "").toLowerCase().includes(kw);
    const matchChildren = node.children && node.children.some((c) => c.name.toLowerCase().includes(kw));
    if (!matchSelf && !matchChildren) {
      return null;
    }
  }

  const getFileIcon = (ext?: string) => {
    switch (ext) {
      case "yaml":
      case "yml":
        return <FileCode className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case "json":
      case "jsonl":
        return <FileJson className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "webp":
      case "svg":
        return <ImageIcon className="w-3.5 h-3.5 text-pink-500 shrink-0" />;
      case "csv":
      case "parquet":
      case "xlsx":
      case "tsv":
        return <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
      case "md":
      case "txt":
        return <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
      case "py":
      case "sh":
      case "sql":
        return <Code2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
      case "zip":
      case "tar":
      case "gz":
      case "7z":
        return <FileArchive className="w-3.5 h-3.5 text-purple-500 shrink-0" />;
      case "pth":
      case "pt":
      case "ckpt":
      case "onnx":
      case "h5":
        return <Cpu className="w-3.5 h-3.5 text-orange-500 shrink-0" />;
      case "bin":
      case "dat":
      case "pkl":
      case "npy":
        return <Binary className="w-3.5 h-3.5 text-zinc-500 shrink-0" />;
      default:
        return <File className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="select-none font-mono text-xs">
      <div
        onClick={() => {
          if (isFolder) {
            setIsOpen(!isOpen);
          } else if (!isOmittedNode) {
            onSelectNode(node);
          }
        }}
        style={{ paddingLeft: `${level * 14 + 6}px` }}
        className={`group py-1.5 pr-2.5 flex items-center justify-between gap-1.5 rounded-lg transition-all cursor-pointer ${
          isSelected
            ? "bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 pl-1.5 shadow-2xs"
            : isFolder
            ? "text-slate-800 hover:bg-slate-100/90 font-medium"
            : isOmittedNode
            ? "text-slate-400 italic cursor-default"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <div className="flex items-center gap-1.5 truncate min-w-0 flex-1">
          {isFolder ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="p-0.5 text-slate-400 hover:text-slate-700 rounded"
            >
              {isOpen ? (
                <ChevronDown className="w-3 h-3 text-slate-500" />
              ) : (
                <ChevronRight className="w-3 h-3 text-slate-500" />
              )}
            </button>
          ) : (
            <span className="w-3 shrink-0" />
          )}

          {isFolder ? (
            isCompressedPackage ? (
              <FileArchive className="w-4 h-4 text-purple-600 shrink-0" />
            ) : isOpen ? (
              <FolderOpen className="w-4 h-4 text-blue-500 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-blue-500 shrink-0" />
            )
          ) : (
            getFileIcon(node.extension)
          )}

          <span className={`truncate text-xs ${isCompressedPackage ? "text-purple-900 font-bold" : ""}`}>
            {node.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 shrink-0">
          {isFolder && node.childrenCount !== undefined && (
            <span className="bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded text-[10px] font-sans">
              {node.childrenCount.toLocaleString()} 项
            </span>
          )}
          {node.size && <span className="font-mono text-slate-500">{node.size}</span>}
          {!isFolder && !isOmittedNode && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCopyPath(node.path);
              }}
              title="复制包内相对路径"
              className="opacity-0 group-hover:opacity-100 hover:text-blue-600 p-0.5 rounded transition-opacity"
            >
              <Copy className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {isFolder && isOpen && node.children && (
        <div className="border-l border-slate-200/80 ml-3.5 my-0.5">
          {node.children.map((child, idx) => (
            <InteractiveFileTreeNode
              key={idx}
              node={child}
              level={level + 1}
              selectedPath={selectedPath}
              onSelectNode={onSelectNode}
              onCopyPath={onCopyPath}
              keywordFilter={keywordFilter}
              forceExpand={forceExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const DatasetViewer: React.FC<DatasetViewerProps> = ({ dataset, className = "" }) => {
  // 1. 获取或智能补全统一的文件目录树
  const treeNodes = useMemo(() => getOrGenerateFileTree(dataset), [dataset]);
  const defaultFile = useMemo(() => findFirstFile(treeNodes), [treeNodes]);

  // 2. 状态管理
  const [selectedFileNode, setSelectedFileNode] = useState<DatasetFileTreeNode | null>(defaultFile);
  const [keywordFilter, setKeywordFilter] = useState("");
  const [forceExpand, setForceExpand] = useState<boolean | undefined>(undefined);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [tableTabMode, setTableTabMode] = useState<"data" | "schema">("data");
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string; label?: string } | null>(null);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 当 dataset 改变时重置选择
  useEffect(() => {
    setSelectedFileNode(findFirstFile(treeNodes));
    setCurrentPage(1);
  }, [dataset, treeNodes]);

  const handleCopy = (text: string, tip = "已复制") => {
    navigator.clipboard?.writeText(text);
    setCopiedText(tip);
    setTimeout(() => setCopiedText(null), 1800);
  };

  // 获取当前选中文件的渲染内容
  const currentFileContent = useMemo(() => {
    if (!selectedFileNode) return null;
    return generateFilePreviewContent(selectedFileNode, dataset);
  }, [selectedFileNode, dataset]);

  // 表格分页计算
  const { paginatedRows, totalPages, totalRowsCount } = useMemo(() => {
    if (currentFileContent?.type !== "table") {
      return { paginatedRows: [], totalPages: 1, totalRowsCount: 0 };
    }
    const rows = currentFileContent.rows || [];
    const start = (currentPage - 1) * pageSize;
    return {
      paginatedRows: rows.slice(start, start + pageSize),
      totalPages: Math.ceil(rows.length / pageSize) || 1,
      totalRowsCount: rows.length,
    };
  }, [currentFileContent, currentPage, pageSize]);

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden ${className}`}>
      {/* 顶部统一工具栏：挂载路径提示、搜索与 Python 调用 */}
      <div className="bg-slate-50/90 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* 左侧：文件目录树概览与挂载路径 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 font-bold text-slate-800">
            <ListTree className="w-4 h-4 text-blue-600" />
            <span>文件目录树与样本预览</span>
          </span>
          <span className="hidden sm:inline-block text-slate-300">|</span>
          <div className="flex items-center gap-1 text-slate-500 font-mono text-[11px] bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs">
            <span className="text-slate-400">挂载相对路径:</span>
            <span className="text-slate-800 font-semibold truncate max-w-[260px]">{dataset.mountPath}</span>
            <button
              type="button"
              onClick={() => handleCopy(dataset.mountPath, "根路径已复制")}
              className="text-blue-600 hover:text-blue-800 ml-1 p-0.5 cursor-pointer"
              title="复制挂载相对路径"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 右侧：复制提示 */}
        <div className="flex items-center gap-2">
          {copiedText && (
            <span className="text-emerald-600 font-mono text-xs flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{copiedText}</span>
            </span>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 左右分栏：左侧文件目录树 (280~320px) + 右侧自适应动态预览器                    */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row min-h-[520px]">
        {/* 左侧：文件目录树导航 */}
        <div className="w-full lg:w-80 bg-slate-50/70 border-b lg:border-b-0 lg:border-r border-slate-200 p-3.5 flex flex-col justify-between shrink-0 space-y-3">
          <div className="space-y-2.5">
            {/* 树形控制栏：搜索与展开/折叠 */}
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="过滤文件名..."
                  value={keywordFilter}
                  onChange={(e) => setKeywordFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                />
                {keywordFilter && (
                  <button
                    onClick={() => setKeywordFilter("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setForceExpand((prev) => !prev)}
                className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] text-slate-600 transition-colors shrink-0 cursor-pointer"
                title="展开或折叠全部目录"
              >
                {forceExpand ? "全部折叠" : "全部展开"}
              </button>
            </div>

            {/* 说明提示 */}
            <div className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200/80 leading-relaxed">
              点击左侧文件查看即时预览；压缩文件将以目录形式呈现内部层级。
            </div>

            {/* 文件树列表容器 */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-2 max-h-[440px] overflow-y-auto shadow-2xs">
              {treeNodes.map((node, idx) => (
                <InteractiveFileTreeNode
                  key={idx}
                  node={node}
                  selectedPath={selectedFileNode?.path || ""}
                  onSelectNode={(n) => {
                    setSelectedFileNode(n);
                    setCurrentPage(1);
                    setTableTabMode("data");
                  }}
                  onCopyPath={(p) => handleCopy(p, `已复制相对路径: ${p}`)}
                  keywordFilter={keywordFilter}
                  forceExpand={forceExpand}
                />
              ))}
            </div>
          </div>

          {/* 底部挂载提示 */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-2 text-[11px] text-blue-800 flex items-center justify-between">
            <span className="truncate">挂载根目录: {dataset.mountPath}</span>
            <button
              type="button"
              onClick={() => handleCopy(dataset.mountPath, "根路径已复制")}
              className="text-blue-600 hover:text-blue-800 font-semibold shrink-0 ml-1"
            >
              复制
            </button>
          </div>
        </div>

        {/* 右侧：动态自适应模态渲染器 */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* 当前选中文件头部信息 */}
          {selectedFileNode ? (
            <div className="bg-slate-50/60 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="font-bold text-slate-900 font-mono truncate">
                  {selectedFileNode.name}
                </span>
                <span className="text-slate-400 font-mono text-[11px] truncate hidden sm:inline">
                  ({selectedFileNode.path})
                </span>
                {selectedFileNode.size && (
                  <span className="bg-slate-200/80 text-slate-600 text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0">
                    {selectedFileNode.size}
                  </span>
                )}
              </div>

              {/* 右侧操作按钮 */}
              <div className="flex items-center gap-2 shrink-0">
                {currentFileContent?.type === "table" && dataset.columns && dataset.columns.length > 0 && (
                  <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-[11px] font-sans">
                    <button
                      type="button"
                      onClick={() => setTableTabMode("data")}
                      className={`px-2 py-0.5 rounded-md transition-all ${
                        tableTabMode === "data" ? "bg-white text-blue-700 font-semibold shadow-2xs" : "text-slate-600"
                      }`}
                    >
                      数据样本
                    </button>
                    <button
                      type="button"
                      onClick={() => setTableTabMode("schema")}
                      className={`px-2 py-0.5 rounded-md transition-all ${
                        tableTabMode === "schema" ? "bg-white text-blue-700 font-semibold shadow-2xs" : "text-slate-600"
                      }`}
                    >
                      特征字典 ({dataset.columns.length})
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleCopy(selectedFileNode.path, "相对路径已复制")}
                  className="text-slate-600 hover:text-blue-600 text-xs font-mono flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-md transition-colors cursor-pointer shadow-2xs"
                  title="复制包内相对路径"
                >
                  <Copy className="w-3 h-3" />
                  <span className="hidden sm:inline">复制路径</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              请在左侧文件目录树中点击选择文件进行预览
            </div>
          )}

          {/* 右侧内容渲染区域 */}
          <div className="p-4 sm:p-5 flex-1 overflow-auto max-h-[580px]">
            {/* 1. 不支持在线预览的文件展示卡片 (如 .bin, .pth, .onnx, .h5, .pkl, .npy, .dat 等) */}
            {currentFileContent?.type === "unsupported" && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-3 min-h-[360px]">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-2xs">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-base font-mono">
                      {currentFileContent.name}
                    </h3>
                    {currentFileContent.extension && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-mono font-bold">
                        .{currentFileContent.extension.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    该文件暂不支持在线预览
                  </p>
                </div>
              </div>
            )}

            {/* 2. 图像预览 (JPG / PNG / WEBP 等) */}
            {currentFileContent?.type === "image" && (
              <div
                onClick={() => setSelectedImage({ url: currentFileContent.url, name: currentFileContent.name, label: currentFileContent.label })}
                className="relative max-h-[460px] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 shadow-inner group cursor-zoom-in"
              >
                <img
                  src={currentFileContent.url}
                  alt={currentFileContent.name}
                  referrerPolicy="no-referrer"
                  className="max-h-[440px] w-auto object-contain group-hover:scale-102 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Eye className="w-6 h-6" />
                </div>
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>{currentFileContent.name}</span>
                </div>
              </div>
            )}

            {/* 3. 表格预览 (CSV / Parquet / XLSX) */}
            {currentFileContent?.type === "table" && (
              <div className="space-y-3">
                {tableTabMode === "data" ? (
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs font-mono text-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 select-none">
                          <tr>
                            <th className="py-2 px-3 border-r border-slate-200 w-12 text-center text-slate-400 text-[11px]">
                              #
                            </th>
                            {currentFileContent.cols.map((c: string) => (
                              <th key={c} className="py-2 px-3 border-r border-slate-200 font-semibold whitespace-nowrap">
                                {c}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedRows.map((row: any, idx: number) => {
                            const globalIdx = (currentPage - 1) * pageSize + idx + 1;
                            return (
                              <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                                <td className="py-2 px-3 text-center text-slate-400 text-[11px] border-r border-slate-100 bg-slate-50/40">
                                  {globalIdx}
                                </td>
                                {currentFileContent.cols.map((c: string) => (
                                  <td key={c} className="py-2 px-3 border-r border-slate-100 truncate max-w-xs text-[11px]">
                                    {typeof row[c] === "object" ? JSON.stringify(row[c]) : String(row[c])}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* 表格底部简易分页 */}
                    {totalRowsCount > pageSize && (
                      <div className="bg-slate-50/80 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500 font-mono">
                        <span>
                          第 {currentPage} / {totalPages} 页 (共 {totalRowsCount} 条样本)
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={currentPage <= 1}
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            className="p-1 bg-white border border-slate-200 rounded text-slate-600 disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
                          >
                            上一页
                          </button>
                          <button
                            type="button"
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            className="p-1 bg-white border border-slate-200 rounded text-slate-600 disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
                          >
                            下一页
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* 表格特征字典 Schema */
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold select-none">
                        <tr>
                          <th className="py-2.5 px-4">字段名称 (Name)</th>
                          <th className="py-2.5 px-4">数据类型 (Type)</th>
                          <th className="py-2.5 px-4">缺失率 (Null %)</th>
                          <th className="py-2.5 px-4">统计均值 / 唯一值</th>
                          <th className="py-2.5 px-4">典型取值示例</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                        {(dataset.columns || []).map((col, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80">
                            <td className="py-2.5 px-4 font-bold text-slate-900">{col.name}</td>
                            <td className="py-2.5 px-4">
                              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-100">
                                {col.type}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-slate-500">{col.nullPercentage || "0%"}</td>
                            <td className="py-2.5 px-4 text-slate-600">
                              {col.mean ? `Mean: ${col.mean}` : col.uniqueCount ? `${col.uniqueCount} unique` : "-"}
                            </td>
                            <td className="py-2.5 px-4 text-slate-500 text-[11px]">
                              {col.sampleValues ? col.sampleValues.join(", ") : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 4. JSON / YAML / Code / 文本展示 */}
            {(currentFileContent?.type === "json" ||
              currentFileContent?.type === "yaml" ||
              currentFileContent?.type === "code" ||
              currentFileContent?.type === "text") && (
              <div className="bg-slate-950 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto leading-relaxed max-h-[500px] shadow-inner border border-slate-800">
                <pre className="text-emerald-400">{currentFileContent.content}</pre>
              </div>
            )}

            {/* 5. Markdown 格式化渲染 */}
            {currentFileContent?.type === "markdown" && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-slate-800 leading-relaxed font-sans space-y-3">
                <pre className="whitespace-pre-wrap font-sans text-xs">{currentFileContent.content}</pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 图片放大弹窗 */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-2 p-3.5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 truncate font-mono text-xs font-semibold text-slate-800">
                <ImageIcon className="w-4 h-4 text-pink-500" />
                <span>{selectedImage.name}</span>
                {selectedImage.label && (
                  <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded border border-blue-200">
                    {selectedImage.label}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[72vh] bg-slate-950 flex items-center justify-center rounded-xl overflow-hidden">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
