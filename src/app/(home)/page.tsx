import FAQsTwo from "@/components/homeComponent/faqs-2";
import GetStarted from "@/components/homeComponent/getStarted";
import HeroSlider from "@/components/homeComponent/heroSlider";
import HowItWorks from "@/components/homeComponent/howItWorks";
import WhyChooseUs from "@/components/homeComponent/whyChooseUs";

export default function Home() {
  return (
    <div className="p-2 space-y-10">
      <HeroSlider />
      <div className="container mx-auto">
        <WhyChooseUs />
        <HowItWorks />
        <FAQsTwo />
        <GetStarted />
      </div>
    </div>
  );
}
