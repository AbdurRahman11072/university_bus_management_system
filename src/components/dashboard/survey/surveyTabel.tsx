"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SurveyData {
  _id: string;
  userId: string;
  department: string;
  userSemester: string;
  destination: string;
  classTime: string;
  submittedAt: string;
}

const semesterColors: Record<string, string> = {
  "1st": "bg-blue-100 text-blue-800 border-blue-200",
  "2nd": "bg-green-100 text-green-800 border-green-200",
  "3rd": "bg-purple-100 text-purple-800 border-purple-200",
  "4th": "bg-orange-100 text-orange-800 border-orange-200",
  "5th": "bg-pink-100 text-pink-800 border-pink-200",
  "6th": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "7th": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "8th": "bg-red-100 text-red-800 border-red-200",
};

const SurveyTable = () => {
  const [surveyData, setSurveyData] = useState<SurveyData[]>([]);
  const [filteredData, setFilteredData] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    semester: "",
    department: "",
    classTime: "",
    search: "",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchSurveyData();
  }, []);

  useEffect(() => {
    filterData();
  }, [surveyData, filters]);

  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching survey data from API...");

      const response = await fetch(
        "http://localhost:5000/api/v1/survey/get-all-Survey"
      );

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

  const filterData = () => {
    let filtered = surveyData;

    if (filters.semester) {
      filtered = filtered.filter((item) =>
        item.userSemester
          ?.toLowerCase()
          .includes(filters.semester.toLowerCase())
      );
    }

    if (filters.department) {
      filtered = filtered.filter((item) =>
        item.department
          ?.toLowerCase()
          .includes(filters.department.toLowerCase())
      );
    }

    if (filters.classTime) {
      filtered = filtered.filter((item) =>
        item.classTime?.toLowerCase().includes(filters.classTime.toLowerCase())
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.userId?.toLowerCase().includes(searchLower) ||
          item.destination?.toLowerCase().includes(searchLower) ||
          item.userSemester?.toLowerCase().includes(searchLower) ||
          item.department?.toLowerCase().includes(searchLower) ||
          item.classTime?.toLowerCase().includes(searchLower)
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
      classTime: "",
      search: "",
    });
  };

  const handleDeleteAllSurveys = async () => {
    setDeleteLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/survey/delete-Survey`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
        "Department",
        "Semester",
        "Destination",
        "Class Time",
        "Submitted Date",
      ];
      const csvData = filteredData.map((survey) => [
        survey.userId || "N/A",
        survey.department || "N/A",
        survey.userSemester || "N/A",
        survey.destination || "N/A",
        survey.classTime || "N/A",
        survey.submittedAt
          ? new Date(survey.submittedAt).toLocaleDateString()
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

  // Debug: Log current state
  useEffect(() => {
    console.log("Current surveyData:", surveyData);
    console.log("Current filteredData:", filteredData);
  }, [surveyData, filteredData]);

  if (loading) {
    return (
      <Card className="w-full max-w-6xl mx-auto my-6 border-border bg-card">
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
      <Card className="w-full max-w-6xl mx-auto my-6 border-border bg-card">
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
      <Card className="w-full max-w-6xl mx-auto my-6 border-border bg-card shadow-sm">
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
                Delete All Surveys
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
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search across all fields..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 border-border focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="semester-filter"
                  className="text-sm font-medium text-card-foreground flex items-center gap-2"
                >
                  <Building className="h-3 w-3" />
                  Semester
                </Label>
                <Input
                  id="semester-filter"
                  placeholder="Filter by semester"
                  value={filters.semester}
                  onChange={(e) =>
                    handleFilterChange("semester", e.target.value)
                  }
                  className="border-border"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="department-filter"
                  className="text-sm font-medium text-card-foreground flex items-center gap-2"
                >
                  <Building className="h-3 w-3" />
                  Department
                </Label>
                <Input
                  id="department-filter"
                  placeholder="Filter by department"
                  value={filters.department}
                  onChange={(e) =>
                    handleFilterChange("department", e.target.value)
                  }
                  className="border-border"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="time-filter"
                  className="text-sm font-medium text-card-foreground flex items-center gap-2"
                >
                  <Clock className="h-3 w-3" />
                  Class Time
                </Label>
                <Input
                  id="time-filter"
                  placeholder="Filter by time"
                  value={filters.classTime}
                  onChange={(e) =>
                    handleFilterChange("classTime", e.target.value)
                  }
                  className="border-border"
                />
              </div>
            </div>

            {(filters.semester ||
              filters.department ||
              filters.classTime ||
              filters.search) && (
              <div className="flex justify-end">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

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
            </div>
            {(filters.semester ||
              filters.department ||
              filters.classTime ||
              filters.search) && (
              <Badge variant="secondary" className="text-xs">
                Filters Active
              </Badge>
            )}
          </div>

          {/* Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        User ID
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3" />
                        Department
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      Semester
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        Destination
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        Class Time
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      Submitted
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
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium text-card-foreground text-sm">
                              {survey.userId || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-card-foreground">
                            {survey.department || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="secondary"
                            className={`${
                              semesterColors[survey.userSemester] ||
                              "bg-gray-100 text-gray-800 border-gray-200"
                            } border font-medium text-xs`}
                          >
                            {survey.userSemester || "N/A"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-card-foreground">
                              {survey.destination || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-card-foreground">
                              {survey.classTime || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs text-muted-foreground">
                            {survey.submittedAt
                              ? new Date(survey.submittedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
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
                        colSpan={6}
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
                              ? "Survey submissions will appear here when students complete the survey."
                              : "Try adjusting your search or filters."}
                          </p>
                          {(filters.semester ||
                            filters.department ||
                            filters.classTime ||
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
