import React from "react";
import { Zap, Cpu, BarChart2 } from "lucide-react";

export default function Features() {
  const cards = [
    {
      id: 1,
      title: "Arsenal of Algorithms",
      desc:
        "Curated, sequenced problems designed to build your core problem-solving weapons — focused and bite-sized.",
      icon: <Zap size={20} className="shrink-0" />,
    },
    {
      id: 2,
      title: "Siya AI Mentor",
      desc:
        "Intelligent hints, code reviews, and realtime collaboration — get guidance that actually improves your solutions.",
      icon: <Cpu size={20} className="shrink-0" />,
    },
    {
      id: 3,
      title: "Progress Reports",
      desc:
        "Clear metrics and historical insights so you can track improvement and double-down on weak areas.",
      icon: <BarChart2 size={20} className="shrink-0" />,
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-black ">
      <div className="mx-auto max-w-7xl px-6 pb-20 ">
        <div className="text-center">
          <h2 className=" font-medium text-2xl text-black dark:text-white">Features (you'll love)</h2>
          <p className="mt-2 text-xl font-semibold text-black dark:text-white">Your very own Siya — here to prep, guide, and power you through every challenge.</p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-black p-5 shadow-sm hover:shadow-md transition"
              role="article"
              aria-labelledby={`feature-${c.id}-title`}
            >
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-black dark:text-white">
                  {c.icon}
                </div>
                <h3 id={`feature-${c.id}-title`} className="text-sm font-semibold text-black dark:text-white">
                  {c.title}
                </h3>
              </div>

              <p className="text-sm text-black/70 dark:text-white/80">{c.desc}</p>

              <ul className="mt-auto list-inside list-disc text-sm text-black/70 dark:text-white/80 ml-4">
                {c.id === 1 && (
                  <>
                    <li>Topic-focused problem sets</li>
                    <li>Progressive difficulty</li>
                  </>
                )}
                {c.id === 2 && (
                  <>
                    <li>Hints and code review</li>
                    <li>Realtime pairing rooms</li>
                  </>
                )}
                {c.id === 3 && (
                  <>
                    <li>Weekly performance insights</li>
                    <li>Strength & weakness breakdown</li>
                  </>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
