import FAQs from "@/components/faqs";
import HeroSlider from "@/components/heroSlider";
import HowItWorks from "@/components/howItWorks";
import WhyChooseUs from "@/components/whyChooseUs";
import { Section } from "lucide-react";

export default function Home() {
  return (
    <div className="p-2 space-y-10">
      <HeroSlider />
      <WhyChooseUs />
      <HowItWorks />
      <FAQs />
    </div>
  );
}
