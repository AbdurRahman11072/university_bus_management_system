"use client";

import { useState, useCallback } from "react";
import { UserFormData, UserRole, BloodGroup } from "@/lib/userType";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Step2FormProps {
  onSubmit: (data: Partial<UserFormData>) => void;
  onBack: () => void;
  initialData: UserFormData;
  userRole: UserRole;
}

export function Step2Form({
  onSubmit,
  onBack,
  initialData,
  userRole,
}: Step2FormProps) {
  const [formData, setFormData] = useState<Partial<UserFormData>>({
    avatar_url: initialData.avatar_url,
    phone_number: initialData.phone_number || "+8801",
    bloodGroup: initialData.bloodGroup,
    verificationImage: initialData.verificationImage,
    driverLicence: initialData.driverLicence || "",
    licenceExpire: initialData.licenceExpire || "",
    batchNo: initialData.batchNo || "",
    department: initialData.department || "",
  });

  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [verificationImageUrl, setVerificationImageUrl] = useState<string>("");

  const handleAvatarUpload = useCallback((url: string) => {
    setAvatarUrl(url);
    setFormData((prev) => ({ ...prev, avatar_url: url }));
  }, []);

  const handleVerificationImageUpload = useCallback((url: string) => {
    setVerificationImageUrl(url);
    setFormData((prev) => ({ ...prev, verificationImage: url }));
  }, []);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!value.startsWith("+8801")) {
      setFormData((prev) => ({ ...prev, phone_number: "+8801" }));
      return;
    }

    const remainingNumbers = value.slice(5);
    const cleanRemaining = remainingNumbers.replace(/\D/g, "");
    const maxRemainingLength = 9;
    const finalRemaining = cleanRemaining.slice(0, maxRemainingLength);

    const finalPhoneNumber = "+8801" + finalRemaining;
    setFormData((prev) => ({ ...prev, phone_number: finalPhoneNumber }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBloodGroupChange = (value: BloodGroup) => {
    setFormData((prev) => ({ ...prev, bloodGroup: value }));
  };

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const phoneRegex = /^\+8801\d{9}$/;
    if (!phoneRegex.test(formData.phone_number || "")) {
      toast.error(
        "Phone number must be in the format: +8801XXXXXXXXX (14 digits total)"
      );
      return;
    }

    if (userRole === "Student") {
      if (!formData.batchNo) {
        toast.error("Please enter your batch number");
        return;
      }
      if (!formData.department) {
        toast.error("Please select your department");
        return;
      }
    }

    if (userRole === "Teacher" && !formData.verificationImage) {
      toast.error("Please upload teacher verification document");
      return;
    }

    if (userRole === "Driver") {
      if (!formData.verificationImage) {
        toast.error("Please upload driver verification photo");
        return;
      }
      if (!formData.driverLicence) {
        toast.error("Please enter driver license number");
        return;
      }
      if (!formData.licenceExpire) {
        toast.error("Please select license expiry date");
        return;
      }
    }

    const submitData: Partial<UserFormData> = {
      avatar_url: formData.avatar_url,
      phone_number: formData.phone_number,
      bloodGroup: formData.bloodGroup,
    };

    if (userRole === "Student") {
      submitData.batchNo = formData.batchNo;
      submitData.department = formData.department;
    }

    if (userRole === "Teacher" || userRole === "Driver") {
      submitData.verificationImage = formData.verificationImage;
    }

    if (userRole === "Driver") {
      submitData.driverLicence = formData.driverLicence;
      submitData.licenceExpire = formData.licenceExpire;
    }

    onSubmit(submitData);
  };

  const departments = [
    "Computer Science and Engineering",
    "Electrical and Electronic Engineering",
    "Business Administration",
    "Economics",
    "English",
    "Law",
    "Pharmacy",
    "Public Health",
    "Architecture",
    "Environmental Science",
  ];

  const isFormDisabled = () => {
    if (!formData.phone_number || formData.phone_number.length !== 14) {
      return true;
    }

    if (userRole === "Student") {
      return !formData.batchNo || !formData.department;
    }

    if (userRole === "Teacher") {
      return !formData.verificationImage;
    }

    if (userRole === "Driver") {
      return (
        !formData.verificationImage ||
        !formData.driverLicence ||
        !formData.licenceExpire
      );
    }

    return false;
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* Compact Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile Photo - Now in first row */}
        <div className="md:col-span-2 space-y-2">
          <Label className="text-sm font-semibold text-foreground">
            Profile Photo (Optional)
          </Label>
          <div className="h-24">
            <ImageUpload
              onUploadComplete={handleAvatarUpload}
              previewUrl={avatarUrl}
              label="Click to upload profile photo"
              compact
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label
            htmlFor="phone_number"
            className="text-sm font-semibold text-foreground"
          >
            Phone Number *
          </Label>
          <div className="relative">
            <Input
              type="tel"
              required
              name="phone_number"
              id="phone_number"
              value={formData.phone_number || "+8801"}
              onChange={handlePhoneNumberChange}
              placeholder="+8801XXXXXXXXX"
              className="h-10 text-sm"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm pointer-events-none"></div>
          </div>
          {formData.phone_number && (
            <p
              className={`text-xs font-medium ${
                formData.phone_number.length === 14
                  ? "text-green-600"
                  : "text-amber-600"
              }`}
            >
              {formData.phone_number.length === 14
                ? "✓ Complete"
                : `${formData.phone_number.length - 5}/9 digits`}
            </p>
          )}
        </div>

        {/* Blood Group */}
        <div className="space-y-2">
          <Label
            htmlFor="bloodGroup"
            className="text-sm font-semibold text-foreground"
          >
            Blood Group *
          </Label>
          <Select
            value={formData.bloodGroup}
            onValueChange={handleBloodGroupChange}
          >
            <SelectTrigger className="h-10 text-sm">
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent className="bg-popover border shadow-xl">
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (group) => (
                  <SelectItem key={group} value={group} className="text-sm">
                    {group}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Student Specific Fields */}
        {userRole === "Student" && (
          <>
            <div className="space-y-2">
              <Label
                htmlFor="batchNo"
                className="text-sm font-semibold text-foreground"
              >
                Batch Number *
              </Label>
              <Input
                type="text"
                required
                name="batchNo"
                id="batchNo"
                value={formData.batchNo || ""}
                onChange={handleChange}
                placeholder="e.g., 2023"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="department"
                className="text-sm font-semibold text-foreground"
              >
                Department *
              </Label>
              <Select
                value={formData.department}
                onValueChange={handleDepartmentChange}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-xl max-h-48">
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept} className="text-sm">
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Teacher Verification */}
        {userRole === "Teacher" && (
          <div className="md:col-span-2 space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Teacher Verification *
            </Label>
            <div className="h-24">
              <ImageUpload
                onUploadComplete={handleVerificationImageUpload}
                previewUrl={verificationImageUrl}
                label="Click to upload verification document"
                compact
              />
            </div>
            {verificationImageUrl && (
              <p className="text-xs text-green-600 font-medium">
                ✓ Document uploaded
              </p>
            )}
          </div>
        )}

        {/* Driver Information */}
        {userRole === "Driver" && (
          <>
            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Driver Verification Photo *
              </Label>
              <div className="h-24">
                <ImageUpload
                  onUploadComplete={handleVerificationImageUpload}
                  previewUrl={verificationImageUrl}
                  label="Click to upload driver photo"
                  compact
                />
              </div>
              {verificationImageUrl && (
                <p className="text-xs text-green-600 font-medium">
                  ✓ Photo uploaded
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="driverLicence"
                className="text-sm font-semibold text-foreground"
              >
                License Number *
              </Label>
              <Input
                type="text"
                required
                name="driverLicence"
                id="driverLicence"
                value={formData.driverLicence || ""}
                onChange={handleChange}
                placeholder="Driver license number"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="licenceExpire"
                className="text-sm font-semibold text-foreground"
              >
                Expiry Date *
              </Label>
              <Input
                type="date"
                required
                name="licenceExpire"
                id="licenceExpire"
                value={formData.licenceExpire || ""}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="h-10 text-sm"
              />
            </div>
          </>
        )}
      </div>

      {/* Navigation Buttons - Fixed at bottom */}
      <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1"
        >
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full h-11 border-2 hover:bg-accent hover:text-accent-foreground transition-all duration-200"
          >
            ← Back
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1"
        >
          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isFormDisabled()}
          >
            Create Account 🎉
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
}
