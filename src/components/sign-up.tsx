import Logo from "../../public/GUBLogo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SignUp() {
  const [selectedRole, setSelectedRole] = useState<
    "student" | "teacher" | "driver"
  >("student");
  const [verificationImage, setVerificationImage] = useState<File | null>(null);
  const [driverImage, setDriverImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    uId: "",
    password: "",
    confirmPassword: "",
    driverLicence: "",
    licenceExpire: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: "student" | "teacher" | "driver") => {
    setSelectedRole(value);
  };

  const handleVerificationImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setVerificationImage(e.target.files[0]);
    }
  };

  const handleDriverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDriverImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      ...formData,
      role: selectedRole,
      verificationImage,
      driverImage,
    });
  };

  return (
    <section className="flex min-h-screen px-4 py-16 md:py-32 dark:bg-transparent -mt-2">
      <form
        onSubmit={handleSubmit}
        className="bg-muted m-auto h-fit w-full max-w-md overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
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
              Create a{" "}
              <span className="font-bold text-accent">Green University</span>{" "}
              Bus Account
            </h1>
            <p className="text-sm">Welcome! Create an account to get started</p>
          </div>

          <div className="mt-6 space-y-6">
            {/* Role Selection */}

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstname" className="block text-sm">
                  First Name
                </Label>
                <Input
                  type="text"
                  required
                  name="firstname"
                  id="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname" className="block text-sm">
                  Last Name
                </Label>
                <Input
                  type="text"
                  required
                  name="lastname"
                  id="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="uId" className="block text-sm">
                User Id
              </Label>
              <Input
                type="uId"
                required
                name="uId"
                id="uId"
                value={formData.uId}
                onChange={handleInputChange}
              />
            </div>

            {/* Password Fields */}
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
              </div>
              <Input
                type="password"
                required
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input sz-md variant-mixed"
              />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="confirmPassword" className="text-sm">
                  Confirm Password
                </Label>
              </div>
              <Input
                type="password"
                required
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="input sz-md variant-mixed"
              />
            </div>

            {/* Password Match Validation */}
            {formData.password &&
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            {/* role selection  */}
            <div className="space-y-2">
              <Label htmlFor="role" className="block text-sm">
                Account Type
              </Label>
              <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Teacher Verification */}
            {selectedRole === "teacher" && (
              <div className="space-y-2 p-4 border border-dashed rounded-lg bg-muted/50">
                <Label
                  htmlFor="verification-image"
                  className="block text-sm font-medium"
                >
                  Teacher Verification Document
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Upload a photo of your faculty ID or verification document
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  id="verification-image"
                  onChange={handleVerificationImageChange}
                  className="cursor-pointer"
                />
                {verificationImage && (
                  <p className="text-xs text-green-600 mt-1">
                    Selected: {verificationImage.name}
                  </p>
                )}
              </div>
            )}
            {/* Driver Information */}
            {selectedRole === "driver" && (
              <>
                <div className="space-y-2 p-4 border border-dashed rounded-lg bg-muted/50">
                  <Label
                    htmlFor="driver-image"
                    className="block text-sm font-medium"
                  >
                    Driver Photo
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Upload a clear photo of yourself for identification
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    id="driver-image"
                    onChange={handleDriverImageChange}
                    className="cursor-pointer"
                  />
                  {driverImage && (
                    <p className="text-xs text-green-600 mt-1">
                      Selected: {driverImage.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverLicence" className="block text-sm">
                    Driver License Number
                  </Label>
                  <Input
                    type="text"
                    required
                    name="driverLicence"
                    id="driverLicence"
                    value={formData.driverLicence}
                    onChange={handleInputChange}
                    placeholder="Enter your driver license number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenceExpire" className="block text-sm">
                    License Expiry Date
                  </Label>
                  <Input
                    type="date"
                    required
                    name="licenceExpire"
                    id="licenceExpire"
                    value={formData.licenceExpire}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={
                formData.password !== formData.confirmPassword &&
                formData.confirmPassword !== ""
              }
            >
              Create Account
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Have an account ?
            <Button asChild variant="link" className="px-2">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
