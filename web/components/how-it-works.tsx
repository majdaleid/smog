import { AudioLines, KeyRound, Sparkles } from "lucide-react";
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
    icon: Sparkles,
    title: "Launch the overlay",
    description:
      "Clone the repo and run the desktop app. A translucent panel floats always-on-top over your call.",
  },
  {
    number: "02",
    icon: KeyRound,
    title: "Paste your OpenAI key",
    description:
      "The first screen asks for your key. It is stored locally and only sent to OpenAI. No smog account.",
  },
  {
    number: "03",
    icon: AudioLines,
    title: "Listen — get answers live",
    description:
      "Start the mic. Spoken questions are answered on the Listen tab. Type in Ask, or generate notes when you are done.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="How it works"
          title="Up and running in minutes"
          description="No signup. Clone, install, paste a key, listen."
        />

        <div className="relative mt-16">
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
