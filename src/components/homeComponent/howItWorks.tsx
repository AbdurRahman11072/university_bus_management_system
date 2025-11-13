import { Bus, BusFront, BusIcon, ChevronRight, Earth, Hourglass, LogIn } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const Details = [
  {
    step: 1,
    title: "Sign Up",
    description: "Create your account in seconds",
  },
  {
    step: 2,
    title: "Select Bus",
    description: "Choose your preferred bus route",
  },
  {
    step: 3,
    title: "Make Payment",
    description: "Secure payment processing",
  },
  {
    step: 4,
    title: "Start Tracking",
    description: "Track your bus in real-time",
  },
];

const HowItWorks = () => {
  return (
    <section className="space-y-5">
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in just 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Details.map((item, index) => (
              <div
                key={item.title}
                className="relative hover:scale-110 transition-all duration-300"
              >
                <Card className="border-primary/20 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                        {item.step}
                      </div>
                      {index < 3 && (
                        <ChevronRight className="w-5 h-5 text-primary/50 hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {item?.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
