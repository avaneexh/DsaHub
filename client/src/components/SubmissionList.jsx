import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar,
} from "lucide-react";
import { formatSubmissionStatus } from "../lib/utils";

const SubmissionsList = ({ submissions, isLoading }) => {
  const safeParse = (data) => {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  };

  const calculateAverageMemory = (memoryData) => {
    const memoryArray = safeParse(memoryData)?.map((m) =>
      parseFloat(m.split(" ")[0])
    );
    if (!memoryArray?.length) return 0;
    return memoryArray.reduce((a, b) => a + b, 0) / memoryArray.length;
  };

  const calculateAverageTime = (timeData) => {
    const timeArray = safeParse(timeData)?.map((t) =>
      parseFloat(t.split(" ")[0])
    );
    if (!timeArray?.length) return 0;
    return timeArray.reduce((a, b) => a + b, 0) / timeArray.length;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!submissions?.length) {
    return (
      <div className="text-center py-10 text-neutral-500">
        No submissions yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => {
        const avgMemory = calculateAverageMemory(submission.memory);
        const avgTime = calculateAverageTime(submission.time);

        const isAccepted = submission.status === "ACCEPTED";

        return (
          <div
            key={submission.id}
            className="
              rounded-2xl
              border border-neutral-300/60 dark:border-neutral-700
              bg-neutral-100 dark:bg-neutral-900
              shadow-sm hover:shadow-md
              transition
            "
          >
            <div className="
              p-4
              flex flex-col gap-3
              sm:flex-row sm:items-center sm:justify-between
            ">
              {/* LEFT */}
              <div className="flex items-center gap-3 flex-wrap">
                <div
                  className={`font-semibold ${
                    isAccepted ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isAccepted
                    ? "Accepted"
                    : formatSubmissionStatus(submission.status)}
                </div>

                <span className="
                  px-2.5 py-1
                  rounded-full text-xs
                  border border-neutral-400/40 dark:border-neutral-600
                  text-neutral-700 dark:text-neutral-300
                ">
                  {submission.language}
                </span>
              </div>

              {/* RIGHT */}
              <div className="
                flex flex-wrap items-center gap-x-4 gap-y-2
                text-sm text-neutral-600 dark:text-neutral-400
              ">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{avgTime.toFixed(3)} s</span>
                </div>

                <div className="flex items-center gap-1">
                  <Memory className="w-4 h-4" />
                  <span>{avgMemory.toFixed(0)} KB</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionsList;
