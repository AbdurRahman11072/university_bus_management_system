import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ContectForm from "@/components/contectFrom";

const ContactUsPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Get in Touch
          </h1>
          <p className="text-balance text-lg leading-relaxed text-muted-foreground">
            Have a question or want to ask? We'd love to hear from you.
          </p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Contact Us</CardTitle>
            <CardDescription className="leading-relaxed">
              Fill out the form below and we'll get back to you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContectForm />
          </CardContent>
        </Card>

        <div className="mt-12 grid gap-6 text-center md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Email</h3>
            <p className="text-sm text-muted-foreground">
              greenuniversity@gmail.com
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Phone</h3>
            <p className="text-sm text-muted-foreground">1234</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Location</h3>
            <p className="text-sm text-muted-foreground">Mirpur Dhaka</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
