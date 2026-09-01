import React, { useState, useMemo } from "react";
import {
  Tags,
  HardDrive,
  ShieldCheck,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Info,
  SlidersHorizontal,
  RotateCcw,
  Database,
  Users,
  Settings2,
  AlertTriangle,
  Lock,
  FileSpreadsheet,
  X,
  Save,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "../../context/DataContext";
import { TagItem, UserQuotaItem } from "../../data/mockData";

interface DatasetConfigManagementProps {
  activeSubView?: "tags" | "quotas" | "permissions" | "formats" | "validation";
  showTopTabs?: boolean;
  onSubViewChange?: (view: "tags" | "quotas" | "permissions" | "formats" | "validation") => void;
  onNavigate?: (view: string) => void;
}

export default function DatasetConfigManagement({
  activeSubView,
  showTopTabs = false,
  onSubViewChange,
  onNavigate,
}: DatasetConfigManagementProps = {}) {
  const {
    tagItems,
    systemConfig,
    userQuotas,
    addTag,
    editTag,
    deleteTag,
    batchDeleteTags,
    updateSystemConfig,
    updateUserQuota,
    batchAdjustQuotas,
    addAllowedExtension,
    removeAllowedExtension,
    resetAllowedExtensions,
  } = useData();

  // 当前激活的子 Tab（支持外部受控或内部状态）
  const [internalActiveTab, setInternalActiveTab] = useState<
    "tags" | "quotas" | "permissions" | "formats" | "validation"
  >("tags");

  const activeTab = activeSubView || internalActiveTab;
  const setActiveTab = (tab: "tags" | "quotas" | "permissions" | "formats" | "validation") => {
    setInternalActiveTab(tab);
    if (onSubViewChange) {
      onSubViewChange(tab);
    }
  };

  // 提示信息 Toast
  const [toastMsg, setToastMsg] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMsg({ text, type });
    setTimeout(() => {
      setToastMsg((prev) => (prev?.text === text ? null : prev));
    }, 3000);
  };

  // ==========================================
  // 1. 业务类型标签管理 (Tag Management) 状态与操作
  // ==========================================
  const [tagSearchText, setTagSearchText] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // 标签弹窗状态
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);
  const [tagFormName, setTagFormName] = useState("");
  const [tagFormDesc, setTagFormDesc] = useState("");

  const filteredTags = useMemo(() => {
    return tagItems.filter((t) => {
      const matchSearch =
        !tagSearchText ||
        t.name.toLowerCase().includes(tagSearchText.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(tagSearchText.toLowerCase()));
      return matchSearch;
    });
  }, [tagItems, tagSearchText]);

  const handleOpenAddTag = () => {
    setEditingTag(null);
    setTagFormName("");
    setTagFormDesc("");
    setIsTagModalOpen(true);
  };

  const handleOpenEditTag = (tag: TagItem) => {
    setEditingTag(tag);
    setTagFormName(tag.name);
    setTagFormDesc(tag.description || "");
    setIsTagModalOpen(true);
  };

  const handleSaveTag = () => {
    if (!tagFormName.trim()) {
      showToast("业务类型标签名称不能为空", "error");
      return;
    }
    if (editingTag) {
      const res = editTag(editingTag.id, tagFormName.trim(), tagFormDesc.trim());
      if (res.success) {
        showToast(res.message, "success");
        setIsTagModalOpen(false);
      } else {
        showToast(res.message, "error");
      }
    } else {
      const res = addTag("techDomain", tagFormName.trim(), tagFormDesc.trim());
      if (res.success) {
        showToast(res.message, "success");
        setIsTagModalOpen(false);
      } else {
        showToast(res.message, "error");
      }
    }
  };

  // ==========================================
  // 2. 存储配额管理 (Storage Quota) 状态与操作
  // ==========================================
  const [quotaSearchText, setQuotaSearchText] = useState("");
  const [quotaRoleFilter, setQuotaRoleFilter] = useState<string>("all");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // 调整单个配额弹窗
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);
  const [targetQuotaUser, setTargetQuotaUser] = useState<UserQuotaItem | null>(null);
  const [quotaInputGB, setQuotaInputGB] = useState<number>(20);

  // 批量调整弹窗
  const [isBatchQuotaModalOpen, setIsBatchQuotaModalOpen] = useState(false);
  const [batchPercentDelta, setBatchPercentDelta] = useState<number>(50);
  const [batchExactGB, setBatchExactGB] = useState<string>("");

  const filteredUsers = useMemo(() => {
    return userQuotas.filter((u) => {
      const matchSearch =
        !quotaSearchText ||
        u.userName.toLowerCase().includes(quotaSearchText.toLowerCase()) ||
        u.org.toLowerCase().includes(quotaSearchText.toLowerCase()) ||
        (u.phone && u.phone.includes(quotaSearchText));
      
      let matchRole = true;
      if (quotaRoleFilter === "warning") {
        matchRole = u.status === "warning" || (u.usedGB / u.totalGB) >= 0.85;
      } else if (quotaRoleFilter !== "all") {
        matchRole = u.role === quotaRoleFilter;
      }
      return matchSearch && matchRole;
    });
  }, [userQuotas, quotaSearchText, quotaRoleFilter]);

  const totalPoolGB = userQuotas.reduce((acc, u) => acc + u.totalGB, 0);
  const totalUsedGB = Number(userQuotas.reduce((acc, u) => acc + u.usedGB, 0).toFixed(1));
  const poolUsageRate = totalPoolGB > 0 ? Math.round((totalUsedGB / totalPoolGB) * 100) : 0;
  const warningCount = userQuotas.filter((u) => u.status === "warning" || (u.usedGB / u.totalGB) >= 0.85).length;

  const handleOpenAdjustQuota = (u: UserQuotaItem) => {
    setTargetQuotaUser(u);
    setQuotaInputGB(u.totalGB);
    setIsQuotaModalOpen(true);
  };

  const handleSaveQuota = () => {
    if (!targetQuotaUser) return;
    if (quotaInputGB <= 0) {
      showToast("配额大小必须大于 0 GB", "error");
      return;
    }
    const res = updateUserQuota(targetQuotaUser.userId, Number(quotaInputGB));
    if (res.success) {
      showToast(res.message, "success");
      setIsQuotaModalOpen(false);
    } else {
      showToast(res.message, "error");
    }
  };

  const handleSaveBatchQuota = () => {
    if (selectedUserIds.length === 0) {
      showToast("请先勾选需要调整配额的用户", "error");
      return;
    }
    let res;
    if (batchExactGB && Number(batchExactGB) > 0) {
      res = batchAdjustQuotas(selectedUserIds, undefined, Number(batchExactGB));
    } else {
      res = batchAdjustQuotas(selectedUserIds, batchPercentDelta, undefined);
    }
    if (res.success) {
      showToast(res.message, "success");
      setIsBatchQuotaModalOpen(false);
      setSelectedUserIds([]);
    } else {
      showToast(res.message, "error");
    }
  };

  // ==========================================
  // 3. 访问权限与文件限制状态
  // ==========================================
  const [newExtInput, setNewExtInput] = useState("");
  const [tempMaxDatasetSizeGB, setTempMaxDatasetSizeGB] = useState(systemConfig.maxDatasetSizeGB);

  const handleAddExtension = () => {
    if (!newExtInput.trim()) return;
    const res = addAllowedExtension(newExtInput.trim());
    if (res.success) {
      showToast(res.message, "success");
      setNewExtInput("");
    } else {
      showToast(res.message, "error");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden relative">
      {/* 顶部 Toast 提示 */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm flex items-center space-x-2 font-medium border ${
              toastMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : toastMsg.type === "error"
                ? "bg-rose-50 text-rose-800 border-rose-200"
                : "bg-blue-50 text-blue-800 border-blue-200"
            }`}
          >
            {toastMsg.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {toastMsg.type === "error" && <AlertTriangle className="w-4 h-4 text-rose-600" />}
            {toastMsg.type === "info" && <Info className="w-4 h-4 text-blue-600" />}
            <span>{toastMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 顶部 Header & 模块标题 */}
      <div className="px-6 py-4 border-b border-slate-200 shrink-0 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              {activeTab === "tags" && <Tags className="w-4 h-4" />}
              {activeTab === "quotas" && <HardDrive className="w-4 h-4" />}
              {activeTab === "permissions" && <Lock className="w-4 h-4" />}
              {activeTab === "formats" && <FileSpreadsheet className="w-4 h-4" />}
              {activeTab === "validation" && <ShieldCheck className="w-4 h-4" />}
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {activeTab === "tags" && "标签管理"}
                {activeTab === "quotas" && "存储配额管理"}
                {activeTab === "permissions" && "权限管理"}
                {activeTab === "formats" && "格式限制"}
                {activeTab === "validation" && "关联校验配置"}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeTab === "tags" && "维护数据大厅业务类型标签体系，统一管理标签状态与说明"}
                {activeTab === "quotas" && "监控教师、学生与管理员存储容量，支持个性化配额调整与批量扩缩容"}
                {activeTab === "permissions" && "设定新建公开数据集默认读取与下载权限策略"}
                {activeTab === "formats" && "配置文件上传扩展名白名单与单个数据集文件大小上限"}
                {activeTab === "validation" && "配置删除数据集时的业务引用强校验策略与删除执行模式"}
              </p>
            </div>
          </div>

          {/* 右侧全局状态徽章 */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-600 flex items-center">
              <HardDrive className="w-3.5 h-3.5 text-blue-500 mr-1.5" />
              存储池已用: <span className="font-semibold text-slate-800 ml-1">{totalUsedGB} GB</span> / {totalPoolGB} GB
            </div>
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-600 flex items-center">
              <Tags className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
              生效业务类型: <span className="font-semibold text-slate-800 ml-1">{tagItems.filter((t) => t.enabled).length}</span> 个
            </div>
          </div>
        </div>

        {/* 顶部横向 Tab (若启用) */}
        {showTopTabs && (
          <div className="flex items-center space-x-8 text-sm mt-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => setActiveTab("tags")}
              className={`pb-2.5 font-medium flex items-center space-x-2 relative transition-colors ${
                activeTab === "tags"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Tags className="w-4 h-4" />
              <span>标签管理</span>
              <span className="ml-1 text-xs px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-full font-normal">
                {tagItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("quotas")}
              className={`pb-2.5 font-medium flex items-center space-x-2 relative transition-colors ${
                activeTab === "quotas"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>存储配额管理</span>
              <span className="ml-1 text-xs px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-full font-normal">
                {userQuotas.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("permissions")}
              className={`pb-2.5 font-medium flex items-center space-x-2 relative transition-colors ${
                activeTab === "permissions"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>权限管理</span>
            </button>

            <button
              onClick={() => setActiveTab("formats")}
              className={`pb-2.5 font-medium flex items-center space-x-2 relative transition-colors ${
                activeTab === "formats"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>格式限制</span>
            </button>

            <button
              onClick={() => setActiveTab("validation")}
              className={`pb-2.5 font-medium flex items-center space-x-2 relative transition-colors ${
                activeTab === "validation"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>关联校验配置</span>
            </button>
          </div>
        )}
      </div>

      {/* 主面板内容区 */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/20">
        {/* ========================================================================= */}
        {/* TAB 1: 标签管理 (Tag Management - 业务类型标签)                              */}
        {/* ========================================================================= */}
        {activeTab === "tags" && (
          <div className="space-y-6">
            {/* 顶栏卡片 */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Tags className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>业务类型标签管理</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-normal">
                      共 {tagItems.length} 个业务类型
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    与数据大厅业务类型分类保持严格一致，全站均为系统预置业务应用场景标签。
                  </div>
                </div>
              </div>
            </div>

            {/* 过滤器与操作栏 */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  {/* 搜索框 */}
                  <div className="relative w-72">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="搜索业务类型标签名称或说明..."
                      value={tagSearchText}
                      onChange={(e) => setTagSearchText(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* 右侧新增与批量操作 */}
                <div className="flex items-center space-x-2">
                  {selectedTagIds.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm(`确定要批量删除选中的 ${selectedTagIds.length} 个业务类型标签吗？`)) {
                          const res = batchDeleteTags(selectedTagIds);
                          showToast(res.message);
                          setSelectedTagIds([]);
                        }
                      }}
                      className="px-2.5 py-1.5 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded font-medium transition-colors"
                    >
                      批量删除 ({selectedTagIds.length})
                    </button>
                  )}

                  <button
                    onClick={handleOpenAddTag}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded flex items-center space-x-1.5 shadow-2xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增业务类型</span>
                  </button>
                </div>
              </div>

              {/* 标签表格 */}
              <div className="overflow-x-auto border border-slate-200 rounded-md">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                      <th className="p-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            filteredTags.length > 0 &&
                            selectedTagIds.length === filteredTags.length
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTagIds(filteredTags.map((t) => t.id));
                            } else {
                              setSelectedTagIds([]);
                            }
                          }}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="p-3 font-semibold text-slate-700">业务类型名称</th>
                      <th className="p-3 font-semibold text-slate-700">关联数据集数</th>
                      <th className="p-3 font-semibold text-slate-700">说明与应用指引</th>
                      <th className="p-3 text-right font-semibold text-slate-700">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredTags.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                          暂无符合条件的业务类型标签，请调整筛选或新增
                        </td>
                      </tr>
                    ) : (
                      filteredTags.map((tag) => {
                        const isSelected = selectedTagIds.includes(tag.id);
                        return (
                          <tr
                            key={tag.id}
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isSelected ? "bg-blue-50/40" : ""
                            }`}
                          >
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedTagIds((prev) => [...prev, tag.id]);
                                  } else {
                                    setSelectedTagIds((prev) =>
                                      prev.filter((id) => id !== tag.id)
                                    );
                                  }
                                }}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="p-3">
                              <div className="font-semibold text-slate-800 flex items-center">
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 font-medium">
                                  {tag.name}
                                </span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="text-slate-600 font-mono">
                                {tag.datasetCount || 0} 个
                              </span>
                            </td>
                            <td className="p-3 max-w-md truncate text-slate-500 text-[11px]">
                              {tag.description || "暂无说明描述"}
                            </td>
                            <td className="p-3 text-right">
                              <div className="inline-flex items-center space-x-2">
                                <button
                                  onClick={() => handleOpenEditTag(tag)}
                                  className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                                  title="编辑标签"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`确定删除业务类型标签【${tag.name}】吗？`)) {
                                      const res = deleteTag(tag.id);
                                      showToast(res.message);
                                    }
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded transition-colors"
                                  title="删除标签"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 存储配额管理 (Storage Quota)                                          */}
        {/* ========================================================================= */}
        {activeTab === "quotas" && (
          <div className="space-y-6">
            {/* 顶栏 4 个统计数据卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span>总配额池容量</span>
                  <Database className="w-4 h-4 text-blue-500" />
                </div>
                <div className="mt-2 text-xl font-bold text-slate-800">
                  {totalPoolGB}{" "}
                  <span className="text-xs font-normal text-slate-500">GB</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  当前平台 {userQuotas.length} 位分配用户的配额总和
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span>总已用存储容量</span>
                  <HardDrive className="w-4 h-4 text-purple-500" />
                </div>
                <div className="mt-2 text-xl font-bold text-slate-800">
                  {totalUsedGB}{" "}
                  <span className="text-xs font-normal text-slate-500">GB</span>
                </div>
                <div className="mt-1 text-[11px] text-emerald-600">
                  全局使用率: {poolUsageRate}%
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span>支持身份角色类别</span>
                  <Users className="w-4 h-4 text-slate-500" />
                </div>
                <div className="mt-2 text-xl font-bold text-slate-800 flex items-center space-x-1.5">
                  <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 font-medium">教师</span>
                  <span className="text-xs px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 font-medium">学生</span>
                  <span className="text-xs px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-100 font-medium">管理员</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400">平台严格遵循三类身份角色配额标准</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span>配额预警用户</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="mt-2 text-xl font-bold text-amber-600">
                  {warningCount}{" "}
                  <span className="text-xs font-normal text-slate-500">人需关注</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400">使用率达到或超过 85%</div>
              </div>
            </div>

            {/* 角色默认配额基准配置卡片 */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Settings2 className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-slate-800">各身份角色默认配额基准设定</span>
                  <span className="text-[11px] text-slate-400">（仅支持管理员、教师、学生三类角色）</span>
                </div>
                <span className="text-[11px] text-slate-500">新注册或分配对应角色的初始存储空间</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {/* 教师角色 */}
                <div className="p-3 bg-blue-50/40 rounded-lg border border-blue-100/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="text-xs font-bold text-slate-800">教师角色</span>
                      <span className="text-[10px] bg-blue-100/70 text-blue-700 px-1.5 py-0.2 rounded font-medium">
                        {userQuotas.filter((u) => u.role === "teacher").length} 人
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">默认存储基准: <strong className="text-slate-700">{systemConfig.defaultRoleQuotas?.teacher || 50} GB</strong></div>
                  </div>
                  <button
                    onClick={() => {
                      const newQuota = prompt("请输入教师角色的默认存储配额上限 (GB):", String(systemConfig.defaultRoleQuotas?.teacher || 50));
                      if (newQuota && Number(newQuota) > 0) {
                        const val = Number(newQuota);
                        updateSystemConfig({
                          defaultRoleQuotas: {
                            ...(systemConfig.defaultRoleQuotas || { teacher: 50, student: 20, admin: 100 }),
                            teacher: val,
                          },
                        });
                        showToast(`已将教师默认存储配额更新为 ${val} GB`, "success");
                      }
                    }}
                    className="px-2.5 py-1 text-xs text-blue-600 hover:bg-blue-100/60 rounded border border-blue-200 transition-colors font-medium"
                  >
                    修改基准
                  </button>
                </div>

                {/* 学生角色 */}
                <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-100/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-bold text-slate-800">学生角色</span>
                      <span className="text-[10px] bg-emerald-100/70 text-emerald-700 px-1.5 py-0.2 rounded font-medium">
                        {userQuotas.filter((u) => u.role === "student").length} 人
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">默认存储基准: <strong className="text-slate-700">{systemConfig.defaultRoleQuotas?.student || 20} GB</strong></div>
                  </div>
                  <button
                    onClick={() => {
                      const newQuota = prompt("请输入学生角色的默认存储配额上限 (GB):", String(systemConfig.defaultRoleQuotas?.student || 20));
                      if (newQuota && Number(newQuota) > 0) {
                        const val = Number(newQuota);
                        updateSystemConfig({
                          defaultRoleQuotas: {
                            ...(systemConfig.defaultRoleQuotas || { teacher: 50, student: 20, admin: 100 }),
                            student: val,
                          },
                          defaultUserQuotaGB: val,
                        });
                        showToast(`已将学生默认存储配额更新为 ${val} GB`, "success");
                      }
                    }}
                    className="px-2.5 py-1 text-xs text-emerald-600 hover:bg-emerald-100/60 rounded border border-emerald-200 transition-colors font-medium"
                  >
                    修改基准
                  </button>
                </div>

                {/* 管理员角色 */}
                <div className="p-3 bg-purple-50/40 rounded-lg border border-purple-100/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span className="text-xs font-bold text-slate-800">管理员角色</span>
                      <span className="text-[10px] bg-purple-100/70 text-purple-700 px-1.5 py-0.2 rounded font-medium">
                        {userQuotas.filter((u) => u.role === "admin").length} 人
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">默认存储基准: <strong className="text-slate-700">{systemConfig.defaultRoleQuotas?.admin || 100} GB</strong></div>
                  </div>
                  <button
                    onClick={() => {
                      const newQuota = prompt("请输入管理员角色的默认存储配额上限 (GB):", String(systemConfig.defaultRoleQuotas?.admin || 100));
                      if (newQuota && Number(newQuota) > 0) {
                        const val = Number(newQuota);
                        updateSystemConfig({
                          defaultRoleQuotas: {
                            ...(systemConfig.defaultRoleQuotas || { teacher: 50, student: 20, admin: 100 }),
                            admin: val,
                          },
                        });
                        showToast(`已将管理员默认存储配额更新为 ${val} GB`, "success");
                      }
                    }}
                    className="px-2.5 py-1 text-xs text-purple-600 hover:bg-purple-100/60 rounded border border-purple-200 transition-colors font-medium"
                  >
                    修改基准
                  </button>
                </div>
              </div>
            </div>

            {/* 用户存储配额列表与操作 */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="搜索用户名、组织院系或手机号..."
                      value={quotaSearchText}
                      onChange={(e) => setQuotaSearchText(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-1 border border-slate-200 rounded p-0.5 bg-slate-50">
                    {[
                      { key: "all", label: "全部角色", count: userQuotas.length },
                      { key: "warning", label: "配额预警", count: warningCount },
                      { key: "teacher", label: "教师", count: userQuotas.filter((u) => u.role === "teacher").length },
                      { key: "student", label: "学生", count: userQuotas.filter((u) => u.role === "student").length },
                      { key: "admin", label: "管理员", count: userQuotas.filter((u) => u.role === "admin").length },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setQuotaRoleFilter(tab.key)}
                        className={`px-2.5 py-1 text-xs rounded transition-colors font-medium flex items-center space-x-1 ${
                          quotaRoleFilter === tab.key
                            ? "bg-white text-blue-600 shadow-2xs border border-slate-200/80"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          quotaRoleFilter === tab.key ? "bg-blue-50 text-blue-600" : "bg-slate-200/60 text-slate-500"
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {selectedUserIds.length > 0 && (
                    <button
                      onClick={() => setIsBatchQuotaModalOpen(true)}
                      className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded flex items-center space-x-1.5 transition-colors"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>批量调整配额 ({selectedUserIds.length})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 表格 */}
              <div className="overflow-x-auto border border-slate-200 rounded-md">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                      <th className="p-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            filteredUsers.length > 0 &&
                            selectedUserIds.length === filteredUsers.length
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUserIds(filteredUsers.map((u) => u.userId));
                            } else {
                              setSelectedUserIds([]);
                            }
                          }}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="p-3">用户姓名</th>
                      <th className="p-3">身份角色</th>
                      <th className="p-3">所属组织 / 院系</th>
                      <th className="p-3">数据集数</th>
                      <th className="p-3 w-64">存储占用 / 配额上限</th>
                      <th className="p-3 text-center">状态</th>
                      <th className="p-3 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400">
                          暂无匹配的用户配额记录
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const isSelected = selectedUserIds.includes(u.userId);
                        const rate = Math.round((u.usedGB / u.totalGB) * 100);
                        const isWarning = u.status === "warning" || rate >= 85;
                        return (
                          <tr
                            key={u.userId}
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isSelected ? "bg-blue-50/40" : ""
                            }`}
                          >
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedUserIds((prev) => [...prev, u.userId]);
                                  } else {
                                    setSelectedUserIds((prev) =>
                                      prev.filter((id) => id !== u.userId)
                                    );
                                  }
                                }}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="p-3">
                              <div className="font-semibold text-slate-800">{u.userName}</div>
                              <div className="text-[11px] text-slate-400">{u.phone || u.email || "-"}</div>
                            </td>
                            <td className="p-3">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                                  u.role === "teacher"
                                    ? "bg-blue-50 text-blue-700 border-blue-100"
                                    : u.role === "admin"
                                    ? "bg-purple-50 text-purple-700 border-purple-100"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-100"
                                }`}
                              >
                                {u.role === "admin" ? "管理员" : u.role === "teacher" ? "教师" : "学生"}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600">{u.org}</td>
                            <td className="p-3 font-mono">{u.datasetCount} 个</td>
                            <td className="p-3">
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-[11px] text-slate-600">
                                  <span>
                                    <strong className="text-slate-800">{u.usedGB}</strong> GB / {u.totalGB} GB
                                  </span>
                                  <span
                                    className={`font-semibold ${
                                      rate >= 85
                                        ? "text-amber-600"
                                        : "text-slate-600"
                                    }`}
                                  >
                                    {rate}%
                                  </span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      rate >= 85
                                        ? "bg-amber-500"
                                        : "bg-blue-500"
                                    }`}
                                    style={{ width: `${Math.min(100, rate)}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              {isWarning ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                  预警中
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  正常
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleOpenAdjustQuota(u)}
                                className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 hover:bg-blue-50 rounded transition-colors"
                              >
                                调整配额
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: 访问权限管理                                                        */}
        {/* ========================================================================= */}
        {activeTab === "permissions" && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <Lock className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-semibold text-slate-800">
                  公开数据集默认访问权限
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                用户上传公开数据集时所使用的默认下载与挂载权限策略。默认“仅允许挂载读取”更安全，防止数据被意外批量下载或泄露。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <label
                  onClick={() => {
                    updateSystemConfig({ defaultPublicPermission: "mount_only" });
                    showToast("已将公开数据集默认权限设为【仅允许挂载读取】", "success");
                  }}
                  className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    systemConfig.defaultPublicPermission === "mount_only"
                      ? "border-blue-600 bg-blue-50/30"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="permission_default"
                    checked={systemConfig.defaultPublicPermission === "mount_only"}
                    onChange={() => {}}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <div className="text-xs font-semibold text-slate-800 flex items-center">
                      仅允许挂载读取 (推荐，默认)
                      <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded">
                        高安全性
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      其他用户仅可将数据集只读挂载至 JupyterLab
                      容器中进行算法训练，无法直接下载原始文件。
                    </div>
                  </div>
                </label>

                <label
                  onClick={() => {
                    updateSystemConfig({ defaultPublicPermission: "download_and_mount" });
                    showToast("已将公开数据集默认权限设为【允许挂载与下载】", "info");
                  }}
                  className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    systemConfig.defaultPublicPermission === "download_and_mount"
                      ? "border-blue-600 bg-blue-50/30"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="permission_default"
                    checked={systemConfig.defaultPublicPermission === "download_and_mount"}
                    onChange={() => {}}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <div className="text-xs font-semibold text-slate-800">
                      允许挂载与下载
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      允许公开范围内的其他用户下载数据集源文件，并支持容器符号链接挂载。
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: 文件类型白名单与大小限制                                              */}
        {/* ========================================================================= */}
        {activeTab === "formats" && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                  <h2 className="text-sm font-semibold text-slate-800">
                    文件类型与大小限制
                  </h2>
                </div>
                <button
                  onClick={() => {
                    resetAllowedExtensions();
                    showToast("已恢复默认扩展名白名单");
                  }}
                  className="text-xs text-slate-500 hover:text-blue-600 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>恢复初始白名单</span>
                </button>
              </div>

              {/* 允许上传的扩展名白名单 */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  允许上传的文件类型白名单 (当前共 {systemConfig.allowedExtensions.length} 项)
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg min-h-[52px] items-center">
                  {systemConfig.allowedExtensions.map((ext) => (
                    <span
                      key={ext}
                      className="inline-flex items-center px-2.5 py-1 rounded bg-white text-slate-800 text-xs font-mono font-medium border border-slate-200 shadow-2xs group"
                    >
                      <span>{ext}</span>
                      <button
                        onClick={() => {
                          const res = removeAllowedExtension(ext);
                          if (res.success) showToast(res.message);
                          else showToast(res.message, "error");
                        }}
                        className="ml-1.5 text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                        title="删除该扩展名"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* 添加新扩展名输入框 */}
                  <div className="inline-flex items-center space-x-1">
                    <input
                      type="text"
                      placeholder="如 .tar.gz / .tsv"
                      value={newExtInput}
                      onChange={(e) => setNewExtInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddExtension();
                      }}
                      className="text-xs border border-slate-300 rounded px-2 py-1 w-28 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                    <button
                      onClick={handleAddExtension}
                      className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                    >
                      添加
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  输入合法扩展名（以点开头，如 .csv, .parquet, .json, .zip），回车或点击添加即可即时生效。
                </p>
              </div>

              {/* 单个数据集大小上限 */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  单个数据集文件大小上限
                </label>
                <div className="flex items-center space-x-3">
                  <div className="relative w-48">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={tempMaxDatasetSizeGB}
                      onChange={(e) => setTempMaxDatasetSizeGB(Number(e.target.value))}
                      className="w-full pl-3 pr-10 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-semibold text-slate-800"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      GB
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (tempMaxDatasetSizeGB <= 0) {
                        showToast("大小上限必须大于 0", "error");
                        return;
                      }
                      updateSystemConfig({ maxDatasetSizeGB: tempMaxDatasetSizeGB });
                      showToast(`已将单个数据集大小上限调整为 ${tempMaxDatasetSizeGB} GB`);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded shadow-2xs transition-colors flex items-center space-x-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>保存限制</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  系统默认值为 5GB。超出该限制的数据集文件在前端上传校验阶段将被直接拦截并提示。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: 关联校验配置                                                         */}
        {/* ========================================================================= */}
        {activeTab === "validation" && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-semibold text-slate-800">
                  数据集删除关联校验与保护机制
                </h2>
              </div>

              {/* 开关 1: 删除前校验引用 */}
              <div className="flex items-start justify-between p-4 bg-slate-50/80 rounded-lg border border-slate-200">
                <div className="space-y-1 pr-4">
                  <div className="text-xs font-semibold text-slate-800">
                    数据集删除前强制校验业务引用 (推荐开启)
                  </div>
                  <div className="text-[11px] text-slate-500 leading-relaxed">
                    开启后，用户或教师在删除数据集时，系统将自动扫描平台内的实验环境、实训课程与挂载实例。若存在正在引用该数据集的项目，将弹窗阻断并列出具体的引用详情，防止教学事故。
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={systemConfig.checkReferencesBeforeDelete}
                    onChange={(e) => {
                      const nextVal = e.target.checked;
                      updateSystemConfig({ checkReferencesBeforeDelete: nextVal });
                      showToast(
                        nextVal ? "已开启数据集删除前关联引用校验" : "已关闭关联校验（不建议）",
                        nextVal ? "success" : "info"
                      );
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* 单选 2: 删除方式配置 (软删除 vs 硬删除) */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-slate-800">
                  引用校验通过后的默认删除方式
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    onClick={() => {
                      updateSystemConfig({ deleteMode: "soft" });
                      showToast("已将删除模式设为【软删除（进入回收站，可恢复）】", "success");
                    }}
                    className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      systemConfig.deleteMode === "soft"
                        ? "border-emerald-600 bg-emerald-50/30"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delete_mode"
                      checked={systemConfig.deleteMode === "soft"}
                      onChange={() => {}}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="ml-3">
                      <div className="text-xs font-semibold text-slate-800 flex items-center">
                        软删除 (推荐，支持数据恢复)
                        <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded">
                          数据安全保障
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        删除的数据集将标记为已废弃并归档至平台回收站，底层文件保留 30 天，期间管理员或所有者可一键恢复。
                      </div>
                    </div>
                  </label>

                  <label
                    onClick={() => {
                      updateSystemConfig({ deleteMode: "hard" });
                      showToast("已将删除模式设为【硬删除（彻底物理擦除）】", "info");
                    }}
                    className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      systemConfig.deleteMode === "hard"
                        ? "border-rose-600 bg-rose-50/30"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delete_mode"
                      checked={systemConfig.deleteMode === "hard"}
                      onChange={() => {}}
                      className="mt-1 text-rose-600 focus:ring-rose-500"
                    />
                    <div className="ml-3">
                      <div className="text-xs font-semibold text-slate-800 flex items-center">
                        硬删除 (立即物理擦除)
                        <span className="ml-2 text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded">
                          不可撤回
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        执行删除后立即释放底层磁盘存储，物理销毁关联文件，数据将无法再次找回。
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 弹窗 1: 新增 / 编辑业务类型标签弹窗                                          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isTagModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Tags className="w-4 h-4 text-blue-600" />
                  <span>{editingTag ? "编辑业务类型标签" : "新增业务类型标签"}</span>
                </h3>
                <button
                  onClick={() => setIsTagModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1.5">
                    业务类型名称 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="如：智慧农业、自动驾驶、医疗健康、金融科技..."
                    value={tagFormName}
                    onChange={(e) => setTagFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1.5">
                    说明与应用指引
                  </label>
                  <textarea
                    rows={3}
                    placeholder="简要描述该业务类型标签的应用领域、课程实验场景或覆盖范围..."
                    value={tagFormDesc}
                    onChange={(e) => setTagFormDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-slate-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => setIsTagModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveTag}
                  className="px-4 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors font-medium shadow-2xs"
                >
                  确认保存
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 弹窗 2: 单个用户配额调整弹窗                                               */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isQuotaModalOpen && targetQuotaUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center">
                  <HardDrive className="w-4 h-4 text-blue-600 mr-2" />
                  调整用户存储配额
                </h3>
                <button
                  onClick={() => setIsQuotaModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-800">
                    {targetQuotaUser.userName} ({targetQuotaUser.role === "admin" ? "管理员" : targetQuotaUser.role === "teacher" ? "教师" : "学生"})
                  </div>
                  <div className="text-slate-500 text-[11px]">{targetQuotaUser.org}</div>
                  <div className="text-slate-500 text-[11px] pt-1 flex justify-between border-t border-slate-200/60 mt-1">
                    <span>当前已用: {targetQuotaUser.usedGB} GB</span>
                    <span>原配额上限: {targetQuotaUser.totalGB} GB</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1.5">
                    目标配额上限 (GB)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={quotaInputGB}
                      onChange={(e) => setQuotaInputGB(Number(e.target.value))}
                      className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-bold text-slate-800 text-sm"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      GB
                    </span>
                  </div>
                </div>

                {/* 快捷增减按钮 */}
                <div>
                  <div className="text-[11px] text-slate-500 mb-1.5">快捷调整:</div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "+10 GB", delta: 10 },
                      { label: "+20 GB", delta: 20 },
                      { label: "+50 GB", delta: 50 },
                      { label: "设为 50GB", exact: 50 },
                      { label: "设为 100GB", exact: 100 },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (item.exact !== undefined) setQuotaInputGB(item.exact);
                          else setQuotaInputGB((prev) => Math.max(1, prev + item.delta!));
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded border border-slate-200 text-xs font-medium transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => setIsQuotaModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveQuota}
                  className="px-4 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors font-medium shadow-2xs"
                >
                  确认调整
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 弹窗 3: 批量调整用户配额弹窗                                               */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isBatchQuotaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600 mr-2" />
                  批量调整存储配额 ({selectedUserIds.length} 人)
                </h3>
                <button
                  onClick={() => setIsBatchQuotaModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">
                    当前已勾选 <strong className="text-slate-800 font-bold">{selectedUserIds.length}</strong> 位用户
                  </span>
                  <div className="flex items-center space-x-1.5 text-[11px]">
                    <span className="text-slate-400">快速勾选角色:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const ids = userQuotas.filter((u) => u.role === "teacher").map((u) => u.userId);
                        setSelectedUserIds(ids);
                      }}
                      className="px-2 py-0.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                    >
                      全部教师
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const ids = userQuotas.filter((u) => u.role === "student").map((u) => u.userId);
                        setSelectedUserIds(ids);
                      }}
                      className="px-2 py-0.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                    >
                      全部学生
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const ids = userQuotas.filter((u) => u.role === "admin").map((u) => u.userId);
                        setSelectedUserIds(ids);
                      }}
                      className="px-2 py-0.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded border border-purple-200 transition-colors"
                    >
                      全部管理员
                    </button>
                  </div>
                </div>

                {/* 策略 1: 百分比扩缩容 */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="font-semibold text-slate-700">方式一：按百分比浮动扩缩容</div>
                  <div className="flex items-center space-x-2">
                    {[-20, +20, +50, +100].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setBatchPercentDelta(p);
                          setBatchExactGB("");
                        }}
                        className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                          batchPercentDelta === p && !batchExactGB
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {p > 0 ? `+${p}%` : `${p}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 策略 2: 统一定值设置 */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="font-semibold text-slate-700">方式二：统一定值为指定数值 (GB)</div>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="如输入 50，则所有选中用户配额变为 50GB"
                      value={batchExactGB}
                      onChange={(e) => setBatchExactGB(e.target.value)}
                      className="w-full pl-3 pr-10 py-1.5 border border-slate-300 rounded bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      GB
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => setIsBatchQuotaModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveBatchQuota}
                  className="px-4 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors font-medium shadow-2xs"
                >
                  确认批量应用
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
