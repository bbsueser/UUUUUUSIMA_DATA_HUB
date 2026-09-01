import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Clock,
  TrendingUp,
  Flame,
  Layers,
  Box,
  Cpu,
  Cloud,
  Terminal,
  Database,
  Sparkles,
  ExternalLink,
  Play,
  Share2,
  Code2,
  Monitor,
  CheckCircle2,
  ArrowUp,
  MessageSquare,
} from 'lucide-react';
import Header from '../components/Header';

interface LabHallProps {
  onNavigate: (view: string) => void;
}

export interface LabCardData {
  id: string;
  title: string;
  category: '平台型' | '容器型' | '虚拟系统' | '组合型';
  major: '物联网' | '人工智能' | '工业互联网' | '大数据' | '区块链' | '专业技术技能' | '岗位课程';
  subCategory?: string;
  description: string;
  courseCount: number;
  durationText: string;
  durationValue: number; // 用于排序
  viewCountText: string;
  viewCountValue: number; // 用于排序
  iconType: 'jupyter' | 'lowcode' | 'simulation' | '3d' | 'cloud' | 'renode' | 'chip' | 'iot' | '2d' | 'label' | 'cv' | 'llm' | 'robot' | 'blockchain' | 'ros';
  thumbnailTheme: string;
  hotCourses: { title: string; color: string }[];
  envLink?: string;
}

export default function LabHall({ onNavigate }: LabHallProps) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedMajor, setSelectedMajor] = useState('全部');
  const [selectedSubCategory, setSelectedSubCategory] = useState('全部');
  const [activeSort, setActiveSort] = useState<'default' | 'courses' | 'views' | 'usage'>('default');
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  // 分类与专业选项（严格按照截图）
  const categories = ['全部', '平台型', '容器型', '虚拟系统', '组合型'];
  const majors = [
    '全部',
    '物联网',
    '人工智能',
    '工业互联网',
    '大数据',
    '区块链',
    '专业技术技能',
    '岗位课程',
  ];

  // 动态子类列表
  const subCategories = useMemo(() => {
    if (selectedMajor === '人工智能') {
      return ['全部', 'TensorFlow/PyTorch', '深度学习', '大语言模型', '计算机视觉', '数据标注'];
    }
    if (selectedMajor === '大数据') {
      return ['全部', 'Jupyter数据分析', '分布式计算', 'ETL数据挖掘', 'Python数据科学'];
    }
    if (selectedMajor === '物联网') {
      return ['全部', '单片机/STM32', '嵌入式仿真', 'ThingsBoard', '传感器网络', 'MQTT通信'];
    }
    if (selectedMajor === '工业互联网') {
      return ['全部', '工程虚拟仿真', 'SCADA组态', '2D/3D应用设计', '工业数字孪生'];
    }
    return ['全部'];
  }, [selectedMajor]);

  // 实验卡片数据列表（完全复刻截图中的实验名称、分类、简介、统计指标和热门课程）
  const labList: LabCardData[] = [
    {
      id: 'lab-bigdata-jupyter',
      title: '大数据-jupyter',
      category: '容器型',
      major: '大数据',
      subCategory: 'Jupyter数据分析',
      description: '实验简介：大数据-jupyter',
      courseCount: 5,
      durationText: '18,272 分钟',
      durationValue: 18272,
      viewCountText: '194 浏览人次',
      viewCountValue: 194,
      iconType: 'jupyter',
      thumbnailTheme: 'jupyter-tf',
      hotCourses: [
        { title: 'Python数据分析实战', color: 'from-blue-400 to-indigo-500' },
        { title: 'TensorFlow深度学习基础', color: 'from-amber-400 to-orange-500' },
        { title: '海量数据挖掘算法', color: 'from-cyan-400 to-blue-500' },
      ],
      envLink: 'jupyter-env',
    },
    {
      id: 'lab-lowcode',
      title: '低代码实验环境',
      category: '容器型',
      major: '专业技术技能',
      subCategory: 'SCADA组态',
      description: '实验简介：低代码实验环境',
      courseCount: 0,
      durationText: '146,535 分钟',
      durationValue: 146535,
      viewCountText: '453 浏览人次',
      viewCountValue: 453,
      iconType: 'lowcode',
      thumbnailTheme: 'lowcode-ui',
      hotCourses: [
        { title: '可视化拖拽应用构建', color: 'from-blue-400 to-cyan-500' },
        { title: '企业级低代码表单实战', color: 'from-indigo-400 to-blue-500' },
      ],
      envLink: 'lab-detail',
    },
    {
      id: 'lab-simulation',
      title: '工程虚拟仿真',
      category: '平台型',
      major: '工业互联网',
      subCategory: '工程虚拟仿真',
      description: '实验简介：工程虚拟仿真平台采用B/S架...',
      courseCount: 14,
      durationText: '68,045 小时',
      durationValue: 68045 * 60,
      viewCountText: '16,863 浏览人次',
      viewCountValue: 16863,
      iconType: 'simulation',
      thumbnailTheme: 'simulation-wires',
      hotCourses: [
        { title: '虚拟硬件接线与电气控制', color: 'from-emerald-400 to-teal-500' },
        { title: 'PLC虚拟仿真综合实训', color: 'from-blue-500 to-indigo-600' },
        { title: '传感器信号采集与拓扑', color: 'from-purple-400 to-indigo-500' },
      ],
      envLink: 'lab-detail',
    },
    {
      id: 'lab-3d-designer',
      title: '3D应用设计器',
      category: '平台型',
      major: '工业互联网',
      subCategory: '2D/3D应用设计',
      description: '实验简介：支持三维可视化界面的应用设...',
      courseCount: 1,
      durationText: '43,022 分钟',
      durationValue: 43022,
      viewCountText: '537 浏览人次',
      viewCountValue: 537,
      iconType: '3d',
      thumbnailTheme: '3d-editor',
      hotCourses: [
        { title: '3D数字孪生园区建模', color: 'from-blue-400 to-indigo-600' },
        { title: 'ThreeJS可视化大屏设计', color: 'from-cyan-400 to-blue-500' },
      ],
      envLink: 'lab-detail',
    },
    {
      id: 'lab-industry-cloud',
      title: '行业云',
      category: '平台型',
      major: '物联网',
      subCategory: 'ThingsBoard',
      description: '实验简介：行业云平台是一款功能全面的...',
      courseCount: 6,
      durationText: '248,172 分钟',
      durationValue: 248172,
      viewCountText: '1,455 浏览人次',
      viewCountValue: 1455,
      iconType: 'cloud',
      thumbnailTheme: 'cloud-arch',
      hotCourses: [
        { title: 'NLECloud物联网云平台实战', color: 'from-blue-400 to-indigo-500' },
        { title: '微服务架构与云原生部署', color: 'from-sky-400 to-blue-600' },
        { title: '行业数据接入与协议解析', color: 'from-indigo-400 to-purple-500' },
      ],
      envLink: 'lab-detail',
    },
    {
      id: 'lab-embedded-renode',
      title: '嵌入式(仿真+Renode)',
      category: '组合型',
      major: '物联网',
      subCategory: '嵌入式仿真',
      description: '实验简介：嵌入式虚拟仿真平台提供即插...',
      courseCount: 0,
      durationText: '293,001 分钟',
      durationValue: 293001,
      viewCountText: '575 浏览人次',
      viewCountValue: 575,
      iconType: 'renode',
      thumbnailTheme: 'renode-terminal',
      hotCourses: [
        { title: 'Renode板级仿真与固件调试', color: 'from-emerald-400 to-teal-500' },
        { title: 'RISC-V/ARM多核仿真实训', color: 'from-blue-400 to-indigo-500' },
      ],
      envLink: 'lab-detail',
    },
    {
      id: 'lab-embedded-sim',
      title: '嵌入式仿真',
      category: '平台型',
      major: '物联网',
      subCategory: '单片机/STM32',
      description: '实验简介：嵌入式虚拟仿真平台提供即插...',
      courseCount: 2,
      durationText: '65,782 分钟',
      durationValue: 65782,
      viewCountText: '476 浏览人次',
      viewCountValue: 476,
      iconType: 'chip',
      thumbnailTheme: 'chip-circuit',
      hotCourses: [
        { title: 'STM32微控制器虚拟硬件开发', color: 'from-blue-400 to-indigo-500' },
        { title: 'FreeRTOS多任务操作系统实验', color: 'from-cyan-400 to-blue-500' },
      ],
      envLink: 'lab-detail',
    },
    {
      id: 'lab-thingsboard',
      title: 'ThingsBoard',
      category: '平台型',
      major: '物联网',
      subCategory: 'ThingsBoard',
      description: '实验简介：ThingBoard是一个开源的物联...',
      courseCount: 15,
      durationText: '39,149 小时',
      durationValue: 39149 * 60,
      viewCountText: '8,589 浏览人次',
      viewCountValue: 8589,
      iconType: 'iot',
      thumbnailTheme: 'tb-dashboard',
      hotCourses: [
        { title: 'ThingsBoard设备接入与遥测', color: 'from-blue-500 to-indigo-600' },
        { title: '规则链RuleChain智能处理', color: 'from-indigo-400 to-purple-500' },
        { title: '物联网仪表盘实战开发', color: 'from-sky-400 to-blue-500' },
      ],
      envLink: 'lab-detail',
    },
    {
      id: 'lab-2d-designer',
      title: '2D应用设计器',
      category: '平台型',
      major: '工业互联网',
      subCategory: '2D/3D应用设计',
      description: '实验简介：应用设计器2D平台是一款快速...',
      courseCount: 1,
      durationText: '3,549 分钟',
      durationValue: 3549,
      viewCountText: '148 浏览人次',
      viewCountValue: 148,
      iconType: '2d',
      thumbnailTheme: '2d-editor',
      hotCourses: [
        { title: '工业2D组态监控页面开发', color: 'from-blue-400 to-indigo-500' },
        { title: 'SCADA人机界面HMI设计', color: 'from-cyan-400 to-blue-500' },
      ],
      envLink: 'lab-detail',
    },
    {
      id: 'lab-data-labeling',
      title: '数据标注平台实验环境',
      category: '平台型',
      major: '人工智能',
      subCategory: '数据标注',
      description: '实验简介：开源的数据标注工具，支持在...',
      courseCount: 1,
      durationText: '6,164 分钟',
      durationValue: 6164,
      viewCountText: '199 浏览人次',
      viewCountValue: 199,
      iconType: 'label',
      thumbnailTheme: 'label-cvat',
      hotCourses: [
        { title: '计算机视觉目标检测标注', color: 'from-blue-400 to-indigo-500' },
        { title: '自然语言文本分类标注实训', color: 'from-amber-400 to-orange-500' },
      ],
      envLink: 'lab-detail',
    },
    {
      id: 'lab-cv-pytorch',
      title: '计算机视觉实训(PyTorch)',
      category: '容器型',
      major: '人工智能',
      subCategory: '计算机视觉',
      description: '实验简介：PyTorch GPU加速环境，内置YOLO与ResNet...',
      courseCount: 8,
      durationText: '124,560 分钟',
      durationValue: 124560,
      viewCountText: '3,420 浏览人次',
      viewCountValue: 3420,
      iconType: 'cv',
      thumbnailTheme: 'cv-workspace',
      hotCourses: [
        { title: 'YOLO目标检测全流程实训', color: 'from-purple-400 to-indigo-500' },
        { title: 'OpenCV图像处理算法实战', color: 'from-blue-400 to-cyan-500' },
      ],
      envLink: 'jupyter-env',
    },
    {
      id: 'lab-llm-agent',
      title: '大语言模型与智能体开发',
      category: '容器型',
      major: '人工智能',
      subCategory: '大语言模型',
      description: '实验简介：基于开源LLM的LoRA微调与LangChain智能体...',
      courseCount: 12,
      durationText: '188,300 分钟',
      durationValue: 188300,
      viewCountText: '5,210 浏览人次',
      viewCountValue: 5210,
      iconType: 'llm',
      thumbnailTheme: 'llm-workspace',
      hotCourses: [
        { title: 'Prompt工程与RAG知识库构建', color: 'from-indigo-400 to-purple-500' },
        { title: 'LangChain多智能体协作实战', color: 'from-blue-400 to-indigo-600' },
      ],
      envLink: 'jupyter-env',
    },
    {
      id: 'lab-robot-twin',
      title: '工业机器人与数字孪生',
      category: '虚拟系统',
      major: '工业互联网',
      subCategory: '工业数字孪生',
      description: '实验简介：六轴工业机器人运动学建模与虚拟PLC协同...',
      courseCount: 4,
      durationText: '52,400 分钟',
      durationValue: 52400,
      viewCountText: '980 浏览人次',
      viewCountValue: 980,
      iconType: 'robot',
      thumbnailTheme: 'robot-arm',
      hotCourses: [
        { title: '工业机械臂运动规划与示教', color: 'from-amber-400 to-orange-500' },
        { title: '数字孪生智能产线调试', color: 'from-blue-400 to-indigo-500' },
      ],
      envLink: 'lab-detail',
    },
    {
      id: 'lab-blockchain-dev',
      title: '区块链智能合约开发',
      category: '组合型',
      major: '区块链',
      subCategory: '全部',
      description: '实验简介：以太坊/FISCO-BCOS区块链智能合约编写与部署...',
      courseCount: 3,
      durationText: '31,200 分钟',
      durationValue: 31200,
      viewCountText: '620 浏览人次',
      viewCountValue: 620,
      iconType: 'blockchain',
      thumbnailTheme: 'blockchain-ide',
      hotCourses: [
        { title: 'Solidity智能合约开发实战', color: 'from-teal-400 to-emerald-500' },
        { title: '联盟链节点搭建与存证系统', color: 'from-blue-400 to-indigo-500' },
      ],
      envLink: 'lab-detail',
    },
    {
      id: 'lab-ros-autonomous',
      title: 'ROS2 自动驾驶仿真',
      category: '虚拟系统',
      major: '岗位课程',
      subCategory: '全部',
      description: '实验简介：基于Carla与ROS2的激光雷达点云与路径规划...',
      courseCount: 7,
      durationText: '98,600 分钟',
      durationValue: 98600,
      viewCountText: '2,130 浏览人次',
      viewCountValue: 2130,
      iconType: 'ros',
      thumbnailTheme: 'ros-carla',
      hotCourses: [
        { title: 'ROS2节点通信与导航算法', color: 'from-cyan-400 to-blue-500' },
        { title: 'Carla多传感器融合仿真', color: 'from-indigo-400 to-purple-500' },
      ],
      envLink: 'lab-detail',
    },
  ];

  // 过滤与排序
  const filteredLabs = useMemo(() => {
    return labList
      .filter((lab) => {
        // 搜索关键词
        if (
          searchKeyword.trim() &&
          !lab.title.toLowerCase().includes(searchKeyword.toLowerCase()) &&
          !lab.description.toLowerCase().includes(searchKeyword.toLowerCase()) &&
          !lab.major.toLowerCase().includes(searchKeyword.toLowerCase())
        ) {
          return false;
        }
        // 分类筛选
        if (selectedCategory !== '全部' && lab.category !== selectedCategory) {
          return false;
        }
        // 专业筛选
        if (selectedMajor !== '全部' && lab.major !== selectedMajor) {
          return false;
        }
        // 子类筛选
        if (
          selectedSubCategory !== '全部' &&
          lab.subCategory &&
          lab.subCategory !== selectedSubCategory
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (activeSort === 'courses') return b.courseCount - a.courseCount;
        if (activeSort === 'views') return b.viewCountValue - a.viewCountValue;
        if (activeSort === 'usage') return b.durationValue - a.durationValue;
        return 0; // 默认排序
      });
  }, [labList, searchKeyword, selectedCategory, selectedMajor, selectedSubCategory, activeSort]);

  // 渲染卡片缩略图 UI 真实模拟器
  const renderThumbnail = (theme: string, title: string) => {
    switch (theme) {
      case 'jupyter-tf':
        return (
          <div className="w-full h-full bg-[#fafbfc] p-2 flex flex-col justify-between text-[9px] font-mono text-slate-700 select-none overflow-hidden relative border-b border-slate-100">
            {/* 顶部菜单栏 */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-1 text-slate-400 text-[8px]">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-orange-500">TensorFlow</span>
                <span className="text-slate-300">|</span>
                <span>File</span>
                <span>Edit</span>
                <span>Run</span>
                <span>Kernel</span>
              </div>
              <span className="bg-emerald-100 text-emerald-700 px-1 rounded text-[7px] font-semibold">
                Python 3.10 Idle
              </span>
            </div>
            {/* 代码单元格 */}
            <div className="space-y-1 my-auto">
              <div className="bg-slate-100 p-1.5 rounded border border-slate-200 text-slate-800">
                <div className="text-blue-600 font-semibold">import tensorflow as tf</div>
                <div className="text-slate-500">model = tf.keras.Sequential([...])</div>
                <div className="text-purple-600">model.compile(optimizer='adam')</div>
              </div>
              <div className="bg-white p-1 rounded border border-slate-100 text-[8px] text-slate-500 flex items-center justify-between">
                <span>Epoch 10/10 - loss: 0.024 - acc: 0.989</span>
                <span className="text-emerald-600 font-bold">Done (1.2s)</span>
              </div>
            </div>
            {/* 水印 */}
            <div className="text-right text-[8px] text-blue-500/80 font-sans font-medium tracking-tight">
              ◆ 新大陆科技集团
            </div>
          </div>
        );

      case 'lowcode-ui':
        return (
          <div className="w-full h-full bg-[#f0f4f9] p-2 flex flex-col justify-between select-none overflow-hidden relative border-b border-slate-100">
            <div className="flex items-center justify-between text-[8px] bg-white px-2 py-0.5 rounded shadow-2xs text-slate-600">
              <span className="font-semibold text-blue-600">DragTrack 页面设计</span>
              <div className="flex space-x-1">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5 my-1">
              <div className="bg-white p-1 rounded shadow-2xs text-center border border-slate-200">
                <div className="w-4 h-4 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[8px]">
                  💡
                </div>
                <span className="text-[7px] text-slate-500">照明控制</span>
              </div>
              <div className="bg-white p-1 rounded shadow-2xs text-center border border-slate-200">
                <div className="w-4 h-4 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[8px]">
                  🌡️
                </div>
                <span className="text-[7px] text-slate-500">温湿监控</span>
              </div>
              <div className="bg-white p-1 rounded shadow-2xs text-center border border-slate-200">
                <div className="w-4 h-4 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[8px]">
                  📊
                </div>
                <span className="text-[7px] text-slate-500">电量统计</span>
              </div>
            </div>
            <div className="text-right text-[8px] text-blue-500/80 font-sans font-medium">
              ◆ 新大陆科技集团
            </div>
          </div>
        );

      case 'simulation-wires':
        return (
          <div className="w-full h-full bg-[#1e293b] p-2 flex flex-col justify-between select-none overflow-hidden relative text-white border-b border-slate-100">
            <div className="flex items-center justify-between text-[8px] text-slate-300 border-b border-slate-700 pb-1">
              <span className="font-semibold text-cyan-400">3D工程虚仿接线排布</span>
              <span className="text-[7px] bg-slate-800 px-1 rounded">220V AC / 24V DC</span>
            </div>
            <div className="flex items-center justify-around my-1 relative">
              <div className="w-8 h-10 bg-slate-800 border border-cyan-500/60 rounded flex flex-col items-center justify-center text-[7px]">
                <Cpu className="w-3.5 h-3.5 text-cyan-400 mb-0.5" />
                <span>PLC</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-amber-400/80 flex items-center justify-center bg-amber-500/10 text-[7px] text-amber-300">
                电机
              </div>
              <div className="w-8 h-10 bg-slate-800 border border-emerald-500/60 rounded flex flex-col items-center justify-center text-[7px]">
                <Box className="w-3.5 h-3.5 text-emerald-400 mb-0.5" />
                <span>变频器</span>
              </div>
            </div>
            <div className="text-right text-[8px] text-cyan-400/80 font-sans font-medium">
              ◆ 新大陆科技集团
            </div>
          </div>
        );

      case '3d-editor':
        return (
          <div className="w-full h-full bg-[#0f172a] p-2 flex flex-col justify-between select-none overflow-hidden relative text-white border-b border-slate-100">
            <div className="flex items-center justify-between text-[8px] text-slate-400">
              <span className="text-indigo-400 font-semibold">3D Scene Designer</span>
              <span className="text-[7px] text-slate-500">Mesh / Light / Camera</span>
            </div>
            <div className="h-12 bg-slate-900/80 rounded border border-indigo-500/40 flex items-center justify-center relative overflow-hidden">
              <div className="w-8 h-8 border-2 border-dashed border-indigo-400 rotate-12 flex items-center justify-center">
                <Box className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="absolute top-1 left-2 text-[7px] text-emerald-400">XYZ: 0.0, 1.2, 0.0</div>
            </div>
            <div className="text-right text-[8px] text-indigo-400/80 font-sans font-medium">
              ◆ 新大陆科技集团
            </div>
          </div>
        );

      case 'cloud-arch':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#f0f7ff] to-[#e1effe] p-2 flex flex-col justify-between select-none overflow-hidden relative border-b border-slate-100">
            <div className="flex items-center justify-between text-[8px]">
              <span className="font-bold text-blue-700">NLECloud 行业云平台</span>
              <Cloud className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="flex items-center justify-center my-1">
              <div className="bg-white/90 p-1.5 rounded-lg shadow-2xs border border-blue-200 flex items-center space-x-2 text-[8px]">
                <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[9px]">
                  ☁
                </div>
                <div>
                  <div className="font-bold text-slate-800">云网关与服务池</div>
                  <div className="text-slate-400 text-[7px]">24+ 行业应用模板已就绪</div>
                </div>
              </div>
            </div>
            <div className="text-right text-[8px] text-blue-600/80 font-sans font-medium">
              ◆ 新大陆科技集团
            </div>
          </div>
        );

      case 'renode-terminal':
        return (
          <div className="w-full h-full bg-[#090d16] p-2 flex flex-col justify-between text-emerald-400 font-mono text-[8px] select-none overflow-hidden relative border-b border-slate-100">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-0.5">
              <span className="font-bold text-white tracking-widest text-[9px]">RENODE</span>
              <span className="text-[7px]">v1.14.0</span>
            </div>
            <div className="space-y-0.5 my-auto">
              <div>&gt; mach create &quot;stm32f4&quot;</div>
              <div className="text-slate-400">&gt; machine LoadPlatformDescription @platforms/boards/stm32f4.repl</div>
              <div className="text-cyan-300">&gt; sysbus.cpu StartExecution()</div>
            </div>
            <div className="text-right text-[8px] text-blue-400/80 font-sans font-medium">
              ◆ 新大陆科技集团
            </div>
          </div>
        );

      case 'chip-circuit':
        return (
          <div className="w-full h-full bg-[#111827] p-2 flex flex-col justify-between select-none overflow-hidden relative text-white border-b border-slate-100">
            <div className="flex items-center justify-between text-[8px] text-slate-400">
              <span className="text-cyan-400 font-semibold">嵌入式微控制器仿真</span>
              <Cpu className="w-3 h-3 text-cyan-400" />
            </div>
            <div className="flex items-center justify-center space-x-2 my-1">
              <div className="w-10 h-10 bg-slate-800 border border-cyan-500 rounded flex flex-col items-center justify-center text-[7px]">
                <span className="font-bold text-cyan-300">STM32</span>
                <span className="text-slate-400 text-[6px]">ARM Cortex</span>
              </div>
              <div className="text-[7px] text-slate-400 space-y-0.5">
                <div>GPIO: 16 Pin Active</div>
                <div>UART: 115200 bps</div>
                <div>Timer: OK</div>
              </div>
            </div>
            <div className="text-right text-[8px] text-blue-400/80 font-sans font-medium">
              ◆ 新大陆科技集团
            </div>
          </div>
        );

      case 'tb-dashboard':
        return (
          <div className="w-full h-full bg-[#1e293b] p-2 flex flex-col justify-between select-none overflow-hidden relative text-white border-b border-slate-100">
            <div className="flex items-center justify-between text-[8px] text-slate-300">
              <span className="font-bold text-blue-400">ThingsBoard IoT</span>
              <span className="text-[7px] text-emerald-400">● Live Stream</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 my-1">
              <div className="bg-slate-800/90 p-1 rounded border border-slate-700 text-center">
                <div className="text-[7px] text-slate-400">设备总数</div>
                <div className="text-[10px] font-bold text-cyan-400">1,280</div>
              </div>
              <div className="bg-slate-800/90 p-1 rounded border border-slate-700 text-center">
                <div className="text-[7px] text-slate-400">遥测消息/秒</div>
                <div className="text-[10px] font-bold text-emerald-400">542 msg</div>
              </div>
            </div>
            <div className="text-right text-[8px] text-blue-400/80 font-sans font-medium">
              ◆ 新大陆科技集团
            </div>
          </div>
        );

      case '2d-editor':
        return (
          <div className="w-full h-full bg-[#182234] p-2 flex flex-col justify-between select-none overflow-hidden relative text-white border-b border-slate-100">
            <div className="flex items-center justify-between text-[8px] text-slate-400">
              <span className="text-cyan-400 font-semibold">2D 组态应用设计器</span>
              <span className="text-[7px] text-slate-500">HMI Design</span>
            </div>
            <div className="flex items-center justify-around my-1">
              <div className="w-6 h-6 border border-dashed border-cyan-400 rounded flex items-center justify-center text-[8px]">
                🎛
              </div>
              <div className="w-6 h-6 border border-dashed border-emerald-400 rounded flex items-center justify-center text-[8px]">
                📈
              </div>
              <div className="w-6 h-6 border border-dashed border-amber-400 rounded flex items-center justify-center text-[8px]">
                🔘
              </div>
            </div>
            <div className="text-right text-[8px] text-blue-400/80 font-sans font-medium">
              ◆ 新大陆科技集团
            </div>
          </div>
        );

      case 'label-cvat':
        return (
          <div className="w-full h-full bg-[#f8fafc] p-2 flex flex-col justify-between select-none overflow-hidden relative text-slate-800 border-b border-slate-100">
            <div className="flex items-center justify-between text-[8px] text-slate-500">
              <span className="font-semibold text-blue-600">CVAT 数据标注平台</span>
              <span className="text-[7px] bg-blue-100 text-blue-700 px-1 rounded">BBox / Poly</span>
            </div>
            <div className="grid grid-cols-4 gap-1 my-1">
              <div className="h-8 bg-slate-200 rounded relative border border-blue-400 flex items-center justify-center">
                <span className="text-[6px] bg-blue-500 text-white px-0.5 absolute -top-1 left-0 rounded">
                  Car
                </span>
                <span className="text-[8px]">🚗</span>
              </div>
              <div className="h-8 bg-slate-200 rounded relative border border-emerald-400 flex items-center justify-center">
                <span className="text-[6px] bg-emerald-500 text-white px-0.5 absolute -top-1 left-0 rounded">
                  Person
                </span>
                <span className="text-[8px]">🚶</span>
              </div>
              <div className="h-8 bg-slate-200 rounded relative border border-purple-400 flex items-center justify-center">
                <span className="text-[6px] bg-purple-500 text-white px-0.5 absolute -top-1 left-0 rounded">
                  Traffic
                </span>
                <span className="text-[8px]">🚦</span>
              </div>
              <div className="h-8 bg-slate-200 rounded relative border border-amber-400 flex items-center justify-center">
                <span className="text-[6px] bg-amber-500 text-white px-0.5 absolute -top-1 left-0 rounded">
                  Bike
                </span>
                <span className="text-[8px]">🚲</span>
              </div>
            </div>
            <div className="text-right text-[8px] text-blue-600/80 font-sans font-medium">
              ◆ 新大陆科技集团
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-gradient-to-tr from-slate-800 to-slate-900 p-2 flex flex-col justify-between select-none overflow-hidden relative text-white border-b border-slate-100">
            <div className="flex items-center justify-between text-[8px] text-slate-400">
              <span className="text-cyan-400 font-semibold">{title}</span>
              <Terminal className="w-3 h-3 text-cyan-400" />
            </div>
            <div className="flex items-center justify-center text-xs text-slate-300 font-bold">
              {title}
            </div>
            <div className="text-right text-[8px] text-blue-400/80 font-sans font-medium">
              ◆ 新大陆科技集团
            </div>
          </div>
        );
    }
  };

  // 根据分类获取对应的 Tag 样式（完全匹配截图）
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case '容器型':
        return 'bg-[#7c3aed] text-white'; // 紫色
      case '平台型':
        return 'bg-[#3b5998] text-white'; // 深蓝/海军蓝
      case '组合型':
        return 'bg-[#0284c7] text-white'; // 青蓝
      case '虚拟系统':
        return 'bg-[#475569] text-white'; // 墨灰
      default:
        return 'bg-blue-600 text-white';
    }
  };

  // 渲染图标
  const renderCardIcon = (iconType: string) => {
    switch (iconType) {
      case 'jupyter':
        return (
          <div className="w-4 h-4 rounded bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Code2 className="w-3 h-3" />
          </div>
        );
      case 'lowcode':
        return (
          <div className="w-4 h-4 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Layers className="w-3 h-3" />
          </div>
        );
      case 'simulation':
        return (
          <div className="w-4 h-4 rounded bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
            <Cpu className="w-3 h-3" />
          </div>
        );
      case '3d':
        return (
          <div className="w-4 h-4 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Box className="w-3 h-3" />
          </div>
        );
      case 'cloud':
        return (
          <div className="w-4 h-4 rounded bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <Cloud className="w-3 h-3" />
          </div>
        );
      case 'renode':
        return (
          <div className="w-4 h-4 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Terminal className="w-3 h-3" />
          </div>
        );
      case 'chip':
        return (
          <div className="w-4 h-4 rounded bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
            <Cpu className="w-3 h-3" />
          </div>
        );
      case 'iot':
        return (
          <div className="w-4 h-4 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Database className="w-3 h-3" />
          </div>
        );
      case '2d':
        return (
          <div className="w-4 h-4 rounded bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Monitor className="w-3 h-3" />
          </div>
        );
      case 'label':
        return (
          <div className="w-4 h-4 rounded bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3" />
          </div>
        );
      default:
        return (
          <div className="w-4 h-4 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Code2 className="w-3 h-3" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f9] flex flex-col font-sans text-slate-800">
      {/* 顶部 Header (统一导航栏) */}
      <Header onNavigate={onNavigate} activeNav="lab-hall" />

      {/* 页面顶部：实验环境 Banner 标题与搜索框 */}
      <div className="bg-[#eef5fd] border-b border-slate-200/80 px-6 sm:px-12 py-5">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* 左侧：3D立体图标 + 标题与副标题 */}
          <div className="flex items-center space-x-3.5">
            {/* 3D立体质感环境图标 */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 p-0.5 shadow-md flex items-center justify-center text-white relative shrink-0">
              <div className="w-full h-full bg-white/10 backdrop-blur-xs rounded-[10px] flex items-center justify-center">
                <Box className="w-6 h-6 text-white stroke-[2.2]" />
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-300 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>实验环境</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                数十种环境赋能智能实训教学
              </p>
            </div>
          </div>

          {/* 右侧：关键字搜索框 */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="请输入关键字进行搜索"
              className="w-full bg-white border border-slate-200 rounded-md py-1.5 pl-3.5 pr-9 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-2xs"
            />
            <button
              onClick={() => {}}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 筛选过滤区域 (严格按照截图样式) */}
      <div className="bg-white border-b border-slate-200 px-6 sm:px-12 py-4">
        <div className="max-w-[1440px] mx-auto space-y-3">
          {/* 分类行 */}
          <div className="flex items-center text-xs">
            <span className="text-slate-500 w-16 shrink-0 font-normal">分 类：</span>
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {categories.map((c) => {
                const isSelected = selectedCategory === c;
                return (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3 py-1 rounded transition-colors ${
                      isSelected
                        ? 'border border-blue-500 bg-blue-50/80 text-blue-600 font-medium'
                        : 'text-slate-700 hover:text-blue-500'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 可折叠的专业与子类筛选 */}
          {isFilterExpanded && (
            <>
              {/* 专业行 */}
              <div className="flex items-center text-xs pt-1">
                <span className="text-slate-500 w-16 shrink-0 font-normal">专 业：</span>
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  {majors.map((m) => {
                    const isSelected = selectedMajor === m;
                    return (
                      <button
                        key={m}
                        onClick={() => {
                          setSelectedMajor(m);
                          setSelectedSubCategory('全部');
                        }}
                        className={`px-3 py-1 rounded transition-colors ${
                          isSelected
                            ? 'border border-blue-500 bg-blue-50/80 text-blue-600 font-medium'
                            : 'text-slate-700 hover:text-blue-500'
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 子类行 */}
              <div className="flex items-center text-xs pt-1">
                <span className="text-slate-500 w-16 shrink-0 font-normal">子 类：</span>
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  {subCategories.map((sub) => {
                    const isSelected = selectedSubCategory === sub;
                    return (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubCategory(sub)}
                        className={`px-3 py-1 rounded transition-colors ${
                          isSelected
                            ? 'border border-blue-500 bg-blue-50/80 text-blue-600 font-medium'
                            : 'text-slate-700 hover:text-blue-500'
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>

                {/* 右下角收起/展开按钮 */}
                <button
                  onClick={() => setIsFilterExpanded(false)}
                  className="text-xs text-slate-500 hover:text-blue-500 flex items-center space-x-1 shrink-0 ml-4 transition-colors"
                >
                  <span>收起</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {!isFilterExpanded && (
            <div className="flex justify-end pt-1">
              <button
                onClick={() => setIsFilterExpanded(true)}
                className="text-xs text-slate-500 hover:text-blue-500 flex items-center space-x-1 transition-colors"
              >
                <span>展开</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 列表主体区域 */}
      <main className="max-w-[1440px] mx-auto w-full px-6 sm:px-12 py-5 flex-1 space-y-4">
        {/* 排序 Tab 工具栏 */}
        <div className="flex items-center justify-between text-xs pb-1">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setActiveSort('default')}
              className={`transition-colors ${
                activeSort === 'default'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-blue-500'
              }`}
            >
              默认排序
            </button>
            <button
              onClick={() => setActiveSort('courses')}
              className={`transition-colors ${
                activeSort === 'courses'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-blue-500'
              }`}
            >
              最多课程
            </button>
            <button
              onClick={() => setActiveSort('views')}
              className={`transition-colors ${
                activeSort === 'views'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-blue-500'
              }`}
            >
              最多浏览
            </button>
            <button
              onClick={() => setActiveSort('usage')}
              className={`transition-colors ${
                activeSort === 'usage'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-blue-500'
              }`}
            >
              使用最多
            </button>
          </div>

          <div className="text-slate-400 text-xs">
            共 <span className="text-blue-600 font-semibold">{filteredLabs.length}</span> 个实验环境
          </div>
        </div>

        {/* 5 列卡片网格布局 (在大屏 5 列，中屏 3-4 列，小屏 1-2 列，完美契合截图) */}
        {filteredLabs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
            <Box className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm">未找到符合条件的实验环境</p>
            <button
              onClick={() => {
                setSelectedCategory('全部');
                setSelectedMajor('全部');
                setSelectedSubCategory('全部');
                setSearchKeyword('');
              }}
              className="mt-3 px-4 py-1.5 bg-blue-50 text-blue-600 text-xs rounded-lg hover:bg-blue-100 transition-colors"
            >
              重置所有筛选
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredLabs.map((lab) => (
              <div
                key={lab.id}
                onClick={() => {
                  if (lab.envLink === 'jupyter-env') {
                    onNavigate('jupyter-env');
                  } else {
                    onNavigate('lab-detail');
                  }
                }}
                className="bg-white rounded-lg border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* 顶部缩略图区域 (高保真还原截图中的 IDE / 拓扑 / 3D 界面截图) */}
                  <div className="h-32 w-full bg-slate-50 relative overflow-hidden">
                    {renderThumbnail(lab.thumbnailTheme, lab.title)}
                  </div>

                  {/* 卡片主体内容 */}
                  <div className="p-3 space-y-2">
                    {/* 标题行 + 分类标签 */}
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        {renderCardIcon(lab.iconType)}
                        <h3 className="font-semibold text-[13px] text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                          {lab.title}
                        </h3>
                      </div>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 leading-tight ${getCategoryBadge(
                          lab.category
                        )}`}
                      >
                        {lab.category}
                      </span>
                    </div>

                    {/* 实验简介 */}
                    <p className="text-[11px] text-slate-500 truncate leading-normal">
                      {lab.description}
                    </p>

                    {/* 统计指标行 (3 栏图标: 📊 门数 / ⏱️ 时长 / 📈 浏览人次) */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <div className="flex items-center space-x-1">
                        <BarChart2 className="w-3 h-3 text-blue-500 shrink-0" />
                        <span>{lab.courseCount} 门</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-blue-500 shrink-0" />
                        <span>{lab.durationText}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3 text-blue-500 shrink-0" />
                        <span>{lab.viewCountText}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 卡片底部操作栏 (左侧热门课程 + 右侧立即体验按钮) */}
                <div className="px-3 pb-3 pt-1 flex items-center justify-between border-t border-slate-100 mt-1">
                  {/* 左侧：热门课程封面小缩略图 */}
                  <div className="flex items-center space-x-1 min-w-0">
                    <span className="text-[10px] text-slate-500 shrink-0 flex items-center">
                      <span className="text-orange-500 mr-0.5">🔥</span> 热门课程:
                    </span>
                    <div className="flex items-center -space-x-1">
                      {lab.hotCourses.map((c, i) => (
                        <div
                          key={i}
                          title={c.title}
                          className={`w-3.5 h-3.5 rounded-xs bg-gradient-to-tr ${c.color} border border-white shadow-2xs`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 右侧：立即体验蓝色按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (lab.envLink === 'jupyter-env') {
                        onNavigate('jupyter-env');
                      } else {
                        onNavigate('lab-detail');
                      }
                    }}
                    className="bg-[#2563eb] hover:bg-blue-700 text-white text-[11px] font-medium px-2.5 py-1 rounded shadow-2xs transition-colors shrink-0"
                  >
                    立即体验
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 右下角悬浮操作区 (如截图中的快捷按钮) */}
      <div className="fixed right-6 bottom-8 flex flex-col space-y-2 z-40">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all relative group"
          title="回到顶部"
        >
          <ArrowUp className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1 py-0.2 rounded-full border border-white">
            56
          </span>
        </button>
      </div>
    </div>
  );
}
