import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LegalSection } from "@/components/shop-front/legal-section";

export const metadata: Metadata = {
  title: "Terms of Service | KOA Clothing",
  description:
    "The terms that govern your use of the KOA Clothing store and any order you place with us — accounts, pricing, payments, returns, intellectual property, and liability.",
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
    id: "acceptance-and-eligibility",
    label: "Acceptance",
    title: "Acceptance of terms & eligibility",
    body: (
      <>
        <p>
          These terms form a binding agreement between you and KOA Clothing.
          By browsing the store, creating an account, or placing an order, you
          accept them together with our Privacy Policy. If you do not accept
          them, do not use the store.
        </p>
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong className="font-medium text-foreground">Eligibility.</strong>{" "}
            You must be at least eighteen years old, or the age of majority
            where you live, and legally able to enter into a binding contract.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Where we sell.
            </strong>{" "}
            You must be able to receive deliveries in the destinations we
            serve, and are responsible for any import duties, taxes, or
            restrictions that apply in your country.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Acceptable use.
            </strong>{" "}
            You agree to use the store only for lawful personal purposes, and
            not to interfere with its operation, scrape its content, or attempt
            unauthorised access to it or to other accounts.
          </li>
        </ul>
        <p>
          We may refuse service, cancel orders, or suspend accounts where we
          reasonably believe these terms have been, or are being, broken.
        </p>
      </>
    ),
  },
  {
    id: "account-creation-and-responsibilities",
    label: "Accounts",
    title: "Account creation & responsibilities",
    body: (
      <>
        <p>
          You create an account by signing in with your Google account through
          Clerk. When you do, you allow us to receive the basic profile details
          Google shares with us — your name, email address, and profile image —
          as described in our Privacy Policy.
        </p>
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong className="font-medium text-foreground">
              Your account is your responsibility.
            </strong>{" "}
            You are responsible for everything that happens under it. Keep your
            Google credentials secure and do not share access with anyone.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Accurate information.
            </strong>{" "}
            Keep your name, email address, phone number, and delivery addresses
            current — we use them to fulfil orders and to reach you about them.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Tell us about problems.
            </strong>{" "}
            If you suspect anyone has accessed your account without permission,
            contact us immediately so we can secure it.
          </li>
          <li>
            <strong className="font-medium text-foreground">Suspension.</strong>{" "}
            We may suspend or close an account that provides false information,
            is used fraudulently, or repeatedly breaches these terms.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "products-and-pricing",
    label: "Products",
    title: "Product descriptions & pricing",
    body: (
      <>
        <p>
          We work to keep descriptions, images, and prices accurate, but the
          store is provided for information as much as for shopping:
        </p>
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong className="font-medium text-foreground">
              Descriptions.
            </strong>{" "}
            Colors, textures, and fit are shown as accurately as we can, but
            screens render color differently and garment measurements are
            approximate. Minor variation between a product image and the item
            you receive is not a defect.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Availability.
            </strong>{" "}
            Stock is not guaranteed. An item can sell out or be discontinued at
            any time, and restocking is not promised.
          </li>
          <li>
            <strong className="font-medium text-foreground">Pricing.</strong>{" "}
            Prices may change at any time. The price shown at the moment you
            place your order is the price that applies to that order.
          </li>
          <li>
            <strong className="font-medium text-foreground">Errors.</strong> If
            a product is listed at an incorrect price or with incorrect
            information because of a typographical or system error, we may
            cancel the order and issue a full refund, even after an order
            confirmation has been sent.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Promotions.
            </strong>{" "}
            Discount codes and offers are subject to their own conditions,
            cannot be combined unless we say otherwise, and may be withdrawn at
            any time.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "payments-and-orders",
    label: "Orders",
    title: "Payments & orders",
    body: (
      <>
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong className="font-medium text-foreground">
              Placing an order.
            </strong>{" "}
            Submitting an order is an offer to buy. You receive an order
            confirmation by email, and the sale is formed when we accept the
            order and dispatch the items. We may accept or decline any order.
          </li>
          <li>
            <strong className="font-medium text-foreground">Payment.</strong>{" "}
            Payment is charged to the method you select at checkout, including
            the taxes and delivery fees shown before you confirm. You confirm
            that you are authorised to use that method.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Cancellations.
            </strong>{" "}
            We may cancel an order — for example because of stock, suspected
            fraud, a pricing error, or a restriction on the delivery
            destination — and will refund anything already charged, in full.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Your details.
            </strong>{" "}
            You are responsible for the accuracy of your billing and delivery
            information.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Risk &amp; title.
            </strong>{" "}
            Ownership of and risk in the items pass to you when they are
            delivered to the address you gave us.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "shipping-returns-and-refunds",
    label: "Returns",
    title: "Shipping, returns & refunds",
    body: (
      <>
        <p>
          <strong className="font-medium text-foreground">Shipping.</strong>{" "}
          Processing and delivery estimates shown at checkout are guidance, not
          guarantees — delays happen with carriers and customs. You are
          responsible for providing a complete, accurate delivery address. If
          an order cannot be delivered because of an incorrect address, contact
          us and we will do what we reasonably can to resolve it.
        </p>
        <p>
          <strong className="font-medium text-foreground">Returns.</strong>{" "}
          Apparel may be returned within fourteen (14) days of delivery if it
          is unworn, unwashed, unused, with its original tags attached, and in
          its original packaging. Items marked final sale, and personalised or
          made-to-order pieces, cannot be returned unless they are faulty. To
          start a return, email us with your order number and we will send you
          instructions. Return shipping for change-of-mind returns is at your
          cost, unless the item is faulty or we sent you the wrong item.
        </p>
        <p>
          <strong className="font-medium text-foreground">Refunds.</strong>{" "}
          Returns are inspected on arrival. Approved refunds are issued to the
          original payment method within ten business days, and original
          delivery fees are not refunded on change-of-mind returns. If you
          would rather exchange an item for a different size or color, we will
          do so subject to availability.
        </p>
        <p>
          <strong className="font-medium text-foreground">
            Faulty or wrong items.
          </strong>{" "}
          Tell us within a reasonable time and we will cover the cost of the
          return and offer a replacement or a full refund.
        </p>
        <p>
          Nothing in these terms limits any rights you have under the consumer
          law that applies where you live.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    label: "Ownership",
    title: "Intellectual property",
    body: (
      <>
        <p>
          Everything you see on the store belongs to KOA Clothing or to the
          parties that licensed it to us. That includes the KOA name and logo,
          the warrior marks, product photography, copy, graphics, the design of
          the site, and the software that runs it. All of it is protected by
          copyright, trademark, and other intellectual property laws.
        </p>
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong className="font-medium text-foreground">
              Your licence.
            </strong>{" "}
            While you use the store, we give you a limited, personal,
            non-exclusive, non-transferable, revocable licence to access it for
            your own shopping — nothing more.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              What you may not do.
            </strong>{" "}
            Copy, reproduce, modify, distribute, sell, or commercially exploit
            any part of the store or its content without our written
            permission.
          </li>
          <li>
            <strong className="font-medium text-foreground">Reporting.</strong>{" "}
            If you believe content on the store infringes your rights, contact
            us and we will look into it promptly.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "limitation-of-liability-and-governing-law",
    label: "Legal",
    title: "Limitation of liability & governing law",
    body: (
      <>
        <p>
          The store is provided on an &quot;as is&quot; and &quot;as
          available&quot; basis. We work to keep it accurate, secure, and
          uninterrupted, but we do not warrant that it will be error-free or
          available at all times, and to the extent the law allows we exclude
          implied warranties.
        </p>
        <p>
          To the maximum extent permitted by law, KOA Clothing is not liable for
          indirect, incidental, special, or consequential damages, or for loss
          of profits, data, or goodwill, arising from your use of the store or
          from any delay in delivery. Our total liability for any claim
          connected to an order is limited to the amount you paid for that
          order.
        </p>
        <p>
          Nothing in these terms limits liability that cannot be limited by law,
          including liability for fraud, for death or personal injury caused by
          negligence, or your rights as a consumer under mandatory local law.
        </p>
        <p>
          These terms are governed by the laws of Sri Lanka, and the courts of
          Sri Lanka have exclusive jurisdiction over any dispute arising from
          them, without prejudice to any mandatory protections available to you
          in the country where you live. Before starting any legal proceeding,
          please contact us — most disagreements are settled with an email.
        </p>
      </>
    ),
  },
  {
    id: "changes-and-contact",
    label: "Contact",
    title: "Changes to these terms & contact",
    body: (
      <>
        <p>
          We may update these terms from time to time. The current version is
          always published on this page, with its revision date at the top. If
          a change is material, we will announce it by email or through your
          account before it takes effect. Updated terms apply to your use of
          the store and to orders placed after they take effect.
        </p>
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-1">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
            Contact details
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Questions about these terms, an order, or a return can be sent to{" "}
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

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background text-foreground motion-safe:scroll-smooth">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ── HERO ── */}
        <section className="pt-12 md:pt-16 pb-12">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 font-medium">
            Legal — Terms
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground mb-6">
            Terms of
            <br />
            <span className="text-primary">Service.</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            These terms set out the rules for using the KOA Clothing store and
            for placing an order with us. They protect you as much as they
            protect us, so please read them before you create an account or buy
            anything.
          </p>

          <p className="mt-6 text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
            Last updated — {LAST_UPDATED}
          </p>

          {/* ── CONTENTS ── */}
          <nav
            aria-label="Terms sections"
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
