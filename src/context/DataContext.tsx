import React, { createContext, useContext, useState, useEffect } from "react";
import {
  DatasetItem,
  INITIAL_DATASETS,
  USER_PERSONAS,
  UserPersona,
  TagItem,
  UserQuotaItem,
  AuditLogItem,
  DatasetSystemConfig,
  INITIAL_TAG_ITEMS,
  INITIAL_USER_QUOTAS,
  INITIAL_AUDIT_LOGS,
  DEFAULT_DATASET_SYSTEM_CONFIG,
  extractDatasetSummary,
} from "../data/mockData";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "version_update" | "mount_success" | "quota_alert";
}

interface DataContextType {
  currentUser: UserPersona;
  setCurrentUser: (user: UserPersona) => void;
  allUsers: UserPersona[];
  datasets: DatasetItem[];
  mountedDatasets: DatasetItem[];
  toggleMount: (id: string) => { success: boolean; message: string; isMounted: boolean };
  toggleFavorite: (id: string) => void;
  addDataset: (dataset: Partial<DatasetItem>) => { success: boolean; message?: string };
  updateDataset: (id: string, updates: Partial<DatasetItem>) => { success: boolean; message: string };
  deleteDataset: (id: string) => { success: boolean; hasReferences: boolean; referencedCount: number; message: string };
  uploadNewVersion: (id: string, newVersion: { changelog: string; fileSize?: string; sizeBytes?: number; fileName?: string }) => { success: boolean; message: string };
  rollbackVersion: (datasetId: string, targetVersion: string) => void;
  deleteVersion: (datasetId: string, targetVersion: string) => { success: boolean; message: string };
  batchDeleteDatasets: (ids: string[]) => { success: boolean; count: number; message: string };
  batchUpdateVisibility: (ids: string[], visibility: "public" | "school" | "private") => { success: boolean; count: number; message: string };
  batchUpdatePermission: (ids: string[], permission: "download_and_mount" | "mount_only") => { success: boolean; count: number; message: string };
  batchMountDatasets: (ids: string[], mount: boolean) => { success: boolean; message: string };
  batchFavoriteDatasets: (ids: string[], fav: boolean) => { success: boolean; message: string };
  storageInfo: {
    usedGB: number;
    totalGB: number;
    percentage: number;
    privateCount: number;
    publicCount: number;
  };
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  activeLabId: string;
  setActiveLabId: (labId: string) => void;
  selectedDatasetId: string | null;
  setSelectedDatasetId: (id: string | null) => void;

  // 后台数据集管理 (Dataset Backend Management)
  tagItems: TagItem[];
  activeTechDomains: string[];
  activeThemes: string[];
  systemConfig: DatasetSystemConfig;
  userQuotas: UserQuotaItem[];
  auditLogs: AuditLogItem[];
  pendingAuditCount: number;
  auditDataset: (datasetId: string, status: "approved" | "rejected", rejectReason?: string) => { success: boolean; message: string };
  batchAuditDatasets: (datasetIds: string[], status: "approved" | "rejected", rejectReason?: string) => { success: boolean; count: number; message: string };
  resubmitForAudit: (datasetId: string) => { success: boolean; message: string };
  addTag: (category: "techDomain" | "theme", name: string, description?: string) => { success: boolean; message: string };
  editTag: (id: string, name: string, description?: string) => { success: boolean; message: string };
  toggleTagStatus: (id: string) => { success: boolean; message: string };
  deleteTag: (id: string) => { success: boolean; message: string };
  batchToggleTags: (ids: string[], enabled: boolean) => { success: boolean; message: string };
  batchDeleteTags: (ids: string[]) => { success: boolean; message: string };
  updateSystemConfig: (updates: Partial<DatasetSystemConfig>) => { success: boolean; message: string };
  updateUserQuota: (userId: string, newTotalGB: number) => { success: boolean; message: string };
  batchAdjustQuotas: (userIds: string[], percentDelta?: number, setExactGB?: number) => { success: boolean; message: string };
  addAllowedExtension: (ext: string) => { success: boolean; message: string };
  removeAllowedExtension: (ext: string) => { success: boolean; message: string };
  resetAllowedExtensions: () => { success: boolean; message: string };
  addAuditLog: (log: Omit<AuditLogItem, "id" | "timestamp">) => void;
  clearAuditLogs: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserPersona>(USER_PERSONAS[0]);
  const [datasets, setDatasets] = useState<DatasetItem[]>(() => {
    const saved = localStorage.getItem("uusima_datasets_v8") || localStorage.getItem("uusima_datasets_v7");
    if (saved) {
      try {
        const parsed: DatasetItem[] = JSON.parse(saved);
        
        // 修复历史数据中可能存在的重复 ID (如机器人数据集旧 ID)
        const sanitizedParsed = parsed.map((d) => {
          if (d.id === "ds-011" && (d.title?.includes("机器人") || d.title?.includes("具身智能"))) {
            return { ...d, id: "ds-011-robotics" };
          }
          return d;
        });

        // 严格根据 ID 去重
        const uniqueMap = new Map<string, DatasetItem>();
        sanitizedParsed.forEach((d) => {
          if (d && d.id) {
            uniqueMap.set(d.id, d);
          }
        });

        // 将 INITIAL_DATASETS 中新出现的预置数据集补充进去
        INITIAL_DATASETS.forEach((preset) => {
          if (!uniqueMap.has(preset.id)) {
            uniqueMap.set(preset.id, preset);
          }
        });

        const combined = Array.from(uniqueMap.values());
        return combined.map((ds) => ({
          ...ds,
          auditStatus: ds.auditStatus || (ds.visibility === "private" ? "approved" : "approved"),
        }));
      } catch (e) {
        return INITIAL_DATASETS;
      }
    }
    return INITIAL_DATASETS;
  });

  const [tagItems, setTagItems] = useState<TagItem[]>(() => {
    const saved = localStorage.getItem("uusima_dataset_tags_v1");
    if (saved) {
      try {
        const parsed: TagItem[] = JSON.parse(saved);
        const savedNames = new Set(parsed.map((t) => t.name));
        const newPresets = INITIAL_TAG_ITEMS.filter((t) => !savedNames.has(t.name));
        return [...parsed, ...newPresets];
      } catch (e) {
        return INITIAL_TAG_ITEMS;
      }
    }
    return INITIAL_TAG_ITEMS;
  });

  const [systemConfig, setSystemConfig] = useState<DatasetSystemConfig>(() => {
    const saved = localStorage.getItem("uusima_dataset_sys_config_v1");
    return saved ? JSON.parse(saved) : DEFAULT_DATASET_SYSTEM_CONFIG;
  });

  const [userQuotas, setUserQuotas] = useState<UserQuotaItem[]>(() => {
    const saved = localStorage.getItem("uusima_user_quotas_v1");
    return saved ? JSON.parse(saved) : INITIAL_USER_QUOTAS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem("uusima_audit_logs_v1");
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  useEffect(() => {
    localStorage.setItem("uusima_dataset_tags_v1", JSON.stringify(tagItems));
  }, [tagItems]);

  useEffect(() => {
    localStorage.setItem("uusima_dataset_sys_config_v1", JSON.stringify(systemConfig));
  }, [systemConfig]);

  useEffect(() => {
    localStorage.setItem("uusima_user_quotas_v1", JSON.stringify(userQuotas));
  }, [userQuotas]);

  useEffect(() => {
    localStorage.setItem("uusima_audit_logs_v1", JSON.stringify(auditLogs));
  }, [auditLogs]);

  // 计算当前业务类型标签列表（供前端大厅与上传弹窗动态调用）
  const activeTechDomains = tagItems.map((t) => t.name);
  const activeThemes = tagItems.map((t) => t.name);

  const [activeLabId, setActiveLabId] = useState<string>("lab-jupyter-01");
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>("ds-001");

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "收藏数据集更新通知",
      message: "您收藏的数据集《智能客服多轮对话意图识别》已由教师更新至 V3.0 版本，新增了大模型指令微调对格式！",
      time: "10分钟前",
      read: false,
      type: "version_update",
    },
    {
      id: "notif-2",
      title: "环境挂载通知",
      message: "《电商用户多维画像与购买行为转化预测》已成功挂载至您的Jupyter工作区（只读模式）。",
      time: "2小时前",
      read: true,
      type: "mount_success",
    },
  ]);

  useEffect(() => {
    localStorage.setItem("uusima_datasets_v8", JSON.stringify(datasets));
  }, [datasets]);

  // 计算个人存储配额 (仅计算私有数据集)
  const privateDatasets = datasets.filter(
    (d) => d.visibility === "private" && d.author.name.includes(currentUser.name)
  );
  const publicDatasets = datasets.filter((d) => d.visibility === "public");

  const privateSizeBytes = privateDatasets.reduce((acc, cur) => acc + (cur.sizeBytes || 0), 0);
  const calculatedUsedGB = Number((privateSizeBytes / (1024 * 1024 * 1024)).toFixed(2));
  const usedGB = calculatedUsedGB > 0 ? calculatedUsedGB : currentUser.storageUsedGB;
  const totalGB = currentUser.storageTotalGB;
  const percentage = Math.min(100, Math.round((usedGB / totalGB) * 100));

  const storageInfo = {
    usedGB,
    totalGB,
    percentage,
    privateCount: privateDatasets.length,
    publicCount: publicDatasets.length,
  };

  const mountedDatasets = datasets.filter((d) => d.isMounted);

  const toggleMount = (id: string) => {
    let target = datasets.find((d) => d.id === id);
    if (!target) return { success: false, message: "数据集不存在", isMounted: false };

    const nextState = !target.isMounted;
    setDatasets((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return {
            ...d,
            isMounted: nextState,
            mountCount: nextState ? d.mountCount + 1 : d.mountCount,
          };
        }
        return d;
      })
    );

    if (nextState) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: "数据集挂载成功",
          message: `《${target!.title}》已成功建立只读符号链接至 Jupyter 目录：${target!.mountPath}`,
          time: "刚刚",
          read: false,
          type: "mount_success",
        },
        ...prev,
      ]);
      return {
        success: true,
        message: `已建立只读符号链接: ${target.mountPath} -> /home/jovyan/datasets/`,
        isMounted: true,
      };
    } else {
      return {
        success: true,
        message: `已从工作区卸载数据集《${target.title}》`,
        isMounted: false,
      };
    }
  };

  const toggleFavorite = (id: string) => {
    setDatasets((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextFav = !d.isFavorite;
          return {
            ...d,
            isFavorite: nextFav,
            favoriteCount: nextFav ? d.favoriteCount + 1 : Math.max(0, d.favoriteCount - 1),
          };
        }
        return d;
      })
    );
  };

  const addDataset = (newDs: Partial<DatasetItem>) => {
    // 检查是否超出5GB限制
    if (newDs.sizeBytes && newDs.sizeBytes > 5 * 1024 * 1024 * 1024) {
      return { success: false, message: "数据集单文件不能超过 5GB，请拆分后上传或联系管理员扩容！" };
    }

    // 检查私有数据集配额
    if (newDs.visibility === "private" && newDs.sizeBytes) {
      const addedGB = newDs.sizeBytes / (1024 * 1024 * 1024);
      if (usedGB + addedGB > totalGB) {
        return { success: false, message: `个人存储配额不足（剩余 ${(totalGB - usedGB).toFixed(1)}GB），无法上传！请清理空间或申请扩容。` };
      }
    }

    const techDomainsList = (newDs as any).techDomains || (newDs.techDomain ? [newDs.techDomain] : []);
    const themesList = (newDs as any).themes || (newDs.theme ? [newDs.theme] : []);

    const generatedDesc = newDs.description || (newDs.overviewDoc ? extractDatasetSummary({ overviewDoc: newDs.overviewDoc }) : "暂无详细概述与文档说明");

    const isPublicScope = newDs.visibility === "public" || newDs.visibility === "school";
    const initialAuditStatus: "pending" | "approved" | "rejected" =
      newDs.visibility === "private"
        ? "approved"
        : currentUser.role === "admin"
        ? "approved"
        : "pending";

    const createdItem: DatasetItem = {
      id: `ds-${Date.now()}`,
      title: newDs.title || "未命名数据集",
      description: generatedDesc,
      overviewDoc: newDs.overviewDoc,
      techDomain: techDomainsList[0] || newDs.techDomain || "未分类",
      techDomains: techDomainsList,
      theme: themesList[0] || newDs.theme || "通用领域",
      themes: themesList,
      format: (newDs.format as any) || "CSV",
      fileSize: newDs.fileSize || "12.5 MB",
      sizeBytes: newDs.sizeBytes || 13107200,
      visibility: newDs.visibility || "public",
      auditStatus: initialAuditStatus,
      submitTime: isPublicScope ? new Date().toLocaleString() : undefined,
      auditTime: initialAuditStatus === "approved" && isPublicScope ? new Date().toLocaleString() : undefined,
      auditor: initialAuditStatus === "approved" && isPublicScope ? `${currentUser.name} (管理员)` : undefined,
      permission: newDs.permission || "download_and_mount",
      version: "V1.0",
      versionsList: [
        {
          version: "V1.0",
          updatedAt: new Date().toLocaleString(),
          author: `${currentUser.name} (${currentUser.roleName})`,
          size: newDs.fileSize || "12.5 MB",
          sizeBytes: newDs.sizeBytes || 13107200,
          changelog: "初版上传发布",
        },
      ],
      author: {
        name: currentUser.name,
        role: currentUser.role,
        org: currentUser.org,
      },
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      mountCount: 0,
      downloadCount: 0,
      favoriteCount: 0,
      isFavorite: false,
      isMounted: false,
      mountPath: `/home/jovyan/datasets/${(newDs.title || "dataset").replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase()}`,
      rowCount: newDs.rowCount || 1000,
      columnCount: newDs.columnCount || 8,
      customCoverImage: newDs.customCoverImage,
      associatedCourses: newDs.associatedCourses || [],
      fileTree: newDs.fileTree,
      previewRows: newDs.previewRows,
      columns: newDs.columns,
      previewImages: newDs.previewImages,
      previewText: newDs.previewText,
      yamlConfig: newDs.yamlConfig,
      isComplexArchive: newDs.isComplexArchive,
    };

    setDatasets((prev) => [createdItem, ...prev]);

    if (isPublicScope && initialAuditStatus === "pending") {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: "数据集已提交审核",
          message: `您提交的公开/全校数据集《${createdItem.title}》已进入管理员审核队列，审核通过后即可在公开大厅展示。`,
          time: "刚刚",
          read: false,
          type: "version_update",
        },
        ...prev,
      ]);
      return { success: true, message: "数据集上传成功，已提交管理员审核！" };
    }

    return { success: true, message: "数据集上传成功！" };
  };

  const updateDataset = (id: string, updates: Partial<DatasetItem>) => {
    const target = datasets.find((d) => d.id === id);
    if (!target) return { success: false, message: "数据集不存在" };

    // 约束校验：若从公开/校内改为私有，且已有实验/课程引用，则拦截
    if (
      updates.visibility === "private" &&
      target.visibility !== "private" &&
      target.associatedCourses &&
      target.associatedCourses.length > 0
    ) {
      return {
        success: false,
        message: `该数据集已被 ${target.associatedCourses.length} 个实验/课程引用，无法设为个人私有，请先解除关联！`,
      };
    }

    const techDomainsList = (updates as any).techDomains || (updates.techDomain ? [updates.techDomain] : target.techDomains);
    const themesList = (updates as any).themes || (updates.theme ? [updates.theme] : target.themes);

    // 若从私有改公开/全校，且不是管理员，则重置为待审核
    let nextAuditStatus = target.auditStatus;
    let nextSubmitTime = target.submitTime;
    let nextAuditReason = target.auditReason;
    if (
      (updates.visibility === "public" || updates.visibility === "school") &&
      target.visibility === "private" &&
      currentUser.role !== "admin"
    ) {
      nextAuditStatus = "pending";
      nextSubmitTime = new Date().toLocaleString();
      nextAuditReason = undefined;
    }

    setDatasets((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return {
            ...d,
            ...updates,
            auditStatus: updates.auditStatus || nextAuditStatus,
            submitTime: updates.submitTime || nextSubmitTime,
            auditReason: updates.auditReason !== undefined ? updates.auditReason : nextAuditReason,
            techDomain: techDomainsList?.[0] || d.techDomain,
            techDomains: techDomainsList,
            theme: themesList?.[0] || d.theme,
            themes: themesList,
            updatedAt: new Date().toISOString().split("T")[0],
          };
        }
        return d;
      })
    );

    return { success: true, message: "数据集信息修改成功！" };
  };

  // 数据集审核 (单个)
  const auditDataset = (
    datasetId: string,
    status: "approved" | "rejected",
    rejectReason?: string
  ) => {
    const target = datasets.find((d) => d.id === datasetId);
    if (!target) return { success: false, message: "数据集不存在" };

    const nowStr = new Date().toLocaleString();
    const auditorName = `${currentUser.name} (${currentUser.roleName})`;

    setDatasets((prev) =>
      prev.map((d) => {
        if (d.id === datasetId) {
          return {
            ...d,
            auditStatus: status,
            auditReason: status === "rejected" ? rejectReason || "审核未通过" : undefined,
            auditTime: nowStr,
            auditor: auditorName,
          };
        }
        return d;
      })
    );

    // 记录审计日志
    addAuditLog({
      operator: auditorName,
      action: status === "approved" ? "审核通过数据集" : "驳回数据集审核申请",
      target: target.title,
      details:
        status === "approved"
          ? `已批准《${target.title}》的${target.visibility === "public" ? "公开" : "全校可见"}发布申请`
          : `已驳回《${target.title}》，原因：${rejectReason || "不符合上线规范"}`,
    });

    // 发送系统通知给作者
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: status === "approved" ? "数据集审核通过通知" : "数据集审核驳回通知",
        message:
          status === "approved"
            ? `您提交的数据集《${target.title}》已通过管理员审核，现已正式对${target.visibility === "public" ? "全平台公开" : "全校用户"}开放！`
            : `您提交的数据集《${target.title}》审核未通过。驳回原因：${rejectReason || "内容不符合规范"}。您可修改后重新提交。`,
        time: "刚刚",
        read: false,
        type: status === "approved" ? "version_update" : "quota_alert",
      },
      ...prev,
    ]);

    return {
      success: true,
      message:
        status === "approved"
          ? `已通过数据集《${target.title}》的发布审核！`
          : `已驳回数据集《${target.title}》的审核申请`,
    };
  };

  // 批量审核
  const batchAuditDatasets = (
    datasetIds: string[],
    status: "approved" | "rejected",
    rejectReason?: string
  ) => {
    const nowStr = new Date().toLocaleString();
    const auditorName = `${currentUser.name} (${currentUser.roleName})`;

    setDatasets((prev) =>
      prev.map((d) => {
        if (datasetIds.includes(d.id)) {
          return {
            ...d,
            auditStatus: status,
            auditReason: status === "rejected" ? rejectReason || "批量驳回" : undefined,
            auditTime: nowStr,
            auditor: auditorName,
          };
        }
        return d;
      })
    );

    // 审计日志
    addAuditLog({
      operator: auditorName,
      action: status === "approved" ? "批量审核通过" : "批量驳回申请",
      target: `${datasetIds.length} 个数据集`,
      details:
        status === "approved"
          ? `批量通过了 ${datasetIds.length} 个数据集的发布审核`
          : `批量驳回了 ${datasetIds.length} 个数据集，原因：${rejectReason || "批量驳回"}`,
    });

    return {
      success: true,
      count: datasetIds.length,
      message: `已成功批量${status === "approved" ? "审核通过" : "驳回"} ${datasetIds.length} 个数据集！`,
    };
  };

  // 重新提交审核 (作者在驳回或修改后重新提交)
  const resubmitForAudit = (datasetId: string) => {
    const target = datasets.find((d) => d.id === datasetId);
    if (!target) return { success: false, message: "数据集不存在" };

    const nowStr = new Date().toLocaleString();
    setDatasets((prev) =>
      prev.map((d) => {
        if (d.id === datasetId) {
          return {
            ...d,
            auditStatus: "pending",
            submitTime: nowStr,
            auditReason: undefined,
          };
        }
        return d;
      })
    );

    addAuditLog({
      operator: `${currentUser.name} (${currentUser.roleName})`,
      action: "重新提交审核",
      target: target.title,
      details: `重新提交了《${target.title}》的公开审核申请`,
    });

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "数据集已重新提交审核",
        message: `《${target.title}》已重新提交管理员审核，请耐心等待审批。`,
        time: "刚刚",
        read: false,
        type: "version_update",
      },
      ...prev,
    ]);

    return {
      success: true,
      message: `《${target.title}》已重新提交审核，请耐心等待管理员审批！`,
    };
  };

  const deleteDataset = (id: string) => {
    const target = datasets.find((d) => d.id === id);
    if (!target) return { success: false, hasReferences: false, referencedCount: 0, message: "数据集不存在" };

    const refCount = target.associatedCourses ? target.associatedCourses.length : 0;
    setDatasets((prev) => prev.filter((d) => d.id !== id));
    return {
      success: true,
      hasReferences: refCount > 0,
      referencedCount: refCount,
      message: `已成功删除数据集《${target.title}》`,
    };
  };

  const uploadNewVersion = (
    id: string,
    newVerData: { changelog: string; fileSize?: string; sizeBytes?: number; fileName?: string }
  ) => {
    const target = datasets.find((d) => d.id === id);
    if (!target) return { success: false, message: "数据集不存在" };

    // 计算下一个版本号，例如从 V1.0 / V2.0 -> V(N+1).0
    const currentNum = parseInt(target.version.replace(/[^0-9]/g, "") || "1", 10);
    const nextVerStr = `V${currentNum + 1}.0`;
    const newSize = newVerData.fileSize || target.fileSize || "25.0 MB";
    const newSizeBytes = newVerData.sizeBytes || target.sizeBytes || 26214400;

    const newVersionObj = {
      version: nextVerStr,
      updatedAt: new Date().toLocaleString(),
      author: `${currentUser.name} (${currentUser.roleName})`,
      size: newSize,
      sizeBytes: newSizeBytes,
      changelog: newVerData.changelog || "常规版本迭代更新",
    };

    setDatasets((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return {
            ...d,
            version: nextVerStr,
            fileSize: newSize,
            sizeBytes: newSizeBytes,
            updatedAt: new Date().toISOString().split("T")[0],
            versionsList: [newVersionObj, ...(d.versionsList || [])],
          };
        }
        return d;
      })
    );

    // 添加系统通知
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "数据集新版本发布",
        message: `《${target.title}》已成功发布 ${nextVerStr} 版本：${newVerData.changelog || "更新了数据集文件"}。`,
        time: "刚刚",
        read: false,
        type: "version_update",
      },
      ...prev,
    ]);

    return { success: true, message: `新版本 ${nextVerStr} 发布成功！` };
  };

  const rollbackVersion = (datasetId: string, targetVersion: string) => {
    setDatasets((prev) =>
      prev.map((d) => {
        if (d.id === datasetId) {
          const vObj = d.versionsList.find((v) => v.version === targetVersion);
          return {
            ...d,
            version: targetVersion,
            fileSize: vObj ? vObj.size : d.fileSize,
            sizeBytes: vObj ? vObj.sizeBytes : d.sizeBytes,
          };
        }
        return d;
      })
    );
  };

  const deleteVersion = (datasetId: string, targetVersion: string) => {
    const target = datasets.find((d) => d.id === datasetId);
    if (!target) return { success: false, message: "数据集不存在" };
    if (target.version === targetVersion) {
      return { success: false, message: "当前生效版本不可删除，请先切换至其他版本！" };
    }
    if ((target.versionsList || []).length <= 1) {
      return { success: false, message: "至少需保留一个版本记录！" };
    }

    setDatasets((prev) =>
      prev.map((d) => {
        if (d.id === datasetId) {
          return {
            ...d,
            versionsList: d.versionsList.filter((v) => v.version !== targetVersion),
          };
        }
        return d;
      })
    );

    return { success: true, message: `已成功删除历史版本 ${targetVersion}` };
  };

  const batchDeleteDatasets = (ids: string[]) => {
    setDatasets((prev) => prev.filter((d) => !ids.includes(d.id)));
    return { success: true, count: ids.length, message: `已批量删除 ${ids.length} 个数据集` };
  };

  const batchUpdateVisibility = (ids: string[], visibility: "public" | "school" | "private") => {
    setDatasets((prev) =>
      prev.map((d) => (ids.includes(d.id) ? { ...d, visibility } : d))
    );
    const visText = visibility === "public" ? "公开" : visibility === "school" ? "校内共享" : "个人私有";
    return { success: true, count: ids.length, message: `已将选中的 ${ids.length} 个数据集修改为【${visText}】` };
  };

  const batchUpdatePermission = (ids: string[], permission: "download_and_mount" | "mount_only") => {
    setDatasets((prev) =>
      prev.map((d) => (ids.includes(d.id) ? { ...d, permission } : d))
    );
    const permText = permission === "download_and_mount" ? "允许下载与挂载" : "仅允许挂载读取";
    return { success: true, count: ids.length, message: `已将选中的 ${ids.length} 个数据集权限修改为【${permText}】` };
  };

  const batchMountDatasets = (ids: string[], mount: boolean) => {
    setDatasets((prev) =>
      prev.map((d) => (ids.includes(d.id) ? { ...d, isMounted: mount } : d))
    );
    return { success: true, message: `已批量${mount ? "挂载" : "卸载"} ${ids.length} 个数据集` };
  };

  const batchFavoriteDatasets = (ids: string[], fav: boolean) => {
    setDatasets((prev) =>
      prev.map((d) => (ids.includes(d.id) ? { ...d, isFavorite: fav } : d))
    );
    return { success: true, message: `已批量${fav ? "收藏" : "取消收藏"} ${ids.length} 个数据集` };
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // 写入审计操作日志
  const addAuditLog = (
    log: Partial<AuditLogItem> & { operator: string; action: string; target: string; details: string }
  ) => {
    if (!systemConfig.enableAuditLogs) return;
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-"),
      operator: log.operator,
      operatorRole: log.operatorRole || currentUser.roleName || "系统用户",
      operatorOrg: log.operatorOrg || currentUser.org || "智能计算与大数据教学实验示范中心",
      action: log.action,
      category: log.category || "dataset",
      target: log.target,
      targetId: log.targetId,
      status: log.status || "success",
      ip: log.ip || "192.168.1.120 (内网审计网关)",
      details: log.details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
  };

  // 2.1 标签管理方法
  const addTag = (category: "techDomain" | "theme", name: string, description?: string) => {
    const trimmed = name.trim();
    if (!trimmed) return { success: false, message: "标签名称不能为空" };
    const exists = tagItems.some(
      (t) => t.category === category && t.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) return { success: false, message: `该${category === "techDomain" ? "任务类型" : "应用领域"}标签已存在！` };

    const newTag: TagItem = {
      id: `tag-${category === "techDomain" ? "td" : "th"}-${Date.now()}`,
      name: trimmed,
      category,
      enabled: true,
      isPreset: false,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      datasetCount: 0,
      description: description || "管理员自定义新增标签",
    };

    setTagItems((prev) => [...prev, newTag]);
    addAuditLog({
      operator: `${currentUser.name} (${currentUser.roleName})`,
      operatorRole: currentUser.roleName,
      operatorOrg: currentUser.org,
      action: "新增标签",
      category: "tag",
      target: `${category === "techDomain" ? "任务类型" : "应用领域"}: ${trimmed}`,
      targetId: newTag.id,
      status: "success",
      ip: "192.168.1.108",
      details: `成功在${category === "techDomain" ? "任务类型" : "应用领域"}中创建标签【${trimmed}】`,
    });

    return { success: true, message: `已成功创建新标签【${trimmed}】` };
  };

  const editTag = (id: string, name: string, description?: string) => {
    const trimmed = name.trim();
    if (!trimmed) return { success: false, message: "标签名称不能为空" };
    const target = tagItems.find((t) => t.id === id);
    if (!target) return { success: false, message: "目标标签不存在" };

    const oldName = target.name;
    setTagItems((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              name: trimmed,
              description: description !== undefined ? description : t.description,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : t
      )
    );

    addAuditLog({
      operator: `${currentUser.name} (${currentUser.roleName})`,
      operatorRole: currentUser.roleName,
      operatorOrg: currentUser.org,
      action: "编辑标签",
      category: "tag",
      target: `${target.category === "techDomain" ? "任务类型" : "应用领域"}: ${oldName} -> ${trimmed}`,
      targetId: id,
      status: "success",
      ip: "192.168.1.108",
      details: `将标签【${oldName}】更名为【${trimmed}】${description ? `，更新说明: ${description}` : ""}`,
    });

    return { success: true, message: `已成功更新标签【${trimmed}】` };
  };

  const toggleTagStatus = (id: string) => {
    const target = tagItems.find((t) => t.id === id);
    if (!target) return { success: false, message: "目标标签不存在" };

    const nextState = !target.enabled;
    setTagItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: nextState } : t))
    );

    addAuditLog({
      operator: `${currentUser.name} (${currentUser.roleName})`,
      operatorRole: currentUser.roleName,
      operatorOrg: currentUser.org,
      action: nextState ? "启用标签" : "禁用标签",
      category: "tag",
      target: `${target.category === "techDomain" ? "任务类型" : "应用领域"}: ${target.name}`,
      targetId: id,
      status: "success",
      ip: "192.168.1.108",
      details: `将标签【${target.name}】状态切换为【${nextState ? "启用" : "禁用"}】`,
    });

    return { success: true, message: `已将标签【${target.name}】${nextState ? "启用" : "禁用"}` };
  };

  const deleteTag = (id: string) => {
    const target = tagItems.find((t) => t.id === id);
    if (!target) return { success: false, message: "目标标签不存在" };

    setTagItems((prev) => prev.filter((t) => t.id !== id));

    addAuditLog({
      operator: `${currentUser.name} (${currentUser.roleName})`,
      operatorRole: currentUser.roleName,
      operatorOrg: currentUser.org,
      action: "删除标签",
      category: "tag",
      target: `${target.category === "techDomain" ? "任务类型" : "应用领域"}: ${target.name}`,
      targetId: id,
      status: "success",
      ip: "192.168.1.108",
      details: `已彻底删除标签【${target.name}】`,
    });

    return { success: true, message: `已成功删除标签【${target.name}】` };
  };

  const batchToggleTags = (ids: string[], enabled: boolean) => {
    setTagItems((prev) =>
      prev.map((t) => (ids.includes(t.id) ? { ...t, enabled } : t))
    );

    addAuditLog({
      operator: `${currentUser.name} (${currentUser.roleName})`,
      operatorRole: currentUser.roleName,
      operatorOrg: currentUser.org,
      action: enabled ? "批量启用标签" : "批量禁用标签",
      category: "tag",
      target: `${ids.length} 个标签项`,
      status: "success",
      ip: "192.168.1.108",
      details: `批量将 ${ids.length} 个标签状态设置为【${enabled ? "启用" : "禁用"}】`,
    });

    return { success: true, message: `已批量${enabled ? "启用" : "禁用"}选中的 ${ids.length} 个标签` };
  };

  const batchDeleteTags = (ids: string[]) => {
    setTagItems((prev) => prev.filter((t) => !ids.includes(t.id)));

    addAuditLog({
      operator: `${currentUser.name} (${currentUser.roleName})`,
      operatorRole: currentUser.roleName,
      operatorOrg: currentUser.org,
      action: "批量删除标签",
      category: "tag",
      target: `${ids.length} 个标签项`,
      status: "success",
      ip: "192.168.1.108",
      details: `批量删除了 ${ids.length} 个标签`,
    });

    return { success: true, message: `已批量删除选中的 ${ids.length} 个标签` };
  };

  // 2.2 存储配额调整
  const updateUserQuota = (userId: string, newTotalGB: number) => {
    const target = userQuotas.find((u) => u.userId === userId);
    if (!target) return { success: false, message: "目标用户不存在" };
    if (newTotalGB <= 0) return { success: false, message: "配额必须大于0" };

    const oldTotal = target.totalGB;
    const nextStatus: "normal" | "warning" =
      target.usedGB / newTotalGB >= 0.85
        ? "warning"
        : "normal";

    setUserQuotas((prev) =>
      prev.map((u) =>
        u.userId === userId ? { ...u, totalGB: newTotalGB, status: nextStatus } : u
      )
    );

    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, storageTotalGB: newTotalGB }));
    }

    addAuditLog({
      operator: `${currentUser.name} (${currentUser.roleName})`,
      operatorRole: currentUser.roleName,
      operatorOrg: currentUser.org,
      action: "调整用户配额",
      category: "quota",
      target: `${target.userName} (${target.roleName})`,
      targetId: userId,
      status: "success",
      ip: "192.168.1.108",
      details: `将用户【${target.userName}】个人存储配额从 ${oldTotal}GB 调整为 ${newTotalGB}GB`,
    });

    return { success: true, message: `已将【${target.userName}】存储配额调整为 ${newTotalGB}GB` };
  };

  const batchAdjustQuotas = (userIds: string[], percentDelta?: number, setExactGB?: number) => {
    setUserQuotas((prev) =>
      prev.map((u) => {
        if (!userIds.includes(u.userId)) return u;
        let newTotal = u.totalGB;
        if (setExactGB !== undefined && setExactGB > 0) {
          newTotal = setExactGB;
        } else if (percentDelta !== undefined) {
          newTotal = Math.max(1, Math.round(u.totalGB * (1 + percentDelta / 100)));
        }
        const nextStatus =
          u.usedGB / newTotal >= 0.85 ? "warning" : "normal";
        return { ...u, totalGB: newTotal, status: nextStatus };
      })
    );

    addAuditLog({
      operator: `${currentUser.name} (${currentUser.roleName})`,
      operatorRole: currentUser.roleName,
      operatorOrg: currentUser.org,
      action: "批量调整配额",
      category: "quota",
      target: `${userIds.length} 位用户`,
      status: "success",
      ip: "192.168.1.108",
      details: `对 ${userIds.length} 位用户执行批量配额变更 (${setExactGB ? `设为 ${setExactGB}GB` : `浮动 ${percentDelta}%`})`,
    });

    return { success: true, message: `已批量调整选中的 ${userIds.length} 位用户存储配额` };
  };

  // 2.3 & 2.4 & 2.6 & 2.7 全局配置更新
  const updateSystemConfig = (updates: Partial<DatasetSystemConfig>) => {
    setSystemConfig((prev) => ({ ...prev, ...updates }));

    addAuditLog({
      operator: `${currentUser.name} (${currentUser.roleName})`,
      operatorRole: currentUser.roleName,
      operatorOrg: currentUser.org,
      action: "更新全局配置",
      category: "config",
      target: "数据集系统管理配置",
      status: "success",
      ip: "192.168.1.108",
      details: `更新配置项: ${Object.keys(updates).join(", ")}`,
    });

    return { success: true, message: "系统配置已成功保存并即时生效！" };
  };

  // 2.4 白名单管理
  const addAllowedExtension = (ext: string) => {
    let cleanExt = ext.trim().toLowerCase();
    if (!cleanExt.startsWith(".")) cleanExt = `.${cleanExt}`;
    if (cleanExt.length < 2) return { success: false, message: "扩展名格式不合法" };
    if (systemConfig.allowedExtensions.includes(cleanExt)) {
      return { success: false, message: `扩展名 ${cleanExt} 已在白名单中` };
    }

    const nextList = [...systemConfig.allowedExtensions, cleanExt];
    setSystemConfig((prev) => ({ ...prev, allowedExtensions: nextList }));

    addAuditLog({
      operator: `${currentUser.name} (${currentUser.roleName})`,
      operatorRole: currentUser.roleName,
      operatorOrg: currentUser.org,
      action: "新增白名单扩展名",
      category: "config",
      target: cleanExt,
      status: "success",
      ip: "192.168.1.108",
      details: `将扩展名【${cleanExt}】纳入合法上传白名单`,
    });

    return { success: true, message: `已添加扩展名【${cleanExt}】至白名单` };
  };

  const removeAllowedExtension = (ext: string) => {
    if (systemConfig.allowedExtensions.length <= 1) {
      return { success: false, message: "至少需保留一个合法扩展名！" };
    }
    const nextList = systemConfig.allowedExtensions.filter((e) => e !== ext);
    setSystemConfig((prev) => ({ ...prev, allowedExtensions: nextList }));

    addAuditLog({
      operator: `${currentUser.name} (${currentUser.roleName})`,
      operatorRole: currentUser.roleName,
      operatorOrg: currentUser.org,
      action: "移除白名单扩展名",
      category: "config",
      target: ext,
      status: "success",
      ip: "192.168.1.108",
      details: `从白名单中移除了扩展名【${ext}】`,
    });

    return { success: true, message: `已从白名单中移除扩展名【${ext}】` };
  };

  const resetAllowedExtensions = () => {
    const defaultList = [".csv", ".xls", ".xlsx", ".json", ".parquet", ".txt", ".jpg", ".png", ".zip"];
    setSystemConfig((prev) => ({ ...prev, allowedExtensions: defaultList }));

    addAuditLog({
      operator: `${currentUser.name} (${currentUser.roleName})`,
      operatorRole: currentUser.roleName,
      operatorOrg: currentUser.org,
      action: "重置白名单扩展名",
      category: "config",
      target: "默认白名单",
      status: "success",
      ip: "192.168.1.108",
      details: `将上传扩展名白名单恢复至系统初始预设列表`,
    });

    return { success: true, message: "已恢复默认扩展名白名单！" };
  };

  return (
    <DataContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        allUsers: USER_PERSONAS,
        datasets,
        mountedDatasets,
        toggleMount,
        toggleFavorite,
        addDataset,
        updateDataset,
        deleteDataset,
        uploadNewVersion,
        rollbackVersion,
        deleteVersion,
        batchDeleteDatasets,
        batchUpdateVisibility,
        batchUpdatePermission,
        batchMountDatasets,
        batchFavoriteDatasets,
        storageInfo,
        notifications,
        markNotificationRead,
        activeLabId,
        setActiveLabId,
        selectedDatasetId,
        setSelectedDatasetId,

        // 后台数据集管理
        tagItems,
        activeTechDomains,
        activeThemes,
        systemConfig,
        userQuotas,
        auditLogs,
        pendingAuditCount: datasets.filter((d) => d.auditStatus === "pending").length,
        auditDataset,
        batchAuditDatasets,
        resubmitForAudit,
        addTag,
        editTag,
        toggleTagStatus,
        deleteTag,
        batchToggleTags,
        batchDeleteTags,
        updateSystemConfig,
        updateUserQuota,
        batchAdjustQuotas,
        addAllowedExtension,
        removeAllowedExtension,
        resetAllowedExtensions,
        addAuditLog,
        clearAuditLogs,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
