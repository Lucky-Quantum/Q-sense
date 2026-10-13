"use client";

import { useEffect, useState } from "react";

const sections = ["home", "features", "learn", "algorithms", "about"] as const;

export default function LandingNav() {
    const [activeSection, setActiveSection] = useState("home");

    useEffect(() => {
        const syncHash = () => {
            const section = window.location.hash.slice(1);
            if (sections.includes(section as (typeof sections)[number])) {
                setActiveSection(section);
            }
        };

        syncHash();
        window.addEventListener("hashchange", syncHash);

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleSection = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top - b.boundingClientRect.top,
                    )[0];

                if (visibleSection) setActiveSection(visibleSection.target.id);
            },
            { rootMargin: "-20% 0px -65% 0px" },
        );

        sections.forEach((id) => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });

        return () => {
            observer.disconnect();
            window.removeEventListener("hashchange", syncHash);
        };
    }, []);

    return (
        <nav className="desktop-nav" aria-label="Main navigation">
            {sections.map((section) => (
                <a
                    key={section}
                    className={activeSection === section ? "active" : undefined}
                    href={`#${section}`}
                    aria-current={activeSection === section ? "location" : undefined}
                >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                </a>
            ))}
        </nav>
    );
}