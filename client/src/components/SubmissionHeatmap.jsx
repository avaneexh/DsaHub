import React, { useEffect, useMemo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Calendar, Loader } from "lucide-react";
import { useSubmissionStore } from "../store/useSubmissionStore";
import { Tooltip } from "react-tooltip";

const SubmissionHeatmap = () => {
  const { submissions, isLoading, getAllSubmissions } = useSubmissionStore();
//   console.log("submissions",submissions);
  useEffect(() => {
    getAllSubmissions();
  }, []);

  // Prepare data for the heatmap
  const heatmapData = useMemo(() => {
    if (!submissions || !submissions.length) return [];

    // Group submissions by date
    const countsByDate = {};

    submissions.forEach((submission) => {
      const date = new Date(submission.createdAt);
      const dateKey = date.toISOString().split("T")[0];

      if (!countsByDate[dateKey]) {
        countsByDate[dateKey] = 0;
      }
      countsByDate[dateKey] += 1;
    });

    // Transform to array format for the heatmap
    return Object.keys(countsByDate).map((date) => ({
      date,
      count: countsByDate[date],
    }));
  }, [submissions]);

  // Calculate date ranges (last 6 months)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 12);

  // Get max value for color scaling
  const maxCount = useMemo(() => {
    if (heatmapData.length === 0) return 0;
    return Math.max(...heatmapData.map((data) => data.count));
  }, [heatmapData]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }
  return (
    <div className="w-full rounded-3xl border border-neutral-300/60 dark:border-neutral-700 bg-neutral-100/60 dark:bg-neutral-900/80 backdrop-blur p-4">
    <h2 className="flex items-center gap-2 mb-6 text-sm font-medium text-neutral-800 dark:text-neutral-200">
        <Calendar className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
        Submission Activity
    </h2>

    {submissions && submissions.length > 0 ? (
        <div className="rounded-xl border border-neutral-300/60 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-2 overflow-x-auto">
        <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={heatmapData}
            classForValue={(value) => {
            if (!value || value.count === 0) return "heatmap-empty";
            const intensity = Math.min(
                Math.ceil((value.count / Math.max(1, maxCount)) * 4),
                4
            );
            return `heatmap-scale-${intensity}`;
            }}
            tooltipDataAttrs={(value) => {
            if (!value || !value.date) return null;
            return {
                "data-tooltip-id": "submission-tooltip",
                "data-tooltip-content": getTooltipContent(value),
            };
            }}
            showWeekdayLabels
            horizontal
            gutterSize={2}
        />

        <Tooltip
            id="submission-tooltip"
            className="bg-neutral-900! text-white! text-xs! rounded-md! px-2! py-1!"
            place="top"
        />
        </div>
    ) : (
        <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-8 text-center">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
            No submission data available yet
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
            Start solving problems to see your activity
        </p>
        </div>
    )}

    {submissions?.length > 0 && (
        <p className="mt-3 text-center text-[11px] text-neutral-500 dark:text-neutral-400">
        Activity over the last 12 months
        </p>
    )}
    </div>

  );
};

// Function to format tooltip content
const getTooltipContent = (value) => {
  if (!value || !value.date) return "";

  const date = new Date(value.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const count = value.count || 0;

  return `${formattedDate}: ${count} submission${count !== 1 ? "s" : ""}`;
};

export default SubmissionHeatmap;