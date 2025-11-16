"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import axiosInstance from "@/hooks/axiosInstance";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface MaintenanceData {
  busId: string;
  totalBusCount: number;
  lastCreatedData: {
    createdAt: string;
  };
}

interface ConditionSummary {
  total: number;
  good: number;
  poor: number;
  critical: number;
}

export function MaintenancePage() {
  const { user } = useAuth();
  const router = useRouter();
  if (user?.roles != "Admin") {
    router.push("/auth/login");
  }

  const [maintenance, setMaintenance] = useState<MaintenanceData[]>([]);
  const [filteredMaintenance, setFilteredMaintenance] = useState<
    MaintenanceData[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [repairsFilter, setRepairsFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("busId");
  const [sortOrder, setSortOrder] = useState("asc");

  // Condition summary state
  const [conditionSummary, setConditionSummary] = useState<ConditionSummary>({
    total: 0,
    good: 0,
    poor: 0,
    critical: 0,
  });

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortData();
    calculateConditionSummary();
  }, [
    maintenance,
    searchTerm,
    conditionFilter,
    repairsFilter,
    dateFilter,
    sortBy,
    sortOrder,
  ]);

  const calculateConditionSummary = () => {
    if (maintenance.length === 0) return;

    const summary = {
      total: maintenance.length,
      good: 0,
      poor: 0,
      critical: 0,
    };

    maintenance.forEach((bus) => {
      const condition = getBusCondition(bus);

      switch (condition) {
        case "Good":
          summary.good++;
          break;
        case "Poor":
          summary.poor++;
          break;
        case "Critical":
          summary.critical++;
          break;
      }
    });

    setConditionSummary(summary);
  };

  const getBusCondition = (bus: MaintenanceData): string => {
    const repairs = bus.totalBusCount;
    const lastServiceDate = new Date(bus.lastCreatedData.createdAt);
    const daysSinceService =
      (Date.now() - lastServiceDate.getTime()) / (1000 * 60 * 60 * 24);

    if (repairs === 5 && daysSinceService < 30) return "poor";
    if (repairs >= 7 && daysSinceService < 60) return "Critical";
    return "Good";
  };

  const getConditionColor = (condition: string): string => {
    switch (condition) {
      case "Good":
        return "bg-green-100 text-green-800 border-green-200";
      case "Poor":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filterAndSortData = () => {
    let filtered = [...maintenance];

    // Search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((bus) =>
        bus.busId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Condition filter
    if (conditionFilter !== "all") {
      filtered = filtered.filter(
        (bus) => getBusCondition(bus) === conditionFilter
      );
    }

    // Repairs filter
    if (repairsFilter !== "all") {
      switch (repairsFilter) {
        case "none":
          filtered = filtered.filter((bus) => bus.totalBusCount === 0);
          break;
        case "low":
          filtered = filtered.filter(
            (bus) => bus.totalBusCount >= 1 && bus.totalBusCount <= 2
          );
          break;
        case "medium":
          filtered = filtered.filter(
            (bus) => bus.totalBusCount >= 3 && bus.totalBusCount <= 5
          );
          break;
        case "high":
          filtered = filtered.filter((bus) => bus.totalBusCount > 5);
          break;
      }
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter((bus) => {
        const lastService = new Date(bus.lastCreatedData.createdAt);
        const daysSinceService =
          (now.getTime() - lastService.getTime()) / (1000 * 60 * 60 * 24);

        switch (dateFilter) {
          case "today":
            return daysSinceService < 1;
          case "week":
            return daysSinceService < 7;
          case "month":
            return daysSinceService < 30;
          case "overdue":
            return daysSinceService > 30;
          default:
            return true;
        }
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "busId":
          aValue = a.busId;
          bValue = b.busId;
          break;
        case "repairs":
          aValue = a.totalBusCount;
          bValue = b.totalBusCount;
          break;
        case "lastService":
          aValue = new Date(a.lastCreatedData.createdAt);
          bValue = new Date(b.lastCreatedData.createdAt);
          break;
        case "condition":
          aValue = getBusCondition(a);
          bValue = getBusCondition(b);
          break;
        default:
          aValue = a.busId;
          bValue = b.busId;
      }

      if (typeof aValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (aValue instanceof Date) {
        return sortOrder === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      } else {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
    });

    setFilteredMaintenance(filtered);
  };

  const fetchData = async () => {
    try {
      const result = await axiosInstance.get(
        `maintenance/total-maintenance-info`
      );
      setMaintenance(result.data.data);
      console.log(result.data.data);
    } catch (error) {
      console.error("Error fetching maintenance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setConditionFilter("all");
    setRepairsFilter("all");
    setDateFilter("all");
    setSortBy("busId");
    setSortOrder("asc");
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Maintenance Tracking
          </h1>
          <p className="text-muted-foreground mt-1">
            Track bus repairs and maintenance
          </p>
        </div>

        {/* Condition Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-2">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-foreground">
                {conditionSummary.total}
              </div>
              <div className="text-sm text-muted-foreground">Total Buses</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-green-200">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {conditionSummary.good}
              </div>
              <div className="text-sm text-muted-foreground">Good</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-yellow-200">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {conditionSummary.poor}
              </div>
              <div className="text-sm text-muted-foreground">Poor</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-red-200">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-red-600">
                {conditionSummary.critical}
              </div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Filters & Sorting
              </h2>
              <button
                onClick={clearAllFilters}
                className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted/50"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Search Bus ID
                </label>
                <input
                  type="text"
                  placeholder="Enter Bus ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Condition Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Condition
                </label>
                <select
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Conditions</option>
                  <option value="Good">Good</option>
                  <option value="Poor">Poor</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Repairs Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Repairs Count
                </label>
                <select
                  value={repairsFilter}
                  onChange={(e) => setRepairsFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All</option>
                  <option value="none">No Repairs</option>
                  <option value="low">Low (1-2)</option>
                  <option value="medium">Medium (3-5)</option>
                  <option value="high">High (5+)</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Last Service
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">Any Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="overdue">Overdue (&gt;30 days)</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sort By
                </label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="busId">Bus ID</option>
                    <option value="repairs">Repairs</option>
                    <option value="lastService">Last Service</option>
                    <option value="condition">Condition</option>
                  </select>
                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="px-3 py-2 border border-border rounded-md hover:bg-muted/50"
                    title={sortOrder === "asc" ? "Ascending" : "Descending"}
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Showing {filteredMaintenance.length} of {maintenance.length}{" "}
                buses
              </span>
              {searchTerm ||
              conditionFilter !== "all" ||
              repairsFilter !== "all" ||
              dateFilter !== "all" ? (
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                  Filters Active
                </span>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">Loading maintenance data...</p>
          </div>
        ) : (
          <>
            {/* Table View */}
            <Card className="bg-white">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Bus ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Repairs (Month)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Last Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Service Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Condition
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredMaintenance.length > 0 ? (
                        filteredMaintenance.map((bus) => {
                          const condition = getBusCondition(bus);
                          return (
                            <tr key={bus.busId} className="hover:bg-muted/25">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-semibold text-foreground">
                                  {bus.busId}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-foreground font-medium">
                                  {bus.totalBusCount}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className="text-foreground"
                                  title={formatDate(
                                    bus.lastCreatedData.createdAt
                                  )}
                                >
                                  {formatTimeAgo(bus.lastCreatedData.createdAt)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-muted-foreground text-sm">
                                  {formatDate(bus.lastCreatedData.createdAt)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getConditionColor(
                                    condition
                                  )}`}
                                >
                                  {condition}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center">
                            <div className="text-muted-foreground">
                              {searchTerm ||
                              conditionFilter !== "all" ||
                              repairsFilter !== "all" ||
                              dateFilter !== "all" ? (
                                <div>
                                  <p>No buses found matching your filters</p>
                                  <button
                                    onClick={clearAllFilters}
                                    className="text-primary hover:underline mt-2"
                                  >
                                    Clear all filters
                                  </button>
                                </div>
                              ) : (
                                "No maintenance data available"
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
