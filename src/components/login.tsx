"use client";
import { useState } from "react";
import Logo from "../../public/GUBLogo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
// Adjust the import path as needed

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    uId: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({
        uId: formData.uId,
        password: formData.password,
      });
      // Redirect or show success message - you can add navigation here
      // For example: router.push('/dashboard');
    } catch (error) {
      // Error is already handled in the auth context
      console.error("Login failed:", error);
    }
  };

  return (
    <section className="flex min-h-screen px-4 -mt-18 dark:bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
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
              Sign In To{" "}
              <span className="font-bold text-accent">Green University</span>{" "}
              Bus Management System
            </h1>
            <p className="text-sm">Welcome back! Sign in to continue</p>
          </div>

          {/* Error Message */}

          {/* Login Form */}
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="uId" className="block text-sm">
                User Id
              </Label>
              <Input
                type="text"
                required
                name="uId"
                id="uId"
                value={formData.uId}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                <Button asChild variant="link" size="sm">
                  <Link
                    href="#"
                    className="link intent-info variant-ghost text-sm"
                  >
                    Forgot your Password ?
                  </Link>
                </Button>
              </div>
              <Input
                type="password"
                required
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="input sz-md variant-mixed"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Don't have an account ?
            <Button asChild variant="link" className="px-2">
              <Link href="/auth/register">Create account</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
