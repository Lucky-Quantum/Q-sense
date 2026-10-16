"use client";

import { useState } from "react";
import Reveal from "@/components/landing/Reveal";

const faqs = [
  [
    "Do I need access to a quantum computer?",
    "No physical hardware is required to start. The platform is designed around simulator-based experimentation.",
  ],
  [
    "Do I need an advanced physics background?",
    "No. The learning path starts with foundations and progressively introduces more advanced concepts.",
  ],
  [
    "Can I use code instead of the visual builder?",
    "Yes. Q-SENSE is designed to support both graphical circuit construction and code-based workflows.",
  ],
  [
    "Which quantum frameworks can I learn with?",
    "The architecture is designed around major quantum development ecosystems including Qiskit, PennyLane and Cirq.",
  ],
] as const;

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-grid">
      {faqs.map(([question, answer], index) => {
        const isOpen = openIndex === index;

        return (
          <Reveal key={question} delay={index * 80}>
            <details className="faq-item" open={isOpen}>
              <summary
                aria-expanded={isOpen}
                onClick={(event) => {
                  event.preventDefault();

                  setOpenIndex((current) =>
                    current === index ? null : index
                  );
                }}
              >
                {question}
                <span aria-hidden="true">+</span>
              </summary>

              {isOpen && <p>{answer}</p>}
            </details>
          </Reveal>
        );
      })}
    </div>
  );
}