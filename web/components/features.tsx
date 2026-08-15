import { AudioLines, NotebookPen, Sparkles, Zap } from "lucide-react";
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
    title: "Live transcription",
    description:
      "Capture spoken audio into a timestamped transcript. Web Speech for speed, or Whisper when you want more accuracy.",
  },
  {
    icon: Zap,
    name: "Auto-answer",
    title: "Spoken questions, answered",
    description:
      "When a question lands in the transcript, smog streams a concise answer on the Listen tab — no typing required.",
  },
  {
    icon: Sparkles,
    name: "Ask",
    title: "Context-aware answers",
    description:
      "Type a follow-up anytime. smog attaches recent transcript lines and streams the reply in the overlay.",
  },
  {
    icon: NotebookPen,
    name: "Notes",
    title: "Structured notes you can export",
    description:
      "Turn the transcript into Markdown — summary, key points, decisions, action items — then edit, copy, or download.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Features"
          title="Four things the overlay actually does"
          description="smog sits on top of any call and turns speech into a transcript, answers, and notes. Nothing more."
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
