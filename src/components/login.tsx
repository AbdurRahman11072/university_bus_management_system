"use client";
import { useState, useEffect } from "react";
import Logo from "../../public/GUBLogo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login, isLoading, isAuthenticated, initialCheckComplete } = useAuth();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    uId: "",
    password: "",
  });

  // Only redirect if initial check is complete and user is authenticated
  useEffect(() => {
    if (initialCheckComplete && isAuthenticated) {
      router.push("/");
      toast.info("You're already logged in");
    }
  }, [isAuthenticated, initialCheckComplete, router]);

  // Show loading state while checking authentication
  if (!initialCheckComplete || (initialCheckComplete && isAuthenticated)) {
    return (
      <section className="flex min-h-screen px-4 items-center justify-center bg-background">
        <div className="bg-card w-full max-w-sm rounded-lg border border-border shadow-lg p-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-muted rounded-full animate-pulse"></div>
            </div>
            <p className="text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      </section>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await login({
        uId: formData.uId,
        password: formData.password,
      });
    } catch (error: any) {
      setErrorMsg(`${error.response?.data?.message || "Login failed"}`);
      toast.error(`${error.response?.data?.message || "Login failed"}`);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-card w-full max-w-md overflow-hidden rounded-xl border border-border shadow-xl"
      >
        <div className="p-8 pb-6">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/"
              aria-label="go home"
              className="mx-auto block w-fit mb-6"
            >
              <div className="logo-container transition-transform hover:scale-105">
                <Image
                  src={Logo}
                  alt="Green University Logo"
                  width={192}
                  height={48}
                  className="w-48 h-12 object-contain"
                  priority
                />
              </div>
            </Link>
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              Sign In To <span className="text-primary">Green University</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Bus Management System
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome back! Sign in to continue
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="uId"
                className="text-sm font-medium text-foreground"
              >
                User ID
              </Label>
              <Input
                type="text"
                required
                name="uId"
                id="uId"
                value={formData.uId}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Enter your user ID"
                className="w-full transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                <Button asChild variant="link" size="sm" className="p-0 h-auto">
                  <Link
                    href="#"
                    className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                  >
                    Forgot your Password?
                  </Link>
                </Button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Enter your password"
                  className="w-full pr-10 transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20">
                <p className="text-destructive text-sm font-medium">
                  {errorMsg}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/50 border-t border-border px-6 py-4">
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button
              asChild
              variant="link"
              className="p-0 h-auto text-primary hover:text-primary/80 font-semibold"
            >
              <Link href="/auth/register" className="text-sm">
                Create account
              </Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
