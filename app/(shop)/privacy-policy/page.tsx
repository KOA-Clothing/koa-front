import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LegalSection } from "@/components/shop-front/legal-section";

export const metadata: Metadata = {
  title: "Privacy Policy | KOA Clothing",
  description:
    "What personal information KOA Clothing collects when you shop, how it is used, who it is shared with, and how to request access to or deletion of your data.",
};

const LAST_UPDATED = "October 16, 2026";
const SUPPORT_EMAIL = "support@koaclothing.com";

type LegalDocSection = {
  id: string;
  label: string;
  title: string;
  body: ReactNode;
};

const sections: LegalDocSection[] = [
  {
    id: "information-we-collect",
    label: "What we collect",
    title: "Information we collect",
    body: (
      <>
        <p>
          We collect only what we need to run the store, fulfil your orders, and
          keep your account secure. It falls into a few clear groups:
        </p>
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong className="font-medium text-foreground">
              Account details.
            </strong>{" "}
            Your name, email address, and profile image when you sign in with
            Google through Clerk. Your Google password is never shared with us
            and is never stored on our systems.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Contact &amp; delivery details.
            </strong>{" "}
            Shipping addresses and phone numbers you give us at checkout, so
            carriers can deliver your order and reach you about it.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Transaction details.
            </strong>{" "}
            What you ordered, the price you paid, the order status, and payment
            confirmation. Full payment card numbers are handled by our payment
            provider and are never stored on our systems.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Support messages.
            </strong>{" "}
            Emails, return and exchange requests, and anything else you send to
            our support team.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Technical data.
            </strong>{" "}
            Browser and device type, approximate location derived from your IP
            address, pages viewed, and how you arrived at the store. This is
            collected through cookies and Vercel Analytics.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-your-data",
    label: "How we use it",
    title: "How we use your data",
    body: (
      <>
        <p>
          We use your personal information for one or more of the following
          purposes, and for no others:
        </p>
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong className="font-medium text-foreground">
              Process your orders.
            </strong>{" "}
            Take payment, prepare your items, hand them to the carrier, and
            send you order, shipping, and delivery updates.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Authenticate your session.
            </strong>{" "}
            Clerk verifies your Google sign-in and keeps you securely signed
            in. Your user ID links your orders and support requests to your
            account.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Provide customer support.
            </strong>{" "}
            Answer questions, handle returns, exchanges, and refunds, and
            investigate anything that went wrong.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Improve the store.
            </strong>{" "}
            Understand, in aggregate, which pages and products are used so we
            can fix what is broken and drop what is not.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Protect the store.
            </strong>{" "}
            Detect fraud, unauthorised access, and abuse of our terms, and keep
            the site and your data secure.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Meet our legal obligations.
            </strong>{" "}
            Tax, accounting, and the records we are required by law to keep.
          </li>
        </ul>
        <p>
          We do not sell your personal information, and we do not share it with
          third parties for their own advertising.
        </p>
      </>
    ),
  },
  {
    id: "data-sharing-and-third-parties",
    label: "Who we share with",
    title: "Data sharing & third parties",
    body: (
      <>
        <p>
          We only share what is necessary with the infrastructure providers that
          run KOA Clothing, and with the partners needed to deliver what you
          bought:
        </p>
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong className="font-medium text-foreground">Clerk</strong> —
            authentication. Receives your name, email address, and sign-in
            method so you can create an account and stay signed in.
          </li>
          <li>
            <strong className="font-medium text-foreground">Neon</strong> —
            database storage. Hosts the Postgres database holding your account,
            order, and catalogue records.
          </li>
          <li>
            <strong className="font-medium text-foreground">Render</strong> —
            backend hosting. Runs the API that processes orders, payment
            confirmations, and support requests.
          </li>
          <li>
            <strong className="font-medium text-foreground">Vercel</strong> —
            web delivery and analytics. Serves this site from its edge network
            and collects the anonymous usage data described below.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Payment provider
            </strong>{" "}
            — receives the amount, currency, and payment method needed to
            charge you and to issue refunds. We never see full card details.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Delivery partners
            </strong>{" "}
            — receive your name, address, and phone number only to deliver your
            order.
          </li>
        </ul>
        <p>
          We may also disclose information where the law requires it, or to
          protect the rights, property, and safety of KOA Clothing, our
          customers, or others. Every provider above is bound to protect your
          data and may only process it for the purposes described in this
          policy.
        </p>
      </>
    ),
  },
  {
    id: "cookies-and-tracking",
    label: "Cookies",
    title: "Cookies & tracking",
    body: (
      <>
        <p>
          We use a small number of cookies and similar technologies, and
          nothing more than we need:
        </p>
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong className="font-medium text-foreground">
              Essential cookies.
            </strong>{" "}
            Set by Clerk to maintain your signed-in session, remember your
            cart, and protect forms from abuse. The store cannot sign you in or
            check out without them.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Analytics.
            </strong>{" "}
            Vercel Analytics collects aggregated, non-identifying usage data
            such as page views, referrers, and device type. It does not build a
            profile of you and is not used for advertising.
          </li>
        </ul>
        <p>
          We do not use advertising or cross-site tracking cookies. You can
          block or delete cookies in your browser settings at any time, although
          blocking essential cookies will sign you out and prevent you from
          placing orders. Clearing cookies removes your session, so you will
          need to sign in again.
        </p>
      </>
    ),
  },
  {
    id: "your-rights-and-data-deletion",
    label: "Your rights",
    title: "User rights & data deletion",
    body: (
      <>
        <p>
          Depending on where you live, you may have the right to access,
          correct, export, restrict, or delete the personal information we hold
          about you, and to withdraw consent where processing is based on
          consent.
        </p>
        <p>
          To exercise any of those rights, email{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-medium text-foreground underline underline-offset-4 transition hover:text-primary"
          >
            {SUPPORT_EMAIL}
          </a>{" "}
          from the address linked to your account with the subject
          &quot;Data request&quot;. We confirm receipt within five business days
          and respond in full within thirty days.
        </p>
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong className="font-medium text-foreground">
              Account deletion.
            </strong>{" "}
            Deleting your account removes your profile, saved addresses, and
            other personal data from our systems.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              What we keep.
            </strong>{" "}
            Order and invoice records are retained only for as long as tax,
            accounting, and consumer-protection law requires. Once that period
            passes, they are deleted or anonymised.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Verification.
            </strong>{" "}
            We may need to confirm it is really you before acting on a request —
            this protects you from someone else deleting your account.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "changes-and-contact",
    label: "Contact",
    title: "Changes to this policy & contact",
    body: (
      <>
        <p>
          We may update this policy when our practices, our providers, or the
          law change. The current version always lives on this page, with its
          revision date at the top. If a change significantly affects how we
          use your data, we will notify you by email or through your account
          before it takes effect.
        </p>
        <p>
          Using the store after an updated policy takes effect means you accept
          it. If you do not agree with it, stop using the store and request
          deletion of your account.
        </p>
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-1">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
            Contact details
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Questions, requests, or complaints about this policy can be sent to{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-medium text-foreground underline underline-offset-4 transition hover:text-primary"
            >
              {SUPPORT_EMAIL}
            </a>
            . We would rather fix a problem than have it written up.
          </p>
        </div>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground motion-safe:scroll-smooth">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ── HERO ── */}
        <section className="pt-12 md:pt-16 pb-12">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 font-medium">
            Legal — Privacy
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground mb-6">
            Privacy
            <br />
            <span className="text-primary">Policy.</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            This policy explains what personal information KOA Clothing
            collects when you shop with us, why we collect it, who we are
            allowed to share it with, and the choices you have over it. It
            covers our online store, your KOA account, and everything you buy
            through them.
          </p>

          <p className="mt-6 text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
            Last updated — {LAST_UPDATED}
          </p>

          {/* ── CONTENTS ── */}
          <nav
            aria-label="Policy sections"
            className="mt-10 border-t border-border pt-6"
          >
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium mb-4">
              On this page
            </p>
            <ol className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {sections.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-muted-foreground transition hover:text-foreground"
                  >
                    <span className="mr-2 text-xs font-medium tabular-nums text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </section>
      </div>

      {/* ── SECTIONS ── */}
      {sections.map((section, i) => (
        <LegalSection
          key={section.id}
          id={section.id}
          index={i + 1}
          label={section.label}
          title={section.title}
        >
          {section.body}
        </LegalSection>
      ))}
    </main>
  );
}
