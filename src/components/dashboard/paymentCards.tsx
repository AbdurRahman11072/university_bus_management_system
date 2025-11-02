"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Download,
  CreditCard,
  User,
  Phone,
  Hash,
  Calendar,
  DollarSign,
  Building,
  X,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  _id: string;
  userId: string;
  userName: string;
  paymentMethod: string;
  amount: number;
  phoneNumber: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

export function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUserId, setFilterUserId] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:5000/api/v1/payment", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      // Handle different API response structures
      if (data.success) {
        setTransactions(data.data || []);
      } else if (Array.isArray(data)) {
        setTransactions(data);
      } else if (data.data && Array.isArray(data.data)) {
        setTransactions(data.data);
      } else {
        setTransactions([]);
        console.warn("Unexpected API response structure:", data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching transactions";
      setError(errorMessage);
      console.error("Error fetching transactions:", err);
      toast.error("Failed to load transactions", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionId
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.phoneNumber?.includes(searchTerm);

    const matchesUserId = filterUserId
      ? transaction.userId?.toLowerCase().includes(filterUserId.toLowerCase())
      : true;

    const matchesTeacher = filterTeacher
      ? transaction.userName
          ?.toLowerCase()
          .includes(filterTeacher.toLowerCase())
      : true;

    return matchesSearch && matchesUserId && matchesTeacher;
  });

  const getPaymentMethodColor = (method: string) => {
    if (!method) return "bg-gray-100 text-gray-800 border-gray-200";

    switch (method.toLowerCase()) {
      case "bkash":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "nagad":
        return "bg-green-100 text-green-800 border-green-200";
      case "rocket":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "card":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAmountColor = (amount: number) => {
    return amount >= 0 ? "text-green-600" : "text-red-600";
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      const headers = [
        "User ID",
        "Name",
        "Payment Method",
        "Amount",
        "Phone",
        "Transaction ID",
        "Date",
      ];
      const csvData = filteredTransactions.map((transaction) => [
        transaction.userId || "N/A",
        transaction.userName || "N/A",
        transaction.paymentMethod || "N/A",
        transaction.amount || 0,
        transaction.phoneNumber || "N/A",
        transaction.transactionId || "N/A",
        formatDate(transaction.createdAt),
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
        `transactions-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Transactions exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export transactions");
    }
  };

  const clearFilters = () => {
    setFilterUserId("");
    setFilterTeacher("");
    setSearchTerm("");
  };

  const hasActiveFilters = filterUserId || filterTeacher || searchTerm;

  // Debug: Log transactions to console
  useEffect(() => {
    if (transactions.length > 0) {
      console.log("Fetched transactions:", transactions);
    }
  }, [transactions]);

  if (loading) {
    return (
      <Card className="w-full border-border bg-card">
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground space-y-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Loading transactions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-border bg-card">
        <CardContent className="py-8">
          <div className="text-center text-destructive space-y-3">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <CreditCard className="h-6 w-6 text-destructive" />
            </div>
            <p className="font-medium">Error loading transactions</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {error}
            </p>
            <div className="flex gap-2 justify-center mt-4">
              <Button
                onClick={fetchTransactions}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button
                onClick={() => {
                  setError(null);
                  setLoading(false);
                }}
                variant="ghost"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-border bg-card shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-card-foreground">
                Payment Transactions
              </CardTitle>
              <CardDescription>
                {transactions.length} total transaction
                {transactions.length !== 1 ? "s" : ""}
                {hasActiveFilters &&
                  ` • ${filteredTransactions.length} filtered`}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              disabled={filteredTransactions.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTransactions}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {filteredTransactions.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Transactions
                    </p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {filteredTransactions.length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(
                        filteredTransactions.reduce(
                          (sum, t) => sum + (t.amount || 0),
                          0
                        )
                      )}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Payment Methods
                    </p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {
                        new Set(
                          filteredTransactions
                            .map((t) => t.paymentMethod)
                            .filter(Boolean)
                        ).size
                      }
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by User ID, Name, Transaction ID, or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-border focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-card-foreground">
                Advanced Filters
              </h4>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 gap-1 text-xs"
                >
                  <X className="h-3 w-3" />
                  Clear All
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Hash className="h-3 w-3" />
                  Filter by User ID
                </label>
                <Input
                  placeholder="Enter User ID..."
                  value={filterUserId}
                  onChange={(e) => setFilterUserId(e.target.value)}
                  className="border-border text-sm h-9"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <User className="h-3 w-3" />
                  Filter by Name
                </label>
                <Input
                  placeholder="Enter name..."
                  value={filterTeacher}
                  onChange={(e) => setFilterTeacher(e.target.value)}
                  className="border-border text-sm h-9"
                />
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="rounded-lg border border-border overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Payment Method
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Phone
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Transaction ID
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-muted-foreground"
                    >
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                          <CreditCard className="h-8 w-8" />
                        </div>
                        <p className="font-medium text-card-foreground">
                          {transactions.length === 0
                            ? "No transactions found"
                            : "No matching transactions found"}
                        </p>
                        <p className="text-sm">
                          {transactions.length === 0
                            ? "No payment transactions have been recorded yet."
                            : "Try adjusting your search or filters."}
                        </p>
                        {hasActiveFilters && (
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
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium text-sm text-card-foreground">
                              {transaction.userName || "N/A"}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {transaction.userId || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="secondary"
                          className={`${getPaymentMethodColor(
                            transaction.paymentMethod
                          )} border font-medium text-xs`}
                        >
                          {transaction.paymentMethod || "Unknown"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div
                          className={`flex items-center gap-1 font-semibold ${getAmountColor(
                            transaction.amount
                          )}`}
                        >
                          <DollarSign className="h-3 w-3" />
                          {formatCurrency(transaction.amount || 0)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-sm text-card-foreground">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {transaction.phoneNumber || "N/A"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Hash className="h-3 w-3 text-muted-foreground" />
                          <code className="text-xs font-mono bg-muted px-2 py-1 rounded border border-border max-w-[120px] truncate">
                            {transaction.transactionId || "N/A"}
                          </code>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(transaction.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
      </CardContent>
    </Card>
  );
}
