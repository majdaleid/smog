import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { GithubIcon } from "@/components/github-icon";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/site";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Get started", href: "#get-started" },
  { label: "FAQ", href: "#faq" },
];

export function Footer() {
  return (
    <footer className="px-5 pb-10 pt-10 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div
          id="download"
          className="glass relative overflow-hidden rounded-3xl bg-white/[0.05] px-6 py-14 text-center sm:px-12 sm:py-20"
        >
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[100px]"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Clone it. Paste your key. Listen.
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base text-neutral-400">
              smog is a free, open-source overlay. You bring an OpenAI key; the
              app runs on your machine.
            </p>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "mt-8 h-11 gap-2 px-6 text-sm font-medium",
              )}
            >
              <GithubIcon className="size-4" />
              View on GitHub
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-neutral-500">
              <span>MIT license</span>
              <span>No credit card</span>
              <span>Bring your own key</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <Logo className="text-base" />
            <p className="text-xs text-neutral-500">
              The translucent AI copilot for your calls.
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-neutral-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-neutral-500 sm:flex-row sm:text-left">
          <p>© 2026 smog. Released under the MIT License.</p>
          <p className="max-w-md sm:text-right">
            Use smog responsibly. Always follow applicable laws and the policies
            of any platform or organization you interact with.
          </p>
        </div>
      </div>
    </footer>
  );
}
