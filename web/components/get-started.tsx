import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { GithubIcon } from "@/components/github-icon";
import { GITHUB_URL } from "@/lib/site";

const points = [
  "Free and open source under MIT",
  "No account, no credit card, no hosted tokens",
  "Bring your own OpenAI key — it stays on your machine",
];

const commands = `git clone ${GITHUB_URL}.git
cd smog/desktop
npm install
npm run dev`;

export function GetStarted() {
  return (
    <section id="get-started" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Get started"
          title="Free, open source, your key"
          description="Clone the repo, paste an OpenAI key in the overlay, and use Listen, Ask, and Notes. You pay OpenAI directly."
        />

        <div className="mx-auto mt-14 grid max-w-3xl gap-6">
          <div className="glass rounded-2xl bg-white/[0.04] p-7">
            <ul className="space-y-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  <span className="text-neutral-300">{point}</span>
                </li>
              ))}
            </ul>

            <pre className="mt-7 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-[13px] leading-relaxed text-neutral-200">
              <code>{commands}</code>
            </pre>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "mt-6 h-11 w-full gap-2 px-6 text-sm font-medium sm:w-auto",
              )}
            >
              <GithubIcon className="size-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
