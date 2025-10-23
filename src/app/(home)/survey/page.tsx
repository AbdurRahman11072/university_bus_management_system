"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import Logo from "../../../../public/GUBLogo.svg";
import { Link, Star } from "lucide-react";
import Image from "next/image";
import React from "react";

const Survey = () => {
  return (
    <form
      action=""
      className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)] my-10"
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
            <span className="font-bold text-accent">
              Survey For Bus Management
            </span>
          </h1>
          <p className="text-sm">please fill the form</p>
        </div>
        {/* password field  */}
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label className="block text-sm">Username</Label>
            <Input type="email" required name="email" id="email" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Semester</Label>
              <Button asChild variant="link" size="sm">
                <Link
                  href="#"
                  className="link intent-info variant-ghost text-sm"
                ></Link>
              </Button>
            </div>
            <Input
              type="semester"
              required
              name="pwd"
              id="pwd"
              className="input sz-md variant-mixed"
            />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Destination</Label>
              <Button asChild variant="link" size="sm">
                <Link
                  href="#"
                  className="link intent-info variant-ghost text-sm"
                ></Link>
              </Button>
            </div>
            <Input
              type="Destination"
              required
              name="Add your location. Like (Mirpur)"
              id="pwd"
              className="input sz-md variant-mixed"
            />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Class Time</Label>
              <Button asChild variant="link" size="sm">
                <Link
                  href="#"
                  className="link intent-info variant-ghost text-sm"
                ></Link>
              </Button>
            </div>
            <Input
              type="Class Time"
              required
              name="Add Class Time. Like (08:30 AM)"
              id="pwd"
              className="input sz-md variant-mixed"
            />
          </div>

          <Button className="w-full">Submit</Button>
        </div>
      </div>
    </form>
  );
};

export default Survey;
