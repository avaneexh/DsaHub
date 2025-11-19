import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import {  Eye, EyeOff } from "lucide-react"
// import { siteName, logo } from "../constants"; // uncomment if you export siteName/logo
// import useAuthStore from "../stores/useAuthStore"; // uncomment to use your real auth store

/* -----------------------------
   Validation schema (zod)
   - password: min 6, upper, lower, digit, special
   - confirmPassword must match
   ----------------------------- */
const SignUpSchema = z
  .object({
    name: z.string().min(3, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
        "Password must contain upper, lower, number and special character"
      ),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  // UI toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Theme: true = dark, false = light. Persisted to localStorage.
  const [isDark, setIsDark] = useState(true);

  console.log("Is dark", isDark);
  

  const [isSigningUp, setIsSigningUp] = useState(false);
  const signUp = async (data) => {
    // Replace this with: await signUp(data) from your auth store
    setIsSigningUp(true);
    try {
      // fake network delay
      await new Promise((r) => setTimeout(r, 700));
      return { ok: true };
    } finally {
      setIsSigningUp(false);
    }
  };

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data) => {
    try {
      await signUp(data);
      navigate("/login");
      console.log("sign up data", data);
    } catch (err) {
      console.error("Sign up error:", err);
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isDark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("prefers-dark", JSON.stringify(isDark));
    } catch {
      // ignore
    }
  }, [isDark]);


  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300
        bg-white text-black
        dark:bg-black dark:text-white
      `}
      aria-live="polite"
    >
      <div
        className={`w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border
          border-black/10 bg-[#f7f7f7] text-black
          dark:border-white/10 dark:bg-white/5 dark:text-white
          backdrop-blur-sm
        `}
        style={{ boxShadow: "0 10px 40px rgba(2,6,23,0.6)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[480px]">
          {/* LEFT HERO (desktop only) */}
          <div
            className="hidden md:flex flex-col justify-center p-10 gap-4
                        bg-[#f7f7f7] text-black
                        dark:bg-linear-to-b dark:from-black/85 dark:via-neutral-900 dark:to-black/95 dark:text-white"
            >
            {/* <img src={logo} alt={siteName} className="w-16 h-16 rounded-md" /> */}
            <h2 className="text-3xl font-semibold leading-tight">DsaHub</h2>
            <p className="text-neutral-700 dark:text-neutral-300 max-w-md">
                Prepare. Practice. Perform. Build your DSA mastery with curated problems, explanations, and mock interviews.
            </p>

            <div className="mt-4">
                <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
                <li>• Curated problem lists</li>
                <li>• Track your progress</li>
                <li>• Mock interviews & tips</li>
                </ul>
            </div>
         </div>


          {/* RIGHT FORM */}
          <div className="flex flex-col justify-center p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Create your account</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-300">
                  Sign up to start training — it’s free to start.
                </p>
              </div>

              <div className="ml-auto">
                <button
                  type="button"
                  onClick={() => setIsDark((prev) => !prev)}
                  aria-pressed={isDark}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-sm
                    bg-transparent border-neutral-200 dark:border-neutral-700
                    hover:opacity-90 transition"
                >
                  {isDark ? "Light" : "Dark"}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Full name</label>
                <input
                  type="text"
                  placeholder="Joey Tribbiani"
                  autoComplete="name"
                  {...register("name")}
                  className={`w-full rounded-md border px-3 py-2 text-sm
                    bg-transparent
                    border-neutral-300 dark:border-neutral-700
                    focus:outline-none focus:ring-2 focus:ring-primary/40
                    ${errors.name ? "ring-1 ring-red-400" : ""}
                  `}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="joey@gmail.com"
                  autoComplete="email"
                  {...register("email")}
                  className={`w-full rounded-md border px-3 py-2 text-sm
                    bg-transparent
                    border-neutral-300 dark:border-neutral-700
                    focus:outline-none focus:ring-2 focus:ring-primary/40
                    ${errors.email ? "ring-1 ring-red-400" : ""}
                  `}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...register("password")}
                    className={`w-full rounded-md border px-3 py-2 text-sm pr-20
                      bg-transparent
                      border-neutral-300 dark:border-neutral-700
                      focus:outline-none focus:ring-2 focus:ring-primary/40
                      ${errors.password ? "ring-1 ring-red-400" : ""}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md
                        bg-neutral-100/40 dark:bg-white/10 border border-neutral-200 dark:border-neutral-700
                        hover:bg-neutral-200/60 dark:hover:bg-white/20 transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                    {showPassword ? (
                        <EyeOff className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    ) : (
                        <Eye className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    className={`w-full rounded-md border px-3 py-2 text-sm pr-20
                      bg-transparent
                      border-neutral-300 dark:border-neutral-700
                      focus:outline-none focus:ring-2 focus:ring-primary/40
                      ${errors.confirmPassword ? "ring-1 ring-red-400" : ""}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md
                        bg-neutral-100/40 dark:bg-white/10 border border-neutral-200 dark:border-neutral-700
                        hover:bg-neutral-200/60 dark:hover:bg-white/20 transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                    {showPassword ? (
                        <EyeOff className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    ) : (
                        <Eye className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={isSigningUp}
                  className="w-full rounded-md py-2 text-sm font-semibold
                    bg-black text-white hover:opacity-95
                    dark:bg-white dark:text-black
                    transition
                  "
                >
                  {isSigningUp ? "Creating..." : "Sign Up"}
                </button>
              </div>

              {/* footer links */}
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-primary underline">
                  Login
                </Link>
              </div>
            </form>

            {/* small note */}
            <p className="mt-6 text-xs text-neutral-500 dark:text-neutral-400 max-w-md">
              By creating an account you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
