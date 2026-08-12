import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";

type Plan = {
  name: string;
  price: string;
  period: string;
  description: string;
  cta: { label: string; href: string };
  features: string[];
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$0",
    period: "free forever",
    description: "Everything you need to try smog on your next call.",
    cta: { label: "Download for free", href: "#download" },
    features: [
      "Translucent always-on-top overlay",
      "GPT-4o-mini answers",
      "Limited monthly tokens",
      "Basic notes export",
      "Stealth mode",
      "48–72h email support",
    ],
  },
  {
    name: "Pro",
    price: "$24.99",
    period: "per month",
    description: "For power users who live in calls and interviews.",
    cta: { label: "Get Pro", href: "#download" },
    highlighted: true,
    features: [
      "Everything in Starter",
      "GPT-4o answers",
      "Unlimited fair-use tokens",
      "Advanced exports (PDF, Markdown, Notion)",
      "AI note editing",
      "Priority support (<24h)",
    ],
  },
  {
    name: "Lifetime",
    price: "$199",
    period: "one-time",
    description: "Pay once, keep smog forever. Built for the long haul.",
    cta: { label: "Buy lifetime", href: "#download" },
    features: [
      "Everything in Pro",
      "Lifetime updates",
      "Bring your own OpenAI key",
      "Lifetime license, one payment",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, honest pricing"
          description="Start free. Upgrade when smog becomes the tool you can't take a call without."
        />

        <div className="mt-14 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-neutral-500">
          Prices in USD. Cancel anytime. Use smog responsibly and follow all
          applicable laws and platform policies.
        </p>
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={cn(
        "glass relative flex flex-col rounded-2xl p-7",
        plan.highlighted
          ? "border-emerald-400/40 bg-emerald-400/[0.06] lg:-translate-y-3 lg:scale-[1.02]"
          : "bg-white/[0.04]",
      )}
    >
      {plan.highlighted ? (
        <>
          <div
            className="absolute inset-0 -z-10 rounded-2xl bg-emerald-500/10 blur-xl"
            aria-hidden="true"
          />
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
            Most popular
          </span>
        </>
      ) : null}

      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-400">
          {plan.name}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-4xl font-semibold tracking-tight text-white">
            {plan.price}
          </span>
          <span className="text-sm text-neutral-500">{plan.period}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-neutral-400">
          {plan.description}
        </p>
      </div>

      <a
        href={plan.cta.href}
        className={cn(
          buttonVariants({
            variant: plan.highlighted ? "default" : "outline",
            size: "lg",
          }),
          "mt-6 h-11 w-full gap-2 px-6 text-sm font-medium",
          !plan.highlighted &&
            "border-white/15 bg-white/5 text-white hover:bg-white/10",
        )}
      >
        {plan.cta.label}
      </a>

      <ul className="mt-7 space-y-3 border-t border-white/10 pt-7">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
              <Check className="size-3" aria-hidden="true" />
            </span>
            <span className="text-neutral-300">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
