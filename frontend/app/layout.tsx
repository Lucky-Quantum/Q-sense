import "./globals.css";
import "@/components/ai/floating-tutor.css";
import FloatingTutor from "@/components/ai/FloatingTutor";

export const metadata = {
  title: "Q-SENSE — Quantum Learning Platform",
  description:
    "Learn, build, simulate and visualize quantum computing through an interactive learning experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <FloatingTutor />
      </body>
    </html>
  );
}