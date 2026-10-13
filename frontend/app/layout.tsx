import "./globals.css";
import "./login/login.css";
import "./dashboard/dashboard.css";
import "./learn/learn.css";
import "./quantum-lab/quantum-lab.css";
import "./algorithms/algorithms.css";
import "./challenges/challenges.css";
import "./progress/progress.css";
import "./ai-tutor/ai-tutor.css";
import "./settings/settings.css";
import "./help/help.css";
import "./instructor/instructor.css";
import "./admin/admin.css";
import "./styles/workspace-responsive.css";
import "@/components/ai/floating-tutor.css";
import { Inter, Space_Grotesk } from "next/font/google";
import FloatingTutor from "@/components/ai/FloatingTutor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

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
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        {children}
        <FloatingTutor />
      </body>
    </html>
  );
}