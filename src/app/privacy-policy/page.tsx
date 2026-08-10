import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="9 July 2026"
      sections={[
        {
          title: "1. Information We Collect",
          body: [
            "We collect information you provide directly, such as your name, email, phone number, shipping address, and payment details when you place an order or create an account.",
            "We also collect limited technical data (browser type, device information, pages visited) to improve site performance and security.",
          ],
        },
        {
          title: "2. How We Use Your Information",
          body: [
            "To process and deliver your orders, communicate order updates, respond to enquiries, and improve our products and services.",
            "We do not sell your personal information to third parties. Payment details are processed securely by our payment partners and are never stored on our servers.",
          ],
        },
        {
          title: "3. Cookies",
          body: [
            "We use cookies to keep your cart and preferences saved between visits, and to understand how visitors use our site so we can improve it.",
          ],
        },
        {
          title: "4. Data Sharing",
          body: [
            "We share order information with logistics and payment partners only to the extent necessary to fulfill your order — for example, your address with our courier partner, and payment information with our payment gateway.",
          ],
        },
        {
          title: "5. Your Rights",
          body: [
            "You may request access to, correction of, or deletion of your personal data at any time by contacting us at jsrkrishna999@gmail.com.",
          ],
        },
        {
          title: "6. Contact Us",
          body: [
            "For any privacy-related questions, reach out via our Contact Us page or write to jsrkrishna999@gmail.com.",
          ],
        },
      ]}
    />
  );
}
