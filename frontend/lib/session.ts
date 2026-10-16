export type DemoRole = "student" | "instructor" | "admin";

export type DemoSession = {
  role: DemoRole;
  email: string;
  name: string;
  demo: true;
};

export const DEMO_PASSWORD = "quantum123";

export const DEMO_ACCOUNTS: Record<
  DemoRole,
  { email: string; name: string; home: string; title: string }
> = {
  student: {
    email: "student@qsense.demo",
    name: "Lucky",
    home: "/dashboard",
    title: "Student",
  },
  instructor: {
    email: "instructor@qsense.demo",
    name: "Lucky",
    home: "/instructor",
    title: "Instructor",
  },
  admin: {
    email: "admin@qsense.demo",
    name: "Lucky",
    home: "/admin",
    title: "Administrator",
  },
};

export function getDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("qsense-session");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DemoSession>;
    if (!parsed.role || !parsed.email || !parsed.name) return null;
    if (!Object.prototype.hasOwnProperty.call(DEMO_ACCOUNTS, parsed.role)) return null;
    return {
      role: parsed.role as DemoRole,
      email: parsed.email,
      name: parsed.name,
      demo: true,
    };
  } catch {
    return null;
  }
}

export function saveDemoSession(role: DemoRole) {
  const account = DEMO_ACCOUNTS[role];
  localStorage.setItem(
    "qsense-session",
    JSON.stringify({
      role,
      email: account.email,
      name: account.name,
      demo: true,
    } satisfies DemoSession)
  );
  return account;
}

export function clearDemoSession() {
  localStorage.removeItem("qsense-session");
}
