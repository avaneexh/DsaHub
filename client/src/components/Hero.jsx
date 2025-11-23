import React from "react";
import { Star, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="w-full bg-linear-to-b from-gray-50 to-white dark:from-slate-900 dark:to-black">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-20">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-20">

          <div className="w-full lg:w-7/12">
            <p className="inline-flex items-center gap-3 rounded-full bg-black/5 dark:bg-white/5 px-3 py-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              <Star size={16} className="shrink-0" />
              Early Access
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-600 dark:text-slate-300">
              Trusted by developers from top tech companies
            </h3>

            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-black dark:text-white">
              Welcome to
              <br />
              <span className="bg-linear-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">DsaHub</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Where elite minds sharpen their coding powers.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#get-started"
                className="inline-flex items-center gap-3 rounded-2xl bg-black text-white px-5 py-3 text-sm font-medium shadow-lg hover:opacity-95 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:bg-white dark:text-black"
                aria-label="Get started with DsaHub"
              >
                ✦ Get Started
                <ArrowRight size={18} className="ml-1" />
              </a>

              <a
                href="#learn-more"
                className="text-sm text-slate-600 dark:text-slate-300 hover:underline"
                aria-label="Learn more about DsaHub"
              >
                Learn more
              </a>
            </div>

            <div className="mt-8 flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span>• Used in production at TopTechCo</span>
              <span>• 120k+ problems attempted</span>
            </div>
          </div>

          <div className="w-full lg:w-5/12 flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-2xl bg-white/60 dark:bg-black/40 backdrop-blur-md p-6 shadow-2xl border border-black/5 dark:border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Live ranking</p>
                  <p className="mt-1 text-lg font-semibold text-black dark:text-white">Top Problem Solvers</p>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-300">#1</div>
              </div>

              <div className="mt-4 h-36 w-full rounded-lg bg-linear-to-br from-indigo-100 to-pink-50 dark:from-indigo-900 dark:to-pink-900 flex items-center justify-center text-slate-600 dark:text-slate-200">
                <div className="text-center">
                  <div className="text-sm">Featured challenge</div>
                  <div className="mt-2 font-medium">Longest Increasing Subsequence</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Avg time solved: 12m</span>
                <span>Attempts: 38k</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
