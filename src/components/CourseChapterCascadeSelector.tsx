import React, { useState, useRef, useEffect } from "react";
import {
  BookOpen,
  Search,
  ChevronDown,
  Check,
  X,
  Layers,
  GraduationCap,
  Sparkles,
  FlaskConical,
} from "lucide-react";
import { PLATFORM_COURSES, PlatformCourseItem, PlatformCourseChapter } from "../data/mockData";

export interface CourseChapterCascadeSelectorProps {
  selectedCourseName: string;
  selectedChapter: string;
  onCourseChange: (courseName: string, courseItem?: PlatformCourseItem) => void;
  onChapterChange: (chapterName: string, chapterItem?: PlatformCourseChapter) => void;
  coursesList?: PlatformCourseItem[];
  label?: string;
  optionalText?: string;
  className?: string;
}

export const CourseChapterCascadeSelector: React.FC<CourseChapterCascadeSelectorProps> = ({
  selectedCourseName,
  selectedChapter,
  onCourseChange,
  onChapterChange,
  coursesList = PLATFORM_COURSES,
  label = "关联到教学课程与实验",
  optionalText = "(可选)",
  className = "",
}) => {
  // 课程下拉与搜索状态
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [courseSearchKeyword, setCourseSearchKeyword] = useState("");
  const courseDropdownRef = useRef<HTMLDivElement>(null);
  const courseSearchInputRef = useRef<HTMLInputElement>(null);

  // 章节下拉状态
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);
  const chapterDropdownRef = useRef<HTMLDivElement>(null);

  // 获取当前选中的课程对象
  const currentCourse = coursesList.find(
    (c) => c.name === selectedCourseName || c.id === selectedCourseName
  );

  // 过滤后的课程列表
  const filteredCourses = coursesList.filter((course) => {
    if (!courseSearchKeyword.trim()) return true;
    const kw = courseSearchKeyword.trim().toLowerCase();
    return (
      course.name.toLowerCase().includes(kw) ||
      course.category.toLowerCase().includes(kw) ||
      (course.code && course.code.toLowerCase().includes(kw)) ||
      (course.teacher && course.teacher.toLowerCase().includes(kw)) ||
      course.chapters.some((ch) => ch.title.toLowerCase().includes(kw))
    );
  });

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        courseDropdownRef.current &&
        !courseDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCourseDropdownOpen(false);
      }
      if (
        chapterDropdownRef.current &&
        !chapterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsChapterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 打开课程下拉框时自动聚焦搜索输入框
  useEffect(() => {
    if (isCourseDropdownOpen && courseSearchInputRef.current) {
      setTimeout(() => {
        courseSearchInputRef.current?.focus();
      }, 50);
    }
  }, [isCourseDropdownOpen]);

  // 选择课程
  const handleSelectCourse = (course: PlatformCourseItem) => {
    onCourseChange(course.name, course);
    // 如果当前选中的章节不在新课程的章节列表里，则默认选中新课程的第一个章节
    if (course.chapters && course.chapters.length > 0) {
      onChapterChange(course.chapters[0].title, course.chapters[0]);
    } else {
      onChapterChange("");
    }
    setIsCourseDropdownOpen(false);
    setCourseSearchKeyword("");
  };

  // 清除课程
  const handleClearCourse = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCourseChange("");
    onChapterChange("");
    setIsCourseDropdownOpen(false);
  };

  // 选择章节
  const handleSelectChapter = (chapter: PlatformCourseChapter) => {
    onChapterChange(chapter.title, chapter);
    setIsChapterDropdownOpen(false);
  };

  // 清除章节
  const handleClearChapter = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChapterChange("");
    setIsChapterDropdownOpen(false);
  };

  return (
    <div className={`bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 ${className}`}>
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>{label}</span>
          <span className="text-slate-400 font-normal">{optionalText}</span>
        </div>
        {selectedCourseName && (
          <button
            type="button"
            onClick={(e) => handleClearCourse(e)}
            className="text-[11px] text-slate-400 hover:text-red-600 transition-colors flex items-center gap-0.5"
            title="清空当前课程与章节关联"
          >
            <X className="w-3 h-3" />
            <span>清空关联</span>
          </button>
        )}
      </div>

      {/* 级联选择区域：左侧可搜索课程下拉框，右侧关联章节下拉框 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* ========================================================================= */}
        {/* 1. 课程可搜索下拉框 (Searchable Course Dropdown)                         */}
        {/* ========================================================================= */}
        <div className="space-y-1 relative" ref={courseDropdownRef}>
          <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-slate-400" />
            <span>关联课程 (可搜索)</span>
          </label>

          {/* 课程下拉触发器按钮 */}
          <div
            onClick={() => setIsCourseDropdownOpen((prev) => !prev)}
            className={`w-full p-2 bg-white border rounded-lg text-xs flex items-center justify-between cursor-pointer transition-all shadow-2xs ${
              isCourseDropdownOpen
                ? "border-blue-500 ring-2 ring-blue-500/20"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-2 overflow-hidden pr-1">
              {currentCourse ? (
                <>
                  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-bold shrink-0">
                    {currentCourse.category}
                  </span>
                  <span className="font-semibold text-slate-900 truncate" title={currentCourse.name}>
                    {currentCourse.name}
                  </span>
                </>
              ) : selectedCourseName ? (
                <span className="font-semibold text-slate-900 truncate">
                  {selectedCourseName}
                </span>
              ) : (
                <span className="text-slate-400">选择关联教学课程...</span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {selectedCourseName && (
                <button
                  type="button"
                  onClick={handleClearCourse}
                  className="p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                  title="清除课程"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isCourseDropdownOpen ? "rotate-180 text-blue-600" : ""
                }`}
              />
            </div>
          </div>

          {/* 课程下拉浮层面板 */}
          {isCourseDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
              {/* 搜索框 */}
              <div className="p-2 border-b border-slate-100 bg-slate-50/80">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    ref={courseSearchInputRef}
                    type="text"
                    value={courseSearchKeyword}
                    onChange={(e) => setCourseSearchKeyword(e.target.value)}
                    placeholder="输入课程名称/专业/教师快速搜索..."
                    className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 shadow-2xs"
                  />
                  {courseSearchKeyword && (
                    <button
                      type="button"
                      onClick={() => setCourseSearchKeyword("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* 课程列表滚动区 */}
              <div className="max-h-56 overflow-y-auto p-1.5 space-y-1 divide-y divide-slate-50">
                {filteredCourses.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs space-y-1">
                    <div>未找到匹配课程 "{courseSearchKeyword}"</div>
                    <div className="text-[10px] text-slate-400">可尝试搜索 "人工智能"、"视觉"、"Python" 等关键字</div>
                  </div>
                ) : (
                  filteredCourses.map((course) => {
                    const isSelected = selectedCourseName === course.name;
                    return (
                      <div
                        key={course.id}
                        onClick={() => handleSelectCourse(course)}
                        className={`p-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between text-xs group ${
                          isSelected
                            ? "bg-blue-50/80 border border-blue-200 text-blue-900"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.2 bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-700 rounded text-[10px] font-medium shrink-0">
                              {course.category}
                            </span>
                            <span className="font-bold text-slate-900 truncate">
                              {course.name}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            {course.teacher && <span>授课: {course.teacher}</span>}
                            <span>•</span>
                            <span className="text-blue-600 font-medium">
                              {course.chapters.length} 个实验章节
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2. 章节/实验级联下拉框 (Cascaded Chapter Dropdown)                       */}
        {/* ========================================================================= */}
        <div className="space-y-1 relative" ref={chapterDropdownRef}>
          <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" />
            <span>关联章节 / 实验</span>
          </label>

          {/* 章节下拉触发器 */}
          <div
            onClick={() => {
              if (selectedCourseName) {
                setIsChapterDropdownOpen((prev) => !prev);
              }
            }}
            className={`w-full p-2 rounded-lg text-xs flex items-center justify-between transition-all shadow-2xs ${
              !selectedCourseName
                ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                : isChapterDropdownOpen
                ? "bg-white border-blue-500 ring-2 ring-blue-500/20 cursor-pointer"
                : "bg-white border-slate-200 hover:border-slate-300 cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-1.5 overflow-hidden pr-1">
              <FlaskConical className={`w-3.5 h-3.5 shrink-0 ${selectedChapter ? "text-blue-600" : "text-slate-400"}`} />
              <span className={`truncate ${selectedChapter ? "font-semibold text-slate-900" : "text-slate-400"}`} title={selectedChapter || ""}>
                {!selectedCourseName
                  ? "请先选择左侧关联课程"
                  : selectedChapter || "请选择关联实验章节..."}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {selectedChapter && selectedCourseName && (
                <button
                  type="button"
                  onClick={handleClearChapter}
                  className="p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                  title="清除章节"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isChapterDropdownOpen ? "rotate-180 text-blue-600" : ""
                }`}
              />
            </div>
          </div>

          {/* 章节下拉面板 */}
          {isChapterDropdownOpen && selectedCourseName && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
              <div className="p-2 border-b border-slate-100 bg-slate-50/80 text-[11px] text-slate-500 font-medium flex items-center justify-between">
                <span>{currentCourse?.name || selectedCourseName} 所属章节：</span>
                <span className="text-blue-600 font-bold">
                  {currentCourse?.chapters.length || 0} 个可选实验
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto p-1.5 space-y-1">
                {currentCourse && currentCourse.chapters.length > 0 ? (
                  currentCourse.chapters.map((chapter) => {
                    const isSelected = selectedChapter === chapter.title;
                    return (
                      <div
                        key={chapter.id}
                        onClick={() => handleSelectChapter(chapter)}
                        className={`p-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between text-xs ${
                          isSelected
                            ? "bg-blue-50 border border-blue-200 text-blue-900 font-bold"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0 pr-2">
                          <div className="truncate" title={chapter.title}>
                            {chapter.title}
                          </div>
                          {chapter.labName && (
                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                              <span>对应实验环境: {chapter.labName}</span>
                            </div>
                          )}
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-blue-600 stroke-[2.5] shrink-0" />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 text-center text-slate-400 text-xs">
                    该课程暂无预设章节，可在文本框中自定义输入
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 当前关联状态小提示 */}
      {selectedCourseName && (
        <div className="text-[11px] text-blue-700 bg-blue-50/70 border border-blue-100 p-2 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">
              已绑定：<strong className="font-semibold">{selectedCourseName}</strong>
              {selectedChapter && ` ➔ ${selectedChapter}`}
            </span>
          </div>
          <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-medium shrink-0 ml-2">
            实验自动挂载
          </span>
        </div>
      )}
    </div>
  );
};
