import React, { useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

const SubmissionTestCases = ({ submission }) => {
  const rows = useMemo(() => {
    if (!submission) return [];

    // Parse JSON string arrays safely
    const outputs = JSON.parse(submission.stdout || "[]");
    const memories = JSON.parse(submission.memory || "[]");
    const times = JSON.parse(submission.time || "[]");

    // Split stdin into individual testcases (one per line)
    const inputs = submission.stdin
      ?.split("\n")
      .map((i) => i.trim())
      .filter(Boolean);

    return outputs.map((output, index) => ({
      id: index,
      input: inputs[index] ?? "—",
      output,
      memory: memories[index] ?? "—",
      time: times[index] ?? "—",
      passed: submission.status === "ACCEPTED",
    }));
  }, [submission]);

  if (!rows.length) return null;

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Test Case Results
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            <tr>
              <th className="px-6 py-3 text-left font-medium">STATUS</th>
              <th className="px-6 py-3 text-left font-medium">INPUT</th>
              <th className="px-6 py-3 text-left font-medium">YOUR OUTPUT</th>
              <th className="px-6 py-3 text-left font-medium">MEMORY</th>
              <th className="px-6 py-3 text-left font-medium">TIME</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b last:border-none border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition"
              >
                {/* STATUS */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {row.passed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          Passed
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          Failed
                        </span>
                      </>
                    )}
                  </div>
                </td>

                {/* INPUT */}
                <td className="px-6 py-4 max-w-[320px]">
                  <pre className="font-mono text-xs whitespace-pre-wrap text-neutral-700 wrap-break-word bg-neutral-100 dark:bg-neutral-800 rounded-lg px-3 py-2">
                    {row.input}
                  </pre>
                </td>

                {/* OUTPUT */}
                <td className="px-6 py-4 font-mono text-neutral-700 text-sm">
                  {String(row.output)}
                </td>

                {/* MEMORY */}
                <td className="px-6 py-4 text-neutral-700 dark:text-neutral-300">
                  {row.memory}
                </td>

                {/* TIME */}
                <td className="px-6 py-4 text-neutral-700 dark:text-neutral-300">
                  {row.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionTestCases;
