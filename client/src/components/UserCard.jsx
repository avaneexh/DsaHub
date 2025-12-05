import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "lucide-react";
import { ArrowRight } from "lucide-react";


const UserCard = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  const name = authUser?.name || authUser?.username || "Guest";
  const email = authUser?.email || "guest@example.com";
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <section className="w-full px-4">
      <div
        className="
          mx-auto mt-6 max-w-5xl
          rounded-3xl border border-neutral-400/70
          bg-neutral-100/60 text-neutral-900
          shadow-sm backdrop-blur
          dark:bg-neutral-900/80 dark:text-neutral-50 dark:border-neutral-500/70
        "
      >
        <div className="flex flex-col items-start gap-4 px-5 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-8 sm:py-6">
        
          <div
            className="
              flex h-35 w-35 shrink-0 items-center justify-center
              rounded-2xl border border-neutral-600/80
              bg-neutral-50 text-8xl font-semibold tracking-tight
              dark:bg-neutral-950 dark:border-neutral-400
            "
          >
            {initial}
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <div>
              <h2 className="text-xl font-semibold sm:text-2xl md:text-3xl">
                Welcome back,
                <span className="ml-1">{name}</span>
              </h2>
              <p className="mt-1 text-xl  text-neutral-600 dark:text-neutral-300">
                {email}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-2 flex flex-wrap gap-3">
              <button
                type="button"
                className="
                  inline-flex items-center gap-1.5
                  rounded-full border border-neutral-900/80
                  px-4 py-1.5 text-xs font-medium tracking-tight
                  shadow-sm
                  transition-transform
                  hover:-translate-y-0.5 hover:shadow-md
                  dark:border-neutral-100
                "
              >
                Profile
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                className="
                  inline-flex items-center gap-1.5
                  rounded-full border border-neutral-900/80
                  px-4 py-1.5 text-xs font-medium tracking-tight
                  shadow-sm
                  transition-transform
                  hover:-translate-y-0.5 hover:shadow-md
                  dark:border-neutral-100
                "
              >
                Playlists
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserCard;
