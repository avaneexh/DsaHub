import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  BookOpen,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";
import Navbar from "../components/Navbar";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
    submission,
  } = useSubmissionStore();
  
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [editorTheme, setEditorTheme] = useState("vs-dark");

  const { executeCode, isExecuting, isSubmitting, } = useExecutionStore();

  const containerRef = useRef(null);
  const [leftWidth, setLeftWidth] = useState(520); 
  const [isResizing, setIsResizing] = useState(false);
  const [editorProportion, setEditorProportion] = useState(0.7);
  const [isVertResizing, setIsVertResizing] = useState(false);

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(problem.codeSnippets?.[selectedLanguage.toLocaleUpperCase()] || submission?.sourceCode || "");
      setTestCases(
        (problem.testCases || []).map((tc) => ({
          input: tc.input,
          output: tc.output,
        }))
      );
    }
    // console.log("source code",problem );
    // console.log("editor code",code);
    // console.log("editor selectedLanguage",selectedLanguage);
    
  }, [problem, selectedLanguage, submission]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  useEffect(() => {
    try {
      const isDark = document.documentElement.classList.contains("dark");
      setEditorTheme(isDark ? "vs-dark" : "light");
    } catch (e) {
      // fallback
      setEditorTheme("vs-dark");
    }
  }, []);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem?.codeSnippets?.[lang] || "");
  };

  const handleRunCode = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      console.log("language_id",language_id);
      
      const stdin = (problem?.testCases || []).map((tc) => tc.input);
      const expected_outputs = (problem?.testCases || []).map((tc) => tc.output);
      const res = executeCode(code, language_id, stdin, expected_outputs, id);
      // console.log("res", res );      
    } catch (error) {
      console.error("Error executing code", error);
    }
  };

  const handleSubmitSolution = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem?.testCases.map((testcase) => testcase.input);
      const expected_outputs = problem.testCases.map((tc) => tc.output);

      const subRes = executeCode(code, language_id, stdin, expected_outputs, id, true).then(
        () => {
          getSubmissionForProblem(id);
          getSubmissionCountForProblem(id);

          if (activeTab !== "submissions") {
            setActiveTab("submissions");
          }
        }
      );
    } catch (error) {
      console.log("Error submitting solution", error);
    }
  };


  useEffect(() => {
    function onMouseMove(e) {
      if (!isResizing || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let target = e.clientX - rect.left;
      const min = 300;
      const max = rect.width - 360;
      if (target < min) target = min;
      if (target > max) target = max;
      setLeftWidth(target);
    }
    function onMouseUp() {
      setIsResizing(false);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    const handleUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mouseup", handleUp);
    window.addEventListener("mouseleave", handleUp);

    return () => {
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("mouseleave", handleUp);
    };
  }, []);


  // Vertical mouse move handler for editor/testcases split inside right pane
  useEffect(() => {
    function onMouseMove(e) {
      if (!isVertResizing || !containerRef.current) return;
      const rightPane = containerRef.current.querySelector(".right-pane");
      if (!rightPane) return;
      const rect = rightPane.getBoundingClientRect();
      const offsetY = e.clientY - rect.top;
      let proportion = offsetY / rect.height;
      if (proportion < 0.15) proportion = 0.15;
      if (proportion > 0.95) proportion = 0.95;
      setEditorProportion(proportion);
    }
    function onMouseUp() {
      setIsVertResizing(false);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isVertResizing]);

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-100 dark:bg-neutral-900 p-4">
        <div className="w-full max-w-md rounded-2xl border border-neutral-300/60 bg-white/80 dark:bg-neutral-900/70 dark:border-neutral-700 shadow py-8 px-6 text-center">
          <span className="loading loading-spinner loading-lg text-neutral-800 dark:text-neutral-200" />
          <p className="mt-4 text-neutral-700 dark:text-neutral-300">Loading problem...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="text-base text-neutral-800 dark:text-neutral-200 mb-6">{problem.description}</p>

            {problem.examples && (
              <>
                <h3 className="text-lg font-semibold mb-3">Examples</h3>
                {Object.entries(problem.examples).map(([lang, example], idx) => (
                  <div key={lang} className="mb-5 rounded-xl border border-neutral-200/70 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900/60">
                    <div className="mb-3">
                      <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Input</div>
                      <pre className="mt-2 rounded-md bg-black/90 text-white px-3 py-2 font-mono text-sm">{example.input}</pre>
                    </div>
                    <div className="mb-3">
                      <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Output</div>
                      <pre className="mt-2 rounded-md bg-black/90 text-white px-3 py-2 font-mono text-sm">{example.output}</pre>
                    </div>
                    {example.explanation && (
                      <div>
                        <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Explanation</div>
                        <p className="mt-2 text-neutral-700 dark:text-neutral-300">{example.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-lg font-semibold mb-3">Constraints</h3>
                <div className="rounded-xl border border-neutral-200/70 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-900/60">
                  <pre className="font-mono text-sm text-neutral-800 dark:text-neutral-200">{problem.constraints}</pre>
                </div>
              </>
            )}
          </div>
        );

      case "submissions":
        return <SubmissionsList submissions={submissions} isLoading={isSubmissionsLoading} />;

      case "discussion":
        return <div className="p-4 text-center text-neutral-600 dark:text-neutral-300">No discussions yet</div>;

      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="rounded-xl border border-neutral-200/70 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900/60">
                <pre className="font-mono text-sm text-neutral-800 dark:text-neutral-200">{problem.hints}</pre>
              </div>
            ) : (
              <div className="text-center text-neutral-600 dark:text-neutral-300">No hints available</div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-h-screen overflow-auto hide-scrollbar"> 
      <Navbar />
      <div className="max-h-screen bg-neutral-50 dark:bg-neutral-950 ">
        <div className="mx-auto px-4" ref={containerRef}>
          <div
            style={{
              height: "calc(100vh - 64px)",  
              overflow: "hidden",
            }}
          >
          <div
            className="flex flex-col lg:flex-row"
            style={{ height: "100%", minHeight: 0 }} 
          >
            <div
              className="rounded-lg border border-neutral-300/60 bg-neutral-100/60 dark:bg-neutral-900/80 dark:border-neutral-700 shadow overflow-hidden"
              style={{
                width: typeof leftWidth === "number" ? leftWidth : 520,
                minWidth: 300,
                maxWidth: "calc(100% - 360px)",
                height: "100%", 
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="bg-neutral-100/60 dark:bg-neutral-900/80 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4 pt-2">
                  <div>
                    <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">{problem.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                      <span className="inline-flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          Updated{" "}
                          {new Date(problem.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </span>

                      <span className="text-neutral-300">•</span>

                      <span className="inline-flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{submissionCount} Submissions</span>
                      </span>

                      <span className="text-neutral-300">•</span>

                      <span className="inline-flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        <span>95% Success Rate</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className={`inline-flex items-center rounded-full px-3 py-1.5 gap-2 border ${isBookmarked ? "border-neutral-700 text-neutral-900 dark:border-neutral-100 dark:text-neutral-50" : "border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"} bg-transparent`}
                    onClick={() => setIsBookmarked((s) => !s)}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <button className="inline-flex items-center rounded-full px-3 py-1.5 gap-2 border border-neutral-300 text-neutral-700 bg-transparent dark:border-neutral-700 dark:text-neutral-300">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 border-b border-neutral-200/60 dark:border-neutral-700/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`px-3 py-1.5 rounded-full text-sm ${activeTab === "description" ? "bg-neutral-900 text-white dark:bg-neutral-50 dark:text-black" : "bg-transparent text-neutral-700 dark:text-neutral-300 border border-transparent"}`}
                  >
                    <FileText className="w-4 h-4 inline-block mr-2" />
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab("submissions")}
                    className={`px-3 py-1.5 rounded-full text-sm ${activeTab === "submissions" ? "bg-neutral-900 text-white dark:bg-neutral-50 dark:text-black" : "bg-transparent text-neutral-700 dark:text-neutral-300"}`}
                  >
                    <Code2 className="w-4 h-4 inline-block mr-2" />
                    Submissions
                  </button>
                  <button
                    onClick={() => setActiveTab("discussion")}
                    className={`px-3 py-1.5 rounded-full text-sm ${activeTab === "discussion" ? "bg-neutral-900 text-white dark:bg-neutral-50 dark:text-black" : "bg-transparent text-neutral-700 dark:text-neutral-300"}`}
                  >
                    <MessageSquare className="w-4 h-4 inline-block mr-2" />
                    Discussion
                  </button>
                  <button
                    onClick={() => setActiveTab("hints")}
                    className={`px-3 py-1.5 rounded-full text-sm ${activeTab === "hints" ? "bg-neutral-900 text-white dark:bg-neutral-50 dark:text-black" : "bg-transparent text-neutral-700 dark:text-neutral-300"}`}
                  >
                    <Lightbulb className="w-4 h-4 inline-block mr-2" />
                    Hints
                  </button>
                </div>
              </div>

              {/* Scrollable description content */}
              <div className="p-6 overflow-auto" style={{ maxHeight: "100%", minHeight: 0 }}>
                {renderTabContent()}
              </div>
            </div>

            {/* Vertical resizer between left & right (only on lg and above) */}
            <div className="hidden lg:flex items-stretch">
              <div
                onMouseDown={() => {
                  setIsResizing(true);
                  document.body.style.userSelect = "none";
                  document.body.style.cursor = "col-resize";
                }}
                role="separator"
                aria-orientation="vertical"
                className="w-2 cursor-col-resize bg-transparent group"
                aria-hidden
              >
                {/* click area is a bit wider for easier dragging; visible handle is centered */}
                <div className="h-full flex items-center justify-center">
                  {/* handle wrapper: centered, pointer-events-none so drag still hits parent div */}
                  <div className="pointer-events-none flex flex-col items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    {/* dot size + bg adapt to dark/light */}
                    <span className="block w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600"></span>
                    <span className="block w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600"></span>
                    <span className="block w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600"></span>
                  </div>
                </div>

                {/* visual hover hit area (optional subtle bg on hover) */}
                <style jsx>{`
                  /* optional: subtle highlight when hovering the resizer */
                  .group:hover { background-color: rgba(0,0,0,0.02); }
                  @media (prefers-color-scheme: dark) {
                    .group:hover { background-color: rgba(255,255,255,0.03); }
                  }
                `}</style>
              </div>
            </div>

            {/* RIGHT: editor + testcases */}
            <div
              className="flex-1 rounded-lg  border border-neutral-300/60 bg-neutral-100/60 dark:bg-neutral-900/80 dark:border-neutral-700 shadow flex flex-col overflow-hidden right-pane"
              style={{ minWidth: 360, height: "100%", minHeight: 0 }}
            >
              <div className="p-4 border-b border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      inline-flex items-center justify-center 
                      rounded-full 
                      bg-neutral-200 border border-neutral-400 
                      w-10 h-10 
                      dark:bg-neutral-800 dark:border-neutral-600
                      text-neutral-800 dark:text-neutral-200
                    "
                  >
                    <Terminal className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                    Write your code here
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    className="
                      rounded-full 
                      border border-neutral-400 
                      px-3 py-1.5 
                      text-sm 
                      bg-white text-black
                      dark:bg-neutral-900 dark:text-white dark:border-neutral-600
                      focus:outline-none focus:ring-2 focus:ring-neutral-800 dark:focus:ring-neutral-200
                    "
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                  >
                    {Object.keys(problem.codeSnippets || {}).map((lang) => (
                      <option
                        key={lang}
                        value={lang}
                        className="text-black dark:text-white bg-white dark:bg-neutral-900"
                      >
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Editor area (flexed) */}
              <div
                className="editor-area"
                style={{
                  flex: `${editorProportion} 1 0%`,
                  minHeight: 0, // critical: allow child to scroll inside constrained flex container
                }}
              >
                <Editor
                  height="100%"
                  language={selectedLanguage.toLowerCase()}
                  theme={editorTheme}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>

              {/* Horizontal resizer inside right pane */}
              <div
                onMouseDown={() => {
                  setIsVertResizing(true);
                  document.body.style.userSelect = "none";
                  document.body.style.cursor = "row-resize";
                }}
                role="separator"
                aria-orientation="horizontal"
                className="h-2 cursor-row-resize bg-transparent group"
                aria-hidden
              >
                {/* Visible dot handle */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="pointer-events-none flex flex-row items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <span className="block w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600"></span>
                    <span className="block w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600"></span>
                    <span className="block w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600"></span>
                  </div>
                </div>

                {/* Optional hover highlight */}
                <style jsx>{`
                  .group:hover { background-color: rgba(0,0,0,0.03); }
                  @media (prefers-color-scheme: dark) {
                    .group:hover { background-color: rgba(255,255,255,0.03); }
                  }
                `}</style>
              </div>

              {/* Testcases and run area (bottom) */}
              
              <div
                className="p-4 border-t border-neutral-200/60 dark:border-neutral-700/60 bg-neutral-50 dark:bg-neutral-900/60 flex flex-col"
                style={{
                  flex: `${1 - editorProportion} 1 0%`,
                  minHeight: 0,   // allows inner scroll to work
                }}
              >
                {/* FIXED (non-scrollable) top bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 flex-none mb-3">
                  <div className="flex gap-3">
                    <button
                      className={`
                        inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
                        transition
                        ${isExecuting 
                          ? "bg-neutral-400 text-white cursor-wait" 
                          : "bg-neutral-900 text-white hover:-translate-y-px"
                        }
                      `}
                      onClick={handleRunCode}
                      disabled={isExecuting}
                    >
                      {!isExecuting ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <span className="loading loading-spinner" />
                      )}
                      Run Code
                    </button>

                    <button
                      className={`
                        inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
                        transition
                        ${isSubmitting
                          ? "bg-neutral-300 text-neutral-600 border border-neutral-300 cursor-wait"
                          : "bg-white text-neutral-700 border border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                        }
                      `}
                      onClick={handleSubmitSolution}
                      disabled={isSubmitting}
                    >
                      {!isSubmitting ? (
                        <BookOpen className="w-4 h-4" />
                      ) : (
                        <span className="loading loading-spinner" />
                      )}
                      Submit Solution
                    </button>

                  </div>

                  <div className="text-sm text-neutral-600 dark:text-neutral-300">
                    <span className="font-medium">Testcases:</span> {testCases.length}
                  </div>
                </div>

                {/* SCROLLABLE TESTCASES AREA */}
                <div className="mt-4 overflow-auto flex-1 min-h-0">
                  {submission ? (
                    <Submission submission={submission} />
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                          Test Cases
                        </h3>
                      </div>

                      <div className="overflow-x-auto rounded-md">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                              <th className="px-4 py-2">Input</th>
                              <th className="px-4 py-2">Expected Output</th>
                            </tr>
                          </thead>
                          <tbody>
                            {testCases.map((tc, idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? "bg-transparent" : "bg-neutral-50/50 dark:bg-neutral-950/40"}>
                                <td className="px-4 py-3 font-mono text-xs text-neutral-800 dark:text-neutral-200">
                                  {tc.input}
                                </td>
                                <td className="px-4 py-3 font-mono text-xs text-neutral-800 dark:text-neutral-200">
                                  {tc.output}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
       </div>
      </div>
    </div>
  );
};

export default ProblemPage;
