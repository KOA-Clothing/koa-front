export const koaClerkAppearance = {
  variables: {
    colorPrimary: "var(--koa-action)",
    colorBackground: "var(--koa-surface)",
    colorInputBackground: "var(--koa-surface)",
    colorInputText: "var(--koa-ink)",
    colorText: "var(--koa-ink)",
    colorTextSecondary: "var(--koa-ink-secondary)",
    colorTextOnPrimary: "var(--koa-action-foreground)",
    colorNeutral: "var(--koa-ink)",
    fontFamily: "var(--font-inter)",
    borderRadius: "0.5rem",
  },
  elements: {
    card: "border border-border bg-card shadow-none",
    cardBox: "w-full max-w-md",
    headerTitle: "text-2xl font-bold tracking-tight text-ink",
    headerSubtitle: "text-ink-secondary",
    formButtonPrimary:
      "min-h-11 rounded-control bg-action text-action-foreground hover:bg-action-hover",
    socialButtonsBlockButton:
      "min-h-11 rounded-control border-border bg-surface text-ink hover:bg-cloud",
    formFieldInput:
      "rounded-control border-input bg-surface text-ink placeholder:text-ink-muted",
    formFieldLabel: "text-ink-secondary",
    footerActionLink: "text-action hover:text-action-hover",
  },
} as const;
