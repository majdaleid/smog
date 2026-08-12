import { AudioLines, NotebookPen, ScanEye, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

type Feature = {
  icon: LucideIcon;
  name: string;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: AudioLines,
    name: "Listen",
    title: "Real-time transcription",
    description:
      "Capture every word as it's spoken with low-latency, speaker-aware transcription that streams live into the overlay.",
  },
  {
    icon: Sparkles,
    name: "Ask",
    title: "Instant, context-aware answers",
    description:
      "Ask anything mid-call. smog reads the full transcript and serves the right answer in milliseconds.",
  },
  {
    icon: ScanEye,
    name: "Vision",
    title: "Read text & code on screen",
    description:
      "On-screen vision lets smog see shared slides, LeetCode prompts, and code so answers match what you're looking at.",
  },
  {
    icon: NotebookPen,
    name: "Notes",
    title: "Auto-generated, editable notes",
    description:
      "Walk away with clean, structured notes and action items — editable, exportable, and ready the moment you hang up.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Features"
          title="Four superpowers, one overlay"
          description="smog sits quietly on top of any call and turns it into something you can actually keep up with."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.name} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <div className="glass group relative flex flex-col gap-4 rounded-2xl bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
      <div className="flex size-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 transition-colors group-hover:bg-emerald-400/15">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <div className="space-y-1.5">
        <div className="text-xs font-medium uppercase tracking-wider text-emerald-300/80">
          {feature.name}
        </div>
        <h3 className="text-base font-semibold text-white">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-neutral-400">
          {feature.description}
        </p>
      </div>
    </div>
  );
}
