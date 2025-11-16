"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, Phone, User, FileText } from "lucide-react";

interface Driver {
  _id: string;
  uId: number;
  username: string;
  email: string;
  phone_number: string;
  bloodGroup: string;
  driverLicence: string;
  licenceExpire: string;
  avatar_url?: string;
  roles: string;
}

interface DriverTableProps {
  drivers: Driver[];
}

export default function DriverTable({ drivers }: DriverTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter drivers based on search term and status
  const filteredDrivers = useMemo(() => {
    let filtered = drivers;

    // Apply search filter
    if (searchTerm.trim()) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (driver) =>
          driver.username.toLowerCase().includes(lowercasedSearch) ||
          driver.phone_number.toLowerCase().includes(lowercasedSearch) ||
          driver.bloodGroup.toLowerCase().includes(lowercasedSearch) ||
          driver.driverLicence.toLowerCase().includes(lowercasedSearch) ||
          driver.email.toLowerCase().includes(lowercasedSearch) ||
          driver.uId.toString().includes(lowercasedSearch)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((driver) => {
        const status = getLicenceStatus(driver.licenceExpire);
        return status === statusFilter;
      });
    }

    return filtered;
  }, [drivers, searchTerm, statusFilter]);

  // Function to check if licence is near expiry (within 30 days)
  const isLicenceNearExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 30 && daysDiff >= 0;
  };

  // Function to check if licence is expired
  const isLicenceExpired = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  // Function to get licence status
  const getLicenceStatus = (
    expiryDate: string
  ): "valid" | "expiring" | "expired" => {
    if (isLicenceExpired(expiryDate)) {
      return "expired";
    } else if (isLicenceNearExpiry(expiryDate)) {
      return "expiring";
    } else {
      return "valid";
    }
  };

  // Function to get status class based on expiry date
  const getLicenceStatusClass = (expiryDate: string) => {
    const status = getLicenceStatus(expiryDate);
    switch (status) {
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      case "expiring":
        return "bg-red-100 text-yellow-800 border-red-200";
      case "valid":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Function to get status text based on expiry date
  const getLicenceStatusText = (expiryDate: string) => {
    if (isLicenceExpired(expiryDate)) {
      return "Expired";
    } else if (isLicenceNearExpiry(expiryDate)) {
      const today = new Date();
      const expiry = new Date(expiryDate);
      const timeDiff = expiry.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return `Expires in ${daysDiff} days`;
    } else {
      return "Valid";
    }
  };

  // Function to get overall status class
  const getOverallStatusClass = (expiryDate: string) => {
    const status = getLicenceStatus(expiryDate);
    switch (status) {
      case "expired":
        return "bg-red-100 text-red-800";
      case "expiring":
        return "bg-yellow-100 text-yellow-800";
      case "valid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get overall status text
  const getOverallStatusText = (expiryDate: string) => {
    const status = getLicenceStatus(expiryDate);
    switch (status) {
      case "expired":
        return "Inactive";
      case "expiring":
        return "Warning";
      case "valid":
        return "Active";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border shadow-sm">
      {/* Search and Filter Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          {/* Search Input */}
          <div className="w-full lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search drivers by name, phone, email, licence, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-background border-border focus:ring-2 focus:ring-primary/20"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Status</option>
                <option value="valid">Active</option>
                <option value="expiring">Expiring Soon</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Results Counter */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Showing {filteredDrivers.length} of {drivers.length} drivers
              </span>
            </div>
          </div>
        </div>

        {/* Search Tips */}
        {searchTerm && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Search tips:</strong> Search by driver name, phone number,
              email, driver ID, licence number, or blood group
            </p>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Driver
                </div>
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact
                </div>
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                Blood Group
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Licence No
                </div>
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Licence Expiry
                </div>
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((driver) => (
              <tr
                key={driver._id}
                className="border-b border-border hover:bg-muted/25 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={driver.avatar_url || "/default-avatar.png"}
                        alt={`${driver.username}'s profile`}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {driver.username}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ID: {driver.uId}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    <p className="text-foreground">{driver.phone_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {driver.email}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                    {driver.bloodGroup}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <p className="text-foreground font-mono text-sm">
                    {driver.driverLicence}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getLicenceStatusClass(
                        driver.licenceExpire
                      )}`}
                    >
                      {new Date(driver.licenceExpire).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {getLicenceStatusText(driver.licenceExpire)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getOverallStatusClass(
                      driver.licenceExpire
                    )}`}
                  >
                    {getOverallStatusText(driver.licenceExpire)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty States */}
      {filteredDrivers.length === 0 && drivers.length > 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground text-lg">
            No drivers match your search criteria
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {drivers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No drivers found</p>
          <p className="text-sm text-muted-foreground mt-1">
            There are no drivers in the system yet
          </p>
        </div>
      )}
    </div>
  );
}
