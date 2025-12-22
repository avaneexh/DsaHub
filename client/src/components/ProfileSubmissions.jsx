import React, { useEffect, useState, useMemo } from "react";
import { useSubmissionStore } from "../store/useSubmissionStore";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import {
  Code,
  Terminal,
  Clock,
  HardDrive,
  Check,
  ChevronDown,
  ChevronUp,
  FileCode,
} from "lucide-react";
import { formatSubmissionStatus } from "../lib/utils";
import SubmissionTestCases from "./SubmissionTestCases";


/* ---------------- Utils ---------------- */

const normalizeCode = (code) => {
  if (!code) return "";

  // If already a string
  if (typeof code === "string") {
    try {
      const parsed = JSON.parse(code);
      if (typeof parsed === "string") {
        return parsed.replace(/\\n/g, "\n");
      }
    } catch {
      return code.replace(/\\n/g, "\n");
    }
    return code;
  }

  // If object (MOST IMPORTANT FIX)
  if (typeof code === "object") {
    // common backend patterns
    if (code.sourceCode) return String(code.sourceCode).replace(/\\n/g, "\n");
    if (code.code) return String(code.code).replace(/\\n/g, "\n");

    // fallback: pretty print object
    return JSON.stringify(code, null, 2);
  }

  return String(code);
};


const ProfileSubmission = () => {
  const { submissions, getAllSubmissions } = useSubmissionStore();
//   const { theme } = useThemeStore();

  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAllSubmissions();
  }, [getAllSubmissions]);

// console.log("submissions",submissions);
  
  const helpers = useMemo(
    () => ({
      statusStyle: (status) => {
        const map = {
          Accepted:
            "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black",
          ACCEPTED:
            "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black",
          "Wrong Answer":
            "bg-neutral-300 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200",
          WRONG_ANSWER:
            "bg-neutral-300 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200",
          "Time Limit Exceeded":
            "bg-neutral-300 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200",
        };
        return map[status] || "bg-neutral-200 dark:bg-neutral-800";
      },

      formatDate: (date) =>
        new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }).format(new Date(date)),

      getEditorLanguage: (lang) => {
        const map = {
          JAVASCRIPT: "javascript",
          PYTHON: "python",
          JAVA: "java",
        };
        return map[lang?.toUpperCase()] || "javascript";
      },

      safeValue: (value, fallback = "N/A") => {
        if (!value) return fallback;
        try {
          return typeof value === "string"
            ? value
            : JSON.stringify(value, null, 2);
        } catch {
          return fallback;
        }
      },
    }),
    []
  );

  const editorTheme = "light" === "light" ? "vs-light" : "vs-dark";

  const filteredSubmissions = useMemo(
    () => submissions.filter((s) => filter === "all" || s.status === filter),
    [submissions, filter]
  );

  const acceptedCount = useMemo(
    () =>
      submissions.filter((s) =>
        ["Accepted", "ACCEPTED"].includes(s.status)
      ).length,
    [submissions]
  );

  const toggleExpand = (id) =>
    setExpandedSubmission((prev) => (prev === id ? null : id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        w-full
        rounded-3xl
        border border-neutral-300/60 dark:border-neutral-700
        bg-neutral-100/60 dark:bg-neutral-900/80
        backdrop-blur
        p-6
      "
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h2 className="flex items-center gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">
          <FileCode className="w-4 h-4" />
          Submission History
        </h2>

        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="
              rounded-lg
              border border-neutral-300 dark:border-neutral-700
              bg-white dark:bg-neutral-900
              px-3 py-2
              text-xs
              text-neutral-700 dark:text-neutral-200
            " highlight
          >
            <option value="all">All</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="WRONG_ANSWER">Wrong Answer</option>
          </select>

          <div className="flex gap-3">
            <Stat label="Total" value={submissions.length} className="bg-white" highlight/>
            <Stat label="Accepted" value={acceptedCount} className="bg-white" highlight />
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredSubmissions.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="
                rounded-xl
                border border-neutral-300/60 dark:border-neutral-700
                bg-white dark:bg-neutral-900
                p-4
              "
            >
              {/* Submission Header */}
              <div
                onClick={() => toggleExpand(submission.id)}
                className="flex justify-between cursor-pointer"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${helpers.statusStyle(
                      submission.status
                    )}`}
                  >
                    {submission.status === "Accepted" && (
                      <Check size={12} className="inline mr-1" />
                    )}
                    {formatSubmissionStatus(submission.status)}
                  </span>

                  <span className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                    <Clock size={14} />
                    {helpers.formatDate(submission.createdAt)}
                  </span>
                </div>

                {expandedSubmission === submission.id ? (
                  <ChevronUp className="text-neutral-500" />
                ) : (
                  <ChevronDown className="text-neutral-500" />
                )}
              </div>

              {/* Details */}
              {expandedSubmission === submission.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700"
                >
                  {/* Code */}
                  <Section title={`Solution Code (${submission.language})`}>
                    <div className="rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700">
                      <Editor
                        height="350px"
                        language={helpers.getEditorLanguage(
                          submission.language
                        )}
                        theme={editorTheme}
                        value={normalizeCode(submission.sourceCode)}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 14,
                          wordWrap: "on",
                          automaticLayout: true,
                        }}
                      />
                    </div>
                  </Section>
                  <SubmissionTestCases submission={submission} />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const Stat = ({ label, value, highlight }) => (
  <div className="px-3 py-2 rounded-lg border bg-white border-neutral-300 dark:border-neutral-700 text-xs">
    <div className="text-neutral-500">{label}</div>
    <div
      className={`text-lg font-medium ${
        highlight ? "text-neutral-900 dark:text-neutral-100" : ""
      }`}
    >
      {value}
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-5">
    <h3 className="text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-200">
      {title}
    </h3>
    {children}
  </div>
);

const IOBlock = ({ title, value }) => (
  <div>
    <h4 className="text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">
      {title}
    </h4>
    <pre
      className="
        rounded-lg
        border border-neutral-300 dark:border-neutral-700
        bg-neutral-200/60 dark:bg-neutral-800/60
        p-3
        text-xs
        text-neutral-800 dark:text-neutral-200
        overflow-x-auto
        h-24
      "
    >
      <code>{value || "N/A"}</code>
    </pre>
  </div>
);

const Perf = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4">
    <Icon className="w-7 h-7 text-neutral-500" />
    <div>
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="text-sm font-medium">{value || "N/A"}</div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-10 text-center">
    <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
      No submissions found
    </h3>
    <p className="text-xs text-neutral-500 mt-1">
      Start solving problems to see your history
    </p>
  </div>
);

export default ProfileSubmission;
