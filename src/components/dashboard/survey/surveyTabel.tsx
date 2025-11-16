"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Search,
  X,
  Trash2,
  RefreshCw,
  AlertTriangle,
  User,
  Building,
  Calendar,
  MapPin,
  Clock,
  Download,
  UserCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { API_BASE } from "@/lib/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ClassSchedule {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface SurveyData {
  _id: string;
  userId: string;
  userName: string;
  userRole: "Student" | "Teacher";
  userDepartment: string;
  userSemester: string;
  classSchedules: ClassSchedule[];
  destination: string;
  acBus: string;
  payment: boolean;
  createdAt: string;
  updatedAt: string;
}

const semesterColors: Record<string, string> = {
  "Semester 1": "bg-blue-100 text-blue-800 border-blue-200",
  "Semester 2": "bg-green-100 text-green-800 border-green-200",
  "Semester 3": "bg-purple-100 text-purple-800 border-purple-200",
  "Semester 4": "bg-orange-100 text-orange-800 border-orange-200",
  "Semester 5": "bg-pink-100 text-pink-800 border-pink-200",
  "Semester 6": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Semester 7": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "Semester 8": "bg-red-100 text-red-800 border-red-200",
};

const roleColors: Record<string, string> = {
  Student: "bg-blue-100 text-blue-800 border-blue-200",
  Teacher: "bg-green-100 text-green-800 border-green-200",
};

const dayColors: Record<string, string> = {
  Monday: "bg-blue-50 text-blue-700 border-blue-200",
  Tuesday: "bg-green-50 text-green-700 border-green-200",
  Wednesday: "bg-purple-50 text-purple-700 border-purple-200",
  Thursday: "bg-orange-50 text-orange-700 border-orange-200",
  Friday: "bg-red-50 text-red-700 border-red-200",
  Saturday: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Sunday: "bg-gray-50 text-gray-700 border-gray-200",
};

const SurveyTable = () => {
  const [surveyData, setSurveyData] = useState<SurveyData[]>([]);
  const [filteredData, setFilteredData] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    semester: "",
    department: "",
    role: "",
    day: "",
    startTime: "",
    endTime: "",
    search: "",
    destination: "",
    busType: "",
    paymentStatus: "",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Fetch survey data from API
  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching survey data from API...");

      const response = await fetch(`${API_BASE}/survey/get-all-Survey`);

      console.log("API Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Full API Response:", data);

      // Handle different response structures
      let surveys: SurveyData[] = [];

      if (Array.isArray(data)) {
        surveys = data;
      } else if (data.data && Array.isArray(data.data)) {
        surveys = data.data;
      } else if (data.surveys && Array.isArray(data.surveys)) {
        surveys = data.surveys;
      } else if (data.message && Array.isArray(data.message)) {
        surveys = data.message;
      } else {
        console.log("Available keys in response:", Object.keys(data));
        // Try to find any array in the response
        const arrayKeys = Object.keys(data).filter((key) =>
          Array.isArray(data[key])
        );
        if (arrayKeys.length > 0) {
          surveys = data[arrayKeys[0]];
          console.log(`Using array from key: ${arrayKeys[0]}`);
        } else {
          throw new Error("No array found in API response");
        }
      }

      console.log("Processed surveys:", surveys);
      setSurveyData(surveys);
    } catch (error) {
      console.error("Error fetching survey data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      toast.error("Failed to load survey data", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyData();
  }, []);

  useEffect(() => {
    filterData();
  }, [surveyData, filters]);

  // Calculate active filter count
  useEffect(() => {
    const count = Object.values(filters).filter(
      (value) => value !== "" && value !== "all"
    ).length;
    setActiveFilterCount(count);
  }, [filters]);

  // Helper function to convert time to minutes for comparison
  const timeToMinutes = (time: string): number => {
    if (!time) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Helper function to check if time range matches filter
  const matchesTimeFilter = (
    startTime: string,
    endTime: string,
    filterTime: string,
    filterType: "start" | "end"
  ): boolean => {
    if (!filterTime) return true;

    const filterMinutes = timeToMinutes(filterTime);
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (filterType === "start") {
      // For start time filter: show classes that start at or after this time
      return startMinutes >= filterMinutes;
    } else {
      // For end time filter: show classes that end at or before this time
      return endMinutes <= filterMinutes;
    }
  };

  const filterData = () => {
    let filtered = surveyData;

    if (filters.semester && filters.semester !== "all") {
      filtered = filtered.filter((item) =>
        item.userSemester
          ?.toLowerCase()
          .includes(filters.semester.toLowerCase())
      );
    }

    if (filters.department && filters.department !== "all") {
      filtered = filtered.filter((item) =>
        item.userDepartment
          ?.toLowerCase()
          .includes(filters.department.toLowerCase())
      );
    }

    if (filters.role && filters.role !== "all") {
      filtered = filtered.filter((item) =>
        item.userRole?.toLowerCase().includes(filters.role.toLowerCase())
      );
    }

    if (filters.day && filters.day !== "all") {
      filtered = filtered.filter((item) =>
        item.classSchedules?.some((schedule) =>
          schedule.day?.toLowerCase().includes(filters.day.toLowerCase())
        )
      );
    }

    if (filters.destination && filters.destination !== "all") {
      filtered = filtered.filter((item) =>
        item.destination
          ?.toLowerCase()
          .includes(filters.destination.toLowerCase())
      );
    }

    if (filters.busType && filters.busType !== "all") {
      filtered = filtered.filter((item) =>
        item.acBus?.toLowerCase().includes(filters.busType.toLowerCase())
      );
    }

    if (filters.paymentStatus && filters.paymentStatus !== "all") {
      const paymentBool = filters.paymentStatus === "paid";
      filtered = filtered.filter((item) => item.payment === paymentBool);
    }

    if (filters.startTime) {
      filtered = filtered.filter((item) =>
        item.classSchedules?.some((schedule) =>
          matchesTimeFilter(
            schedule.startTime,
            schedule.endTime,
            filters.startTime,
            "start"
          )
        )
      );
    }

    if (filters.endTime) {
      filtered = filtered.filter((item) =>
        item.classSchedules?.some((schedule) =>
          matchesTimeFilter(
            schedule.startTime,
            schedule.endTime,
            filters.endTime,
            "end"
          )
        )
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.userId?.toLowerCase().includes(searchLower) ||
          item.userName?.toLowerCase().includes(searchLower) ||
          item.userDepartment?.toLowerCase().includes(searchLower) ||
          item.userSemester?.toLowerCase().includes(searchLower) ||
          item.destination?.toLowerCase().includes(searchLower) ||
          item.acBus?.toLowerCase().includes(searchLower) ||
          item.classSchedules?.some(
            (schedule) =>
              schedule.day?.toLowerCase().includes(searchLower) ||
              schedule.startTime?.toLowerCase().includes(searchLower) ||
              schedule.endTime?.toLowerCase().includes(searchLower)
          )
      );
    }

    setFilteredData(filtered);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      semester: "",
      department: "",
      role: "",
      day: "",
      startTime: "",
      endTime: "",
      search: "",
      destination: "",
      busType: "",
      paymentStatus: "",
    });
    setFiltersExpanded(false);
  };

  const clearSingleFilter = (filterKey: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: "",
    }));
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (key: keyof SurveyData) => {
    const values = surveyData
      .map((item) => item[key])
      .filter(
        (value): value is string => typeof value === "string" && value !== ""
      );
    return Array.from(new Set(values)).sort();
  };

  const getUniqueDays = () => {
    const allDays = surveyData.flatMap(
      (item) => item.classSchedules?.map((schedule) => schedule.day) || []
    );
    return Array.from(new Set(allDays)).sort();
  };

  const getUniqueDestinations = () => {
    return getUniqueValues("destination");
  };

  const getUniqueBusTypes = () => {
    return getUniqueValues("acBus");
  };

  // Get unique time slots from actual table data
  const getUniqueStartTimes = () => {
    const allStartTimes = surveyData.flatMap(
      (item) => item.classSchedules?.map((schedule) => schedule.startTime) || []
    );
    const uniqueTimes = Array.from(new Set(allStartTimes)).sort((a, b) => {
      return timeToMinutes(a) - timeToMinutes(b);
    });
    return uniqueTimes;
  };

  const getUniqueEndTimes = () => {
    const allEndTimes = surveyData.flatMap(
      (item) => item.classSchedules?.map((schedule) => schedule.endTime) || []
    );
    const uniqueTimes = Array.from(new Set(allEndTimes)).sort((a, b) => {
      return timeToMinutes(a) - timeToMinutes(b);
    });
    return uniqueTimes;
  };

  // Format time for display in 12-hour format
  const formatTimeForDisplay = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const handleDeleteAllSurveys = async () => {
    setDeleteLoading(true);
    try {
      const response = await fetch(`${API_BASE}/survey/delete-Survey`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete surveys: ${response.status}`);
      }

      const result = await response.json();
      console.log("Delete response:", result);

      toast.success("Surveys deleted successfully", {
        description: `All surveys have been permanently removed.`,
      });

      // Refresh the data
      fetchSurveyData();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting surveys:", error);
      toast.error("Failed to delete surveys", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      const headers = [
        "User ID",
        "User Name",
        "Role",
        "Department",
        "Semester",
        "Destination",
        "Bus Type",
        "Payment Status",
        "Class Schedules",
        "Submitted Date",
      ];

      const csvData = filteredData.map((survey) => [
        survey.userId || "N/A",
        survey.userName || "N/A",
        survey.userRole || "N/A",
        survey.userDepartment || "N/A",
        survey.userSemester || "N/A",
        survey.destination || "N/A",
        survey.acBus || "N/A",
        survey.payment ? "Paid" : "Unpaid",
        survey.classSchedules
          ?.map(
            (schedule) =>
              `${schedule.day} (${schedule.startTime}-${schedule.endTime})`
          )
          .join("; ") || "N/A",
        survey.createdAt
          ? new Date(survey.createdAt).toLocaleDateString()
          : "N/A",
      ]);

      const csvContent = [
        headers.join(","),
        ...csvData.map((row) => row.map((field) => `"${field}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `survey-data-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Survey data exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  // Filter badges component
  const FilterBadges = () => {
    const activeFilters = Object.entries(filters).filter(
      ([key, value]) => value && value !== "all" && key !== "search"
    );

    if (activeFilters.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {activeFilters.map(([key, value]) => (
          <Badge
            key={key}
            variant="secondary"
            className="flex items-center gap-1 py-1 text-xs"
          >
            <span className="capitalize">
              {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
            </span>
            <span className="font-medium">
              {key === "startTime" || key === "endTime"
                ? formatTimeForDisplay(value)
                : value}
            </span>
            <button
              onClick={() => clearSingleFilter(key as keyof typeof filters)}
              className="ml-1 hover:bg-muted rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
        >
          Clear all
        </Button>
      </div>
    );
  };

  // Enhanced Time Filter Component
  const TimeFilterSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-3 w-3" />
          Class Start Time
        </Label>
        <Select
          value={filters.startTime}
          onValueChange={(value) => handleFilterChange("startTime", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All start times" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Start Times</SelectItem>
            {getUniqueStartTimes().map((time) => (
              <SelectItem key={time} value={time}>
                {formatTimeForDisplay(time)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Shows classes starting from this time
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-3 w-3" />
          Class End Time
        </Label>
        <Select
          value={filters.endTime}
          onValueChange={(value) => handleFilterChange("endTime", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All end times" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All End Times</SelectItem>
            {getUniqueEndTimes().map((time) => (
              <SelectItem key={time} value={time}>
                {formatTimeForDisplay(time)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Shows classes ending by this time
        </p>
      </div>
    </div>
  );

  // Enhanced filter section JSX
  const EnhancedFilterSection = () => (
    <div className="space-y-4 mb-6">
      {/* Main Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search across all fields (name, ID, department, schedules, etc.)..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-10 border-border focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Quick Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Quick Filters:</span>
        </div>

        <Select
          value={filters.role}
          onValueChange={(value) => handleFilterChange("role", value)}
        >
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Student">Student</SelectItem>
            <SelectItem value="Teacher">Teacher</SelectItem>
          </SelectContent>
        </Select>

        {/* <Select
          value={filters.paymentStatus}
          onValueChange={(value) => handleFilterChange("paymentStatus", value)}
        >
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select> */}

        <Collapsible
          open={filtersExpanded}
          onOpenChange={setFiltersExpanded}
          className="w-full"
        >
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Advanced Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
                {filtersExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <CollapsibleContent className="mt-4 space-y-4">
            {/* Advanced Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Semester Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Building className="h-3 w-3" />
                  Semester
                </Label>
                <Select
                  value={filters.semester}
                  onValueChange={(value) =>
                    handleFilterChange("semester", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Semesters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {getUniqueValues("userSemester").map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Department Filter */}
              {/* <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Building className="h-3 w-3" />
                  Department
                </Label>
                <Select
                  value={filters.department}
                  onValueChange={(value) =>
                    handleFilterChange("department", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {getUniqueValues("userDepartment").map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              {/* Day Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Class Day
                </Label>
                <Select
                  value={filters.day}
                  onValueChange={(value) => handleFilterChange("day", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Days</SelectItem>
                    {getUniqueDays().map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Destination Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  Destination
                </Label>
                <Select
                  value={filters.destination}
                  onValueChange={(value) =>
                    handleFilterChange("destination", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Destinations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Destinations</SelectItem>
                    {getUniqueDestinations().map((destination) => (
                      <SelectItem key={destination} value={destination}>
                        {destination}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bus Type Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  Bus Type
                </Label>
                <Select
                  value={filters.busType}
                  onValueChange={(value) =>
                    handleFilterChange("busType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Bus Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bus Types</SelectItem>
                    {getUniqueBusTypes().map((busType) => (
                      <SelectItem key={busType} value={busType}>
                        {busType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Time Filters */}
            <TimeFilterSection />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Active Filter Badges */}
      <FilterBadges />
    </div>
  );

  if (loading) {
    return (
      <Card className="w-full max-w-7xl mx-auto my-6 border-border bg-card">
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground space-y-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Loading survey data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-7xl mx-auto my-6 border-border bg-card">
        <CardContent className="py-8">
          <div className="text-center text-destructive space-y-3">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <p className="font-medium">Error loading survey data</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {error}
            </p>
            <Button
              onClick={fetchSurveyData}
              variant="outline"
              className="mt-2 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-7xl mx-auto my-6 border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-card-foreground">
                  Survey Results
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {surveyData.length} total survey
                  {surveyData.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={exportToCSV}
                disabled={filteredData.length === 0}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive"
                size="sm"
                className="gap-2"
                disabled={surveyData.length === 0}
              >
                <Trash2 className="h-4 w-4" />
                Delete All
              </Button>
              <Button
                onClick={fetchSurveyData}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Enhanced Filter Section */}
          <EnhancedFilterSection />

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-card-foreground">
                {filteredData.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-card-foreground">
                {surveyData.length}
              </span>{" "}
              records
              {activeFilterCount > 0 && (
                <span className="ml-2 text-xs text-blue-600">
                  ({activeFilterCount} filter
                  {activeFilterCount !== 1 ? "s" : ""} active)
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2 h-8"
                >
                  <X className="h-3 w-3" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      User Details
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      Academic Info
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      Class Schedule
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      Bus Details
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      Submitted Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredData.length > 0 ? (
                    filteredData.map((survey, index) => (
                      <tr
                        key={survey._id || index}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium text-card-foreground text-sm">
                                {survey.userName || "N/A"}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ID: {survey.userId || "N/A"}
                            </div>
                            <Badge
                              variant="secondary"
                              className={`${
                                roleColors[survey.userRole] ||
                                "bg-gray-100 text-gray-800 border-gray-200"
                              } border font-medium text-xs`}
                            >
                              {survey.userRole || "N/A"}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="text-card-foreground font-medium">
                              {survey.userDepartment || "N/A"}
                            </div>
                            <Badge
                              variant="secondary"
                              className={`${
                                semesterColors[survey.userSemester] ||
                                "bg-gray-100 text-gray-800 border-gray-200"
                              } border font-medium text-xs`}
                            >
                              {survey.userSemester || "N/A"}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1 max-w-xs">
                            {survey.classSchedules?.length > 0 ? (
                              survey.classSchedules.map((schedule, idx) => (
                                <div
                                  key={schedule.id || idx}
                                  className="flex items-center gap-2 text-xs"
                                >
                                  <Badge
                                    variant="outline"
                                    className={`${
                                      dayColors[schedule.day] ||
                                      "bg-gray-50 text-gray-700 border-gray-200"
                                    } border font-medium`}
                                  >
                                    {schedule.day?.substring(0, 3)}
                                  </Badge>
                                  <span className="text-card-foreground">
                                    {formatTimeForDisplay(schedule.startTime)} -{" "}
                                    {formatTimeForDisplay(schedule.endTime)}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                No schedules
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-card-foreground font-medium">
                                {survey.destination || "N/A"}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {survey.acBus || "N/A"}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs text-muted-foreground">
                            {survey.createdAt
                              ? new Date(survey.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "N/A"}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-12 text-center text-muted-foreground"
                      >
                        <div className="space-y-3">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                            <Calendar className="h-8 w-8" />
                          </div>
                          <p className="font-medium text-card-foreground">
                            {surveyData.length === 0
                              ? "No survey data available"
                              : "No matching surveys found"}
                          </p>
                          <p className="text-sm">
                            {surveyData.length === 0
                              ? "Survey submissions will appear here when users complete the survey."
                              : "Try adjusting your search or filters."}
                          </p>
                          {(filters.semester ||
                            filters.department ||
                            filters.role ||
                            filters.day ||
                            filters.startTime ||
                            filters.endTime ||
                            filters.search) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={clearFilters}
                              className="mt-2"
                            >
                              Clear Filters
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 fade-in"
            onClick={() => setShowDeleteDialog(false)}
          />
          <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
            <Card className="border-border bg-card shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-card-foreground">
                      Delete All Surveys
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-destructive text-sm mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">
                      Warning: Permanent Deletion
                    </span>
                  </div>
                  <p className="text-sm text-destructive">
                    If you click OK, all{" "}
                    <strong>{surveyData.length} surveys</strong> will be
                    permanently removed from the database. This action cannot be
                    undone.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(false)}
                    className="flex-1"
                    disabled={deleteLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAllSurveys}
                    disabled={deleteLoading}
                    className="flex-1 gap-2"
                  >
                    {deleteLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete All Surveys
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
};

export default SurveyTable;
