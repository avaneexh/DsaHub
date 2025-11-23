import React from "react";
import { Mail, ArrowRight, Linkedin, Twitter, Github, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-black border-t border-gray-300/60 dark:border-white/10 mt-1">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold text-black dark:text-white mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-black/70 dark:text-white/70">
              <li>Features</li>
              <li>Testimonials</li>
              <li>Pricing</li>
              <li>FAQs</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-black dark:text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-black/70 dark:text-white/70">
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-sm font-semibold text-black dark:text-white mb-4">Socials</h4>
            <ul className="space-y-3 text-sm text-black/70 dark:text-white/70">
              <li className="flex items-center gap-2"><Linkedin size={16}/> LinkedIn</li>
              <li className="flex items-center gap-2"><Twitter size={16}/> Twitter</li>
              <li className="flex items-center gap-2"><Github size={16}/> GitHub</li>
              <li className="flex items-center gap-2"><Youtube size={16}/> YouTube</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 lg:col-span-2">
            <h4 className="text-sm font-semibold text-black dark:text-white mb-4">Join the League</h4>
            <p className="text-sm text-black/70 dark:text-white/70 mb-4">Get early access and training tips delivered to your inbox</p>

            <form className="flex items-center gap-2 w-full max-w-sm">
              <div className="flex items-center gap-2 w-full rounded-xl border border-gray-300/70 dark:border-white/20 bg-white dark:bg-black px-3 py-2">
                <Mail size={16} className="text-black/70 dark:text-white/70" />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full bg-transparent outline-none text-sm text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black w-10 h-10"
              >
                ✦
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 text-xs text-black/60 dark:text-white/60">© {new Date().getFullYear()} DsaHub. All rights reserved.</div>
      </div>
    </footer>
  );
}