import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import React from "react";
import { SurveyData } from "./surveyMain";
import { useRouter } from "next/navigation";

interface BKashData {
  phoneNumber?: string;
  transactionId: string;
  amount: number;
}

interface ConfirmationStepProps {
  formData: SurveyData;
  bKashData: BKashData;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  formData,
  bKashData,
}) => {
  // Debug: log the data to see what's available
  console.log("Confirmation Data:", { formData, bKashData });
  const router = useRouter();

  // Debug effect to check transaction ID
  React.useEffect(() => {
    console.log("ConfirmationStep - bKashData:", bKashData);
    console.log("ConfirmationStep - transactionId:", bKashData.transactionId);
  }, [bKashData]);

  return (
    <div className="text-center space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-green-900 mb-2">
          Survey Submitted Successfully!
        </h3>
        <p className="text-green-700">
          Thank you for completing the bus service survey. Your payment has been
          confirmed and records have been stored.
        </p>
      </div>

      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 text-left">
        <h4 className="font-semibold mb-3 text-accent">Survey Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium">Destination:</span>{" "}
            {formData.destination}
          </div>
          <div>
            <span className="font-medium">Semester:</span>{" "}
            {formData.userSemester}
          </div>
          <div>
            <span className="font-medium">Class Time:</span>{" "}
            {formData.classTime} - {formData.classEndTime}
          </div>
          <div>
            <span className="font-medium">Bus Type:</span> {formData.acBus}
          </div>
          <div>
            <span className="font-medium">Payment Amount:</span>{" "}
            {bKashData.amount} Taka
          </div>
          <div>
            <span className="font-medium">Phone Number:</span>{" "}
            {bKashData.phoneNumber || "Not provided"}
          </div>
          <div>
            <span className="font-medium">Payment Status:</span>
            <Badge variant="default" className="ml-2 bg-green-600">
              Paid
            </Badge>
          </div>
          <div>
            <span className="font-medium">Transaction ID:</span>{" "}
            {bKashData.transactionId || "Not available"}
          </div>
        </div>
      </div>

      <Button
        onClick={() => router.push("/auth/email-verification")}
        className="bg-primary hover:bg-primary/90 text-white"
      >
        Verify Email
      </Button>
    </div>
  );
};

export default ConfirmationStep;
