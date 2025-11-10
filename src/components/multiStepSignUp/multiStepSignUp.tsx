"use client";

import { useState } from "react";
import {
  UserFormData,
  FormStep1Data,
  UserRole,
  BloodGroup,
} from "@/lib/userType";

import Logo from "../../../public/GUBLogo.svg";
import Image from "next/image";

import { Step1Form } from "./Step1Form";
import { Step2Form } from "./Step2Form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Cookies from "js-cookie";

export function MultiStepSignUp() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  if (isAuthenticated) {
    router.push("/");
    toast.info("You're already logged in");
  }

  const [formData, setFormData] = useState<UserFormData>({
    uId: 0,
    username: "",
    password: "",
    email: "",
    roles: "Student",
    phone_number: "",
    bloodGroup: "A+",
    batchNo: "",
    department: "",
  });

  const handleStep1Submit = async (data: FormStep1Data) => {
    setIsAnimating(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
    setIsAnimating(false);
  };

  const handleStep2Submit = async (data: Partial<UserFormData>) => {
    const finalData = { ...formData, ...data };
    console.log("Final form data:", finalData);

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/auth/create-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        }
      );
      const { email } = finalData;
      if (response.ok) {
        toast.success("🎉 Account created successfully!");
        Cookies.set("verification-email", email);

        router.push(`/auth/email-verification`);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Connection error. Please check your network.");
    }
  };

  const handleBack = async () => {
    setIsAnimating(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setCurrentStep(1);
    setIsAnimating(false);
  };

  const steps = [
    { number: 1, title: "Basic Info", description: "Account details" },
    { number: 2, title: "Profile Setup", description: "Personal information" },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-emerald-950/10">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl"></div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Side - Branding & Steps */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-5 space-y-8 bg-white p-10 rounded-lg"
            >
              {/* Logo */}
              <Link href="/" className="block w-fit">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="logo-container   backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20  "
                >
                  <Image
                    src={Logo}
                    alt="Green University Logo"
                    width={180}
                    height={60}
                    className="w-48 h-12 lg:w-56 lg:h-14"
                    priority
                  />
                </motion.div>
              </Link>

              {/* Hero Text */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Join Green University Bus System
                </h1>
                <p className="text-xl text-muted-foreground">
                  Create your account and enjoy seamless campus transportation
                  services
                </p>
              </div>

              {/* Enhanced Steps Indicator */}
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 ${
                      currentStep === step.number
                        ? "bg-card shadow-lg border border-primary/20"
                        : "bg-muted/50"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                        currentStep === step.number
                          ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                          : currentStep > step.number
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.number ? "✓" : step.number}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-semibold transition-colors duration-300 ${
                          currentStep === step.number
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-card rounded-xl shadow-sm">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-xs text-muted-foreground">
                    Daily Rides
                  </div>
                </div>
                <div className="text-center p-4 bg-card rounded-xl shadow-sm">
                  <div className="text-2xl font-bold text-accent">50+</div>
                  <div className="text-xs text-muted-foreground">Buses</div>
                </div>
                <div className="text-center p-4 bg-card rounded-xl shadow-sm">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-7"
            >
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="p-8 lg:p-12">
                  {/* Progress Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 mb-4">
                      <span className="text-sm font-medium text-primary">
                        Step {currentStep} of {steps.length}
                      </span>
                    </div>

                    {/* Animated Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(currentStep / steps.length) * 100}%`,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>

                  {/* Form Content */}
                  <AnimatePresence mode="wait">
                    {!isAnimating && (
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {currentStep === 1 && (
                          <Step1Form
                            onSubmit={handleStep1Submit}
                            initialData={formData}
                          />
                        )}

                        {currentStep === 2 && (
                          <Step2Form
                            onSubmit={handleStep2Submit}
                            onBack={handleBack}
                            initialData={formData}
                            userRole={formData.roles}
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bottom Link */}
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-center text-muted-foreground">
                      Already have an account?{" "}
                      <Link
                        href="/auth/login"
                        className="text-primary hover:text-accent font-semibold transition-colors duration-200"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
