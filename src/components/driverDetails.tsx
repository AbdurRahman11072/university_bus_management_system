import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import Image from "next/image";
import { Phone, Loader2 } from "lucide-react";
import axiosInstance from "@/hooks/axiosInstance";

interface DriverData {
  _id: string;
  username: string;
  phone_number: string;
  bloodGroup: string;
  driverLicence: string;
  licenceExpire: string;
  avatar_url?: string;
  email?: string;
}

const DriverDetails = ({ id }: { id: string }) => {
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchDriverDetails = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/user/get-user/${id}`);
      setDriverData(response.data.data);
      console.log(response.data.data);
    } catch (err: any) {
      console.error("Error fetching driver details:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch driver details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDialogOpen && id) {
      fetchDriverDetails();
    }
  }, [isDialogOpen, id]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Reset states when dialog closes
      setDriverData(null);
      setError(null);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="w-[100%] bg-transparent gap-2"
        >
          <Phone className="w-4 h-4 mr-2 " />
          Contact Driver
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2">Loading driver details...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Unable to Load
            </h3>
            <p className="text-red-600 text-sm">{error}</p>
            <Button
              onClick={fetchDriverDetails}
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        ) : driverData ? (
          <>
            <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 border-primary/20">
              <Image
                src={`${driverData.avatar_url}`}
                alt={driverData.username}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 pb-4 border-b border-border w-full">
              <p className="text-sm font-semibold text-foreground">
                Driver Name:
              </p>
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                <p className="text-xs font-bold text-black">
                  {driverData.username}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-6">
              <div className="space-y-3 pb-4 border-b border-border w-[47%]">
                <p className="text-sm font-semibold text-foreground">
                  Phone Number:
                </p>
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                  <p className="text-xs font-bold text-black">
                    {driverData.phone_number}
                  </p>
                </div>
              </div>
              <div className="space-y-3 pb-4 border-b border-border w-[47%]">
                <p className="text-sm font-semibold text-foreground">
                  Blood Group:
                </p>
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                  <p className="text-xs font-bold text-black">
                    {driverData.bloodGroup}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-6">
              <div className="space-y-3 pb-4 border-b border-border w-[47%]">
                <p className="text-sm font-semibold text-foreground">
                  Driving Licence No:
                </p>
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                  <p className="text-xs font-bold text-black">
                    {driverData.driverLicence}
                  </p>
                </div>
              </div>
              <div className="space-y-3 pb-4 border-b border-border w-[47%]">
                <p className="text-sm font-semibold text-foreground">
                  Licence Expire:
                </p>
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                  <p className="text-xs font-bold text-black">
                    {formatDate(driverData.licenceExpire)}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional details if available */}
            {driverData.email && (
              <div className="space-y-3 pb-4 border-b border-border w-full">
                <p className="text-sm font-semibold text-foreground">Email:</p>
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                  <p className="text-xs font-bold text-black">
                    {driverData.email}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No driver data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DriverDetails;
