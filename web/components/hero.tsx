import {
  ArrowRight,
  AudioLines,
  Check,
  Mic,
  Send,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { GithubIcon } from "@/components/github-icon";
import { GITHUB_URL } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="hero-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(70%_60%_at_50%_25%,black,transparent)]"
          aria-hidden="true"
        />
        <div className="animate-smog-drift absolute -top-24 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="animate-smog-drift absolute top-10 left-[-15%] h-[30rem] w-[30rem] rounded-full bg-indigo-500/20 blur-[120px] [animation-delay:-6s]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="flex flex-col items-start">
          <a
            href="#get-started"
            className="glass mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-neutral-200"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
            </span>
            Free &amp; open source · bring your own key
          </a>

          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            See the answers.{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Live.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-neutral-300 sm:text-lg">
            A translucent AI copilot that overlays your calls — live
            transcription, instant answers, and auto-generated notes. Clone it,
            paste your OpenAI key, run it locally.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "h-11 gap-2 px-6 text-sm font-medium",
              )}
            >
              <GithubIcon className="size-4" />
              View on GitHub
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#get-started"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 gap-2 border-white/15 bg-white/5 px-6 text-sm font-medium text-white hover:bg-white/10",
              )}
            >
              Get started
            </a>
          </div>

          <p className="mt-5 text-xs text-neutral-500">
            macOS &amp; Windows · MIT license · Runs locally
          </p>
        </div>

        <ProductMock />
      </div>
    </section>
  );
}

function ProductMock() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        className="absolute inset-6 -z-10 rounded-[2rem] bg-emerald-500/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="animate-smog-float glass relative rounded-2xl bg-white/[0.07] p-3 shadow-2xl">
        <div className="flex items-center justify-between px-2 pb-3 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400/80" />
            <span className="size-2.5 rounded-full bg-amber-400/80" />
            <span className="size-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-neutral-300">
            <Mic className="size-3 text-emerald-400" aria-hidden="true" />
            <span className="font-medium text-neutral-200">Listening</span>
            <span className="relative ml-0.5 flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
            </span>
          </div>
        </div>

        <div className="space-y-2.5 rounded-xl border border-white/10 bg-black/20 p-3.5 text-[13px] leading-relaxed">
          <TranscriptLine
            speaker="Interviewer"
            tone="text-sky-300"
            text="Walk me through how you'd design a URL shortener at scale."
          />
          <TranscriptLine
            speaker="You"
            tone="text-emerald-300"
            text="Start with the API, then map an auto-increment ID to base-62 keys…"
          />
          <div className="flex items-center gap-1.5 pl-1 text-neutral-500">
            <span className="inline-block h-3.5 w-0.5 animate-pulse bg-emerald-400" />
            <span className="text-[11px]">transcribing…</span>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-3.5">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-emerald-300">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Live answer
          </div>
          <p className="text-[13px] leading-relaxed text-neutral-100">
            Base-62 encoding maps the integer ID to{" "}
            <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-[12px] text-emerald-200">
              [0-9a-zA-Z]
            </code>
            . Keep a counter, encode it, and cache hot keys in Redis to avoid DB
            hits.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 text-[12px] text-neutral-400">
              <AudioLines className="size-3.5 text-neutral-500" aria-hidden="true" />
              Ask a follow-up…
            </div>
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded-lg bg-emerald-400 text-emerald-950 transition-colors hover:bg-emerald-300"
              aria-label="Send"
            >
              <Send className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between px-1 text-[11px] text-neutral-500">
          <span className="inline-flex items-center gap-1">
            <Check className="size-3 text-emerald-400" aria-hidden="true" />
            Your OpenAI key
          </span>
          <span>gpt-4o-mini</span>
        </div>
      </div>

      <div className="glass absolute -left-4 top-10 hidden rounded-xl px-3 py-2 text-xs text-neutral-200 sm:block">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-emerald-400" aria-hidden="true" />
          Instant answer
        </span>
      </div>
      <div className="glass absolute -right-3 bottom-8 hidden rounded-xl px-3 py-2 text-xs text-neutral-200 sm:block">
        <span className="inline-flex items-center gap-1.5">
          <Check className="size-3.5 text-emerald-400" aria-hidden="true" />
          Runs locally
        </span>
      </div>
    </div>
  );
}

function TranscriptLine({
  speaker,
  tone,
  text,
}: {
  speaker: string;
  tone: string;
  text: string;
}) {
  return (
    <div>
      <span className={cn("mr-1.5 text-[11px] font-semibold uppercase tracking-wide", tone)}>
        {speaker}
      </span>
      <span className="text-neutral-200">{text}</span>
    </div>
  );
}
