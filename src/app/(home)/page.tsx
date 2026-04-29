import FAQsTwo from "@/components/homeComponent/faqs-2";
import GetStarted from "@/components/homeComponent/getStarted";
import HeroSlider from "@/components/homeComponent/heroSlider";
import HowItWorks from "@/components/homeComponent/howItWorks";
import WhyChooseUs from "@/components/homeComponent/whyChooseUs";
import { PremiumStats } from "@/components/homeComponent/premiumStats";
import { LiveStatusPreview } from "@/components/homeComponent/liveStatusPreview";

export default function Home() {
  return (
    <div className="space-y-24 pb-20">
      <HeroSlider />
      
      <div className="container mx-auto px-4">
        <WhyChooseUs />
      </div>

      <PremiumStats />

      <div className="container mx-auto px-4">
        <LiveStatusPreview />
        
        <div className="pt-10">
          <HowItWorks />
        </div>
        
        <FAQsTwo />
        
        <div className="mt-20">
          <GetStarted />
        </div>
      </div>
    </div>
  );
}
