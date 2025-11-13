import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, CheckCircle2, ArrowLeft, ExternalLink, Play } from "lucide-react";
import React, { useState, useEffect } from "react";
import { SurveyData, PaymentStatus, BKashData } from "./surveyMain";
import { useAuth } from "@/hooks/useAuth";

interface PaymentFormProps {
  formData: SurveyData;
  bKashData: BKashData;
  setBKashData: React.Dispatch<React.SetStateAction<BKashData>>;
  isSubmitting: boolean;
  paymentStatus: PaymentStatus;
  setPaymentStatus: React.Dispatch<React.SetStateAction<PaymentStatus>>;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  onPreviousStep: () => void;
  onConfirmation: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  formData,
  bKashData,
  setBKashData,
  isSubmitting,
  paymentStatus,
  setPaymentStatus,
  setIsSubmitting,
  onPreviousStep,
  onConfirmation,
}) => {
  const { user, markSurveyAsCompleted, fetchSurveyData } = useAuth();
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  // Generate random transaction ID (6 digits only)
  const generateTransactionId = (): string => {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum.toString(); // Return as string without "TRX" prefix
  };

  // Calculate amount based on user role and bus type
  const calculateAmount = (): number => {
    if (formData.userRole === "Student") {
      return 500;
    } else if (formData.userRole === "Teacher") {
      return formData.acBus === "AC" ? 1000 : 500;
    }
    return 500;
  };

  // Get userName from auth - using user.username
  const getUserName = (): string => {
    return formData.userName || user?.username || "User";
  };

  // Update amount and ensure userName is populated when formData or user changes
  useEffect(() => {
    const calculatedAmount = calculateAmount();
    const userPhoneNumber = user?.phone_number || "";
    const userName = getUserName();

    setBKashData((prev) => ({
      ...prev,
      amount: calculatedAmount,
      phoneNumber: userPhoneNumber,
    }));

    console.log("User data from auth:", {
      username: user?.username,
      phone_number: user?.phone_number,
      userId: user?.uId,
    });
  }, [formData.userRole, formData.acBus, user, formData.userName]);

  const handleBKashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBKashData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  // Store payment information to payment API
  const storePaymentRecord = async (
    paymentData: any
  ): Promise<{ success: boolean; paymentId?: string; error?: string }> => {
    try {
      console.log("Storing payment record with data:", paymentData);

      const response = await fetch(
        "http://localhost:5000/api/v1/payment/post-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        return { success: true, paymentId: result.paymentId || result.id };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || "Failed to store payment",
        };
      }
    } catch (error) {
      console.error("Error storing payment:", error);
      return { success: false, error: "Network error while storing payment" };
    }
  };

  // Submit survey data to survey API
  const submitSurveyData = async (surveyData: SurveyData): Promise<boolean> => {
    try {
      console.log("Submitting survey data:", surveyData);

      const response = await fetch(
        "http://localhost:5000/api/v1/survey/post-Survey",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(surveyData),
        }
      );

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        console.error("Survey submission error:", errorData);
        return false;
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      return false;
    }
  };

  // Process successful payment
  const processSuccessfulPayment = async (
    transactionId: string,
    isDemo: boolean = false
  ) => {
    setIsSubmitting(true);
    setPaymentStatus("success");

    try {
      // Get the userName from auth - using user.username
      const userName = getUserName();

      // Prepare payment data according to your schema
      const paymentData = {
        userId: formData.userId,
        userName: userName, // This now uses user.username from auth
        paymentMethod: "bKash",
        amount: bKashData.amount,
        phoneNumber: bKashData.phoneNumber,
        transactionId: transactionId,
      };

      console.log("Posting payment data with userName:", paymentData);

      // Store payment record first
      const paymentStoreResult = await storePaymentRecord(paymentData);

      if (paymentStoreResult.success) {
        // If payment stored successfully, submit survey data
        const finalSurveyData: SurveyData = {
          ...formData,
          userName: userName, // Ensure userName is included here too
          payment: true,
          paymentId: paymentStoreResult.paymentId,
        };

        console.log("Final survey data with userName:", finalSurveyData);

        const surveySubmitted = await submitSurveyData(finalSurveyData);

        if (surveySubmitted) {
          // Update auth context so protected routes know survey is completed
          try {
            // Force-refresh server survey status to avoid cached GET showing stale result
            try {
              await fetchSurveyData(formData.userId, true);
            } catch (err) {
              console.warn("Failed to force-refresh survey data:", err);
            }

            // markSurveyAsCompleted is provided by AuthContext (destructured at top)
            markSurveyAsCompleted(finalSurveyData);
          } catch (err) {
            console.warn(
              "Could not mark survey as completed via context:",
              err
            );
          }

          setTimeout(() => {
            onConfirmation();
          }, 1500);
        } else {
          throw new Error("Failed to submit survey data");
        }
      } else {
        throw new Error(
          paymentStoreResult.error || "Failed to store payment record"
        );
      }
    } catch (error) {
      console.error("Error in payment process:", error);
      setPaymentStatus("failed");
      alert(
        `Error: ${
          error instanceof Error
            ? error.message
            : "Payment process failed. Please try again."
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize bKash payment
  const handleBkashPayment = async () => {
    if (!bKashData.phoneNumber) {
      alert("Please enter your bKash phone number first");
      return;
    }

    setIsInitializingPayment(true);
    setPaymentStatus("pending");

    try {
      // Generate a unique transaction ID for bKash payment (6 digits)
      const transactionId = generateTransactionId();

      const response = await fetch("http://localhost:5000/api/bkash/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: bKashData.amount.toString(),
          orderId: transactionId,
          phoneNumber: bKashData.phoneNumber,
        }),
      });

      const data = await response.json();

      if (data?.bkashURL) {
        setPaymentInitiated(true);
        // Store payment reference for verification later
        localStorage.setItem(
          "bkashPaymentReference",
          JSON.stringify({
            orderId: transactionId,
            amount: bKashData.amount,
            userId: formData.userId,
            timestamp: new Date().toISOString(),
          })
        );

        // Redirect to bKash
        window.location.href = data.bkashURL;
      } else {
        setPaymentStatus("failed");
        alert("Payment initiation failed. Please try again.");
      }
    } catch (err) {
      console.error("bKash payment error:", err);
      setPaymentStatus("failed");
      alert("Something went wrong while initiating payment.");
    } finally {
      setIsInitializingPayment(false);
    }
  };

  // Check for payment verification when component mounts
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const paymentRef = localStorage.getItem("bkashPaymentReference");

      if (paymentRef) {
        const { orderId, userId } = JSON.parse(paymentRef);

        // Only proceed if this is the same user
        if (userId === formData.userId) {
          try {
            const verifyResponse = await fetch(
              `http://localhost:5000/api/bkash/execute/${orderId}`
            );
            const verifyData = await verifyResponse.json();

            if (verifyData.transactionStatus === "Completed") {
              // Payment was successful, proceed with storing records
              await processSuccessfulPayment(verifyData.trxID || orderId);
              localStorage.removeItem("bkashPaymentReference");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
          }
        }
      }
    };

    checkPaymentStatus();
  }, [formData.userId]);

  const handleManualVerification = async () => {
    setIsSubmitting(true);
    setPaymentStatus("pending");

    if (!bKashData.transactionId) {
      alert("Please enter the bKash Transaction ID");
      setIsSubmitting(false);
      return;
    }

    try {
      // For manual verification, process with the provided transaction ID
      await processSuccessfulPayment(bKashData.transactionId);
    } catch (error) {
      console.error("Manual verification error:", error);
      setPaymentStatus("failed");
      alert("Payment verification failed. Please check the Transaction ID.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo payment function - FIXED: Set transaction ID in bKashData
  const handleDemoPayment = async () => {
    setIsSubmitting(true);
    setPaymentStatus("pending");

    try {
      // Generate demo transaction ID (6 digits only)
      const demoTransactionId = generateTransactionId();

      console.log("Demo Transaction ID:", demoTransactionId);

      // FIX: Set the transaction ID in bKashData so it's available for ConfirmationStep
      setBKashData((prev) => ({
        ...prev,
        transactionId: demoTransactionId,
      }));

      // Process as successful payment
      await processSuccessfulPayment(demoTransactionId, true);
    } catch (error) {
      console.error("Demo payment error:", error);
      setPaymentStatus("failed");
      alert("Demo payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-generate transaction ID for manual entry
  const generateManualTransactionId = () => {
    const newTransactionId = generateTransactionId();
    setBKashData((prev) => ({
      ...prev,
      transactionId: newTransactionId,
    }));
  };

  // Get pricing description
  const getPricingDescription = (): string => {
    if (formData.userRole === "Student") {
      return "Student fare: ৳500 (Fixed)";
    } else if (formData.userRole === "Teacher") {
      if (formData.acBus === "AC") {
        return "Teacher AC Bus fare: ৳1000";
      } else {
        return "Teacher Non-AC Bus fare: ৳500";
      }
    }
    return "Standard fare: ৳500";
  };

  return (
    <div className="space-y-6">
      {/* Debug info - you can remove this in production */}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Information
        </h3>
        <p className="text-blue-700 text-sm">
          Amount to pay: <strong>৳{bKashData.amount}</strong>
        </p>
        <p className="text-blue-600 text-xs mt-1">{getPricingDescription()}</p>
        {formData.userRole === "Teacher" && (
          <p className="text-blue-600 text-xs mt-1">
            Bus Type: <strong>{formData.acBus}</strong>
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label htmlFor="phoneNumber" className="text-sm font-semibold">
            bKash Phone Number
          </Label>
          <Input
            type="tel"
            placeholder="01XXXXXXXXX"
            name="phoneNumber"
            value={bKashData.phoneNumber}
            onChange={handleBKashChange}
            className="w-full"
            required
            pattern="01[3-9][0-9]{8}"
            title="Please enter a valid Bangladeshi phone number"
            disabled={isInitializingPayment || paymentInitiated}
          />
          {user?.phone_number ? (
            <p className="text-xs text-green-600">
              ✅ Phone number auto-filled from your profile
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Enter your bKash registered phone number
            </p>
          )}
        </div>

        {/* bKash Payment Button */}
        <Button
          onClick={handleBkashPayment}
          disabled={
            isInitializingPayment || !bKashData.phoneNumber || paymentInitiated
          }
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          size="lg"
        >
          {isInitializingPayment ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Initiating Payment...
            </div>
          ) : paymentInitiated ? (
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Redirecting to bKash...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Pay ৳{bKashData.amount} with bKash
            </div>
          )}
        </Button>

        {/* Demo Payment Button */}
        <div className="border border-dashed border-green-300 rounded-lg p-4 bg-green-50">
          <div className="text-center mb-3">
            <p className="text-green-800 text-sm font-medium mb-2">
              🚀 Demo Mode - Skip Payment Process
            </p>
            <Button
              onClick={handleDemoPayment}
              disabled={isSubmitting}
              variant="outline"
              className="bg-green-100 hover:bg-green-200 text-green-800 border-green-300 w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              {isSubmitting ? "Processing Demo Payment..." : "Use Demo Payment"}
            </Button>
          </div>
          <p className="text-green-700 text-xs text-center">
            This will generate a random Transaction ID and simulate a successful
            payment for testing purposes.
          </p>
        </div>

        {/* Manual Transaction ID Input (Fallback) */}
        <div className="border-t pt-4 mt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="transactionId" className="text-sm font-semibold">
                bKash Transaction ID (TrxID) - Manual Entry
              </Label>
              <Button
                type="button"
                onClick={generateManualTransactionId}
                variant="ghost"
                size="sm"
                className="text-xs h-8"
              >
                Generate ID
              </Button>
            </div>
            <Input
              type="text"
              placeholder="Enter 6-digit transaction ID or click 'Generate ID'"
              name="transactionId"
              value={bKashData.transactionId}
              onChange={handleBKashChange}
              className="w-full"
              minLength={6}
              maxLength={6}
              pattern="[0-9]{6}"
              title="Please enter a 6-digit transaction ID"
            />
            <p className="text-xs text-gray-500">
              Only use this if you've completed the payment but weren't
              automatically redirected back. Click "Generate ID" to create a
              random 6-digit Transaction ID.
            </p>
          </div>

          <Button
            onClick={handleManualVerification}
            disabled={
              isSubmitting ||
              !bKashData.transactionId ||
              bKashData.transactionId.length !== 6
            }
            variant="outline"
            className="w-full mt-2"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                Verifying Payment...
              </div>
            ) : (
              "Verify Payment Manually"
            )}
          </Button>
        </div>
      </div>

      {/* Payment Status */}
      {paymentStatus === "pending" &&
        (isInitializingPayment || isSubmitting) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
              <p className="text-yellow-700 text-sm">
                {isInitializingPayment
                  ? "Initiating payment..."
                  : "Processing payment and storing records..."}
              </p>
            </div>
          </div>
        )}

      {paymentStatus === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <p className="text-green-700 text-sm font-medium">
            Payment Successful! Storing records...
          </p>
        </div>
      )}

      {paymentStatus === "failed" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-700 text-sm">
            Payment failed. Please try again.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          onClick={onPreviousStep}
          variant="outline"
          className="flex-1"
          disabled={isInitializingPayment || isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* bKash Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
        <h4 className="font-semibold mb-2">How to pay with bKash:</h4>
        <ol className="list-decimal list-inside space-y-1 text-gray-600">
          <li>Click "Pay with bKash" button</li>
          <li>You will be redirected to bKash payment page</li>
          <li>Enter your bKash PIN to complete payment</li>
          <li>You will be automatically redirected back after payment</li>
          <li>If not redirected, manually enter the Transaction ID above</li>
        </ol>
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800 text-xs font-medium">
            💡 <strong>Note:</strong> Keep this tab open during payment. You
            will be automatically redirected back to complete the process.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
