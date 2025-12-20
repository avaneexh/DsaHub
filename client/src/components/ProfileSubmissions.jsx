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
// import { useThemeStore } from "../store/useThemeStore";

const ProfileSubmission = () => {
  const { submissions, getAllSubmissions } = useSubmissionStore();
//   const { theme } = useThemeStore();

  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAllSubmissions();
  }, [getAllSubmissions]);

  /* ---------------- Helpers ---------------- */
  const helpers = useMemo(() => {
    return {
      getStatusStyle: (status) => {
        const map = {
          Accepted:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
          ACCEPTED:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
          "Wrong Answer":
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          WRONG_ANSWER:
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          "Time Limit Exceeded":
            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
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
          return typeof value === "string" ? value : JSON.stringify(value, null, 2);
        } catch {
          return fallback;
        }
      },
    };
  }, []);

  const editorTheme = theme === "light" ? "vs-light" : "vs-dark";

  /* ---------------- Computed ---------------- */
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(
      (s) => filter === "all" || s.status === filter
    );
  }, [submissions, filter]);

  const acceptedCount = useMemo(
    () => submissions.filter((s) => ["Accepted", "ACCEPTED"].includes(s.status)).length,
    [submissions]
  );

  const toggleExpand = (id) =>
    setExpandedSubmission((prev) => (prev === id ? null : id));

  /* ---------------- UI ---------------- */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        w-full
        rounded-3xl
        border border-neutral-300/60 dark:border-neutral-700
        bg-white/70 dark:bg-neutral-900/80
        backdrop-blur
        p-6
      "
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h2 className="flex items-center gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">
          <FileCode className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
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
            "
          >
            <option value="all">All</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="WRONG_ANSWER">Wrong Answer</option>
          </select>

          <div className="flex gap-3">
            <Stat label="Total" value={submissions.length} />
            <Stat label="Accepted" value={acceptedCount} accent />
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
              {/* Header */}
              <div
                onClick={() => toggleExpand(submission.id)}
                className="flex justify-between cursor-pointer"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${helpers.getStatusStyle(
                      submission.status
                    )}`}
                  >
                    {submission.status === "Accepted" && <Check size={12} />}
                    {formatSubmissionStatus(submission.status)}
                  </span>

                  <span className="flex items-center gap-1 text-xs text-neutral-500">
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
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700"
                >
                  {/* Code */}
                  <Section title={`Solution Code (${submission.language})`} icon={Code}>
                    <div className="rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700">
                      <Editor
                        height="350px"
                        language={helpers.getEditorLanguage(submission.language)}
                        theme={editorTheme}
                        value={helpers.safeValue(submission.sourceCode)}
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

                  {/* IO */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <IOBlock title="Input" value={submission.stdin} />
                    <IOBlock title="Output" value={submission.stdout} />
                  </div>

                  {/* Stats */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Perf icon={Clock} label="Execution Time" value={submission.time} />
                    <Perf icon={HardDrive} label="Memory Used" value={submission.memory} />
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

/* ---------------- Small Components ---------------- */

const Stat = ({ label, value, accent }) => (
  <div className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs">
    <div className="text-neutral-500">{label}</div>
    <div className={`text-lg font-medium ${accent ? "text-emerald-500" : ""}`}>
      {value}
    </div>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <div className="mb-5">
    <h3 className="flex items-center gap-2 text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-200">
      <Icon size={16} />
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
    <pre className="
      rounded-lg
      border border-neutral-300 dark:border-neutral-700
      bg-neutral-100 dark:bg-neutral-800
      p-3
      text-xs
      overflow-x-auto
      h-24
    ">
      {value || "N/A"}
    </pre>
  </div>
);

const Perf = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4">
    <Icon className="w-8 h-8 text-neutral-500" />
    <div>
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="text-sm font-medium">{value || "N/A"}</div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-10 text-center">
    <h3 className="text-sm font-medium">No submissions found</h3>
    <p className="text-xs text-neutral-500 mt-1">
      Start solving problems to see your history
    </p>
  </div>
);

export default ProfileSubmission;
