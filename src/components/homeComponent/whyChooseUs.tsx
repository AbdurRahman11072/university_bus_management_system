import React from "react";
import Title from "../ui/title";
import { Bus, Clock, Earth, Eye, Hourglass, Shield, Zap } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const Details = [
  {
    icon: Eye,
    title: "Live Tracking",
    description: "Real-time GPS location of all buses",
  },
  {
    icon: Clock,
    title: "Smart Scheduling",
    description: "Accurate schedules and arrival times",
  },
  {
    icon: Zap,
    title: "Quick Booking",
    description: "Book trips in just a few taps",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Safe and encrypted transactions",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="space-y-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Choose Bus Manager?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your bus journey efficiently and
            securely
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Details.map((item) => (
            <Card
              key={item.title}
              className="border-primary/30 shadow-xl hover:scale-110 transition-all duration-300 bg-white"
            >
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
