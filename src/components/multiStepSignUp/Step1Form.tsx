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
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

interface Step1FormProps {
  onSubmit: (data: FormStep1Data) => void;
  initialData: FormStep1Data;
}

export function Step1Form({ onSubmit, initialData }: Step1FormProps) {
  const [formData, setFormData] = useState<FormStep1Data>(initialData);
  const [errors, setErrors] = useState<Partial<FormStep1Data>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormStep1Data> = {};

    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors[0];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("One number");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("One special character");
    return errors;
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

    if (errors[name as keyof FormStep1Data]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData((prev) => ({ ...prev, roles: value }));
  };

  const passwordRequirements = [
    { test: (pwd: string) => pwd.length >= 8, text: "At least 8 characters" },
    { test: (pwd: string) => /[A-Z]/.test(pwd), text: "One uppercase letter" },
    { test: (pwd: string) => /[a-z]/.test(pwd), text: "One lowercase letter" },
    { test: (pwd: string) => /[0-9]/.test(pwd), text: "One number" },
    {
      test: (pwd: string) => /[^A-Za-z0-9]/.test(pwd),
      text: "One special character",
    },
  ];

  const allRequirementsMet = passwordRequirements.every((req) =>
    req.test(formData.password)
  );

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User ID */}
        <div className="space-y-3">
          <Label
            htmlFor="uId"
            className="text-sm font-semibold text-foreground"
          >
            User ID *
          </Label>
          <Input
            type="number"
            required
            name="uId"
            id="uId"
            value={formData.uId || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            min="1"
            className={`h-12 text-lg transition-all duration-200 ${
              touched.uId && errors.uId
                ? "border-destructive focus-visible:ring-destructive/20"
                : "focus:ring-2 focus:ring-primary/20"
            }`}
          />
          <AnimatePresence>
            {touched.uId && errors.uId && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-destructive text-sm font-medium flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                {errors.uId}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Username */}
        <div className="space-y-3">
          <Label
            htmlFor="username"
            className="text-sm font-semibold text-foreground"
          >
            Username *
          </Label>
          <Input
            type="text"
            required
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your username"
            className={`h-12 text-lg transition-all duration-200 ${
              touched.username && errors.username
                ? "border-destructive focus-visible:ring-destructive/20"
                : "focus:ring-2 focus:ring-primary/20"
            }`}
          />
          <AnimatePresence>
            {touched.username && errors.username && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-destructive text-sm font-medium flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                {errors.username}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Email */}
        <div className="space-y-3">
          <Label
            htmlFor="email"
            className="text-sm font-semibold text-foreground"
          >
            Email *
          </Label>
          <Input
            type="email"
            required
            name="email"
            id="email"
            value={formData.email || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your email address"
            className={`h-12 text-lg transition-all duration-200 ${
              touched.email && errors.email
                ? "border-destructive focus-visible:ring-destructive/20"
                : "focus:ring-2 focus:ring-primary/20"
            }`}
          />
          <AnimatePresence>
            {touched.email && errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-destructive text-sm font-medium flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                {errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <Label
            htmlFor="roles"
            className="text-sm font-semibold text-foreground"
          >
            Account Type *
          </Label>
          <Select value={formData.roles} onValueChange={handleRoleChange}>
            <SelectTrigger className="h-12 text-lg transition-all duration-200 focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent className="bg-popover border shadow-xl">
              <SelectItem
                value="Student"
                className="text-lg py-3 focus:bg-accent"
              >
                🎓 Student
              </SelectItem>
              <SelectItem
                value="Teacher"
                className="text-lg py-3 focus:bg-accent"
              >
                👨‍🏫 Teacher
              </SelectItem>
              <SelectItem
                value="Driver"
                className="text-lg py-3 focus:bg-accent"
              >
                🚌 Driver
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Password */}
      <div className="space-y-4">
        <Label
          htmlFor="password"
          className="text-sm font-semibold text-foreground"
        >
          Password *
        </Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            required
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Create a strong password"
            className={`h-12 text-lg pr-12 transition-all duration-200 ${
              touched.password && errors.password
                ? "border-destructive focus-visible:ring-destructive/20"
                : "focus:ring-2 focus:ring-primary/20"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Enhanced Password requirements */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {passwordRequirements.map((req, index) => (
            <motion.div
              key={req.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                req.test(formData.password)
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-slate-100 dark:bg-slate-800 border border-transparent"
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  req.test(formData.password)
                    ? "bg-green-500 text-white"
                    : "bg-slate-300 dark:bg-slate-600 text-slate-500"
                }`}
              >
                {req.test(formData.password) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  req.test(formData.password)
                    ? "text-green-700 dark:text-green-300"
                    : "text-muted-foreground"
                }`}
              >
                {req.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {touched.password && errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-destructive text-sm font-medium flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              {errors.password}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg shadow-primary/25 transition-all duration-200"
          disabled={!allRequirementsMet}
        >
          Continue to Profile Setup
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="ml-2"
          >
            →
          </motion.span>
        </Button>
      </motion.div>
    </motion.form>
  );
}
