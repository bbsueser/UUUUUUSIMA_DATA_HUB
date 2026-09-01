import React, { useState } from 'react';
import { 
  GraduationCap, 
  Building2, 
  BookOpen,
  Search,
  CheckSquare,
  CheckCircle2,
  Clock,
  Timer,
  FileText,
  Bot
} from 'lucide-react';
import { useData } from '../context/DataContext';

export function StudentDashboard({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const { currentUser } = useData();
  const [activeTeachingTab, setActiveTeachingTab] = useState('进行中');
  const [activeTaskListTab, setActiveTaskListTab] = useState('教学任务');

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center text-slate-400 py-12">
      <div className="relative w-28 h-28 mb-3">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="80" rx="35" ry="8" fill="#e2e8f0" />
          <rect x="22" y="32" width="56" height="38" rx="4" fill="#dbeafe" />
          <rect x="26" y="36" width="48" height="28" rx="2" fill="#ffffff" />
          <rect x="30" y="42" width="24" height="4" rx="2" fill="#93c5fd" />
          <rect x="30" y="49" width="36" height="3" rx="1.5" fill="#cbd5e1" />
          <rect x="30" y="55" width="20" height="3" rx="1.5" fill="#cbd5e1" />
          <path d="M15 70 L85 70 L80 74 L20 74 Z" fill="#94a3b8" />
          <circle cx="70" cy="25" r="7" fill="#38bdf8" />
          <path d="M68 25 L72 25" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-xs text-slate-400">暂无任务</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto bg-[#f4f7f9]">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-6 flex items-center justify-between shadow-2xs border border-slate-100 relative overflow-hidden">
        <div className="flex items-center space-x-10 z-10">
          <h1 className="text-lg font-bold text-slate-800 whitespace-nowrap">
            Hi，<span className="text-slate-900">{currentUser?.name || '郑鸿杰'}</span> 同学 欢迎回来~
          </h1>
          
          <div className="flex items-center space-x-8">
            {/* 班级 */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#3b5998] flex items-center justify-center text-white shadow-2xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">班级</p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">产品</p>
              </div>
            </div>
            
            {/* 学院 */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#f59e0b] flex items-center justify-center text-white shadow-2xs">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">学院</p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">新大陆教育行业云</p>
              </div>
            </div>
            
            {/* 专业 */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#06b6d4] flex items-center justify-center text-white shadow-2xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">专业</p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">物联网 |</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 右侧插画点缀 */}
        <div className="w-44 h-20 relative flex items-center justify-end pr-2 pointer-events-none">
          <svg viewBox="0 0 120 70" fill="none" className="h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 15 L17 9 L19 15 L25 17 L19 19 L17 25 L15 19 L9 17 Z" fill="#93c5fd" />
            <path d="M95 10 L96 6 L97 10 L101 11 L97 12 L96 16 L95 12 L91 11 Z" fill="#60a5fa" />
            <path d="M105 45 L106.5 40 L108 45 L113 46.5 L108 48 L106.5 53 L105 48 L100 46.5 Z" fill="#93c5fd" />
            <rect x="35" y="10" width="38" height="48" rx="4" fill="#3b82f6" transform="rotate(-8 54 34)" />
            <rect x="42" y="12" width="38" height="48" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" transform="rotate(4 61 36)" />
            <rect x="48" y="20" width="18" height="3" rx="1.5" fill="#93c5fd" transform="rotate(4 61 36)" />
            <rect x="48" y="27" width="26" height="2.5" rx="1.25" fill="#e2e8f0" transform="rotate(4 61 36)" />
            <rect x="48" y="33" width="20" height="2.5" rx="1.25" fill="#e2e8f0" transform="rotate(4 61 36)" />
            <circle cx="68" cy="46" r="8" fill="#10b981" />
            <path d="M64 46 L67 49 L72 43" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* 5 个核心指标卡片 */}
      <div className="grid grid-cols-5 gap-4">
        {/* 1. 待办任务 */}
        <div className="bg-white p-4 rounded-xl shadow-2xs border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-1">待办任务</p>
            <p className="text-xl font-bold text-slate-800">
              0 <span className="text-xs font-normal text-slate-500">个</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>
        
        {/* 2. 已完成任务 */}
        <div className="bg-white p-4 rounded-xl shadow-2xs border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-1">已完成任务</p>
            <p className="text-xl font-bold text-slate-800">
              0 <span className="text-xs font-normal text-slate-500">个</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        
        {/* 3. 已用时长 */}
        <div className="bg-white p-4 rounded-xl shadow-2xs border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-1">已用时长</p>
            <p className="text-xl font-bold text-slate-800">
              0 <span className="text-xs font-normal text-slate-500">分钟</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        
        {/* 4. 剩余时长 */}
        <div className="bg-white p-4 rounded-xl shadow-2xs border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-1">剩余时长</p>
            <p className="text-xl font-bold text-slate-800">
              0 <span className="text-xs font-normal text-slate-500">分钟</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 relative">
            <Timer className="w-5 h-5" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full border border-white" />
          </div>
        </div>
        
        {/* 5. 实验报告数 */}
        <div className="bg-white p-4 rounded-xl shadow-2xs border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-1">实验报告数</p>
            <p className="text-xl font-bold text-slate-800">
              0 <span className="text-xs font-normal text-slate-500">份</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 下方双面板 (我的教学任务 & 我的任务列表) */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        {/* 左面板：我的教学任务 */}
        <div className="bg-white rounded-xl shadow-2xs border border-slate-100 p-5 flex flex-col min-h-[380px]">
          <h2 className="text-sm font-bold text-slate-800">我的教学任务</h2>
          
          <div className="flex space-x-2 mt-4">
            {['进行中', '已完成'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTeachingTab(tab)}
                className={`px-4 py-1 rounded-md text-xs transition-colors ${
                  activeTeachingTab === tab 
                    ? 'bg-[#e6f0ff] text-blue-600 font-medium' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <EmptyState />
          </div>
        </div>

        {/* 右面板：我的任务列表 */}
        <div className="bg-white rounded-xl shadow-2xs border border-slate-100 p-5 flex flex-col min-h-[380px]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">我的任务列表</h2>
            
            {/* 搜索框 */}
            <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-white w-60">
              <input 
                type="text" 
                placeholder="请输入课程名称进行搜索" 
                className="w-full px-3 py-1 text-xs outline-none text-slate-600 placeholder:text-slate-300"
              />
              <button className="px-2.5 py-1.5 bg-slate-50 border-l border-slate-200 hover:bg-slate-100 transition-colors">
                <Search className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-4">
            {['教学任务', '学习任务', '已完成'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTaskListTab(tab)}
                className={`px-4 py-1 rounded-md text-xs transition-colors ${
                  activeTaskListTab === tab 
                    ? 'bg-[#e6f0ff] text-blue-600 font-medium' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <EmptyState />
          </div>
        </div>
      </div>

      {/* 右下角悬浮智能体徽章 */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => onNavigate && onNavigate('dataset-hall')}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3.5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xs font-medium"
        >
          <Bot className="w-4 h-4" />
          <span>AI Newland</span>
        </button>
      </div>
    </div>
  );
}

export default function Personal({ onNavigate }: { onNavigate?: (view: string) => void }) {
  return <StudentDashboard onNavigate={onNavigate} />;
}
