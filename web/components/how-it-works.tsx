import { AudioLines, MousePointerClick, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

type Step = {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    number: "01",
    icon: MousePointerClick,
    title: "Launch the overlay",
    description:
      "Open smog and pin the translucent panel over any meeting, interview, or screen-share. It floats, always on top.",
  },
  {
    number: "02",
    icon: AudioLines,
    title: "It listens & reads",
    description:
      "smog transcribes the conversation in real time and reads on-screen context — slides, prompts, and code — automatically.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Ask — get answers live",
    description:
      "Type or speak a question. Get an instant, context-aware answer in the overlay, with notes generated as you go.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="How it works"
          title="Up and running in seconds"
          description="No setup rituals, no integrations to configure. Launch it, and it just works on top of whatever you're running."
        />

        <div className="relative mt-16">
          {/* connecting line (desktop) */}
          <div
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block"
            aria-hidden="true"
          />

          <ol className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
            {steps.map((step) => (
              <StepCard key={step.number} step={step} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step }: { step: Step }) {
  const Icon = step.icon;
  return (
    <li className="relative flex flex-col items-start gap-4">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-neutral-900 text-emerald-300 shadow-lg">
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
        <span>Step {step.number}</span>
      </div>
      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
      <p className="text-sm leading-relaxed text-neutral-400">
        {step.description}
      </p>
    </li>
  );
}
