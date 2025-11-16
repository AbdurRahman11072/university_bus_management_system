"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { API_BASE } from "@/lib/config";

interface PasswordChangeForm {
  email: string;
  currentPass: string;
  newPass: string;
  confirmPass: string;
}

interface PasswordChangeResponse {
  status: string;
  message: string;
  data: any;
}

interface Message {
  type: "success" | "error";
  text: string;
}

export default function PasswordChangeComponent() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<PasswordChangeForm>({
    email: user?.email || "",
    currentPass: "",
    newPass: "",
    confirmPass: "",
  });
  const [showCurrentPass, setShowCurrentPass] = useState<boolean>(false);
  const [showNewPass, setShowNewPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [errors, setErrors] = useState<Partial<PasswordChangeForm>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<PasswordChangeForm> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.currentPass) {
      newErrors.currentPass = "Current password is required";
    }

    const passwordErrors = validatePassword(formData.newPass);
    if (passwordErrors.length > 0) {
      newErrors.newPass = passwordErrors[0];
    }

    if (formData.newPass !== formData.confirmPass) {
      newErrors.confirmPass = "Passwords do not match";
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    // Prevent changes to email field
    if (name === "email") return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof PasswordChangeForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    // Don't set touched for email field since it's not editable
    if (name !== "email") {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/update-pass`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          currentPass: formData.currentPass,
          newPass: formData.newPass,
        }),
      });

      const data: PasswordChangeResponse = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        setFormData((prev) => ({
          ...prev,
          currentPass: "",
          newPass: "",
          confirmPass: "",
        }));
        setTouched({});
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to update password",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
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
    req.test(formData.newPass)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6 bg-card rounded-lg border border-border"
    >
      <h2 className="text-2xl font-bold text-card-foreground mb-6 text-center">
        Change Password
      </h2>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Email Input - Read Only */}
        <div className="space-y-3">
          <Label
            htmlFor="email"
            className="text-sm font-semibold text-foreground"
          >
            Email Address *
          </Label>
          <div className="relative">
            <Input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              readOnly
              className="h-12 text-lg bg-muted text-foreground border-border cursor-not-allowed opacity-80 pr-12"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Using your registered email address
          </p>
        </div>

        {/* Current Password Input */}
        <div className="space-y-3">
          <Label
            htmlFor="currentPass"
            className="text-sm font-semibold text-foreground"
          >
            Current Password *
          </Label>
          <div className="relative">
            <Input
              type={showCurrentPass ? "text" : "password"}
              name="currentPass"
              id="currentPass"
              value={formData.currentPass}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter current password"
              className={`h-12 text-lg pr-12 transition-all duration-200 ${
                touched.currentPass && errors.currentPass
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : "focus:ring-2 focus:ring-primary/20"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPass(!showCurrentPass)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showCurrentPass ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <AnimatePresence>
            {touched.currentPass && errors.currentPass && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-destructive text-sm font-medium flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                {errors.currentPass}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* New Password Input with Enhanced Requirements */}
        <div className="space-y-4">
          <Label
            htmlFor="newPass"
            className="text-sm font-semibold text-foreground"
          >
            New Password *
          </Label>
          <div className="relative">
            <Input
              type={showNewPass ? "text" : "password"}
              name="newPass"
              id="newPass"
              value={formData.newPass}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Create a strong password"
              className={`h-12 text-lg pr-12 transition-all duration-200 ${
                touched.newPass && errors.newPass
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : "focus:ring-2 focus:ring-primary/20"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPass(!showNewPass)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showNewPass ? (
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
                  req.test(formData.newPass)
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-slate-100 dark:bg-slate-800 border border-transparent"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    req.test(formData.newPass)
                      ? "bg-green-500 text-white"
                      : "bg-slate-300 dark:bg-slate-600 text-slate-500"
                  }`}
                >
                  {req.test(formData.newPass) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    req.test(formData.newPass)
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
            {touched.newPass && errors.newPass && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-destructive text-sm font-medium flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                {errors.newPass}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-3">
          <Label
            htmlFor="confirmPass"
            className="text-sm font-semibold text-foreground"
          >
            Confirm New Password *
          </Label>
          <div className="relative">
            <Input
              type={showConfirmPass ? "text" : "password"}
              name="confirmPass"
              id="confirmPass"
              value={formData.confirmPass}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm new password"
              className={`h-12 text-lg pr-12 transition-all duration-200 ${
                touched.confirmPass && errors.confirmPass
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : "focus:ring-2 focus:ring-primary/20"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPass ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <AnimatePresence>
            {touched.confirmPass && errors.confirmPass && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-destructive text-sm font-medium flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                {errors.confirmPass}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Message Display */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg border ${
                message.type === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300"
                  : "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            disabled={
              isLoading ||
              !allRequirementsMet ||
              formData.newPass !== formData.confirmPass
            }
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg shadow-primary/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Updating Password...
              </>
            ) : (
              <>
                Update Password
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </>
            )}
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
