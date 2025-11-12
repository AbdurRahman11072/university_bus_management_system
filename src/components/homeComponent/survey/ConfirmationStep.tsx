import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Printer } from "lucide-react";
import React, { useRef } from "react";
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
  const receiptRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debug effect to check transaction ID
  React.useEffect(() => {
    console.log("ConfirmationStep - bKashData:", bKashData);
    console.log("ConfirmationStep - transactionId:", bKashData.transactionId);
  }, [bKashData]);

  const handlePrint = () => {
    const printContent = receiptRef.current?.innerHTML;
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Survey Payment Receipt</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .receipt-container {
              max-width: 600px;
              margin: 0 auto;
              border: 2px solid #000;
              border-radius: 8px;
              padding: 20px;
              background: white;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #15803d;
              margin: 0 0 10px 0;
              font-size: 24px;
            }
            .header p {
              color: #666;
              margin: 5px 0;
            }
            .success-banner {
              background: #dcfce7;
              border: 1px solid #22c55e;
              border-radius: 8px;
              padding: 15px;
              text-align: center;
              margin-bottom: 20px;
            }
            .summary-section {
              margin-bottom: 20px;
            }
            .summary-section h3 {
              color: #15803d;
              border-bottom: 1px solid #ddd;
              padding-bottom: 8px;
              margin-bottom: 15px;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }
            .summary-item {
              margin-bottom: 8px;
            }
            .label {
              font-weight: bold;
              color: #555;
            }
            .value {
              color: #000;
            }
            .badge {
              display: inline-block;
              padding: 4px 8px;
              background: #22c55e;
              color: white;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 12px;
            }
            @media print {
              body { margin: 0; }
              .receipt-container { border: none; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <h1>Bus Service Survey - Payment Receipt</h1>
              <p>Transaction Date: ${currentDate}</p>
              <p>Transaction Time: ${currentTime}</p>
            </div>
            
            <div class="success-banner">
              <h2 style="color: #15803d; margin: 0 0 10px 0;">Survey Submitted Successfully!</h2>
              <p style="color: #15803d; margin: 0;">Thank you for completing the bus service survey. Your payment has been confirmed.</p>
            </div>

            <div class="summary-section">
              <h3>Survey Details</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="label">Destination:</span>
                  <div class="value">${formData.destination}</div>
                </div>
                <div class="summary-item">
                  <span class="label">Semester:</span>
                  <div class="value">${formData.userSemester}</div>
                </div>
                <div class="summary-item">
                  <span class="label">Class Time:</span>
                  <div class="value">${formData.classTime} - ${
      formData.classEndTime
    }</div>
                </div>
                <div class="summary-item">
                  <span class="label">Bus Type:</span>
                  <div class="value">${formData.acBus}</div>
                </div>
              </div>
            </div>

            <div class="summary-section">
              <h3>Payment Information</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="label">Payment Amount:</span>
                  <div class="value"><strong>${
                    bKashData.amount
                  } Taka</strong></div>
                </div>
                <div class="summary-item">
                  <span class="label">Phone Number:</span>
                  <div class="value">${
                    bKashData.phoneNumber || "Not provided"
                  }</div>
                </div>
                <div class="summary-item">
                  <span class="label">Payment Status:</span>
                  <div class="value"><span class="badge">Paid</span></div>
                </div>
                <div class="summary-item">
                  <span class="label">Transaction ID:</span>
                  <div class="value" style="font-family: monospace;">${
                    bKashData.transactionId || "Not available"
                  }</div>
                </div>
              </div>
            </div>

            <div class="footer">
              <p>This is an automated receipt. Please keep this for your records.</p>
              <p>Generated on ${currentDate} at ${currentTime}</p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
      // Optional: close window after printing
      // printWindow.close();
    }, 250);
  };

  return (
    <div className="text-center space-y-6">
      {/* Hidden receipt content for printing */}
      <div ref={receiptRef} style={{ display: "none" }}>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-900 mb-2">
            Survey Submitted Successfully!
          </h3>
          <p className="text-green-700">
            Thank you for completing the bus service survey. Your payment has
            been confirmed and records have been stored.
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
      </div>

      {/* Visible content */}
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

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => router.push("/")}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          Go Home
        </Button>
        <Button
          onClick={handlePrint}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print Receipt
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
