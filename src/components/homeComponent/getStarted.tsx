import React from "react";

import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

const GetStarted = () => {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands of students and staff using Bus Manager
        </p>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 px-8">
          Sign Up Now
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default GetStarted;
