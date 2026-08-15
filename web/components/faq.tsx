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
      "Yes. The Electron overlay runs on macOS and Windows 10/11. Linux can be built from source. It floats over Zoom, Meet, Teams, browsers, and IDEs.",
  },
  {
    question: "Do I need to pay for smog?",
    answer:
      "No. smog is free and open source under the MIT license. You bring your own OpenAI API key and pay OpenAI for the usage you generate.",
  },
  {
    question: "Can I use my own API key?",
    answer:
      "Yes — that is the only way it works. Paste your OpenAI key in the overlay on first launch (or later in Settings). The key stays on your machine and is only sent to OpenAI.",
  },
  {
    question: "Which models can I use?",
    answer:
      "The default is gpt-4o-mini. You can switch to gpt-4o in Settings. Requests run on your OpenAI account.",
  },
  {
    question: "How is my data handled?",
    answer:
      "Settings and your API key are stored locally. Transcripts and notes live in memory for the session. Audio and chat go to OpenAI only when you use Whisper, Ask, auto-answer, or Notes. smog does not run a backend or sell data.",
  },
  {
    question: "Is it hidden from screen share?",
    answer:
      "No. The overlay is a normal always-on-top window. To keep it off someone else's feed, share a single window or another monitor — not the whole desktop.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
          description="What the MVP actually is — and what it is not."
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
