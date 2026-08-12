import { Apple, ArrowRight, Monitor } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Footer() {
  return (
    <footer className="px-5 pb-10 pt-10 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Final CTA / download target */}
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
              Ready to see the answers, live?
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base text-neutral-400">
              Download smog and bring an AI copilot to your next call. Free to
              start, no credit card required.
            </p>

            <a
              href="#top"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "mt-8 h-11 gap-2 px-6 text-sm font-medium",
              )}
            >
              Download for free
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-neutral-500">
              <span className="inline-flex items-center gap-1.5">
                <Apple className="size-3.5" aria-hidden="true" />
                macOS
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Monitor className="size-3.5" aria-hidden="true" />
                Windows
              </span>
              <span>No credit card</span>
            </div>
          </div>
        </div>

        {/* Footer body */}
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
          <p>© 2026 smog. All rights reserved.</p>
          <p className="max-w-md sm:text-right">
            Use smog responsibly. Always follow applicable laws and the policies
            of any platform or organization you interact with.
          </p>
        </div>
      </div>
    </footer>
  );
}
