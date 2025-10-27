"use client";

import { useState } from "react";
import { FormStep1Data, UserRole } from "@/lib/userType";
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

interface Step1FormProps {
  onSubmit: (data: FormStep1Data) => void;
  initialData: FormStep1Data;
}

export function Step1Form({ onSubmit, initialData }: Step1FormProps) {
  const [formData, setFormData] = useState<FormStep1Data>(initialData);
  const [errors, setErrors] = useState<Partial<FormStep1Data>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormStep1Data> = {};

    // Username validation
    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    } else if (formData.username.length > 30) {
      newErrors.username = "Username cannot exceed 30 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (formData.password.length > 32) {
      newErrors.password = "Password cannot exceed 32 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "uId" ? parseInt(value) || 0 : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormStep1Data]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData((prev) => ({ ...prev, roles: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      {/* User ID */}
      <div className="space-y-2">
        <Label htmlFor="uId" className="block text-sm">
          User ID *
        </Label>
        <Input
          type="number"
          required
          name="uId"
          id="uId"
          value={formData.uId || ""}
          onChange={handleChange}
          min="1"
        />
        {errors.uId && <p className="text-red-500 text-xs">{errors.uId}</p>}
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username" className="block text-sm">
          Username *
        </Label>
        <Input
          type="text"
          required
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
        />
        {errors.username && (
          <p className="text-red-500 text-xs">{errors.username}</p>
        )}
      </div>

      {/* Role Selection */}
      <div className="space-y-2">
        <Label htmlFor="roles" className="block text-sm">
          Account Type *
        </Label>
        <Select value={formData.roles} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Student">Student</SelectItem>
            <SelectItem value="Teacher">Teacher</SelectItem>
            <SelectItem value="Driver">Driver</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="block text-sm">
          Password *
        </Label>
        <Input
          type="password"
          required
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password}</p>
        )}

        {/* Password requirements */}
        <div className="text-xs text-gray-600 space-y-1 mt-2">
          <p>Password must contain:</p>
          <ul className="list-disc list-inside">
            <li
              className={formData.password.length >= 8 ? "text-green-600" : ""}
            >
              8-32 characters
            </li>
            <li
              className={
                /[A-Z]/.test(formData.password) ? "text-green-600" : ""
              }
            >
              One uppercase letter
            </li>
            <li
              className={
                /[a-z]/.test(formData.password) ? "text-green-600" : ""
              }
            >
              One lowercase letter
            </li>
            <li
              className={
                /[0-9]/.test(formData.password) ? "text-green-600" : ""
              }
            >
              One number
            </li>
            <li
              className={
                /[^A-Za-z0-9]/.test(formData.password) ? "text-green-600" : ""
              }
            >
              One special character
            </li>
          </ul>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Continue to Next Step
      </Button>
    </form>
  );
}
