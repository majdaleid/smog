"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/section-heading";

type Faq = { question: string; answer: string };

const faqs: Faq[] = [
  {
    question: "Does it work on Mac and Windows?",
    answer:
      "Yes. smog runs natively on macOS (Apple silicon and Intel) and Windows 10/11. It floats as a translucent overlay over any window, so it works with Zoom, Google Meet, Teams, browsers, and IDEs alike. Linux support is on the roadmap.",
  },
  {
    question: "Is it detectable?",
    answer:
      "smog is a desktop overlay that renders on top of your screen — it isn't injected into other apps and doesn't hook into their processes. Whether using it is appropriate depends on your context; always follow the rules of your platform, employer, and local laws. We don't condone using smog to deceive anyone.",
  },
  {
    question: "Which AI models does smog use?",
    answer:
      "Starter uses GPT-4o-mini for fast, economical answers. Pro and Lifetime use GPT-4o for higher-quality, context-aware responses. On Lifetime you can bring your own OpenAI key and choose any model you prefer.",
  },
  {
    question: "How is my data handled?",
    answer:
      "Audio is transcribed locally where possible and streamed only when needed to generate answers. Transcripts and notes are stored on your device, and we never sell your data or use it to train models. You can delete everything at any time.",
  },
  {
    question: "Can I use my own API key?",
    answer:
      "Yes. The Lifetime plan lets you plug in your own OpenAI key, so requests run entirely under your account and billing — giving you full control over model choice, usage limits, and data residency.",
  },
  {
    question: "What's included in the free Starter plan?",
    answer:
      "The translucent overlay, live transcription, GPT-4o-mini answers up to a monthly token limit, basic notes export, and stealth mode — enough to take smog for a real spin on your next call.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
          description="Everything you might want to know before you hit download."
        />

        <div className="glass mt-12 rounded-2xl bg-white/[0.04] px-5 py-2 sm:px-7">
          <Accordion defaultValue={["faq-0"]}>
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.question} value={`faq-${i}`}>
                <AccordionTrigger className="py-5 text-base font-medium text-white hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-neutral-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
