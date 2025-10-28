"use client";

import { useState, useCallback } from "react";
import { UserFormData, UserRole, BloodGroup } from "@/lib/userType";
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
import { ImageUpload } from "./ImageUpload";

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

    // Ensure the number always starts with +8801
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

    // Validate phone number format and length
    const phoneRegex = /^\+8801\d{9}$/;
    if (!phoneRegex.test(formData.phone_number || "")) {
      alert(
        "Phone number must be in the format: +8801XXXXXXXXX (14 digits total, including +8801)"
      );
      return;
    }

    // Validate required fields for Student role
    if (userRole === "Student") {
      if (!formData.batchNo) {
        alert("Please enter your batch number");
        return;
      }
      if (!formData.department) {
        alert("Please select your department");
        return;
      }
    }

    // Validate required fields for Teacher role
    if (userRole === "Teacher" && !formData.verificationImage) {
      alert("Please upload teacher verification document");
      return;
    }

    // Validate required fields for Driver role
    if (userRole === "Driver") {
      if (!formData.verificationImage) {
        alert("Please upload driver verification photo");
        return;
      }
      if (!formData.driverLicence) {
        alert("Please enter driver license number");
        return;
      }
      if (!formData.licenceExpire) {
        alert("Please select license expiry date");
        return;
      }
    }

    // Prepare the data to submit - only include fields that are relevant to the role
    const submitData: Partial<UserFormData> = {
      avatar_url: formData.avatar_url,
      phone_number: formData.phone_number,
      bloodGroup: formData.bloodGroup,
    };

    // Add role-specific fields
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

    console.log("Submitting data:", submitData);
    onSubmit(submitData);
  };

  // Department options
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

  // Check if form is disabled based on role requirements
  const isFormDisabled = () => {
    // Basic required fields for all roles
    if (!formData.phone_number || formData.phone_number.length !== 14) {
      return true;
    }

    // Role-specific requirements
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
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      {/* Avatar Upload */}
      <div className="space-y-2">
        <Label className="block text-sm font-medium">Profile Photo</Label>
        <ImageUpload
          onUploadComplete={handleAvatarUpload}
          previewUrl={avatarUrl}
          label="Drag & drop your profile photo here or click to browse"
        />
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phone_number" className="block text-sm">
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
            className="pl-16"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
            +8801
          </div>
        </div>
        <p className="text-xs text-gray-600">
          Enter the remaining 9 digits of your phone number
          {formData.phone_number && (
            <span
              className={`block ${
                formData.phone_number.length === 14
                  ? "text-green-600"
                  : "text-amber-600"
              }`}
            >
              Full number: {formData.phone_number} (
              {formData.phone_number.length - 5}/9 digits entered)
              {formData.phone_number.length === 14 && " ✓ Complete"}
            </span>
          )}
        </p>
      </div>

      {/* Blood Group */}
      <div className="space-y-2">
        <Label htmlFor="bloodGroup" className="block text-sm">
          Blood Group *
        </Label>
        <Select
          value={formData.bloodGroup}
          onValueChange={handleBloodGroupChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select blood group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A+">A+</SelectItem>
            <SelectItem value="A-">A-</SelectItem>
            <SelectItem value="B+">B+</SelectItem>
            <SelectItem value="B-">B-</SelectItem>
            <SelectItem value="AB+">AB+</SelectItem>
            <SelectItem value="AB-">AB-</SelectItem>
            <SelectItem value="O+">O+</SelectItem>
            <SelectItem value="O-">O-</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Student Specific Fields */}
      {userRole === "Student" && (
        <>
          {/* Batch Number */}
          <div className="space-y-2">
            <Label htmlFor="batchNo" className="block text-sm">
              Batch Number *
            </Label>
            <Input
              type="text"
              required
              name="batchNo"
              id="batchNo"
              value={formData.batchNo || ""}
              onChange={handleChange}
              placeholder="Enter your batch number (e.g., 2023)"
            />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department" className="block text-sm">
              Department *
            </Label>
            <Select
              value={formData.department}
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
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
        <div className="space-y-2 p-4 border border-dashed rounded-lg bg-muted/50">
          <Label className="block text-sm font-medium">
            Teacher Verification Document *
          </Label>
          <p className="text-xs text-muted-foreground mb-2">
            Upload a photo of your faculty ID or verification document
          </p>
          <ImageUpload
            onUploadComplete={handleVerificationImageUpload}
            previewUrl={verificationImageUrl}
            label="Drag & drop verification document here or click to browse"
          />
          {verificationImageUrl && (
            <p className="text-xs text-green-600 mt-2">
              ✓ Verification document uploaded successfully
            </p>
          )}
        </div>
      )}

      {/* Driver Information */}
      {userRole === "Driver" && (
        <>
          {/* Driver Photo Verification */}
          <div className="space-y-2 p-4 border border-dashed rounded-lg bg-muted/50">
            <Label className="block text-sm font-medium">
              Driver Verification Photo *
            </Label>
            <p className="text-xs text-muted-foreground mb-2">
              Upload a clear photo of yourself for identification
            </p>
            <ImageUpload
              onUploadComplete={handleVerificationImageUpload}
              previewUrl={verificationImageUrl}
              label="Drag & drop driver photo here or click to browse"
            />
            {verificationImageUrl && (
              <p className="text-xs text-green-600 mt-2">
                ✓ Driver photo uploaded successfully
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="driverLicence" className="block text-sm">
              Driver License Number *
            </Label>
            <Input
              type="text"
              required
              name="driverLicence"
              id="driverLicence"
              value={formData.driverLicence || ""}
              onChange={handleChange}
              placeholder="Enter your driver license number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenceExpire" className="block text-sm">
              License Expiry Date *
            </Label>
            <Input
              type="date"
              required
              name="licenceExpire"
              id="licenceExpire"
              value={formData.licenceExpire || ""}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={isFormDisabled()}>
          Create Account
        </Button>
      </div>
    </form>
  );
}
