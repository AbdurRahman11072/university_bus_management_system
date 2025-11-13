"use client";
import { useForm } from "react-hook-form";
import { AlertCircle, Bus, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/hooks/axiosInstance";
import { toast } from "sonner";

interface ContactFormData {
  uId: string;
  semester: string;
  subject: string;
  message: string;
}

const ContactUsPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await axiosInstance.post("/contect-us/post-info", data);
      toast("Successfull", {
        description: "Thank you for you time & valueable comment",
      });
      console.log("Message sent successfully:", response);
      reset(); // Clear form after successful submission
      // You can add a toast notification here for success
    } catch (error) {
      console.error("Error sending message:", error);
      // You can add a toast notification here for error
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Contact & Support
          </h1>
          <p className="text-muted-foreground mt-1">
            Get in touch with us for any assistance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                We'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="uId"
                    className="text-sm font-semibold text-foreground"
                  >
                    Name
                  </label>
                  <input
                    id="uId"
                    type="text"
                    placeholder="Your uId"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    {...register("uId", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                  />
                  {errors.uId && (
                    <p className="text-sm text-red-500">{errors.uId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="semester"
                    className="text-sm font-semibold text-foreground"
                  >
                    Semester
                  </label>
                  <input
                    id="semester"
                    type="semester"
                    placeholder="which Semester are you in."
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    {...register("semester", {
                      required: "Semester is required",
                    })}
                  />
                  {errors.semester && (
                    <p className="text-sm text-red-500">
                      {errors.semester.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-semibold text-foreground"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="How can we help?"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    {...register("subject", {
                      required: "Subject is required",
                      minLength: {
                        value: 5,
                        message: "Subject must be at least 5 characters",
                      },
                    })}
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-500">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-semibold text-foreground"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Your message..."
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    {...register("message", {
                      required: "Message is required",
                      minLength: {
                        value: 10,
                        message: "Message must be at least 10 characters",
                      },
                    })}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg h-fit">
                    <Bus className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Bus Management Office
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Main Campus, Building A
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-accent/10 p-3 rounded-lg h-fit">
                    <AlertCircle className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      +91 (555) 123-4567
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-secondary/10 p-3 rounded-lg h-fit">
                    <MapPin className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">
                      support@busmanager.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Office Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground font-medium">
                    Monday - Friday
                  </span>
                  <span className="text-muted-foreground">
                    8:00 AM - 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground font-medium">Saturday</span>
                  <span className="text-muted-foreground">
                    9:00 AM - 2:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground font-medium">Sunday</span>
                  <span className="text-muted-foreground">Closed</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
