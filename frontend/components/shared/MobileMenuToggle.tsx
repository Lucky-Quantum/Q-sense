"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface MobileMenuToggleProps {
  /** Class name of the sidebar controlled by this button. */
  sidebarClassName: string;
  /** Retained for compatibility with existing callers. */
  brandHref?: string;
  /** Retained for compatibility with existing callers. */
  brandLabel?: string;
}

export default function MobileMenuToggle({
  sidebarClassName,
}: MobileMenuToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const generatedId = useId();
  const sidebarId = `mobile-sidebar-${generatedId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const closeSidebar = useCallback((restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => toggleButtonRef.current?.focus());
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsOpen((currentlyOpen) => !currentlyOpen);
  }, []);

  // Keep the mobile drawer in sync with the React state and restore any
  // pre-existing body overflow style when the drawer closes or unmounts.
  useEffect(() => {
    const sidebar = document.getElementsByClassName(sidebarClassName).item(0) as HTMLElement | null;
    if (!sidebar) return;

    const previousOverflow = document.body.style.overflow;
    sidebar.id = sidebarId;

    if (isOpen) {
      sidebar.classList.add("mobile-sidebar-open");
      document.body.style.overflow = "hidden";
    } else {
      sidebar.classList.remove("mobile-sidebar-open");
    }

    const handleSidebarNavigation = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest("a")) {
        closeSidebar();
      }
    };

    sidebar.addEventListener("click", handleSidebarNavigation);

    return () => {
      sidebar.removeEventListener("click", handleSidebarNavigation);
      sidebar.classList.remove("mobile-sidebar-open");
      document.body.style.overflow = previousOverflow;
    };
  }, [closeSidebar, isOpen, sidebarClassName, sidebarId]);

  // Close the drawer after route navigation so it never remains open on the
  // newly selected page.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Escape dismisses the drawer and returns keyboard focus to the toggle.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSidebar(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSidebar, isOpen]);

  // A desktop resize should not leave the mobile drawer state active.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 950) setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <button
        ref={toggleButtonRef}
        type="button"
        className="mobile-menu-button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls={sidebarId}
        onClick={toggleSidebar}
      >
        <span className="mobile-menu-bar" />
        <span className="mobile-menu-bar" />
        <span className="mobile-menu-bar" />
      </button>

      {isOpen && (
        <button
          type="button"
          className="mobile-menu-overlay"
          onClick={() => closeSidebar(true)}
          aria-label="Close navigation menu"
          tabIndex={-1}
        />
      )}
    </>
  );
}
