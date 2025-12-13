import React from "react";
import { CheckCircle2, XCircle, Clock, MemoryStick as Memory } from "lucide-react";
import { formatSubmissionStatus } from "../lib/utils";

const Submission = ({ submission }) => {
  const memoryArr = JSON.parse(submission.memory || "[]");
  const timeArr = JSON.parse(submission.time || "[]");

  console.log("submission com", submission[0]);
  

  const avgMemory =
    memoryArr.map((m) => parseFloat(m)).reduce((a, b) => a + b, 0) /
    (memoryArr.length || 1);

  const avgTime =
    timeArr.map((t) => parseFloat(t)).reduce((a, b) => a + b, 0) /
    (timeArr.length || 1);

  const passedTests = submission.testCases.filter((tc) => tc.passed).length;
  const totalTests = submission.testCases.length;
  const successRate = (passedTests / totalTests) * 100;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status */}
        <div className="rounded-xl border border-neutral-300/60 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
          <div className="p-5">
            <h3 className="text-sm text-neutral-600 dark:text-neutral-400">
              Status
            </h3>
            <div
              className={`mt-2 text-lg font-semibold ${
                submission.status === "ACCEPTED"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatSubmissionStatus(submission.status)}
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="rounded-xl border border-neutral-300/60 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
          <div className="p-5">
            <h3 className="text-sm text-neutral-600 dark:text-neutral-400">
              Success Rate
            </h3>
            <div className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-200">
              {successRate.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Avg Runtime */}
        <div className="rounded-xl border border-neutral-300/60 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
          <div className="p-5">
            <h3 className="text-sm flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <Clock className="w-4 h-4" /> Avg. Runtime
            </h3>
            <div className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-200">
              {avgTime.toFixed(3)} s
            </div>
          </div>
        </div>

        {/* Avg Memory */}
        <div className="rounded-xl border border-neutral-300/60 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
          <div className="p-5">
            <h3 className="text-sm flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <Memory className="w-4 h-4" /> Avg. Memory
            </h3>
            <div className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-200">
              {avgMemory.toFixed(0)} KB
            </div>
          </div>
        </div>
      </div>

      {/* Test Case Results */}
      <div className="rounded-xl border border-neutral-300/60 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200 mb-4">
            Test Case Results
          </h2>

          <div className="overflow-x-auto rounded-md border border-neutral-200/60 dark:border-neutral-700">
            <table className="w-full text-sm">
              <thead className="bg-neutral-100 dark:bg-neutral-800/60">
                <tr className="text-left text-xs uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Expected</th>
                  <th className="px-4 py-2">Your Output</th>
                  <th className="px-4 py-2">Memory</th>
                  <th className="px-4 py-2">Time</th>
                </tr>
              </thead>

              <tbody>
                {submission.testCases.map((testCase, idx) => (
                  <tr
                    key={idx}
                    className={
                      idx % 2 === 0
                        ? "bg-white dark:bg-neutral-900"
                        : "bg-neutral-50 dark:bg-neutral-950"
                    }
                  >
                    <td className="px-4 py-3">
                      {testCase.passed ? (
                        <span className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                          <CheckCircle2 className="w-4 h-4" /> Passed
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium">
                          <XCircle className="w-4 h-4" /> Failed
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 font-mono text-neutral-900 dark:text-neutral-200">
                      {testCase.expected}
                    </td>

                    <td className="px-4 py-3 font-mono text-neutral-900 dark:text-neutral-200">
                      {testCase.stdout || "null"}
                    </td>

                    <td className="px-4 py-3 text-neutral-800 dark:text-neutral-300">
                      {testCase.memory}
                    </td>

                    <td className="px-4 py-3 text-neutral-800 dark:text-neutral-300">
                      {testCase.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submission;
