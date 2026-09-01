import React, { useState } from "react";
import {
  BookOpen,
  Copy,
  CheckCircle2,
  Terminal,
  FileCode,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Code2,
  ExternalLink,
  Info,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { DatasetItem } from "../data/mockData";

interface DatasetOverviewDocProps {
  dataset: DatasetItem;
  onNavigate?: (view: string) => void;
}

export const DatasetOverviewDoc: React.FC<DatasetOverviewDocProps> = ({
  dataset,
  onNavigate,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // 默认代码使用示例
  const defaultPythonSnippet = dataset.format === "JSON"
    ? `import json
import pandas as pd

# 读取挂载的 JSON 语料
DATASET_PATH = "${dataset.mountPath}/train.json"
with open(DATASET_PATH, 'r', encoding='utf-8') as f:
    data = [json.loads(line) for line in f]

df = pd.DataFrame(data)
print(f"数据总条数: {len(df)}")
print(df.head())`
    : dataset.format === "Images" || dataset.format === "ZIP"
    ? `import os
from pathlib import Path

DATASET_DIR = Path("${dataset.mountPath}")
image_files = list(DATASET_DIR.rglob("*.jpg")) + list(DATASET_DIR.rglob("*.png")) + list(DATASET_DIR.rglob("*.jpeg"))
print(f"挂载路径: {DATASET_DIR}")
print(f"发现图像样本总数: {len(image_files)} 张")`
    : `import pandas as pd

# 读取挂载的结构化数据
DATASET_PATH = "${dataset.mountPath}/train.csv"
df = pd.read_csv(DATASET_PATH)
print(f"数据总条目: {len(df):,} 条, 特征列数: {df.shape[1]}")
print(df.info())`;

  const defaultBibtex = `@dataset{${dataset.id.replace(/-/g, "_")}_${new Date().getFullYear()},
  title={${dataset.title}},
  author={${dataset.author.name} and ${dataset.author.org}},
  year={${dataset.createdAt ? dataset.createdAt.substring(0, 4) : "2026"}},
  version={${dataset.version}},
  publisher={UUSIMA Data Platform},
  url={https://uusima.ai/datasets/${dataset.id}}
}`;

  return (
    <div className="space-y-8 text-slate-800">
      {/* 顶部快速引导横幅 */}
      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-100 rounded-2xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
            <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
            <span>极速使用与开发环境挂载指南</span>
          </div>
          <span className="text-[11px] font-mono text-blue-700 bg-white/80 border border-blue-200/80 px-2.5 py-0.5 rounded-full font-medium">
            Read-Only Mount Mode
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          本数据集已同步入库至 UUSIMA 教学实训文件系统。在 Jupyter 实验环境中无需手动下载解压，系统会自动在容器内挂载至只读目录：
        </p>

        <div className="bg-slate-900 text-slate-200 rounded-xl p-3 font-mono text-xs flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2 truncate">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-400 select-none">$</span>
            <span className="text-emerald-300 font-semibold truncate">{dataset.mountPath}</span>
          </div>
          <button
            onClick={() => handleCopy(dataset.mountPath, "quick-mount")}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-[11px] font-medium transition-colors shrink-0 flex items-center gap-1"
          >
            {copiedSection === "quick-mount" ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>复制路径</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 详细文档主体区域 */}
      {dataset.overviewDoc ? (
        <div className="prose prose-slate max-w-none space-y-6 text-xs sm:text-sm">
          {/* 将 overviewDoc 的结构化内容优雅展示 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
            {dataset.overviewDoc.split("---").map((section, idx) => {
              const trimmed = section.trim();
              if (!trimmed) return null;

              // 检测是否为代码块
              const isCodeSection = trimmed.includes("```");
              const lines = trimmed.split("\n");
              const headingLine = lines[0] || "";
              const contentLines = lines.slice(1).join("\n");

              return (
                <div key={idx} className="space-y-3 pb-4 last:pb-0 border-b border-slate-100 last:border-b-0">
                  {headingLine.startsWith("###") && (
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-blue-600 rounded-full" />
                      <span>{headingLine.replace(/###\s*/, "")}</span>
                    </h3>
                  )}

                  {/* 渲染文本或代码块 */}
                  <div className="text-slate-700 leading-relaxed space-y-3 text-xs sm:text-[13px]">
                    {lines.map((line, lIdx) => {
                      if (line.startsWith("###")) return null;

                      // Markdown 表格
                      if (line.startsWith("|")) {
                        return null; // 表格统一在后面处理
                      }

                      // 代码块
                      if (line.startsWith("```")) {
                        return null;
                      }

                      // 列表项
                      if (line.startsWith("- ") || line.startsWith("* ")) {
                        return (
                          <div key={lIdx} className="flex items-start gap-2 ml-2">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>{line.replace(/^[-*]\s*/, "")}</span>
                          </div>
                        );
                      }

                      // 数字序号
                      if (/^\d+\./.test(line)) {
                        return (
                          <div key={lIdx} className="flex items-start gap-2 ml-2">
                            <span className="text-blue-600 font-semibold">{line.match(/^\d+\./)?.[0]}</span>
                            <span>{line.replace(/^\d+\.\s*/, "")}</span>
                          </div>
                        );
                      }

                      if (!line.trim()) return null;

                      return <p key={lIdx}>{line}</p>;
                    })}

                    {/* 代码块提取与复制按钮 */}
                    {trimmed.includes("```python") && (
                      <div className="bg-slate-900 text-slate-100 rounded-xl overflow-hidden shadow-md mt-3 font-mono text-xs">
                        <div className="bg-slate-800/90 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-700">
                          <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                            <Code2 className="w-3.5 h-3.5 text-blue-400" />
                            <span>Python 代码示例</span>
                          </span>
                          <button
                            onClick={() => {
                              const codeMatch = trimmed.match(/```python([\s\S]*?)```/);
                              if (codeMatch && codeMatch[1]) {
                                handleCopy(codeMatch[1].trim(), `code-${idx}`);
                              }
                            }}
                            className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                          >
                            {copiedSection === `code-${idx}` ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">已复制</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>复制代码</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed text-blue-200">
                          <code>{trimmed.match(/```python([\s\S]*?)```/)?.[1]?.trim() || defaultPythonSnippet}</code>
                        </pre>
                      </div>
                    )}

                    {/* BibTeX 代码块 */}
                    {trimmed.includes("```bibtex") && (
                      <div className="bg-slate-900 text-slate-100 rounded-xl overflow-hidden shadow-md mt-3 font-mono text-xs">
                        <div className="bg-slate-800/90 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-700">
                          <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                            <span>BibTeX 引用格式</span>
                          </span>
                          <button
                            onClick={() => {
                              const codeMatch = trimmed.match(/```bibtex([\s\S]*?)```/);
                              if (codeMatch && codeMatch[1]) {
                                handleCopy(codeMatch[1].trim(), `bib-${idx}`);
                              }
                            }}
                            className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                          >
                            {copiedSection === `bib-${idx}` ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">已复制</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>复制 Citation</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed text-amber-200">
                          <code>{trimmed.match(/```bibtex([\s\S]*?)```/)?.[1]?.trim() || defaultBibtex}</code>
                        </pre>
                      </div>
                    )}

                    {/* 字段表格解析 (如果包含表格) */}
                    {trimmed.includes("| 字段名称 |") && (
                      <div className="overflow-x-auto rounded-xl border border-slate-200 mt-3 shadow-2xs">
                        <table className="w-full text-left text-xs border-collapse bg-white">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                              <th className="p-3">字段名称</th>
                              <th className="p-3">数据类型</th>
                              <th className="p-3">说明</th>
                              <th className="p-3">含义解释</th>
                              <th className="p-3">典型取值示例</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-600">
                            {trimmed
                              .split("\n")
                              .filter((row) => row.startsWith("|") && !row.includes("字段名称") && !row.includes(":---"))
                              .map((row, rIdx) => {
                                const cols = row.split("|").map((c) => c.trim()).filter(Boolean);
                                if (cols.length < 3) return null;
                                return (
                                  <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors font-sans">
                                    <td className="p-3 font-mono font-bold text-blue-600 bg-blue-50/30">
                                      {cols[0]?.replace(/`/g, "")}
                                    </td>
                                    <td className="p-3 font-mono text-slate-700 font-semibold">{cols[1]}</td>
                                    <td className="p-3 text-slate-500">{cols[2]}</td>
                                    <td className="p-3 text-slate-800 font-medium">{cols[3]}</td>
                                    <td className="p-3 font-mono text-slate-500 text-[11px] bg-slate-50/50">{cols[4] || "-"}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 若无特定 overviewDoc，展示结构化标准概述 */
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6 text-xs sm:text-[13px]">
          {/* 1. 数据背景 */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full" />
              <span>数据背景与业务说明</span>
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {dataset.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="text-[11px] text-slate-400 font-medium">任务分类</div>
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{dataset.techDomains?.join(" / ") || dataset.techDomain}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="text-[11px] text-slate-400 font-medium">业务领域</div>
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>{dataset.themes?.join(" / ") || dataset.theme}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="text-[11px] text-slate-400 font-medium">存储与规模</div>
                <div className="font-bold text-slate-800 font-mono">
                  {dataset.fileSize} ({dataset.rowCount ? `${dataset.rowCount.toLocaleString()} 条/样本` : "多文件集合"})
                </div>
              </div>
            </div>
          </div>

          {/* 2. Python 快速使用示例 */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-600 rounded-full" />
                <span>快速使用与加载示例 (Python)</span>
              </h3>
              <button
                onClick={() => handleCopy(defaultPythonSnippet, "default-snippet")}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                {copiedSection === "default-snippet" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制代码</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs leading-relaxed overflow-x-auto shadow-inner">
              <pre className="text-blue-200">
                <code>{defaultPythonSnippet}</code>
              </pre>
            </div>
          </div>

          {/* 3. 字段字典（若有 columns） */}
          {dataset.columns && dataset.columns.length > 0 && (
            <div className="space-y-3 pb-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-600 rounded-full" />
                <span>字段结构与数据字典 (Data Dictionary)</span>
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                <table className="w-full text-left text-xs border-collapse bg-white">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                      <th className="p-3">字段名称</th>
                      <th className="p-3">数据类型</th>
                      <th className="p-3">缺失率</th>
                      <th className="p-3">样例值</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {dataset.columns.map((col, cIdx) => (
                      <tr key={cIdx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-blue-600">{col.name}</td>
                        <td className="p-3 font-mono text-slate-700 font-semibold">{col.type}</td>
                        <td className="p-3 text-slate-500 font-mono">{col.nullPercentage}</td>
                        <td className="p-3 font-mono text-slate-500 text-[11px]">
                          {col.sampleValues.join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. 引用格式 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-600 rounded-full" />
                <span>引用格式 (Citation / BibTeX)</span>
              </h3>
              <button
                onClick={() => handleCopy(defaultBibtex, "default-bib")}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                {copiedSection === "default-bib" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制 BibTeX</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-900 text-amber-200 rounded-xl p-4 font-mono text-xs leading-relaxed overflow-x-auto shadow-inner">
              <pre>
                <code>{defaultBibtex}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
