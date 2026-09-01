import React, { useState } from 'react';
import {
  Users,
  FileText,
  Settings,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Database,
  GraduationCap,
  Briefcase,
  Layers,
  ShieldCheck,
  Trophy,
  Server,
  CreditCard,
  Building2,
  Hourglass,
  Home,
  Tags,
  HardDrive,
  FileCheck,
  History,
  ClipboardList,
  Sparkles,
  UserCheck,
  RotateCcw,
  Bot
} from 'lucide-react';
import Header from '../components/Header';
import DatasetConfigManagement from './system/DatasetConfigManagement';
import { StudentDashboard } from './Personal';
import { useData } from '../context/DataContext';

interface ConfigManagementProps {
  onNavigate?: (view: string) => void;
  initialMenu?: string;
}

const tenants = [
  { id: 'personal', name: '个人', status: 'active' },
  { id: 'school', name: '福建信息职业技术学院', role: '教师', status: 'active' },
  { id: 'enterprise', name: '新大陆时代科技有限公司', role: '企业员工', status: 'active' },
];

export default function ConfigManagement({ onNavigate, initialMenu = 'student_home' }: ConfigManagementProps = {}) {
  const { currentUser, pendingAuditCount } = useData();

  // 当前选中的左侧菜单 key
  const [activeMenu, setActiveMenu] = useState<string>(initialMenu);

  // 组织切换弹窗
  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const [activeTenantId, setActiveTenantId] = useState('personal');

  // 左侧手风琴分组折叠状态
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    course: false,
    ops: false,
    member: false,
    account: false,
    teaching: false,
    exam: false,
    devops: false,
    lab: false,
    dataset: true, // 默认展开数据集管理
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 辅助判断数据集子视图
  const isDatasetMenu = activeMenu.startsWith('dataset_');
  const getDatasetSubView = (): "tags" | "quotas" | "permissions" | "formats" | "validation" => {
    switch (activeMenu) {
      case 'dataset_quotas':
        return 'quotas';
      case 'dataset_permissions':
        return 'permissions';
      case 'dataset_formats':
        return 'formats';
      case 'dataset_validation':
        return 'validation';
      case 'dataset_tags':
      default:
        return 'tags';
    }
  };

  // 演示占位组件
  const renderDemoPlaceholder = (title: string, desc: string = "该模块为系统原型演示项，未在本次需求范围内。") => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white m-6 rounded-xl border border-slate-200 shadow-2xs">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
        <Sparkles className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 max-w-md mt-2 leading-relaxed">
        {desc}
      </p>
      <div className="mt-6 flex items-center space-x-3">
        <button
          onClick={() => setActiveMenu('dataset_tags')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
        >
          前往数据集管理
        </button>
        <button
          onClick={() => setActiveMenu('student_home')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
        >
          返回学生主页
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#f4f7f9] font-sans overflow-hidden">
      {/* 顶部统一平台顶栏 */}
      <Header onNavigate={onNavigate || (() => {})} activeNav="config" />

      {/* 左右主体结构 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧垂直侧边栏 */}
        <aside className="w-56 bg-white border-r border-slate-200 flex flex-col py-3 shrink-0 overflow-y-auto select-none">
          <nav className="flex-1 space-y-0.5 px-2 text-xs">
            
            {/* 1. 课程管理 */}
            <div>
              <button
                onClick={() => toggleSection('course')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                <div className="flex items-center space-x-2.5">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span>课程管理</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    expandedSections.course ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSections.course && (
                <div className="pl-7 pr-2 py-1 space-y-0.5">
                  <button
                    onClick={() => setActiveMenu('course_list')}
                    className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                      activeMenu === 'course_list'
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    课程列表
                  </button>
                  <button
                    onClick={() => setActiveMenu('course_category')}
                    className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                      activeMenu === 'course_category'
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    课程分类
                  </button>
                </div>
              )}
            </div>

            {/* 2. 运营管理 */}
            <div>
              <button
                onClick={() => toggleSection('ops')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                <div className="flex items-center space-x-2.5">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span>运营管理</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    expandedSections.ops ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSections.ops && (
                <div className="pl-7 pr-2 py-1 space-y-0.5">
                  <button
                    onClick={() => setActiveMenu('platform_ops')}
                    className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                      activeMenu === 'platform_ops'
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    平台运营监控
                  </button>
                </div>
              )}
            </div>

            {/* 3. 系统管理员主页 */}
            <button
              onClick={() => setActiveMenu('sys_admin_home')}
              className={`w-full flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
                activeMenu === 'sys_admin_home'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 mr-2.5 text-slate-500" />
              <span>系统管理员主页</span>
            </button>

            {/* 4. 成员管理 */}
            <div>
              <button
                onClick={() => toggleSection('member')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                <div className="flex items-center space-x-2.5">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>成员管理</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    expandedSections.member ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSections.member && (
                <div className="pl-7 pr-2 py-1 space-y-0.5">
                  <button
                    onClick={() => setActiveMenu('class')}
                    className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                      activeMenu === 'class'
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    班级管理
                  </button>
                  <button
                    onClick={() => setActiveMenu('users')}
                    className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                      activeMenu === 'users'
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    用户管理
                  </button>
                </div>
              )}
            </div>

            {/* 5. 管理员主页 */}
            <button
              onClick={() => setActiveMenu('admin_home')}
              className={`w-full flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
                activeMenu === 'admin_home'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 mr-2.5 text-slate-500" />
              <span>管理员主页</span>
            </button>

            {/* 6. 账户管理 */}
            <div>
              <button
                onClick={() => toggleSection('account')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                <div className="flex items-center space-x-2.5">
                  <UserCheck className="w-4 h-4 text-slate-500" />
                  <span>账户管理</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    expandedSections.account ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSections.account && (
                <div className="pl-7 pr-2 py-1 space-y-0.5">
                  <button
                    onClick={() => setActiveMenu('invite')}
                    className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                      activeMenu === 'invite'
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    邀请管理
                  </button>
                  <button
                    onClick={() => setActiveMenu('invite_records')}
                    className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                      activeMenu === 'invite_records'
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    邀请记录
                  </button>
                </div>
              )}
            </div>

            {/* 7. 教学管理 */}
            <div>
              <button
                onClick={() => toggleSection('teaching')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                <div className="flex items-center space-x-2.5">
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  <span>教学管理</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    expandedSections.teaching ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSections.teaching && (
                <div className="pl-7 pr-2 py-1 space-y-0.5">
                  <button
                    onClick={() => setActiveMenu('my_teaching')}
                    className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                      activeMenu === 'my_teaching'
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    我的教学任务
                  </button>
                </div>
              )}
            </div>

            {/* 8. 学生主页 */}
            <button
              onClick={() => setActiveMenu('student_home')}
              className={`w-full flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
                activeMenu === 'student_home'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4 mr-2.5 text-slate-500" />
              <span>学生主页</span>
            </button>

            {/* 9. 考试竞赛 */}
            <div>
              <button
                onClick={() => toggleSection('exam')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                <div className="flex items-center space-x-2.5">
                  <Trophy className="w-4 h-4 text-slate-500" />
                  <span>考试竞赛</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    expandedSections.exam ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSections.exam && (
                <div className="pl-7 pr-2 py-1 space-y-0.5">
                  {['题库管理', '试题管理', '试卷管理', '考试管理', '场次管理', '任务管理', '阅卷管理'].map((item, idx) => (
                    <button
                      key={item}
                      onClick={() => setActiveMenu(`exam_${idx}`)}
                      className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                        activeMenu === `exam_${idx}`
                          ? 'text-blue-600 bg-blue-50 font-medium'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 10. 运维管理 */}
            <div>
              <button
                onClick={() => toggleSection('devops')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                <div className="flex items-center space-x-2.5">
                  <Server className="w-4 h-4 text-slate-500" />
                  <span>运维管理</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    expandedSections.devops ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSections.devops && (
                <div className="pl-7 pr-2 py-1 space-y-0.5">
                  <button
                    onClick={() => setActiveMenu('server_status')}
                    className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                      activeMenu === 'server_status'
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    资源监控与服务状态
                  </button>
                </div>
              )}
            </div>

            {/* 11. 实验管理 */}
            <div>
              <button
                onClick={() => toggleSection('lab')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                <div className="flex items-center space-x-2.5">
                  <Layers className="w-4 h-4 text-slate-500" />
                  <span>实验管理</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    expandedSections.lab ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSections.lab && (
                <div className="pl-7 pr-2 py-1 space-y-0.5">
                  <button
                    onClick={() => setActiveMenu('lab_list')}
                    className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                      activeMenu === 'lab_list'
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    实验环境管理
                  </button>
                </div>
              )}
            </div>

            {/* 12. 数据集管理 (标签左侧无小标志，子项整齐规范) */}
            <div className="pt-1">
              <button
                onClick={() => toggleSection('dataset')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium ${
                  isDatasetMenu ? 'bg-blue-50/70 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">数据集管理</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    expandedSections.dataset ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedSections.dataset && (
                <div className="pl-7 pr-2 py-1 space-y-0.5">
                  <button
                    onClick={() => setActiveMenu('dataset_tags')}
                    className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                      activeMenu === 'dataset_tags'
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    标签管理
                  </button>

                  <button
                    onClick={() => setActiveMenu('dataset_quotas')}
                    className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                      activeMenu === 'dataset_quotas'
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    存储配额管理
                  </button>

                  <button
                    onClick={() => setActiveMenu('dataset_permissions')}
                    className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                      activeMenu === 'dataset_permissions'
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    权限管理
                  </button>

                  <button
                    onClick={() => setActiveMenu('dataset_formats')}
                    className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                      activeMenu === 'dataset_formats'
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    格式限制
                  </button>

                  <button
                    onClick={() => setActiveMenu('dataset_validation')}
                    className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                      activeMenu === 'dataset_validation'
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    关联校验配置
                  </button>
                </div>
              )}
            </div>

            {/* 13. 我的考试 */}
            <button
              onClick={() => setActiveMenu('my_exam')}
              className={`w-full flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
                activeMenu === 'my_exam'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Hourglass className="w-4 h-4 mr-2.5 text-slate-500" />
              <span>我的考试</span>
            </button>

            {/* 14. 我的学习 */}
            <button
              onClick={() => setActiveMenu('my_learning')}
              className={`w-full flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
                activeMenu === 'my_learning'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 mr-2.5 text-slate-500" />
              <span>我的学习</span>
            </button>

            {/* 15. 订购信息查询 */}
            <button
              onClick={() => setActiveMenu('orders')}
              className={`w-full flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
                activeMenu === 'orders'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4 mr-2.5 text-slate-500" />
              <span>订购信息查询</span>
            </button>
          </nav>
        </aside>

        {/* 右侧主内容区域 */}
        <main className="flex-1 overflow-hidden flex flex-col bg-[#f4f7f9]">
          {/* 数据集配置管理 (受左侧竖排导航控制，简洁清爽) */}
          {isDatasetMenu ? (
            <DatasetConfigManagement
              showTopTabs={false}
              activeSubView={getDatasetSubView()}
              onSubViewChange={(view) => setActiveMenu(`dataset_${view}`)}
              onNavigate={onNavigate}
            />
          ) : activeMenu === 'student_home' ? (
            <StudentDashboard onNavigate={onNavigate} />
          ) : activeMenu === 'course_list' ? (
            renderDemoPlaceholder('课程列表', '课程列表模块为系统原型演示项，未在本次需求范围内。')
          ) : activeMenu === 'course_category' ? (
            renderDemoPlaceholder('课程分类', '课程分类配置为系统原型演示项，未在本次需求范围内。')
          ) : activeMenu === 'platform_ops' ? (
            renderDemoPlaceholder('平台运营监控', '平台运营监控模块为系统原型演示项。')
          ) : activeMenu === 'sys_admin_home' ? (
            renderDemoPlaceholder('系统管理员主页', '系统管理员主页为系统原型演示项。')
          ) : activeMenu === 'admin_home' ? (
            renderDemoPlaceholder('管理员主页', '管理员主页为系统原型演示项。')
          ) : activeMenu === 'class' ? (
            renderDemoPlaceholder('班级管理', '班级管理模块为系统原型演示项。')
          ) : activeMenu === 'users' ? (
            renderDemoPlaceholder('用户管理', '用户管理模块为系统原型演示项。')
          ) : activeMenu === 'invite' ? (
            renderDemoPlaceholder('邀请管理', '邀请管理模块为系统原型演示项。')
          ) : activeMenu === 'invite_records' ? (
            renderDemoPlaceholder('邀请记录', '邀请记录模块为系统原型演示项。')
          ) : activeMenu === 'my_teaching' ? (
            renderDemoPlaceholder('我的教学任务', '教学任务管理模块为系统原型演示项。')
          ) : activeMenu.startsWith('exam_') ? (
            renderDemoPlaceholder('考试竞赛模块', '考试与试卷管理为系统原型演示项。')
          ) : activeMenu === 'server_status' ? (
            renderDemoPlaceholder('资源监控与服务状态', '运维服务器状态监控为系统原型演示项。')
          ) : activeMenu === 'lab_list' ? (
            renderDemoPlaceholder('实验环境管理', '实验环境容器管理为系统原型演示项。')
          ) : activeMenu === 'my_exam' ? (
            renderDemoPlaceholder('我的考试', '学生在线考试与成绩查询为系统原型演示项。')
          ) : activeMenu === 'my_learning' ? (
            renderDemoPlaceholder('我的学习', '学习进度与课程笔记为系统原型演示项。')
          ) : activeMenu === 'orders' ? (
            renderDemoPlaceholder('订购信息查询', '资源订购与账单查询为系统原型演示项。')
          ) : (
            renderDemoPlaceholder('系统模块', '当前模块为系统原型演示项。')
          )}
        </main>
      </div>
    </div>
  );
}
