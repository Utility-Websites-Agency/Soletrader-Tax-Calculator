import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy | SoleTraderTax",
  description: "SoleTraderTax privacy policy. How we collect, use, and protect your information.",
  alternates: { canonical: "https://soletradertax.com.au/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-full bg-[#0d1117]">
      <SiteNav />
      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-[720px]">
          <h1 className="text-[32px] font-bold text-white mb-2">Privacy policy</h1>
          <p className="text-[13px] text-[#5f6266] mb-10">Last updated: 30 April 2026</p>

          <p className="text-[#c9d1d9] text-[16px] leading-[28px] mb-10">
            This privacy policy explains how SoleTraderTax (<strong className="text-white">soletradertax.com.au</strong>)
            collects, uses, and protects information when you use our website and tools.
          </p>

          <section className="mb-8">
            <h2 className="text-[20px] font-semibold text-white mb-3">Information we collect</h2>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px] mb-3">
              <strong className="text-white">Calculator inputs:</strong> When you use our calculators (income, GST, rate),
              the values you enter are processed entirely in your browser. We do not transmit or store any
              calculator inputs on our servers.
            </p>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px] mb-3">
              <strong className="text-white">Usage data:</strong> We use Google Analytics to collect anonymised data
              about how visitors use the site — pages viewed, time on site, device type, and approximate
              geographic location (country/city level). This data does not identify you personally.
            </p>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px]">
              <strong className="text-white">Contact emails:</strong> If you email us at hello@soletradertax.com.au,
              we retain your email address and message content to respond to your enquiry. We do not add
              you to any mailing list without explicit consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-[20px] font-semibold text-white mb-3">Cookies</h2>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px] mb-3">
              We use the following cookies:
            </p>
            <ul className="flex flex-col gap-3">
              {[
                ["Google Analytics", "Anonymised usage tracking. Set by Google and governed by Google's privacy policy."],
                ["Google AdSense", "Used to serve relevant advertisements. Google may use cookies to show ads based on your prior visits to this or other websites. You can opt out via Google's Ad Settings."],
              ].map(([name, desc]) => (
                <li key={name} className="rounded-xl border border-[#30363d] bg-[#161b22] px-5 py-4">
                  <p className="text-[14px] font-semibold text-white mb-1">{name}</p>
                  <p className="text-[14px] text-[#c9d1d9] leading-[22px]">{desc}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-[20px] font-semibold text-white mb-3">Advertising</h2>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px] mb-3">
              SoleTraderTax uses Google AdSense to display advertisements. Google, as a third-party
              vendor, uses cookies to serve ads based on your visits to this and other websites.
            </p>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px]">
              You can opt out of personalised advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#1a6fe8] hover:underline">
                Google's Ad Settings
              </a>{" "}
              or{" "}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#1a6fe8] hover:underline">
                aboutads.info
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-[20px] font-semibold text-white mb-3">How we use your information</h2>
            <ul className="flex flex-col gap-2 text-[#c9d1d9] text-[16px] leading-[28px] list-disc list-inside">
              <li>To operate and improve the website and calculators</li>
              <li>To respond to enquiries you send us</li>
              <li>To understand how the site is used (aggregated analytics only)</li>
              <li>To serve relevant advertising via Google AdSense</li>
            </ul>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px] mt-3">
              We do not sell, trade, or otherwise transfer your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-[20px] font-semibold text-white mb-3">Third-party links</h2>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px]">
              Our articles occasionally link to external websites such as the ATO. We are not responsible
              for the privacy practices or content of those sites. We recommend reviewing their privacy
              policies before submitting any personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-[20px] font-semibold text-white mb-3">Data retention</h2>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px]">
              Google Analytics data is retained for 14 months. Email enquiries are retained for up to
              12 months. Calculator inputs are never stored.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-[20px] font-semibold text-white mb-3">Your rights</h2>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px]">
              Under Australian privacy law (Privacy Act 1988), you have the right to request access to
              any personal information we hold about you, and to request corrections. To make a request,
              contact us at{" "}
              <a href="mailto:hello@soletradertax.com.au" className="text-[#1a6fe8] hover:underline">
                hello@soletradertax.com.au
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-[20px] font-semibold text-white mb-3">Changes to this policy</h2>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px]">
              We may update this policy from time to time. The date at the top of this page reflects
              the most recent revision. Continued use of the site after any changes constitutes acceptance
              of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-semibold text-white mb-3">Contact</h2>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px]">
              Privacy questions or requests:{" "}
              <a href="mailto:hello@soletradertax.com.au" className="text-[#1a6fe8] hover:underline">
                hello@soletradertax.com.au
              </a>
              {" "}·{" "}
              <Link href="/contact" className="text-[#1a6fe8] hover:underline">Contact page</Link>
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
