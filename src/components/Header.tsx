import React, { useState } from 'react';
import {
  Languages,
  User,
  ChevronDown,
  UserCircle,
  Settings,
  Activity,
  LogOut,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface HeaderProps {
  onNavigate?: (view: string) => void;
  activeNav?: 'course-hall' | 'lab-hall' | 'lab-detail' | 'dataset-hall' | 'personal' | 'home' | 'platform-operation' | 'config' | string;
}

export default function Header({ onNavigate, activeNav = 'course-hall' }: HeaderProps) {
  const { currentUser, setCurrentUser, allUsers } = useData();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [currentTenant, setCurrentTenant] = useState('教育公司');

  const tenants = ['教育公司', '示范性现代产业学院', '人工智能产教融合基地', '新大陆科技集团实训基地'];

  // 判断是否处于某导航项激活状态
  const isCourseActive = activeNav === 'course-hall';
  const isLabActive = activeNav === 'lab-hall' || activeNav === 'lab-detail';
  const isDatasetActive = activeNav === 'dataset-hall';
  const isPersonalActive = activeNav === 'personal';

  return (
    <>
      {/* 全局统一顶部导航栏 (以课程大厅为基准规范) */}
      <header className="bg-white px-6 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50 shadow-2xs">
        <div className="flex items-center space-x-12">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate && onNavigate('course-hall')}
          >
            <img src="/logo.png" alt="UUSIMA 智慧教学实验平台" className="h-8 object-contain" />
          </div>

          {/* 核心主导航链接 */}
          <nav className="hidden md:flex items-center space-x-8 text-sm text-slate-500 font-normal h-full">
            <button
              className={`relative py-3 transition-colors ${
                isCourseActive ? 'text-blue-500 font-medium' : 'hover:text-blue-500'
              }`}
              onClick={() => onNavigate && onNavigate('course-hall')}
            >
              课程大厅
              {isCourseActive && (
                <span className="absolute bottom-[-13px] left-0 right-0 h-[2.5px] bg-blue-500 rounded-full" />
              )}
            </button>
            <button
              className={`relative py-3 transition-colors ${
                isLabActive ? 'text-blue-500 font-medium' : 'hover:text-blue-500'
              }`}
              onClick={() => onNavigate && onNavigate('lab-hall')}
            >
              实验大厅
              {isLabActive && (
                <span className="absolute bottom-[-13px] left-0 right-0 h-[2.5px] bg-blue-500 rounded-full" />
              )}
            </button>
            <button
              className={`relative py-3 transition-colors ${
                isDatasetActive ? 'text-blue-500 font-medium' : 'hover:text-blue-500'
              }`}
              onClick={() => onNavigate && onNavigate('dataset-hall')}
            >
              数据大厅
              {isDatasetActive && (
                <span className="absolute bottom-[-13px] left-0 right-0 h-[2.5px] bg-blue-500 rounded-full" />
              )}
            </button>
            <a
              href="https://aixb.nlecloud.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors py-3"
            >
              AI技能分析系统
            </a>
            <a
              href="https://lct-xy.nlecloud.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors py-3"
            >
              AI产教融合系统
            </a>
            <a
              href="https://deviceai.nlecloud.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors py-3"
            >
              硬件智能体系统
            </a>
            <a
              href="#"
              className="hover:text-blue-500 transition-colors py-3"
              onClick={(e) => e.preventDefault()}
            >
              考试系统
            </a>
          </nav>
        </div>

        {/* 右侧操作区 (语言、我的主页、用户下拉) */}
        <div className="flex items-center space-x-6 text-sm">
          <button className="flex items-center text-slate-600 hover:text-blue-500 transition-colors">
            <Languages className="w-4 h-4 mr-1" />
            En
          </button>
          <button
            onClick={() => onNavigate && onNavigate('personal')}
            className={`${
              isPersonalActive ? 'text-blue-500' : 'text-slate-700 hover:text-blue-500'
            } font-medium transition-colors`}
          >
            我的主页
          </button>

          {/* 用户信息与下拉面板 */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 cursor-pointer focus:outline-none hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-slate-700 font-medium text-sm">
                {currentUser?.name || '杨振邦'}
                <span className="text-slate-400 font-normal text-xs ml-1">
                  ({currentUser?.phone || '15396005420'})
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-100 z-50 overflow-hidden transform origin-top-right animate-in fade-in slide-in-from-top-1">
                {/* 顶部粉色头像横幅 */}
                <div className="relative h-12 bg-[#e6f4ff]">
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-[#f48b8d] text-white flex items-center justify-center font-medium border-[3px] border-white text-sm shadow-sm">
                    {currentUser?.avatarText || '振邦'}
                  </div>
                </div>

                {/* 用户信息主体 */}
                <div className="pt-8 pb-1">
                  <div className="text-center px-4 mb-2">
                    <div className="font-medium text-slate-800 text-sm">
                      {currentUser?.name || '杨振邦'}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {currentUser?.phone || '15396005420'}
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 my-2 mx-2"></div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate && onNavigate('personal');
                    }}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-500 hover:bg-slate-50 transition-colors"
                  >
                    <UserCircle className="w-4 h-4 mr-2 text-slate-400" />
                    个人设置
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate && onNavigate('config');
                    }}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-500 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2 text-slate-400" />
                    系统管理
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate && onNavigate('platform-operation');
                    }}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-slate-600 hover:text-blue-500 hover:bg-slate-50 transition-colors"
                  >
                    <Activity className="w-4 h-4 mr-2 text-slate-400" />
                    平台运营
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate && onNavigate('login');
                    }}
                    className="w-full flex items-center px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2 text-red-400" />
                    退出登录
                  </button>
                </div>

                {/* 组织切换区 */}
                <div className="border-t border-slate-100 px-3 py-3">
                  <div className="text-[12px] text-slate-500 mb-2 px-1">组织</div>
                  <div className="bg-[#f5f7fa] rounded-lg flex items-center justify-between p-2">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <div className="w-5 h-5 bg-white rounded shadow-2xs text-blue-500 flex items-center justify-center shrink-0 font-bold text-xs italic">
                        X
                      </div>
                      <span className="text-[13px] text-slate-700 truncate">
                        {currentTenant}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsTenantModalOpen(true);
                      }}
                      className="text-[12px] text-slate-400 hover:text-blue-500 flex items-center shrink-0 transition-colors"
                    >
                      切换 <ChevronRight className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* 快捷身份切换 (仅在支持多角色演示时) */}
                {allUsers && allUsers.length > 0 && (
                  <div className="border-t border-slate-100 p-2.5 bg-slate-50/70">
                    <div className="text-[11px] font-semibold text-slate-400 px-1.5 pb-1">
                      身份切换演示
                    </div>
                    <div className="space-y-1">
                      {allUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            if (setCurrentUser) setCurrentUser(u);
                            setIsUserMenuOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-md text-xs flex items-center justify-between transition-colors ${
                            currentUser?.id === u.id
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-slate-600 hover:bg-slate-200/60'
                          }`}
                        >
                          <span className="truncate">
                            {u.name} ({u.roleName})
                          </span>
                          {currentUser?.id === u.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 组织切换弹窗 */}
      {isTenantModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">切换所属组织</h3>
              <button
                onClick={() => setIsTenantModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {tenants.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setCurrentTenant(t);
                    setIsTenantModalOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between border transition-all ${
                    currentTenant === t
                      ? 'border-blue-500 bg-blue-50/50 text-blue-600 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span>{t}</span>
                  {currentTenant === t && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
