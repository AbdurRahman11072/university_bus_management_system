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
import Link from "next/link";
import { Step1Form } from "./Step1Form";
import { Step2Form } from "./Step2Form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function MultiStepSignUp() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  if (isAuthenticated) {
    router.push("/");
    toast.info("Your already loged in");
  }

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UserFormData>({
    uId: 0,
    username: "",
    password: "",
    email: "", // Add this
    roles: "Student",
    phone_number: "",
    bloodGroup: "A+",
    batchNo: "", // Add this
    department: "", // Add this
  });

  const handleStep1Submit = (data: FormStep1Data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStep2Submit = async (data: Partial<UserFormData>) => {
    const finalData = { ...formData, ...data };
    console.log("Final form data:", finalData);

    // Here you would send the data to your backend
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

      if (response.ok) {
        console.log("Registration successful!");
        toast.success("User has been created");
        router.push("login");
        // Redirect to login or dashboard
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <section className="flex min-h-screen px-4dark:bg-transparent -mt-2">
      <div className="bg-muted m-auto h-fit w-full max-w-md overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <div className="logo-container">
                <Image
                  src={Logo}
                  alt="logo"
                  width={100}
                  height={50}
                  className="w-48 h-12"
                />
              </div>
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Create a{" "}
              <span className="font-bold text-accent">Green University</span>{" "}
              Bus Account
            </h1>
            <p className="text-sm">Step {currentStep} of 2</p>

            {/* Progress Bar */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          {currentStep === 1 && (
            <Step1Form onSubmit={handleStep1Submit} initialData={formData} />
          )}

          {currentStep === 2 && (
            <Step2Form
              onSubmit={handleStep2Submit}
              onBack={handleBack}
              initialData={formData}
              userRole={formData.roles}
            />
          )}
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Have an account ?
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-500 px-2"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
