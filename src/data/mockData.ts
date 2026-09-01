export interface DatasetVersion {
  version: string;
  updatedAt: string;
  author: string;
  size: string;
  sizeBytes: number;
  changelog: string;
}

export interface DatasetColumn {
  name: string;
  type: string;
  nullCount: number;
  nullPercentage: string;
  mean?: string;
  min?: string;
  max?: string;
  uniqueCount?: number;
  sampleValues: string[];
}

export interface AssociatedCourse {
  courseId: string;
  courseName: string;
  labId: string;
  labName: string;
  chapter: string;
}

export interface PlatformCourseChapter {
  id: string;
  title: string;
  labName?: string;
}

export interface PlatformCourseItem {
  id: string;
  name: string;
  category: string;
  code?: string;
  teacher?: string;
  chapters: PlatformCourseChapter[];
}

export const PLATFORM_COURSES: PlatformCourseItem[] = [
  {
    id: "course-ai-01",
    name: "人工智能训练师 (高级工)",
    category: "人工智能",
    code: "AI-TR-301",
    teacher: "郑鸿杰 (副教授)",
    chapters: [
      { id: "ch-01-01", title: "第1章 人工智能开发环境搭建与Jupyter平台使用", labName: "环境实训-JupyterLab" },
      { id: "ch-01-02", title: "第2章 真实业务场景数据采集、清洗与探索性分析 (EDA)", labName: "数据预处理实训" },
      { id: "ch-01-03", title: "第3章 机器学习实战：客户流失预测与特征工程", labName: "特征工程与分类模型实训" },
      { id: "ch-01-04", title: "第4章 典型分类与回归算法评测 (XGBoost/LightGBM)", labName: "集成学习算法实战" },
      { id: "ch-01-05", title: "第5章 深度学习全连接网络与模型评估指标", labName: "深度学习基础实验" },
      { id: "ch-01-06", title: "综合实训一：电商用户多维画像与购买行为转化预测", labName: "电商转化预测综合实训" },
    ],
  },
  {
    id: "course-ai-02",
    name: "AI学件-人工智能训练师（高级工）软件版",
    category: "人工智能",
    code: "AI-SOFT-302",
    teacher: "李明辉 (讲师)",
    chapters: [
      { id: "ch-02-01", title: "第1章 软件版实验环境与数据挂载指引", labName: "基础环境挂载" },
      { id: "ch-02-02", title: "第2章 多源异构数据清洗与数据质量校验", labName: "数据质量校验实验" },
      { id: "ch-02-03", title: "第3章 机器学习模型调优与超参数搜索", labName: "超参数搜索实验" },
      { id: "ch-02-04", title: "综合实验二：商业零售推荐系统构建", labName: "协同过滤与推荐系统实验" },
    ],
  },
  {
    id: "course-cv-01",
    name: "计算机视觉与深度学习实战",
    category: "计算机视觉",
    code: "CV-DL-401",
    teacher: "张晓峰 (教授)",
    chapters: [
      { id: "ch-03-01", title: "第1章 OpenCV图像处理与几何变换基础", labName: "OpenCV基础实验" },
      { id: "ch-03-02", title: "第2章 卷积神经网络 (CNN) 图像分类实战", labName: "CNN经典网络分类实验" },
      { id: "ch-03-03", title: "第3章 YOLO 目标检测模型训练与评估", labName: "YOLO目标检测实训" },
      { id: "ch-03-04", title: "第4章 图像语义分割 (U-Net) 医学与工业应用", labName: "语义分割实验" },
      { id: "ch-03-05", title: "第5章 医学影像病灶识别与胸部X光智能筛查", labName: "医学影像智能诊断实验" },
      { id: "ch-03-06", title: "综合实训：道路车辆与复杂场景行人检测", labName: "智慧交通目标检测综合实验" },
    ],
  },
  {
    id: "course-nlp-01",
    name: "自然语言处理与大模型应用开发",
    category: "大模型/NLP",
    code: "LLM-NLP-501",
    teacher: "陈思源 (研究员)",
    chapters: [
      { id: "ch-04-01", title: "第1章 文本分词、词向量与传统文本分类", labName: "词向量构建实验" },
      { id: "ch-04-02", title: "第2章 循环神经网络 (RNN/LSTM) 情感倾向分析", labName: "情感分析实训" },
      { id: "ch-04-03", title: "第3章 Transformer架构剖析与BERT微调", labName: "BERT多标签分类实验" },
      { id: "ch-04-04", title: "第4章 大模型指令微调 (LoRA/SFT) 语料制作与训练", labName: "LoRA指令微调实战" },
      { id: "ch-04-05", title: "第5章 RAG 检索增强生成与知识库搭建", labName: "RAG知识库问答实训" },
      { id: "ch-04-06", title: "综合实验：智能客服多轮对话意图识别与槽位填充", labName: "智能客服多轮对话实战" },
    ],
  },
  {
    id: "course-data-01",
    name: "Python数据分析与挖掘实战",
    category: "大数据",
    code: "PY-DATA-201",
    teacher: "王建国 (副教授)",
    chapters: [
      { id: "ch-05-01", title: "第1章 NumPy与Pandas核心数据处理", labName: "Pandas数据清洗" },
      { id: "ch-05-02", title: "第2章 Matplotlib与Seaborn数据探索可视化", labName: "统计图表可视化实验" },
      { id: "ch-05-03", title: "第3章 金融时间序列分析与趋势预测", labName: "时序平稳性与ARIMA实验" },
      { id: "ch-05-04", title: "第4章 银行信用卡违约风险预测与风控建模", labName: "金融风控评分卡实验" },
      { id: "ch-05-05", title: "综合实训：全球主要城市气象监测与空气质量预测", labName: "气象时序预测综合实训" },
    ],
  },
  {
    id: "course-iot-01",
    name: "物联网边缘计算与数据采集应用",
    category: "物联网",
    code: "IOT-EDGE-305",
    teacher: "刘振华 (高级工程师)",
    chapters: [
      { id: "ch-06-01", title: "第1章 边缘计算网关环境搭建与MQTT协议接入", labName: "MQTT通信实验" },
      { id: "ch-06-02", title: "第2章 工业传感器多通道时序数据清洗与异常过滤", labName: "传感器时序清洗实验" },
      { id: "ch-06-03", title: "第3章 工业产线振动信号时频分析与故障预警", labName: "振动信号分析实验" },
      { id: "ch-06-04", title: "综合实训：智慧工厂设备预测性维护与状态监测", labName: "设备预测性维护实训" },
    ],
  },
  {
    id: "course-speech-01",
    name: "智能语音信号处理与语音识别 (ASR)",
    category: "语音技术",
    code: "AUDIO-ASR-402",
    teacher: "周晓琳 (副教授)",
    chapters: [
      { id: "ch-07-01", title: "第1章 音频信号预处理、加窗分帧与梅尔频谱提取", labName: "梅尔频谱提取实验" },
      { id: "ch-07-02", title: "第2章 声学模型构建与CTC损失函数训练", labName: "CTC声学模型实验" },
      { id: "ch-07-03", title: "第3章 端到端中文普通话语音识别模型评测", labName: "中文语音识别评测实验" },
    ],
  },
];

export interface DatasetFileTreeNode {
  name: string;
  type: "file" | "folder";
  size?: string;
  path: string;
  extension?: string;
  childrenCount?: number;
  children?: DatasetFileTreeNode[];
}

export type DatasetAuditStatus = "pending" | "approved" | "rejected";

export interface DatasetItem {
  id: string;
  title: string;
  description: string;
  techDomain: string; // 技术领域 (兼容单选/首个)
  techDomains?: string[]; // 技术领域 (多选标签列表)
  theme: string; // 主题 (原应用领域，兼容单选/首个)
  themes?: string[]; // 主题 (多选标签列表)
  format: "CSV" | "JSON" | "Parquet" | "ZIP" | "Images" | "TXT" | "XLSX";
  fileSize: string;
  sizeBytes: number;
  visibility: "public" | "school" | "private"; // 公开(全平台) vs 全校可见 vs 个人私有
  auditStatus?: DatasetAuditStatus; // 审核状态: "pending" 待审核 / "approved" 已通过 / "rejected" 已驳回
  auditReason?: string; // 审核批注/驳回原因
  auditTime?: string; // 审核处理时间
  auditor?: string; // 审核人
  submitTime?: string; // 提交审核时间
  permission: "download_and_mount" | "mount_only"; // 允许下载 vs 仅允许挂载读取
  version: string;
  versionsList: DatasetVersion[];
  author: {
    name: string;
    role: "teacher" | "student" | "admin";
    org: string;
  };
  createdAt: string;
  updatedAt: string;
  mountCount: number;
  downloadCount: number;
  favoriteCount: number;
  isFavorite: boolean;
  isMounted: boolean;
  mountPath: string;
  rowCount?: number;
  columnCount?: number;
  columns?: DatasetColumn[];
  previewRows?: Record<string, any>[];
  previewImages?: { url: string; label: string; name: string }[];
  previewText?: string;
  fileTree?: DatasetFileTreeNode[]; // 压缩包/复合目录文件树
  yamlConfig?: string; // YOLO/COCO 等算法专用配置清单（如 data.yaml）
  isComplexArchive?: boolean; // 是否为复合目录/算法专用包（降级为目录树+挂载调用模式）
  customCoverImage?: string; // 用户手动上传/选择的自定义封面图片URL (选填，若未上传则采用智能算法生成)
  overviewDoc?: string; // 数据集详细概述与文档 (支持Markdown格式，包含背景、字典、评测、使用方法、引用等)
  associatedCourses: AssociatedCourse[];
}

/**
 * 智能提取数据集概述的前半部分文本作为卡片/列表的摘要展示
 */
export function extractDatasetSummary(ds: { overviewDoc?: string; description?: string }): string {
  if (ds.overviewDoc && ds.overviewDoc.trim()) {
    const lines = ds.overviewDoc.split("\n");
    const textLines: string[] = [];
    let inCode = false;
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith("```")) {
        inCode = !inCode;
        continue;
      }
      if (inCode) continue;
      if (line.startsWith("---") || line.startsWith("#") || line.startsWith("|")) continue;
      if (line.startsWith("- ") || line.startsWith("* ") || /^\d+\./.test(line)) {
        textLines.push(line.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, ""));
      } else if (line.length > 0) {
        textLines.push(line);
      }
      // 控制长度在 150 字左右
      if (textLines.join(" ").length >= 140) {
        break;
      }
    }
    const combined = textLines.join(" ").replace(/\s+/g, " ").trim();
    if (combined.length > 0) {
      return combined.length > 150 ? combined.substring(0, 150) + "..." : combined;
    }
  }
  return ds.description || "暂无详细概述与文档说明";
}

/**
 * 标准数据集详细概述与说明文档规范模板
 * 结构顺序：
 * 1. 业务背景、核心目标与样本量 (第一段置顶)
 * 2. 字段说明与数据字典
 * 3. 适用模型与推荐基准
 * 4. 如何使用数据集 (Python 代码示例与挂载方法置后)
 * 5. 引用格式 (BibTeX)
 */
export const DATASET_OVERVIEW_TEMPLATE = `### 📖 业务背景、核心目标与样本量

- **业务背景与数据来源**：采集自真实商业/工业/实验场景脱敏日志，具备高度代表性与真实业务挑战。
- **核心应用目标**：用于支撑机器学习分类预测、特征工程构建、深度学习算法评测与教学实验。
- **样本规模与分布**：包含 100,000 条高质量清洗样本，已完成空值处理与异常值检测，严格划分训练集与验证集。

---

### 📋 字段说明与数据字典

| 字段名称 | 数据类型 | 允许空值 | 含义解释 | 典型取值示例 |
| :--- | :--- | :--- | :--- | :--- |
| \`id\` | INT | 否 | 样本全局唯一标识编号 | 1001 |
| \`feature_1\` | FLOAT | 否 | 核心业务特征维度 | 24.5 |
| \`category\` | VARCHAR | 是 | 业务分类标签 | electronics |
| \`target\` | INT | 否 | 预测目标分类 (0/1) | 1 |

---

### 🎯 适用模型与推荐基准

- **推荐算法**：XGBoost, LightGBM, CatBoost, Random Forest, MLP, Transformer
- **基准表现**：Baseline 模型在 5 折交叉验证下预测准确率达 **93.2%**，F1-Score 达 **0.895**。

---

### 🚀 如何使用数据集

在 Python / JupyterLab 实验环境中一键挂载至实验目录后极速加载读取：

\`\`\`python
import pandas as pd

# 1. 快速读取已挂载的数据集
DATASET_PATH = '/home/jovyan/datasets/demo_dataset/train.csv'
df = pd.read_csv(DATASET_PATH)
print(f"数据总条数: {len(df):,}, 特征维度: {df.shape[1]} 列")
print(df.head())
\`\`\`

---

### 📝 引用格式 (Citation / BibTeX)

\`\`\`bibtex
@dataset{uusima_dataset_2026,
  title={数据集名称},
  author={作者/组织机构},
  year={2026},
  publisher={UUSIMA Data Platform}
}
\`\`\``;

export interface UserPersona {
  id: string;
  name: string;
  role: "teacher" | "student" | "admin";
  roleName: string;
  org: string;
  avatarText: string;
  storageUsedGB: number;
  storageTotalGB: number;
}

export const USER_PERSONAS: UserPersona[] = [
  {
    id: "user-1",
    name: "郑鸿杰",
    role: "teacher",
    roleName: "教师",
    org: "新大陆时代科技·AI教学研究部",
    avatarText: "郑",
    storageUsedGB: 4.8,
    storageTotalGB: 20,
  },
  {
    id: "user-2",
    name: "李明",
    role: "student",
    roleName: "学生",
    org: "计算机与大数据学院·2023级AI实训班",
    avatarText: "李",
    storageUsedGB: 2.3,
    storageTotalGB: 20,
  },
  {
    id: "user-3",
    name: "王建国",
    role: "admin",
    roleName: "管理员",
    org: "UUSIMA平台运维与计算中心",
    avatarText: "管",
    storageUsedGB: 18.5,
    storageTotalGB: 100,
  },
];

export interface TagItem {
  id: string;
  name: string;
  category?: "techDomain" | "theme";
  enabled: boolean;
  isPreset: boolean;
  createdAt: string;
  updatedAt: string;
  datasetCount?: number;
  description?: string;
}

export interface UserQuotaItem {
  userId: string;
  userName: string;
  role: "teacher" | "student" | "admin";
  roleName: string;
  org: string;
  phone?: string;
  email?: string;
  usedGB: number;
  totalGB: number;
  datasetCount: number;
  status: "normal" | "warning";
}

export interface AuditLogItem {
  id: string;
  operator: string;
  operatorRole: string;
  operatorOrg: string;
  action: string;
  category: "dataset" | "tag" | "quota" | "permission" | "config" | "security";
  target: string;
  targetId?: string;
  timestamp: string;
  status: "success" | "warning" | "failed";
  ip: string;
  details: string;
}

export interface DatasetSystemConfig {
  allowCustomTags: boolean;
  defaultUserQuotaGB: number;
  defaultRoleQuotas: {
    teacher: number;
    student: number;
    admin: number;
  };
  maxDatasetSizeGB: number;
  defaultPublicPermission: "mount_only" | "download_and_mount";
  allowedExtensions: string[];
  checkReferencesBeforeDelete: boolean;
  deleteMode: "soft" | "hard";
  enableAuditLogs: boolean;
  logRetentionDays: number;
}

export const DEFAULT_DATASET_SYSTEM_CONFIG: DatasetSystemConfig = {
  allowCustomTags: false,
  defaultUserQuotaGB: 20,
  defaultRoleQuotas: {
    teacher: 50,
    student: 20,
    admin: 100,
  },
  maxDatasetSizeGB: 5,
  defaultPublicPermission: "mount_only",
  allowedExtensions: [".csv", ".xls", ".xlsx", ".json", ".parquet", ".txt", ".jpg", ".png", ".zip"],
  checkReferencesBeforeDelete: true,
  deleteMode: "soft",
  enableAuditLogs: true,
  logRetentionDays: 180,
};

export const INITIAL_TAG_ITEMS: TagItem[] = [
  { id: "tag-bs-1", name: "智慧农业", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 20, description: "农作物病虫害、土壤墒情与生态监测" },
  { id: "tag-bs-2", name: "情感分析", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 26, description: "自然语言正负向与细粒度情绪分析" },
  { id: "tag-bs-3", name: "商业零售", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 48, description: "电商用户行为、推荐转化与供应链" },
  { id: "tag-bs-4", name: "金融科技", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 42, description: "银行风控、量化交易与证券行情" },
  { id: "tag-bs-5", name: "智慧医疗", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 39, description: "医学影像、电子病历与生命体征" },
  { id: "tag-bs-6", name: "智慧交通", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 31, description: "车载传感器、道路卡口与轨迹流" },
  { id: "tag-bs-7", name: "工业制造", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 35, description: "产线缺陷检测、设备振动与PLC时序" },
  { id: "tag-bs-8", name: "智能气象", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 18, description: "雷达回波、降水时序与地质气象预警" },
  { id: "tag-bs-9", name: "科技互联网", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 56, description: "搜索推荐、知识图谱与网络流量" },
  { id: "tag-bs-10", name: "教育培训", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 34, description: "学生学情、答题测评与互动日志" },
  { id: "tag-bs-11", name: "能源电力", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 27, description: "新能源出力预测、变电站巡检与微电网" },
  { id: "tag-bs-12", name: "智能安防", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 26, description: "周界防范、人员布控与异常行为预警" },
  { id: "tag-bs-13", name: "生物医药", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 21, description: "蛋白质折叠、小分子靶点与药物亲和力" },
  { id: "tag-bs-14", name: "物流仓储", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 22, description: "包裹路径规划、仓储AGV调度与装载率" },
  { id: "tag-bs-15", name: "智能家居", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 16, description: "家庭设备联动、室内传感器与语音控制" },
  { id: "tag-bs-16", name: "低碳环保", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 19, description: "碳排放计量、空气质量与排污监测" },
  { id: "tag-bs-17", name: "地质遥感", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 17, description: "高光谱遥感、地质勘测与地形高程模型" },
  { id: "tag-bs-18", name: "具身机器人", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 15, description: "机械臂操作轨迹、多模态触觉与空间感知" },
  { id: "tag-bs-19", name: "元宇宙与XR", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 14, description: "3D点云重建、空间手势与虚拟交互" },
  { id: "tag-bs-20", name: "数字版权", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 12, description: "数字水印、内容溯源与侵权比对" },
  { id: "tag-bs-21", name: "司法政法", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 18, description: "裁判文书、法条检索与司法语义分析" },
  { id: "tag-bs-22", name: "水利水电", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 13, description: "水库径流、大坝形变与汛情预警监测" },
  { id: "tag-bs-23", name: "海洋监测", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 11, description: "洋流水温、海洋生态与潮位观测" },
  { id: "tag-bs-24", name: "食品安全", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 15, description: "农残快检、食品溯源与保质期预测" },
  { id: "tag-bs-25", name: "文博考古", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 10, description: "文物3D扫描、古籍文献与出土纹理" },
  { id: "tag-bs-26", name: "跨境电商", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 22, description: "海外选品、多币种交易与国际物流跟踪" },
  { id: "tag-bs-27", name: "游戏动漫", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 17, description: "玩家行为流、动作捕捉与3D资产生成" },
  { id: "tag-bs-28", name: "文旅商贸", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 15, description: "景区客流热力图、商圈活跃度与文旅推荐" },
  { id: "tag-bs-29", name: "自动驾驶", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 28, description: "激光雷达点云、街景多目标与端到端智驾" },
  { id: "tag-bs-30", name: "政务民生", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 23, description: "政务热线、民生诉求与城市体征" },
  { id: "tag-bs-31", name: "航空航天", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 16, description: "卫星遥感高光谱、飞行器遥测与遥感影像" },
  { id: "tag-bs-32", name: "通用场景", enabled: true, isPreset: true, createdAt: "2026-01-01", updatedAt: "2026-01-01", datasetCount: 30, description: "多领域通用基础模型测试集与通用基准" },
];

export const INITIAL_USER_QUOTAS: UserQuotaItem[] = [
  {
    userId: "user-1",
    userName: "郑鸿杰",
    role: "teacher",
    roleName: "教师",
    org: "新大陆时代科技·AI教学研究部",
    phone: "15396005420",
    email: "zhj@newland.com",
    usedGB: 4.8,
    totalGB: 20,
    datasetCount: 8,
    status: "normal",
  },
  {
    userId: "user-2",
    userName: "李明",
    role: "student",
    roleName: "学生",
    org: "计算机与大数据学院·2023级AI实训班",
    phone: "13800138000",
    email: "liming@student.edu.cn",
    usedGB: 2.3,
    totalGB: 20,
    datasetCount: 3,
    status: "normal",
  },
  {
    userId: "user-3",
    userName: "王建国",
    role: "admin",
    roleName: "管理员",
    org: "UUSIMA平台运维与计算中心",
    phone: "18900001111",
    email: "admin@uusima.com",
    usedGB: 18.5,
    totalGB: 100,
    datasetCount: 14,
    status: "normal",
  },
  {
    userId: "user-4",
    userName: "张晓华",
    role: "teacher",
    roleName: "教师",
    org: "智能工程系",
    phone: "13911223344",
    email: "zhangxh@fjit.edu.cn",
    usedGB: 19.2,
    totalGB: 20,
    datasetCount: 12,
    status: "warning",
  },
  {
    userId: "user-5",
    userName: "陈雨晨",
    role: "student",
    roleName: "学生",
    org: "人工智能产教融合基地",
    phone: "13766554433",
    email: "chenyc@stu.ai.org",
    usedGB: 20.0,
    totalGB: 20,
    datasetCount: 6,
    status: "warning",
  },
  {
    userId: "user-6",
    userName: "赵志鹏",
    role: "teacher",
    roleName: "教师",
    org: "物联网与信息工程系",
    phone: "13699887766",
    email: "zhaozp@school.edu.cn",
    usedGB: 11.4,
    totalGB: 30,
    datasetCount: 7,
    status: "normal",
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "log-101",
    operator: "王建国 (admin)",
    operatorRole: "系统管理员",
    operatorOrg: "平台运维与计算中心",
    action: "调整用户配额",
    category: "quota",
    target: "张晓华 (教师)",
    targetId: "user-4",
    timestamp: "2026-08-26 19:45:12",
    status: "success",
    ip: "192.168.1.108",
    details: "将用户默认存储配额从 20GB 调增至 35GB (扩容 +75%)",
  },
  {
    id: "log-102",
    operator: "郑鸿杰 (teacher)",
    operatorRole: "骨干教师",
    operatorOrg: "新大陆时代科技·AI教学研究部",
    action: "上传新数据集",
    category: "dataset",
    target: "电商用户多维画像与购买行为转化预测",
    targetId: "ds-001",
    timestamp: "2026-08-26 18:20:05",
    status: "success",
    ip: "192.168.3.45",
    details: "上传 348.6MB CSV格式数据集，权限设为仅挂载，发布为公开资产",
  },
  {
    id: "log-103",
    operator: "王建国 (admin)",
    operatorRole: "系统管理员",
    operatorOrg: "平台运维与计算中心",
    action: "新增标签",
    category: "tag",
    target: "任务类型: 大模型指令微调 (SFT)",
    targetId: "tag-td-7",
    timestamp: "2026-08-25 15:10:30",
    status: "success",
    ip: "192.168.1.108",
    details: "在后台标签库新增任务类型标签，设为启用状态",
  },
  {
    id: "log-104",
    operator: "李明 (student)",
    operatorRole: "实训学员",
    operatorOrg: "计算机与大数据学院",
    action: "挂载数据集",
    category: "dataset",
    target: "智能客服多轮对话意图识别",
    targetId: "ds-002",
    timestamp: "2026-08-25 14:02:19",
    status: "success",
    ip: "10.12.55.89",
    details: "成功将数据集以只读符号链接挂载至 JupyterLab 工作空间",
  },
  {
    id: "log-105",
    operator: "王建国 (admin)",
    operatorRole: "系统管理员",
    operatorOrg: "平台运维与计算中心",
    action: "更新文件白名单",
    category: "config",
    target: "允许上传扩展名列表",
    timestamp: "2026-08-24 11:30:00",
    status: "success",
    ip: "192.168.1.108",
    details: "将 .parquet 与 .zip 纳入合法白名单扩展名集合",
  },
  {
    id: "log-106",
    operator: "张晓华 (teacher)",
    operatorRole: "副教授",
    operatorOrg: "智能工程系",
    action: "删除关联校验拦截",
    category: "security",
    target: "道路车辆与行人夜间检测",
    targetId: "ds-003",
    timestamp: "2026-08-23 16:40:22",
    status: "warning",
    ip: "192.168.4.12",
    details: "尝试删除已被《计算机视觉实战》实验引用的数据集，系统触发安全拦截并弹窗确认",
  },
];

// 任务类型与应用领域的分类组体系 (支持几十个标签时的高效归类与检索)
export interface TagCategoryGroup {
  id: string;
  name: string;
  tags: string[];
}

export const TECH_DOMAIN_GROUPS: TagCategoryGroup[] = [
  {
    id: "tech_popular",
    name: "常用推荐",
    tags: ["图像分类", "目标检测", "文本分类", "大模型指令微调 (SFT)", "表格数据", "时间序列预测", "推荐系统", "问答系统 (QA)"],
  },
  {
    id: "cv",
    name: "计算机视觉 (CV)",
    tags: ["图像分类", "目标检测", "图像分割", "姿态估计", "OCR文字识别", "图像生成/扩散模型", "视频动作识别", "人脸识别"],
  },
  {
    id: "nlp",
    name: "自然语言与大模型 (NLP/LLM)",
    tags: ["文本分类", "序列标注/NER", "文本生成", "机器翻译", "情感分析", "大模型指令微调 (SFT)", "问答系统 (QA)", "文本摘要"],
  },
  {
    id: "speech",
    name: "语音与音频 (Audio)",
    tags: ["语音识别 (ASR)", "语音合成 (TTS)", "声纹识别", "音频事件检测"],
  },
  {
    id: "data_ml",
    name: "数据挖掘与强化学习",
    tags: ["表格数据", "时间序列预测", "推荐系统", "异常检测/风控", "图神经网络/知识图谱", "强化学习"],
  },
];

export const THEME_GROUPS: TagCategoryGroup[] = [
  {
    id: "popular",
    name: "常用推荐",
    tags: ["商业零售", "科技互联网", "智慧交通/车联网", "工业制造/质检", "医疗健康", "经济金融", "教育培训", "能源电力/智能电网"],
  },
  {
    id: "business",
    name: "商业与金融",
    tags: ["经济金融", "量化投资", "商业零售", "跨境电商", "房地产"],
  },
  {
    id: "healthcare",
    name: "医疗与健康",
    tags: ["医疗健康", "生物医药/分子计算"],
  },
  {
    id: "traffic_industry",
    name: "交通与工业能源",
    tags: ["智慧交通/车联网", "自动驾驶", "智能安防", "工业制造/质检", "能源电力/智能电网", "物流仓储"],
  },
  {
    id: "agri_env",
    name: "农林气象与生态",
    tags: ["农业环保/精准农业", "气象水文/地质监测", "航空航天"],
  },
  {
    id: "tech_gov_culture",
    name: "科技与文娱政务",
    tags: ["科技互联网", "教育培训", "政务民生/数字治理", "文化传媒/内容创作", "游戏动漫/XR元宇宙", "文旅体育"],
  },
];

// 任务类型列表 (维度一)
export const TECH_DOMAINS = [
  "图像分类",
  "目标检测",
  "图像分割",
  "姿态估计",
  "OCR文字识别",
  "图像生成/扩散模型",
  "视频动作识别",
  "人脸识别",
  "文本分类",
  "序列标注/NER",
  "文本生成",
  "机器翻译",
  "情感分析",
  "大模型指令微调 (SFT)",
  "问答系统 (QA)",
  "文本摘要",
  "语音识别 (ASR)",
  "语音合成 (TTS)",
  "声纹识别",
  "音频事件检测",
  "表格数据",
  "时间序列预测",
  "推荐系统",
  "异常检测/风控",
  "图神经网络/知识图谱",
  "强化学习",
] as const;

// 业务应用场景分类列表 (用于数据大厅核心业务场景分类检索，支持30~40+细分行业场景检索)
export const BUSINESS_SCENARIOS = [
  "智慧农业",
  "情感分析",
  "商业零售",
  "金融科技",
  "智慧医疗",
  "智慧交通",
  "工业制造",
  "智能气象",
  "科技互联网",
  "教育培训",
  "能源电力",
  "智能安防",
  "生物医药",
  "物流仓储",
  "智能家居",
  "低碳环保",
  "地质遥感",
  "具身机器人",
  "元宇宙与XR",
  "数字版权",
  "司法政法",
  "水利水电",
  "海洋监测",
  "食品安全",
  "文博考古",
  "跨境电商",
  "游戏动漫",
  "文旅商贸",
  "自动驾驶",
  "政务民生",
  "航空航天",
  "通用场景",
] as const;

// 业务应用场景列表 (兼容历史命名)
export const THEMES = BUSINESS_SCENARIOS;

export const FILE_FORMATS = [
  "CSV",
  "JSON",
  "Parquet",
  "ZIP",
  "Images",
  "TXT",
  "XLSX",
] as const;

export const INITIAL_DATASETS: DatasetItem[] = [
  {
    id: "ds-001",
    title: "电商用户多维画像与购买行为转化预测数据集",
    description: "涵盖50万条真实电商脱敏行为日志，包含用户ID、浏览时长、加购频次、品类偏好、优惠券核销及30天复购标签，适用于构建高精度用户流失预警与推荐模型。",
    techDomain: "推荐系统",
    techDomains: ["推荐系统", "表格数据"],
    theme: "商业零售",
    themes: ["商业零售", "跨境电商"],
    format: "CSV",
    fileSize: "348.6 MB",
    sizeBytes: 365534208,
    visibility: "public",
    auditStatus: "approved",
    auditTime: "2026-08-15 14:40",
    auditor: "王建国 (管理员)",
    permission: "download_and_mount",
    version: "V2.1",
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源与背景**：本数据集源于国内大型综合电商平台真实用户脱敏日志，涵盖 2025-2026 年大促及日常经营周期的多维度交互轨迹。
- **核心业务目标**：通过分析用户浏览深度、加购互动及历史券包核销行为，提前预测用户在未来 30 天内是否会产生二次复购，辅助精细化营销与用户流失预警。
- **样本量与清洗规范**：共计 524,800 条高质量清洗样本；所有用户 ID 均经过 SHA-256 哈希加盐脱敏；价格与金额进行了对数归一化与分箱处理，确保商业合规。

---

### 📋 字段说明与数据字典

| 字段名称 | 数据类型 | 缺失率 | 含义解释 | 示例值 |
| :--- | :--- | :--- | :--- | :--- |
| \`user_id\` | BIGINT | 0.0% | 脱敏后的用户唯一标识 | 1002341 |
| \`age_group\` | VARCHAR | 0.02% | 用户年龄段划分 | 18-24, 25-34, 35-49 |
| \`gender\` | VARCHAR | 0.0% | 性别 (M: 男, F: 女, Unknown) | F |
| \`browse_duration_sec\` | FLOAT | 0.0% | 当日累计浏览会话时长 (秒) | 480.2 |
| \`cart_add_count\` | INT | 0.0% | 加购商品总件数 | 3 |
| \`category_code\` | VARCHAR | 0.01% | 偏好浏览的主类目编码 | electronics.phone |
| \`coupon_used\` | INT | 0.0% | 是否核销使用促销优惠券 (0/1) | 1 |
| \`is_repurchased_30d\` | INT (Target) | 0.0% | **预测目标**：30天内是否复购 (0/1) | 1 |

---

### 🎯 适用模型与基准评测

- **推荐算法**：XGBoost, LightGBM, CatBoost, DeepFM, DIN (Deep Interest Network)
- **基准效果**：LightGBM 基线模型在 5 折交叉验证下 ROC-AUC 达到 **0.842**，F1-Score 达到 **0.789**。

---

### 🚀 如何使用数据集

在 JupyterLab 或 Python 实验环境中一键挂载至 \`/home/jovyan/datasets/ecommerce_user_behavior\`。

\`\`\`python
import pandas as pd
import numpy as np

# 1. 快速读取 CSV 数据
df = pd.read_csv('/home/jovyan/datasets/ecommerce_user_behavior/train.csv')
print(f"用户行为记录总数: {len(df):,} 条, 特征维度: {df.shape[1]} 列")

# 2. 查看30天复购转化比例
conversion_rate = df['is_repurchased_30d'].mean() * 100
print(f"30天内整体复购转化率: {conversion_rate:.2f}%")
\`\`\``,
    versionsList: [
      {
        version: "V2.1",
        updatedAt: "2026-08-15 14:30",
        author: "郑鸿杰 (教师)",
        size: "348.6 MB",
        sizeBytes: 365534208,
        changelog: "补齐了2026年Q2用户大促期间的优惠券核销特征，优化了空值填充策略。",
      },
      {
        version: "V2.0",
        updatedAt: "2026-06-10 11:20",
        author: "郑鸿杰 (教师)",
        size: "310.2 MB",
        sizeBytes: 325268480,
        changelog: "重构字段命名标准，统一时间戳格式为 ISO 8601。",
      },
      {
        version: "V1.0",
        updatedAt: "2026-03-01 09:00",
        author: "郑鸿杰 (教师)",
        size: "280.0 MB",
        sizeBytes: 293601280,
        changelog: "初始版本上传，包含基础用户特征表与行为明细表。",
      },
    ],
    author: {
      name: "郑鸿杰",
      role: "teacher",
      org: "新大陆时代科技·AI教学研究部",
    },
    createdAt: "2026-03-01",
    updatedAt: "2026-08-15",
    mountCount: 1420,
    downloadCount: 864,
    favoriteCount: 395,
    isFavorite: true,
    isMounted: true,
    mountPath: "/home/jovyan/datasets/ecommerce_user_behavior",
    rowCount: 524800,
    columnCount: 14,
    columns: [
      { name: "user_id", type: "BIGINT", nullCount: 0, nullPercentage: "0%", sampleValues: ["1002341", "1002342", "1002343"] },
      { name: "age_group", type: "VARCHAR", nullCount: 120, nullPercentage: "0.02%", sampleValues: ["18-24", "25-34", "35-49"] },
      { name: "gender", type: "VARCHAR", nullCount: 0, nullPercentage: "0%", sampleValues: ["F", "M", "Unknown"] },
      { name: "browse_duration_sec", type: "FLOAT", nullCount: 0, nullPercentage: "0%", mean: "428.5", min: "5.0", max: "3600.0", sampleValues: ["320.5", "1240.2", "85.0"] },
      { name: "cart_add_count", type: "INT", nullCount: 0, nullPercentage: "0%", mean: "3.4", min: "0", max: "48", sampleValues: ["2", "5", "0"] },
      { name: "category_code", type: "VARCHAR", nullCount: 45, nullPercentage: "0.01%", sampleValues: ["electronics.phone", "apparel.shoes", "beauty.cosmetics"] },
      { name: "coupon_used", type: "INT", nullCount: 0, nullPercentage: "0%", mean: "0.45", min: "0", max: "1", sampleValues: ["1", "0", "1"] },
      { name: "is_repurchased_30d", type: "INT", nullCount: 0, nullPercentage: "0%", mean: "0.28", min: "0", max: "1", sampleValues: ["1", "0", "0"] },
    ],
    previewRows: [
      { user_id: 1002341, age_group: "25-34", gender: "F", browse_duration_sec: 480.2, cart_add_count: 3, category_code: "electronics.phone", coupon_used: 1, is_repurchased_30d: 1 },
      { user_id: 1002342, age_group: "18-24", gender: "M", browse_duration_sec: 120.0, cart_add_count: 0, category_code: "apparel.shoes", coupon_used: 0, is_repurchased_30d: 0 },
      { user_id: 1002343, age_group: "35-49", gender: "F", browse_duration_sec: 890.5, cart_add_count: 6, category_code: "beauty.cosmetics", coupon_used: 1, is_repurchased_30d: 1 },
      { user_id: 1002344, age_group: "25-34", gender: "M", browse_duration_sec: 310.8, cart_add_count: 1, category_code: "electronics.laptop", coupon_used: 0, is_repurchased_30d: 0 },
      { user_id: 1002345, age_group: "50+", gender: "F", browse_duration_sec: 640.4, cart_add_count: 4, category_code: "home.furniture", coupon_used: 1, is_repurchased_30d: 1 },
      { user_id: 1002346, age_group: "18-24", gender: "F", browse_duration_sec: 75.2, cart_add_count: 0, category_code: "apparel.accessories", coupon_used: 0, is_repurchased_30d: 0 },
      { user_id: 1002347, age_group: "25-34", gender: "M", browse_duration_sec: 1420.0, cart_add_count: 8, category_code: "digital.gaming", coupon_used: 1, is_repurchased_30d: 1 },
    ],
    associatedCourses: [
      {
        courseId: "course-ai-01",
        courseName: "人工智能训练师 (高级工)",
        labId: "lab-jupyter-01",
        labName: "人工智能平台-jupyter",
        chapter: "第3章 机器学习实战：客户流失预测与特征工程",
      },
      {
        courseId: "course-ai-02",
        courseName: "AI学件-人工智能训练师（高级工）软件版",
        labId: "lab-jupyter-01",
        labName: "人工智能平台-jupyter",
        chapter: "综合实验二：商业零售推荐系统构建",
      },
    ],
  },
  {
    id: "ds-002",
    title: "胸部X光片肺部疾病识别高分辨率医学影像集",
    description: "经过专业三甲医院影像科脱敏标注的胸部X光片数据集，包含正常肺部、病毒性肺炎、细菌性肺炎及肺结节共4类标注，提供标准YOLO与COCO标注格式文件。",
    techDomain: "图像分类",
    techDomains: ["图像分类", "目标检测"],
    theme: "医疗健康",
    themes: ["医疗健康", "生物医药/分子计算"],
    format: "Images",
    fileSize: "1.42 GB",
    sizeBytes: 1524678656,
    visibility: "public",
    auditStatus: "approved",
    auditTime: "2026-08-14 11:20",
    auditor: "王建国 (管理员)",
    permission: "mount_only", // 仅允许挂载读取（医疗隐私保护与竞赛防泄露）
    version: "V1.2",
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源与背景**：由智慧医疗联合实验室与医工交叉中心联合三甲医院放射影像科共同整理，采集自 2024-2026 年临床胸部后前位 (PA) X 光摄片。
- **核心应用目标**：用于深度学习图像分类与目标检测实训，辅助医师开展肺部疾病智能筛查与计算机辅助诊断 (CAD)。
- **样本规模与标注标准**：共计 5,856 例影像；涵盖正常肺部 (Normal)、细菌性肺炎、病毒性肺炎及肺结节 4 类；经 3 位副主任级别放射科医师采用盲审双审制度校对；所有 DICOM 文件均经 HIPAA 标准去标识化。

---

### 📋 图像规格与结构规范

- **图像格式**：高动态范围 16-bit 灰度转 8-bit PNG / JPEG 无损转换。
- **分辨率分布**：平均分辨率 1024×1024 ~ 2048×2048 像素。
- **目录规范**：按 \`train/\`, \`val/\`, \`test/\` 三级划分，严格杜绝同患者切片跨训练集与测试集泄露。

---

### 🎯 适用模型与基准评测

- **推荐网络**：ResNet-50, DenseNet-121 (CheXNet), EfficientNet-V2, Swin Transformer
- **诊断基准**：DenseNet-121 在多分类肺部疾病诊断中取得 **92.8%** AUC 与 **88.5%** Sensitivity。

---

### 🚀 如何使用数据集

在 JupyterLab 或医学深度学习实训环境中挂载至 \`/home/jovyan/datasets/chest_xray_medical_images\`。

\`\`\`python
import torch
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

# 1. 声明医学影像数据加载管道
DATASET_DIR = "/home/jovyan/datasets/chest_xray_medical_images"

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# 2. 读取图片并构建 DataLoader
dataset = datasets.ImageFolder(root=f"{DATASET_DIR}/train", transform=transform)
loader = DataLoader(dataset, batch_size=32, shuffle=True)
print(f"医学影像训练样本总数: {len(dataset)}, 类别映射: {dataset.class_to_idx}")
\`\`\``,
    versionsList: [
      {
        version: "V1.2",
        updatedAt: "2026-07-20 16:45",
        author: "张晓峰 (教授)",
        size: "1.42 GB",
        sizeBytes: 1524678656,
        changelog: "增加了300例难例样本的对比度增强预处理图像，校正了部分结节坐标偏移。",
      },
      {
        version: "V1.0",
        updatedAt: "2026-04-12 10:00",
        author: "张晓峰 (教授)",
        size: "1.25 GB",
        sizeBytes: 1342177280,
        changelog: "初始医学数据集入库，包含4类共5,856张胸部DICOM转PNG影像。",
      },
    ],
    author: {
      name: "张晓峰",
      role: "teacher",
      org: "智慧医疗联合实验室·医工交叉中心",
    },
    createdAt: "2026-04-12",
    updatedAt: "2026-07-20",
    mountCount: 980,
    downloadCount: 0,
    favoriteCount: 512,
    isFavorite: false,
    isMounted: false,
    mountPath: "/home/jovyan/datasets/chest_xray_medical_images",
    rowCount: 5856,
    columnCount: 6,
    previewImages: [
      { url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&q=80", label: "Normal (健康胸腔)", name: "IM-0001-0001.jpeg" },
      { url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&q=80", label: "Viral Pneumonia (病毒性)", name: "person1_virus_11.jpeg" },
      { url: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&q=80", label: "Bacterial Pneumonia (细菌性)", name: "person2_bacteria_14.jpeg" },
      { url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80", label: "Nodule Positive (肺结节)", name: "nodule_sample_08.jpeg" },
      { url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80", label: "COVID-19 Positive (磨玻璃影)", name: "covid_scan_023.jpeg" },
      { url: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&q=80", label: "Pleural Effusion (胸腔积液)", name: "effusion_case_99.jpeg" },
      { url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80", label: "Normal (健康对照组)", name: "IM-0045-0012.jpeg" },
      { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", label: "Atelectasis (肺不张)", name: "atelectasis_scan_04.jpeg" },
    ],
    fileTree: [
      {
        name: "chest_xray_medical_images",
        type: "folder",
        path: "/",
        childrenCount: 4,
        children: [
          {
            name: "dataset_meta.json",
            type: "file",
            extension: "json",
            size: "3.4 KB",
            path: "/dataset_meta.json",
          },
          {
            name: "README.md",
            type: "file",
            extension: "md",
            size: "6.2 KB",
            path: "/README.md",
          },
          {
            name: "train",
            type: "folder",
            path: "/train",
            childrenCount: 4,
            children: [
              {
                name: "NORMAL",
                type: "folder",
                path: "/train/NORMAL",
                childrenCount: 1341,
                children: [
                  { name: "IM-0001-0001.jpeg", type: "file", extension: "jpeg", size: "245 KB", path: "/train/NORMAL/IM-0001-0001.jpeg" },
                  { name: "IM-0045-0012.jpeg", type: "file", extension: "jpeg", size: "230 KB", path: "/train/NORMAL/IM-0045-0012.jpeg" },
                  { name: "... (共 1,341 张正常胸片)", type: "file", extension: "more", size: "320 MB", path: "/train/NORMAL" },
                ],
              },
              {
                name: "PNEUMONIA_VIRAL",
                type: "folder",
                path: "/train/PNEUMONIA_VIRAL",
                childrenCount: 1345,
                children: [
                  { name: "person1_virus_11.jpeg", type: "file", extension: "jpeg", size: "260 KB", path: "/train/PNEUMONIA_VIRAL/person1_virus_11.jpeg" },
                  { name: "... (共 1,345 张病毒性肺炎切片)", type: "file", extension: "more", size: "340 MB", path: "/train/PNEUMONIA_VIRAL" },
                ],
              },
              {
                name: "PNEUMONIA_BACTERIAL",
                type: "folder",
                path: "/train/PNEUMONIA_BACTERIAL",
                childrenCount: 2530,
                children: [
                  { name: "person2_bacteria_14.jpeg", type: "file", extension: "jpeg", size: "252 KB", path: "/train/PNEUMONIA_BACTERIAL/person2_bacteria_14.jpeg" },
                  { name: "... (共 2,530 张细菌性肺炎切片)", type: "file", extension: "more", size: "620 MB", path: "/train/PNEUMONIA_BACTERIAL" },
                ],
              },
              {
                name: "NODULE_POSITIVE",
                type: "folder",
                path: "/train/NODULE_POSITIVE",
                childrenCount: 640,
                children: [
                  { name: "nodule_sample_08.jpeg", type: "file", extension: "jpeg", size: "275 KB", path: "/train/NODULE_POSITIVE/nodule_sample_08.jpeg" },
                  { name: "... (共 640 张结节样本)", type: "file", extension: "more", size: "160 MB", path: "/train/NODULE_POSITIVE" },
                ],
              },
            ],
          },
          {
            name: "test",
            type: "folder",
            path: "/test",
            childrenCount: 624,
            children: [
              { name: "test_case_001.jpeg", type: "file", extension: "jpeg", size: "240 KB", path: "/test/test_case_001.jpeg" },
              { name: "... (共 624 张测试集盲审切片)", type: "file", extension: "more", size: "155 MB", path: "/test" },
            ],
          },
        ],
      },
    ],
    associatedCourses: [
      {
        courseId: "course-ai-03",
        courseName: "深度学习技术应用",
        labId: "lab-jupyter-01",
        labName: "人工智能平台-jupyter",
        chapter: "第5章 卷积神经网络CNN进阶：医学影像辅助诊断",
      },
    ],
  },
  {
    id: "ds-003",
    title: "智能客服多轮对话意图识别与情感倾向标注语料",
    description: "精心构建的10万条金融与政务场景人机交互语料库，深度覆盖银行信用卡、理财咨询、个税申报、公积金贷款及便民热线等48类业务意图，包含精准语义槽位提取与四维情绪（积极/中立/焦虑/愤怒）倾向标签，全面适配BERT/RoBERTa判别模型与大语言模型指令微调(SFT)。",
    techDomain: "文本分类",
    techDomains: ["文本分类", "情感分析", "大模型指令微调 (SFT)"],
    theme: "科技互联网",
    themes: ["科技互联网", "经济金融", "政务民生/数字治理"],
    format: "JSON",
    fileSize: "84.2 MB",
    sizeBytes: 88289280,
    visibility: "school",
    auditStatus: "approved",
    auditTime: "2026-08-10 16:30",
    auditor: "王建国 (管理员)",
    permission: "download_and_mount",
    version: "V3.0",
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源渠道**：采集自真实金融银行客户服务热线、信用卡在线问答中心以及政务服务便民热线（12345）脱敏对话日志。
- **核心应用目标**：用于 NLP 意图识别 (Intent Classification)、多分类情感分析 (Sentiment Analysis)、槽位提取与大语言模型指令微调 (SFT)。
- **样本规模与脱敏质检**：包含 100,000 条标准 JSON Lines 语料，覆盖 48 种高频核心意图；个人身份证、手机号、卡号均严格脱敏；经 6 名高级标注专家三轮交叉标注，一致性 Kappa 系数达 **0.892**。

---

### 📋 字段说明与数据字典 (Data Dictionary)

语料库采用标准 JSON Lines 结构，单行记录包含以下核心字段：

| 字段名称 | 数据类型 | 允许空值 | 字段含义说明 | 典型取值示例 |
| :--- | :--- | :--- | :--- | :--- |
| \`dialogue_id\` | String | 否 | 会话或问句全局唯一追踪编号 | \`D1001\`, \`D1002\` |
| \`utterance\` | String | 否 | 客户原始输入问句文本（已规范化） | \`我想查一下我上个月的信用卡账单为什么多了200块年费？\` |
| \`intent\` | String | 否 | 意图分类标签，共涵盖 48 种高频核心意图 | \`query_bill_detail\` (账单明细查询), \`gov_housing_fund_query\` (公积金咨询) |
| \`sentiment\` | String | 否 | 客户细粒度情感倾向分类 | \`positive\` (积极), \`neutral\` (中立), \`negative_anxious\` (焦虑), \`negative_angry\` (愤怒) |
| \`slots\` | Object | 是 | 槽位与命名实体提取键值对 | \`{"fee_type": "年费", "time_range": "上个月", "amount": "200元"}\` |

---

### 🎯 适用算法与推荐基准 (Benchmark)

- **适用任务**：意图识别分类、多分类情感分析、命名实体识别与语义槽位填充、大模型指令微调 (SFT)。
- **推荐模型架构**：
  - 中小模型基准：BERT-Base-Chinese、RoBERTa-wwm-ext、MacBERT-large
  - 大语言模型微调：ChatGLM3-6B、Qwen2.5-7B、Baichuan2-7B (支持 LoRA / QLoRA 指令微调)
- **基准测试参考**：
  - 意图识别准确率 (Accuracy): **94.6%**
  - 情感分类 Macro-F1: **89.4%**
  - 槽位提取 F1-Score: **86.8%**

---

### 🚀 如何使用数据集

数据集已预置在平台文件系统中，支持在 JupyterLab 中一键挂载至 \`/home/jovyan/datasets/nlp_intent_sentiment_corpus\`。挂载后可通过标准 Python / JSON / Pandas 极速加载读取。

\`\`\`python
import json
import pandas as pd

# 1. 读取已挂载的 JSON 语料文件 (支持按行读取与全局解析)
DATASET_PATH = "/home/jovyan/datasets/nlp_intent_sentiment_corpus/train.json"

with open(DATASET_PATH, 'r', encoding='utf-8') as f:
    corpus_list = [json.loads(line) for line in f]

# 2. 转换为 DataFrame 进行特征探索与统计分析
df = pd.DataFrame(corpus_list)
print(f"语料样本总量: {len(df):,} 条")
print(f"意图种类总数: {df['intent'].nunique()} 种")
print(f"情感倾向分布统计:\n{df['sentiment'].value_counts()}")
\`\`\`

---

### 📝 引用格式 (Citation / BibTeX)

\`\`\`bibtex
@dataset{nlp_customer_service_intent_2026,
  title={智能客服多轮对话意图识别与情感倾向标注语料 (NLP Intent & Sentiment Corpus)},
  author={郑鸿杰 and 新大陆时代科技 AI 教学研究部},
  year={2026},
  publisher={UUSIMA Data Center},
  url={https://uusima.ai/datasets/nlp_intent_sentiment_corpus}
}
\`\`\``,
    versionsList: [
      {
        version: "V3.0",
        updatedAt: "2026-08-01 10:15",
        author: "郑鸿杰 (教师)",
        size: "84.2 MB",
        sizeBytes: 88289280,
        changelog: "新增大模型微调指令问答对格式（Instruction-Input-Output）导出支持。",
      },
    ],
    author: {
      name: "郑鸿杰",
      role: "teacher",
      org: "新大陆时代科技·AI教学研究部",
    },
    createdAt: "2026-02-15",
    updatedAt: "2026-08-01",
    mountCount: 1680,
    downloadCount: 1120,
    favoriteCount: 688,
    isFavorite: true,
    isMounted: true,
    mountPath: "/home/jovyan/datasets/nlp_intent_sentiment_corpus",
    rowCount: 100000,
    columnCount: 5,
    previewRows: [
      {
        dialogue_id: "D1001",
        utterance: "我想查一下我上个月的信用卡账单为什么多了200块年费？",
        intent: "query_bill_detail",
        sentiment: "negative_anxious",
        slots: { fee_type: "年费", time_range: "上个月", amount: "200元" },
      },
      {
        dialogue_id: "D1002",
        utterance: "非常感谢，扣款问题已经解决了，客服服务很迅速！",
        intent: "customer_praise",
        sentiment: "positive",
        slots: {},
      },
      {
        dialogue_id: "D1003",
        utterance: "请问公积金贷款额度上限是多少？需要准备什么材料？",
        intent: "gov_housing_fund_query",
        sentiment: "neutral",
        slots: { service: "公积金贷款" },
      },
      {
        dialogue_id: "D1004",
        utterance: "我手机营业厅绑定的银行卡怎么换绑？一直提示系统异常。",
        intent: "account_bind_card",
        sentiment: "negative_anxious",
        slots: { error_type: "系统异常", operation: "换绑银行卡" },
      },
      {
        dialogue_id: "D1005",
        utterance: "帮我查询一下本月的套餐剩余通用流量和通话分钟数。",
        intent: "query_package_balance",
        sentiment: "neutral",
        slots: { query_target: ["通用流量", "通话分钟数"] },
      },
      {
        dialogue_id: "D1006",
        utterance: "你们这个理财产品的预期年化收益率是多少？有保本条款吗？",
        intent: "wealth_product_inquiry",
        sentiment: "neutral",
        slots: { product_type: "理财产品", key_terms: ["年化收益率", "保本"] },
      },
    ],
    associatedCourses: [
      {
        courseId: "course-ai-01",
        courseName: "人工智能训练师 (高级工)",
        labId: "lab-jupyter-01",
        labName: "人工智能平台-jupyter",
        chapter: "第4章 自然语言处理实战：智能客服意图分类",
      },
    ],
  },
  {
    id: "ds-004",
    title: "全球主要股票高频tick级行情与多因子量化特征集",
    description: "涵盖A股与美股主要指数标的5分钟级K线与量价因子指标，包含流动性因子、动量因子、波动率因子及情绪衍生指标，适用于时间序列预测与策略回测。",
    techDomain: "时间序列预测",
    techDomains: ["时间序列预测", "表格数据", "强化学习"],
    theme: "经济金融",
    themes: ["经济金融", "量化投资"],
    format: "Parquet",
    fileSize: "620.5 MB",
    sizeBytes: 650637312,
    visibility: "public",
    auditStatus: "approved",
    auditTime: "2026-08-12 09:15",
    auditor: "王建国 (管理员)",
    permission: "download_and_mount",
    version: "V1.0",
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源与背景**：涵盖 A 股与美股主要指数标的 2024-2026 年连续高频交易 5 分钟级 K 线及 Alpha101 量化因子集。
- **核心应用目标**：用于金融工程、量化投资策略回测、时间序列预测及强化学习交易智能体构建。
- **样本规模与结构**：包含 1,850,000 条高频时间序列记录，涵盖 22 个衍生量价因子维度。

---

### 📋 字段说明与数据字典

| 字段名称 | 数据类型 | 含义解释 | 示例值 |
| :--- | :--- | :--- | :--- |
| \`timestamp\` | TIMESTAMP | 交易切片时间戳 | 2026-05-18 09:35:00 |
| \`symbol\` | VARCHAR | 证券标的代码 | 600519.SH / AAPL |
| \`close_price\` | FLOAT | 收盘成交价格 | 1680.50 |
| \`volume\` | BIGINT | 成交股数 | 150200 |
| \`alpha_momentum_5m\` | FLOAT | 5分钟动量衍生因子 | 0.042 |

---

### 🎯 适用模型与基准评测

- **推荐算法**：LSTM, Informer, PatchTST, LightGBM, DRL (PPO/DQN)
- **基准效果**：PatchTST 在次日收益率方向预测上达到 **61.4%** 胜率，夏普比率 (Sharpe Ratio) 达 **2.18**。

---

### 🚀 如何使用数据集

\`\`\`python
import pandas as pd
# 快速加载 Parquet 高频因子数据
df = pd.read_parquet('/home/jovyan/datasets/fin_stock_timeseries/data.parquet')
print(f"数据总条目: {len(df):,}")
\`\`\``,
    versionsList: [
      {
        version: "V1.0",
        updatedAt: "2026-05-18 09:30",
        author: "陈金融 (研究员)",
        size: "620.5 MB",
        sizeBytes: 650637312,
        changelog: "初版发布，包含2024-2026年连续高频交易数据与Alpha101量化因子集。",
      },
    ],
    author: {
      name: "陈金融",
      role: "teacher",
      org: "量化投资创新实验中心",
    },
    createdAt: "2026-05-18",
    updatedAt: "2026-05-18",
    mountCount: 750,
    downloadCount: 420,
    favoriteCount: 230,
    isFavorite: false,
    isMounted: false,
    mountPath: "/home/jovyan/datasets/fin_stock_timeseries",
    rowCount: 1850000,
    columnCount: 22,
    associatedCourses: [],
  },
  {
    id: "ds-005",
    title: "自动驾驶复杂街景多目标检测高精标注数据集 (YOLO/ZIP)",
    description: "涵盖城市道路、高速公路、雨雾天气及夜间低照度场景的车辆、行人、骑行者、交通标志精准边界框标注，采用标准YOLOv8目录规范（images/labels/data.yaml），包内包含24,000个图片与标注文件。",
    techDomain: "目标检测",
    techDomains: ["目标检测", "图像分割", "视频动作识别"],
    theme: "自动驾驶",
    themes: ["自动驾驶", "智慧交通/车联网"],
    format: "ZIP",
    fileSize: "2.18 GB",
    sizeBytes: 2340847616,
    visibility: "public",
    auditStatus: "pending",
    submitTime: "2026-08-27 10:20",
    permission: "mount_only",
    version: "V2.0",
    isComplexArchive: true,
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源与背景**：由车路协同智驾中心与交通工程技术研究院历时两年联合实车采集。采用 800 万像素车载前视双目相机 + 128 线激光雷达联合标定，覆盖早晚高峰拥堵、夜间微光逆光、暴雨积水反射等 18 种极端场景。
- **核心应用目标**：用于构建高可靠自动驾驶多目标实时检测与感知算法实训。
- **样本规模与标注规范**：涵盖 24,000 张高动态分辨率图像帧及 9 大目标类别（行人、小汽车、自行车、大巴、重卡、红绿灯、路标等），每个边界框均经人工精修。

---

### 📋 目录架构与数据划分

- 训练集 (\`train\`): 16,000 张高动态分辨率图像 + YOLO 格式归一化坐标标注
- 验证集 (\`val\`): 4,000 张真实道路实测帧
- 测试集 (\`test\`): 4,000 张包含极端复杂天气的盲测评估帧

---

### 🎯 适用模型与基准评测

- **推荐算法**：YOLOv8/v9/v10, RT-DETR, Faster R-CNN, Deformable DETR
- **基线表现**：YOLOv8m 在 640×640 分辨率下 mAP@0.5 达到 **78.4%**，mAP@0.5:0.95 达到 **54.2%**。

---

### 🚀 如何使用数据集

数据集采用标准 YOLOv8 目录规范（\`images/\`, \`labels/\`, \`data.yaml\`）。在 Jupyter 实训环境中挂载后，可直接传入 Ultralytics YOLO 训练管道。

\`\`\`python
from ultralytics import YOLO

# 1. 加载预训练 YOLOv8 模型
model = YOLO('yolov8n.pt')

# 2. 指定已挂载的数据集配置文件启动微调
DATA_YAML = '/home/jovyan/datasets/autonomous_driving_detection/data.yaml'

results = model.train(
    data=DATA_YAML,
    epochs=50,
    imgsz=640,
    batch=16,
    device=0,
    name='autonomous_yolov8_exp'
)
\`\`\``,
    yamlConfig: `# YOLOv8 Multi-Class Street Vision Dataset Configuration
path: /home/jovyan/datasets/autonomous_driving_detection
train: images/train  # 16,000 images
val: images/val      # 4,000 images
test: images/test    # 4,000 images

# Classes
names:
  0: pedestrian
  1: bicycle
  2: car
  3: motorcycle
  4: bus
  5: truck
  6: traffic_light
  7: traffic_sign
  8: rider`,
    fileTree: [
      {
        name: "autonomous_driving_detection.zip",
        type: "folder",
        path: "/",
        childrenCount: 5,
        children: [
          {
            name: "data.yaml",
            type: "file",
            extension: "yaml",
            size: "1.2 KB",
            path: "/data.yaml",
          },
          {
            name: "README.md",
            type: "file",
            extension: "md",
            size: "8.6 KB",
            path: "/README.md",
          },
          {
            name: "images",
            type: "folder",
            path: "/images",
            childrenCount: 3,
            children: [
              {
                name: "train",
                type: "folder",
                path: "/images/train",
                childrenCount: 16000,
                children: [
                  { name: "frame_00001.jpg", type: "file", extension: "jpg", size: "184 KB", path: "/images/train/frame_00001.jpg" },
                  { name: "frame_00002.jpg", type: "file", extension: "jpg", size: "192 KB", path: "/images/train/frame_00002.jpg" },
                  { name: "frame_00003.jpg", type: "file", extension: "jpg", size: "210 KB", path: "/images/train/frame_00003.jpg" },
                  { name: "... (共 16,000 张高分辨率训练帧)", type: "file", extension: "more", size: "1.42 GB", path: "/images/train" },
                ],
              },
              {
                name: "val",
                type: "folder",
                path: "/images/val",
                childrenCount: 4000,
                children: [
                  { name: "val_00001.jpg", type: "file", extension: "jpg", size: "176 KB", path: "/images/val/val_00001.jpg" },
                  { name: "... (共 4,000 张验证帧)", type: "file", extension: "more", size: "380 MB", path: "/images/val" },
                ],
              },
              {
                name: "test",
                type: "folder",
                path: "/images/test",
                childrenCount: 4000,
                children: [
                  { name: "test_00001.jpg", type: "file", extension: "jpg", size: "180 KB", path: "/images/test/test_00001.jpg" },
                  { name: "... (共 4,000 张测试帧)", type: "file", extension: "more", size: "375 MB", path: "/images/test" },
                ],
              },
            ],
          },
          {
            name: "labels",
            type: "folder",
            path: "/labels",
            childrenCount: 3,
            children: [
              {
                name: "train",
                type: "folder",
                path: "/labels/train",
                childrenCount: 16000,
                children: [
                  { name: "frame_00001.txt", type: "file", extension: "txt", size: "420 B", path: "/labels/train/frame_00001.txt" },
                  { name: "frame_00002.txt", type: "file", extension: "txt", size: "612 B", path: "/labels/train/frame_00002.txt" },
                  { name: "... (共 16,000 个 YOLO txt 标注文件)", type: "file", extension: "more", size: "8.4 MB", path: "/labels/train" },
                ],
              },
              {
                name: "val",
                type: "folder",
                path: "/labels/val",
                childrenCount: 4000,
                children: [
                  { name: "val_00001.txt", type: "file", extension: "txt", size: "380 B", path: "/labels/val/val_00001.txt" },
                  { name: "... (共 4,000 个标注文件)", type: "file", extension: "more", size: "2.1 MB", path: "/labels/val" },
                ],
              },
              {
                name: "test",
                type: "folder",
                path: "/labels/test",
                childrenCount: 4000,
                children: [
                  { name: "... (未公开标签，用于盲测评估)", type: "file", extension: "more", size: "0 B", path: "/labels/test" },
                ],
              },
            ],
          },
          {
            name: "classes.txt",
            type: "file",
            extension: "txt",
            size: "148 B",
            path: "/classes.txt",
          },
        ],
      },
    ],
    versionsList: [
      {
        version: "V2.0",
        updatedAt: "2026-08-10 18:00",
        author: "自动驾驶联合实验室",
        size: "2.18 GB",
        sizeBytes: 2340847616,
        changelog: "补齐了夜间高反光与雨水遮挡工况下的4,000帧激光雷达融合标注。",
      },
    ],
    author: {
      name: "车路协同智驾中心",
      role: "teacher",
      org: "智能交通工程技术研究院",
    },
    createdAt: "2026-01-10",
    updatedAt: "2026-08-10",
    mountCount: 1350,
    downloadCount: 0,
    favoriteCount: 490,
    isFavorite: true,
    isMounted: false,
    mountPath: "/home/jovyan/datasets/autonomous_driving_detection",
    rowCount: 24000,
    columnCount: 8,
    previewImages: [
      { url: "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&q=80", label: "Night Urban Traffic (夜间拥堵)", name: "frame_00001.jpg" },
      { url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80", label: "Highway Fast Lane (高速干道)", name: "frame_00002.jpg" },
      { url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80", label: "Rainy Reflection (雨天积水反光)", name: "frame_00003.jpg" },
      { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80", label: "Pedestrian Crosswalk (斑马线行人)", name: "frame_00004.jpg" },
      { url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80", label: "Intersection Mixed Traffic (混合路口)", name: "val_00001.jpg" },
      { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80", label: "Tunnel Low-Light (隧道微光)", name: "test_00001.jpg" },
    ],
    previewRows: [
      { frame_id: "frame_00001", class_name: "car", bbox_x: 0.452, bbox_y: 0.621, bbox_w: 0.125, bbox_h: 0.089, confidence: 0.94, weather: "night_clear" },
      { frame_id: "frame_00001", class_name: "pedestrian", bbox_x: 0.128, bbox_y: 0.584, bbox_w: 0.032, bbox_h: 0.095, confidence: 0.88, weather: "night_clear" },
      { frame_id: "frame_00002", class_name: "truck", bbox_x: 0.680, bbox_y: 0.450, bbox_w: 0.220, bbox_h: 0.280, confidence: 0.96, weather: "daylight_sunny" },
      { frame_id: "frame_00003", class_name: "traffic_light", bbox_x: 0.510, bbox_y: 0.210, bbox_w: 0.024, bbox_h: 0.055, confidence: 0.92, weather: "rainy" },
      { frame_id: "frame_00004", class_name: "bicycle", bbox_x: 0.320, bbox_y: 0.640, bbox_w: 0.045, bbox_h: 0.080, confidence: 0.85, weather: "dusk" },
    ],
    columns: [
      { name: "frame_id", type: "STRING", nullCount: 0, nullPercentage: "0%", sampleValues: ["frame_00001", "frame_00002", "frame_00003"] },
      { name: "class_name", type: "CATEGORICAL", nullCount: 0, nullPercentage: "0%", uniqueCount: 9, sampleValues: ["car", "pedestrian", "truck", "bicycle", "traffic_light"] },
      { name: "bbox_x", type: "FLOAT", nullCount: 0, nullPercentage: "0%", mean: "0.485", sampleValues: ["0.452", "0.128", "0.680"] },
      { name: "bbox_y", type: "FLOAT", nullCount: 0, nullPercentage: "0%", mean: "0.521", sampleValues: ["0.621", "0.584", "0.450"] },
      { name: "bbox_w", type: "FLOAT", nullCount: 0, nullPercentage: "0%", mean: "0.095", sampleValues: ["0.125", "0.032", "0.220"] },
      { name: "bbox_h", type: "FLOAT", nullCount: 0, nullPercentage: "0%", mean: "0.112", sampleValues: ["0.089", "0.095", "0.280"] },
      { name: "confidence", type: "FLOAT", nullCount: 0, nullPercentage: "0%", mean: "0.915", sampleValues: ["0.94", "0.88", "0.96"] },
      { name: "weather", type: "STRING", nullCount: 0, nullPercentage: "0%", sampleValues: ["night_clear", "daylight_sunny", "rainy", "dusk"] },
    ],
    associatedCourses: [
      {
        courseId: "course-ai-03",
        courseName: "深度学习技术应用",
        labId: "lab-jupyter-01",
        labName: "人工智能平台-jupyter",
        chapter: "第6章 目标检测YOLOv8工程实操与模型评估",
      },
    ],
  },
  {
    id: "ds-006",
    title: "工业重型旋转机械轴承振动传感器故障诊断数据",
    description: "采集自工业级测试台架的加速度计高频振动信号，包含正常运转、内圈磨损、外圈开裂及滚珠点蚀4种典型工况，支持故障预测与健康管理(PHM)。",
    techDomain: "异常检测/风控",
    techDomains: ["异常检测/风控", "表格数据", "时间序列预测"],
    theme: "工业制造/质检",
    themes: ["工业制造/质检", "能源电力/智能电网"],
    format: "CSV",
    fileSize: "185.0 MB",
    sizeBytes: 193986560,
    version: "v1.0",
    visibility: "school",
    auditStatus: "pending",
    submitTime: "2026-08-27 14:15",
    permission: "download_and_mount",
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源与背景**：采集自重型旋转机械与传动轴承工业级测试台架，涵盖连续 500 小时加速寿命疲劳试验数据。
- **核心应用目标**：用于构建工业预测性维护 (PHM)、时频域特征提取、故障分类诊断与剩余使用寿命 (RUL) 预测模型。
- **样本规模与工况划分**：包含 320,000 条高频振动采样点，覆盖正常运转、轴承内圈磨损、外圈局部开裂及滚动体点蚀 4 种典型缺陷工况。

---

### 📋 字段说明与数据字典

| 字段名称 | 数据类型 | 含义解释 | 示例值 |
| :--- | :--- | :--- | :--- |
| \`timestamp\` | FLOAT | 采样相对时间戳 (秒) | 12.045 |
| \`vibration_x\` | FLOAT | X轴径向加速度 (g) | 0.842 |
| \`vibration_y\` | FLOAT | Y轴径向加速度 (g) | -0.315 |
| \`rotation_rpm\` | INT | 主轴转速 (RPM) | 1800 |
| \`fault_class\` | VARCHAR | 故障类别标签 | normal / inner_ring / outer_ring / ball |

---

### 🎯 适用模型与基准评测

- **推荐算法**：1D-CNN, ResNet-1D, LSTM, XGBoost (结合小波包分解特征)
- **基准表现**：1D-CNN 故障模式四分类准确率达 **97.8%**。

---

### 🚀 如何使用数据集

\`\`\`python
import pandas as pd
df = pd.read_csv('/home/jovyan/datasets/industrial_bearing_vibration/train.csv')
print(f"振动采样点总量: {len(df):,}")
\`\`\``,
    versionsList: [
      {
        version: "V1.1",
        updatedAt: "2026-06-30 15:20",
        author: "李工 (高级工程师)",
        size: "185.0 MB",
        sizeBytes: 193986560,
        changelog: "补充傅里叶变换与小波包分解后的时频域提取特征衍生列。",
      },
    ],
    author: {
      name: "李工",
      role: "teacher",
      org: "智能制造产教融合创新基地",
    },
    createdAt: "2026-06-15",
    updatedAt: "2026-06-30",
    mountCount: 620,
    downloadCount: 380,
    favoriteCount: 175,
    isFavorite: false,
    isMounted: false,
    mountPath: "/home/jovyan/datasets/industrial_bearing_vibration",
    rowCount: 320000,
    columnCount: 18,
    associatedCourses: [],
  },
  {
    id: "ds-007",
    title: "智慧温室多传感器气象监测与农作物长势估产数据集",
    description: "涵盖连续两季番茄温室的温湿度、光照强度、CO2浓度、土壤墒情及阶段采摘产量实测数据，适合构建智能水肥决策与物候期模型。",
    techDomain: "表格数据",
    techDomains: ["表格数据", "时间序列预测"],
    theme: "农业环保/精准农业",
    themes: ["农业环保/精准农业", "气象水文/地质监测"],
    format: "XLSX",
    fileSize: "45.2 MB",
    sizeBytes: 47395840,
    visibility: "public",
    auditStatus: "approved",
    auditTime: "2026-08-20 11:30",
    auditor: "王建国 (管理员)",
    permission: "download_and_mount",
    version: "V1.0",
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源与背景**：采集自国家级现代农业示范园智能玻璃温室物联网监测节点，涵盖连续两季番茄全生育期。
- **核心应用目标**：用于构建温室小气候精准预测、农作物物候期动态识别以及采收产量回归估算。
- **样本规模与结构**：包含 125,000 条逐分钟级传感器监测记录与每周人工长势标定数据。

---

### 📋 字段说明与数据字典

| 字段名称 | 数据类型 | 含义解释 | 示例值 |
| :--- | :--- | :--- | :--- |
| \`recorded_at\` | DATETIME | 传感器采集时间 | 2026-07-05 10:00:00 |
| \`air_temperature\` | FLOAT | 空气温度 (℃) | 26.4 |
| \`air_humidity\` | FLOAT | 相对空气湿度 (%) | 68.2 |
| \`co2_ppm\` | INT | 二氧化碳浓度 (PPM) | 850 |
| \`soil_moisture\` | FLOAT | 土壤容积含水率 (%) | 32.5 |
| \`yield_kg_per_m2\` | FLOAT | 当批次实测采摘产量 | 4.8 |

---

### 🎯 适用模型与基准评测

- **推荐算法**：LightGBM, Random Forest, GRU, Temporal Fusion Transformer
- **基准表现**：产量预测 $R^2$ 达 **0.876**，均方根误差 (RMSE) 小于 0.32 kg/m²。

---

### 🚀 如何使用数据集

\`\`\`python
import pandas as pd
df = pd.read_excel('/home/jovyan/datasets/greenhouse_agri_climate/data.xlsx')
print(df.describe())
\`\`\``,
    versionsList: [
      {
        version: "V1.0",
        updatedAt: "2026-07-05 11:00",
        author: "农业物联网教研组",
        size: "45.2 MB",
        sizeBytes: 47395840,
        changelog: "初版发布，提供分钟级环境传感器与周度长势测量表。",
      },
    ],
    author: {
      name: "农林科技研究所",
      role: "teacher",
      org: "现代农业数字技术重点实验室",
    },
    createdAt: "2026-07-05",
    updatedAt: "2026-07-05",
    mountCount: 410,
    downloadCount: 290,
    favoriteCount: 120,
    isFavorite: false,
    isMounted: false,
    mountPath: "/home/jovyan/datasets/greenhouse_agri_climate",
    rowCount: 125000,
    columnCount: 12,
    associatedCourses: [],
  },
  {
    id: "ds-008",
    title: "城市商品住宅房价多维度时空特征与租售比分析数据",
    description: "涵盖全国20个重点城市住宅小区的建筑年份、周边配套、轨道交通距离、挂牌均价、成交周期与物业费标准，适用于空间回归分析与特征工程教学。",
    techDomain: "表格数据",
    techDomains: ["表格数据", "推荐系统"],
    theme: "房地产",
    themes: ["房地产", "商业零售"],
    format: "CSV",
    fileSize: "72.4 MB",
    sizeBytes: 75916800,
    visibility: "public",
    auditStatus: "rejected",
    submitTime: "2026-08-25 09:30",
    auditTime: "2026-08-25 15:40",
    auditor: "王建国 (管理员)",
    auditReason: "该数据集样本缺失率过高（超出35%警戒线），且未附带字段说明字典与合规授权说明，请补全后重新提交。",
    permission: "download_and_mount",
    version: "V1.0",
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源与背景**：融合地图开放平台 POI 空间地理距离与房地产公开成交脱敏数据，覆盖全国 20 个一二线核心城市。
- **核心应用目标**：用于空间计量经济学研究、多元特征回归房价估值与特征工程实训。
- **样本规模与分布**：包含 85,000 个小区维度的综合时空特征截面数据。

---

### 📋 字段说明与数据字典

| 字段名称 | 数据类型 | 含义解释 | 示例值 |
| :--- | :--- | :--- | :--- |
| \`city\` | VARCHAR | 所在城市名称 | 上海 / 深圳 / 成都 |
| \`community_name\` | VARCHAR | 住宅小区名称 | 阳光水岸花园 |
| \`distance_subway_m\` | FLOAT | 距离最近地铁站距离 (米) | 350.0 |
| \`avg_price_sqm\` | FLOAT | 二手房挂牌均价 (元/㎡) | 58400.0 |
| \`rent_sale_ratio\` | FLOAT | 估算租售比 | 0.018 |

---

### 🎯 适用模型与基准评测

- **推荐算法**：XGBoost, CatBoost, Spatial Lag Model (SLM), GBDT
- **基准表现**：CatBoost 模型均方对数误差 (RMSLE) 达到 **0.082**。

---

### 🚀 如何使用数据集

\`\`\`python
import pandas as pd
df = pd.read_csv('/home/jovyan/datasets/housing_price_geo_features/communities.csv')
print(f"住宅小区总数: {len(df):,}")
\`\`\``,
    versionsList: [
      {
        version: "V1.0",
        updatedAt: "2026-04-20 14:10",
        author: "大数据与经济学院",
        size: "72.4 MB",
        sizeBytes: 75916800,
        changelog: "初版上线，融合百度地图POI距离与链家历史成交均价。",
      },
    ],
    author: {
      name: "空间经济学研讨组",
      role: "teacher",
      org: "应用经济与公共政策研究所",
    },
    createdAt: "2026-04-20",
    updatedAt: "2026-04-20",
    mountCount: 890,
    downloadCount: 650,
    favoriteCount: 310,
    isFavorite: false,
    isMounted: false,
    mountPath: "/home/jovyan/datasets/housing_price_geo_features",
    rowCount: 85000,
    columnCount: 16,
    associatedCourses: [],
  },
  {
    id: "ds-009",
    title: "通用多模态图文对与中文大模型指令微调高质量数据集",
    description: "精心清洗构建的8万条中文高质量多模态对话与视觉问答(VQA)对，覆盖日常生活、图表解析、学术问答与代码理解，支持LLaVA与Qwen-VL系列微调训练。",
    techDomain: "大模型指令微调 (SFT)",
    techDomains: ["大模型指令微调 (SFT)", "问答系统 (QA)", "文本生成"],
    theme: "科技互联网",
    themes: ["科技互联网", "教育培训"],
    format: "JSON",
    fileSize: "512.0 MB",
    sizeBytes: 536870912,
    visibility: "public",
    auditStatus: "approved",
    auditTime: "2026-08-21 16:00",
    auditor: "王建国 (管理员)",
    permission: "download_and_mount",
    version: "V1.0",
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源与背景**：由通用人工智能开源社区协同整理，经过三轮严格的人工语法修正、毒性检测与语义对齐过滤。
- **核心应用目标**：用于视觉语言多模态大模型 (VLM) 的指令微调 (Instruction Tuning) 与视觉问答能力评测。
- **样本规模与任务覆盖**：共计 80,000 条高质量多轮对话与问答对，涵盖日常生活常识、图表统计解析、学术文献问答及代码理解。

---

### 📋 字段说明与数据字典

| 字段名称 | 数据类型 | 含义解释 | 示例值 |
| :--- | :--- | :--- | :--- |
| \`id\` | VARCHAR | 指令对话唯一标识 | vqa_00892 |
| \`image_path\` | VARCHAR | 对应图像相对引用路径 | images/chart_012.png |
| \`conversations\` | Array | 多轮对话消息结构体 | \`[{"from": "human", "value": "..."}, {"from": "gpt", "value": "..."}]\` |

---

### 🎯 适用模型与基准评测

- **推荐模型**：Qwen2-VL, LLaVA-1.6, InternVL2, MiniCPM-V
- **微调基线**：在 MME Benchmark 和 HallusionBench 评测中准确率分别提升 **8.4%** 与 **11.2%**。

---

### 🚀 如何使用数据集

\`\`\`python
import json
with open('/home/jovyan/datasets/multimodal_instruct_tuning/sft_data.json', 'r') as f:
    data = json.load(f)
print(f"微调对话样本总量: {len(data):,} 条")
\`\`\``,
    versionsList: [
      {
        version: "V1.0",
        updatedAt: "2026-08-18 10:00",
        author: "智源开源社区协作组",
        size: "512.0 MB",
        sizeBytes: 536870912,
        changelog: "开源首发发布，过滤低质重复指令并补全中文语义对齐。",
      },
    ],
    author: {
      name: "智源开源社区",
      role: "teacher",
      org: "通用人工智能开源联盟",
    },
    createdAt: "2026-08-18",
    updatedAt: "2026-08-18",
    mountCount: 2150,
    downloadCount: 1540,
    favoriteCount: 920,
    isFavorite: true,
    isMounted: false,
    mountPath: "/home/jovyan/datasets/multimodal_instruct_tuning",
    rowCount: 80000,
    columnCount: 6,
    associatedCourses: [
      {
        courseId: "course-ai-01",
        courseName: "人工智能训练师 (高级工)",
        labId: "lab-jupyter-01",
        labName: "人工智能平台-jupyter",
        chapter: "第7章 大语言模型与多模态微调实战",
      },
    ],
  },
  {
    id: "ds-010",
    title: "新能源风光储微电网负荷调度与出力时序预测数据",
    description: "涵盖某区域级光伏电站与风电场连续3年15分钟级气象辐射、风速风向、机组发电量及储能充放电状态，支持多步长时序神经网络建模。",
    techDomain: "时间序列预测",
    techDomains: ["时间序列预测", "强化学习"],
    theme: "能源电力/智能电网",
    themes: ["能源电力/智能电网", "农业环保/精准农业"],
    format: "CSV",
    fileSize: "96.8 MB",
    sizeBytes: 101502976,
    visibility: "school",
    auditStatus: "pending",
    submitTime: "2026-08-27 16:30",
    permission: "download_and_mount",
    version: "V1.0",
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源与背景**：由清洁能源数字化联合实验室采集自某区域级风光储互补示范微电网 SCADA 系统。
- **核心应用目标**：用于新能源发电超短期/日前功率预测、储能荷电状态 (SOC) 协同优化调度。
- **样本规模与结构**：包含 105,120 条 15 分钟级连续时序采样数据，覆盖 3 个完整运行年度。

---

### 📋 字段说明与数据字典

| 字段名称 | 数据类型 | 含义解释 | 示例值 |
| :--- | :--- | :--- | :--- |
| \`datetime\` | TIMESTAMP | 采样时间点 | 2026-07-28 12:15:00 |
| \`solar_irradiance\` | FLOAT | 地表总辐射强度 (W/m²) | 785.4 |
| \`wind_speed\` | FLOAT | 10米高平均风速 (m/s) | 6.8 |
| \`solar_power_mw\` | FLOAT | 光伏实时发电功率 (MW) | 18.2 |
| \`wind_power_mw\` | FLOAT | 风电机组实时功率 (MW) | 24.5 |
| \`battery_soc\` | FLOAT | 储能电池荷电状态 (0-1) | 0.65 |

---

### 🎯 适用模型与基准评测

- **推荐算法**：Informer, Autoformer, N-BEATS, XGBoost, DRL (SAC)
- **基准表现**：日前功率预测归一化均方根误差 (NRMSE) 优于 **5.8%**。

---

### 🚀 如何使用数据集

\`\`\`python
import pandas as pd
df = pd.read_csv('/home/jovyan/datasets/renewable_microgrid_power/scada.csv')
print(f"微电网采样时间步总数: {len(df):,}")
\`\`\``,
    versionsList: [
      {
        version: "V1.0",
        updatedAt: "2026-07-28 16:20",
        author: "电网智能调度课题组",
        size: "96.8 MB",
        sizeBytes: 101502976,
        changelog: "校内共享版本上线，包含储能SOC状态与日前预测对比。",
      },
    ],
    author: {
      name: "新能源工程系",
      role: "teacher",
      org: "清洁能源数字化联合实验室",
    },
    createdAt: "2026-07-28",
    updatedAt: "2026-07-28",
    mountCount: 530,
    downloadCount: 310,
    favoriteCount: 160,
    isFavorite: false,
    isMounted: false,
    mountPath: "/home/jovyan/datasets/renewable_microgrid_power",
    rowCount: 105120,
    columnCount: 15,
    associatedCourses: [],
  },
  {
    id: "ds-011",
    title: "古典文学与现代中文小说长文本语言模型预训练语料 (TXT/纯文本)",
    description: "精心清洗并去除乱码的1.2亿字纯中文长文本语料库，包含分章标记、段落换行与标点规范化，适用于大模型自回归预训练 (Pre-training) 与困惑度 (Perplexity) 评估。",
    techDomain: "文本生成",
    techDomains: ["文本生成", "大模型指令微调 (SFT)"],
    theme: "文化传媒/内容创作",
    themes: ["文化传媒/内容创作", "教育培训"],
    format: "TXT",
    fileSize: "245.0 MB",
    sizeBytes: 256901120,
    visibility: "public",
    auditStatus: "approved",
    auditTime: "2026-08-18 10:00",
    auditor: "王建国 (管理员)",
    permission: "download_and_mount",
    version: "V1.0",
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源与背景**：由中文语言信息处理重点实验室整理，汇总古代经典文学著作与现代长篇小说文本，历经去重、去乱码与标点符号统一规整。
- **核心应用目标**：用于中文大语言模型因果语言建模 (Causal LM) 持续预训练 (Continual Pre-training)、长上下文分词器训练与困惑度基准评测。
- **样本规模与结构**：包含 120 万段落文本、总计 1.2 亿字中文 UTF-8 纯文本语料。

---

### 📋 文本格式规范

- 采用标准 UTF-8 编码，包含清晰的 \`【章节标记】\` 与标准自然换行。
- 完全剔除 HTML 标签、广告弹窗垃圾字符与排版乱码。

---

### 🎯 适用模型与基准评测

- **推荐算法**：GPT-2, LLaMA, Mistral, Qwen 预训练管道
- **基准效果**：在 8k 上下文窗口下测试集困惑度 (PPL) 达 **14.2**。

---

### 🚀 如何使用数据集

\`\`\`python
with open('/home/jovyan/datasets/chinese_classic_novel_corpus/corpus.txt', 'r', encoding='utf-8') as f:
    sample_text = f.read(1000)
print(sample_text)
\`\`\``,
    previewText: `【第一章：山海浮沉录·起篇】
天宝一十四载，关陇风云激荡。商道自长安西出，经陇右、穿河西，直至西域疏勒镇。
黄沙漫卷之处，汉唐故垒依稀可见。驿卒跨快马飞驰而过，尘土扬起三丈，背上红翎急递正是边关六百里加急军报。

【第二章：九原夜雪】
朔风呼啸，暮色沉沉。边塞关隘之上，戍卒手握长戟，立于风雪之中，极目远眺，茫茫戈壁与暮色融为一体。
城下驿馆内，炭火正旺。行商旅客围炉而坐，低声交谈着近日关外的异动……

【第三章：墨客题壁】
酒过三巡，青衫墨客提笔蘸墨，于青砖白墙之上挥毫赋诗：
“大漠孤烟直，长河落日圆。萧关逢候骑，达夫在燕然。”
笔锋刚劲有力，字里行间尽显盛唐豪迈气象与边塞风骨。

【第四章：驼铃古道】
晨曦破晓，晨光微熹。驼队铃声清脆悠扬，踏着覆满白霜的砂砾古道缓缓前行。
丝绸、瓷器、茶叶顺着这条千年古道流向中亚乃至波斯湾，文明的交融在车辙与足迹中无声蔓延……`,
    versionsList: [
      {
        version: "V1.0",
        updatedAt: "2026-08-24 14:00",
        author: "中文NLP语料工坊",
        size: "245.0 MB",
        sizeBytes: 256901120,
        changelog: "初版发布，包含UTF-8标准编码的章节与语篇切片。",
      },
    ],
    author: {
      name: "语料工程中心",
      role: "teacher",
      org: "中文语言信息处理重点实验室",
    },
    createdAt: "2026-08-24",
    updatedAt: "2026-08-24",
    mountCount: 860,
    downloadCount: 520,
    favoriteCount: 310,
    isFavorite: false,
    isMounted: false,
    mountPath: "/home/jovyan/datasets/chinese_classic_novel_corpus",
    rowCount: 1200000,
    columnCount: 1,
    associatedCourses: [],
  },
  {
    id: "ds-011-robotics",
    title: "具身智能人形机器人双臂协同操作与多维触觉力反馈数据集",
    description: "采集自工业柔性装配与家庭服务双臂机器人，包含RGB-D双目相机流、6自由度机械臂末端位姿轨迹、指尖阵列式触觉压力及力矩反馈，支持端到端模仿学习(VLA)与强化学习实训。",
    techDomain: "强化学习",
    techDomains: ["强化学习", "姿态估计", "视频动作识别", "大模型指令微调 (SFT)"],
    theme: "工业制造/质检",
    themes: ["工业制造/质检", "科技互联网"],
    format: "ZIP",
    fileSize: "4.65 GB",
    sizeBytes: 4992899481,
    visibility: "public",
    auditStatus: "approved",
    auditTime: "2026-08-26 10:15",
    auditor: "王建国 (管理员)",
    permission: "mount_only",
    version: "V1.0",
    isComplexArchive: true,
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源与背景**：由具身智能与智能机器人国家重点实验室联合工业自动化企业，在真实双臂人形机器人工作站上通过遥操作（Teleoperation）与动力学仿真采集。
- **核心应用目标**：面向机器人学习、视觉-语言-动作 (VLA) 大模型微调及接触丰富型精密装配技能训练。
- **样本规模与模态覆盖**：涵盖 1,200 条专家演示 Episode（共计 360,000 个同步采样控制步），包含双路 1080P RGB 图像、对齐深度图、7 轴关节角速度、末端 6 维接触力及 16×16 触觉压力矩阵。

---

### 📋 数据字典与传感器通道

| 字段名称 | 数据类型 | 维度 | 含义解释 | 示例值 |
| :--- | :--- | :--- | :--- | :--- |
| \`step_idx\` | INT | 1 | 演示轨迹步骤序号 | 142 |
| \`joint_positions\` | FLOAT[] | 14 | 左右臂各 7 自由度角度 (rad) | [0.12, -0.45, ... , 0.88] |
| \`end_effector_pose\` | FLOAT[] | 12 | 左右手末端 6DOF 位姿 (xyz + rpy) | [0.42, -0.15, 0.28, 0.0, 1.57, 0.0] |
| \`tactile_matrix\` | INT[][] | 16×16 | 机械指尖阵列压力数值 (0-1024) | [[12, 15, ...], ...] |
| \`gripper_state\` | FLOAT | 2 | 夹爪张开度 (0: 闭合, 1: 全开) | 0.75 |

---

### 🎯 适用模型与基准评测

- **推荐算法**：Diffusion Policy, ACT (Action Chunking with Transformer), Octo, RT-2-X, RL (PPO/SAC)
- **基准表现**：ACT 模型在精密插拔与柔性抓取任务中成功率达到 **89.4%**。

---

### 🚀 如何使用数据集

在 Jupyter 实训环境中挂载至 \`/home/jovyan/datasets/embodied_robotics_tactile\` 即可直接调用 HDF5 / Zarr 格式数据：

\`\`\`python
import h5py
import numpy as np

with h5py.File('/home/jovyan/datasets/embodied_robotics_tactile/episodes.hdf5', 'r') as f:
    print(f"包含演示轨迹数: {len(f['data'].keys())}")
    demo = f['data/demo_0001']
    print(f"关节状态形状: {demo['joint_states'].shape}")
\`\`\``,
    versionsList: [
      {
        version: "V1.0",
        updatedAt: "2026-08-26 10:00",
        author: "具身智能联合实验室",
        size: "4.65 GB",
        sizeBytes: 4992899481,
        changelog: "初版发布，提供标准 HDF5 与 ROS2 Bag 格式数据，附带末端触觉校准参数。",
      },
    ],
    author: {
      name: "具身智能实验室",
      role: "teacher",
      org: "机器人与智能制造前沿研究院",
    },
    createdAt: "2026-08-26",
    updatedAt: "2026-08-26",
    mountCount: 1680,
    downloadCount: 0,
    favoriteCount: 620,
    isFavorite: true,
    isMounted: false,
    mountPath: "/home/jovyan/datasets/embodied_robotics_tactile",
    rowCount: 360000,
    columnCount: 28,
    associatedCourses: [
      {
        courseId: "course-ai-03",
        courseName: "深度学习技术应用",
        labId: "lab-jupyter-01",
        labName: "人工智能平台-jupyter",
        chapter: "第8章 具身智能与机器人策略学习实战",
      },
    ],
  },
  {
    id: "ds-012",
    title: "高分卫星遥感多光谱地表覆盖与城市违建监测影像集",
    description: "涵盖高分二号/六号卫星0.8米高分辨率多光谱影像切片，包含建筑、水体、植被、农田、道路及疑似违建工地的精细像素级多边形标注，支持遥感变化检测实训。",
    techDomain: "图像分割",
    techDomains: ["图像分割", "目标检测", "图像分类"],
    theme: "航空航天",
    themes: ["航空航天", "气象水文/地质监测", "政务民生/数字治理"],
    format: "Images",
    fileSize: "3.10 GB",
    sizeBytes: 3328599654,
    visibility: "public",
    auditStatus: "approved",
    auditTime: "2026-08-25 14:20",
    auditor: "王建国 (管理员)",
    permission: "download_and_mount",
    version: "V1.0",
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源与背景**：由空间信息工程与卫星遥感应用研究所整理，基于高分二号 (GF-2) 亚米级全色多光谱正射融合影像。
- **核心应用目标**：用于国土空间规划动态监测、城市违建遥感普查与地表覆盖时序变化检测。
- **样本规模与分辨率**：包含 12,000 幅 1024×1024 像素 TIFF/PNG 切片，配有严格的 GeoJSON 矢量多边形标注与 GeoTIFF 掩膜。`,
    versionsList: [
      {
        version: "V1.0",
        updatedAt: "2026-08-25 14:00",
        author: "空间遥感中心",
        size: "3.10 GB",
        sizeBytes: 3328599654,
        changelog: "初版发布，附带多光谱波段校正与GeoJSON格式地理空间注记。",
      },
    ],
    author: {
      name: "空间遥感中心",
      role: "teacher",
      org: "遥感与地理信息系统国家工程中心",
    },
    createdAt: "2026-08-25",
    updatedAt: "2026-08-25",
    mountCount: 940,
    downloadCount: 680,
    favoriteCount: 380,
    isFavorite: false,
    isMounted: false,
    mountPath: "/home/jovyan/datasets/satellite_remote_sensing_landcover",
    rowCount: 12000,
    columnCount: 8,
    associatedCourses: [],
  },
  {
    id: "ds-013",
    title: "生物医药小分子三维图结构与靶点亲和力结合能预测数据集",
    description: "汇聚30万个已合成候选药物小分子的SMILES化学式、3D构象空间坐标及对50个关键疾病靶点蛋白的真实生物测定结合亲和力(Ki/Kd/IC50)，支持AI制药图神经网络建模。",
    techDomain: "图神经网络/知识图谱",
    techDomains: ["图神经网络/知识图谱", "表格数据", "时间序列预测"],
    theme: "生物医药/分子计算",
    themes: ["生物医药/分子计算", "医疗健康"],
    format: "Parquet",
    fileSize: "780.4 MB",
    sizeBytes: 818315264,
    visibility: "public",
    auditStatus: "approved",
    auditTime: "2026-08-24 18:30",
    auditor: "王建国 (管理员)",
    permission: "download_and_mount",
    version: "V1.0",
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源与背景**：由计算生物学与计算制药创新中心基于 BindingDB、ChEMBL 及专有湿实验测定数据清洗构建。
- **核心应用目标**：用于虚拟药物筛选 (Virtual Screening)、基于结构的分子性质预测 (ADMET) 与靶点结合亲和力回归。
- **样本规模与结构**：包含 320,000 条结构化小分子-靶点配对记录，内置 RDKit 生成的 2048 位 Morgan 指纹与 3D 原子坐标。`,
    versionsList: [
      {
        version: "V1.0",
        updatedAt: "2026-08-24 18:00",
        author: "计算生物学课题组",
        size: "780.4 MB",
        sizeBytes: 818315264,
        changelog: "初版发布，提供分子图节点特征与Parquet列式存储。",
      },
    ],
    author: {
      name: "计算生物学课题组",
      role: "teacher",
      org: "人工智能生命科学研究院",
    },
    createdAt: "2026-08-24",
    updatedAt: "2026-08-24",
    mountCount: 1120,
    downloadCount: 750,
    favoriteCount: 450,
    isFavorite: false,
    isMounted: false,
    mountPath: "/home/jovyan/datasets/biomed_molecule_affinity",
    rowCount: 320000,
    columnCount: 32,
    associatedCourses: [],
  },
  {
    id: "ds-014",
    title: "跨境电商多语种商品评论细粒度情感与属性倾向语料",
    description: "覆盖英、德、法、日、西等8种主要语言的60万条跨境电商真实买家评论，包含外观、物流、质量、性价比等12个维度的细粒度Aspect级情感倾向极性标注。",
    techDomain: "情感分析",
    techDomains: ["情感分析", "序列标注/NER", "文本分类", "大模型指令微调 (SFT)"],
    theme: "跨境电商",
    themes: ["跨境电商", "商业零售", "科技互联网"],
    format: "JSON",
    fileSize: "390.2 MB",
    sizeBytes: 409154355,
    visibility: "public",
    auditStatus: "approved",
    auditTime: "2026-08-23 15:40",
    auditor: "王建国 (管理员)",
    permission: "download_and_mount",
    version: "V1.0",
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源与背景**：采集自主流跨境出海电商平台 2025-2026 年多国站点的真实买家评价数据。
- **核心应用目标**：面向多语言自然语言处理、细粒度属性情感分析 (ABSA) 与海外舆情洞察。
- **样本规模与多语种覆盖**：600,000 条句子级语料，标注包含属性词提取（Aspect Term）与情感极性分类（Positive/Neutral/Negative）。`,
    versionsList: [
      {
        version: "V1.0",
        updatedAt: "2026-08-23 15:00",
        author: "跨境出海NLP组",
        size: "390.2 MB",
        sizeBytes: 409154355,
        changelog: "初版发布，经过语法标点规范化与匿名化脱敏处理。",
      },
    ],
    author: {
      name: "出海大数据实验室",
      role: "teacher",
      org: "国际数字贸易与智能决策研究院",
    },
    createdAt: "2026-08-23",
    updatedAt: "2026-08-23",
    mountCount: 880,
    downloadCount: 560,
    favoriteCount: 340,
    isFavorite: false,
    isMounted: false,
    mountPath: "/home/jovyan/datasets/crossborder_multilingual_reviews",
    rowCount: 600000,
    columnCount: 10,
    associatedCourses: [],
  },
  {
    id: "ds-015",
    title: "智慧城市低空无人机航拍路况视频与交通流密度评估数据",
    description: "在城市核心十字路口与立交桥以100米低空悬停航拍的4K 60FPS视频切片及车辆检测跟踪轨迹标注，包含拥堵指数、排队长度与跟车时距多维指标。",
    techDomain: "视频动作识别",
    techDomains: ["视频动作识别", "目标检测", "姿态估计"],
    theme: "智能安防",
    themes: ["智能安防", "智慧交通/车联网", "自动驾驶"],
    format: "ZIP",
    fileSize: "3.80 GB",
    sizeBytes: 4080218931,
    visibility: "public",
    auditStatus: "approved",
    auditTime: "2026-08-22 17:00",
    auditor: "王建国 (管理员)",
    permission: "mount_only",
    version: "V1.0",
    isComplexArchive: true,
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源与背景**：由低空经济与无人系统研究院使用工业级四旋翼无人机搭载 4K 光电吊舱采集于主城区复杂交通枢纽。
- **核心应用目标**：用于俯视微小目标检测、多目标跟踪 (MOT)、交通流热力图生成及拥堵预警算法研发。
- **样本规模与规格**：包含 80 段时长 5 分钟的高清视频切片（共计 1,440,000 帧），提供标准 MOT 格式轨迹 ID 与速度矢量标定。`,
    versionsList: [
      {
        version: "V1.0",
        updatedAt: "2026-08-22 16:30",
        author: "低空无人机智航组",
        size: "3.80 GB",
        sizeBytes: 4080218931,
        changelog: "初版发布，包含无人机俯视小目标高精度标注与MOT跟踪ID。",
      },
    ],
    author: {
      name: "低空智航研究院",
      role: "teacher",
      org: "低空经济与无人自主系统重点实验室",
    },
    createdAt: "2026-08-22",
    updatedAt: "2026-08-22",
    mountCount: 1290,
    downloadCount: 0,
    favoriteCount: 510,
    isFavorite: false,
    isMounted: false,
    mountPath: "/home/jovyan/datasets/drone_lowaltitude_traffic_video",
    rowCount: 1440000,
    columnCount: 12,
    associatedCourses: [],
  },
  // 私有数据集（计入郑鸿杰个人存储配额）
  {
    id: "ds-user-pending-01",
    title: "城市道路车辆与夜间低照度目标检测公开测试集",
    description: "涵盖早晚高峰及夜间低光照恶劣气象条件下的道路行车记录切片，包含车辆、行人及非机动车YOLO格式边界框标注，申请全校公开共享。",
    techDomain: "目标检测",
    techDomains: ["目标检测", "图像分类"],
    theme: "智慧交通/车联网",
    themes: ["智慧交通/车联网", "自动驾驶"],
    format: "ZIP",
    fileSize: "850.0 MB",
    sizeBytes: 891289600,
    visibility: "school",
    auditStatus: "pending",
    submitTime: "2026-08-27 15:30",
    permission: "download_and_mount",
    version: "V1.0",
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源与背景**：由郑鸿杰教师团队在福州市主干道采集，涵盖阴雨与夜间弱光工况。
- **核心应用目标**：用于教学实验《计算机视觉：恶劣工况目标检测算法优化》。
- **样本规模**：共 3,200 张高清标注图像，已划分 train/val 集。`,
    versionsList: [
      {
        version: "V1.0",
        updatedAt: "2026-08-27 15:30",
        author: "郑鸿杰 (教师)",
        size: "850.0 MB",
        sizeBytes: 891289600,
        changelog: "初版上传并提交全校可见发布审核。",
      },
    ],
    author: {
      name: "郑鸿杰",
      role: "teacher",
      org: "新大陆时代科技·AI教学研究部",
    },
    createdAt: "2026-08-27",
    updatedAt: "2026-08-27",
    mountCount: 0,
    downloadCount: 0,
    favoriteCount: 0,
    isFavorite: false,
    isMounted: false,
    mountPath: "/home/jovyan/datasets/night_traffic_yolo",
    rowCount: 3200,
    columnCount: 5,
    associatedCourses: [],
  },
  {
    id: "ds-user-rejected-01",
    title: "高等数学期末在线题库错题归因与知识点图谱数据集",
    description: "涵盖大一微积分与线性代数章节测验做题日志，包含学生错题选项、答题时长与知识点映射关系。",
    techDomain: "表格数据",
    techDomains: ["表格数据", "文本分类"],
    theme: "教育培训",
    themes: ["教育培训"],
    format: "CSV",
    fileSize: "38.5 MB",
    sizeBytes: 40370176,
    visibility: "public",
    auditStatus: "rejected",
    submitTime: "2026-08-26 11:20",
    auditTime: "2026-08-26 16:45",
    auditor: "王建国 (管理员)",
    auditReason: "抽检发现原始数据表中第 3 列包含未经哈希脱敏的学生真实学号与班级全名，存在隐私合规风险；同时缺少必要的数据字典说明，请彻底脱敏并补齐文档后重新提交审核。",
    permission: "download_and_mount",
    version: "V1.0",
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源**：校内智慧教务在线测试系统脱敏答题流水。
- **样本规模**：共 45,000 条答题记录。`,
    versionsList: [
      {
        version: "V1.0",
        updatedAt: "2026-08-26 11:20",
        author: "郑鸿杰 (教师)",
        size: "38.5 MB",
        sizeBytes: 40370176,
        changelog: "初次提交公开审核（被驳回）。",
      },
    ],
    author: {
      name: "郑鸿杰",
      role: "teacher",
      org: "新大陆时代科技·AI教学研究部",
    },
    createdAt: "2026-08-26",
    updatedAt: "2026-08-26",
    mountCount: 0,
    downloadCount: 0,
    favoriteCount: 0,
    isFavorite: false,
    isMounted: false,
    mountPath: "/home/jovyan/datasets/math_exam_mistakes",
    rowCount: 45000,
    columnCount: 8,
    associatedCourses: [],
  },
  {
    id: "ds-private-001",
    title: "我的实训课题：高光谱遥感土地覆盖精细分类实验数据 (ZIP/非标准压缩包)",
    description: "个人专属实验数据，包含AVIRIS传感器捕获的224个连续光谱波段切片及对应地物真实标签，由于属于特定高光谱多波段二进制矩阵，降级为文件目录清单展示。",
    techDomain: "图像分割",
    techDomains: ["图像分割", "目标检测"],
    theme: "农业环保/精准农业",
    themes: ["农业环保/精准农业", "气象水文/地质监测"],
    format: "ZIP",
    fileSize: "3.2 GB",
    sizeBytes: 3435973836,
    visibility: "private",
    auditStatus: "approved",
    permission: "download_and_mount",
    version: "V1.0",
    overviewDoc: `### 📖 业务背景、核心目标与样本量

- **数据来源与背景**：个人科研实训课题数据，由机载高光谱成像仪 AVIRIS 采集于农林生态试验区。
- **核心应用目标**：用于构建高光谱波段降维算法 (PCA/AutoEncoder) 与农田地物精细分类 (16 类主要作物与林地)。
- **样本规模与规格**：包含 224 个连续光谱波段切片，高维光谱立方体分辨率为 512×512 像素。

---

### 📋 文件目录架构

- \`hyperspectral_cube.dat\`: 原始浮点型高光谱矩阵数据包
- \`ground_truth_labels.mat\`: 经过实地 GPS 验证的地物类别真值标签矩阵
- \`wavelength_info.csv\`: 224 个通道中心波长与半高宽响应参数

---

### 🎯 适用模型与基准评测

- **推荐算法**：3D-CNN, Spectral-Spatial Transformer, Support Vector Machine (SVM)
- **基准表现**：3D-CNN 全类别分类总体精度 (OA) 达 **94.5%**，Kappa 系数 **0.938**。

---

### 🚀 如何使用数据集

\`\`\`python
import scipy.io as sio
mat_data = sio.loadmat('/home/jovyan/datasets/my_hyperspectral_project/ground_truth_labels.mat')
print("地物标签已加载:", mat_data.keys())
\`\`\``,
    isComplexArchive: true,
    fileTree: [
      {
        name: "hyperspectral_aviris_2026.zip",
        type: "folder",
        path: "/",
        childrenCount: 4,
        children: [
          {
            name: "raw_cubes",
            type: "folder",
            path: "/raw_cubes",
            childrenCount: 224,
            children: [
              { name: "band_001_to_050.hdr", type: "file", extension: "hdr", size: "24 KB", path: "/raw_cubes/band_001_to_050.hdr" },
              { name: "band_001_to_050.dat", type: "file", extension: "dat", size: "750 MB", path: "/raw_cubes/band_001_to_050.dat" },
              { name: "band_051_to_150.dat", type: "file", extension: "dat", size: "1.45 GB", path: "/raw_cubes/band_051_to_150.dat" },
              { name: "band_151_to_224.dat", type: "file", extension: "dat", size: "980 MB", path: "/raw_cubes/band_151_to_224.dat" },
            ],
          },
          {
            name: "ground_truth",
            type: "folder",
            path: "/ground_truth",
            childrenCount: 3,
            children: [
              { name: "landcover_labels.mat", type: "file", extension: "mat", size: "14.2 MB", path: "/ground_truth/landcover_labels.mat" },
              { name: "class_mapping.json", type: "file", extension: "json", size: "4.8 KB", path: "/ground_truth/class_mapping.json" },
            ],
          },
          {
            name: "calibration_sensor_params.xml",
            type: "file",
            extension: "xml",
            size: "18.5 KB",
            path: "/calibration_sensor_params.xml",
          },
          {
            name: "experiment_notes.txt",
            type: "file",
            extension: "txt",
            size: "2.1 KB",
            path: "/experiment_notes.txt",
          },
        ],
      },
    ],
    versionsList: [
      {
        version: "V1.0",
        updatedAt: "2026-08-20 17:15",
        author: "郑鸿杰 (私有)",
        size: "3.2 GB",
        sizeBytes: 3435973836,
        changelog: "个人私有草稿版本，计入个人存储配额（3.2GB / 20GB）。",
      },
    ],
    author: {
      name: "郑鸿杰",
      role: "teacher",
      org: "个人工作区",
    },
    createdAt: "2026-08-20",
    updatedAt: "2026-08-20",
    mountCount: 12,
    downloadCount: 1,
    favoriteCount: 0,
    isFavorite: false,
    isMounted: true,
    mountPath: "/home/jovyan/datasets/my_hyperspectral_landcover",
    rowCount: 14500,
    columnCount: 224,
    associatedCourses: [],
  },
  {
    id: "ds-private-002",
    title: "未发布草稿：智慧医疗ICU生命体征预警小样本集",
    description: "整理中的测试数据，包含心率、血氧、收缩压实时脉冲流，仅供本地调参测试。",
    techDomain: "时间序列预测",
    techDomains: ["时间序列预测", "异常检测/风控"],
    theme: "医疗健康",
    themes: ["医疗健康"],
    format: "CSV",
    fileSize: "1.6 GB",
    sizeBytes: 1717986918,
    visibility: "private",
    auditStatus: "approved",
    permission: "download_and_mount",
    version: "V1.0",
    versionsList: [
      {
        version: "V1.0",
        updatedAt: "2026-08-22 09:30",
        author: "郑鸿杰 (私有)",
        size: "1.6 GB",
        sizeBytes: 1717986918,
        changelog: "个人测试集，计入个人存储配额。",
      },
    ],
    author: {
      name: "郑鸿杰",
      role: "teacher",
      org: "个人工作区",
    },
    createdAt: "2026-08-22",
    updatedAt: "2026-08-22",
    mountCount: 3,
    downloadCount: 0,
    favoriteCount: 0,
    isFavorite: false,
    isMounted: false,
    mountPath: "/home/jovyan/datasets/icu_vitals_sample",
    rowCount: 240000,
    columnCount: 10,
    associatedCourses: [],
  },
];
